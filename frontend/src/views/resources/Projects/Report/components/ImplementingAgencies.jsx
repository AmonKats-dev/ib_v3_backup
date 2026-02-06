import React from "react";
import { useTranslate } from "react-admin";
import { romanize } from "../../../../../helpers/formatters";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
} from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import HTML2React from "html2react";
import clsx from "clsx";
import lodash from "lodash";

const useStyles = makeStyles((theme) => ({
  Table: {
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
export const ImplementingAgencies = (props) => {
  const translate = useTranslate();
  const classes = useStyles();

  const { customRecord, counter } = props;
  // const getOutputName = (code) => {
  //   if (customRecord.outputs) {
  //     const filtered = customRecord.outputs.filter((item) =>
  //       item.organization_ids.includes(Number(code))
  //     );
  //     if (filtered && filtered.length > 0) {
  //       return filtered.map((output) =>  <TableRow><TableCell>{output.name}</TableCell></TableRow>);
  //     }
  //   }
  //   return <TableCell>-</TableCell>;
  // };
  const getOutputName = (code, item) => {
    if (customRecord.outputs) {
      const filtered = customRecord.outputs.filter((item) =>
        item.organization_ids.includes(Number(code))
      );
      if (filtered && filtered.length > 0) {
        return (
          <>
            {filtered.map((output) => (
              <TableRow>
                <TableCell>{output.name}</TableCell>
                <TableCell>{`${item.organization.code} - ${item.organization.name}`}</TableCell>{" "}
              </TableRow>
            ))}
          </>
        );
      }
    }
    return (
      <>
        <TableCell>-</TableCell>
        <TableCell>{`${item.organization.code} - ${item.organization.name}`}</TableCell>
      </>
    );
  };

  if (!lodash.isEmpty(customRecord.implementing_agencies)) {
    return (
      <div className="Section2">
        <div className="content-area">
          <h2>
            {counter && `${romanize(counter)}.`}
            {translate("printForm.background.implementing_agencies")}
          </h2>
          <TableContainer>
            <Table
              size="small"
              className={clsx("bordered", classes.bordered, classes.table)}
            >
              <TableBody>
                {customRecord.implementing_agencies &&
                  customRecord.implementing_agencies.map((item) =>
                    item.organization
                      ? getOutputName(item.organization_id, item)
                      : null
                  )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    );
  }

  return null;
};
