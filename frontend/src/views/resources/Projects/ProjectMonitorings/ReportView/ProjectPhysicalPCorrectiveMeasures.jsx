import React from "react";
import HTML2React from "html2react";
import lodash from "lodash";
import { costSumFormatter } from "../../Report/helpers";
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
import { getActivitiesForOutput } from "./helpers";

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

export const ProjectPhysicalPCorrectiveMeasures = ({
  record,
  projectDetails,
  ...props
}) => {
  const classes = useStyles();
  const translate = useTranslate();
  // const { customRecord, customBasePath } = props;
  // const record = formatValuesToQuery(customRecord);
  // let totalAll = {};
  // let allCosts = 0;
  // const counter = props.counter || 4;
  // let fiscalYearsFromProps;

  // const fiscalYearsFromProps = getFiscalYearsRangeForIntervals(
  //   record.start_date,
  //   record.end_date
  // );

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
        <h2>Table 4: Physical Progress Corrective Measures</h2>
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
                <TableCell>Reasons for deviation / Challenges</TableCell>
                <TableCell>Corrective measures</TableCell>
              </TableRow>
              {record.me_outputs &&
                record.me_outputs.map((output, outputIdx) => {
                  const outputsData = [];
                  const delayed = lodash.filter(
                    getActivitiesForOutput(record, output.output_id),
                    (it) => it.activity_status === "NOT_SATISFACTORY"
                  );
                  const completed = lodash.filter(
                    getActivitiesForOutput(record, output.output_id),
                    (it) => it.activity_status === "SATISFACTORY"
                  );
                  const onTrack = lodash.filter(
                    getActivitiesForOutput(record, output.output_id),
                    (it) => it.activity_status === "MODERATELY_SATISFACTORY"
                  );

                  if (delayed && delayed.length > 0) {
                    output.status = "NOT_SATISFACTORY";
                  } else if (onTrack && onTrack.length > 0) {
                    output.status = "MODERATELY_SATISFACTORY";
                  } else if (completed && completed.length > 0) {
                    output.status = "SATISFACTORY";
                  }

                  // output.end_date = ;

                  const lastActivity = lodash.maxBy(
                    getActivitiesForOutput(record, output.output_id),
                    (item) => moment(item.activity.end_date, "YYYY-MM-DD")
                  );
                  const lastActivityExpected = lodash.maxBy(
                    getActivitiesForOutput(record, output.output_id),
                    (item) =>
                      moment(
                        item.activity.expected_completion_date,
                        "YYYY-MM-DD"
                      )
                  );
                  if (lastActivity) {
                    output.end_date = lastActivityExpected.activity.end_date;
                  }
                  if (lastActivity) {
                    output.expected_completion_date =
                      lastActivityExpected.activity.end_date;
                  }

                  const activities = getActivitiesForOutput(
                    record,
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
                      <TableCell colSpan="4">
                        {`${translate("printForm.project_framework.output", {
                          smart_count: 1,
                        })} ${outputIdx + 1}: ${output.output.name}`}
                      </TableCell>

                      {/* <TableCell>{output.end_date}</TableCell>
                    <TableCell>{output.status}</TableCell>
                    <TableCell>{output.output_progress}</TableCell>
                    <TableCell>{output.expected_completion_date}</TableCell> */}
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
