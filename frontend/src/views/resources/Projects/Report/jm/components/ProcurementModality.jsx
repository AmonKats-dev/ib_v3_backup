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
  Typography,
} from "@material-ui/core";
import { Fragment } from "react";

export const ProcurementModality = (props) => {
  const { customRecord } = props;
  const translate = useTranslate();

  if (!customRecord) return null;

  const renderSource = [
    "Public-Private Partnerships",
    "Joint-Venture",
    "Joint-Venture (Unsolicited Proposal)",
    "Public-Private Partnerships (Unsolicited Proposal)",
    "Joint-Venture (Solicited Proposal)",
    "Public-Private Partnerships (Solicited Proposal)",
  ];
  const renderSourceFund = [
    "Public-Private Partnership",
    "Joint Venture",
    "Unsolicited Proposal",
  ];
  const hasProcurementModality =
    customRecord &&
    customRecord.procurement_modality &&
    customRecord.procurement_modality.filter((item) =>
      renderSource.includes(item)
    ).length > 0;

  const hasFundingSource =
    customRecord &&
    customRecord.proposed_funding_source &&
    customRecord.proposed_funding_source !==
      "Source of funding has not been identified" &&
    customRecord.proposed_funding_source.filter((item) =>
      renderSourceFund.includes(item)
    ).length > 0;

  const counter = props.counter || 1;

  if (customRecord && !hasFundingSource && !hasProcurementModality) {
    return (
      <div className="content-area">
        <h2>{romanize(counter)}. Procurement Modality</h2>
        <Typography variant="h5">
          No data for this project Procurement Modality type
        </Typography>
      </div>
    );
  }

  return (
    <div className="Section2">
      <div className="content-area">
        <h2>{romanize(counter)}. Procurement Modality</h2>
        <TableContainer>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell style={{ width: "30%", fontWeight: "bold" }}>
                  {translate(
                    "printForm.procurement_modality.ppp_similar_reference"
                  )}
                </TableCell>
                <TableCell>
                  {HTML2React(customRecord.ppp_similar_reference)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ width: "30%", fontWeight: "bold" }}>
                  {translate("printForm.procurement_modality.ppp_interest")}
                </TableCell>
                <TableCell>{HTML2React(customRecord.ppp_interest)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ width: "30%", fontWeight: "bold" }}>
                  {translate("printForm.procurement_modality.ppp_impediments")}
                </TableCell>
                <TableCell>
                  {HTML2React(customRecord.ppp_impediments)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ width: "30%", fontWeight: "bold" }}>
                  {translate(
                    "printForm.procurement_modality.ppp_risk_allocation"
                  )}
                </TableCell>
                <TableCell>
                  {HTML2React(customRecord.ppp_risk_allocation)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
