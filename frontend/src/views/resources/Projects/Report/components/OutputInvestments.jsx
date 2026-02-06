import React from "react";
import lodash from "lodash";
import { useTranslate } from "react-admin";
import {
  romanize,
  getFiscalYearsRangeForIntervals,
} from "../../../../../helpers/formatters";
import { costSumFormatter } from "../../../../../helpers";
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
import { checkFeature } from "../../../../../helpers/checkPermission";
import {
  FINANCIAL_PATTERN_SUBTYPE,
  FINANCIAL_PATTERN_TYPE,
  FUND_BODY_TYPES,
} from "../../../../../constants/common";

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

export const OutputInvestments = (props) => {
  const classes = useStyles();
  const translate = useTranslate();
  const { customRecord, counter } = props;
  const record = customRecord;
  let totalByYears = {};
  let totalByYearsAll = 0;
  const targetYears = getFiscalYearsRangeForIntervals(
    record.start_date,
    record.end_date
  );
  if (!record) {
    return null;
  }
  const hasPimisFields = checkFeature("has_pimis_fields");

  function generateFinPattern(item) {
    return (
      <>
        <p style={{ margin: 0 }}>
          {`${FINANCIAL_PATTERN_TYPE[item.financial_pattern_type]} / ${
            FINANCIAL_PATTERN_SUBTYPE[item.financial_pattern_subtype]
          } / ${FUND_BODY_TYPES[item.fund_body_type]}`}
        </p>
      </>
    );
  }

  if (hasPimisFields) {
    return (
      <div className="landscapeSection">
        <div className="content-area">
          <h2>
            {romanize(counter)}.{" "}
            {translate("printForm.investments.outputs_title")}
          </h2>
          <TableContainer>
            <Table
              size="small"
              className={clsx("bordered", classes.bordered, classes.Table)}
              style={{ width: "100%" }}
            >
              <TableBody>
                <TableRow className={classes.filledRow}>
                  <TableCell>
                    {translate("printForm.project_framework.output", {
                      smart_count: 2,
                    })}
                  </TableCell>
                  <TableCell>Financial Pattern</TableCell>
                  {targetYears &&
                    targetYears.map((year) => (
                      <TableCell>{year.name}</TableCell>
                    ))}
                  <TableCell>
                    {translate("printForm.investments.total")}
                  </TableCell>
                </TableRow>
                {record.outputs &&
                  record.outputs.map((output) => {
                    return (
                      <>
                        {output.investments &&
                          output.investments.map((item) => {
                            let outputTotal = 0;
                            return (
                              <TableRow>
                                <TableCell>{output.name}</TableCell>
                                <TableCell>
                                  {generateFinPattern(item)}
                                </TableCell>
                                {targetYears &&
                                  targetYears.map((year) => {
                                    if (!output.investments) return null;
                                    let investmentSum = item.costs && item.costs[year.id]
                                      ? parseFloat(item.costs[year.id])
                                      : 0;
                                    outputTotal += investmentSum
                                      ? investmentSum
                                      : 0;

                                    totalByYears[year.id] = totalByYears[
                                      year.id
                                    ]
                                      ? totalByYears[year.id] + investmentSum
                                      : investmentSum;
                                    return (
                                      <>
                                        <TableCell>
                                          {costSumFormatter(investmentSum)}
                                        </TableCell>
                                      </>
                                    );
                                  })}
                                <TableCell>
                                  <b>
                                    {isNaN(outputTotal)
                                      ? "-"
                                      : costSumFormatter(outputTotal)}
                                  </b>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </>
                    );
                  })}
                <TableRow>
                  <TableCell>
                    <b>{translate("printForm.investments.total")}</b>
                  </TableCell>
                  {hasPimisFields && <TableCell></TableCell>}
                  {targetYears &&
                    targetYears.map((year) => {
                      totalByYearsAll += totalByYears[year.id]
                        ? totalByYears[year.id]
                        : 0;

                      return (
                        <TableCell>
                          <b>{costSumFormatter(totalByYears[year.id])}</b>
                        </TableCell>
                      );
                    })}
                  <TableCell>
                    <b>{costSumFormatter(totalByYearsAll)}</b>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    );
  }

  return (
    <div className="landscapeSection">
      <div className="content-area">
        <h2>
          {romanize(counter)}.{" "}
          {translate("printForm.investments.outputs_title")}
        </h2>
        <TableContainer>
          <Table
            size="small"
            className={clsx("bordered", classes.bordered, classes.Table)}
            style={{ width: "100%" }}
          >
            <TableBody>
              <TableRow className={classes.filledRow}>
                <TableCell>
                  {translate("printForm.project_framework.output", {
                    smart_count: 2,
                  })}
                </TableCell>
                {hasPimisFields && <TableCell>Financial pattern</TableCell>}
                {targetYears &&
                  targetYears.map((year) => <TableCell>{year.name}</TableCell>)}
                <TableCell>
                  {translate("printForm.investments.total")}
                </TableCell>
              </TableRow>
              {record.outputs &&
                record.outputs.map((output) => {
                  let outputTotal = 0;

                  return (
                    <TableRow>
                      <TableCell>{output.name}</TableCell>
                      {hasPimisFields && (
                        <TableCell>
                          {generateFinPattern(output.investments[0])}
                        </TableCell>
                      )}
                      {targetYears &&
                        targetYears.map((year) => {
                          if (!output.investments) return null;
                          const costs = output.investments?.map(
                            (item) => item?.costs
                          );
                          let investmentSum = costs
                            ? lodash.sumBy(costs, (item) =>
                                item && item[year.id]
                                  ? parseFloat(item[year.id])
                                  : 0
                              )
                            : 0;
                          outputTotal += investmentSum ? investmentSum : 0;

                          totalByYears[year.id] = totalByYears[year.id]
                            ? totalByYears[year.id] + investmentSum
                            : investmentSum;
                          return (
                            <TableCell>
                              {costSumFormatter(investmentSum)}
                            </TableCell>
                          );
                        })}
                      <TableCell>
                        <b>
                          {isNaN(outputTotal)
                            ? "-"
                            : costSumFormatter(outputTotal)}
                        </b>
                      </TableCell>
                    </TableRow>
                  );
                })}
              <TableRow>
                <TableCell>
                  <b>{translate("printForm.investments.total")}</b>
                </TableCell>
                {hasPimisFields && <TableCell></TableCell>}
                {targetYears &&
                  targetYears.map((year) => {
                    totalByYearsAll += totalByYears[year.id]
                      ? totalByYears[year.id]
                      : 0;

                    return (
                      <TableCell>
                        <b>{costSumFormatter(totalByYears[year.id])}</b>
                      </TableCell>
                    );
                  })}
                <TableCell>
                  <b>{costSumFormatter(totalByYearsAll)}</b>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
