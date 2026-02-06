import React from "react";
import { useTranslate, ReferenceField, FunctionField } from "react-admin";
import moment from "moment";
import { Fragment } from "react";
import { dateFormatter } from "../../../../helpers";
import { useSelector } from "react-redux";
import lodash from "lodash";
import LevelsStructure from "../Report/components/LevelsStructure";

import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Table from "@material-ui/core/Table";
import { Typography } from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { checkFeature } from "../../../../helpers/checkPermission";
import { formatValuesToQuery } from "../../../../helpers/dataHelpers";
import {
  getTotalProjectCost,
  getTotalProjectOutputsCost,
} from "../Report/helpers";
import { getFiscalYears } from "../Report/helpers";
import { getFiscalYearValue } from "../../../../helpers/formatters";

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
  const getProjectDetailsDate = (details, phase_id) => {
    const mappedDetails = lodash.keys(details).map((key) => details[key]);
    const groupedDetails = lodash.groupBy(mappedDetails, "phase_id");
    return groupedDetails[phase_id][0];
  };

  const { details } = props;
  if (Number(details.phase_id) - 1 === 0) return null;

  if (details) {
    if (
      checkFeature(
        "project_report_submission_dates_for_phases",
        details.phase_id
      )
    ) {
      return [
        <TableRow>
          <TableCell>
            {translate(
              `printForm.project_info.project_approved.phase_${
                Number(details.phase_id) - 1
              }`
            )}
            :
          </TableCell>
          <TableCell>
            {dateFormatter(
              getProjectDetailsDate(
                projectDetails.data,
                Number(details.phase_id) - 1
              ).created_on
            )}
          </TableCell>
        </TableRow>,
        <TableRow>
          <TableCell>
            {translate(
              `printForm.project_info.project_approved.phase_${details.phase_id}`
            )}
            :
          </TableCell>
          <TableCell>
            {dateFormatter(details.created_on, "DD-MM-YYYY hh:mm A")}
          </TableCell>
        </TableRow>,
      ];
    }

    return (
      <TableRow>
        <TableCell>
          {translate(
            `printForm.project_info.project_approved.phase_${
              Number(details.phase_id) - 1
            }`
          )}
          :
        </TableCell>
        <TableCell>
          {dateFormatter(details.created_on, "DD-MM-YYYY hh:mm A")}
        </TableCell>
      </TableRow>
    );
  }

  return null;
};

export const ProjectInformation = ({ details, project, ...props }) => {
  const translate = useTranslate();
  const classes = useStyles();
  const projectDetails = useSelector(
    (state) => state.admin.resources["project-details"]
  );

  function formatPhoneNumber(value) {
    if (checkFeature("has_pimis_fields")) {
      if (value) {
        const formValue = value.replace("(", "").replace(")", "");
        const phoneCode = formValue && formValue.slice(0, 3);
        const phoneNumber = formValue && formValue.slice(3, formValue.length + 2);
        return `(${phoneCode})${phoneNumber}`;
      }
      return value;
    }

    return value;
  }

  let formattedCostResult =
    details && checkFeature("project_report_total_cost_show", details.phase_id)
      ? String(getTotalProjectCost(details)).replace(
          /(\d)(?=(\d\d\d)+([^\d]|$))/g,
          "$1,"
        ) + ` ${translate("titles.currency")}`
      : String(getTotalProjectOutputsCost(details)).replace(
          /(\d)(?=(\d\d\d)+([^\d]|$))/g,
          "$1,"
        ) + ` ${translate("titles.currency")}`;

  return (
    <div className="Section2">
      <div className="content-area">
        <Typography variant="h2" style={{ marginLeft: 15, marginBottom: 15 }}>
          {project.name}
        </Typography>
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
                project={project}
              />
              <LevelsStructure
                {...props}
                field={"program"}
                config="programs_config"
                project={project}
              />
              <LevelsStructure
                {...props}
                field={"function"}
                config="functions_config"
                project={project}
              />
              <TableRow>
                <TableCell>
                  {translate("printForm.project_info.project_title")}:
                </TableCell>
                <TableCell>{project.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {translate("printForm.project_info.project_code")}:
                </TableCell>
                <TableCell>{project.budget_code}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {translate("printForm.project_info.project_duration")}:
                </TableCell>
                <TableCell>
                  {getFiscalYears(details.start_date, details.end_date)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{"Actual Cost"}:</TableCell>
                <TableCell>{formattedCostResult}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {translate("printForm.project_info.officer")}:
                </TableCell>
                <TableCell>
                  {details.responsible_officers &&
                    details.responsible_officers.map((item) => (
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
                      </Fragment>
                    ))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{"Project location "}:</TableCell>
                <TableCell>
                  {details?.locations
                    ?.map((item) => item.location?.name)
                    ?.join(", ")}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{"Project start Date "}:</TableCell>
                <TableCell>
                  {getFiscalYearValue(details?.start_date)?.name}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{"Project completion date  "}:</TableCell>
                <TableCell>{dateFormatter(project.submission_date)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
