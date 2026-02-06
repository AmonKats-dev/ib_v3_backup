import React from "react";
import PivotTableUI from "react-pivottable/PivotTableUI";
import PivotTable from "react-pivottable/PivotTable";
import "react-pivottable/pivottable.css";
import TableRenderers from "react-pivottable/TableRenderers";
import Plot from "react-plotly.js";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";

import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { useDataProvider } from "react-admin";
import lodash from "lodash";
import { Button, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ConfirmDialog from "./ConfirmDialog";
import { getLevelChain } from "./helpers";
import ReportList from "./ReportList";
import { set } from "numeral";
import ReportListBuilder from "./ReportListBuilder";

// create Plotly renderers via dependency injection
const PlotlyRenderers = createPlotlyRenderers(Plot);

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    width: "80%",
    maxHeight: 435,
  },
  button: {
    margin: 10,
  },
}));

function ReportBuilder(props) {
  const [cfg, setCfg] = useState(props);
  const [data, setData] = useState([]);
  const dataProvider = useDataProvider();
  const [reports, setReports] = useState([]);

  const appConfig = useSelector((state) => state.app.appConfig);
  const { organizational_config } = appConfig;

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [selected, setSelected] = React.useState(false);

  const handleCreate = () => {
    const newState = {
      cols: [],
      rows: [],
      vals: [],
    };
    setCfg({ ...cfg, ...newState });
  };
  const handleClose = (newValue) => {
    setOpen(false);

    if (newValue) {
      setValue(newValue);
      const saveTo = {
        [newValue.name]: {
          description: newValue.description,
          title: newValue.title,
          cols: cfg.cols,
          rows: cfg.rows,
          aggregatorName: cfg.aggregatorName,
          vals: cfg.vals,
        },
      };
      const loaded = JSON.parse(localStorage.getItem("REPORTS"));

      localStorage.setItem("REPORTS", JSON.stringify({ ...loaded, ...saveTo }));
    }
  };

  useEffect(() => {
    dataProvider
      .custom("reports", { type: "pivot", method: "GET" })
      .then((response) => {
        setData(getLevelChain(response.data, organizational_config));
      });

    const loaded = JSON.parse(localStorage.getItem("REPORTS"));
    setReports(loaded);
  }, []);

  useEffect(() => {
    const loaded = JSON.parse(localStorage.getItem("REPORTS"));
    setReports(loaded);
  }, [open]);

  if (data.length === 0) return null;

  function showConfirm() {
    setOpen(true);
  }

  function handleLoad(id) {
    const loaded = JSON.parse(localStorage.getItem("REPORTS"));
    const newCfg = { ...cfg, ...loaded[id] };
    setCfg(newCfg);
    setSelected(id);
  }

  function handleSave() {
    const loaded = JSON.parse(localStorage.getItem("REPORTS"));
    const saveTo = {
      [selected]: {
        ...loaded[selected],
        cols: cfg.cols,
        rows: cfg.rows,
        aggregatorName: cfg.aggregatorName,
        vals: cfg.vals,
      },
    };
    localStorage.setItem("REPORTS", JSON.stringify({ ...loaded, ...saveTo }));

    setReports(
      { ...loaded, ...saveTo }
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Button
          className={classes.button}
          variant="contained"
          onClick={handleCreate}
        >
          Create new
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          onClick={showConfirm}
        >
          Save config
        </Button>
        <ReportListBuilder
          items={reports}
          onLoad={handleLoad}
          onSave={handleSave}
        />
        <br/>
         <PivotTableUI
          data={data}
          onChange={(s) => setCfg(s)}
          renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
          {...cfg}
        />
        <ConfirmDialog
          classes={{
            paper: classes.paper,
          }}
          id="save-menu"
          keepMounted
          open={open}
          onClose={handleClose}
          value={value}
        />
      </Grid>
      
    </Grid>
  );
}

export default ReportBuilder;
