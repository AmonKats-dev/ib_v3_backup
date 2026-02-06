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

export const RiskManagement = ({ details, project, ...props }) => {
  const translate = useTranslate();
  const classes = useStyles();
  const option = details && lodash.first(details.project_options);

  return (
    <div className="Section2">
      <div className="content-area">
        <Typography variant="h2" style={{ marginLeft: 15, marginBottom: 15 }}>
          RiskManagement
        </Typography>
        <TableContainer>
          <Table
            size="medium"
            className={clsx("bordered", classes.bordered, classes.table)}
          >
            <TableHead>
              <TableRow>
                <TableCell rowSpan={2}>Risk Description</TableCell>
                <TableCell>
                  Likelihood of Occurrence (Low to Very High)
                </TableCell>
                <TableCell>Impact (Low to very high)</TableCell>
                <TableCell>Mitigation plan</TableCell>
                <TableCell>Responsible Entity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {option.risk_evaluations?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.occurrence}</TableCell>
                  <TableCell>{item.impact}</TableCell>
                  <TableCell>{item.mitigation_plan}</TableCell>
                  <TableCell>{item.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
