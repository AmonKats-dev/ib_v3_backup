import React from "react";
import HTML2React from "html2react";
import { useTranslate } from "react-admin";
import { romanize } from "../../../../helpers/formatters";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Table from "@material-ui/core/Table";
import lodash from "lodash";
import { costSumFormatter } from "../../../../helpers";

const getPlannedCost = (customRecord) => {
  const investments = lodash.flatMap(
    customRecord.activities.map((activity) => {
      return activity.investments.map((investment) => {
        return investment.costs;
      });
    })
  );

  const total = {};

  investments.forEach((invest) => {
    Object.keys(invest).forEach((year) => {
      total[year] = total[year]
        ? total[year] + parseFloat(invest[year])
        : parseFloat(invest[year]);
    });
  });

  return total;
};
const getMonitoringCosts = (customRecord) => {
  // frequency: "ANNUAL", quarter: "Q4" , year: 2020
  const budgetFields = [
    "budget_allocation",
    "budget_appropriation",
    "budget_supplemented",
    "financial_execution",
  ];

  const totalMeCosts = {};

  const meData = customRecord.me_reports
    .filter((item) => {
      return item.frequency === "ANNUAL"; //&& item.quarter === "Q4";
    })
    .map((item) => {
      let totalCosts = {};

      item.me_activities.forEach((activity) => {
        budgetFields.forEach((field) => {
          const value = activity[field] ? parseFloat(activity[field]) : 0;

          totalCosts[field] = totalCosts[field]
            ? totalCosts[field] + value
            : value;
        });
      });

      return { [item.year]: totalCosts };
    });

  meData.forEach((item) => {
    Object.keys(item).forEach((year) => {
      totalMeCosts[year] = totalMeCosts[year] ? { ...totalMeCosts[year] } : {};

      budgetFields.forEach((field) => {
        const value = item[year][field] ? parseFloat(item[year][field]) : 0;

        totalMeCosts[year][field] = totalMeCosts[year][field]
          ? totalMeCosts[year][field] + value
          : value;
      });
    });
  });

  return totalMeCosts;
};

export const BudgetPerformance = (props) => {
  const { customRecord, counter = 1 } = props;
  const translate = useTranslate();

  const plannedCost = getPlannedCost(customRecord);
  const budgetCosts = getMonitoringCosts(customRecord);
  const years = [2020, 2021, 2022, 2023];

  return (
    <div className="Section2">
      <div className="content-area">
        <h2 className="content-area_title">
          {romanize(counter)} Budget Performance
        </h2>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                {years.map((year) => (
                  <TableCell>{year}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Planned cost </TableCell>
                {years.map((year) => (
                  <TableCell>
                    {plannedCost[year] && costSumFormatter(plannedCost[year])}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>Budget allocated</TableCell>
                {years.map((year) => (
                  <TableCell>
                    {budgetCosts[year] &&
                      costSumFormatter(budgetCosts[year].budget_allocation)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>Budget appropriated </TableCell>
                {years.map((year) => (
                  <TableCell>
                    {budgetCosts[year] &&
                      costSumFormatter(budgetCosts[year].budget_appropriation)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>Budget Released</TableCell>
                {years.map((year) => (
                  <TableCell>
                    {budgetCosts[year] &&
                      costSumFormatter(
                        budgetCosts[year].budget_allocation +
                          budgetCosts[year].budget_supplemented
                      )}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>Budget Spent</TableCell>
                {years.map((year) => (
                  <TableCell>
                    {budgetCosts[year] &&
                      costSumFormatter(budgetCosts[year].financial_execution)}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

// Planned cost - activities -> investments -> costs -> year ->> Planned cost

// spent = frequency: "ANNUAL", quarter: "Q4" , year: 2020, = budget_allocation ->> Budget allocated
// spent = frequency: "ANNUAL", quarter: "Q4" , year: 2020, = budget_appropriation -> Budget appropriated
// spent = frequency: "ANNUAL", quarter: "Q4" , year: 2020, = budget_supplemented ->
// spent = frequency: "ANNUAL", quarter: "Q4" , year: 2020, = financial_execution -> Budget Spent

// budget_allocation + budget_supplemented => Budget Released
