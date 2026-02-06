import React from "react";
import lodash from "lodash";
import { useTranslate } from "react-admin";
import { romanize } from "../../../../../helpers/formatters";
import { getInvestmentYears } from "../helpers";
import HTML2React from "html2react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from "@material-ui/core";
import { costSumFormatter } from "../../../../../helpers";
import clsx from "clsx";
import { withStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 700,
    width: "100%",
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

export const ProjectTechnicalInformation = (props) => {
  const translate = useTranslate();
  const { record, counter } = props;
  const classes = useStyles();

  if (!record) return null;

  return (
    <div className="Section2">
      <div className="content-area">
        <h2>{romanize(counter)}. Project Technical Information</h2>
        <TableContainer>
          <Table
            size="small"
            className={clsx("bordered", classes.bordered, classes.table)}
          >
            <TableBody>
              <TableRow className="filled-row">
                <TableCell>Output</TableCell>
                <TableCell>Technical Specifications</TableCell>
                <TableCell>Alternative Specifications</TableCell>
              </TableRow>
              {record &&
                record.outputs.map((output) => (
                  <TableRow>
                    <TableCell>{output.name}</TableCell>
                    <TableCell>{HTML2React(output.tech_specs)}</TableCell>
                    <TableCell>
                      {HTML2React(output.alternative_specs)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
