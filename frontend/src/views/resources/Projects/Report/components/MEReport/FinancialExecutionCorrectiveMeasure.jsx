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
} from "../../../../../../helpers/dataHelpers";
import moment from "moment";
import StatusField from "../../../ProjectMonitorings/MonitoringForms/StatusField";

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

export const FinancialExecutionCorrectiveMeasure = (props) => {
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

  const getStatus = (status) => {
    return status < 100 ? (
      <StatusField value="UNDERFUNDED" />
    ) : (
      <StatusField value="ON_TRACK" />
    );
  };

  return (
    <div className="landscapeSection">
      <div className="content-area">
        <h2>Table 9: Project Financial Progress Status</h2>
        <TableContainer>
          <Table
            size="small"
            className={clsx("bordered", classes.bordered, classes.table)}
            style={{ width: '100%' }}
            >
            <TableBody>
              <TableRow className={classes.filledRow}>
                <TableCell>Output / Activity</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Reasons for deviation / Challenges</TableCell>
                <TableCell>Corrective measures</TableCell>
              </TableRow>
              {meReport.me_outputs &&
                meReport.me_outputs.map((output, outputIdx) => {
                  const outputsData = [];
                  const underFunded = lodash.filter(
                    getActivitiesForOutput(output.output_id),
                    (it) =>
                      (it.financial_execution * 100) / it.budget_appropriation <
                      100
                  );
                  const onTrack = lodash.filter(
                    getActivitiesForOutput(output.output_id),
                    (it) =>
                      (it.financial_execution * 100) /
                        it.budget_appropriation >=
                      100
                  );

                  if (underFunded && underFunded.length > 0) {
                    output.status = "UNDERFUNDED";
                  } else if (onTrack && onTrack.length > 0) {
                    output.status = "ON_TRACK";
                  }
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
                          {getStatus(
                            (activity.financial_execution * 100) /
                              activity.budget_appropriation
                          )}
                        </TableCell>
                        <TableCell>
                          {HTML2React(activity.execution_challenges)}
                        </TableCell>
                        <TableCell>
                          {HTML2React(activity.execution_measures)}
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
                        <StatusField value={output.status} />
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
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
