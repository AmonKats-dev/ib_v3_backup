import "../Report/styles.css";

import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDataProvider } from "react-admin";
import PageBreak from "../Report/components/PageBreak";
import { ProjectInformation } from "./ProjectInformation";
import { Card } from "@material-ui/core";

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

function ContingencyLiabilityReport(props) {
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
          setProjectDetails(resp.data);
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

  return !projectDetails || !project ? null : (
    <Card style={{ padding: "30px" }}>
      <div id="docx" className="export_container">
        <ProjectInformation
          {...props}
          details={projectDetails}
          project={project}
        />
        <PageBreak />
      </div>
    </Card>
  );
}

export default ContingencyLiabilityReport;
