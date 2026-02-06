import { ReferenceField, useDataProvider, useTranslate } from "react-admin";
import HTML2React from "html2react";
import React, { useEffect, useState } from "react";
import { romanize } from "../../../../../../helpers/formatters";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import lodash from "lodash";

export const RiskAssessment = (props) => {
  const { customRecord } = props;
  const translate = useTranslate();

  const counter = props.counter || 1;

  if (!customRecord) return null;

  return (
    <div className="Section2">
      <div className="content-area">
        <h2>{romanize(counter)}. Project Risks Assessment</h2>
        <TableContainer>
          <Table size="small">
            <TableBody>
              <TableRow className="filled-row">
                <TableCell>
                  {translate(
                    "resources.project-details.fields.project_risks.name"
                  )}
                </TableCell>
                <TableCell>
                  {translate(
                    "resources.project-details.fields.project_risks.impact_level"
                  )}
                </TableCell>
                <TableCell>
                  {translate(
                    "resources.project-details.fields.project_risks.probability"
                  )}
                </TableCell>
                <TableCell>
                  {translate(
                    "resources.project-details.fields.project_risks.score"
                  )}
                </TableCell>
                <TableCell>
                  {translate(
                    "resources.project-details.fields.project_risks.response"
                  )}
                </TableCell>
                <TableCell>
                  {translate(
                    "resources.project-details.fields.project_risks.owner"
                  )}
                </TableCell>
              </TableRow>
              {customRecord.project_risks &&
                customRecord.project_risks.length !== 0 &&
                customRecord.project_risks.map((item) => (
                  <TableRow>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.impact_level}</TableCell>
                    <TableCell>{item.probability}</TableCell>
                    <TableCell>{item.score}</TableCell>
                    <TableCell>{HTML2React(item.response)}</TableCell>
                    <TableCell>{item.owner}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
