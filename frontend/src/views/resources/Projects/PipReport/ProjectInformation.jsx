import React from "react";
import { useTranslate, ReferenceField, FunctionField } from "react-admin";
import moment from "moment";
import { Fragment } from "react";
import { dateFormatter } from "../../../../helpers";
import { useSelector } from "react-redux";
import lodash from "lodash";
import LevelsStructure from "../Report/components/LevelsStructure";
import HTML2React from "html2react";

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
    details &&
    String(getTotalProjectCost(details)).replace(
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
              <TableRow>
                <TableCell>Project</TableCell>
                <TableCell> {project.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Implementing agency</TableCell>
                <TableCell>
                  {details.implementing_agencies?.map((item) => (
                    <Typography>{`${item.organization.code} - ${item.organization.name}`}</Typography>
                  ))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>responsible officer</TableCell>
                <TableCell>
                  {" "}
                  {details.responsible_officers &&
                    details.responsible_officers.map((item, idx) => (
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
                    ))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Location: </TableCell>
                <TableCell>
                  {!lodash.isEmpty(details.locations)
                    ? details.locations.map((item) => (
                        <p>
                          {item ? item.location && item.location.name : "-"}
                        </p>
                      ))
                    : details.additional_data &&
                      details.additional_data.location
                    ? HTML2React(details.additional_data.location)
                    : null}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Project Value (Billions):</TableCell>
                <TableCell>{formattedCostResult}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Internal Rate of Investment (IRR):</TableCell>
                <TableCell>12</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Cost Benefit Analysis (CBA):</TableCell>
                <TableCell>221</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Net Present Value (NPV): </TableCell>
                <TableCell>121 </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Start Date:</TableCell>
                <TableCell>
                  {details && getFiscalYearValue(details.start_date)?.name}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Completion Date: </TableCell>
                <TableCell>
                  {details && getFiscalYearValue(details.created_on)?.name}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
