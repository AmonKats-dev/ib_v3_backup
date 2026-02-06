import { useTranslate } from "react-admin";
import HTML2React from "html2react";
import React from "react";
import { romanize } from "../../../../../../helpers/formatters";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@material-ui/core";
import lodash from "lodash";

export const ProjectInformation = (props) => {
  const translate = useTranslate();
  const { customRecord, customBasePath, counter } = props;

  if (!customRecord) return null;

  let locations = [];
  customRecord.locations
    .map((item) => item && item.name)
    .forEach((item) => {
      locations = [...locations, ...item];
    });

  return (
    <div className="Section2">
      <div className="content-area">
        <h2>
          {romanize(counter)}. {translate("printForm.project_info.title")}
        </h2>
        <TableContainer>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell>
                  {translate("printForm.project_info.summary")}
                </TableCell>
                <TableCell>{HTML2React(customRecord.summary)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {translate("printForm.project_info.stakeholder_consultation")}{" "}
                </TableCell>
                <TableCell>
                  {HTML2React(customRecord.stakeholder_consultation)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {translate("printForm.project_info.problem_statement")}
                </TableCell>
                <TableCell>
                  {HTML2React(customRecord.problem_statement)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {translate("printForm.project_info.locations")}
                </TableCell>
                <TableCell>
                  {customRecord.locations && lodash.uniq(locations).join(", ")}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {translate("printForm.project_info.justification")}
                </TableCell>
                <TableCell>{HTML2React(customRecord.justification)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {translate("printForm.project_info.problem_cause")}
                </TableCell>
                <TableCell>{HTML2React(customRecord.problem_cause)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {translate("printForm.project_info.problem_effects")}
                </TableCell>
                <TableCell>
                  {HTML2React(customRecord.problem_effects)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {translate("printForm.project_info.risk_assessment")}
                </TableCell>
                <TableCell>
                  {HTML2React(customRecord.risk_assessment)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {translate("printForm.project_info.situation_analysis")}
                </TableCell>
                <TableCell>
                  {HTML2React(customRecord.situation_analysis)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
