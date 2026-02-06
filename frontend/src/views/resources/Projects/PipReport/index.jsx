import "../Report/styles.css";

import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDataProvider } from "react-admin";
import PageBreak from "../Report/components/PageBreak";
import { ProjectInformation } from "./ProjectInformation";
import { Card } from "@material-ui/core";
import { BackgroundInfo } from "./BackgroundInfo";
import { ProjectFundingAllocation } from "./ProjectFundingAllocation";
import { SummaryProjectEstimates } from "./SummaryProjectEstimates";
import { Recommendations } from "./Recommendations";
import { ProcurementPlan } from "./ProcurementPlan";
import { CostAnnualizedPlan } from "./CostAnnualizedPlan";
import { RiskManagement } from "./RiskManagement";
import { StakeholderEngagement } from "./StakeholderEngagement";
import { HumanResourcesManagement } from "./HumanResourcesManagement";
import {
  formatValuesToQuery,
  parseQueryToValues,
} from "../../../../helpers/dataHelpers";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    paddingTop: theme.spacing(8),
  },
  ganttChartTable: {
    "& th": {
      borderLeft: "3px solid #c8ced3",
    },

    "& td": {
      padding: "3px 0px !important",
      borderLeft: "1px solid #c8ced3",
    },

    "& .title": {
      paddingLeft: "15px !important",
    },

    "& .filledCell": {
      background: "blue",
      padding: "12px 0px",
    },
  },
  button: {
    marginLeft: 15,
  },
}));

function PipReport(props) {
  const [projectDetails, setProjectDetails] = useState(null);
  const [project, setProject] = useState(null);
  const dataProvider = useDataProvider();

  useEffect(() => {
    dataProvider
      .getOne("project-details", {
        id: props.match?.params?.id,
      })
      .then((resp) => {
        if (resp && resp.data) {
          setProjectDetails(formatValuesToQuery(resp.data));
        }
      });
  }, []);

  useEffect(() => {
    if (projectDetails) {
      dataProvider
        .getOne("projects", {
          id: projectDetails.project_id,
        })
        .then((resp) => {
          if (resp && resp.data) {
            setProject(resp.data);
          }
        });
    }
  }, [projectDetails]);

  function renderFS() {
    return (
      <div>
        <BackgroundInfo
          {...props}
          counter="1"
          details={projectDetails}
          project={project}
        />
        <PageBreak />

        <ProjectFundingAllocation
          {...props}
          counter="2"
          details={projectDetails}
          project={project}
        />
        <PageBreak />

        <SummaryProjectEstimates
          counter="3"
          {...props}
          details={projectDetails}
          project={project}
        />
        <PageBreak />

        <Recommendations
          counter="4"
          {...props}
          details={projectDetails}
          project={project}
        />
        <PageBreak />

        <ProcurementPlan
          counter="5"
          {...props}
          details={projectDetails}
          project={project}
        />
        <PageBreak />

        <CostAnnualizedPlan
          counter="6"
          {...props}
          details={projectDetails}
          project={project}
        />
        <PageBreak />

        <RiskManagement
          counter="7"
          {...props}
          details={projectDetails}
          project={project}
        />
        <PageBreak />

        <StakeholderEngagement
          counter="8"
          {...props}
          details={projectDetails}
          project={project}
        />
        <PageBreak />

        <HumanResourcesManagement
          counter="9"
          {...props}
          details={projectDetails}
          project={project}
        />
        <PageBreak />
      </div>
    );
  }

  return !projectDetails || !project ? null : (
    <Card style={{ padding: "30px" }}>
      <div id="docx" className="export_container">
        <ProjectInformation
          {...props}
          details={projectDetails}
          project={project}
        />
        <PageBreak />
        {renderFS()}
      </div>
    </Card>
  );
}

export default PipReport;
