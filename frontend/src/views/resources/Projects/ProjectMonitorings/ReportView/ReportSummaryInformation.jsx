import React from "react";
import lodash from "lodash";
import { billionsFormatter, costSumFormatter } from "../../Report/helpers";
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
import { dateFormatter } from "../../../../../helpers";
import HTML2React from "html2react";
import { getFiscalYearValueFromYear } from "../../../../../helpers/formatters";
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

export const ReportSummaryInformation = (props) => {
  const classes = useStyles();
  const translate = useTranslate();
  const { customRecord, customBasePath } = props;
  const record = formatValuesToQuery(customRecord);
  const counter = props.counter || 4;

  if (!record) {
    return null;
  }

  function getFundSources() {
    const funds = [];
    if (customRecord && customRecord.activities) {
      customRecord.activities.forEach((activity) => {
        activity &&
          activity.investments &&
          activity.investments.forEach((investment) => {
            if (investment && investment.fund && investment.fund.name) {
              funds.push(investment.fund.name);
            }
          });
      });
    }
    return funds.length > 0 ? lodash.uniq(funds).join(", ") : null;
  }

  const getQuaterLabel = (quarter) => {
    switch (quarter) {
      case "Q1":
      case "Q3":
        return quarter;
      case "Q2":
        return "Semi-Annual";
      case "Q4":
        return "Annual";
      default:
        return "";
    }
  };

  return (
    <div className="landscapeSection">
      <h2>{"Overview"}</h2>
      <div className="content-area">
        <TableContainer>
          <Table
            size="small"
            className={clsx("bordered", classes.bordered, classes.table)}
            style={{ width: "100%" }}
          >
            <TableBody>
              <TableRow>
                <TableCell>Executive Summary</TableCell>
                <TableCell>{props.record.summary}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Introduction</TableCell>
                <TableCell>{props.record.rational_study}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Methodology</TableCell>
                <TableCell>{props.record.methodology}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Environmental Issues</TableCell>
                <TableCell>{props.record.environmental_issues}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Social Safeguards</TableCell>
                <TableCell>{props.record.social_safe_guards}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Gender Equity</TableCell>
                <TableCell>{props.record.gender_equity}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Funding Source</TableCell>
                <TableCell>{getFundSources()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Date of effectiveness of project</TableCell>
                <TableCell>
                  {dateFormatter(props.record.effectiveness_date)}
                </TableCell>
              </TableRow>
              {props.record && props.record.frequency === "ANNUAL" && (
                <TableRow>
                  <TableCell>Disbursement</TableCell>
                  <TableCell>{props.record.disbursement}</TableCell>
                </TableRow>
              )}

              <TableRow>
                <TableCell>Type of M&E Methodology</TableCell>
                <TableCell>{props.record.me_type}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Data collection method/source</TableCell>
                <TableCell>{props.record.data_collection_type}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Period of Assessment</TableCell>
                <TableCell>
                  {props.record.frequency === "ANNUAL"
                    ? `${getQuaterLabel(props.record.quarter)} - ${
                        getFiscalYearValueFromYear(props.record.year).name
                      } `
                    : `Independent Reporting: ${getQuaterLabel(
                        props.record.quarter
                      )} `}
                </TableCell>
              </TableRow>

              {/* <TableRow>
                <TableCell>Report dates</TableCell>
                <TableCell>
                  {props.record.frequency === "ANNUAL"
                    ? `${getFiscalYearValueFromYear(props.record.year).name} - ${props.record.quarter}`
                    : `${dateFormatter(props.record.start_date)}/${dateFormatter(props.record.end_date)}`}
                </TableCell>
              </TableRow> */}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
