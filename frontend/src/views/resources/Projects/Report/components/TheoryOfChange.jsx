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

export const TheoryOfChange = (props) => {
  const { customRecord, counter } = props;
  const translate = useTranslate();
  const classes = useStyles();

  return (
    <div className="landscapeSection">
      <div className="content-area">
        <h2>{romanize(counter)}. Theory of change</h2>
        <TableContainer>
          <Table
            size="small"
            className={clsx("bordered", classes.bordered, classes.table)}
            style={{ width: '100%' }}
            >
            <TableBody>
              <TableRow>
                <TableCell>Activity</TableCell>
                <TableCell>Output</TableCell>
                <TableCell>Outcome</TableCell>
                <TableCell>Impact</TableCell>
              </TableRow>
              <TableCell>
                {customRecord &&
                  customRecord.activities &&
                  customRecord.activities.length !== 0 &&
                  customRecord.activities.map((item) => (
                    <TableRow>{item.name}</TableRow>
                  ))}
              </TableCell>
              <TableCell>
                {customRecord &&
                  customRecord.outputs &&
                  customRecord.outputs.length !== 0 &&
                  customRecord.outputs.map((item) => (
                    <TableRow>{item.name}</TableRow>
                  ))}
              </TableCell>
              <TableCell>
                {customRecord &&
                  customRecord.outcomes &&
                  customRecord.outcomes.length !== 0 &&
                  customRecord.outcomes.map((item) => (
                    <TableRow>{item.name}</TableRow>
                  ))}
              </TableCell>
              <TableCell>{customRecord.goal}</TableCell>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
