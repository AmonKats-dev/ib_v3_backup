import React from "react";
import { useTranslate } from "react-admin";
import HTML2React from "html2react";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { renderTitle } from "./helpers";

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

export const Liabilities = (props) => {
  const translate = useTranslate();
  const { record, projectDetails, counter = 1 } = props;
  const classes = useStyles();

  return (
    <div className="Section2">
      <div className="content-area">
        <h2>{renderTitle(record, projectDetails, "Contingency Liability ")}</h2>
        <TableContainer>
          <Table
            size="medium"
            className={clsx("bordered", classes.bordered, classes.table)}
          >
            <TableBody>
              <TableRow>
                <TableCell variant="head">Amount</TableCell>
                <TableCell variant="head">Due Date</TableCell>
                <TableCell variant="head">Description</TableCell>
              </TableRow>
              {record &&
                record.me_liabilities &&
                record.me_liabilities.map((item) => (
                  <TableRow>
                    <TableCell> {item.amount}</TableCell>
                    <TableCell> {item.due_date}</TableCell>
                    <TableCell> {item.description}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
