import React from "react";
import { Grid, Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import BarChartDrill from "../components/Charts/BarChartDrill";
import BarChartPrograms from "../components/Charts/BarChartPrograms";
import { checkFeature } from "../../../helpers/checkPermission";
import { useDataProvider } from "react-admin";
import { makeStyles } from "@material-ui/core";

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

function ProjectsCostsChart(props) {
  const classes = useStyles();
  const [dataPivot, setDataPivot] = React.useState([]);
  const [organizations, setOrganizations] = React.useState([]);
  const [programs, setPrograms] = React.useState([]);
  const dataProvider = useDataProvider();

  React.useEffect(() => {
    dataProvider
      .custom("reports", { type: "pivot", method: "GET" })
      .then((response) => {
        if (response) {
          setDataPivot(response.data);
        }
      });
    dataProvider
      .getListOfAll("organizations", {
        filter: { is_hidden: false },
      })
      .then((response) => {
        if (response) {
          setOrganizations(response.data);
        }
      });
    dataProvider.getListOfAll("programs", {}).then((response) => {
      if (response) {
        setPrograms(response.data);
      }
    });
  }, []);

  return (
    <Grid item xs={6}>
      <Typography className={classes.title}>Projects Costing</Typography>
      <Card style={{ width: "100%", height: "460px" }}>
        {checkFeature("has_pimis_fields") ? (
          <BarChartDrill
            data={dataPivot}
            items={organizations}
            dimension="project_organization"
            measure="cost"
            field="organization_id"
          />
        ) : (
          <BarChartPrograms
            data={dataPivot}
            items={programs}
            dimension="program"
            measure="cost"
            field="program_id"
          />
        )}
      </Card>
    </Grid>
  );
}

export default ProjectsCostsChart;
