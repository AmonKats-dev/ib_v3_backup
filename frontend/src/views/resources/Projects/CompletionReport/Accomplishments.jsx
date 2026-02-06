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
  const { customRecord, counter = 1 } = props;
  const translate = useTranslate();

  return (
    <div className="Section2">
      <div className="content-area">
        <h2 className="content-area_title">
          {romanize(counter)}.1 Physical Performance{" "}
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
              <TableRow>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <h2 className="content-area_title">
          {romanize(counter)}.2 Outcome performance{" "}
        </h2>
        <TableContainer>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell>Short Term Outcomes</TableCell>
                <TableCell>What short term outcomes have been achieved by the project</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Impact</TableCell>
                <TableCell>What long-term impact is expected from the project. </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
