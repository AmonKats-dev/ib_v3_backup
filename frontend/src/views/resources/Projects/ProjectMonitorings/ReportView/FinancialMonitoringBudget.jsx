import React from "react";
import lodash from "lodash";
import { billionsFormatter, costSumFormatter } from "../../Report/helpers";
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
import moment from "moment";
import { percentageFormatter } from "../../../../../helpers";
import { getActivitiesForOutput, renderTitle } from "./helpers";
import StatusFieldValue from "../MonitoringForms/StatusFieldValue";

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

const getStatus = (status) => {
  return <StatusFieldValue value={status} />;
};

export const FinancialMonitoringBudget = ({
  record,
  projectDetails,
  ...props
}) => {
  const classes = useStyles();
  const translate = useTranslate();
  // const { customRecord, customBasePath } = props;
  // const record = formatValuesToQuery(customRecord);
  // const counter = props.counter || 4;

  if (!projectDetails) {
    return null;
  }

  // const meReport = props.meReport || lodash.last(record.me_reports);

  // function getActivitiesForOutput(outputId) {
  //   return (
  //     record.me_activities &&
  //     record.me_activities.filter(
  //       (activityItem) =>
  //         activityItem &&
  //         activityItem.activity &&
  //         activityItem.activity.output_ids.includes(outputId)
  //     )
  //   );
  // }

  return (
    <div className="landscapeSection">
      <div className="content-area">
        <h2>
          {renderTitle(
            record,
            projectDetails,
            "Table 4: Financial Monitoring "
          )}
        </h2>
        <TableContainer>
          <Table
            size="small"
            className={clsx("bordered", classes.bordered, classes.table)}
            align="center"
            style={{ width: "100%" }}
          >
            <TableBody align="center">
              <TableRow className={classes.filledRow}>
                {/* <TableCell></TableCell> */}
                <TableCell align="center" colSpan={2} variant="head">
                  {" "}
                  Project Description
                </TableCell>
                <TableCell align="center" variant="head">
                  Total Cost{" "}
                </TableCell>
                <TableCell align="center" variant="head">
                  Initial Budget {/* Approved Budget{" "} */}
                </TableCell>
                <TableCell align="center" variant="head">
                  Approved Budget
                  {/* Revised Budget */}
                </TableCell>
                <TableCell align="center" variant="head">
                  Budget Released{" "}
                </TableCell>
                <TableCell align="center" variant="head">
                  Supplementary Budget
                </TableCell>
                <TableCell align="center" variant="head">
                  Budget Spent  
                  {/* Supplementary Budget */}
                </TableCell>
                <TableCell align="center" variant="head">
                  Budget Spent (%)
                  {/* % Budget Released{" "} */}
                </TableCell>
                <TableCell align="center" variant="head">
                  Releases Spent (%)
                </TableCell>
                <TableCell align="center" variant="head">
                  Source of Funds{" "}
                </TableCell>
              </TableRow>
              {record.me_outputs &&
                record.me_outputs.map((output, outputIdx) => {
                  const outputsData = [];

                  output.budget_approved = lodash.sumBy(
                    getActivitiesForOutput(record, output.output_id),
                    (it) => parseFloat(it.budget_appropriation)
                  );
                  output.budget_allocation = lodash.sumBy(
                    getActivitiesForOutput(record, output.output_id),
                    (it) => parseFloat(it.budget_allocation)
                  );
                  output.budget_supplemented = lodash.sumBy(
                    getActivitiesForOutput(record, output.output_id),
                    (it) => parseFloat(it.budget_supplemented)
                  );

                  output.release_budget = lodash.sumBy(
                    getActivitiesForOutput(record, output.output_id),
                    (it) => parseFloat(it.budget_allocation)
                  );
                  output.release_spent = lodash.sumBy(
                    getActivitiesForOutput(record, output.output_id),
                    (it) => parseFloat(it.financial_execution)
                  );

                  output.total_cost = 0;
                  output.revised_budget =
                    // parseFloat(output.budget_allocation) +
                    parseFloat(output.budget_supplemented);

                  const activities = getActivitiesForOutput(
                    record,
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

                    activity.revised_budget =
                      // parseFloat(activity.budget_allocation) +
                      parseFloat(activity.budget_supplemented);

                    return (
                      <TableRow>
                        <TableCell align="left" colSpan="2">
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
                          {billionsFormatter(activity.budget_allocation)}
                        </TableCell>
                        <TableCell align="center">
                          {billionsFormatter(activity.revised_budget)}
                        </TableCell>
                        <TableCell align="center">
                          {billionsFormatter(
                            activity.revised_budget - activity.budget_allocation
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {billionsFormatter(activity.financial_execution)}
                        </TableCell>
                        {/* <TableCell align="center">
                          {percentageFormatter(
                            activity.revised_budget !== 0 &&
                              activity.budget_allocation !== 0
                              ? (activity.budget_allocation * 100) /
                                  activity.revised_budget
                              : 0
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {percentageFormatter(
                            activity.budget_allocation !== 0 &&
                              activity.financial_execution !== 0
                              ? (activity.financial_execution * 100) /
                                  activity.budget_allocation
                              : 0
                          )}
                        </TableCell> */}
                        <TableCell align="center">
                          {activity.revised_budget
                            ? getStatus(
                                (100 * activity.budget_allocation) /
                                  activity.revised_budget
                              )
                            : "-"}
                        </TableCell>
                        <TableCell align="center">
                          {activity.budget_allocation
                            ? getStatus(
                                (100 * activity.financial_execution) /
                                  activity.revised_budget
                              )
                            : "-"}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {activity.fund_source || "-"}
                        </TableCell>
                      </TableRow>
                    );
                  });

                  outputsData.push(
                    <TableRow className={classes.filledRow}>
                      <TableCell align="left" colSpan="2">
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
                        {billionsFormatter(output.release_budget)}
                      </TableCell>
                      <TableCell align="center">
                        {billionsFormatter(output.revised_budget)}
                      </TableCell>
                      <TableCell align="center">
                        {billionsFormatter(
                          output.revised_budget - output.release_budget
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {billionsFormatter(output.release_spent)}
                      </TableCell>
                      {/* <TableCell align="center">
                        {percentageFormatter(
                          output.release_budget !== 0 &&
                            output.budget_allocation !== 0
                            ? parseFloat(
                                (output.budget_allocation * 100) /
                                  output.revised_budget
                              )
                            : 0
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {percentageFormatter(
                          output.release_spent !== 0 &&
                            output.release_budget !== 0
                            ? parseFloat(
                                (output.release_spent * 100) /
                                  output.release_budget
                              )
                            : 0
                        )}
                      </TableCell> */}

                      <TableCell align="center">
                        {output.revised_budget
                          ? getStatus(
                              (100 * output.budget_allocation) /
                                output.revised_budget
                            )
                          : "-"}
                      </TableCell>
                      <TableCell align="center">
                        {output.revised_budget
                          ? getStatus(
                              (100 * output.release_spent) /
                                output.revised_budget
                            )
                          : "-"}
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
