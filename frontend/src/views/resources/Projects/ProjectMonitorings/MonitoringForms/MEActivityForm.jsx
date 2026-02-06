import {
  FormDataConsumer,
  usePermissions,
  SimpleFormIterator,
  TextInput,
  required,
  ArrayInput,
  TextField,
  number,
  Labeled,
} from "react-admin";
import React, { Fragment, useEffect } from "react";
import clsx from "clsx";
import moment from "moment";
import { SelectInput, DateInput, useTranslate } from "react-admin";
import lodash from "lodash";
import {
  checkFeature,
  useChangeField,
} from "../../../../../helpers/checkPermission";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
} from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { commasFormatter, commasParser } from "../../../../../helpers";
import { getFiscalYearValue } from "../../../../../helpers/formatters";
import CustomInput from "../../../../components/CustomInput";

const FUNDS = [
  { id: "Government of Uganda", name: "Government of Uganda" },
  { id: "Donor", name: "External financing" },
];

const PIMIS_FUNDS = [
  { id: "Government of Jamaica", name: "Government of Jamaica" },
  { id: "Donor", name: "Donors" },
];

function getActivitiesForOutput(record, outputId) {
  if (record && record.me_activities) {
    return record.me_activities.filter((activityItem) => {
      if (activityItem && activityItem.activity) {
        return (
          activityItem.activity.output_ids &&
          activityItem.activity.output_ids.includes(outputId)
        );
      } else {
        return (
          activityItem.output_ids && activityItem.output_ids.includes(outputId)
        );
      }
    });
  }

  return [];
}

function getActivityIndex(record, activityId) {
  if (record && record.me_activities) {
    return lodash.findIndex(
      record.me_activities,
      (item) => item.activity_id === activityId
    );
  }

  return lodash.findIndex(record.activities, (item) => item.id === activityId);
}

const STATUS = [
  { id: "NOT_SATISFACTORY", name: "Not Satisfactory" },
  { id: "MODERATELY_SATISFACTORY", name: "Moderately Satisfactory" },
  { id: "SATISFACTORY", name: "Satisfactory" },
];

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

function MEActivityForm({ details, record, ...props }) {
  const { permissions } = usePermissions();
  const translate = useTranslate();
  const changeActivity = useChangeField({ name: "me_activities" });
  const changeActivityStatus = useChangeField({ name: "activity_status" });
  const classes = useStyles();

  function renderTitle() {
    if (record && record.frequency === "ANNUAL") {
      return `Financial Progress reporting for the quarter - ${
        record.quarter
      }, ${getFiscalYearValue("01-01-" + record.year).name} `;
    }

    return `Financial Progress reporting until ${record.quarter}, ${
      getFiscalYearValue("01-01-" + record.year).name
    } (cumulative)`;
  }

  function getFunds() {
    if (checkFeature("has_pimis_fields")) {
      return PIMIS_FUNDS;
    }

    return FUNDS;
  }

  return (
    <Fragment>
      <h2>{renderTitle()}</h2>
      <TableContainer>
        <Table
          size="small"
          className={clsx("bordered", classes.bordered, classes.table)}
        >
          <TableBody>
            <TableRow className={classes.filledRow}>
              <TableCell>Output / Activity</TableCell>
              <TableCell>
                <CustomInput tooltipText="tooltips.resources.me-reports.fields.approved_budget">
                  {" "}
                  {/* Budget Appropriation */}
                  Initial Budget
                </CustomInput>
              </TableCell>
              <TableCell>
                <CustomInput tooltipText="tooltips.resources.me-reports.fields.revised_budget">
                  {" "}
                  {/* Budget Allocation */}
                  Approved Budget
                </CustomInput>
              </TableCell>
              <TableCell>
                <CustomInput tooltipText="tooltips.resources.me-reports.fields.budget_released">
                  {" "}
                  {/* Budget Suplemented */}
                  Budget Released
                </CustomInput>
              </TableCell>
              <TableCell>
                <CustomInput tooltipText="tooltips.resources.me-reports.fields.release_spent">
                  {/* Financial Execution? */}
                  Budget Spent
                  {/* Supplementary Budget */}
                </CustomInput>
              </TableCell>
              <TableCell>
                <CustomInput tooltipText="tooltips.resources.me-reports.fields.source_of_funds">
                  Source of Funds
                </CustomInput>
              </TableCell>
            </TableRow>
            {details &&
              details.outputs &&
              details.outputs.map((outputItem, outputIdx) => {
                const activitiesData = getActivitiesForOutput(
                  record,
                  outputItem.output_id || outputItem.id
                );

                return [
                  <TableRow>
                    <TableCell colSpan={6} variant="head">
                      Output {outputIdx + 1}: {outputItem.name}
                    </TableCell>
                  </TableRow>,
                  ...(activitiesData &&
                    activitiesData.map((activityItem, activityIdx) => (
                      <TableRow>
                        <TableCell>
                          Activity {activityIdx + 1}:{" "}
                          {activityItem.name ||
                            (activityItem.activity &&
                              activityItem.activity.name)}
                        </TableCell>
                        <TableCell>
                          <TextInput
                            label={false}
                            variant="outlined"
                            margin="none"
                            source={`me_activities[${getActivityIndex(
                              record,
                              activityItem.activity_id
                            )}].budget_appropriation`}
                            style={{ minWidth: "50px", width: "auto" }}
                            format={commasFormatter}
                            parse={commasParser}
                            validate={[number()]}
                          />
                        </TableCell>
                        <TableCell>
                          <TextInput
                            label={false}
                            variant="outlined"
                            margin="none"
                            source={`me_activities[${getActivityIndex(
                              record,
                              activityItem.activity_id
                            )}].budget_allocation`}
                            style={{ minWidth: "50px", width: "auto" }}
                            format={commasFormatter}
                            parse={commasParser}
                            validate={[number()]}
                          />
                        </TableCell>
                        <TableCell>
                          <TextInput
                            label={false}
                            variant="outlined"
                            margin="none"
                            source={`me_activities[${getActivityIndex(
                              record,
                              activityItem.activity_id
                            )}].budget_supplemented`}
                            style={{ minWidth: "50px", width: "auto" }}
                            format={commasFormatter}
                            parse={commasParser}
                            validate={[number()]}
                          />
                        </TableCell>
                        <TableCell>
                          <TextInput
                            label={false}
                            variant="outlined"
                            margin="none"
                            source={`me_activities[${getActivityIndex(
                              record,
                              activityItem.activity_id
                            )}].financial_execution`}
                            style={{ minWidth: "50px", width: "auto" }}
                            format={commasFormatter}
                            parse={commasParser}
                            validate={[number()]}
                          />
                        </TableCell>
                        <TableCell>
                          <SelectInput
                            className={props.classes.textInput}
                            source={`me_activities[${getActivityIndex(
                              record,
                              activityItem.activity_id
                            )}].fund_source`}
                            choices={getFunds()}
                            variant="outlined"
                            margin="none"
                            validate={[required()]}
                            label={false}
                            style={{ minWidth: "100px", width: "auto" }}
                          />
                        </TableCell>
                      </TableRow>
                    ))),
                ];
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
    </Fragment>
  );
}

export default MEActivityForm;
