import React from "react";
import { useTranslate, ReferenceField, FunctionField } from "react-admin";
import moment from "moment";
import { Fragment } from "react";
import { dateFormatter } from "../../../../helpers";
import { useSelector } from "react-redux";
import lodash from "lodash";
import LevelsStructure from "../Report/components/LevelsStructure";

import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Table from "@material-ui/core/Table";
import { TableFooter, Typography } from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { checkFeature } from "../../../../helpers/checkPermission";
import { formatValuesToQuery } from "../../../../helpers/dataHelpers";
import {
  getTotalProjectCost,
  getTotalProjectOutputsCost,
} from "../Report/helpers";
import { getFiscalYears } from "../Report/helpers";
import { getFiscalYearValue } from "../../../../helpers/formatters";

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

export const CostAnnualizedPlan = ({ details, project, ...props }) => {
  const translate = useTranslate();
  const classes = useStyles();

  return (
    <div className="Section2">
      <div className="content-area">
        <Typography variant="h2" style={{ marginLeft: 15, marginBottom: 15 }}>
          Cost Annualized Plan
        </Typography>
        <TableContainer>
          <Table
            size="medium"
            className={clsx("bordered", classes.bordered, classes.table)}
          >
            <TableHead>
              <TableRow>
                <TableCell rowSpan={3} colSpan={2}>
                  Cost Classification
                </TableCell>
                <TableCell colSpan={5}>Current fiscal year</TableCell>
                <TableCell colSpan={5}>Next fiscal Year</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={5}>2020/2021</TableCell>
                <TableCell colSpan={5}>2021/2022</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Procurement method</TableCell>
                <TableCell>Procurement start date</TableCell>
                <TableCell>Anticipated contract signed date</TableCell>
                <TableCell>Procurement details</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Procurement method</TableCell>
                <TableCell>Procurement start date</TableCell>
                <TableCell>Anticipated contract signed date</TableCell>
                <TableCell>Procurement details</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* <TableRow>
                <TableCell colSpan={12}>Output 1</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={12}>Activity 1</TableCell>
              </TableRow> */}
              <TableRow >
                <TableCell colSpan={2} style={{ fontWeight: 'bold'}}>Cost Classification 1</TableCell>
                <TableCell style={{ fontWeight: 'bold'}}>Procurement method</TableCell>
                <TableCell style={{ fontWeight: 'bold'}}>Procurement start date</TableCell>
                <TableCell style={{ fontWeight: 'bold'}}>Anticipated contract signed date</TableCell>
                <TableCell style={{ fontWeight: 'bold'}}>Procurement details</TableCell>
                <TableCell style={{ fontWeight: 'bold'}}>2000</TableCell>
                <TableCell style={{ fontWeight: 'bold'}}>Procurement method</TableCell>
                <TableCell style={{ fontWeight: 'bold'}}>Procurement start date</TableCell>
                <TableCell style={{ fontWeight: 'bold'}}>Anticipated contract signed date</TableCell>
                <TableCell style={{ fontWeight: 'bold'}}>Procurement details</TableCell>
                <TableCell style={{ fontWeight: 'bold'}}>2000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>Fund Source 1</TableCell>
                <TableCell>Procurement method</TableCell>
                <TableCell>Procurement start date</TableCell>
                <TableCell>Anticipated contract signed date</TableCell>
                <TableCell>Procurement details</TableCell>
                <TableCell>1000</TableCell>
                <TableCell>Procurement method</TableCell>
                <TableCell>Procurement start date</TableCell>
                <TableCell>Anticipated contract signed date</TableCell>
                <TableCell>Procurement details</TableCell>
                <TableCell>1000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>Fund Source 2</TableCell>
                <TableCell>Procurement method</TableCell>
                <TableCell>Procurement start date</TableCell>
                <TableCell>Anticipated contract signed date</TableCell>
                <TableCell>Procurement details</TableCell>
                <TableCell>1000</TableCell>
                <TableCell>Procurement method</TableCell>
                <TableCell>Procurement start date</TableCell>
                <TableCell>Anticipated contract signed date</TableCell>
                <TableCell>Procurement details</TableCell>
                <TableCell>1000</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
