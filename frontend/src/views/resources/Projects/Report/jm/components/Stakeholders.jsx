import { useTranslate } from "react-admin";
import HTML2React from "html2react";
import React from "react";
import { romanize } from "../../../../../../helpers/formatters";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";

export const Stakeholders = (props) => {
  const { customRecord } = props;
  const translate = useTranslate();
  const counter = props.counter || 1;

  if (!customRecord) return null;

  return (
    <div className="Section2">
      <div className="content-area">
        <h2>{romanize(counter)}. Stakeholders Responsibility</h2>
        <TableContainer>
          <Table size="small">
            <TableBody>
              <TableRow className="filled-row">
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
                    <TableCell>{HTML2React(item.responsible_entity)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
