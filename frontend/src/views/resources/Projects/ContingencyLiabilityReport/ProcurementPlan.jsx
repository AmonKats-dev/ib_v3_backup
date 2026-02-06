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

export const ProcurementPlan = ({ details, project, ...props }) => {
  const translate = useTranslate();
  const classes = useStyles();

  return (
    <div className="Section2">
      <div className="content-area">
        <Typography variant="h2" style={{ marginLeft: 15, marginBottom: 15 }}>
          ProcurementPlan
        </Typography>
        <Typography variant="h4" style={{ marginLeft: 15, marginBottom: 15 }}>
          Vote: 013 Ministry of Education and Sports
        </Typography>
        <TableContainer>
          <Table
            size="medium"
            className={clsx("bordered", classes.bordered, classes.table)}
          >
            <TableBody>
              <TableRow>
                <TableCell>Name of Procuring Entry:</TableCell>
                <TableCell>Ministry of Education and Sports</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Financial Year:</TableCell>
                <TableCell>2021-2022</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <TableContainer>
          <Table
            size="medium"
            className={clsx("bordered", classes.bordered, classes.table)}
          >
            <TableHead>
              <TableRow>
                <TableCell rowSpan={2}>S/no</TableCell>
                <TableCell rowSpan={2}>Subject of procurement</TableCell>
                <TableCell rowSpan={2}>Plan</TableCell>
                <TableCell colSpan={3}>Basic Data</TableCell>
                <TableCell colSpan={2}>Contract Finalization</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Estimated Cost (UGX)</TableCell>
                <TableCell>Source of Funding</TableCell>
                <TableCell>Procurement Method</TableCell>
                <TableCell>Contract Signature Date</TableCell>
                <TableCell>Procurement Start Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={8}>
                  Sub-Programm: 01 Pre-Primary and Primary Education
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={8}>
                  Department: 02 Basic Education
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={8}>
                  Budget Output: 01 Policies, laws, guidelines, plans and
                  strategies
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>221011</TableCell>
                <TableCell>Printing, Stationery, Photocopying</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell>176,151.355</TableCell>
                <TableCell>Now Wage</TableCell>
                <TableCell>Restricted Bidding</TableCell>
                <TableCell>6/11/2021</TableCell>
                <TableCell>8/30/2021</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
