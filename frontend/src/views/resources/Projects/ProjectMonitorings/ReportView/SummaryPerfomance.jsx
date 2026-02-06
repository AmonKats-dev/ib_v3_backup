import React from "react";
import HTML2React from "html2react";
import lodash from "lodash";
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

export const SummaryPerfomance = ({ record, projectDetails, ...props }) => {
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

  const getStatus = (status) => {
    return status < 100 ? (
      <StatusField value="UNDERFUNDED" />
    ) : (
      <StatusField value="SATISFACTORY" />
    );
  };

  return (
    <div className="landscapeSection">
      <div className="content-area">
        <h2>
          {renderTitle(
            record,
            projectDetails,
            "Table 5: Summary of Project Performance"
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
                <TableCell align="left">Output / Activity</TableCell>
                <TableCell align="left">
                  Output Status
                </TableCell>
                <TableCell align="center">
                  Physical Performance Rating
                </TableCell>
                <TableCell align="center">
                  {/* Budgetary Performance Status */}
                  Budgetary performance status (Approved budget Vs Budget
                  Release)
                </TableCell>
                <TableCell align="center">
                  {/* Financial Execution Status */}
                  Budget Spent (Budget released Vs Budget spent)
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
                    parseFloat(output.budget_allocation) +
                    parseFloat(output.budget_supplemented);

                  outputsData.push(
                    <TableRow className={classes.filledRow}>
                      <TableCell>
                        {`${translate("printForm.project_framework.output", {
                          smart_count: 1,
                        })} ${outputIdx + 1}: ${output.output.name}`}
                      </TableCell>
                      <TableCell align="left" style={{textTransform:"lowercase"}}>
                        {output.output_state}
                      </TableCell>
                      <TableCell align="center">
                        <StatusField value={output.output_status} />
                      </TableCell>
                      <TableCell align="center">
                        <StatusField
                          value={
                            (100 * output.budget_allocation) /
                            output.revised_budget
                          }
                        />
                      </TableCell>
                      <TableCell align="center">
                        <StatusField
                          value={
                            (100 * output.release_spent) / output.revised_budget
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                  // outputsData.push(activities);

                  return outputsData;
                })}
            </TableBody>
          </Table>
        </TableContainer>{" "}
      </div>
    </div>
  );
};
