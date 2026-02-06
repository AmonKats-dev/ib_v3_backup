import React, { Component } from "react";
import moment from "moment";
import classNames from "classnames";
import lodash from "lodash";
import {
  getFiscalYearsRangeForIntervals,
  romanize,
} from "../../../../../helpers/formatters";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
} from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import "../styles.css";

const filledCell = {
  backgroundColor: "blue",
  padding: "12px 0px",
  width: 150,
};

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 700,
  },
  bordered: {
    border: `1px solid ${theme.palette.border}`,
    "& td": {
      padding: "0.75rem",
      verticalAlign: "top",
      border: "1px solid #c8ced3",
    },
    "& th": {
      padding: "0.75rem",
      verticalAlign: "top",
      border: "1px solid #c8ced3",
    },
  },
  filledRow: {
    backgroundColor: theme.palette.action.hover,
    fontWeight: "bold",
  },
  filledCell: {
    background: "blue",
    padding: "12px 0px",
  },
}));

function GanttChart(props) {
  const { record, counter } = props;
  const classes = useStyles();

  function getActivitiesForOutput(outputId) {
    return (
      props.record &&
      props.record.activities &&
      props.record.activities.filter(
        (activity) => activity && activity.output_ids.includes(outputId)
      )
    );
  }
  const fiscalYearsFromProps = getFiscalYearsRangeForIntervals(
    record.start_date,
    record.end_date
  );

  return (
    <div className="landscapeSection">
      <div className="content-area">
        <h2>{romanize(counter)}. Gantt Chart</h2>
        <TableContainer>
          <Table
            size="small"
            className={clsx(
              "gantt-chart-table",
              "bordered",
              classes.bordered,
              classes.table
            )}
            style={{ width: '100%' }}
            >
            <TableBody>
              <TableRow className={classes.filledRow}>
                <TableCell style={{ textAlign: "center", width: 600 }}>
                  Output / Activity Title
                </TableCell>
                {fiscalYearsFromProps &&
                  fiscalYearsFromProps.map((item) => (
                    <TableCell style={{ width: 150 }}>{item.name}</TableCell>
                  ))}
              </TableRow>
              {record &&
                record.outputs.map((output, outputIdx) => {
                  let tableBody = [];

                  tableBody.push(
                    <TableRow className={classes.filledRow}>
                      <TableCell
                        className="title"
                        colSpan={fiscalYearsFromProps.length + 1}
                      >
                        {`Output ${outputIdx + 1}: ${output.name}`}
                      </TableCell>
                    </TableRow>
                  );

                  if (getActivitiesForOutput(output.id)) {
                    tableBody = lodash.concat(
                      tableBody,
                      getActivitiesForOutput(output.id).map(
                        (activity, activityIdx) => {
                          const startYear = moment(
                            activity.start_date,
                            "YYYY-MM-DD"
                          ).format("YYYY");
                          const endYear = moment(
                            activity.end_date,
                            "YYYY-MM-DD"
                          ).format("YYYY");
                          const activityChart = [];

                          for (
                            let index = Number(startYear);
                            index <= Number(endYear);
                            index++
                          ) {
                            activityChart.push(Number(index));
                          }

                          return (
                            <TableRow>
                              <TableCell
                                className="title"
                                style={{ width: 600 }}
                              >
                                {`Activity ${activityIdx + 1}: ${
                                  activity.name
                                }`}
                              </TableCell>
                              {fiscalYearsFromProps &&
                                fiscalYearsFromProps.map((year) => {
                                  const cellStyle = activityChart.includes(
                                    Number(year.id)
                                  )
                                    ? filledCell
                                    : { width: 150 };
                                  return (
                                    <TableCell style={cellStyle}>
                                      <div></div>
                                    </TableCell>
                                  );
                                })}
                            </TableRow>
                          );
                        }
                      )
                    );
                  }

                  return tableBody;
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default GanttChart;
