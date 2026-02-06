import React from "react";
import HTML2React from "html2react";
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
import StatusField from "../../ProjectMonitorings/MonitoringForms/StatusField";
import { getActivitiesForOutput, renderTitle } from "./helpers";

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

export const ProjectFinancialProgressStatus = ({
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
          {renderTitle(record, projectDetails, "Table 5: Project Financial Progress Status")}
        </h2>
        <TableContainer>
          <Table
            size="small"
            className={clsx("bordered", classes.bordered, classes.table)}
            style={{ width: '100%' }}
            >
            <TableBody>
              <TableRow className={classes.filledRow}>
                <TableCell></TableCell>
                <TableCell colSpan={3}>Allocation</TableCell>
                <TableCell colSpan={2}>Expenditure</TableCell>
              </TableRow>
              <TableRow className={classes.filledRow}>
                <TableCell>Outputs / Activities</TableCell>
                <TableCell>Budget Approved</TableCell>
                <TableCell>Budget Released</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Release Spent</TableCell>
                <TableCell>Status</TableCell>
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
                    parseFloat(output.budget_approved) +
                    parseFloat(output.budget_supplemented);

                  const getStatus = (status) => {
                    return status < 100 ? (
                      <StatusField value={status} />
                    ) : (
                      <StatusField value={status} />
                    );
                  };

                  const activities = getActivitiesForOutput(
                    record,
                    output.output_id
                  ).map((activity, activityIdx) => {
                    activity.revised_budget =
                      parseFloat(activity.budget_appropriation) +
                      parseFloat(activity.budget_supplemented);

                    return (
                      <TableRow>
                        <TableCell>
                          {`${translate(
                            "printForm.project_framework.activity",
                            {
                              smart_count: 1,
                            }
                          )} ${activityIdx + 1}: ${activity.activity.name}`}
                        </TableCell>
                        <TableCell>
                          {billionsFormatter(activity.budget_appropriation)}
                        </TableCell>
                        <TableCell>{activity.budget_allocation}</TableCell>
                        <TableCell>
                          {activity.budget_appropriation
                            ? getStatus(
                                1 -
                                  activity.budget_allocation /
                                    activity.budget_appropriation
                              )
                            : "-"}
                        </TableCell>
                        <TableCell>{activity.financial_execution ? activity.financial_execution : '-'}</TableCell>
                        <TableCell>
                          {activity.budget_appropriation
                            ? getStatus(
                                1 -
                                  activity.financial_execution /
                                    activity.budget_appropriation
                              )
                            : "-"}
                        </TableCell>
                      </TableRow>
                    );
                  });

                  outputsData.push(
                    <TableRow className={classes.filledRow}>
                      <TableCell>
                        {`${translate("printForm.project_framework.output", {
                          smart_count: 1,
                        })} ${outputIdx + 1}: ${output.output.name}`}
                      </TableCell>
                      <TableCell>
                        {billionsFormatter(output.budget_approved)}
                      </TableCell>
                      <TableCell>
                        {billionsFormatter(output.release_budget)}
                      </TableCell>

                      <TableCell>
                        {output.release_budget
                          ? getStatus(
                              1 - output.budget_approved / output.release_budget
                            )
                          : "-"}
                      </TableCell>
                      <TableCell>{output.release_spent ? output.release_spent : '-'}</TableCell>
                      <TableCell>
                        {output.release_budget
                          ? getStatus(
                              1 - output.release_spent / output.release_budget
                            )
                          : "-"}
                      </TableCell>
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
