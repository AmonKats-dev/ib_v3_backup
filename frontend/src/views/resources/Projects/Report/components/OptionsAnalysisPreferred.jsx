import React from "react";
import {
  FinancialEvaluation,
  EconomicalEvaluation,
  ProjectJustification,
  StakeHolders,
  RiskManagement,
  OptionStrategic,
  DetailedAnalysysForOptions,
} from "./Options";
import { parseQueryToValues } from "../../../../../helpers/dataHelpers";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
} from "@material-ui/core";
import { romanize } from "../../../../../helpers/formatters";
import { useTranslate } from "react-admin";
import HTML2React from "html2react";
import OptionDescription from "./Options/OptionDescription";

export const OptionsAnalysis = (props) => {
  let { customRecord, counter } = props;
  customRecord = parseQueryToValues(customRecord);
  const translate = useTranslate();

  return (
    <div className="content-area">
      <h2>{romanize(counter)}. Project Options</h2>
      <TableContainer>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell style={{ width: "30%", fontWeight: "bold" }}>
                {translate("printForm.project_options.default_option_name")}
              </TableCell>
              <TableCell>{customRecord.default_option_name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ width: "30%", fontWeight: "bold" }}>
                {translate(
                  "printForm.project_options.default_option_description"
                )}
              </TableCell>
              <TableCell>
                {HTML2React(customRecord.default_option_description)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <OptionDescription subCounter={Number(counter)} {...props} />
    </div>
  );
};
