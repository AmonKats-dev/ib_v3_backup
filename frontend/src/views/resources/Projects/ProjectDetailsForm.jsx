import Button from "@material-ui/core/Button";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";
import classNames from "classnames";
import lodash from "lodash";
import React, { Fragment, useEffect, useState } from "react";
import { useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  SimpleForm,
  Toolbar,
  useDataProvider,
  useNotify,
  useTranslate,
} from "react-admin";
import { useForm, useFormState } from "react-final-form";
import { useDispatch, useSelector } from "react-redux";
import { setBreadCrumps } from "../../../actions/ui";
import { PROJECT_STEPS } from "../../../constants/common";
import { validateOptionsBeforeSave } from "../../../helpers";
import { checkFeature } from "../../../helpers/checkPermission";
import useFileTypes from "../../../hooks/useFileTypes";
import AdditionalInfoForm from "../../modules/Project/AdditionalInformation";
import CostEstimates from "../../modules/Project/CostEstimates";
import ExPostEvaluationForm from "../../modules/Project/ExPostEvaluation";
import NdpForm from "../../modules/Project/NdpForm";
import ProcurementForm from "../../modules/Project/ProcurementForm";
import ProjectAppraisal from "../../modules/Project/ProjectAppraisal";
import ProjectOptionsEsnip from "../../modules/Project/ProjectOptionsEsnip";
import ProjectOptionsPimis from "../../modules/Project/ProjectOptionsPimis";
import ResultMatrix from "../../modules/Project/ResultMatrix";
import BackgroundForm from "./ProjectForms/BackgroundForm";
import BehaviorChangeForm from "./ProjectForms/BehaviorChangeForm";
import BeneficiaryForm from "./ProjectForms/BeneficiaryForm";
import BudgetAllocationForm from "./ProjectForms/BudgetAllocationForm";
import ClimateRiskAssessmentForm from "./ProjectForms/ClimateRiskAssessmentForm";
import DemandAnalysisForm from "./ProjectForms/DemandAnalysisForm";
import FinancialAnalysisForm from "./ProjectForms/FinancialAnalysisForm";
import FrameworkForm from "./ProjectForms/FrameworkForm";
import IntroductionForm from "./ProjectForms/IntroductionForm";
import OmCostForm from "./ProjectForms/OmCostForm";
import ResponsibleOfficerForm from "./ProjectForms/ResponsibleOfficerForm";
import RiskAssessmentForm from "./ProjectForms/RiskAssessmentForm";
import StakeholdersForm from "./ProjectForms/StakeholdersForm";
import StrategicAlignmentForm from "./ProjectForms/StrategicAlignmentForm";
import SummaryForm from "./ProjectForms/SummaryForm";
import { fileValidation, validateFieldsByPhase } from "./validation";

import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import IndicatorsForm from "../../modules/Project/ResultMatrix/IndicatorsForm";
import { useMemo } from "react";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: "0 5px",
  },
  activeStep: {
    width: "100%",
    height: 2,
    marginTop: 10,
    backgroundColor: "#3f51b5",
    position: "absolute",
  },
  disabled: {
    color: "#000 !important",
    pointerEvents: "none",
    "& .MuiStepIcon-completed": {
      color: "#e0e0e0 !important",
      pointerEvents: "none",
    },
  },
}));

