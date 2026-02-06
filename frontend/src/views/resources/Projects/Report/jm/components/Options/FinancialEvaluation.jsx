import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import HTML2React from "html2react";
import React from "react";
import { costSumFormatter } from "../../../helpers";
import { romanize } from "../../../../../../../helpers/formatters";
import { useTranslate } from "react-admin";

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

const FinancialEvaluation = (props) => {
  const { customRecord, subCounter } = props;
  const translate = useTranslate();
  const { project_options } = customRecord;
  const classes = useStyles();

  if (!customRecord) {
    return null;
  }

  return (
    <div className="Section2">
      <div className="content-area">
        <h2>
          {romanize(subCounter || 4)}.{" "}
          {translate("printForm.options.financial_evaluation.title")}
        </h2>
        <div>
          <p>{translate("printForm.options.financial_evaluation.summary")}</p>
          <TableContainer>
            <Table
              size="small"
              className={clsx("bordered", classes.bordered, classes.table)}
            >
              <TableBody>
                <TableRow className="filled-row">
                  <TableCell></TableCell>
                  {project_options &&
                    project_options
                      .filter(
                        (item) => item.is_shortlisted || item.is_preferred
                      )
                      .map((option, idx) => (
                        <TableCell>{option.name}</TableCell>
                      ))}
                </TableRow>
                <TableRow>
                  <TableCell>
                    {translate("printForm.options.financial_evaluation.fnpv")}
                  </TableCell>
                  {project_options &&
                    project_options
                      .filter(
                        (item) => item.is_shortlisted || item.is_preferred
                      )
                      .map((option, idx) => (
                        <TableCell>
                          {option.financial_evaluation &&
                            costSumFormatter(option.financial_evaluation.fnpv)}
                        </TableCell>
                      ))}
                </TableRow>
                <TableRow>
                  <TableCell>
                    {translate("printForm.options.financial_evaluation.irr")}
                  </TableCell>
                  {project_options &&
                    project_options
                      .filter(
                        (item) => item.is_shortlisted || item.is_preferred
                      )
                      .map((option, idx) => (
                        <TableCell>
                          {(option.financial_evaluation &&
                            option.financial_evaluation.irr + "%") ||
                            "-"}
                        </TableCell>
                      ))}
                </TableRow>
                <TableRow>
                  <TableCell>
                    {translate("printForm.options.cba_cea")}
                  </TableCell>
                  {project_options &&
                    project_options
                      .filter(
                        (item) => item.is_shortlisted || item.is_preferred
                      )
                      .map((option, idx) => {
                        if (!option.financial_evaluation) {
                          return <TableCell>{"-"}</TableCell>;
                        }
                        return option.financial_evaluation &&
                          option.financial_evaluation.appraisal_methodology ===
                            "CBA" ? (
                          <TableCell>
                            {translate(
                              "printForm.options.economical_evaluation.cba"
                            )}
                          </TableCell>
                        ) : (
                          <TableCell>
                            <p>
                              {translate(
                                "printForm.options.economical_evaluation.cea"
                              )}
                            </p>
                            {option.financial_evaluation &&
                              option.financial_evaluation.criterias &&
                              option.financial_evaluation.criterias.length !==
                                0 &&
                              option.financial_evaluation.criterias.map(
                                (item) => (
                                  <div className="inner-table">
                                    <div className="row">
                                      <div className="cell_title">
                                        {translate(
                                          "printForm.options.criterias.criteria_title"
                                        )}
                                        :
                                      </div>
                                      <div className="cell">{item.title}</div>
                                    </div>
                                    <div className="row">
                                      <div className="cell_title">
                                        {translate(
                                          "printForm.options.criterias.criteria_value"
                                        )}
                                        :
                                      </div>
                                      <div className="cell">
                                        {item.criteria_value}
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div className="cell_title">
                                        {translate(
                                          "printForm.options.criterias.measure_unit"
                                        )}
                                        :
                                      </div>
                                      <div className="cell">
                                        {item.measure_unit}
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}
                          </TableCell>
                        );
                      })}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div>
          {project_options &&
            project_options
              .filter((item) => item.is_shortlisted || item.is_preferred)
              .map((option, idx) => (
                <div>
                  <p>
                    <strong>{`${translate(
                      "printForm.options.detailed_analysis"
                    )} ${option.name}`}</strong>
                  </p>
                  {option.financial_evaluation
                    ? HTML2React(option.financial_evaluation.summary)
                    : translate("printForm.options.detailed_analysis_empty")}
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default FinancialEvaluation;
