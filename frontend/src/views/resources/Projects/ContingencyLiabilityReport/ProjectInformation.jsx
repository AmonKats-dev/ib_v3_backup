import React from "react";
import { useTranslate, ReferenceField, FunctionField } from "react-admin";

import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Table from "@material-ui/core/Table";
import { Typography } from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import lodash from "lodash";

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

export const ProjectInformation = ({ details, project, ...props }) => {
  const translate = useTranslate();
  const classes = useStyles();
  const meReport = details && lodash.maxBy(details.me_reports, "id");
  const liabilities = meReport?.me_liabilities;

  return (
    <div className="Section2">
      <div className="content-area">
        <Typography variant="h2" style={{ marginLeft: 15, marginBottom: 15 }}>
          Contingency Liability Report
        </Typography>
        <TableContainer>
          <Table
            size="medium"
            className={clsx("bordered", classes.bordered, classes.table)}
          >
            <TableBody>
              {liabilities?.length > 0 ? (
                liabilities.map((item) => (
                  <>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell>{item.description}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Amount</TableCell>
                      <TableCell>{item.amount}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Due date:</TableCell>
                      <TableCell>{item.due_date}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Cause of Liability: </TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Type of liability:</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                  </>
                ))
              ) : (
                <>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>Report description</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Amount</TableCell>
                    <TableCell>1500</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Due date:</TableCell>
                    <TableCell>21/10/2021</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Cause of Liability: </TableCell>
                    <TableCell>Cause</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Type of liability:</TableCell>
                    <TableCell>Liability</TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