function ProjectDetailsForm(props) {
  const [title, setTitle] = useState(false);
  const [projectData, setProjectData] = useState(false);
  // const fileTypes = useFileTypes(props.record ? props.record.phase_id : 0);
  const fileTypes = useFileTypes(
    props.record.phase_id,
    projectData?.classification === "RETOOLING" ||
      projectData?.classification === "STUDIES"
  );
  const showNotification = useNotify();
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const form = useForm();
  const { values, hasValidationErrors } = useFormState();
  const appConfig = useSelector((state) => state.app.appConfig);
  const dispatch = useDispatch();

  const stepsContentByPhase = useMemo(() => {
    const isRetoolingProject =
      props.record?.project?.classification === "RETOOLING" ||
      props.record?.project?.classification === "STUDIES";

    if (checkFeature("has_esnip_fields")) {
      return (
        props.record &&
        appConfig.application_config.project_steps[
          props.record.project_type || "infrastructure"
        ]
      );
    }

    if (checkFeature("has_retooling_skip_phases") && isRetoolingProject) {
      return appConfig.application_config.project_steps_retooling;
    }

    return appConfig.application_config.project_steps;
  }, [props.record, appConfig]);

  const pimisProjectOptions = checkFeature("has_pimis_fields");
  const esnipProjectOptions = checkFeature("has_esnip_fields");

  // Sync implementing_agencies and locations from record to form once when form
  // is empty (e.g. after load). Never overwrite after user has entered data.
  const hasSyncedAgenciesRef = useRef(false);
  const hasSyncedLocationsRef = useRef(false);
  const hasSyncedClassificationRef = useRef(false);
  const hasSyncedProgramFunctionRef = useRef(false);

  useEffect(() => {
    const record = props.record;
    if (!record) return;
    const currentValues = form.getState().values;
    const hasRecordAgencies =
      record.implementing_agencies &&
      Array.isArray(record.implementing_agencies) &&
      record.implementing_agencies.length > 0;
    const hasFormAgencies =
      currentValues?.implementing_agencies &&
      Array.isArray(currentValues.implementing_agencies) &&
      currentValues.implementing_agencies.length > 0;
    if (
      hasRecordAgencies &&
      !hasFormAgencies &&
      !hasSyncedAgenciesRef.current
    ) {
      form.change("implementing_agencies", record.implementing_agencies);
      hasSyncedAgenciesRef.current = true;
    }
    const hasRecordLocations =
      record.locations &&
      Array.isArray(record.locations) &&
      record.locations.length > 0;
    const hasFormLocations =
      currentValues?.locations &&
      Array.isArray(currentValues.locations) &&
      currentValues.locations.length > 0;
    if (
      hasRecordLocations &&
      !hasFormLocations &&
      !hasSyncedLocationsRef.current
    ) {
      form.change("locations", record.locations);
      hasSyncedLocationsRef.current = true;
    }
  }, [
    props.record?.id,
    props.record?.implementing_agencies,
    props.record?.locations,
  ]);

  // Sync program_id and function_id from project into form when form has none
  // so Vote / organisation structure displays after create→edit redirect.
  useEffect(() => {
    const record = props.record;
    if (!record?.project) return;
    if (hasSyncedProgramFunctionRef.current) return;
    const currentValues = form.getState().values;
    const needProgram = record.project.program_id != null && !currentValues?.program_id;
    const needFunction = record.project.function_id != null && !currentValues?.function_id;
    if (needProgram || needFunction) {
      if (needProgram) {
        form.change("program_id", record.project.program_id);
      }
      if (needFunction) {
        form.change("function_id", record.project.function_id);
      }
      hasSyncedProgramFunctionRef.current = true;
    }
  }, [
    props.record?.id,
    props.record?.project?.program_id,
    props.record?.project?.function_id,
  ]);

  // Sync Project Classification from project (projectData) into form; it lives on project, not project_detail.
  useEffect(() => {
    if (!props.record?.project_id || !projectData) return;
    if (projectData.id !== props.record.project_id) return;
    const classification =
      projectData.classification ?? projectData.project_type ?? projectData.project_classification;
    if (
      classification &&
      !hasSyncedClassificationRef.current
    ) {
      const currentValues = form.getState().values;
      if (!currentValues?.classification) {
        form.change("classification", classification);
        hasSyncedClassificationRef.current = true;
      }
    }
  }, [
    props.record?.project_id,
    projectData?.id,
    projectData?.classification,
    projectData?.project_type,
    projectData?.project_classification,
  ]);

  // Reset classification sync ref when switching to a different project
  useEffect(() => {
    hasSyncedClassificationRef.current = false;
  }, [props.record?.project_id]);

  // Reset locations/agencies/program sync refs when switching to a different project detail
  // so saved values display when opening another detail (e.g. after create→edit).
  const prevRecordIdRef = useRef(props.record?.id);
  useEffect(() => {
    if (prevRecordIdRef.current !== props.record?.id) {
      prevRecordIdRef.current = props.record?.id;
      hasSyncedAgenciesRef.current = false;
      hasSyncedLocationsRef.current = false;
      hasSyncedProgramFunctionRef.current = false;
    }
  }, [props.record?.id]);

  useEffect(() => {
    dispatch(
      setBreadCrumps([
        { to: "/projects", title: "Projects" },
        {
          to: "",
          title: translate(
            `resources.breadcrumbs.phase_${props.record.phase_id}`
          ),
        },
      ])
    );

    return () => {
      dispatch(setBreadCrumps([]));
    };
  }, []);

  useEffect(() => {
    dispatch({
      type: "SET_PROJECT_TITLE_HEADER",
      payload: {
        data: `${props.record.name || ""}`,
      },
    });

    if (props.record && props.record.project_id) {
      dataProvider
        .getOne("projects", { id: props.record.project_id })
        .then((response) => {
          if (response?.data) {
            setTitle(response?.data?.name);
            setProjectData(response.data);
            dispatch({
              type: "SET_PROJECT_TITLE_HEADER",
              payload: {
                data: `${response?.data?.name || ""}`,
              },
            });
          }
        });
    }

    return () => {
      dispatch({
        type: "SET_PROJECT_TITLE_HEADER",
        payload: {
          data: "",
        },
      });
    };
  }, []);

  // useEffect(() => {
  //   return () => {
  //     dispatch({
  //       type: "SET_PROJECT_TITLE_HEADER",
  //       payload: {},
  //     });
  //   };
  // }, []);

  function getSteps(phase_id) {
    const selectedSteps = [];
    stepsContentByPhase[phase_id].forEach((step) => {
      selectedSteps.push(step);
    });
    return selectedSteps;
  }

  const handleStep = (step) => () => {
    const { setActiveStep } = props;
    // Get latest form values at click time (ensures Summary fields are captured)
    const currentValues = form.getState().values;
    Promise.resolve(props.save(currentValues, false))
      .then(() => setActiveStep(step))
      .catch(() => {});
  };

  function getStepContent(step, phase_id) {
    const componentName = stepsContentByPhase[phase_id][step];

    switch (componentName) {
      case PROJECT_STEPS.SUMMARY:
        return (
          <SummaryForm
            {...props}
            record={values || record}
            initialRecord={record}
            projectData={projectData}
          />
        );
      case PROJECT_STEPS.RESPONSIBLE_OFFICER:
        return <ResponsibleOfficerForm {...props} />;
      case PROJECT_STEPS.PROJECT_BACKGROUND:
        return <BackgroundForm {...props} projectData={projectData} />;
      case PROJECT_STEPS.PROJECT_FRAMEWORK:
        return <FrameworkForm {...props} />;
      case PROJECT_STEPS.DEMAND_ANALYSIS:
        return <DemandAnalysisForm {...props} />;
      case PROJECT_STEPS.INTRODUCTION:
        return <IntroductionForm {...props} />;
      case PROJECT_STEPS.STAKEHOLDERS:
        return <StakeholdersForm {...props} />;
      case PROJECT_STEPS.CLIMATE_RISK_ASSESSMENT:
        return <ClimateRiskAssessmentForm {...props} />;
      case PROJECT_STEPS.RISK_ASSESSMENT:
        return <RiskAssessmentForm {...props} />;
      case PROJECT_STEPS.OPTIONS_ANALYSIS:
        if (pimisProjectOptions) {
          return (
            <ProjectOptionsPimis
              {...props}
              optionsStep={props.optionsStep}
              setOptionStep={props.setOptionStep}
            />
          );
        }
        if (esnipProjectOptions) {
          return (
            <ProjectOptionsEsnip
              {...props}
              optionsStep={props.optionsStep}
              setOptionStep={props.setOptionStep}
            />
          );
        }

        return (
          <ProjectAppraisal
            {...props}
            optionsStep={props.optionsStep}
            setOptionStep={props.setOptionStep}
          />
        );
      case PROJECT_STEPS.OM_COSTS:
        return <OmCostForm {...props} />;
      case PROJECT_STEPS.FINANCIAL_ANALYSIS:
        return <FinancialAnalysisForm {...props} />;
      case PROJECT_STEPS.RESULT_MATRIX:
        return (
          <ResultMatrix
            {...props}
            matrixStep={props.matrixStep}
            setMatrixStep={props.setMatrixStep}
          />
        );
      case PROJECT_STEPS.COST_ESTIMATES:
        return <CostEstimates {...props} />;
      case PROJECT_STEPS.ADDITIONAL_INFO:
        return <AdditionalInfoForm {...props} />;
      case PROJECT_STEPS.EX_POST_EVALUATION:
        return <ExPostEvaluationForm {...props} />;
      case PROJECT_STEPS.NDP:
        return <NdpForm {...props} />;
      case PROJECT_STEPS.PROCUREMENT:
        return <ProcurementForm {...props} />;
      case PROJECT_STEPS.BUDGET_ALLOCATION:
        return <BudgetAllocationForm {...props} />;
      case PROJECT_STEPS.BENEFICIARY:
        return <BeneficiaryForm {...props} />;
      case PROJECT_STEPS.STRATEGIC_ALIGNMENT:
        return <StrategicAlignmentForm {...props} />;
      case PROJECT_STEPS.BEHAVIOR_CHANGE:
        return <BehaviorChangeForm {...props} />;
      case PROJECT_STEPS.INDICATORS:
        return <IndicatorsForm {...props} />;
      default:
        return null;
    }
  }

  const renderStepContent = (activeStep, steps, phase_id) => {
    if (activeStep === steps.length) {
      return (
        <Typography>{translate("messages.all_steps_completed")}</Typography>
      );
    }

    return <Fragment>{getStepContent(activeStep, phase_id)}</Fragment>;
  };

  // Render all steps but hide inactive ones so form state (implementing_agencies,
  // location, technical description, etc.) is preserved when moving between steps
  const renderAllStepsContent = (activeStep, steps, phase_id) => {
    if (!steps || steps.length === 0) return null;
    if (activeStep === steps.length) {
      return (
        <Typography>{translate("messages.all_steps_completed")}</Typography>
      );
    }
    return (
      <Fragment>
        {steps.map((label, index) => (
          <div
            key={label}
            style={{ display: activeStep === index ? "block" : "none" }}
          >
            {getStepContent(index, phase_id)}
          </div>
        ))}
      </Fragment>
    );
  };

  const getValidationStatusError = (label) => {
    const { record } = props;
    const emptyFieldsForPhase = validateFieldsByPhase(
      record,
      label,
      appConfig.application_config.prefix
    );
    let errorCounter = false;

    if (record && label === PROJECT_STEPS.ADDITIONAL_INFO) {
      errorCounter = fileValidation(record, fileTypes);
    }

    if (
      record &&
      label === PROJECT_STEPS.OPTIONS_ANALYSIS &&
      checkFeature("project_options_validate_preferred_item", record.phase_id)
    ) {
      if (
        values &&
        values.project_options &&
        values.project_options.length === 0
      ) {
        errorCounter = true;
      } else {
        if (
          values &&
          values.project_options &&
          values.project_options.filter((item) => item && item.is_preferred)
            .length === 0
        ) {
          errorCounter = true;
        }
      }
    }

    if (
      record &&
      label === PROJECT_STEPS.OPTIONS_ANALYSIS &&
      checkFeature("project_options_validate_mandatory_fields", record.phase_id)
    ) {
      const optionsErrorsMsg = validateOptionsBeforeSave(
        values,
        showNotification,
        translate
      );
      if (lodash.isString(optionsErrorsMsg) && optionsErrorsMsg.length !== 0) {
        errorCounter = true;
      }
    }

    return (
      (emptyFieldsForPhase && emptyFieldsForPhase.length !== 0) || errorCounter
    );
  };
  const getDisabledStatus = (label) => {
    if (record && label === PROJECT_STEPS.OM_COSTS) {
      return !record.maintenance_period;
    }

    if (record && label === PROJECT_STEPS.PROCUREMENT) {
      const renderSource = [
        "Public-Private Partnerships",
        "Joint-Venture",
        "Joint-Venture (Unsolicited Proposal)",
        "Public-Private Partnerships (Unsolicited Proposal)",
        "Joint-Venture (Solicited Proposal)",
        "Public-Private Partnerships (Solicited Proposal)",
      ];
      const renderSourceFund = [
        "Public-Private Partnership",
        "Joint Venture",
        "Unsolicited Proposal",
      ];

      const hasProcurementModality =
        record &&
        record.procurement_modality &&
        record.procurement_modality.filter((item) =>
          renderSource.includes(item)
        ).length > 0;

      const hasFundingSource =
        record &&
        record.proposed_funding_source &&
        record.proposed_funding_source !==
          "Source of funding has not been identified" &&
        record.proposed_funding_source.filter((item) =>
          renderSourceFund.includes(item)
        ).length > 0;

      return !(hasFundingSource || hasProcurementModality);
    }

    return false;
  };

  const { record, activeStep, openOnSummary, setActiveStep } = props;
  const phase_id = (values && values.phase_id) || 0;
  const steps = getSteps(phase_id);
  const classes = useStyles();

  // When arriving from Create Project, open on Summary step (same as when user clicks Edit)
  const hasOpenedOnSummaryRef = useRef(false);
  useEffect(() => {
    if (!openOnSummary || hasOpenedOnSummaryRef.current || !steps?.length || !setActiveStep) return;
    const summaryIndex = steps.indexOf(PROJECT_STEPS.SUMMARY);
    if (summaryIndex !== -1) {
      setActiveStep(summaryIndex);
      hasOpenedOnSummaryRef.current = true;
    }
  }, [openOnSummary, steps, setActiveStep]);

  const stepperRef = useRef();
  const stepperWidth = stepperRef.current?.getBoundingClientRect().width < 768;
  const scrollWidth = stepperRef.current?.scrollWidth > stepperWidth;
  const stepper = stepperRef.current;
  const [scrolledValue, setScrolledValue] = useState(0);
  const maxScrollLeft =
    stepperRef.current?.scrollWidth - stepperRef.current?.clientWidth;

  if (checkFeature("has_stepper_scroll_arrows")) {
    return (
      <>
        <div
          style={{ position: "relative", width: "100%" }}
          onScroll={(ev) => {
            setScrolledValue(ev.target.scrollLeft);
          }}
        >
          {scrolledValue > 0 && (
            <ChevronLeftIcon
              style={{
                position: "absolute",
                left: "0",
                top: "25px",
                height: "50px",
                background: "#fff",
                cursor: "pointer",
                zIndex: 10,
              }}
              onClick={() => {
                if (stepperRef) {
                  stepper.scrollLeft = 0;
                  setScrolledValue(0);
                }
              }}
            />
          )}
          {steps && steps.length > 1 ? (
            <Stepper
              activeStep={activeStep}
              style={{ overflowX: "hidden" }}
              ref={stepperRef}
            >
              {steps.map((label, index) => {
                const props = {};
                const labelProps = {};

                return (
                  <Step
                    key={label}
                    {...props}
                    onClick={handleStep(index)}
                    completed={!getValidationStatusError(label)}
                    disabled={getDisabledStatus(label)}
                    className={classNames({
                      [classes.disabled]: getDisabledStatus(label),
                    })}
                  >
                    <StepLabel
                      {...labelProps}
                      error={getValidationStatusError(label)}
                      StepIconProps={{
                        error: getValidationStatusError(label),
                      }}
                    >
                      {translate(`projectSteps.${label}`)}
                    </StepLabel>
                    {index === activeStep ? (
                      <div className={classes.activeStep}></div>
                    ) : null}
                  </Step>
                );
              })}
            </Stepper>
          ) : null}
          {scrollWidth && scrolledValue < maxScrollLeft && (
            <ChevronRightIcon
              style={{
                position: "absolute",
                right: "0",
                top: "25px",
                height: "50px",
                background: "#fff",
                cursor: "pointer",
                zIndex: 10,
              }}
              onClick={() => {
                if (stepperRef) {
                  stepper.scrollLeft =
                    stepperRef.current?.getBoundingClientRect().width / 2;
                }
              }}
            />
          )}
        </div>

        <div>{renderAllStepsContent(activeStep, steps, phase_id)}</div>
      </>
    );
  }

  return (
    <>
      <div>
        {steps && steps.length > 1 ? (
          <Stepper activeStep={activeStep} ref={stepperRef}>
            {steps.map((label, index) => {
              const props = {};
              const labelProps = {};

              return (
                <Step
                  key={label}
                  {...props}
                  onClick={handleStep(index)}
                  completed={!getValidationStatusError(label)}
                  disabled={getDisabledStatus(label)}
                  className={classNames({
                    [classes.disabled]: getDisabledStatus(label),
                  })}
                >
                  <StepLabel
                    {...labelProps}
                    error={getValidationStatusError(label)}
                    StepIconProps={{
                      error: getValidationStatusError(label),
                    }}
                  >
                    {translate(`projectSteps.${label}`)}
                  </StepLabel>
                  {index === activeStep ? (
                    <div className={classes.activeStep}></div>
                  ) : null}
                </Step>
              );
            })}
          </Stepper>
        ) : null}
      </div>

      <div>{renderAllStepsContent(activeStep, steps, phase_id)}</div>
    </>
  );
}

