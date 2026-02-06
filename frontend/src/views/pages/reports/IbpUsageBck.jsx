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
import CustomProjectsList from "./CustomProjectsList";
import ExportActions from "./ExportActions";
import { EXPORT_TYPES } from "../../../constants/common";

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

function IbpUsage(props) {
  const [data, setData] = React.useState([]);
  const [dataPivot, setDataPivot] = React.useState([]);
  const [organizations, setOrganizations] = React.useState([]);
  const translate = useTranslate();
  const classes = useStyles();
  const dataProvider = useDataProvider();

  return (
    <Grid container spacing={3}>
      <ExportActions
        reportId="report-container"
        title="IBP User Action Tracking Report"
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
        <Card>
          <List
            {...props}
            basePath="/projects"
            resource="projects"
            bulkActionButtons={false}
            actions={false}
            perPage={100}
            filter={{ expand: "timeline" }} //TODO add last step workflow
            sort={{ field: "id", order: "DESC" }}
          >
            <CustomProjectsList grouppedBySector />
          </List>
        </Card>
      </Grid>
    </Grid>
  );
}

export default IbpUsage;
