import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Create,
  Toolbar,
  SimpleForm,
  useTranslate,
  useDataProvider,
  useRedirect,
  useNotify,
} from "react-admin";
import { useFormState } from "react-final-form";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import CircularProgress from "@material-ui/core/CircularProgress";

import { makeStyles } from "@material-ui/core";

import CreateStep1Form from "./ProjectForms/CreateStep1Form";
import SummaryForm from "./ProjectForms/SummaryForm";
import ResponsibleOfficerForm from "./ProjectForms/ResponsibleOfficerForm";
import BackgroundForm from "./ProjectForms/BackgroundForm";
import ResultMatrix from "../../modules/Project/ResultMatrix";
import AdditionalInfoForm from "../../modules/Project/AdditionalInformation";

import { PROJECT_STEPS } from "../../../constants/common";

// Redirect to edit so the user can keep saving project information; prefer project-details so Summary (implementing_agencies, locations) saves correctly
const createRedirect = (basePath, id, data) => {
  const detailId = data?.current_project_detail?.id;
  if (detailId) return `/project-details/${detailId}/edit`;
  return `/projects/${data?.id}/edit`;
};

const useStyles = makeStyles((theme) => ({
  button: {
    margin: "0 5px",
  },
  stepContent: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

const CREATE_STEP_LABELS = [
  PROJECT_STEPS.SUMMARY,
  PROJECT_STEPS.RESPONSIBLE_OFFICER,
  PROJECT_STEPS.PROJECT_BACKGROUND,
  PROJECT_STEPS.RESULT_MATRIX,
  PROJECT_STEPS.ADDITIONAL_INFO,
];

const ProjectToolbarButtons = ({
  onSaveExit,
  onSave,
  onBack,
  onNext,
  createLabel,
  nextLabel,
  activeStep,
  isLastStep,
  previousLabel,
  saveExitLabel,
  classes,
}) => (
  <>
    {activeStep > 0 && (
      <Button onClick={onBack} className={classes?.button}>
        {previousLabel}
      </Button>
    )}
    <Button onClick={onSaveExit} className={classes?.button}>
      {saveExitLabel}
    </Button>
    {!isLastStep ? (
      <Button color="primary" variant="contained" onClick={onNext}>
        {nextLabel}
      </Button>
    ) : (
      <Button color="primary" variant="contained" onClick={onSave}>
        {createLabel}
      </Button>
    )}
  </>
);

const ProjectToolbar = ({
  history,
  redirect,
  handleSubmitWithRedirect,
  activeStep,
  setActiveStep,
  ...props
}) => {
  const translate = useTranslate();
  const classes = useStyles();
  const isLastStep = activeStep === CREATE_STEP_LABELS.length - 1;

  const handleSave = () => {
    handleSubmitWithRedirect(redirect);
  };

  const handleSaveExit = () => {
    handleSubmitWithRedirect("/projects");
  };

  const handleBack = () => {
    setActiveStep((s) => Math.max(0, s - 1));
  };

  const handleNext = () => {
    setActiveStep((s) => Math.min(CREATE_STEP_LABELS.length - 1, s + 1));
  };

  return (
    <Toolbar>
      <ProjectToolbarButtons
        onSaveExit={handleSaveExit}
        onSave={handleSave}
        onBack={handleBack}
        onNext={handleNext}
        createLabel={translate("buttons.create")}
        nextLabel={translate("buttons.next", { _: "Next" })}
        previousLabel={translate("buttons.previous", { _: "Previous" })}
        saveExitLabel={translate("buttons.save_exit")}
        activeStep={activeStep}
        isLastStep={isLastStep}
        classes={classes}
      />
    </Toolbar>
  );
};

function CreateProjectTemplate({
  activeStep,
  setActiveStep,
  matrixStep,
  setMatrixStep,
  templateStarted,
  onStartTemplate,
  ...props
}) {
  const { values } = useFormState();
  const translate = useTranslate();
  const classes = useStyles();

  const createProps = {
    ...props,
    record: values || {},
    save: () => {},
    isNewProject: true,
  };

  // Stage 1: Only the 7 fields + "Create Project" button (saves to backend, then redirects)
  if (!templateStarted) {
    return (
      <>
        <Typography variant="h6" style={{ marginBottom: 16 }}>
          {translate("resources.projects.create.title", {
            _: "Create Project",
          })}
        </Typography>
        <Typography variant="body2" color="textSecondary" style={{ marginBottom: 24 }}>
          {translate("resources.projects.create.fill_required", {
            _: "Fill in the required fields below, then click Create Project to continue.",
          })}
        </Typography>
        <div className={classes.stepContent}>
          <CreateStep1Form {...createProps} isNewProject />
        </div>
        <div style={{ marginTop: 24 }}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => onStartTemplate(values)}
            size="large"
            disabled={props.saving}
          >
            {props.saving
              ? translate("resources.projects.create.saving", { _: "Creating…" })
              : translate("resources.projects.create.start_template", {
                  _: "Create Project",
                })}
          </Button>
        </div>
      </>
    );
  }

  // Stage 2: Full template (stepper) with Summary form auto-populated from stage 1 values
  return (
    <>
      <Typography variant="h6" style={{ marginBottom: 16 }}>
        {translate("resources.projects.create.template_title", {
          _: "Project Template",
        })}
      </Typography>

      <Stepper activeStep={activeStep} style={{ marginBottom: 24 }}>
        {CREATE_STEP_LABELS.map((label) => (
          <Step key={label}>
            <StepLabel>{translate(`projectSteps.${label}`)}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div className={classes.stepContent}>
        <div style={{ display: activeStep === 0 ? "block" : "none" }}>
          <SummaryForm {...createProps} isNewProject />
        </div>

        <div style={{ display: activeStep === 1 ? "block" : "none" }}>
          <ResponsibleOfficerForm {...createProps} />
        </div>

        <div style={{ display: activeStep === 2 ? "block" : "none" }}>
          <BackgroundForm
            {...createProps}
            projectData={values?.project ? values : { project: values }}
          />
        </div>

        <div style={{ display: activeStep === 3 ? "block" : "none" }}>
          <ResultMatrix
            {...createProps}
            matrixStep={matrixStep}
            setMatrixStep={setMatrixStep}
          />
        </div>

        <div style={{ display: activeStep === 4 ? "block" : "none" }}>
          <AdditionalInfoForm {...createProps} />
        </div>
      </div>
    </>
  );
}

export const ProjectCreate = ({ classes, ...props }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [matrixStep, setMatrixStep] = useState(0);
  const [templateStarted, setTemplateStarted] = useState(false);
  const [createDefaults, setCreateDefaults] = useState(null);
  const [saving, setSaving] = useState(false);
  const dataProvider = useDataProvider();
  const redirect = useRedirect();
  const history = useHistory();
  const notify = useNotify();
  const translate = useTranslate();

  useEffect(() => {
    dataProvider
      .custom("projects", { type: "getCreateDefaults" })
      .then((response) => {
        setCreateDefaults(response?.data || {});
      })
      .catch(() => {
        setCreateDefaults({});
      });
  }, [dataProvider]);

  const handleCreateProject = (values) => {
    if (!values) return;
    setSaving(true);
    dataProvider
      .create("projects", { data: values })
      .then(({ data }) => {
        setSaving(false);
        // Prefer project-details edit so Summary form (implementing_agencies, locations) loads and saves correctly.
        // Pass fromCreate so edit view opens on Summary step (same as when user clicks Edit).
        const detailId = data.current_project_detail?.id;
        if (detailId) {
          history.push(`/project-details/${detailId}/edit`, { fromCreate: true });
        } else {
          redirect(`/projects/${data.id}/edit`);
        }
        notify(
          translate("resources.projects.create.created_continue"),
          { type: "success" }
        );
      })
      .catch((error) => {
        setSaving(false);
        notify(
          error?.message || translate("resources.projects.create.error"),
          { type: "error" }
        );
      });
  };

  if (createDefaults === null) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
        <CircularProgress />
      </div>
    );
  }

  // Use API createDefaults so initial phase is Profile (not Project Concept)
  const initialValues = {
    ...createDefaults,
  };

  return (
    <Create {...props}>
      <SimpleForm
        redirect={createRedirect}
        initialValues={initialValues}
        toolbar={
          templateStarted ? (
            <ProjectToolbar
              activeStep={activeStep}
              setActiveStep={setActiveStep}
            />
          ) : null
        }
      >
        <CreateProjectTemplate
          {...props}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          matrixStep={matrixStep}
          setMatrixStep={setMatrixStep}
          templateStarted={templateStarted}
          onStartTemplate={handleCreateProject}
          saving={saving}
        />
      </SimpleForm>
    </Create>
  );
};

export default ProjectCreate;
