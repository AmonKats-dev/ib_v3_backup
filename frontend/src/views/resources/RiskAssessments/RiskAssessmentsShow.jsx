import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import clsx from "clsx";
import React from "react";
import {
  Button,
  EditButton,
  Show,
  SimpleShowLayout,
  TopToolbar,
  useRedirect,
  useShowController,
} from "react-admin";
import { useHistory } from "react-router-dom";
import { useCheckPermissions } from "../../../helpers/checkPermission";
import { getFiscalYearValue } from "../../../helpers/formatters";

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

const Actions = (props) => {
  const redirect = useRedirect();

  return (
    <TopToolbar>
      <Button
        onClick={() => {
          redirect(
            `${props.basePath}/${Number(props?.data?.project_detail_id)}/list`
          );
        }}
        label="Back"
        color="primary"
        startIcon={<ArrowBackIcon />}
        style={{ position: "absolute", left: 0 }}
      />
      <EditButton {...props} record={props.data} />
    </TopToolbar>
  );
};

const RiskAssessmentsShow = (props) => {
  const classes = useStyles();
  const { record } = useShowController(props);

  return (
    <Show {...props} actions={<Actions {...props} />}>
      <SimpleShowLayout>
        <div className="Section2">
          <div className="content-area">
            <Typography
              variant="h2"
              style={{ marginLeft: 15, marginBottom: 15 }}
            >
              Risk Management
            </Typography>
            <TableContainer>
              <Table
                size="medium"
                className={clsx("bordered", classes.bordered, classes.table)}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Reporting Date</TableCell>
                    <TableCell>Reporting Quarter</TableCell>
                    <TableCell>Risk Description</TableCell>
                    <TableCell>Likelihood of Occurrence</TableCell>
                    <TableCell>Impact (Low to high)</TableCell>
                    <TableCell>Mitigation plan</TableCell>
                    <TableCell>Responsible Entity</TableCell>
                    <TableCell>Mitigation Response</TableCell>
                    <TableCell>Effects</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {record && (
                    <TableRow>
                      <TableCell>
                        {record &&
                          getFiscalYearValue(record.reporting_date) &&
                          getFiscalYearValue(record.reporting_date).name}
                      </TableCell>
                      <TableCell>{record.reporting_quarter}</TableCell>
                      <TableCell>{record.description}</TableCell>
                      <TableCell>{record.occurrence}</TableCell>
                      <TableCell>{record.impact}</TableCell>
                      <TableCell>{record.mitigation_plan}</TableCell>
                      <TableCell>{record.responsible_entity}</TableCell>
                      <TableCell>{record.mitigation_response || "-"}</TableCell>
                      <TableCell>{record.effects || "-"}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </SimpleShowLayout>
    </Show>
  );
};

export default RiskAssessmentsShow;
