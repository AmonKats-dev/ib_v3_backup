import React from "react";
import { useTranslate } from "react-admin";
import {
  getFiscalYearValue,
  romanize,
} from "../../../../../helpers/formatters";
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
import { useSelector } from "react-redux";
import lodash from "lodash";
import { formatValuesToQuery } from "../../../../../helpers/dataHelpers";
import { costSumFormatter } from "../../../../../helpers";
import { checkFeature } from "../../../../../helpers/checkPermission";

const useStyles = makeStyles((theme) => ({
  Table: {
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

export const ProjectBudgetAllocation = (props) => {
  const translate = useTranslate();
  const classes = useStyles();

  const { customRecord, counter } = props;
  const projects = useSelector((state) => state.admin.resources.projects);
  const currentProject = formatValuesToQuery(
    projects.data[props.customRecord.project_id]
  );

  function renderPimisTable() {
    return (
      <TableContainer>
        <Table
          size="small"
          className={clsx("bordered", classes.bordered, classes.table)}
        >
           <TableBody>
                {currentProject && currentProject.budget_allocation && (
                  <TableRow variant="head">
                     <TableCell variant="head"></TableCell>
                    {lodash
                      .keys(currentProject.budget_allocation.gov)
                      .map((year) => (
                        <TableCell variant="head">{`${
                          getFiscalYearValue(year.slice(0,4)).name
                        } (${translate("titles.currency")})`}</TableCell>
                      ))}
                  </TableRow>
                )}
                {currentProject && currentProject.budget_allocation && (
                  <TableRow>
                     <TableCell variant="head">Government of Uganda</TableCell>
                    {lodash
                      .keys(currentProject.budget_allocation.gov)
                      .map((year) => (
                        <TableCell>{`${costSumFormatter(
                          currentProject.budget_allocation.donor[year]
                        )}`}</TableCell>
                      ))}
                  </TableRow>
                )}
                 {currentProject && currentProject.budget_allocation && (
                  <TableRow>
                     <TableCell variant="head">Donor</TableCell>
                    {lodash
                      .keys(currentProject.budget_allocation.donor)
                      .map((year) => (
                        <TableCell>{`${costSumFormatter(
                          currentProject.budget_allocation.donor[year]
                        )}`}</TableCell>
                      ))}
                  </TableRow>
                )}
              </TableBody>
        </Table>
      </TableContainer>
    );
  }

  function renderIbpTable() {
    return (
      <TableContainer>
        <Table
          size="small"
          className={clsx("bordered", classes.bordered, classes.table)}
        >
          <TableBody>
            {currentProject && currentProject.budget_allocation && (
              <TableRow variant="head">
                <TableCell variant="head">Type</TableCell>
                {lodash
                  .keys(currentProject.budget_allocation.gov)
                  .map((year) => (
                    <TableCell align="center" variant="head">{`${
                      getFiscalYearValue(String(year).replace("y", "")).name
                    } (${translate("titles.currency")})`}</TableCell>
                  ))}
              </TableRow>
            )}
            {currentProject &&
              currentProject.budget_allocation &&
              currentProject.budget_allocation.gov && (
                <TableRow>
                <TableCell variant="head">GoU</TableCell>
                  {lodash
                    .keys(currentProject.budget_allocation.gov)
                    .map((year) => (
                      <TableCell align="center"> {`${costSumFormatter(
                        currentProject.budget_allocation.gov[year]
                      )}`}</TableCell>
                    ))}
                </TableRow>
              )}
            {currentProject &&
              currentProject.budget_allocation &&
              currentProject.budget_allocation.donor && (
                <TableRow>
                <TableCell variant="head">Donor</TableCell>
                  {lodash
                    .keys(currentProject.budget_allocation.donor)
                    .map((year) => (
                      <TableCell align="center">{`${costSumFormatter(
                        currentProject.budget_allocation.donor[year]
                      )}`}</TableCell>
                    ))}
                </TableRow>
              )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (currentProject.budget_code) {
    return (
      <div className="Section2">
        <div className="content-area">
          <h2>
            {romanize(counter)}.{" "}
            {translate("printForm.project_info.budget_allocation_title")}
          </h2>
          <TableContainer>
            <Table
              size="small"
              className={clsx("bordered", classes.bordered, classes.table)}
            >
              <TableBody>
                {currentProject && (
                  <TableRow>
                    <TableCell>
                      {translate("printForm.project_info.budget_code")}
                    </TableCell>
                    <TableCell>{`${
                      currentProject.budget_code || "No code"
                    }`}</TableCell>
                  </TableRow>
                )}
                {currentProject && (
                  <TableRow>
                    <TableCell>
                      {translate("printForm.project_info.signed_date")}
                    </TableCell>
                    <TableCell>{`${
                      currentProject.signed_date || "-"
                    }`}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <br />
          {checkFeature("has_pimis_fields")
            ? renderPimisTable()
            : renderIbpTable()}
          {/* <TableContainer>
            <Table
              size="small"
              className={clsx("bordered", classes.bordered, classes.table)}
            >
              <TableBody>
                {currentProject && currentProject.budget_allocation && (
                  <TableRow variant="head">
                    {lodash
                      .keys(currentProject.budget_allocation)
                      .map((year) => (
                        <TableCell variant="head">{`${
                          getFiscalYearValue(year).name
                        } (${translate("titles.currency")})`}</TableCell>
                      ))}
                  </TableRow>
                )}
                {currentProject && currentProject.budget_allocation && (
                  <TableRow>
                    {lodash
                      .keys(currentProject.budget_allocation)
                      .map((year) => (
                        <TableCell>{`${costSumFormatter(
                          currentProject.budget_allocation[year]
                        )}`}</TableCell>
                      ))}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer> */}
        </div>
      </div>
    );
  }

  return (
    <div className="Section2">
      <div className="content-area">
        <h2>
          {romanize(counter)}.{" "}
          {translate("printForm.project_info.budget_allocation_title")}
        </h2>
      </div>
      <h4>No budgeting</h4>
    </div>
  );

  return null;
};
