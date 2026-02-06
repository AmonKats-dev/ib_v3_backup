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
  Typography,
  Select,
  MenuItem,
} from "@material-ui/core";
import { getLevelChain } from "../helpers";
import lodash from "lodash";
import { PROJECT_PHASES } from "../../../constants/common";

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
function MeReport(props) {
  const [data, setData] = useState([]);
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const appConfig = useSelector((state) => state.app.appConfig);
  const { organizational_config } = appConfig;

  useEffect(() => {
    dataProvider
      .custom("reports", { type: "pivot", method: "GET" })
      .then((response) => {
        if (response && response.data){
          setData(getLevelChain(response.data, organizational_config));
        }
      });
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h2" align="center">
          Cost, Scope, Time Deviation
        </Typography>
        <div>
          <Select placeholder="Sector">
            <MenuItem>Test</MenuItem>
          </Select>
        </div>
        {/* <Typography variant="h4" align="center">
          description
        </Typography> */}
        <div class="content-wrapper">
          <section class="content">
            <div class="project-view box box-primary">
              <div class="box-body table-responsive no-padding">
                <Table
                  id="w0"
                  class="table table-striped table-bordered detail-view"
                >
                  <TableBody>
                    <TableRow>
                      <TableCell>Implementing Agency</TableCell>
                      <TableCell>UNRA</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Project Name</TableCell>
                      <TableCell>Masaka-Bukakata Road</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Start date</TableCell>
                      <TableCell>2015-01-01</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>End date</TableCell>
                      <TableCell>2020-01-01</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Year in progress</TableCell>
                      <TableCell>3</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Overall estimated project cost</TableCell>
                      <TableCell>UGX 150 bln</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        Budget appropriation for current year
                      </TableCell>
                      <TableCell>UGX 30 bln</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Actual budget release to date</TableCell>
                      <TableCell>UGX 90 bln</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <Table class="table table-striped table-bordered detail-view">
                  <TableRow>
                    <TableCell colspan="2" align="center">
                      <b>Physical Progress</b>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Expected: 70%</TableCell>
                    <TableCell>Actual: 60%</TableCell>
                  </TableRow>
                </Table>

                <Table class="table table-striped table-bordered detail-view">
                  <TableRow>
                    <TableCell colspan="3" align="center">
                      <b>Outputs progress</b>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Total: 25 km of asphalt road constructed
                    </TableCell>
                    <TableCell>
                      Expected to date: 18 km of asphalt road constructed
                    </TableCell>
                    <TableCell>
                      Actual: 16 km of asphalt road constructed
                    </TableCell>
                  </TableRow>
                </Table>

                <div>
                  <h3>MTEF</h3>
                </div>
                <Table class="table table-striped table-bordered detail-view">
                  <TableHead>
                    <TableRow>
                      <TableCell class="tg-0lax" colspan="10" align="center">
                        <b>GoU ({translate('titles.currency')})</b>
                      </TableCell>
                      <TableCell class="tg-0lax" colspan="10" align="center">
                        <b>External Sources ({translate('titles.currency')})</b>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell class="tg-0lax" colspan="5" align="center">
                        FY Budget Estimates
                      </TableCell>
                      <TableCell class="tg-0lax" colspan="5" align="center">
                        FY Actual Releases
                      </TableCell>
                      <TableCell class="tg-0lax" colspan="5" align="center">
                        FY Budget Estimates
                      </TableCell>
                      <TableCell class="tg-0lax" colspan="5" align="center">
                        FY Actual Releases
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableRow>
                    <TableCell class="tg-0lax">2015</TableCell>
                    <TableCell class="tg-0lax">2016</TableCell>
                    <TableCell class="tg-0lax">2017</TableCell>
                    <TableCell class="tg-0lax">2018</TableCell>
                    <TableCell class="tg-0lax">2019</TableCell>
                    <TableCell class="tg-0lax">2015</TableCell>
                    <TableCell class="tg-0lax">2016</TableCell>
                    <TableCell class="tg-0lax">2017</TableCell>
                    <TableCell class="tg-0lax">2018</TableCell>
                    <TableCell class="tg-0lax">2019</TableCell>
                    <TableCell class="tg-0lax">2015</TableCell>
                    <TableCell class="tg-0lax">2016</TableCell>
                    <TableCell class="tg-0lax">2017</TableCell>
                    <TableCell class="tg-0lax">2018</TableCell>
                    <TableCell class="tg-0lax">2019</TableCell>
                    <TableCell class="tg-0lax">2015</TableCell>
                    <TableCell class="tg-0lax">2016</TableCell>
                    <TableCell class="tg-0lax">2017</TableCell>
                    <TableCell class="tg-0lax">2018</TableCell>
                    <TableCell class="tg-0lax">2019</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell class="tg-0lax">1.04</TableCell>
                    <TableCell class="tg-0lax">1.04</TableCell>
                    <TableCell class="tg-0lax">1.04</TableCell>
                    <TableCell class="tg-0lax">1.04</TableCell>
                    <TableCell class="tg-0lax">1.04</TableCell>
                    <TableCell class="tg-0lax">0.78</TableCell>
                    <TableCell class="tg-0lax">0.78</TableCell>
                    <TableCell class="tg-0lax">0.78</TableCell>
                    <TableCell class="tg-0lax">0</TableCell>
                    <TableCell class="tg-0lax">0</TableCell>
                    <TableCell class="tg-0lax">8.3</TableCell>
                    <TableCell class="tg-0lax">8.3</TableCell>
                    <TableCell class="tg-0lax">8.3</TableCell>
                    <TableCell class="tg-0lax">8.3</TableCell>
                    <TableCell class="tg-0lax">8.3</TableCell>
                    <TableCell class="tg-0lax">8.3</TableCell>
                    <TableCell class="tg-0lax">8.3</TableCell>
                    <TableCell class="tg-0lax">8.3</TableCell>
                    <TableCell class="tg-0lax">0</TableCell>
                    <TableCell class="tg-0lax">0</TableCell>
                  </TableRow>
                </Table>

                <hr />
                <Table class="table table-striped table-bordered detail-view">
                  <TableRow>
                    <TableCell colspan="4" align="center">
                      <b>
                        Current implementation progress/Actions in the year
                        under review
                      </b>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center">
                      <b>Q1</b>
                    </TableCell>
                    <TableCell align="center">
                      <b>Q2</b>
                    </TableCell>
                    <TableCell align="center">
                      <b>Q3</b>
                    </TableCell>
                    <TableCell align="center">
                      <b>Q4</b>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Construction of 10th km</TableCell>
                    <TableCell>Construction of 11th km</TableCell>
                    <TableCell>Construction of 12th km</TableCell>
                    <TableCell>
                      Final paving and commissioning of the section
                    </TableCell>
                  </TableRow>
                </Table>
              </div>
              <hr />
              <Table class="table table-striped table-bordered detail-view">
                <TableBody>
                  <TableRow>
                    <TableCell>Donor name</TableCell>
                    <TableCell>World Bank</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Key implementation challenges</TableCell>
                    <TableCell>Time and treasury disbursement delays</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Necessary corrective actions</TableCell>
                    <TableCell>Improved disbursement rate</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Remarks</TableCell>
                    <TableCell>None</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </section>
        </div>
      </Grid>
    </Grid>
  );
}

export default MeReport;
