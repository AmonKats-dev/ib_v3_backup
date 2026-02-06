// in src/Dashboard.js
import React, { useEffect, useState } from "react";

import { useDataProvider, useTranslate } from "react-admin";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import moment from "moment";
import Card from "@material-ui/core/Card";
import { costSumFormatter, dateFormatter } from "../../../helpers";
import lodash from "lodash";
import { makeStyles } from "@material-ui/core";
import ExportActions from "./ExportActions";
import { getFiscalYearValue } from "../../../helpers/formatters";
import { calculateCost, getProjectsBySectors } from "./helpers";
import {
  EXPORT_TYPES,
  PROJECT_CLASSIFICATION,
} from "../../../constants/common";

const useStyles = makeStyles((theme) => ({
  topGroup: {
    display: "flex",
    justifyContent: "space-around",
  },
  title: {
    fontWeight: "bold",
    margin: "10px auto",
  },
  subtitle: {
    margin: "10px auto",
  },
  buttonsContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "10px 25px",
  },
  buttons: {
    width: "100px",
    fontSize: "16px",
    display: "flex",
    justifyContent: "space-around",
  },
  titleColumn: {
    width: "35%",
  },
}));

function ProjectCategories(props) {
  const [data, setData] = useState([]);
  const translate = useTranslate();
  const classes = useStyles();
  const dataProvider = useDataProvider();

  useEffect(() => {
    dataProvider
      .custom("reports", { type: "pivot", method: "GET" })
      .then((response) => {
        if (response && response.data) {
          const filteredData = lodash.groupBy(response.data, (project) => {
            return project?.current_project_detail?.classification;
          });
          setData(filteredData);
        }
      });
  }, []);

  function getTotalCost(costs) {
    if (costs) {
      let totalCost = 0;

      lodash.keys(costs).forEach((year) => {
        totalCost += parseFloat(costs[year]);
      });

      return costSumFormatter(totalCost);
    }

    return "-";
  }

  return (
    <Grid container spacing={3}>
      <ExportActions
        reportId="report-container"
        title={translate(
          `resources.${props.location.pathname.slice(
            1,
            props.location.pathname.length
          )}.name`
        )}
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
          {data.length === 0 ? (
            <Box textAlign="center" m={3}>
              <Typography variant="h5" paragraph>
                No projects are in this status
              </Typography>
            </Box>
          ) : (
            <div>
              {lodash.keys(data).map((group) => {
                return (
                  <>
                    <Table>
                      <TableHead>
                        <TableRow className={classes.filledRow}>
                          <TableCell>
                            <Typography
                              variant="h4"
                              style={{
                                fontWeight: "bold",
                                textTransform: "uppercase",
                              }}
                            >
                              {PROJECT_CLASSIFICATION[group] || "Unclassified"}
                            </Typography>
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                        <TableRow className={classes.filledRow}>
                          <TableCell width="150px">ID</TableCell>
                          <TableCell width="200px">Title</TableCell>
                          <TableCell width="100px" align="center">
                            Phase
                          </TableCell>
                          <TableCell width="100px" align="center">
                            Start Date
                          </TableCell>
                          <TableCell width="200px" align="center">
                            Program
                          </TableCell>
                          <TableCell width="200px" align="center">
                            Vote
                          </TableCell>
                          <TableCell width="200px" align="center">
                            Cost ({translate("titles.currency")})
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data[group].map((project) => (
                          <TableRow>
                            <TableCell>{project.code}</TableCell>
                            <TableCell>{project.name}</TableCell>
                            <TableCell align="center">
                              {project.phase && project.phase.name}
                            </TableCell>
                            <TableCell align="center">
                              {getFiscalYearValue(project.created_on).name}
                            </TableCell>
                            <TableCell align="center">
                              {project.program && project.program.name}
                            </TableCell>
                            <TableCell align="center">
                              {project.project_organization &&
                                project.project_organization.parent &&
                                project.project_organization.parent.name}
                            </TableCell>
                            <TableCell align="center">
                              {getTotalCost(project.costs)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </>
                );
              })}
            </div>
          )}
        </Card>
      </Grid>
    </Grid>
  );
}

export default ProjectCategories;
