import React from "react";
import PivotTable from "react-pivottable/PivotTable";
import "react-pivottable/pivottable.css";
import TableRenderers from "react-pivottable/TableRenderers";
import Plot from "react-plotly.js";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";

import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { useDataProvider, useTranslate } from "react-admin";
import {
  Button,
  Grid,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody, 
  Typography
} from "@material-ui/core";
import ReportList from "./ReportList";
import { getLevelChain } from "./helpers";
import lodash from "lodash";
import { PROJECT_PHASES } from "../../constants/common";
import './styles.css';

// create Plotly renderers via dependency injection
const PlotlyRenderers = createPlotlyRenderers(Plot);

const tableStyle = {
  column: {
    textAlign: "center",
    verticalAlign: "middle",
  },
  row: {
    textAlign: "center",
  },
  totalRow: {
    fontWeight: "bold",
  },
  totalColumn: {
    fontWeight: "bold",
  },
};
function ReportViewer(props) {
  const [cfg, setCfg] = useState(props);
  const [data, setData] = useState([]);
  const [reports, setReports] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const appConfig = useSelector((state) => state.app.appConfig);
  const { organizational_config } = appConfig;

  useEffect(() => {
    dataProvider
      .custom("reports", { type: "pivot", method: "GET" })
      .then((response) => {
        setData(getLevelChain(response.data, organizational_config));
      });

    const loaded = JSON.parse(localStorage.getItem("REPORTS"));
    setReports(loaded);
  }, []);

  if (data.length === 0) return null;

  function handleLoad(id) {
    const loaded = JSON.parse(localStorage.getItem("REPORTS"));
    const newCfg = { ...cfg, ...loaded[id] };
    setCfg(newCfg);
    setIsLoaded(true);
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <ReportList items={reports} onLoad={handleLoad} />
        {isLoaded && (
          <PivotTable
            data={data}
            renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
            {...cfg}
          />
        )}
      </Grid>
    </Grid>
  );
}

export default ReportViewer;
