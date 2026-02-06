import React from "react";
import HTML2React from "html2react";
import { useTranslate } from "react-admin";
import {
  getFiscalYearsRangeForIntervals,
  romanize,
  getFiscalYearValue,
} from "../../../../../helpers/formatters";
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
import moment from "moment";
import lodash from "lodash";
import { formatValuesToQuery } from "../../../../../helpers/dataHelpers";

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

const getOutcomesForOutput = (record, item) => {
  const filtered = record.outcomes.filter((outcome) =>
    item.outcome_ids.includes(outcome.id)
  );

  return filtered && filtered.length !== 0
    ? filtered.map((outcome) => outcome.name).join(", ")
    : "-";
};

export const PhysicalMonitoring = (props) => {
  const classes = useStyles();
  const translate = useTranslate();
  const { customRecord, customBasePath } = props;
  const counter = props.counter || 3;
  const record = customRecord;

  const fiscalYearsFromProps = getFiscalYearsRangeForIntervals(
    record.start_date,
    record.end_date
  );

  const recordC = formatValuesToQuery(customRecord);
  const meReport = props.meReport || lodash.last(recordC.me_reports);

  return (
    <div className="landscapeSection">
      <div className="content-area">
        <h2>Table 1: Physical Monitoring</h2>
        <TableContainer>
          <Table
            size="small"
            className={clsx("bordered", classes.bordered, classes.table)}
            style={{ width: '100%' }}
            >
            <TableBody>
              <TableRow className={classes.filledRow}>
                <TableCell rowspan="2">
                  {translate("printForm.project_framework.goal")}
                </TableCell>
                <TableCell rowspan="2">
                  {translate("printForm.result_matrix.indicator_title")}
                </TableCell>
                <TableCell colspan={2}>
                  {translate("printForm.result_matrix.indicator")}
                </TableCell>
                <TableCell rowspan={2}>Risk Response</TableCell>
                <TableCell rowspan={2}>Type of M&E Methodology</TableCell>
                <TableCell rowspan={2}>Data collection method/source</TableCell>
                <TableCell rowspan={2}>Frequency of data collection</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{`${translate("printForm.result_matrix.baseline")} ${
                  record.baseline &&
                  getFiscalYearValue(moment(record.baseline, "YYYY-MM-DD")).name
                }`}</TableCell>
                {[fiscalYearsFromProps[0]].map((year) => (
                  <TableCell>
                    <strong>{`${translate("printForm.result_matrix.target")} ${
                      year.name
                    }`}</strong>
                  </TableCell>
                ))}
              </TableRow>
              {record && record.indicators && record.indicators.length !== 0 ? (
                [record.indicators[0]].map((indicator, idx) => (
                  <TableRow>
                    {idx === 0 ? (
                      <TableCell
                        rowSpan={record.indicators.length}
                      >{`${translate(
                        "printForm.result_matrix.project_goal"
                      )}: ${record.goal}`}</TableCell>
                    ) : null}
                    <TableCell>{`Indicator ${idx + 1}: ${
                      indicator.name
                    }`}</TableCell>
                    <TableCell>{indicator.baseline}</TableCell>
                    {[fiscalYearsFromProps[0]].map((year) => (
                      <TableCell>
                        {indicator.targets[Number(year.id)]}
                      </TableCell>
                    ))}
                    <TableCell>{indicator.verification_means}</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={fiscalYearsFromProps.length + 2 + 5}
                  >{`${translate("printForm.result_matrix.project_goal")}: ${
                    record.goal
                  }`}</TableCell>
                </TableRow>
              )}

              <TableRow className={classes.filledRow}>
                <TableCell colSpan={fiscalYearsFromProps.length + 2 + 4}>
                  {translate("printForm.project_framework.outcome", {
                    smart_count: 2,
                  })}
                </TableCell>
              </TableRow>

              {record &&
                record.outcomes &&
                record.outcomes.map((item, idxOutcome) =>
                  item.indicators && item.indicators.length !== 0 ? (
                    [item.indicators[0]].map((indicator, idx) => (
                      <TableRow>
                        {idx === 0 ? (
                          <TableCell rowSpan={item.indicators.length}>
                            <p>{`${translate(
                              "printForm.project_framework.outcome",
                              { smart_count: 1 }
                            )} ${idxOutcome + 1}: ${item.name}`}</p>
                            <div
                              style={{ fontSize: "12px", fontStyle: "italic" }}
                            >
                              {HTML2React(item.description)}
                            </div>
                          </TableCell>
                        ) : null}
                        <TableCell>{`Indicator ${idx + 1}: ${
                          indicator.name
                        }`}</TableCell>
                        <TableCell>{indicator.baseline}</TableCell>
                        {[fiscalYearsFromProps[0]].map((year) => (
                          <TableCell>
                            {indicator.targets[Number(year.id)]}
                          </TableCell>
                        ))}
                        <TableCell>{indicator.risk_factors}</TableCell>
                        <TableCell>{meReport.me_type}</TableCell>
                        <TableCell>{meReport.data_collection_type}</TableCell>
                        <TableCell>
                          {meReport.quarter ? "QUARTER" : "YEAR"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={fiscalYearsFromProps.length + 2 + 5}>
                        <p>{`${translate(
                          "printForm.project_framework.outcome",
                          {
                            smart_count: 1,
                          }
                        )} ${idxOutcome + 1}: ${item.name}`}</p>
                        <div style={{ fontSize: "12px", fontStyle: "italic" }}>
                          {HTML2React(item.description)}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                )}

              <TableRow className={classes.filledRow}>
                <TableCell colSpan={fiscalYearsFromProps.length + 2 + 4}>
                  {translate("printForm.project_framework.output", {
                    smart_count: 2,
                  })}
                </TableCell>
              </TableRow>

              {record &&
                record.outputs &&
                record.outputs.map((item, outputIdx) =>
                  item.indicators && item.indicators.length !== 0 ? (
                    [item.indicators[0]].map((indicator, idx) => (
                      <TableRow>
                        {idx === 0 ? (
                          <TableCell rowSpan={item.indicators.length}>
                            <p>{`${translate(
                              "printForm.project_framework.output",
                              { smart_count: 1 }
                            )} ${outputIdx + 1}: ${item.name}`}</p>
                            <div
                              style={{ fontSize: "12px", fontStyle: "italic" }}
                            >
                              {HTML2React(item.description)}
                            </div>
                          </TableCell>
                        ) : null}
                        <TableCell>{`Indicator ${idx + 1}: ${
                          indicator.name
                        }`}</TableCell>
                        <TableCell>{indicator.baseline}</TableCell>
                        {[fiscalYearsFromProps[0]].map((year) => (
                          <TableCell>
                            {indicator.targets[Number(year.id)]}
                          </TableCell>
                        ))}
                        <TableCell>{indicator.risk_factors}</TableCell>
                        <TableCell>{meReport.me_type}</TableCell>
                        <TableCell>{meReport.data_collection_type}</TableCell>
                        <TableCell>
                          {meReport.quarter ? "QUARTER" : "YEAR"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={fiscalYearsFromProps.length + 2 + 5}>
                        <p>{`${translate("printForm.project_framework.output", {
                          smart_count: 1,
                        })} ${outputIdx + 1}: ${item.name}`}</p>
                        <div style={{ fontSize: "12px", fontStyle: "italic" }}>
                          {HTML2React(item.description)}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
