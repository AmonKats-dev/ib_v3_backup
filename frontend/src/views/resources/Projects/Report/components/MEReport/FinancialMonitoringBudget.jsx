import React from "react";
import HTML2React from "html2react";
import lodash from "lodash";
import {
  getFiscalYearsRangeForIntervals,
  getFiscalYearValue,
  romanize,
} from "../../../../../../helpers/formatters";
import { billionsFormatter, costSumFormatter } from "../../helpers";
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
} from "../../../../../../helpers/dataHelpers";
import moment from "moment";
import { percentageFormatter } from "../../../../../../helpers";

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

export const FinancialMonitoringBudget = (props) => {
  const classes = useStyles();
  const translate = useTranslate();
  const { customRecord, customBasePath } = props;
  const record = formatValuesToQuery(customRecord);
  const counter = props.counter || 4;

  if (!record) {
    return null;
  }

  const meReport = props.meReport || lodash.last(record.me_reports);

  function getActivitiesForOutput(outputId) {
    return meReport.me_activities.filter((activityItem) =>
      activityItem.activity.output_ids.includes(outputId)
    );
  }

  return (
    <div className="landscapeSection">
      <div className="content-area">
        <h2>Table 4: Budget Performance</h2>
        <TableContainer>
          <Table
            size="small"
            className={clsx("bordered", classes.bordered, classes.table)}
            align="center"
            style={{ width: '100%' }}
            >
            <TableBody align="center">
              <TableRow className={classes.filledRow}>
                <TableCell></TableCell>
                <TableCell align="center">Project Description</TableCell>
                <TableCell align="center">Total Cost </TableCell>
                <TableCell align="center">Approved Budget </TableCell>
                <TableCell align="center">Revised Budget</TableCell>
                <TableCell align="center">Budget Releases </TableCell>
                <TableCell align="center">Releases Spent</TableCell>
                <TableCell align="center">% Budget Released </TableCell>
                <TableCell align="center">% Releases Spent </TableCell>
                <TableCell align="center">Sources of Funds </TableCell>
              </TableRow>
              {meReport.me_outputs &&
                meReport.me_outputs.map((output, outputIdx) => {
                  const outputsData = [];

                  output.budget_approved = lodash.sumBy(
                    getActivitiesForOutput(output.output_id),
                    (it) => parseFloat(it.budget_appropriation)
                  );
                  output.budget_allocation = lodash.sumBy(
                    getActivitiesForOutput(output.output_id),
                    (it) => parseFloat(it.budget_allocation)
                  );
                  output.budget_supplemented = lodash.sumBy(
                    getActivitiesForOutput(output.output_id),
                    (it) => parseFloat(it.budget_supplemented)
                  );

                  output.release_budget = lodash.sumBy(
                    getActivitiesForOutput(output.output_id),
                    (it) => parseFloat(it.budget_allocation)
                  );
                  output.release_spent = lodash.sumBy(
                    getActivitiesForOutput(output.output_id),
                    (it) => parseFloat(it.financial_execution)
                  );
                  output.total_cost = 0;
                  output.revised_budget =
                    parseFloat(output.budget_approved) +
                    parseFloat(output.budget_supplemented);

                  const activities = getActivitiesForOutput(
                    output.output_id
                  ).map((activity, activityIdx) => {
                    activity.total_cost = 0;
                    activity.activity.investments.forEach((investment) => {
                      lodash.keys(investment.costs).forEach((year) => {
                        activity.total_cost += parseFloat(
                          investment.costs[year]
                        );
                        output.total_cost += parseFloat(investment.costs[year]);
                      });
                    });

                    activity.release_budget =
                      parseFloat(activity.budget_appropriation) +
                      parseFloat(activity.budget_supplemented);

                    return (
                      <TableRow>
                        <TableCell align="center" colSpan="2">
                          {`${translate(
                            "printForm.project_framework.activity",
                            {
                              smart_count: 1,
                            }
                          )} ${activityIdx + 1}: ${activity.activity.name}`}
                        </TableCell>
                        <TableCell align="center">
                          {billionsFormatter(activity.total_cost)}
                        </TableCell>
                        <TableCell align="center">
                          {billionsFormatter(activity.budget_appropriation)}
                        </TableCell>
                        <TableCell align="center">
                          {billionsFormatter(activity.revised_budget)}
                        </TableCell>
                        <TableCell align="center">
                          {billionsFormatter(activity.budget_allocation)}
                        </TableCell>

                        <TableCell align="center">
                          {billionsFormatter(activity.financial_execution)}
                        </TableCell>
                        <TableCell align="center">
                          {percentageFormatter(
                            activity.revised_budget !== 0
                              ? (activity.revised_budget * 100) /
                                  activity.budget_appropriation
                              : 100
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {percentageFormatter(
                            activity.financial_execution !== 0
                              ? (activity.financial_execution * 100) /
                                  activity.budget_allocation
                              : 100
                          )}
                        </TableCell>
                        <TableCell align="center">SOURCE</TableCell>
                      </TableRow>
                    );
                  });

                  outputsData.push(
                    <TableRow className={classes.filledRow}>
                      <TableCell align="center" colSpan="2">
                        {`${translate("printForm.project_framework.output", {
                          smart_count: 1,
                        })} ${outputIdx + 1}: ${output.output.name}`}
                      </TableCell>
                      <TableCell align="center">
                        {billionsFormatter(output.total_cost)}
                      </TableCell>
                      <TableCell align="center">
                        {billionsFormatter(output.budget_approved)}
                      </TableCell>
                      <TableCell align="center">
                        {billionsFormatter(output.revised_budget)}
                      </TableCell>
                      <TableCell align="center">
                        {billionsFormatter(output.release_budget)}
                      </TableCell>
                      <TableCell align="center">
                        {billionsFormatter(output.release_spent)}
                      </TableCell>
                      <TableCell align="center">
                        {percentageFormatter(
                          output.release_budget !== 0 &&
                            output.budget_approved !== 0
                            ? (output.release_budget * 100) /
                                output.budget_approved
                            : 100
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {percentageFormatter(
                          output.release_spent !== 0 &&
                            output.release_budget !== 0
                            ? (output.release_spent * 100) /
                                output.release_budget
                            : 100
                        )}
                      </TableCell>
                      <TableCell align="center"></TableCell>
                    </TableRow>
                  );
                  outputsData.push(activities);

                  return outputsData;
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
