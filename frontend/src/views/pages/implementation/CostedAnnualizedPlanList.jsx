// in src/Dashboard.js
import * as React from "react";

import {
  Datagrid,
  FunctionField,
  List,
  Pagination,
  TextField,
  Title,
  TopToolbar,
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
import MeReportsShowButton from "../../resources/Projects/Actions/Show/MeReportsShowButton";
import ImplementationReportShow from "../../resources/Projects/Actions/Show/ImplementationReportShow";
import { Button } from "@material-ui/core";
import { checkFeature } from "../../../helpers/checkPermission";

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

const Actions = (props) => {
  return (
    <TopToolbar>
      <Button
        variant="outlined"
        href={`#/cost-plans/${props.match?.params?.id}/create`}
      >
        Create
      </Button>
    </TopToolbar>
  );
};

function CostedAnnualizedPlanList(props) {
  const translate = useTranslate();
  const classes = useStyles();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" style={{ margin: "20px 0px" }}>
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
            filter={{ phase_id: 7, project_status: "APPROVED" }}
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
                  checkFeature("has_pimis_fields")
                    ? record
                      ? translate(
                          `timeline.${record.project_status.toLowerCase()}`
                        )
                      : null
                    : record
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
              <ImplementationReportShow
                {...props}
                link="costed-annualized-plan"
                title="Show"
              />
            </Datagrid>
          </List>
        </Card>
      </Grid>
    </Grid>
  );
}

export default CostedAnnualizedPlanList;
