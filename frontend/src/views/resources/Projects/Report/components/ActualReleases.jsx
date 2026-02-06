import React from "react";
import HTML2React from "html2react";
import lodash from "lodash";
import {
  getFiscalYearsRangeForIntervals,
  romanize,
} from "../../../../../helpers/formatters";
import { billionsFormatter, costSumFormatter } from "../helpers";
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
import {
  formatValuesToQuery,
  parseQueryToValues,
} from "../../../../../helpers/dataHelpers";
import moment from "moment";

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

export const ActualReleases = (props) => {
  const classes = useStyles();
  const translate = useTranslate();
  const { customRecord, customBasePath } = props;
  const record = formatValuesToQuery(customRecord);
  const counter = props.counter || 4;

  if (!record) {
    return null;
  }

  const meReport = props.meReport || lodash.last(record.me_reports);

  const funds = lodash.groupBy(meReport.me_releases, "release_type");
  const fundCosts = {
    government: 0,
    donor: 0,
  };

  funds.ACTUAL.forEach((item) => {
    lodash.keys(item.donor_funded).forEach((year) => {
      fundCosts.donor += parseFloat(item.donor_funded[year]);
    });

    lodash.keys(item.government_funded).forEach((year) => {
      fundCosts.government += parseFloat(item.government_funded[year]);
    });
  });

  return (
    <div className="landscapeSection">
      <div className="content-area">
        <h2>Table 6: Actual Releases</h2>
        <TableContainer>
          <Table
            size="small"
            className={clsx("bordered", classes.bordered, classes.table)}
            style={{ width: '100%' }}
            >
            <TableBody>
              <TableRow className={classes.filledRow}>
                <TableCell></TableCell>
                <TableCell>Fund</TableCell>
                <TableCell>Total</TableCell>
                {funds.PLANNED.map((item) => {
                  return lodash.keys(item.donor_funded).map((year) => {
                    return <TableCell>{year}</TableCell>;
                  });
                })}
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Government</TableCell>
                <TableCell>
                  {billionsFormatter(fundCosts.government)}{" "}
                </TableCell>
                {funds.PLANNED.map((item) => {
                  return lodash.keys(item.government_funded).map((year) => {
                    return (
                      <TableCell>
                        {billionsFormatter(
                          parseFloat(item.government_funded[year])
                        )}
                      </TableCell>
                    );
                  });
                })}
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Donor</TableCell>
                <TableCell>{billionsFormatter(fundCosts.donor)} </TableCell>
                {funds.PLANNED.map((item) => {
                  return lodash.keys(item.donor_funded).map((year) => {
                    return (
                      <TableCell>
                        {billionsFormatter(parseFloat(item.donor_funded[year]))}
                      </TableCell>
                    );
                  });
                })}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
