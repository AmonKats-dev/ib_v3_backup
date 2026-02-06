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

export const SummaryProjectEstimates = ({ details, project, ...props }) => {
  const translate = useTranslate();
  const classes = useStyles();

  return (
    <div className="Section2">
      <div className="content-area">
        <Typography variant="h2" style={{ marginLeft: 15, marginBottom: 15 }}>
          Summary Project Estimates
        </Typography>
        <TableContainer>
          <Table
            size="medium"
            className={clsx("bordered", classes.bordered, classes.table)}
          >
            <TableHead>
              <TableRow>
                <TableCell rowSpan={2}>Billions of Uganda Shillings</TableCell>
                <TableCell colSpan={5}>2019/2020 Approved Budget</TableCell>
                <TableCell colSpan={5}>2021/2022 Approved Estimates</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>GoU</TableCell>
                <TableCell>External Fin.</TableCell>
                <TableCell>A.I.A.</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Source of Fund</TableCell>

                <TableCell>GoU</TableCell>
                <TableCell>External Fin.</TableCell>
                <TableCell>A.I.A.</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Source of Fund</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  1263 Agriculture Cluster Development Project
                </TableCell>
                <TableCell>0</TableCell>
                <TableCell>4,000</TableCell>
                <TableCell>0</TableCell>
                <TableCell>4,000</TableCell>
                <TableCell>GoU</TableCell>
                <TableCell>0</TableCell>
                <TableCell>4,900</TableCell>
                <TableCell>0</TableCell>
                <TableCell>4,900</TableCell>
                <TableCell>Donor</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
