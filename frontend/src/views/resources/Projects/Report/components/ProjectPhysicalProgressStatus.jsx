import React from "react";
import HTML2React from "html2react";
import lodash from "lodash";
import {
  getFiscalYearsRangeForIntervals,
  romanize,
} from "../../../../../helpers/formatters";
import { costSumFormatter } from "../helpers";
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

export const ProjectPhysicalProgressStatus = (props) => {
  const classes = useStyles();
  const translate = useTranslate();
  const { customRecord, customBasePath } = props;
  const record = formatValuesToQuery(customRecord);
  let totalAll = {};
  let allCosts = 0;
  const counter = props.counter || 4;
  // let fiscalYearsFromProps;

  // const fiscalYearsFromProps = getFiscalYearsRangeForIntervals(
  //   record.start_date,
  //   record.end_date
  // );

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
        <h2>Table 2: Project Physical Progress Status</h2>
        <TableContainer>
          <Table
            size="small"
            className={clsx("bordered", classes.bordered, classes.table)}
            style={{ width: '100%' }}
            >
            <TableBody>
              <TableRow className={classes.filledRow}>
                <TableCell></TableCell>
                <TableCell>Output / Activity</TableCell>
                <TableCell>Anticipated Completion Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>% Completed</TableCell>
                <TableCell>Expected Completion Date</TableCell>
              </TableRow>
              {meReport.me_outputs &&
                meReport.me_outputs.map((output, outputIdx) => {
                  const outputsData = [];
                  const delayed = lodash.filter(
                    getActivitiesForOutput(output.output_id),
                    (it) => it.activity_status === "DELAYED"
                  );
                  const completed = lodash.filter(
                    getActivitiesForOutput(output.output_id),
                    (it) => it.activity_status === "COMPLETED"
                  );
                  const onTrack = lodash.filter(
                    getActivitiesForOutput(output.output_id),
                    (it) => it.activity_status === "ON_TRACK"
                  );

                  if (delayed && delayed.length > 0) {
                    output.status = "DELAYED";
                  } else if (onTrack && onTrack.length > 0) {
                    output.status = "ON_TRACK";
                  } else if (completed && completed.length > 0) {
                    output.status = "COMPLETED";
                  }

                  // output.end_date = ;

                  const lastActivity = lodash.maxBy(
                    getActivitiesForOutput(output.output_id),
                    (item) => moment(item.activity.end_date, "YYYY-MM-DD")
                  );
                  const lastActivityExpected = lodash.maxBy(
                    getActivitiesForOutput(output.output_id),
                    (item) =>
                      moment(item.expected_completion_date, "YYYY-MM-DD")
                  );
                  if (lastActivity) {
                    output.end_date = lastActivityExpected.activity.end_date;
                  }
                  if (lastActivityExpected) {
                    output.expected_completion_date =
                      lastActivityExpected.expected_completion_date;
                  }

                  const activities = getActivitiesForOutput(
                    output.output_id
                  ).map((activity, activityIdx) => {
                    return (
                      <TableRow>
                        <TableCell colSpan="2">
                          {`${translate(
                            "printForm.project_framework.activity",
                            {
                              smart_count: 1,
                            }
                          )} ${activityIdx + 1}: ${activity.activity.name}`}
                        </TableCell>
                        <TableCell>{activity.activity.end_date}</TableCell>
                        <TableCell>
                          <StatusField value={activity.activity_status} />{" "}
                        </TableCell>
                        <TableCell>N/A</TableCell>
                        <TableCell>
                          {activity.expected_completion_date || "N/A"}
                        </TableCell>
                      </TableRow>
                    );
                  });

                  outputsData.push(
                    <TableRow className={classes.filledRow}>
                      <TableCell colSpan="2">
                        {`${translate("printForm.project_framework.output", {
                          smart_count: 1,
                        })} ${outputIdx + 1}: ${output.output.name}`}
                      </TableCell>

                      <TableCell>{output.end_date}</TableCell>
                      <TableCell>
                        <StatusField value={output.status} />
                      </TableCell>
                      <TableCell>{output.output_progress}</TableCell>
                      <TableCell>{output.expected_completion_date}</TableCell>
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
