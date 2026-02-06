import React, { useState } from "react";
import lodash, { find } from "lodash";
import { useDataProvider, useTranslate } from "react-admin";
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
import { formatValuesToQuery } from "../../../../../helpers/dataHelpers";
import { useEffect } from "react";

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

export const ComponentsInvestments = (props) => {
  const classes = useStyles();
  const translate = useTranslate();
  const { customRecord, counter } = props;
  const record = formatValuesToQuery(customRecord);
  const [funds, setFunds] = useState([]);
  const dataProvider = useDataProvider();

  useEffect(() => {
    dataProvider.getListOfAll("funds", {}).then((response) => {
      if (response && response.data) {
        setFunds(response.data);
      }
    });
  }, []);

  const getFundId = (fundId) => {
    const sel = find(funds, (it) => it.id === fundId);

    return sel ? sel.name : "";
  };

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
          {`${getFundId(item.fund_id)}${
            FUND_BODY_TYPES[item.fund_body_type]
              ? ` / ${FUND_BODY_TYPES[item.fund_body_type]}`
              : ""
          }`}
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
            {translate("printForm.investments.components_title")}
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
                    {translate("printForm.project_framework.component", {
                      smart_count: 2,
                    })}
                  </TableCell>
                  <TableCell>Fund Source / Fund Type</TableCell>
                  {targetYears &&
                    targetYears.map((year) => (
                      <TableCell>{year.name}</TableCell>
                    ))}
                  <TableCell>
                    {translate("printForm.investments.total")}
                  </TableCell>
                </TableRow>
                {record.components &&
                  record.components.map((component) => {
                    return (
                      <>
                        {component.investments &&
                          component.investments.map((item) => {
                            let componentTotal = 0;
                            return (
                              <TableRow>
                                <TableCell>{component.name}</TableCell>
                                <TableCell>
                                  {generateFinPattern(item)}
                                </TableCell>
                                {targetYears &&
                                  targetYears.map((year) => {
                                    if (!component.investments) return null;
                                    let investmentSum =
                                      item.costs && item.costs[`${year.id}y`]
                                        ? parseFloat(item.costs[`${year.id}y`])
                                        : 0;
                                    componentTotal += investmentSum
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
                                    {isNaN(componentTotal)
                                      ? "-"
                                      : costSumFormatter(componentTotal)}
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
          {translate("printForm.investments.components_title")}
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
                  {translate("printForm.project_framework.component", {
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
              {record.components &&
                record.components.map((component) => {
                  let componentTotal = 0;

                  return (
                    <TableRow>
                      <TableCell>{component.name}</TableCell>
                      {hasPimisFields && (
                        <TableCell>
                          {generateFinPattern(component.investments[0])}
                        </TableCell>
                      )}
                      {targetYears &&
                        targetYears.map((year) => {
                          if (!component.investments) return null;
                          const costs = component.investments?.map(
                            (item) => item?.costs
                          );
                          let investmentSum = costs
                            ? lodash.sumBy(costs, (item) =>
                                item && item[year.id]
                                  ? parseFloat(item[year.id])
                                  : 0
                              )
                            : 0;
                          componentTotal += investmentSum ? investmentSum : 0;

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
                          {isNaN(componentTotal)
                            ? "-"
                            : costSumFormatter(componentTotal)}
                        </b>
                      </TableCell>
                    </TableRow>
                  );
                })}
              <TableRow>
                <TableCell>
                  <b>{translate("printForm.investments.totalAll")}</b>
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
