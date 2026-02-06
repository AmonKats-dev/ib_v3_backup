import React from "react";
import HTML2React from "html2react";
import { useTranslate } from "react-admin";
import { romanize } from "../../../../helpers/formatters";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Table from "@material-ui/core/Table";

export const Accomplishments = (props) => {
  const { customRecord, details, counter = 1 } = props;
  const translate = useTranslate();

  if (!customRecord) return null;

  return (
    <div className="Section2">
      <div className="content-area">
        <h2 className="content-area_title">
          {romanize(counter)}. Physical Performance{" "}
        </h2>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Output</TableCell>
                <TableCell>Original Description </TableCell>
                <TableCell>Actual Specifications / Description</TableCell>
                <TableCell>Initial Completion Date</TableCell>
                <TableCell>Actual Completion Date</TableCell>
                <TableCell>Specific Output Related Challenges </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {details.outputs &&
                details.outputs.map((output, idx) => {
                  return (
                    <TableRow>
                      <TableCell>{output.name}</TableCell>
                      <TableCell>{HTML2React(output.description)}</TableCell>
                      <TableCell>
                        {customRecord.outputs &&
                          customRecord.outputs[idx] &&
                          customRecord.outputs[idx].specifications}
                      </TableCell>
                      <TableCell>
                        {customRecord.outputs &&
                          customRecord.outputs[idx] &&
                          customRecord.outputs[idx].intended_completion_date}
                      </TableCell>
                      <TableCell>
                        {customRecord.outputs &&
                          customRecord.outputs[idx] &&
                          customRecord.outputs[idx].actual_completion_date}
                      </TableCell>
                      <TableCell>
                        {customRecord.outputs &&
                          customRecord.outputs[idx] &&
                          customRecord.outputs[idx].related_challenges}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <h2 className="content-area_title">
          {romanize(counter)}.1 Outcome performance{" "}
        </h2>
        <TableContainer>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell>Short Term Outcomes</TableCell>
                <TableCell>
                  {HTML2React(
                    customRecord.outcome_performance.short_term_outcomes
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Impact</TableCell>
                <TableCell>
                  {HTML2React(customRecord.outcome_performance.impact)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
