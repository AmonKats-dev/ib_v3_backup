import React from "react";
import HTML2React from "html2react";
import { useTranslate } from "react-admin";
import { romanize } from "../../../../../../helpers/formatters";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
} from "@material-ui/core";
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
const StakeHolders = (props) => {
  const { customRecord, subCounter } = props;
  const { project_options } = customRecord;
  const classes = useStyles();

  const translate = useTranslate();
  if (!project_options) {
    return null;
  }
  //stakeholder_evaluations
  return (
    <div className="Section2">
      <div className="content-area">
        <h2>
          {romanize(subCounter || 6)}.{" "}
          {translate("printForm.options.stakeholder_evaluations.title")}
        </h2>
        {project_options &&
          project_options
            .filter((item) => item.is_shortlisted || item.is_preferred)
            .map((option, idx) => {
              return option.stakeholder_evaluations &&
                option.stakeholder_evaluations.length === 0 ? (
                <div>
                  <p>
                    <strong>{`${translate(
                      "printForm.options.stakeholder_evaluations.analysis"
                    )} ${option.name}:`}</strong>
                  </p>
                  <p>
                    {translate(
                      "printForm.options.stakeholder_evaluations.empty"
                    )}
                  </p>
                </div>
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
                            "printForm.options.stakeholder_evaluations.number"
                          )}
                        </TableCell>
                        <TableCell>
                          {translate(
                            "printForm.options.stakeholder_evaluations.name"
                          )}
                        </TableCell>
                        <TableCell>
                          {translate(
                            "printForm.options.stakeholder_evaluations.impact_sign"
                          )}
                        </TableCell>
                        <TableCell>
                          {translate(
                            "printForm.options.stakeholder_evaluations.beneficiary"
                          )}
                        </TableCell>
                        <TableCell>
                          {translate(
                            "printForm.options.stakeholder_evaluations.description"
                          )}
                        </TableCell>
                      </TableRow>
                      {option.stakeholder_evaluations &&
                        option.stakeholder_evaluations.map((item, idx) => (
                          <TableRow>
                            <TableCell>{romanize(idx + 1)}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.impact_sign}</TableCell>
                            <TableCell>{item.beneficiary}</TableCell>
                            <TableCell>
                              {HTML2React(item.description)}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              );
            })}
      </div>
    </div>
  );
};

export default StakeHolders;
