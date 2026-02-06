import { Card, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import {
  Button,
  EditButton,
  Show,
  SimpleShowLayout,
  TopToolbar,
  useDataProvider,
  useRedirect,
  useShowController,
  useTranslate,
} from "react-admin";
import { formatValuesToQuery } from "../../../../helpers/dataHelpers";
import { ExecutiveSummary } from "../../Projects/Report/components/ExecutiveSummary";
import PageBreak from "../../Projects/Report/components/PageBreak";
import { Accomplishments } from "./Accomplishments";
import { BudgetPerformance } from "./BudgetPerformance";
import { Challenges } from "./Challenges ";
import { Introduction } from "./Introduction";
import { PostProjectTasks } from "./PostProjectTasks";
import { ProjectInformation } from "./ProjectInformation";
import { Recommendations } from "./Recommendations ";
import { Sustainability } from "./Sustainability";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ExportActions from "../../../pages/reports/ExportActions";
import { EXPORT_TYPES } from "../../../../constants/common";
import { ProjectAchievements } from "./ProjectAchievements";
import { ExtensionReason } from "../../Projects/Report/components/ExtensionReason";

const Actions = (props) => {
  const redirect = useRedirect();

  return (
    <TopToolbar>
      <Button
        onClick={() => {
          redirect(`/reports-completion-projects`);
        }}
        label="Back"
        color="primary"
        startIcon={<ArrowBackIcon />}
        style={{ position: "absolute", left: 0 }}
      />
      <div>
        <EditButton {...props} record={props.data} />
        {/* <ExportActions
          reportId="report-container"
          title="Projects Completion Report"
          exportTypes={[EXPORT_TYPES.PDF, EXPORT_TYPES.WORD]}
        /> */}
      </div>
    </TopToolbar>
  );
};

function ProjectCompletionShow(props) {
  const [projectDetails, setProjectDetails] = useState(null);
  const [project, setProject] = useState(null);
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const { record } = useShowController(props);

  useEffect(() => {
    if (record) {
      dataProvider
        .getOne("projects", {
          id: record.project_id,
        })
        .then((response) => {
          if (response && response.data) {
            setProject(response.data);

            dataProvider
              .getOne("project-details", {
                id: response.data.current_project_detail.id,
              })
              .then((resp) => {
                if (resp && resp.data) {
                  setProjectDetails(formatValuesToQuery(resp.data));
                }
              });
          }
        });
    }
  }, [record, dataProvider]);

  return !projectDetails || !project ? null : (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h2" style={{ width: "100%" }}>
          Project Completion Report
        </Typography>
        <ExportActions
          reportId="report-container"
          title="Projects Completion Report"
          projectTitle={projectDetails.project.name}
          exportTypes={[EXPORT_TYPES.PDF, EXPORT_TYPES.WORD]}
        />
      </div>
      <Show {...props} actions={<Actions />}>
        <SimpleShowLayout>
          <div id="report-container" className="export_container">
            <ProjectInformation
              {...props}
              details={projectDetails}
              project={project}
            />
            <PageBreak />
            <ExecutiveSummary
              counter="1"
              {...props}
              customRecord={projectDetails}
            />
            <PageBreak />

            {project?.project_completion?.extension_reason && (
              <ExtensionReason
                counter="1.1"
                {...props}
                customRecord={project.project_completion}
              />
            )}

            <Introduction
              counter="2"
              {...props}
              customRecord={projectDetails}
            />
            <PageBreak />

            <Accomplishments
              counter="3"
              {...props}
              details={projectDetails}
              customRecord={project.project_completion}
            />
            <PageBreak />

            <BudgetPerformance
              counter="4"
              {...props}
              customRecord={projectDetails}
            />
            <PageBreak />

            <Challenges
              counter="5"
              {...props}
              customRecord={project.project_completion}
            />
            <PageBreak />

            <Recommendations
              counter="6"
              {...props}
              customRecord={project.project_completion}
            />
            <PageBreak />

            <PostProjectTasks
              counter="7"
              {...props}
              customRecord={project.project_completion}
            />
            <PageBreak />

            <Sustainability
              counter="8"
              {...props}
              customRecord={project.project_completion}
            />
            <PageBreak />

            <ProjectAchievements
              counter="9"
              {...props}
              customRecord={project.project_completion}
            />
            <PageBreak />
          </div>
        </SimpleShowLayout>
      </Show>
    </div>
  );
}

export default ProjectCompletionShow;
