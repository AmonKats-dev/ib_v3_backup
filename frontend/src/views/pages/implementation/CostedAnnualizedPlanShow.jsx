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
import { Button, Grid, Paper, Typography } from "@material-ui/core";
import LocalAtmOutlinedIcon from "@material-ui/icons/LocalAtmOutlined";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { dateFormatter } from "../../../helpers";
import lodash from "lodash";
import { makeStyles } from "@material-ui/core";
import MeReportsShowButton from "../../resources/Projects/Actions/Show/MeReportsShowButton";
import ImplementationReportShow from "../../resources/Projects/Actions/Show/ImplementationReportShow";
import { CostAnnualizedPlan } from "../../resources/Projects/PipReport/CostAnnualizedPlan";
import { formatValuesToQuery } from "../../../helpers/dataHelpers";

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
  button: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 35,
    margin: 15,
    "&:hover > $buttonTitle,": {
      display: "none",
    },
    "&:hover > $actions,": {
      display: "flex",
    },
  },
  content: {
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
    padding: 25
  },
}));

function CostedAnnualizedPlanShow(props) {
  const translate = useTranslate();
  const classes = useStyles();

  const [projectDetails, setProjectDetails] = React.useState(null);
  const dataProvider = useDataProvider();

  React.useEffect(() => {
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

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} >
        <Card  style={{ padding: 20 }}>
          <CostAnnualizedPlan details={projectDetails} />
        </Card>
      </Grid>
    </Grid>
  );
}

export default CostedAnnualizedPlanShow;
