// in src/Dashboard.js
import { Grid, makeStyles, Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import * as React from "react";
import {
  Datagrid,
  FunctionField,
  List,
  Pagination,
  TextField,
  useTranslate,
} from "react-admin";
import { dateFormatter } from "../../../helpers";
import { checkFeature } from "../../../helpers/checkPermission";
import MeReportsShowButton from "../../resources/Projects/Actions/Show/MeReportsShowButton";

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

function QuarterlyAnnualReport(props) {
  const translate = useTranslate();

  const filters = checkFeature("has_pimis_fields")
    ? { phase_id: 4, current_step: 17 }
    : { phase_id: 7 };

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
            sort={{ field: "id", order: "DESC" }}
            resource="projects"
            bulkActionButtons={false}
            actions={false}
            filter={filters}
            pagination={<EmptyDashboard />}
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
                    ? record.project_status === "APPROVED"
                      ? translate(`timeline.draft`)
                      : translate(
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
              <MeReportsShowButton {...props} />
            </Datagrid>
          </List>
        </Card>
      </Grid>
    </Grid>
  );
}

export default QuarterlyAnnualReport;
