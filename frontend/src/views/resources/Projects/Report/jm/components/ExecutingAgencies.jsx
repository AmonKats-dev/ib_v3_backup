import React from "react";
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
import { useSelector } from "react-redux";
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
export const ExecutingAgencies = (props) => {
  const translate = useTranslate();
  const classes = useStyles();
  const projects = useSelector((state) => state.admin.resources.projects);
  const currentProject = projects.data[props.customRecord.project_id];
  const userInfo = useSelector((state) => state.user.userInfo);

  const { customRecord, counter } = props;

  let executingAgencies = [currentProject?.project_organization];

  if (customRecord.executing_agencies) {
    executingAgencies = [
      ...executingAgencies,
      ...customRecord.executing_agencies,
      userInfo?.organization
    ];
  }

  return (
    <div className="Section2">
      <div className="content-area">
        <h2>
          {romanize(counter)}.{" "}
          {translate("printForm.background.executing_agencies")}
        </h2>
        <TableContainer>
          <Table
            size="small"
            className={clsx("bordered", classes.bordered, classes.table)}
          >
            <TableBody>
              {executingAgencies &&
                lodash
                  .uniqBy(executingAgencies, "organization_id")
                  .map((item) =>
                    item && item.organization ? (
                      <TableRow>
                        <TableCell>{`${item.organization.code} - ${item.organization.name}`}</TableCell>
                      </TableRow>
                    ) : null
                  )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
