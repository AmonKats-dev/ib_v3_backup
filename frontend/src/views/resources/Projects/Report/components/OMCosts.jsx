import React from "react";
import lodash from "lodash";
import { useTranslate } from "react-admin";
import {
  romanize,
  getFiscalYearValue,
} from "../../../../../helpers/formatters";
import { costSumFormatter } from "../helpers";
import moment from "moment";

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
import { checkFeature } from "../../../../../helpers/checkPermission";

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

export const OMCosts = (props) => {
  const translate = useTranslate();
  const { customRecord, counter } = props;
  const classes = useStyles();

  if (customRecord && !customRecord.maintenance_period) {
    return (
      <div className="Section2">
        <div className="content-area">
          <h2>
            {counter ? `${romanize(counter)}.` : ""}{" "}
            {translate("printForm.background.om_costs")}
          </h2>
          <div>Project has no Operation & Maintenance period</div>
        </div>
      </div>
    );
  }

  if (checkFeature("has_multiple_om_costs")) {
    if (customRecord && !lodash.isEmpty(customRecord.om_costs))
      return (
        <div className="landscapeSection">
          <div className="content-area">
            <h2>
              {counter ? `${romanize(counter)}.` : ""}{" "}
              {translate("printForm.background.om_costs")}
            </h2>
            <TableContainer>
              <Table
                size="small"
                className={clsx("bordered", classes.bordered, classes.table)}
                style={{ width: '100%' }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Cost Classification Code</TableCell>
                    <TableCell>Cost Classification Name</TableCell>
                    {customRecord &&
                      customRecord.om_costs &&
                      customRecord.om_costs[0] &&
                      customRecord.om_costs[0].costs &&
                      lodash
                        .keys(customRecord.om_costs[0].costs)
                        .map((year) => (
                          <TableCell>
                            {
                              getFiscalYearValue(moment(year, "YYYY-MM-DD"))
                                .name
                            }
                          </TableCell>
                        ))}
                    <TableCell>Source of Funds</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customRecord.om_costs &&
                    customRecord.om_costs.map((costItem) => (
                      <TableRow>
                        <TableCell>
                          {costItem &&
                            costItem.costing &&
                            `${costItem.costing.code}`}
                        </TableCell>
                        <TableCell>
                          {costItem &&
                            costItem.costing &&
                            `${costItem.costing.name}`}
                        </TableCell>

                        {costItem &&
                          costItem.costs &&
                          lodash
                            .keys(costItem.costs)
                            .map((year) => (
                              <TableCell>
                                {costSumFormatter(costItem.costs[year])}
                              </TableCell>
                            ))}

                        <TableCell>
                          {costItem &&
                            costItem.fund &&
                            `${costItem.fund.code} - ${costItem.fund.name}`}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      );

    return null;
  }

  if (customRecord && !lodash.isEmpty(customRecord.om_cost)) {
    return (
      <div className="landscapeSection">
        <div className="content-area">
          <h2>
            {counter ? `${romanize(counter)}.` : ""}{" "}
            {translate("printForm.background.om_costs")}
          </h2>
          <TableContainer>
            <Table
              size="small"
              className={clsx("bordered", classes.bordered, classes.table)}
              style={{ width: '100%' }}
              >
              <TableHead>
                <TableRow>
                  <TableCell>Cost Classification Code</TableCell>
                  <TableCell>Cost Classification Name</TableCell>
                  {customRecord &&
                    customRecord.om_cost &&
                    lodash
                      .keys(customRecord.om_cost)
                      .map((year) => (
                        <TableCell>
                          {getFiscalYearValue(moment(year, "YYYY-MM-DD")).name}
                        </TableCell>
                      ))}
                  <TableCell>Source of Funds</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    {customRecord &&
                      customRecord.om_costing &&
                      `${customRecord.om_costing.code}`}
                  </TableCell>
                  <TableCell>
                    {customRecord &&
                      customRecord.om_costing &&
                      `${customRecord.om_costing.name}`}
                  </TableCell>
                  {customRecord &&
                    customRecord.om_cost &&
                    lodash
                      .keys(customRecord.om_cost)
                      .map((year) => (
                        <TableCell>
                          {costSumFormatter(customRecord.om_cost[year])}
                        </TableCell>
                      ))}
                  <TableCell>
                    {customRecord &&
                      customRecord.om_fund &&
                      `${customRecord.om_fund.code} - ${customRecord.om_fund.name}`}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    );
  }

  return null;
};
