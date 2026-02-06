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

export const ProjectFundingAllocation = ({ details, project, ...props }) => {
  const translate = useTranslate();
  const classes = useStyles();

  return (
    <div className="Section2">
      <div className="content-area">
        <Typography variant="h2" style={{ marginLeft: 15, marginBottom: 15 }}>
          Project Funding Allocations
        </Typography>
        <TableContainer>
          <Table
            size="medium"
            className={clsx("bordered", classes.bordered, classes.table)}
          >
            <TableHead>
              <TableRow>
                <TableCell rowSpan={2}>
                  Project Funding Allocations (UShs billion
                </TableCell>
                <TableCell>2018/2019</TableCell>
                <TableCell>2019/2020</TableCell>
                <TableCell></TableCell>
                <TableCell colSpan={2}>MTEF Projections</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Budget</TableCell>
                <TableCell>Budget</TableCell>
                <TableCell>2020/2021</TableCell>
                <TableCell>2021/2022</TableCell>
                <TableCell>2022/2023</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Domestic Development Funding for Project</TableCell>
                <TableCell>0,411</TableCell>
                <TableCell>0,411</TableCell>
                <TableCell>0,611</TableCell>
                <TableCell>0,660</TableCell>
                <TableCell>0,660</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Donor funding for Project</TableCell>
                <TableCell>117,601</TableCell>
                <TableCell>115,300</TableCell>
                <TableCell>296,260</TableCell>
                <TableCell>114,000</TableCell>
                <TableCell>45,000</TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
            <TableRow>
                <TableCell>Total Funding Project</TableCell>
                <TableCell>117,601</TableCell>
                <TableCell>115,711</TableCell>
                <TableCell>296,871</TableCell>
                <TableCell>114,660</TableCell>
                <TableCell>45,660</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
