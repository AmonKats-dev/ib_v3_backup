import React from "react";
import HTML2React from "html2react";
import { useTranslate } from "react-admin";
import {
  getFiscalYearValue,
  getFiscalYearValueFromYear,
  romanize,
} from "../../../../../../../helpers/formatters";
import { costSumFormatter } from "../../../helpers";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  TableContainer,
} from "@material-ui/core";
import { Fragment } from "react";
import lodash from "lodash";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

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

const OptionDescription = (props) => {
  const { customRecord, subCounter } = props;
  const translate = useTranslate();
  const classes = useStyles();

  return (
    <div className="Section2">
      <div className="content-area">
        <h2>
          {romanize(subCounter)}. {translate("printForm.project_options.title")}
        </h2>
        <div>
          {(customRecord && !customRecord.project_options) ||
          (customRecord.project_options &&
            customRecord.project_options.length === 0) ? null : (
            <div>
              {customRecord &&
                customRecord.project_options &&
                customRecord.project_options.map((item) => (
                  <>
                    <Divider
                      variant="fullWidth"
                      style={{ margin: "15px 0px" }}
                    />
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
                          <TableRow>
                            <TableCell variant="head">
                              {translate("printForm.project_options.name")}{" "}
                            </TableCell>
                            <TableCell variant="head">{item.name}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              {translate(
                                "printForm.project_options.description"
                              )}
                            </TableCell>
                            <TableCell>
                              {HTML2React(item.description)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              {translate(
                                "printForm.project_options.swot_analysis"
                              )}{" "}
                            </TableCell>
                            <TableCell>
                              {HTML2React(item.swot_analysis)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              {translate(
                                "printForm.project_options.funding_modality"
                              )}
                            </TableCell>
                            <TableCell>
                              {HTML2React(item.funding_modality)}
                            </TableCell>
                          </TableRow>
                          {item.funding_modality !== "PROCUREMENT" ? (
                            <>
                              <TableRow>
                                <TableCell>
                                  {translate(
                                    "printForm.project_options.value_for_money"
                                  )}
                                </TableCell>
                                <TableCell>
                                  {HTML2React(item.value_for_money)}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  {translate(
                                    "printForm.project_options.risk_allocation"
                                  )}
                                </TableCell>
                                <TableCell>
                                  {HTML2React(item.risk_allocation)}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  {translate(
                                    "printForm.project_options.contract_management"
                                  )}
                                </TableCell>
                                <TableCell>
                                  {HTML2React(item.contract_management)}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  {translate(
                                    "printForm.project_options.me_strategy"
                                  )}
                                </TableCell>
                                <TableCell>
                                  {HTML2React(item.me_strategy)}
                                </TableCell>
                              </TableRow>
                            </>
                          ) : null}

                          <TableRow>
                            <TableCell>
                              {translate(
                                "printForm.project_options.start_date"
                              )}
                            </TableCell>
                            <TableCell>
                              {getFiscalYearValue(item.start_date).name}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              {translate("printForm.project_options.end_date")}
                            </TableCell>
                            <TableCell>
                              {getFiscalYearValue(item.end_date).name}
                            </TableCell>
                          </TableRow>
                          {item.om_start_date && (
                            <>
                              <TableRow>
                                <TableCell>
                                  {translate(
                                    "printForm.project_options.om_start_date"
                                  )}
                                </TableCell>
                                <TableCell>
                                  {getFiscalYearValue(item.om_start_date).name}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  {translate(
                                    "printForm.project_options.om_end_date"
                                  )}
                                </TableCell>
                                <TableCell>
                                  {getFiscalYearValue(item.om_end_date).name}
                                </TableCell>
                              </TableRow>
                            </>
                          )}
                          <TableRow>
                            <TableCell>
                              {translate(
                                "printForm.project_options.is_shortlisted"
                              )}
                            </TableCell>
                            <TableCell>
                              {item.is_shortlisted ? "yes" : "no"}
                            </TableCell>
                          </TableRow>
                          {item.is_commercial && (
                            <TableRow>
                              <TableCell>
                                {translate(
                                  "printForm.project_options.is_commercial"
                                )}
                              </TableCell>
                              <TableCell>
                                {item.is_commercial ? "yes" : "no"}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <br />
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
                          <TableRow>
                            <TableCell
                              variant="head"
                              style={{ width: "10%" }}
                            ></TableCell>
                            {lodash
                              .keys(item.capital_expenditure)
                              .map((key) => (
                                <TableCell variant="head">
                                  {getFiscalYearValueFromYear(key).name}
                                </TableCell>
                              ))}
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ fontWeight: "bold" }}>
                              {translate(
                                "printForm.project_options.capital_expenditure"
                              )}
                            </TableCell>
                            {lodash
                              .keys(item.capital_expenditure)
                              .map((key) => (
                                <TableCell>
                                  {costSumFormatter(
                                    item.capital_expenditure[key]
                                  )}
                                </TableCell>
                              ))}
                          </TableRow>
                        </TableBody>
                        <TableBody></TableBody>
                      </Table>
                    </TableContainer>
                    <br />

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
                          <TableRow>
                            <TableCell
                              variant="head"
                              style={{ width: "10%" }}
                            ></TableCell>
                            {lodash.keys(item.om_cost).map((key) => (
                              <TableCell
                                variant="head"
                                style={{ width: "10%" }}
                              >
                                {getFiscalYearValueFromYear(key).name}
                              </TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ fontWeight: "bold" }}>
                              {translate("printForm.project_options.om_cost")}
                            </TableCell>
                            {lodash.keys(item.om_cost).map((key) => (
                              <TableCell>
                                {costSumFormatter(item.om_cost[key])}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableBody>
                        <TableBody></TableBody>
                      </Table>
                    </TableContainer>
                  </>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OptionDescription;
