import HTML2React from "html2react";
import React from "react";
import { romanize } from "../../../../../helpers/formatters";
import { useTranslate } from "react-admin";

import { withStyles, makeStyles } from "@material-ui/core/styles";

import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Table from "@material-ui/core/Table";
import clsx from "clsx";
import { formatValuesToQuery } from "../../../../../helpers/dataHelpers";

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

export const ProjectFramework = (props) => {
  let { customRecord, counter } = props;
  const translate = useTranslate();
  const classes = useStyles();
  customRecord = formatValuesToQuery(customRecord);

  return (
    <div className="landscapeSection">
      <div className="content-area">
        <h2>
          {romanize(counter)}. {translate("printForm.project_framework.title")}
        </h2>
        <TableContainer>
          <Table size="small" className={clsx("bordered", classes.bordered, classes.table)} style={{ width: '100%' }}>
            <TableBody>
              <TableRow className={classes.filledRow}>
                <TableCell>
                  <strong>
                    {romanize(counter + ".1")}{" "}
                    {translate("printForm.project_framework.goal")}
                  </strong>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <ul>
                    <li>
                      {romanize(counter + ".1.1")} {customRecord.goal}
                    </li>
                  </ul>
                </TableCell>
              </TableRow>
              <TableRow className={classes.filledRow}>
                <TableCell>
                  <strong>
                    {romanize(counter + ".2")}{" "}
                    {translate("printForm.project_framework.outcome", {
                      smart_count: 2,
                    })}
                  </strong>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {customRecord &&
                  customRecord.outcomes &&
                  customRecord.outcomes.length !== 0 ? (
                    <ul>
                      {customRecord.outcomes.map((item, idx) => (
                        <li>
                          {romanize(counter + ".2." + Number(idx + 1))}{" "}
                          {`${translate("printForm.project_framework.outcome", {
                            smart_count: 1,
                          })} ${idx + 1}: ${item.name}`}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </TableCell>
              </TableRow>
              <TableRow className={classes.filledRow}>
                <TableCell>
                  <strong>
                    {romanize(counter + ".3")}{" "}
                    {translate("printForm.project_framework.output", {
                      smart_count: 2,
                    })}
                  </strong>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {customRecord &&
                  customRecord.outputs &&
                  customRecord.outputs.length !== 0 ? (
                    <ul>
                      {customRecord.outputs.map((item, idx) => (
                        <li>
                          {romanize(counter + ".3." + Number(idx + 1))}{" "}
                          {`${translate("printForm.project_framework.output", {
                            smart_count: 1,
                          })} ${idx + 1}: ${item.name}`}
                          <br />
                          <div style={{ fontStyle: "italic" }}>
                            {HTML2React(item.description)}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <br></br>
                  {customRecord &&
                  customRecord.activities &&
                  customRecord.activities.length !== 0 ? (
                    <p>
                      {`${translate("printForm.project_framework.activity", {
                        smart_count: 2,
                      })}: ${
                        customRecord.activities
                          ? customRecord.activities
                              .map((item) => item.name)
                              .join(", ")
                          : ""
                      }`}
                    </p>
                  ) : null}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
