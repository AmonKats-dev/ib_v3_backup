import React from "react";
import HTML2React from "html2react";
import { useTranslate } from "react-admin";
import { romanize } from "../../../../../helpers/formatters";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { checkFeature } from "../../../../../helpers/checkPermission";

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

export const GovernmentAgencies = (props) => {
  const classes = useStyles();
  const translate = useTranslate();
  const { customRecord, counter = 1 } = props;
  const hasMDAagencies = checkFeature("project_MDA_government_agencies");

  if (
    !customRecord.government_coordinations ||
    (customRecord.government_coordinations &&
      customRecord.government_coordinations.length === 0)
  ) {
    return (
      <div>
        <h2>
          {romanize(counter)}.{" "}
          {translate("printForm.background.government_agencies")}
        </h2>
        <p>{translate("printForm.background.government_agencies_empty")}</p>
      </div>
    );
  }
  return (
    <div className="Section2">
      <div className="content-area">
        {customRecord.government_coordinations &&
          customRecord.government_coordinations.length !== 0 && (
            <div>
              <h2>
                {romanize(counter)}.{" "}
                {translate("printForm.background.government_agencies")}
              </h2>
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Description</TableCell>
                    </TableRow>
                    {customRecord.government_coordinations &&
                      customRecord.government_coordinations.map((item) => (
                        <TableRow>
                          <TableCell style={{ width: "40%" }}>
                            {hasMDAagencies
                              ? item.organization && item.organization.name
                              : item.name}
                            {!item.organization &&
                              item.additional_data &&
                              item.additional_data.name}
                          </TableCell>
                          <TableCell>{HTML2React(item.description)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>{" "}
            </div>
          )}
      </div>
    </div>
  );
};
