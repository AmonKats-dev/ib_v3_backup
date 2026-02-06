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

const CostPlansShow = (props) => {
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
              Stakeholder Engagement
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
                    <TableCell>Stakeholder Name</TableCell>
                    <TableCell>Interest Level</TableCell>
                    <TableCell>Level of Influence</TableCell>
                    <TableCell>Status of Engagement</TableCell>
                    <TableCell>Level of engagement</TableCell>
                    <TableCell>Engagement frequency</TableCell>
                    <TableCell>Communication Channel</TableCell>
                    <TableCell>Issues</TableCell>
                    <TableCell>Mitigation Measures</TableCell>
                    <TableCell>Responsible Entity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {record && (
                    <TableRow>
                      <TableCell>
                        {record &&
                          getFiscalYearValue(record.reporting_date) &&
                          getFiscalYearValue(record.reporting_date).name}
                      </TableCell>{" "}
                      <TableCell>{record.reporting_quarter}</TableCell>
                      <TableCell>{record.name}</TableCell>
                      <TableCell>{record.interest_level}</TableCell>
                      <TableCell>{record.influence_level}</TableCell>
                      <TableCell>{record.engagement_status}</TableCell>
                      <TableCell>{record.engagement_level}</TableCell>
                      <TableCell>{record.engagement_frequency}</TableCell>
                      <TableCell>{record.communication_channel}</TableCell>
                      <TableCell>{record.issues}</TableCell>
                      <TableCell>{record.mitigation_plan}</TableCell>
                      <TableCell>{record.responsible_entity}</TableCell>
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

export default CostPlansShow;
