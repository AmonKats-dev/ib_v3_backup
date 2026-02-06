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
import lodash from "lodash";
import React from "react";
import {
  Button,
  EditButton,
  TopToolbar,
  useDataProvider,
  useRedirect,
} from "react-admin";
import { useHistory } from "react-router-dom";
import { EXPORT_TYPES } from "../../../constants/common";
import { costSumFormatter } from "../../../helpers";
import { useCheckPermissions } from "../../../helpers/checkPermission";
import { getFiscalYearValueFromYear } from "../../../helpers/formatters";
import ExportActions from "../../pages/reports/ExportActions";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 700,
    backgroundColor: "#fff",
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
  actions: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },
}));

const Actions = (props) => {
  const checkPermission = useCheckPermissions();
  return (
    <TopToolbar>
      {checkPermission("save_public_custom_report") &&
        checkPermission("edit_custom_report") && (
          <EditButton {...props} record={props.data} />
        )}
    </TopToolbar>
  );
};

const CostPlansShowReport = (props) => {
  const classes = useStyles();
  // const { record } = useShowController(props);
  const [costPlans, setCostPlans] = React.useState([]);
  const dataProvider = useDataProvider();
  const record = lodash.first(costPlans);
  const history = useHistory();
  const redirect = useRedirect();


  React.useEffect(() => {
    dataProvider
      .getListOfAll("cost-plans", {
        sort_field: "id",
        filter: { project_detail_id: Number(props.match?.params?.id) },
      })
      .then((resp) => {
        if (resp && resp.data) {
          setCostPlans(resp.data);
        }
      });
  }, []);

  function getGroupedData(costPlanItem) {
    if (costPlanItem && costPlanItem.cost_plan_items) {
      const groupedByActivity = lodash.groupBy(
        costPlanItem.cost_plan_items,
        (item) => item.cost_plan_activity_id
      );

      return groupedByActivity;
    }

    return null;
  }

  return (
    <div className="Section2">
      <div className={classes.actions}>
        <Button
          onClick={() => {
            redirect(
              `/implementation-module/${Number(
                props.match?.params?.id
              )}/costed-annualized-plan`
            );
          }}
          label="Back"
          color="primary"
          startIcon={<ArrowBackIcon />}
          style={{ marginBottom: 15 }}
        />
        <ExportActions
          reportId="report-container"
          title="Cost Annualized Plan"
          exportTypes={[EXPORT_TYPES.WORD, EXPORT_TYPES.PDF, EXPORT_TYPES.XLS]}
        />
      </div>
      <div className="content-area" id="report-container">
        <Typography variant="h2" style={{ marginLeft: 15, marginBottom: 15 }}>
          Cost Annualized Plan
        </Typography>
        {costPlans &&
          costPlans.length > 0 &&
          costPlans.map((costPlanItem) => (
            <TableContainer>
              <Table
                size="medium"
                className={clsx("bordered", classes.bordered, classes.table)}
              >
                {!lodash.isEmpty(getGroupedData(costPlanItem)) && (
                  <TableHead>
                    <TableRow>
                      <TableCell rowSpan={3} colSpan={2}>
                        Cost Classification
                      </TableCell>
                      <TableCell rowSpan={3} colSpan={2}>
                        Fund Source
                      </TableCell>
                    </TableRow>
                    {/* <TableRow>
                    <TableCell colSpan={5}>
                      {costPlanItem &&
                        getFiscalYearValueFromYear(costPlanItem.year).name}
                    </TableCell>
                  </TableRow> */}
                    <TableRow>
                      <TableCell>Amount</TableCell>
                      <TableCell>Procurement method</TableCell>
                      <TableCell>Procurement start date</TableCell>
                      <TableCell>Anticipated contract signed date</TableCell>
                      <TableCell>Procurement details</TableCell>
                    </TableRow>
                  </TableHead>
                )}
                {!lodash.isEmpty(getGroupedData(costPlanItem)) && (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={9} variant="head">
                        {costPlanItem &&
                          getFiscalYearValueFromYear(costPlanItem.year).name}
                      </TableCell>
                    </TableRow>
                    {costPlanItem &&
                      getGroupedData(costPlanItem) &&
                      lodash
                        .keys(getGroupedData(costPlanItem))
                        .map((activityId) => {
                          const activity = lodash.find(
                            costPlanItem.cost_plan_activities,
                            (it) => Number(it.id) === Number(activityId)
                          );
                          const activityRow = (
                            <TableRow>
                              <TableCell
                                colSpan={9}
                                style={{ fontStyle: "italic" }}
                              >
                                {`Activity: ${activity && activity.name}`}
                              </TableCell>
                            </TableRow>
                          );
                          const activityData =
                            getGroupedData(costPlanItem)[activityId];
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
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          ))}
      </div>
    </div>
  );
};

export default CostPlansShowReport;
