import React, { useEffect, useState } from "react";
import {
  Show,
  TabbedShowLayout,
  Tab,
  SimpleShowLayout,
  useDataProvider,
} from "react-admin";
import { useNotify, useRefresh, useRedirect, SimpleForm } from "react-admin";
import { PhysicalMonitoringFrameworkView } from "./ReportView/PhysicalMonitoringFrameworkView";
import { PhysicalMonitoring } from "./ReportView/PhysicalMonitoring";
import { ProjectPhysicalProgressStatus } from "./ReportView/ProjectPhysicalProgressStatus";
import { ProjectPhysicalPCorrectiveMeasures } from "./ReportView/ProjectPhysicalPCorrectiveMeasures";
import { FinancialMonitoringBudget } from "./ReportView/FinancialMonitoringBudget";
import { ProjectFinancialProgressStatus } from "./ReportView/ProjectFinancialProgressStatus";
import { FiscalAllocationCorrectiveMeasures } from "./ReportView/FiscalAllocationCorrectiveMeasures";
import { FinancialExecutionCorrectiveMeasure } from "./ReportView/FinancialExecutionCorrectiveMeasure";
import { SummaryPerfomance } from "./ReportView/SummaryPerfomance";
import { MEAttacments } from "./ReportView/MEAttacments";
import PageBreak from "../Report/components/PageBreak";

import ShowActions from "./Actions/ShowActions";
import { ProjectInformation } from "./ReportView/ProjectInformation";
import { ReportSummaryInformation } from "./ReportView/ReportSummaryInformation";
import { IssuesRecommendations } from "./ReportView/IssuesRecommendations";
import { OutputsRisks } from "./ReportView/OutputsRisks";
import { Challenges } from "./ReportView/Challenges";
import { Liabilities } from "./ReportView/Liabilities";
import { checkFeature } from "../../../../helpers/checkPermission";
import { ImplementingAgencies } from "../Report/components/ImplementingAgencies";

//add props undoable={false} for save without undo
export function MeReportView({ projectDetails, ...props }) {
  return (
    <div id="docx" className="export_container">
      <h2>{projectDetails?.project?.name}</h2>
      <ProjectInformation {...props} customRecord={projectDetails} />
      <PageBreak />

      <ImplementingAgencies {...props} customRecord={projectDetails} />
      <PageBreak />

      <ReportSummaryInformation {...props} customRecord={projectDetails} />
      <PageBreak />

      <PhysicalMonitoringFrameworkView
        {...props}
        projectDetails={projectDetails}
      />
      <PageBreak />

      <PhysicalMonitoring {...props} projectDetails={projectDetails} />
      <PageBreak />

      <ProjectPhysicalProgressStatus
        {...props}
        projectDetails={projectDetails}
      />
      <PageBreak />

      {/* <OutputsRisks {...props} projectDetails={projectDetails} />
      <PageBreak /> */}

      <FinancialMonitoringBudget {...props} projectDetails={projectDetails} />
      <PageBreak />

      {/* <ProjectFinancialProgressStatus
        {...props}
        projectDetails={projectDetails}
      />
      <PageBreak /> */}

      <SummaryPerfomance {...props} projectDetails={projectDetails} />
      <PageBreak />

      <IssuesRecommendations {...props} projectDetails={projectDetails} />
      <PageBreak />

      <Challenges {...props} projectDetails={projectDetails} />
      <PageBreak />

      {/* {checkFeature("has_ibp_fields") && (
        <>
          <Liabilities {...props} projectDetails={projectDetails} />
          <PageBreak />
        </>
      )} */}

      <MEAttacments {...props} projectDetails={projectDetails} />
    </div>
  );
}

const MEReportsShow = ({ classes, ...props }) => {
  const [projectDetails, setProjectDetails] = useState({});
  const [project, setProject] = useState({});

  const dataProvider = useDataProvider();

  useEffect(() => {
    dataProvider.getOne("me-reports", { id: props.id }).then((response) => {
      if (response && response.data && response.data.project_detail_id) {
        dataProvider
          .getOne("project-details", {
            id: response.data.project_detail_id,
          })
          .then((resp) => {
            if (resp && resp.data) {
              setProjectDetails(resp.data);

              if (resp.data.project_id) {
                dataProvider
                  .getOne("projects", {
                    id: resp.data.project_id,
                  })
                  .then((resp) => {
                    if (resp && resp.data) {
                      setProject(resp.data);
                    }
                  });
              }
            }
          });
      }
    });
  }, []);

  return (
    <Show
      {...props}
      undoable={false}
      actions={
        <ShowActions
          projectId={projectDetails && projectDetails.project_id}
          projectDetailsId={projectDetails && projectDetails.id}
          title={project && project.name}
          subtitle={"Monitoring & Evaluation Report"}
        />
      }
      redirect={false}
    >
      <SimpleShowLayout>
        <MeReportView projectDetails={projectDetails} />
      </SimpleShowLayout>
    </Show>
  );
};

export default MEReportsShow;
