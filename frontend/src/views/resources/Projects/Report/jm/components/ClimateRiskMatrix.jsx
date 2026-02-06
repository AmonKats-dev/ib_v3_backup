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

export const ClimateRiskMatrix = (props) => {
  const { customRecord } = props;
  const translate = useTranslate();

  const counter = props.counter || 1;

  if (!customRecord) return null;

  return (
    <div className="Section2">
      <div className="content-area">
        <h2>{romanize(counter)}. Climate Risk Matrix</h2>
        <TableContainer>
          <Table size="small">
            <TableBody>
              <TableRow className="filled-row">
                <TableCell>Climate Hazard</TableCell>
                <TableCell>Exposure Risk</TableCell>
                <TableCell>Vulnerability Risk</TableCell>
                <TableCell>Vulnerability Impact</TableCell>
                <TableCell>Overall Risk</TableCell>
              </TableRow>
              {customRecord.climate_risks &&
                customRecord.climate_risks.length !== 0 &&
                customRecord.climate_risks.map((item) => (
                  <TableRow>
                    <TableCell>{item.climate_hazard}</TableCell>
                    <TableCell>{item.exposure_risk}</TableCell>
                    <TableCell>{item.vulnerability_risk}</TableCell>
                    <TableCell>
                      {HTML2React(item.vulnerability_impact)}
                    </TableCell>
                    <TableCell>{item.overall_risk}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
