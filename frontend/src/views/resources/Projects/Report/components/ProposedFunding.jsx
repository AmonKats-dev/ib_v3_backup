import React from "react";
import lodash from "lodash";
import { useTranslate } from "react-admin";
import { romanize } from "../../../../../helpers/formatters";
import { getInvestmentYears } from "../helpers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from "@material-ui/core";
import { costSumFormatter } from "../../../../../helpers";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 700,
    width: "55%",
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

export const ProposedFunding = (props) => {
  const translate = useTranslate();
  const { customRecord, counter } = props;
  const years = getInvestmentYears(customRecord.activities);
  const classes = useStyles();

  function getActivitiesForOutput(outputId) {
    return customRecord.activities.filter((activity) =>
      activity.output_ids.includes(outputId)
    );
  }

  const funds = customRecord.outputs.map((output) =>
    getActivitiesForOutput(output.id).map((activity) =>
      activity.investments.map((investment) => {
        let invTotal = 0;
        years.forEach((year) => {
          invTotal += investment.costs[year]
            ? parseFloat(investment.costs[year])
            : 0;
        });
        if (investment.fund) {
          return {
            fund_id: investment.fund.id,
            fund_label: `${investment.fund.code} - ${investment.fund.name}`,
            total: invTotal,
          };
        }
        return {};
      })
    )
  );

  const concatedFunds = [].concat.apply([], funds);
  const groupResults = lodash.groupBy(
    lodash.flatten(concatedFunds),
    "fund_label"
  );

  return (
    <div className="Section2">
      <div className="content-area">
        <h2>
          {romanize(counter)}. {translate("printForm.funding.title")}
        </h2>
        <TableContainer>
          <Table
            size="small"
            className={clsx("bordered", classes.bordered, classes.table)}
          >
            <TableBody>
              <TableRow className="filled-row">
                <TableCell>{translate("printForm.funding.fund")}</TableCell>
                <TableCell>{translate("printForm.funding.ugx")}</TableCell>
              </TableRow>
              {lodash.keys(groupResults).map((fund) => (
                <TableRow>
                  <TableCell>{fund}</TableCell>
                  <TableCell>
                    {costSumFormatter(
                      lodash.sumBy(groupResults[fund], (item) =>
                        parseFloat(item.total)
                      )
                    )}
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
