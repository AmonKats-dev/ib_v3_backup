// in src/Dashboard.js
import { Grid, makeStyles, Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import { EditOutlined, Visibility } from "@material-ui/icons";
import * as React from "react";
import {
  Button,
  Datagrid,
  FunctionField,
  List,
  Pagination,
  TextField,
  useTranslate,
} from "react-admin";
import { dateFormatter } from "../../../helpers";

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
          No projects are in Pipeline status
        </Typography>
      </Box>
    );
  }
  return <Pagination {...props} />;
};

function CompletionReportList(props) {
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
        <Card>
          <List
            {...props}
            basePath="/projects"
            resource="projects"
            bulkActionButtons={false}
            actions={false}
            filter={{ phase_id: 7, project_status: "COMPLETED" }}
            pagination={<EmptyDashboard />}
            sort={{ field: "id", order: "DESC" }}
          >
            <Datagrid rowClick={false}>
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
                    ? translate(
                        `timeline.${record.project_status.toLowerCase()}`
                      )
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
                render={(record) => {
                  if (!record) return null;
                  const href = record.project_completion
                    ? `#/project-completion/${record.project_completion.id}/show`
                    : `#/project-completion/${record.current_project_detail.id}/create`;
                  const icon = record.project_completion ? (
                    <Visibility />
                  ) : (
                    <EditOutlined />
                  );
                  return (
                    <Button
                      href={href}
                      label="Completion Report"
                      startIcon={icon}
                    />
                  );
                }}
              />
            </Datagrid>
          </List>
        </Card>
      </Grid>
    </Grid>
  );
}

export default CompletionReportList;
