import React from "react";
import {
  useTranslate,
  ReferenceField,
  FunctionField,
  Button,
} from "react-admin";
import {
  getTotalProjectCost,
  getFiscalYears,
  getTotalProjectOutputsCost,
  getCalendarDates,
} from "../helpers";
import moment from "moment";
import { Fragment } from "react";
import { dateFormatter } from "../../../../../helpers";
import { useSelector } from "react-redux";
import lodash from "lodash";
import LevelsStructure from "./LevelsStructure";

import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Table from "@material-ui/core/Table";
import { checkFeature } from "../../../../../helpers/checkPermission";
import { Typography } from "@material-ui/core";
import { formatValuesToQuery } from "../../../../../helpers/dataHelpers";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import HTML2React from "html2react";

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

const renderSubmissionDates = (props, translate, projectDetails) => {
  const getProjectDetailsDate = (details, phase_id, prev) => {
    const mappedDetails = lodash.keys(details).map((key) => details[key]);
    const groupedDetails = lodash.groupBy(mappedDetails, "phase_id");
    const phases = Object.keys(groupedDetails);
    const idx = lodash.findIndex(phases, (it) => Number(it) === phase_id);

    if (prev) {
      return groupedDetails[phases[idx - 1]][0];
    }

    return groupedDetails[phase_id][0];
  };

  const { customRecord } = props;
  if (Number(customRecord.phase_id) - 1 === 0) return null;

  if (customRecord) {
    if (
      checkFeature(
        "project_report_submission_dates_for_phases",
        customRecord.phase_id
      )
    ) {
      return [
        <TableRow>
          <TableCell>
            {translate(
              `printForm.project_info.project_approved.phase_${
                Number(customRecord.phase_id) - 1
              }`
            )}
            :
          </TableCell>
          <TableCell>
            {dateFormatter(
              getProjectDetailsDate(
                projectDetails.data,
                Number(customRecord.phase_id),
                true
              ).created_on
            )}
          </TableCell>
        </TableRow>,
        <TableRow>
          <TableCell>
            {translate(
              `printForm.project_info.project_approved.phase_${customRecord.phase_id}`
            )}
            :
          </TableCell>
          <TableCell>
            {dateFormatter(customRecord.created_on, "DD-MM-YYYY hh:mm A")}
          </TableCell>
        </TableRow>,
      ];
    }

    return (
      <TableRow>
        <TableCell>
          {translate(
            `printForm.project_info.project_approved.phase_${
              Number(customRecord.phase_id) - 1
            }`
          )}
          :
        </TableCell>
        <TableCell>
          {dateFormatter(customRecord.created_on, "DD-MM-YYYY hh:mm A")}
        </TableCell>
      </TableRow>
    );
  }

  return null;
};