function ProjectToolbar(props) {
  const showNotification = useNotify();
  const form = useForm();
  const { values, hasValidationErrors } = useFormState();
  const translate = useTranslate();
  const appConfig = useSelector((state) => state.app.appConfig);

  const stepsContentByPhase = useMemo(() => {
    const isRetoolingProject =
      props.record?.project?.classification === "RETOOLING" ||
      props.record?.project?.classification === "STUDIES";

    if (checkFeature("has_esnip_fields")) {
      return (
        props.record &&
        appConfig.application_config.project_steps[
          props.record.project_type || "infrastructure"
        ]
      );
    }

    if (checkFeature("has_retooling_skip_phases") && isRetoolingProject) {
      return appConfig.application_config.project_steps_retooling;
    }

    return appConfig.application_config.project_steps;
  }, [props.record, appConfig]);

  const classes = useStyles();
  const { record } = props;
  const phase_id = (record && record.phase_id) || 0;
  const steps = stepsContentByPhase[phase_id];

  const handleBack = () => {
    window.scrollTo(0, 0);
    // Save current step input before going back
    const currentValues = form.getState().values;
    const saveResult = props.save(currentValues, false);
    const savePromise =
      saveResult && typeof saveResult.then === "function"
        ? saveResult
        : Promise.resolve(saveResult);
    savePromise
      .then(() => {
        const prevStep =
          props.activeStep - 1 !== 0 ? props.activeStep - 1 : 0;
        props.setActiveStep(prevStep);
      })
      .catch((err) => {
        showNotification(
          err?.message || translate("messages.save_failed", { _: "Save failed" }),
          "error"
        );
      });
  };

  const handleNext = () => {
    window.scrollTo(0, 0);

    const { record } = props;
    const phase_id = (record && record.phase_id) || 0;
    const steps = stepsContentByPhase[phase_id];

    const currentStep = props.activeStep + 1;
    // Get latest form values at click time so Summary (implementing_agencies, location, etc.) is captured
    const currentValues = form.getState().values;
    const isLastStep =
      checkFeature("project_create_submission_button_show", phase_id) &&
      currentStep === steps.length;
    // Save current step input before moving to next; only advance after save succeeds
    const saveResult = isLastStep
      ? props.save(currentValues, props.redirect)
      : props.save(currentValues, false);
    const savePromise =
      saveResult && typeof saveResult.then === "function"
        ? saveResult
        : Promise.resolve(saveResult);
    savePromise
      .then(() => props.setActiveStep(currentStep))
      .catch((err) => {
        showNotification(
          err?.message || translate("messages.save_failed", { _: "Save failed" }),
          "error"
        );
      });
  };

  const handleValidate = () => {
    const redirectPath = checkFeature(
      "project_create_submission_button_show",
      phase_id
    )
      ? props.redirect
      : false;

    props.handleSubmitWithRedirect(redirectPath);
    if (hasValidationErrors) {
      showNotification(
        translate("messages.project_has_validation_errors"),
        "error"
      );
    }
  };

  const handleSave = () => {
    if (
      checkFeature("has_saving_validation_errors") &&
      steps[props.activeStep] === PROJECT_STEPS.RESULT_MATRIX
    ) {
      let validationMsg = "";

      if (values) {
        if (values.outcomes && values.outcomes.length !== 0) {
          const errorOutcomes = values.outcomes.filter(
            (item) =>
              !item.indicators ||
              (item.indicators && item.indicators.length === 0)
          );
          if (errorOutcomes && errorOutcomes.length > 0) {
            validationMsg += translate("validation.outcomes_indicators_empty");
          }
        }

        if (values.outputs && values.outputs.length !== 0) {
          const errorOutputs = values.outputs.filter(
            (item) =>
              !item.indicators ||
              (item.indicators && item.indicators.length === 0)
          );
          const errorOutputsInvestments = values.outputs.filter(
            (item) =>
              !item.investments ||
              (item.investments && item.investments.length === 0)
          );
          if (errorOutputs && errorOutputs.length > 0) {
            validationMsg += translate("validation.outputs_indicators_empty");
          }
          if (errorOutputsInvestments && errorOutputsInvestments.length > 0) {
            validationMsg += translate("validation.outputs_investments_empty");
          }
        }

        if (values.activities && values.activities.length !== 0) {
          const errorActivityInvestments = values.activities.filter(
            (item) =>
              !item.investments ||
              (item.investments && item.investments.length === 0)
          );
          if (errorActivityInvestments && errorActivityInvestments.length > 0) {
            validationMsg += translate(
              "validation.activities_investments_empty"
            );
          }
        }
      }

      if (checkFeature("has_pimis_fields")) {
        props.save(values, props.redirect);
      } else {
        if (validationMsg) {
          showNotification(validationMsg, "error");
        } else {
          props.handleSubmitWithRedirect(props.redirect);
        }
      }
    } else {
      if (checkFeature("has_pimis_fields")) {
        props.save(values, props.redirect);
      } else {
        props.handleSubmitWithRedirect(props.redirect);
      }
    }
  };

  return (
    <Toolbar>
      <Button
        className={classes.button}
        variant="outlined"
        disabled={props.activeStep === 0}
        onClick={handleBack}
      >
        {translate("buttons.back")}
      </Button>
      {checkFeature("project_create_submission_button_show", phase_id) && (
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={handleSave}
        >
          {translate("buttons.create")}
        </Button>
      )}
      {props.activeStep === steps.length - 1 ? null : (
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={handleNext}
        >
          {translate("buttons.next")}
        </Button>
      )}
      <Button
        className={classes.button}
        color="primary"
        variant="contained"
        onClick={handleSave}
      >
        {translate("buttons.save_exit")}
      </Button>
      {checkFeature("has_validation_button") && (
        <Button
          className={classes.button}
          color="primary"
          variant="contained"
          onClick={handleValidate}
          startIcon={<PlaylistAddCheckIcon />}
        >
          {translate("buttons.validate")}
        </Button>
      )}
    </Toolbar>
  );
}

function FormDetails(props) {
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const [matrixStep, setMatrixStep] = useState(0);
  const [optionsStep, setOptionStep] = useState(0);
  const openOnSummary = location.state?.fromCreate === true;

  return (
    <SimpleForm
      {...props}
      toolbar={
        <ProjectToolbar
          setActiveStep={setActiveStep}
          activeStep={activeStep}
          {...props}
        />
      }
      sanitizeEmptyValues={false}
      enableReinitialize={false}
    >
      <ProjectDetailsForm
        {...props}
        setActiveStep={setActiveStep}
        activeStep={activeStep}
        matrixStep={matrixStep}
        setMatrixStep={setMatrixStep}
        optionsStep={optionsStep}
        setOptionStep={setOptionStep}
        openOnSummary={openOnSummary}
      />
    </SimpleForm>
  );
}

export default FormDetails;
