import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { find, groupBy, last, sumBy } from "lodash";
import React, { useEffect, useState } from "react";
import { useDataProvider, useTranslate } from "react-admin";
import {
  FINANCIAL_PATTERN_SUBTYPE,
  FINANCIAL_PATTERN_TYPE,
  FUND_BODY_TYPES,
} from "../../../../../constants/common";
import { costSumFormatter } from "../../../../../helpers";
import { checkFeature } from "../../../../../helpers/checkPermission";
import { getFiscalYearsRangeForIntervals } from "../../../../../helpers/formatters";

const InvestmentsList = ({ formData, ...props }) => {
  const [funds, setFunds] = useState([]);
  const translate = useTranslate();
  const dataProvider = useDataProvider();

  useEffect(() => {
    dataProvider.getListOfAll("funds", {}).then((response) => {
      if (response && response.data) {
        setFunds(response.data);
      }
    });
  }, []);

  const targetYears = getFiscalYearsRangeForIntervals(
    formData.start_date,
    formData.end_date
  );
  const totalByYear = {};
  let total = 0;
  const hasPimisFields = checkFeature("has_pimis_fields");

  function generateFinPattern(item) {
    const selectedFund = find(funds, (it) => it.id === item.fund_id);

    return (
      <>
        <p style={{ margin: 0 }}>
          Fund: {selectedFund?.code} - {selectedFund?.name}{" "}
        </p>
        <p style={{ margin: 0 }}>
          Financial pattern type:{" "}
          {FINANCIAL_PATTERN_TYPE[item.financial_pattern_type]}
        </p>
        <p style={{ margin: 0 }}>
          Financial pattern subtype:
          {FINANCIAL_PATTERN_SUBTYPE[item.financial_pattern_subtype]}
        </p>
        {item.fund_body_type && (
          <p style={{ margin: 0 }}>
            Fund Body Type: {FUND_BODY_TYPES[item.fund_body_type]}
          </p>
        )}
      </>
    );
  }

  function generateFinPatternPimis(item) {
    const selectedFund = find(funds, (it) => it.id === item.fund_id);

    return (
      <>
        <p style={{ margin: 0 }}>
          {`Fund: ${selectedFund?.code} - ${selectedFund?.name} ${
            item.fund_body_type
              ? `/ ${FUND_BODY_TYPES[item.fund_body_type]}`
              : ""
          }`}
        </p>
      </>
    );
  }

  if (hasPimisFields) {
    if (props.type === "components") {
      return (
        <TableContainer  style={{ overflowX: "auto", maxWidth: '960px' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Fund Source/Type</TableCell>
                <TableCell>Amount (JMD)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.investments &&
                props.investments.map((investment) => {
                  if (!investment) return null;

                  total += parseFloat(
                    (investment.costs &&
                      investment.costs[String(last(targetYears).id) + "y"]) ||
                      0
                  );

                  return (
                    <TableRow>
                      <TableCell>
                        {generateFinPatternPimis(investment)}
                      </TableCell>
                      <TableCell>
                        {investment.costs &&
                          costSumFormatter(
                            investment.costs[String(last(targetYears).id) + "y"]
                          )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              <TableRow>
                <TableCell>
                  <b>
                    {translate(
                      `resources.${props.type}.fields.investments.fields.total`
                    )}
                    :
                  </b>
                </TableCell>
                <TableCell>
                  <b>{isNaN(total) ? "-" : costSumFormatter(total)}</b>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
  }

  return (
    <TableContainer style={{ overflowX: "auto", maxWidth: '960px' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {props.type === "outputs" && <TableCell>{}</TableCell>}
            {props.type === "activities" && (
              <TableCell>
                {translate(
                  `resources.${props.type}.fields.investments.fields.fund_source_id`
                )}
              </TableCell>
            )}
            {props.type === "activities" && !hasPimisFields && (
              <TableCell>
                {translate(
                  `resources.${props.type}.fields.investments.fields.cost_classification_id`
                )}
              </TableCell>
            )}
            {
              //!hasPimisFields &&
              targetYears &&
                targetYears.map((year) => (
                  <TableCell>
                    {checkFeature("project_dates_fiscal_years")
                      ? year.name
                      : year.id}
                  </TableCell>
                ))
            }
            <TableCell>
              {translate(
                `resources.${props.type}.fields.investments.fields.total`
              )}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.investments &&
            props.investments.map((investment) => {
              if (!investment) return null;
              const totalRow = {};
              return (
                <TableRow>
                  {props.type === "outputs" && <TableCell>{}</TableCell>}
                  {props.type === "activities" && (
                    <TableCell>
                      {investment && investment.fund
                        ? `${investment.fund.code} - ${investment.fund.name}`
                        : ""}
                    </TableCell>
                  )}
                  {props.type === "activities" && !hasPimisFields && (
                    <TableCell>
                      {investment && investment.costing
                        ? `${investment.costing.code} - ${investment.costing.name}`
                        : ""}
                    </TableCell>
                  )}
                  {targetYears &&
                    targetYears.map((year) => {
                      const currentYear = year.id + "y";

                      if (!investment.costs) return null;

                      if (!totalByYear[currentYear]) {
                        totalByYear[currentYear] = 0;
                      }
                      if (!totalRow[investment.fund_id]) {
                        totalRow[investment.fund_id] = 0;
                      }
                      totalByYear[currentYear] += investment.costs[currentYear]
                        ? parseFloat(investment.costs[currentYear])
                        : 0;

                      totalRow[investment.fund_id] += investment.costs[
                        currentYear
                      ]
                        ? parseFloat(investment.costs[currentYear])
                        : 0;
                      total += investment.costs[currentYear]
                        ? parseFloat(investment.costs[currentYear])
                        : 0;

                      // if (hasPimisFields) return null;

                      return (
                        <TableCell>
                          {investment.costs[currentYear]
                            ? costSumFormatter(
                                parseFloat(investment.costs[currentYear])
                              )
                            : 0}
                        </TableCell>
                      );
                    })}
                  <TableCell>
                    {isNaN(totalRow[investment.fund_id])
                      ? "-"
                      : costSumFormatter(totalRow[investment.fund_id])}
                  </TableCell>
                </TableRow>
              );
            })}
          <TableRow>
            <TableCell>
              <b>
                {translate(
                  `resources.${props.type}.fields.investments.fields.total`
                )}
                :
              </b>
            </TableCell>
            {props.type === "activities" && !hasPimisFields && (
              <TableCell></TableCell>
            )}
            {targetYears &&
              targetYears.map((year) => (
                <TableCell>
                  <b>
                    {isNaN(totalByYear[year.id + "y"])
                      ? "-"
                      : costSumFormatter(totalByYear[year.id + "y"])}
                  </b>
                </TableCell>
              ))}
            <TableCell>
              <b>{isNaN(total) ? "-" : costSumFormatter(total)}</b>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InvestmentsList;
