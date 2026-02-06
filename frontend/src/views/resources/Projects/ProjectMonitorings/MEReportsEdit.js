import {
  Create,
  FormDataConsumer,
  FormTab,
  SimpleForm,
  TabbedForm,
  Toolbar,
  useDataProvider,
  useTranslate,
  Edit,
  Button,
  useRefresh,
} from "react-admin";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { ThemeProvider, makeStyles, useTheme } from "@material-ui/core/styles";

import ButtonMU from "@material-ui/core/Button";
import MEActivityForm from "./MonitoringForms/MEActivityForm";
import MEOutputsForm from "./MonitoringForms/MEOutputsForm";
import MEReleasesForm from "./MonitoringForms/MEReleasesForm";
import MESummaryForm from "./MonitoringForms/MESummaryForm";
import lodash from "lodash";
import { useFormState } from "react-final-form";
import {
  checkFeature,
  useCheckPermissions,
} from "../../../../helpers/checkPermission";
import MEIssuesForm from "./MonitoringForms/MEIssuesForm";
import { formatValuesToQuery } from "../../../../helpers/dataHelpers";
import MEOverviewForm from "./MonitoringForms/MEOverviewForm";
import MERecommendationsForm from "./MonitoringForms/MERecommendationsForm";
import MEAttachmentsForm from "./MonitoringForms/MEAttachmentsForm";
import MEContingency from "./MonitoringForms/MEContingency";

const createRedirect = (basePath, id, data) => `/me-reports/${id}/show`;

const useStyles = makeStyles((theme) => ({
  textInput: {
    marginRight: 10,
    width: "200px",
  },
}));

let currentTab = 0;

const ProjectToolbar = ({ basePath, data, id, activeTab, ...props }) => {
  const { hasValidationErrors, values } = useFormState();
  const refresh = useRefresh();

  useEffect(
    (prev) => {
      if (currentTab !== activeTab) {
        if (!lodash.isEmpty(values) && activeTab) {
          props.save(values, false);
        }
        currentTab = activeTab;
      }
    },
    [activeTab]
  );

  const handleSave = () => {
    props.handleSubmitWithRedirect(props.redirect);
  };

  const handleSaveChanges = () => {
    props.save(values, false);
    refresh();
  };

  const handleSaveChangesAndExit = () => {
    props.save(values, `/me-reports/${id}/show`); //Amon
  };

  return (
    <Toolbar>
      <Button href={`/#/me-reports/${id}/show`} label="Back to Report" />
      <ButtonMU
        color="primary"
        variant="contained"
        onClick={handleSaveChanges}
        style={{ margin: "0px 10px" }}
      >
        Save Changes
      </ButtonMU>
      <ButtonMU
        color="primary"
        variant="contained"
        onClick={handleSaveChangesAndExit}
      >
        Save Report and Exit
      </ButtonMU>
    </Toolbar>
  );
};

function EditFormContent({ activeTab, onChangeTab, projectData, ...props }) {
  const classes = useStyles();
  const { details, isYearReport } = props;

  return (
    <TabbedForm
      {...props}
      redirect={createRedirect}
      toolbar={<ProjectToolbar {...props} activeTab={activeTab} />}
    >
      <FormTab label="summary" onClick={onChangeTab(0)}>
        <MESummaryForm
          {...props}
          projectData={projectData}
          classes={classes}
          details={details}
          // disabled
        />
      </FormTab>
      <FormTab label="Overview" onClick={onChangeTab(1)}>
        <MEOverviewForm
          {...props}
          classes={classes}
          details={details}
          isYearReport={isYearReport}
        />
      </FormTab>
      <FormTab label="Physical" onClick={onChangeTab(2)}>
        <MEOutputsForm
          {...props}
          outputs={details.outputs}
          classes={classes}
          details={details}
          isYearReport={isYearReport}
        />
      </FormTab>
      <FormTab label="Financial" onClick={onChangeTab(3)}>
        <MEActivityForm
          {...props}
          activities={details.activities}
          classes={classes}
          details={details}
          isYearReport={isYearReport}
        />
      </FormTab>
      <FormTab label="Issues" onClick={onChangeTab(4)}>
        <MEIssuesForm
          {...props}
          classes={classes}
          isYearReport={isYearReport}
        />
      </FormTab>
      <FormTab label="Conclusion" onClick={onChangeTab(5)}>
        <MERecommendationsForm
          {...props}
          classes={classes}
          isYearReport={isYearReport}
        />
      </FormTab>

      {/* {checkFeature("has_ibp_fields") && (
        <FormTab label="Contingency Liability" onClick={onChangeTab(6)}>
          <MEContingency
            {...props}
            classes={classes}
            isYearReport={isYearReport}
          />
        </FormTab>
      )} */}

      <FormTab label="Attachments" onClick={onChangeTab(6)}>
        <MEAttachmentsForm
          {...props}
          classes={classes}
          isYearReport={isYearReport}
        />
      </FormTab>
    </TabbedForm>
  );
}

//add props undoable={false} for save without undo
const MEReportsEdit = (props) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isYearReport, setIsYearReport] = useState(false);
  const [details, setDetails] = useState({});
  const [project, setProject] = useState();
  const [projectData, setProjectData] = useState();
  const [redirect, setRedirect] = useState();
  const dataProvider = useDataProvider();
  // const classes = useStyles();
  const checkPermission = useCheckPermissions();
  // const isYearReport =
  //   props.match && props.match.params && props.match.params.year === "true";

  useEffect(() => {
    dataProvider.getOne("me-reports", { id: props.id }).then((response) => {
      if (response && response.data) {
        setIsYearReport(response.data.frequency === "ANNUAL");
        dataProvider
          .getOne("project-details", {
            id: response.data.project_detail_id,
          })
          .then((resp) => {
            if (resp && resp.data) {
              setDetails(formatValuesToQuery(resp.data));
              setProject(resp.data.project_id);
              dataProvider
                .getOne("projects", {
                  id: resp.data.project_id,
                })
                .then((res) => {
                  if (res && res.data) {
                    setProjectData(res.data);
                  }
                });
              // setRedirect(`/#/project/${resp.data.id}/me-reports`)
            }
          });
      }
    });
  }, []);

  const refresh = useRefresh();

  const handleChangeTab = (id) => () => {
    setActiveTab(id);
    // refresh();
  };

  return (
    <Edit
      {...props}
      redirect={createRedirect}
      basePath="/me-reports"
      resource="me-reports"
      undoable={false}
    >
      <EditFormContent
        {...props}
        details={details}
        isYearReport={isYearReport}
        activeTab={activeTab}
        onChangeTab={handleChangeTab}
        projectData={projectData}
      />
    </Edit>
  );
};

export default MEReportsEdit;
