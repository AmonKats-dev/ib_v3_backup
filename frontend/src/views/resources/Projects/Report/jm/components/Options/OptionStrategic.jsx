import React from "react";
import HTML2React from "html2react";
import { useTranslate } from "react-admin";
import { romanize } from "../../../../../../../helpers/formatters";
import { costSumFormatter } from "../../../helpers";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
} from "@material-ui/core";
import clsx from "clsx";
import { withStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 700,
  },
  bordered: {
    border: `1px solid ${theme.palette.border}`,
    "& td": {
      padding: "0.75rem",
      verticalAlign: "top",
      border: "1px solid #c8ced3",
    },
    "& th": {
      padding: "0.75rem",
      verticalAlign: "top",
      border: "1px solid #c8ced3",
    },
  },
  filledRow: {
    backgroundColor: theme.palette.action.hover,
    fontWeight: "bold",
  },
}));

const OptionStrategic = (props) => {
  const { customRecord, subCounter } = props;
  const translate = useTranslate();
  const classes = useStyles();

  return (
    <div className="Section2">
      <div className="content-area">
        <h2>
          {romanize(subCounter)}. {translate("printForm.options.title")}
        </h2>
        <div>
          {(customRecord && !customRecord.project_options) ||
          (customRecord.project_options &&
            customRecord.project_options.length === 0) ? null : (
            <div>
              <TableContainer>
                <Table
                  size="small"
                  className={clsx("bordered", classes.bordered, classes.table)}
                >
                  <TableBody>
                    <TableRow>
                      <TableCell rowSpan="2">
                        {translate("printForm.options.name")}
                      </TableCell>
                      <TableCell rowSpan="2">
                        {translate("printForm.options.cost")}
                      </TableCell>
                      <TableCell rowSpan="2">
                        {translate("printForm.options.funding_modality")}
                      </TableCell>
                      <TableCell rowSpan="2">
                        {translate("printForm.options.score")}
                      </TableCell>
                      <TableCell colSpan="5">
                        {translate("printForm.options.modular_scores")}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        {translate("printForm.options.demand_module")}
                      </TableCell>
                      <TableCell>
                        {translate("printForm.options.tech_module")}
                      </TableCell>
                      <TableCell>
                        {translate("printForm.options.environmental_module")}
                      </TableCell>
                      <TableCell>
                        {translate("printForm.options.hr_module")}
                      </TableCell>
                      <TableCell>
                        {translate("printForm.options.legal_module")}
                      </TableCell>
                    </TableRow>
                    {customRecord &&
                      customRecord.project_options &&
                      customRecord.project_options.map((item) => (
                        <TableRow>
                          <TableCell>
                            <p>{item.name}</p>
                            <span style={{ fontStyle: "italic" }}>
                              {HTML2React(item.description)}
                            </span>
                          </TableCell>
                          <TableCell>{costSumFormatter(item.cost)}</TableCell>
                          <TableCell>
                            {translate(
                              `resources.project_options.fields.funding_modality.${item.funding_modality}`
                            )}
                          </TableCell>
                          <TableCell>{item.score}</TableCell>
                          <TableCell>
                            {item.demand_module && item.demand_module.score}
                          </TableCell>
                          <TableCell>
                            {item.technical_module &&
                              item.technical_module.score}
                          </TableCell>
                          <TableCell>
                            {item.environmental_module &&
                              item.environmental_module.score}
                          </TableCell>
                          <TableCell>
                            {item.hr_module && item.hr_module.score}
                          </TableCell>
                          <TableCell>
                            {item.legal_module && item.legal_module.score}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OptionStrategic;
