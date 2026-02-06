import React, { useState } from "react";
import {
  Show,
  SimpleShowLayout,
  TopToolbar,
  TextField,
  EditButton,
  useShowController,
  Button,
  useRedirect,
  useDataProvider,
} from "react-admin";
import { useCheckPermissions } from "../../../helpers/checkPermission";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Table from "@material-ui/core/Table";
import { Typography } from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import lodash from "lodash";
import { costSumFormatter } from "../../../helpers";
import { getFiscalYearValueFromYear } from "../../../helpers/formatters";
import moment from "moment";
import ArrowForward from "@material-ui/icons/ArrowForward";
import { useHistory } from "react-router-dom";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { ActivitiesInvestments } from "../Projects/Report/components/ActivitiesInvestments";
import { formatValuesToQuery } from "../../../helpers/dataHelpers";

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
  const checkPermission = useCheckPermissions();
  const history = useHistory();
  const redirect = useRedirect();

  return (
    <TopToolbar>
      <Button
        onClick={() => {
          redirect(
            `/implementation-module/${Number(props?.data?.project_detail_id)}/costed-annualized-plan`
          );
        }}
        label="Back"
        color="primary"
        startIcon={<ArrowBackIcon />}
        style={{ position: "absolute", left: 0 }}
      />
      {/* <Button label="Publish" startIcon={<ArrowForward />}></Button> */}
      <EditButton {...props} record={props.data} />
    </TopToolbar>
  );
};

const CostPlansShow = (props) => {
  const classes = useStyles();
  const { record } = useShowController(props);
  // const currentYear = moment(record.year).startOf("year");

  const [projectDetails, setProjectDetails] = useState();
  const dataProvider = useDataProvider();

  React.useEffect(() => {
    if (record)
      dataProvider
        .getOne("project-details", {
          id: record.project_detail_id,
        })
        .then((res) => {
          if (res && res.data) {
            setProjectDetails(formatValuesToQuery({ ...res.data }));
          }
        });
  }, [dataProvider, record]);

  function getGroupedData() {
    if (record && record.cost_plan_items) {
      const groupedByActivity = lodash.groupBy(
        record.cost_plan_items,
        (item) => item.cost_plan_activity_id
      );

      return groupedByActivity;
    }

    return null;
  }


  return (
    <Show {...props} actions={<Actions {...props} />}>
      <SimpleShowLayout>
        <div className="Section2">
          <div className="content-area">
            {/* <Typography
              variant="h2"
              style={{ marginLeft: 15, marginBottom: 15 }}
            >
              Cost Annualized Plan
            </Typography> */}

            {projectDetails && (
              <ActivitiesInvestments
                customRecord={projectDetails}
                title={"Planned Costed Annualized Plan"}
              />
            )}

            <h2>Actual Costed Annualized Plan</h2>
            <TableContainer>
              <Table
                size="medium"
                className={clsx("bordered", classes.bordered, classes.table)}
              >
                <TableHead>
                  <TableRow>
                    <TableCell rowSpan={3} colSpan={2}>
                      Cost Classification
                    </TableCell>
                    <TableCell rowSpan={3} colSpan={2}>
                      Fund Source
                    </TableCell>
                    {/* <TableCell colSpan={5}>Fiscal year</TableCell> */}
                    {/* <TableCell colSpan={5}>Next fiscal Year</TableCell> */}
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={5}>
                      {record && getFiscalYearValueFromYear(record.year).name}
                    </TableCell>
                    {/* <TableCell colSpan={5}>2021/2022</TableCell> */}
                  </TableRow>
                  <TableRow>
                    <TableCell>Amount</TableCell>
                    <TableCell>Procurement method</TableCell>
                    <TableCell>Procurement start date</TableCell>
                    <TableCell>Anticipated contract signed date</TableCell>
                    <TableCell>Procurement details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* <TableRow>
                <TableCell colSpan={12}>Output 1</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={12}>Activity 1</TableCell>
              </TableRow> */}
                  {record &&
                    getGroupedData() &&
                    lodash.keys(getGroupedData()).map((activityId) => {
                      const activity = lodash.find(
                        record.cost_plan_activities,
                        (it) => Number(it.id) === Number(activityId)
                      );
                      const activityRow = (
                        <TableRow>
                          <TableCell colSpan={9} style={{ fontWeight: "bold" }}>
                            {`Activity: ${activity && activity.name}`}
                          </TableCell>
                        </TableRow>
                      );
                      const activityData = getGroupedData()[activityId];
                      const costItems =
                        activityData &&
                        activityData.map((costItem) => {
                          return (
                            <TableRow>
                              <TableCell colSpan={2}>
                                {`${costItem.costing.code}-${costItem.costing.name}`}
                              </TableCell>
                              <TableCell colSpan={2}>
                                {`${costItem.fund.code}-${costItem.fund.name}`}
                              </TableCell>
                              <TableCell>
                                {costSumFormatter(costItem.amount)}
                              </TableCell>
                              <TableCell>
                                {costItem.procurement_method}
                              </TableCell>
                              <TableCell>
                                {costItem.procurement_start_date}
                              </TableCell>
                              <TableCell>
                                {costItem.contract_signed_date}
                              </TableCell>
                              <TableCell>
                                {costItem.procurement_details}
                              </TableCell>
                            </TableRow>
                          );
                        });

                      return [activityRow, costItems];
                    })}
                  {/* <TableRow>
                    <TableCell colSpan={2} style={{ fontWeight: "bold" }}>
                      Cost Classification 1
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Procurement method
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Procurement start date
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Anticipated contract signed date
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Procurement details
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>2000</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Procurement method
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Procurement start date
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Anticipated contract signed date
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Procurement details
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>2000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2}>Fund Source 1</TableCell>
                    <TableCell>Procurement method</TableCell>
                    <TableCell>Procurement start date</TableCell>
                    <TableCell>Anticipated contract signed date</TableCell>
                    <TableCell>Procurement details</TableCell>
                    <TableCell>1000</TableCell>
                    <TableCell>Procurement method</TableCell>
                    <TableCell>Procurement start date</TableCell>
                    <TableCell>Anticipated contract signed date</TableCell>
                    <TableCell>Procurement details</TableCell>
                    <TableCell>1000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2}>Fund Source 2</TableCell>
                    <TableCell>Procurement method</TableCell>
                    <TableCell>Procurement start date</TableCell>
                    <TableCell>Anticipated contract signed date</TableCell>
                    <TableCell>Procurement details</TableCell>
                    <TableCell>1000</TableCell>
                    <TableCell>Procurement method</TableCell>
                    <TableCell>Procurement start date</TableCell>
                    <TableCell>Anticipated contract signed date</TableCell>
                    <TableCell>Procurement details</TableCell>
                    <TableCell>1000</TableCell>
                  </TableRow> */}
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
