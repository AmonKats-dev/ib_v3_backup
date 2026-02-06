import { useTranslate } from "react-admin";
import HTML2React from "html2react";
import React from "react";
import { romanize } from "../../../../../helpers/formatters";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";

export const EvaluationProjectImpacts = (props) => {
  const { record } = props;
  const translate = useTranslate();

  const counter = props.counter || 1;

  if (!record) return null;

  return (
    <div className="Section2">
      <div className="content-area">
        <h2>{romanize(counter)}. Ex-Post Evaluation</h2>
        <TableContainer>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Increase in the agricultural output produced in the area and
                  resulting increase in the trade activities.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Baseline</TableCell>
                <TableCell>Target</TableCell>
                <TableCell>Realized</TableCell>
              </TableRow>
              {props.record &&
                props.record.outcomes.map((outcome) => {
                  return (
                    outcome.indicators &&
                    outcome.indicators.map((item) => (
                      <TableRow>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.baseline}</TableCell>
                        <TableCell>{item.target}</TableCell>
                        <TableCell>{item.realized}</TableCell>
                      </TableRow>
                    ))
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
