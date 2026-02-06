import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import HTML2React from "html2react";
import React from "react";
import clsx from "clsx";
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

const EconomicalEvaluation = (props) => {
  const { customRecord, subCounter } = props;
  const translate = useTranslate();
  const { project_options } = customRecord;
  const classes = useStyles();

  return (
    <div className="Section2">
      <div className="content-area">
        <h2>
          {romanize(subCounter || 5)}.{" "}
          {translate("printForm.options.economical_evaluation.title")}
        </h2>
        <div>
          <p>{translate("printForm.options.economical_evaluation.summary")}</p>
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
                    {translate("printForm.options.economical_evaluation.enpv")}
                  </TableCell>
                  {project_options &&
                    project_options
                      .filter(
                        (item) => item.is_shortlisted || item.is_preferred
                      )
                      .map((option, idx) => (
                        <TableCell>
                          {option.economic_evaluation &&
                            costSumFormatter(option.economic_evaluation.enpv)}
                        </TableCell>
                      ))}
                </TableRow>
                <TableRow>
                  <TableCell>
                    {translate("printForm.options.economical_evaluation.err")}
                  </TableCell>
                  {project_options &&
                    project_options
                      .filter(
                        (item) => item.is_shortlisted || item.is_preferred
                      )
                      .map((option, idx) => (
                        <TableCell>
                          {(option.economic_evaluation &&
                            option.economic_evaluation.err + "%") ||
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
                        if (!option.economic_evaluation) {
                          return <TableCell>{"-"}</TableCell>;
                        }
                        return option.economic_evaluation &&
                          option.economic_evaluation.appraisal_methodology ===
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
                            {option.economic_evaluation &&
                              option.economic_evaluation.criteria &&
                              option.economic_evaluation.criteria.length !==
                                0 &&
                              option.economic_evaluation.criteria.map(
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
                  {option.economic_evaluation
                    ? HTML2React(option.economic_evaluation.summary)
                    : translate("printForm.options.detailed_analysis_empty")}
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default EconomicalEvaluation;
