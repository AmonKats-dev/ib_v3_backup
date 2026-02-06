import React, { useEffect, useState } from "react";
import {
  useTranslate,
  ReferenceField,
  FunctionField,
  useDataProvider,
} from "react-admin";
import {
  getTotalProjectCost,
  getFiscalYears,
  getTotalProjectOutputsCost,
} from "../../Report/helpers";
import moment from "moment";
import { Fragment } from "react";
import { dateFormatter } from "../../../../../helpers";
import { useSelector } from "react-redux";
import lodash from "lodash";
import LevelsStructure from "../../Report/components/LevelsStructure";

import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Table from "@material-ui/core/Table";
import { Typography } from "@material-ui/core";
import { formatValuesToQuery } from "../../../../../helpers/dataHelpers";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { checkFeature } from "../../../../../helpers/checkPermission";

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

export const ProjectInformation = (props) => {
  const [project, setProject] = useState(null);
  const translate = useTranslate();
  const { customRecord, customBasePath } = props;
  const record = formatValuesToQuery(customRecord);
  const basePath = customBasePath;
  const classes = useStyles();
  const dataProvider = useDataProvider();

  useEffect(() => {
    if (customRecord && !project && customRecord.project_id) {
      dataProvider
        .getOne("projects", {
          id: customRecord.project_id,
        })
        .then((resp) => {
          if (resp && resp.data) {
            setProject(resp.data);
          }
        });
    }
  }, [customRecord]);

  if (!record) {
    return null;
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

  return (
    <div className="Section2">
      <div className="content-area">
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
                <TableCell>{project && project.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {translate("printForm.project_info.project_no")}:
                </TableCell>
                <TableCell>{project && project.code}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {translate("printForm.project_info.budget_code")}:
                </TableCell>
                <TableCell>{project && project.budget_code}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {translate("printForm.project_info.signed_date")}:
                </TableCell>
                <TableCell>{project && project.signed_date}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {translate("printForm.project_info.project_duration")}:
                </TableCell>
                <TableCell>
                  {getFiscalYears(record.start_date, record.end_date)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {translate("printForm.project_info.project_cost")}:
                </TableCell>
                <TableCell>
                  {record.investment_stats && record.investment_stats.total_cost
                    ? getFormattedCost(record.investment_stats.total_cost)
                    : "-"}
                </TableCell>
                {/* <TableCell>{formattedCostResult}</TableCell> */}
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

              {/* <TableRow>
              <TableCell>
                {translate("printForm.project_info.evaluation_period")}:
              </TableCell>
              <TableCell>{record.evaluation_period}</TableCell>
            </TableRow> */}
              <TableRow>
                <TableCell>
                  {translate("printForm.project_info.officer")}:
                </TableCell>
                <TableCell>
                  {record.responsible_officers &&
                    record.responsible_officers.map((item, idx) => (
                      <Fragment>
                        {idx === 1 && <hr />}
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
                        {/* <p>
                        {translate(
                          "printForm.project_info.responsible_officers.organization_name"
                        )}
                        :{" "}
                        {item.organization_name ? item.organization_name : "-"}
                      </p> */}
                        <p>
                          {translate(
                            "printForm.project_info.responsible_officers.mobile_phone"
                          )}
                          : {item.mobile_phone ? item.mobile_phone : "-"}
                        </p>
                        <p>
                          {translate(
                            "printForm.project_info.responsible_officers.phone"
                          )}
                          : {item.phone ? item.phone : "-"}
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
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
