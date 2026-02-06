import "../Report/styles.css";

import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { ActivitiesInvestments } from "../Report/components/ActivitiesInvestments";
import { AdditionalInformation } from "../Report/components/AdditionalInformation";
import { ExecutiveSummary } from "../Report/components/ExecutiveSummary";
import GantChart from "../Report/components/GantChart";
import { ImplementingAgencies } from "../Report/components/ImplementingAgencies";
import { Introduction } from "./Introduction";
import { OMCosts } from "../Report/components/OMCosts";
import { OptionsAppraisal } from "../Report/components/OptionsAppraisal";
import { ProjectBackGround } from "../Report/components/ProjectBackGround";
import { ProposedFunding } from "../Report/components/ProposedFunding";
import { ResultMatrix } from "../Report/components/ResultMatrix";
import { useDataProvider } from "react-admin";
import PageBreak from "../Report/components/PageBreak";
import { ProjectInformation } from "./ProjectInformation";
import { Accomplishments } from "./Accomplishments";
import { BudgetPerformance } from "./BudgetPerformance";
import { Challenges } from "./Challenges ";
import { Recommendations } from "./Recommendations ";
import { PostProjectTasks } from "./PostProjectTasks";
import { Sustainability } from "./Sustainability";
import { Card } from "@material-ui/core";
import { formatValuesToQuery } from "../../../../helpers/dataHelpers";

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

function CompletionReport(props) {
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
        <ExecutiveSummary
          counter="1"
          {...props}
          customRecord={projectDetails}
        />
        <PageBreak />

        <Introduction counter="1" {...props} customRecord={projectDetails} />
        <PageBreak />

        <Accomplishments counter="2" {...props} customRecord={projectDetails} />
        <PageBreak />

        <BudgetPerformance
          counter="3"
          {...props}
          customRecord={projectDetails}
        />
        <PageBreak />

        <Challenges counter="4" {...props} customRecord={projectDetails} />
        <PageBreak />

        <Recommendations counter="5" {...props} customRecord={projectDetails} />
        <PageBreak />

        <PostProjectTasks
          counter="6"
          {...props}
          customRecord={projectDetails}
        />
        <PageBreak />

        <Sustainability counter="7" {...props} customRecord={projectDetails} />
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

export default CompletionReport;
