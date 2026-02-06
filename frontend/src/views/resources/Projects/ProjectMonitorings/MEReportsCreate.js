import {
  Create,
  FormDataConsumer,
  FormTab,
  SimpleForm,
  TabbedForm,
  Toolbar,
  useDataProvider,
  useNotify,
  useTranslate,
} from "react-admin";
import React, { Fragment, useEffect, useState } from "react";
import { ThemeProvider, makeStyles, useTheme } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import MEActivityForm from "./MonitoringForms/MEActivityForm";
import MEOutputsForm from "./MonitoringForms/MEOutputsForm";
// import MEReleasesForm from "./MonitoringForms/MEReleasesForm";
import MESummaryForm from "./MonitoringForms/MESummaryForm";
import lodash from "lodash";
import { useFormState } from "react-final-form";
// import {
//   useChangeField,
//   useCheckPermissions,
// } from "../../../../helpers/checkPermission";
import MEIssuesForm from "./MonitoringForms/MEIssuesForm";
import { formatValuesToQuery } from "../../../../helpers/dataHelpers";
import MERecommendationsForm from "./MonitoringForms/MERecommendationsForm";
import MEOverviewForm from "./MonitoringForms/MEOverviewForm";

const useStyles = makeStyles((theme) => ({
  textInput: {
    marginRight: 10,
    width: "200px",
  },
}));
//"project_detail_id":"1223","frequency":"ANNUAL"

const ProjectToolbar = ({ basePath, data, projectDetailId, ...props }) => {
  const [projectReports, setProjectReports] = useState([]);
  const translate = useTranslate();
  const { hasValidationErrors, values } = useFormState();
  const notify = useNotify();
  const dataProvider = useDataProvider();

  useEffect(() => {
    if (projectDetailId) {
      dataProvider
        .getListOfAll("me-reports", {
          filter: {
            project_detail_id: "" + projectDetailId,
            frequency: "ANNUAL",
          },
          sort_field: "id",
        })
        .then((resp) => {
          if (resp && resp.data) {
            setProjectReports(resp.data);
          }
        });
    }
  }, [projectDetailId]);

  function checkValidationRules() {
    if (values && values.frequency === "ANNUAL") {
      const currentYearReports = projectReports.filter(
        (report) => Number(report.year) === Number(values.year)
      );

      if (currentYearReports.length === 0) {
        return false;
      }

      const filteredQuarterDraft = projectReports.filter(
        (report) =>
          Number(report.year) === Number(values.year) &&
          report.report_status === "DRAFT" &&
          report.quarter === values.quarter
      );
      const filteredQuarterSubmitted = projectReports.filter(
        (report) =>
          Number(report.year) === Number(values.year) &&
          report.report_status !== "DRAFT" &&
          report.quarter === values.quarter
      );

      if (filteredQuarterDraft && filteredQuarterDraft.length > 0) {
        return `You have already created a report for Quarter ${values.quarter[1]}, ${values.year}, please submit it first.`;
      }
      if (filteredQuarterSubmitted && filteredQuarterSubmitted.length > 0) {
        return `You have already Quarter ${values.quarter[1]}, ${values.year}, submitted report, please review it first.`;
      }

      if (projectReports && projectReports.length > 0) {
        const filteredPrevious = projectReports.filter(
          (report) =>
            Number(report.year) === Number(values.year) &&
            report.report_status !== "DRAFT" &&
            values.quarter !== "Q1" &&
            report.quarter === `Q${values.quarter[1] - 1}`
        );
        if (filteredPrevious && filteredPrevious.length === 0)
          return "You have to submit a report for the previous quarter/s before submitting a report for this quarter.";
      }
    }

    return false;
  }

  const handleSave = () => {
    if (hasValidationErrors) {
      props.handleSubmitWithRedirect(props.redirect);
      notify("Validation errors", "error");
    } else {
      if (checkValidationRules()) {
        notify(checkValidationRules(), "error");
      } else {
        props.handleSubmitWithRedirect(props.redirect);
      }
    }
  };

  const handleCancel = () => {
    if (projectDetailId) {
      props.history.push(`/project/${projectDetailId}/me-reports`);
    }
  };

  return (
    <Toolbar>
      <Button onClick={handleCancel}>Cancel</Button>
      <Button color="primary" variant="contained" onClick={handleSave}>
        Create Report
      </Button>
    </Toolbar>
  );
};

export const MEReportsCreate = (props) => {
  const [details, setDetails] = useState({});
  const [project, setProject] = useState();
  const [projectData, setProjectData] = useState();
  const dataProvider = useDataProvider();
  const classes = useStyles();
  const isYearReport =
    props.match && props.match.params && props.match.params.year === "true";

  useEffect(() => {
    if (
      props.location &&
      props.match &&
      props.match.params &&
      props.match.params.id
    ) {
      if (!props.match.params.id) {
        props.history.back();
      }
      if (props.match.params.id) {
        setProject(props.match.params.id);

        dataProvider
          .getOne("projects", {
            id: props.match.params.id,
          })
          .then((response) => {
            if (response && response.data) {
              setProjectData(response.data);
            }
          });

        dataProvider
          .getListOfAll("project-details", {
            sort_field: "id",
            filter: { project_id: props.match.params.id },
          })
          .then((response) => {
            if (response && response.data) {
              const lastDetails = lodash.maxBy(
                response.data,
                (item) => item.id
              );
              setDetails(formatValuesToQuery(lastDetails));
            }
          });
      }
    }
  }, []);

  const createRedirect = (basePath, id, data) => `/me-reports/${id}/1`;

  return (
    <Create
      {...props}
      redirect={createRedirect}
      basePath="/me-reports"
      resource="me-reports"
      undoable={false}
    >
      <TabbedForm
        redirect={createRedirect}
        toolbar={
          <ProjectToolbar {...props} projectDetailId={details && details.id} />
        }
      >
        <FormTab label="Summary">
          <MESummaryForm
            {...props}
            classes={classes}
            details={details}
            projectData={projectData}
            isYearReport={isYearReport}
            isNew
          />
        </FormTab>
      </TabbedForm>
    </Create>
  );
};

export default MEReportsCreate;