export const ProjectInformation = (props) => {
  const translate = useTranslate();
  const { customRecord, customBasePath } = props;
  const record = formatValuesToQuery(customRecord);
  const basePath = customBasePath;
  const classes = useStyles();

  const projects = useSelector((state) => state.admin.resources.projects);
  const currentProject = projects.data[props.customRecord.project_id];
  const projectDetails = useSelector(
    (state) => state.admin.resources["project-details"]
  );

  if (!record) {
    return null;
  }

  const calendarStartDate =
    currentProject?.additional_data?.start_date_calendar ||
    record?.additional_data?.start_date_calendar;

  const calendarEndDate =
    currentProject?.additional_data?.end_date_calendar ||
    record?.additional_data?.end_date_calendar;

  function formatPhoneNumber(value) {
    if (checkFeature("has_pimis_fields")) {
      if (value) {
        const formValue = value.replace("(", "").replace(")", "");
        const phoneCode = formValue.slice(0, 3);
        const phoneNumber = formValue.slice(3, formValue.length + 2);
        return `(${phoneCode})${phoneNumber}`;
      }
      return value;
    }

    return value;
  }

  let formattedCostResult =
    record && checkFeature("project_report_total_cost_show", record.phase_id)
      ? String(getTotalProjectCost(record)).replace(
          /(\d)(?=(\d\d\d)+([^\d]|$))/g,
          "$1,"
        ) + ` ${translate("titles.currency")}`
      : String(getTotalProjectOutputsCost(record)).replace(
          /(\d)(?=(\d\d\d)+([^\d]|$))/g,
          "$1,"
        ) + ` ${translate("titles.currency")}`;

  function getFormattedCost(value) {
    return (
      String(value).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1,") +
      ` ${translate("titles.currency")}`
    );
  }

  if (checkFeature("has_components_total_cost", record && record.phase_id)) {
    formattedCostResult =
      String(
        lodash.sumBy(record.components, (it) => parseFloat(it.cost))
      ).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1,") +
      ` ${translate("titles.currency")}`;
  }

  if (checkFeature("has_outputs_total_cost", record && record.phase_id)) {
    formattedCostResult =
      String(getTotalProjectOutputsCost(record)).replace(
        /(\d)(?=(\d\d\d)+([^\d]|$))/g,
        "$1,"
      ) + ` ${translate("titles.currency")}`;
  }

  return (
    <div className="Section2">
      <div className="content-area">
        {!checkFeature("has_pimis_fields") && (
          <Typography variant="h2" style={{ marginLeft: 15, marginBottom: 15 }}>
            {currentProject.name}
          </Typography>
        )}
        <TableContainer>
          <Table
            size="medium"
            className={clsx("bordered", classes.bordered, classes.table)}
          >
            <TableBody>
              <LevelsStructure
                {...props}
                field={"project_organization"}
                config="organizational_config"
                project={currentProject}
              />
              <LevelsStructure
                {...props}
                field={"program"}
                config="programs_config"
                project={currentProject}
              />
              <LevelsStructure
                {...props}
                field={"function"}
                config="functions_config"
                project={currentProject}
              />
              {checkFeature("has_pimis_fields") && (
                <TableRow>
                  <TableCell>
                    {translate("printForm.project_info.sector_ids")}:
                  </TableCell>
                  <TableCell>
                    {record.sector_ids &&
                      record.sector_ids &&
                      props.sectors &&
                      props.sectors
                        .filter((item) => record.sector_ids.includes(item.id))
                        .map((item) => item.name)
                        .join(", ")}
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell>
                  {translate("printForm.project_info.project_title")}:
                </TableCell>
                <TableCell>{currentProject.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {translate("printForm.project_info.project_no")}:
                </TableCell>
                <TableCell>{currentProject.code}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {translate("printForm.project_info.project_duration")}:
                </TableCell>
                <TableCell>
                  {getFiscalYears(record.start_date, record.end_date)}
                </TableCell>
              </TableRow>
              {!checkFeature("has_pimis_fields") && (
                <TableRow>
                  <TableCell>
                    {translate("printForm.project_info.classification")}:
                  </TableCell>
                  <TableCell>{currentProject?.classification}</TableCell>
                </TableRow>
              )}
              {checkFeature("has_pimis_fields") && (
                <TableRow>
                  <TableCell>
                    {translate("printForm.project_info.project_dates")}:
                  </TableCell>
                  <TableCell>
                    {getCalendarDates(calendarStartDate, calendarEndDate)}
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell>
                  {translate("printForm.project_info.project_cost")}:
                </TableCell>
                <TableCell>
                  {/* {formattedCostResult}  */}
                  {record.investment_stats && record.investment_stats.total_cost
                    ? getFormattedCost(record.investment_stats.total_cost)
                    : "-"}
                </TableCell>
              </TableRow>
              {checkFeature(
                "project_show_capital_current_ratio",
                record.phase_id
              ) && (
                <TableRow>
                  <TableCell>
                    {translate(
                      "printForm.project_info.current_investment_ratio"
                    )}
                    :
                  </TableCell>
                  <TableCell>
                    {record.investment_stats &&
                    record.investment_stats.costing_ratio
                      ? record.investment_stats.costing_ratio
                      : "-"}
                  </TableCell>
                </TableRow>
              )}
              {checkFeature("has_pimis_fields") && (
                <TableRow>
                  <TableCell>
                    {translate("printForm.project_info.project_goal")}:
                  </TableCell>
                  <TableCell>{HTML2React(record.project_goal)}</TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell>
                  {translate("printForm.project_info.officer")}:
                </TableCell>
                <TableCell>
                  {checkFeature("has_pimis_fields") ? (
                    <Fragment>
                      <p>
                        {translate(
                          "printForm.project_info.responsible_officers.name"
                        )}
                        :{" "}
                        {currentProject.user
                          ? currentProject.user.full_name
                          : "-"}
                      </p>
                      <p>
                        {translate(
                          "printForm.project_info.responsible_officers.email"
                        )}
                        :{" "}
                        {currentProject.user ? currentProject.user.email : "-"}
                      </p>
                      <p>
                        {translate(
                          "printForm.project_info.responsible_officers.phone"
                        )}
                        :{" "}
                        {currentProject.user
                          ? formatPhoneNumber(currentProject.user.phone)
                          : "-"}
                      </p>
                    </Fragment>
                  ) : (
                    record.responsible_officers &&
                    record.responsible_officers.map((item, idx) => (
                      <Fragment>
                        <p>
                          {translate(
                            "printForm.project_info.responsible_officers.title"
                          )}
                          : {item.title ? item.title : "-"}
                        </p>
                        <p>
                          {translate(
                            "printForm.project_info.responsible_officers.name"
                          )}
                          : {item.name ? item.name : "-"}
                        </p>
                        <p>
                          {translate(
                            "printForm.project_info.responsible_officers.mobile_phone"
                          )}
                          :{" "}
                          {item.mobile_phone
                            ? formatPhoneNumber(item.mobile_phone)
                            : "-"}
                        </p>
                        <p>
                          {translate(
                            "printForm.project_info.responsible_officers.phone"
                          )}
                          : {item.phone ? formatPhoneNumber(item.phone) : "-"}
                        </p>
                        <p>
                          {translate(
                            "printForm.project_info.responsible_officers.email"
                          )}
                          : {item.email ? item.email : "-"}
                        </p>
                        {idx === 0 && <hr />}
                      </Fragment>
                    ))
                  )}
                </TableCell>
              </TableRow>
              {currentProject && currentProject.approved_appeals?.length > 0 && (
                <TableRow>
                  <TableCell>{`Project has ${currentProject.approved_appeals?.length} appeals`}</TableCell>
                  <TableCell>
                    <Button
                      href={
                        "/#/appeals/" +
                        currentProject?.current_project_detail?.id +
                        "/list"
                      }
                      label="View Appeals"
                    />
                  </TableCell>
                </TableRow>
              )}
              {record &&
                checkFeature("report_submission_dates_show", record.phase_id) &&
                renderSubmissionDates(props, translate, projectDetails)}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
