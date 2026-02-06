import React from "react";
import HTML2React from "html2react";
import { useTranslate } from "react-admin";
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

export const OutputsRisks = ({ record, projectDetails, ...props }) => {
  const classes = useStyles();
  const translate = useTranslate();

  return (
    <div className="landscapeSection">
      <div className="content-area">
        <h2>Table 4: Output risks monitoring</h2>
        <TableContainer>
          <Table
            size="small"
            className={clsx("bordered", classes.bordered, classes.table)}
            style={{ width: '100%' }}
            >
            <TableBody>
              <TableRow className={classes.filledRow}>
                <TableCell>Output</TableCell>
                <TableCell>Risk Description</TableCell>
                <TableCell>Risk Response</TableCell>
              </TableRow>
              {record &&
                record.me_outputs &&
                record.me_outputs.map((item, outputIdx) => (
                  <TableRow>
                    <TableCell rowSpan={item.indicators.length}>
                    <p>{`${translate("printForm.project_framework.output", {
                          smart_count: 1,
                        })} ${outputIdx + 1}: ${
                          item.name || (item.output && item.output.name)
                        }`}</p>
                        <div style={{ fontSize: "12px", fontStyle: "italic" }}>
                          {HTML2React(
                            item.description ||
                              (item.output && item.output.description)
                          )}
                        </div>
                    </TableCell>
                    <TableCell>{item.risk_description}</TableCell>
                    <TableCell>{item.risk_response}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
