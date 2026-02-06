import React from "react";
import HTML2React from "html2react";
import lodash from "lodash";
import {
  getFiscalYearsRangeForIntervals,
  romanize,
} from "../../../../../helpers/formatters";
import { costSumFormatter } from "../helpers";
import { useTranslate } from "react-admin";
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
import {
  formatValuesToQuery,
  parseQueryToValues,
} from "../../../../../helpers/dataHelpers";

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
}));

export const ActivitiesInvestments = (props) => {
  const classes = useStyles();
  const translate = useTranslate();
  const { customRecord, customBasePath } = props;
  const record = formatValuesToQuery(customRecord);
  let totalAll = {};
  let allCosts = 0;
  const counter = props.counter || 4;
  // let fiscalYearsFromProps;

  const fiscalYearsFromProps = getFiscalYearsRangeForIntervals(
    record.start_date,
    record.end_date
  );

  if (!record) {
    return null;
  }

  function getActivitiesForOutput(outputId) {
    return record.activities.filter((activity) =>
      activity.output_ids.includes(outputId)
    );
  }

  return (
    <div className="landscapeSection">
      <div className="content-area">
        <h2>
          {props.title ? (
            props.title
          ) : (
            <>
              {romanize(counter)}. {translate("printForm.investments.title")}
            </>
          )}
        </h2>
        <TableContainer>
          <Table
            size="small"
            className={clsx("bordered", classes.bordered, classes.table)}
            style={{ width: "100%" }}
          >
            <TableBody>
              <TableRow className={classes.filledRow}>
                <TableCell rowSpan="2" style={{ width: 55 }}></TableCell>
                <TableCell rowSpan="2" style={{ width: 75 }}>
                  {translate("printForm.investments.code")}
                </TableCell>
                <TableCell rowSpan="2">
                  {" "}
                  {translate("printForm.investments.name")}
                </TableCell>
                <TableCell colSpan={fiscalYearsFromProps.length}>
                  Period
                </TableCell>
                <TableCell rowSpan="2" style={{ width: 130 }}>
                  {translate("printForm.investments.total")}
                </TableCell>
                <TableCell rowSpan="2" style={{ width: 130 }}>
                  {translate("printForm.investments.funds")}
                </TableCell>
              </TableRow>
              <TableRow className={classes.filledRow}>
                {/* <TableCell colSpan="2">
                  {translate("printForm.investments.invest_title")}
                </TableCell> */}
                {fiscalYearsFromProps.map((year) => (
                  <TableCell style={{ width: 100 }}>{year.name}</TableCell>
                ))}
              </TableRow>
              {record.outputs.map((output, outputIdx) => {
                const outputsData = [];
                const outputTotal = {};
                let totalOutput = 0;

                const activities = getActivitiesForOutput(output.id).map(
                  (activity, activityIdx) => {
                    let activityTotal = 0;
                    return [
                      <TableRow>
                        <TableCell>
                          {romanize(`${outputIdx + 1}.${activityIdx + 1}`)}
                        </TableCell>
                        <TableCell colSpan="2">
                          {`${translate(
                            "printForm.project_framework.activity",
                            {
                              smart_count: 1,
                            }
                          )} ${activityIdx + 1}: ${activity.name}`}
                        </TableCell>
                        {fiscalYearsFromProps.map((year) => {
                          if (!outputTotal[year.id]) {
                            outputTotal[year.id] = 0;
                          }
                          const costs = activity.investments.map(
                            (item) => item.costs
                          );

                          let investmentSum = lodash.sumBy(costs, (item) =>
                            typeof item[year.id] !== "undefined"
                              ? parseFloat(item[year.id])
                              : 0
                          );

                          activityTotal += investmentSum ? investmentSum : 0;
                          outputTotal[year.id] += investmentSum;
                          return (
                            <TableCell style={{ width: 110 }}>
                              {costSumFormatter(investmentSum)}
                            </TableCell>
                          );
                        })}
                        <TableCell style={{ width: 130 }}>
                          {isNaN(activityTotal)
                            ? "-"
                            : costSumFormatter(activityTotal)}
                        </TableCell>
                        <TableCell style={{ width: 100 }}></TableCell>
                      </TableRow>,
                      activity.investments &&
                        activity.investments.map((item, idx) => {
                          let fundTotal = 0;
                          return (
                            <TableRow>
                              <TableCell>
                                {romanize(
                                  `${outputIdx + 1}.${activityIdx + 1}.${
                                    idx + 1
                                  }`
                                )}
                              </TableCell>
                              <TableCell>
                                {item.costing && item.costing.code}
                              </TableCell>
                              <TableCell>
                                {item.costing && item.costing.name}
                              </TableCell>
                              {fiscalYearsFromProps.map((year) => {
                                const yearsData =
                                  typeof item.costs[Number(year.id)] !==
                                  "undefined"
                                    ? parseFloat(item.costs[Number(year.id)])
                                    : 0;
                                fundTotal += yearsData ? yearsData : 0;
                                return (
                                  <TableCell>
                                    {costSumFormatter(yearsData)}
                                  </TableCell>
                                );
                              })}
                              <TableCell style={{ width: 130 }}>
                                {costSumFormatter(fundTotal)}
                              </TableCell>
                              <TableCell style={{ width: 120 }}>
                                {item.fund &&
                                  `${item.fund.code}-${item.fund.name}`}
                              </TableCell>
                            </TableRow>
                          );
                        }),
                    ];
                  }
                );

                outputsData.push(
                  <TableRow className={classes.filledRow}>
                    <TableCell variant="head">
                      {romanize(outputIdx + 1)}
                    </TableCell>
                    <TableCell colSpan="2" variant="head">
                      {`${translate("printForm.project_framework.output", {
                        smart_count: 1,
                      })} ${outputIdx + 1}: ${output.name}`}
                    </TableCell>
                    {fiscalYearsFromProps.map((year) => {
                      if (!totalAll[year.id]) {
                        totalAll[year.id] = 0;
                      }
                      totalOutput += outputTotal[year.id]
                        ? outputTotal[year.id]
                        : 0;
                      totalAll[year.id] += outputTotal[year.id]
                        ? outputTotal[year.id]
                        : 0;
                      return (
                        <TableCell variant="head">
                          {isNaN(outputTotal[year.id])
                            ? "-"
                            : costSumFormatter(outputTotal[year.id])}
                        </TableCell>
                      );
                    })}
                    <TableCell variant="head">
                      {isNaN(totalOutput) ? "-" : costSumFormatter(totalOutput)}
                    </TableCell>
                    <TableCell style={{ width: 120 }}></TableCell>
                  </TableRow>
                );
                outputsData.push(activities);

                return outputsData;
              })}
              <TableRow className={classes.filledRow}>
                <TableCell colSpan="3" variant="head">
                  {translate("printForm.investments.total_costs")}
                </TableCell>
                {fiscalYearsFromProps.map((year) => {
                  allCosts += totalAll[year.id] ? totalAll[year.id] : 0;
                  return (
                    <TableCell variant="head">
                      {isNaN(totalAll[year.id])
                        ? "-"
                        : costSumFormatter(totalAll[year.id])}
                    </TableCell>
                  );
                })}
                <TableCell variant="head">
                  {isNaN(allCosts) ? "-" : costSumFormatter(allCosts)}
                </TableCell>
                <TableCell style={{ width: 120 }}></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
