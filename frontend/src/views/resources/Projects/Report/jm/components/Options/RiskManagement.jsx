import React from "react";
import { useTranslate } from "react-admin";
import { romanize } from "../../../../../../../helpers/formatters";
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

const RiskManagement = (props) => {
  const translate = useTranslate();
  const classes = useStyles();

  const { customRecord, subCounter } = props;
  const { project_options } = customRecord;

  if (!project_options) {
    return null;
  }

  return (
    <div className="Section2">
      <div className="content-area">
        <h2>
          {romanize(subCounter || 7)}.{" "}
          {translate("printForm.options.risk_evaluations.title")}
        </h2>
        {project_options &&
          project_options
            .filter((item) => item.is_shortlisted || item.is_preferred)
            .map((option, idx) => {
              return (
                <div>
                  <p>
                    <strong>{`${translate(
                      "printForm.options.risk_evaluations.analysis"
                    )} ${option.name}:`}</strong>
                  </p>
                  {!option.risk_evaluations ||
                  (option.risk_evaluations &&
                    option.risk_evaluations.length === 0) ? (
                    <p>
                      {translate("printForm.options.risk_evaluations.empty")}
                    </p>
                  ) : (
                    <TableContainer>
                      <Table
                        size="small"
                        className={clsx(
                          "bordered",
                          classes.bordered,
                          classes.table
                        )}
                      >
                        <TableBody>
                          <TableRow className="filled-row">
                            <TableCell>
                              {translate(
                                "printForm.options.risk_evaluations.description"
                              )}
                            </TableCell>
                            <TableCell>
                              {translate(
                                "printForm.options.risk_evaluations.occurrence"
                              )}
                            </TableCell>
                            <TableCell>
                              {translate(
                                "printForm.options.risk_evaluations.impact"
                              )}
                            </TableCell>
                            <TableCell>
                              {translate(
                                "printForm.options.risk_evaluations.mitigation_plan"
                              )}
                            </TableCell>
                          </TableRow>
                          {option.risk_evaluations &&
                            option.risk_evaluations.map((riskItem) => (
                              <TableRow>
                                <TableCell>{riskItem.description}</TableCell>
                                <TableCell>{riskItem.occurrence}</TableCell>
                                <TableCell>{riskItem.impact}</TableCell>
                                <TableCell>
                                  {riskItem.mitigation_plan}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default RiskManagement;
