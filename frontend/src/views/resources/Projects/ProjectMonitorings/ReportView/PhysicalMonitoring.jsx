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
import { renderTitle } from "./helpers";

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

export const PhysicalMonitoring = ({ record, projectDetails, ...props }) => {
  const classes = useStyles();
  const translate = useTranslate();

  let fiscalYearsFromProps = getFiscalYearsRangeForIntervals(
    projectDetails.start_date,
    projectDetails.end_date
  );

  if (
    fiscalYearsFromProps &&
    projectDetails.start_date &&
    projectDetails.end_date &&
    record.year
  ) {
    fiscalYearsFromProps = fiscalYearsFromProps.filter(
      (year) => Number(year.id) <= Number(record.year)
    );
  }

  return (
    <div className="landscapeSection">
      <div className="content-area">
        <h2>
          {renderTitle(record, projectDetails, "Table 2: Physical Monitoring")}
        </h2>
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
                <TableCell colspan={fiscalYearsFromProps.length + 2}>
                  {translate("printForm.result_matrix.indicator")}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{`${translate("printForm.result_matrix.baseline")} ${
                  projectDetails.baseline &&
                  getFiscalYearValue(
                    moment(projectDetails.baseline, "YYYY-MM-DD")
                  ).name
                }`}</TableCell>
                {fiscalYearsFromProps.map((year) => (
                  <TableCell>
                    <strong>{`${translate("printForm.result_matrix.target")} ${
                      year.name
                    }`}</strong>
                  </TableCell>
                ))}
                <TableCell>
                  <strong>{`${translate(
                    "printForm.result_matrix.target_achieved"
                  )}  ${"  "} ${
                    record && record.start_date
                      ? getFiscalYearValue(
                          moment(record.start_date, "YYYY-MM-DD")
                        ).name
                      : getFiscalYearValue(moment(record.year, "YYYY")).name
                  }, ${record.quarter}`}</strong>
                </TableCell>
              </TableRow>
              {projectDetails &&
              projectDetails.indicators &&
              projectDetails.indicators.length !== 0 ? (
                projectDetails.indicators.map((indicator, idx) => (
                  <TableRow>
                    {idx === 0 ? (
                      <TableCell
                        rowSpan={projectDetails.indicators.length}
                      >{`${translate(
                        "printForm.result_matrix.project_goal"
                      )}: ${projectDetails.goal}`}</TableCell>
                    ) : null}
                    <TableCell>{`Indicator ${idx + 1}: ${
                      indicator.name
                    }`}</TableCell>
                    <TableCell>{indicator.baseline}</TableCell>
                    {fiscalYearsFromProps.map((year) => (
                      <TableCell>
                        {indicator.targets[Number(year.id)]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={fiscalYearsFromProps.length + 2 + 5}
                  >{`${translate("printForm.result_matrix.project_goal")}: ${
                    projectDetails.goal
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

              {projectDetails &&
                projectDetails.outcomes &&
                projectDetails.outcomes.map((item, idxOutcome) =>
                  item.indicators && item.indicators.length !== 0 ? (
                    item.indicators.map((indicator, idx) => (
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
                        {fiscalYearsFromProps.map((year) => (
                          <TableCell>
                            {indicator.targets[Number(year.id)]}
                          </TableCell>
                        ))}
                        <TableCell>{indicator.target}</TableCell>
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
                record.me_outputs &&
                record.me_outputs.map((item, outputIdx) =>
                  item.indicators && item.indicators.length !== 0 ? (
                    item.indicators.map((indicator, idx) => (
                      <TableRow>
                        {idx === 0 ? (
                          <TableCell rowSpan={item.indicators.length}>
                            <p>{`${translate(
                              "printForm.project_framework.output",
                              { smart_count: 1 }
                            )} ${outputIdx + 1}: ${
                              item.name || (item.output && item.output.name)
                            }`}</p>
                            {/* <div
                              style={{ fontSize: "12px", fontStyle: "italic" }}
                            >
                              {HTML2React(
                                item.description ||
                                  (item.output && item.output.description)
                              )}
                            </div> */}
                          </TableCell>
                        ) : null}
                        <TableCell>{`Indicator ${idx + 1}: ${
                          indicator.name
                        }`}</TableCell>
                        <TableCell>{indicator.baseline}</TableCell>
                        {fiscalYearsFromProps.map((year) => (
                          <TableCell>
                            {indicator.targets[Number(year.id)]}
                          </TableCell>
                        ))}
                        <TableCell>{indicator.target}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={fiscalYearsFromProps.length + 2 + 5}>
                        <p>{`${translate("printForm.project_framework.output", {
                          smart_count: 1,
                        })} ${outputIdx + 1}: ${item.name}`}</p>
                        {/* <div style={{ fontSize: "12px", fontStyle: "italic" }}>
                          {HTML2React(item.description)}
                        </div> */}
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
