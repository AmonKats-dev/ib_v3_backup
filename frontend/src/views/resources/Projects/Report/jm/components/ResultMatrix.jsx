import React from "react";
import HTML2React from "html2react";
import { useTranslate } from "react-admin";
import {
  getFiscalYearsRangeForIntervals,
  romanize,
  getFiscalYearValue,
} from "../../../../../../helpers/formatters";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  TableBody,
} from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import moment from "moment";
import { getTargetYearsFromSignedDate } from "../../helpers";

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

const getComponentForOutput = (record, item) => {
  const filtered =
    record.components &&
    record.components.filter(
      (component) => component && item.component_id === component.id
    );

  return filtered && filtered.length !== 0
    ? filtered
        .map((component) =>
          component.code
            ? `${component.code && component.code.slice(0, 2)} - ${
                component.name
              }`
            : `${component.name}`
        )
        .join(", ")
    : "-";
};

export const ResultMatrix = ({ customRecord, ...props }) => {
  const classes = useStyles();
  const translate = useTranslate();
  const counter = props.counter || 3;
  const record = customRecord;

  console.log(record.indicators, "record.indicators");
  return (
    <div className="landscapeSection">
      <div className="content-area">
        <h2>
          {romanize(counter)}.{" "}
          {translate("printForm.project_framework.title_logical")}
        </h2>
        <TableContainer>
          <Table
            size="small"
            className={clsx("bordered", classes.bordered, classes.table)}
            style={{ width: "100%" }}
          >
            <TableBody>
              <TableRow className={classes.filledRow}>
                <TableCell rowspan="2" style={{ width: 350 }}>
                  {translate("printForm.project_framework.goal")}
                </TableCell>
                <TableCell rowspan="2" style={{ width: 200 }}>
                  {translate("printForm.result_matrix.indicator_title")}
                </TableCell>
                <TableCell colspan={2} style={{ width: 200 }}>
                  {translate("printForm.result_matrix.indicator")}
                </TableCell>
                <TableCell rowspan="2" style={{ width: 200 }}>
                  {translate("printForm.result_matrix.means")}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ width: 120 }}>{`${translate(
                  "printForm.result_matrix.baseline"
                )} ${
                  record.baseline
                    ? getFiscalYearValue(moment(record.baseline, "YYYY-MM-DD"))
                        .name
                    : ""
                } (SMART)`}</TableCell>
                <TableCell style={{ width: 200 }}>
                  {<strong>End of Project Target</strong>}
                </TableCell>
              </TableRow>
              {record && record.indicators && record.indicators.length !== 0 ? (
                record.indicators.map((indicator, idx) => {
                  console.log(indicator.targets, "------------");
                  console.log(indicator.targets[`project`], "------------");
                  return (
                    <TableRow>
                      {idx === 0 ? (
                        <TableCell
                          style={{ width: 350 }}
                          rowspan={record.indicators.length}
                        >{`${translate(
                          "printForm.result_matrix.project_goal"
                        )}: ${record.goal}`}</TableCell>
                      ) : null}
                      <TableCell style={{ width: 350 }}>{`Indicator ${
                        idx + 1
                      }: ${indicator.name}`}</TableCell>
                      <TableCell style={{ width: 250 }}>
                        {indicator.baseline}
                      </TableCell>
                      <TableCell style={{ width: 200 }}>
                        {indicator.targets && indicator.targets[`project`]}
                      </TableCell>
                      <TableCell style={{ width: 200 }}>
                        {indicator.verification_means}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    style={{ width: 350 }}
                    colSpan={1 + 2 + 5}
                  >{`${translate("printForm.result_matrix.project_goal")}: ${
                    record.goal
                  }`}</TableCell>
                </TableRow>
              )}

              <TableRow className={classes.filledRow}>
                <TableCell colSpan={1 + 2 + 4}>
                  <b>
                    {translate("printForm.project_framework.outcome", {
                      smart_count: 2,
                    })}
                  </b>
                </TableCell>
              </TableRow>

              {record &&
                record.outcomes &&
                record.outcomes.map((item, idxOutcome) =>
                  item.indicators && item.indicators.length !== 0 ? (
                    item.indicators.map((indicator, idx) => (
                      <TableRow>
                        {idx === 0 ? (
                          <TableCell
                            rowspan={item.indicators.length}
                            style={{ width: 200 }}
                          >
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
                        <TableCell style={{ width: 150 }}>{`Indicator ${
                          idx + 1
                        }: ${indicator.name}`}</TableCell>
                        <TableCell style={{ width: 200 }}>
                          {indicator.baseline}
                        </TableCell>
                        <TableCell style={{ width: 150 }}>
                          {indicator.targets && indicator.targets[`project`]}
                        </TableCell>
                        <TableCell style={{ width: 200 }}>
                          {indicator.verification_means}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={1 + 2 + 5}>
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
                <TableCell colSpan={1 + 2 + 4}>
                  <b>
                    {translate("printForm.project_framework.output", {
                      smart_count: 2,
                    })}
                  </b>
                </TableCell>
              </TableRow>

              {record &&
                record.outputs &&
                record.outputs.map((item, outputIdx) =>
                  item.indicators && item.indicators.length !== 0 ? (
                    item.indicators.map((indicator, idx) => (
                      <TableRow>
                        {idx === 0 ? (
                          <TableCell
                            rowspan={item.indicators.length}
                            style={{ width: 350 }}
                          >
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
                        <TableCell style={{ width: 200 }}>{`Indicator ${
                          idx + 1
                        }: ${indicator.name}`}</TableCell>
                        <TableCell>{indicator.baseline}</TableCell>
                        <TableCell style={{ width: 200 }}>
                          {indicator.targets && indicator.targets[`project`]}
                        </TableCell>
                        <TableCell style={{ width: 200 }}>
                          {indicator.verification_means}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={1 + 2 + 5} style={{ width: 350 }}>
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
        <div className="row">
          <div className="col-sm-6">
            <TableContainer>
              <Table
                size="small"
                className={clsx("bordered", classes.bordered, classes.table)}
              >
                <TableBody>
                  <TableRow className={classes.filledRow}>
                    <TableCell>
                      {translate("printForm.result_matrix.component_id")}
                    </TableCell>
                  </TableRow>
                  {record &&
                    record.outputs &&
                    record.outputs.map((output, outputIdx) => [
                      <TableRow className={classes.filledRow}>
                        <TableCell>
                          <p style={{ marginBottom: "5px" }}>
                            <strong>{output.name}</strong>
                          </p>
                          <p
                            style={{
                              fontSize: "12px",
                              fontStyle: "italic",
                              marginBottom: "5px",
                            }}
                          >
                            <b>
                              {translate("printForm.result_matrix.outcomes")}
                            </b>
                            : <br />
                            {getOutcomesForOutput(record, output)}
                          </p>

                          <p
                            style={{
                              fontSize: "12px",
                              fontStyle: "italic",
                              marginBottom: "5px",
                            }}
                          >
                            <b>
                              {translate("printForm.result_matrix.components")}
                            </b>
                            : <br />
                            {getComponentForOutput(record, output)}
                          </p>
                        </TableCell>
                      </TableRow>,
                    ])}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
