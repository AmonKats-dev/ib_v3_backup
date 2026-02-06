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
import { EXPORT_TYPES } from "../../../constants/common";
import { WorkflowStatusMessage } from "../../modules/Reports/helpers";

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

function SubmittedProjects(props) {
  const [data, setData] = useState([]);
  const translate = useTranslate();
  const classes = useStyles();
  const dataProvider = useDataProvider();

  useEffect(() => {
    //TODO: change curernt step to correct one
    dataProvider
      .custom("reports", { type: "pivot", method: "GET" })
      .then((response) => {
        if (response && response.data) {
          const filteredData = response.data.filter((item) => {
            const modifiedDate =
              item.current_project_detail &&
              moment(item.current_project_detail.modified_on);
            return (
              modifiedDate &&
              modifiedDate.isBetween(
                moment().subtract(1, "months").date(7),
                moment()
              )
            );
          });
          setData(
            lodash
              .sortBy(
                filteredData,
                (item) =>
                  item.current_project_detail &&
                  moment(item.current_project_detail.modified_on)
              )
              .reverse()
          );
        }
      });

    // dataProvider
    //   .getListOfAll("projects", { filter: { current_step: 3 } })
    //   .then((response) => {
    //     if (response && response.data) {
    //       const filteredData = response.data.filter((item) => {
    //         const modifiedDate = moment(item.modified_on);
    //         return modifiedDate.isBetween(
    //           moment().subtract(1, "months").date(7),
    //           moment()
    //         );
    //       });
    //       setData(filteredData);
    //     }
    //   });
  }, []);

  return (
    <Grid container spacing={3}>
      <ExportActions
        reportId="report-container"
        title="Project submitted by the 7th of month"
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
            <Table>
              <TableHead>
                <TableRow className={classes.filledRow}>
                  <TableCell width="100px">ID</TableCell>
                  <TableCell className={classes.titleColumn}>Title</TableCell>
                  <TableCell align="center">Phase</TableCell>
                  <TableCell align="center">Start Date</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Cost</TableCell>
                  <TableCell align="center">Last Modified</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((project) => (
                  <TableRow>
                    <TableCell>{project.code}</TableCell>
                    <TableCell>{project.name}</TableCell>
                    <TableCell align="center">
                      {project.phase && project.phase.name}
                    </TableCell>
                    <TableCell align="center">
                      {project.current_project_detail &&
                        getFiscalYearValue(
                          project.current_project_detail.created_on
                        ).name}
                    </TableCell>
                    <TableCell align="center">
                      {project.workflow && (
                        <WorkflowStatusMessage record={project} />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {project.costs &&
                        costSumFormatter(calculateCost(project.costs))}
                    </TableCell>
                    <TableCell align="center">
                      {project.current_project_detail &&
                        dateFormatter(
                          project.current_project_detail.modified_on
                        )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </Grid>
    </Grid>
  );
}

export default SubmittedProjects;
