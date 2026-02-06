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

export const Challenges = (props) => {
  const translate = useTranslate();
  const { record, projectDetails, counter = 1 } = props;
  const classes = useStyles();

  return (
    <div className="Section2">
      <div className="content-area">
        <h2>{renderTitle(record, projectDetails, "Conclusion")}</h2>
        <TableContainer>
          <Table
            size="medium"
            className={clsx("bordered", classes.bordered, classes.table)}
          >
            <TableBody>
              <TableRow>
                <TableCell>Challenges</TableCell>
                <TableCell>{record.challenges}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Recommendations </TableCell>
                <TableCell>{record.recommendations}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Lessons Learned</TableCell>
                <TableCell>{record.lessons_learned}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Remarks</TableCell>
                <TableCell>{record.remarks ? record.remarks : ""}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Overall Project Rating</TableCell>
                <TableCell>
                  {record.overall_project_rating
                    ? record.overall_project_rating
                    : ""}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
