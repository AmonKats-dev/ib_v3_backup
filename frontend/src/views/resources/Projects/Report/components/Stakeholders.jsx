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
import { checkFeature } from "../../../../../helpers/checkPermission";

export const Stakeholders = (props) => {
  const { customRecord } = props;
  const translate = useTranslate();
  const hasPimisFields = checkFeature("has_pimis_fields");
  const hasPimisStakeholdersTable = checkFeature(
    "has_pimis_stakeholders_table",
    customRecord.phase_id
  );
  const counter = props.counter || 1;

  if (!customRecord) return null;

  if (hasPimisFields && !hasPimisStakeholdersTable) {
    return (
      <div className="Section2">
        <div className="content-area">
          <h2>{romanize(counter)}. Stakeholders Consultation</h2>
          <div>
            <p>
              <strong>
                {translate("printForm.background.stakeholder_consultation")}
              </strong>
            </p>
            {HTML2React(customRecord.stakeholder_consultation)}
          </div>
        </div>
      </div>
    );
  }

  if (hasPimisFields) {
    return (
      <div className="Section2">
        <div className="content-area">
          <h2>{romanize(counter)}. Stakeholders Responsibility</h2>
          <TableContainer>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>Identity</TableCell>
                  <TableCell>Interest Level</TableCell>
                  <TableCell>Influence Level</TableCell>
                  <TableCell>Communicational Channel</TableCell>
                  <TableCell>Engagement Frequency</TableCell>
                  <TableCell>Responsible Entity</TableCell>
                </TableRow>
                {customRecord.stakeholders &&
                  customRecord.stakeholders.length !== 0 &&
                  customRecord.stakeholders.map((item) => (
                    <TableRow>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.interest_level}</TableCell>
                      <TableCell>{item.influence_level}</TableCell>
                      <TableCell>
                        {HTML2React(item.communication_channel)}
                      </TableCell>
                      <TableCell>{item.engagement_frequency}</TableCell>
                      <TableCell>
                        {HTML2React(item.responsible_entity)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    );
  }

  return (
    <div className="Section2">
      <div className="content-area">
        <h2>{romanize(counter)}. Stakeholders Responsibility</h2>
        <TableContainer>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Responsibilities</TableCell>
              </TableRow>
              {customRecord.stakeholders &&
                customRecord.stakeholders.length !== 0 &&
                customRecord.stakeholders.map((item) => (
                  <TableRow>
                    <TableCell style={{ width: "40%" }}>
                      {HTML2React(item.name)}
                    </TableCell>
                    <TableCell>{HTML2React(item.responsibilities)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>{" "}
      </div>
    </div>
  );
};
