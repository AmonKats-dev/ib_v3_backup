// in src/Dashboard.js
import * as React from "react";

import {
  Datagrid,
  Filter,
  FunctionField,
  List,
  Pagination,
  ReferenceInput,
  SelectInput,
  TextField,
  Title,
  useDataProvider,
  useTranslate,
} from "react-admin";
import { Grid, Typography } from "@material-ui/core";

import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { dateFormatter } from "../../../helpers";
import lodash from "lodash";
import { makeStyles } from "@material-ui/core";
import ExportActions from "./ExportActions";
import { EXPORT_TYPES } from "../../../constants/common";
import { WorkflowStatusMessage } from "../../modules/Reports/helpers";

const useStyles = makeStyles((theme) => ({
  topGroup: {
    display: "flex",
    justifyContent: "space-around",
  },
  title: {
    textAlign: "left",
    fontSize: "15px",
    fontWeight: "bold",
    paddingLeft: "30px",
    margin: "10px auto",
  },
}));

const EmptyDashboard = (props) => {
  const { loading, loaded, total } = props;
  if (total === 0 && !loading && loaded) {
    return (
      <Box textAlign="center" m={3}>
        <Typography variant="h5" paragraph>
          No projects are in this status
        </Typography>
      </Box>
    );
  }
  return <Pagination {...props} />;
};

const ProjectsFilters = (props) => {
  return (
    <Filter {...props} variant="outlined" margin="none">
      <ReferenceInput
        perPage={-1}
        source="workflow_id"
        reference="workflows"
        allowEmpty
        alwaysOn
        label="Workflow Status"
      >
        <SelectInput optionText="status_msg" style={{ width: "350px" }} />
      </ReferenceInput>
    </Filter>
  );
};

function WaitingProjects(props) {
  const translate = useTranslate();
  const classes = useStyles();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" style={{ marginBottom: 20 }}>
          {translate(
            `resources.${props.location.pathname.slice(
              1,
              props.location.pathname.length
            )}.name`
          )}
        </Typography>
        <List
          {...props}
          basePath="/projects"
          resource="projects"
          bulkActionButtons={false}
          actions={
            <ExportActions
              reportId="report-container"
              title="Projects waiting for User action"
              exportTypes={[
                EXPORT_TYPES.WORD,
                EXPORT_TYPES.PDF,
                EXPORT_TYPES.XLS,
              ]}
            />
          }
          pagination={<EmptyDashboard />}
          filters={<ProjectsFilters {...props} />}
          perPage={20}
          sort={{ field: "id", order: "DESC" }}
        >
          <Datagrid rowClick={"show"} id="report-container">
            <TextField source="code" />
            <TextField source="name" />
            <FunctionField
              source="created_on"
              label={translate(`resources.projects.fields.created_at`)}
              render={(record) =>
                record ? dateFormatter(record.created_on) : null
              }
            />
            <FunctionField
              source="status"
              label={translate(`resources.projects.fields.status`)}
              render={(record) =>
                record
                  ? translate(`timeline.${record.project_status.toLowerCase()}`)
                  : null
              }
            />
            <FunctionField
              source="status"
              label={translate(`resources.projects.fields.phase_id`)}
              render={(record) =>
                record ? record.phase && record.phase.name : null
              }
            />
            <FunctionField
              source="status"
              label={translate(`resources.projects.fields.workflow_status`)}
              render={(record) =>
                record
                  ? record.workflow && <WorkflowStatusMessage record={record} />
                  : null
              }
            />
          </Datagrid>
        </List>
      </Grid>
    </Grid>
  );
}

export default WaitingProjects;
