import React from "react";
import HTML2React from "html2react";
import lodash from "lodash";
import {
  getFiscalYearsRangeForIntervals,
  romanize,
} from "../../../../../helpers/formatters";
import { billionsFormatter, costSumFormatter } from "../helpers";
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

export const ProjectFinancialProgressStatus = (props) => {
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
        <h2>Table 7: Project Financial Progress Status</h2>
        <TableContainer>
          <Table
            size="small"
            className={clsx("bordered", classes.bordered, classes.table)}
            style={{ width: '100%' }}
            >
            <TableBody>
              <TableRow className={classes.filledRow}>
                <TableCell>Activities</TableCell>
                <TableCell>Budget appropriation</TableCell>
                <TableCell>Budget Allocation to Date</TableCell>
                <TableCell>Allocation Status</TableCell>
                <TableCell>Financial Execution to date</TableCell>
                <TableCell>Execution Status</TableCell>
              </TableRow>
              {meReport.me_outputs &&
                meReport.me_outputs.map((output, outputIdx) => {
                  const outputsData = [];

                  output.budget_appropriation = lodash.sumBy(
                    getActivitiesForOutput(output.output_id),
                    (it) => parseFloat(it.budget_appropriation)
                  );
                  output.budget_allocation = lodash.sumBy(
                    getActivitiesForOutput(output.output_id),
                    (it) => parseFloat(it.budget_allocation)
                  );
                  output.financial_execution = lodash.sumBy(
                    getActivitiesForOutput(output.output_id),
                    (it) => parseFloat(it.financial_execution)
                  );
                  output.next_budget_appropriation = lodash.sumBy(
                    getActivitiesForOutput(output.output_id),
                    (it) => parseFloat(it.next_budget_appropriation)
                  );

                  const getStatus = (status) => {
                    return status < 100 ? (
                      <StatusField value="UNDERFUNDED" />
                    ) : (
                      <StatusField value="ON_TRACK" />
                    );
                  };

                  const activities = getActivitiesForOutput(
                    output.output_id
                  ).map((activity, activityIdx) => {
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
                        <TableCell>
                          {(
                            (activity.budget_allocation * 100) /
                            activity.budget_appropriation
                          ).toFixed(2) + "%"}
                        </TableCell>
                        <TableCell>
                          {getStatus(
                            (activity.budget_allocation * 100) /
                              activity.budget_appropriation
                          )}
                        </TableCell>
                        <TableCell>
                          {(
                            (activity.financial_execution * 100) /
                            activity.budget_appropriation
                          ).toFixed(2) + "%"}
                        </TableCell>
                        <TableCell>
                          {getStatus(
                            (activity.financial_execution * 100) /
                              activity.budget_appropriation
                          )}
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
                        {billionsFormatter(output.budget_appropriation)}
                      </TableCell>
                      <TableCell>
                        {(
                          (output.budget_allocation * 100) /
                          output.budget_appropriation
                        ).toFixed(2) + "%"}
                      </TableCell>
                      <TableCell>
                        {getStatus(
                          (output.budget_allocation * 100) /
                            output.budget_appropriation
                        )}
                      </TableCell>
                      <TableCell>
                        {(
                          (output.financial_execution * 100) /
                          output.budget_appropriation
                        ).toFixed(2) + "%"}
                      </TableCell>
                      <TableCell>
                        {getStatus(
                          (output.financial_execution * 100) /
                            output.budget_appropriation
                        )}
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
