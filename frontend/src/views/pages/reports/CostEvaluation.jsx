// in src/Dashboard.js
import * as React from "react";

import {
  Datagrid,
  FunctionField,
  List,
  Pagination,
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
import AsideChart from "./AsideChart";
import ExportActions from "./ExportActions";
import { EXPORT_TYPES } from "../../../constants/common";
import { getFeatureValue } from "../../../helpers/checkPermission";

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
  card: {
    width: "100%",
  },
}));

const EmptyDashboard = (props) => {
  const { loading, loaded, total } = props;
  if (total === 0 && !loading && loaded) {
    return (
      <Box textAlign="center" m={3}>
        <Typography variant="h5" paragraph>
          No projects
        </Typography>
      </Box>
    );
  }
  return <Pagination {...props} />;
};

function CostEvaluation(props) {
  const translate = useTranslate();
  const classes = useStyles();
  const dataProvider = useDataProvider();
  const PIPELINE_PHASE_ID = getFeatureValue("has_pipeline_report") || -1;

  return (
    <Grid container spacing={3}>
      <ExportActions
        reportId="report-container"
        title="Cost Evolution Report"
        exportTypes={[EXPORT_TYPES.WORD, EXPORT_TYPES.PDF, EXPORT_TYPES.XLS]}
      />
      <Grid item xs={12} id="report-container">
        <Typography variant="h4" style={{ marginBottom: 20 }}>
          {translate(
            `resources.${props.location.pathname.slice(
              1,
              props.location.pathname.length
            )}.name`
          )}
        </Typography>
        <Card className={classes.card}>
          <List
            {...props}
            basePath="/projects"
            resource="projects"
            bulkActionButtons={false}
            actions={false}
            filter={{ phase_id: PIPELINE_PHASE_ID }}
            sort={{ field: "id", order: "DESC" }}
            pagination={<EmptyDashboard />}
          >
            <Datagrid rowClick={"show"} expand={<AsideChart {...props} />}>
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
            </Datagrid>
          </List>
        </Card>
      </Grid>
    </Grid>
  );
}

export default CostEvaluation;
