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

export const IssuesRecommendations = (props) => {
  const translate = useTranslate();
  const { record, projectDetails, counter = 1 } = props;
  const classes = useStyles();

  return (
    <div className="Section2">
      <div className="content-area">
        <h2>{renderTitle(record, projectDetails, "Coordination issues ")}</h2>
        <TableContainer>
          <Table
            size="medium"
            className={clsx("bordered", classes.bordered, classes.table)}
          >
            <TableBody>
              <TableRow>
                <TableCell variant="head">Issues</TableCell>
                <TableCell variant="head">Challenges</TableCell>
                <TableCell variant="head">Recommendations</TableCell>
              </TableRow>
              {record &&
                record.issues &&
                record.issues
                  .filter((item) => item)
                  .map((item) => (
                    <TableRow>
                      <TableCell>
                        {item.issue === "Other"
                          ? item.issues_other
                          : item.issue}
                      </TableCell>
                      <TableCell> {item.challenges}</TableCell>
                      <TableCell> {item.recommendations}</TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
