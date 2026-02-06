import moment from "moment";
import React, { useEffect } from "react";
import {
  Button,
  Edit,
  FormDataConsumer,
  number,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
} from "react-admin";
import { FUND_BODY_TYPES } from "../../../constants/common";
import {
  commasFormatter,
  commasParser,
  costSumFormatter,
} from "../../../helpers";

import { concat, find, findIndex, groupBy, keys, uniq } from "lodash";

import { TableContainer } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { setBreadCrumps } from "../../../actions/ui";
import { getFeatureValue } from "../../../helpers/checkPermission";
import { getComponentCodeName } from "../../pages/helpers";
import { months } from "./constants";
import { checkActivityInFiscalPeriod } from "./helpers";

const FormToolbar = ({ onSaveSuccess, onClose, projectId, ...props }) => {
  return (
    <Toolbar style={{ width: "100%" }}>
      <Button
        onClick={onClose}
        label="Cancel"
        style={{ marginRight: 5, padding: "7px 15px" }}
        color="primary"
        variant="contained"
      />
      <SaveButton
        {...props}
        onSuccess={onSaveSuccess}
        disabled={props.invalid || props.pristine}
      />
    </Toolbar>
  );
};

const WorkPlansEditForms = ({
  projectDetails,
  year,
  onSave,
  onClose,
  bpmsData,
  ...props
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getLinks = () => {
      switch (true) {
        case props.showWorkPlan:
          return { to: "/work_plan", title: "Projected Cash Flow" };
        case props.showWorkPlanApproved:
          return { to: "/work_plan_approved", title: "Approved Cash Flow" };
        case props.showWorkPlanAdjusted:
          return { to: "/work_plan_adjusted", title: "Adjusted Cash Flow" };

        default:
          break;
      }
    };

    if (!props.defaultBreadcrumbs) {
      dispatch({
        type: "SET_PROJECT_TITLE_HEADER",
        payload: {
          data: `${projectDetails?.project?.name}`,
        },
      });

      dispatch(
        setBreadCrumps([{ ...getLinks() }, { to: "", title: "Details" }])
      );
    }

    // return () => {
    //   dispatch(setBreadCrumps([]));
    // };
  }, []);

  const fiscalStartDate = getFeatureValue("fiscal_year_start_date");

  const prevMonths = useMemo(() => {
    if (!props.showWorkPlanAdjusted) return [];

    const currentMonth = Number(moment().format("MM"));
    const startMonth = Number(fiscalStartDate.split("/")[1]);

    if (currentMonth < startMonth) {
      return months.filter(
        (monthLabel) =>
          Number(monthLabel) >= startMonth || Number(monthLabel) <= currentMonth
      );
    }

    if (currentMonth > startMonth) {
      return months.filter((monthLabel) => {
        return (
          Number(monthLabel) >= startMonth && Number(monthLabel) <= currentMonth
        );
      });
    }
  }, [fiscalStartDate, props.showWorkPlanAdjusted]);

  if (!projectDetails) return null;

  const innvestments = uniq(
    concat(
      ...projectDetails.activities
        .filter((activity) => {
          const { start_date, end_date } = activity;
          return checkActivityInFiscalPeriod({ start_date, end_date, year });
        })
        .map((activity) =>
          activity.investments.map((item) => {
            const outputId = activity.output_ids && activity.output_ids[0];
            const output = find(
              projectDetails.outputs,
              (it) => it.id === outputId
            );
            const component = find(
              projectDetails.components,
              (it) => it.id === output.component_id
            );

            return {
              ...item,
              activity: activity,
              component_id: component?.id,
              component: component,
              output_id: outputId,
              output: output,
              fund_body_type: String(item.fund_body_type || 3),
            };
          })
        )
    )
  );

  const grFund = groupBy(
    innvestments,
    (it) =>
      `${it.fund.name} ${
        it.fund_body_type && Number(it.fund_body_type) < 3
          ? `(${FUND_BODY_TYPES[it.fund_body_type]})`
          : ""
      } `
  );

  const getAnnualByActivity = (id) => {
    const activity = find(innvestments, (it) => it.activity_id === id);

    return activity && activity.costs ? activity.costs[year] : 0;
  };

  const monthsCurrent = months.filter((month) => !prevMonths.includes(month));

  return (
    <Edit {...props} undoable={false}>
      <SimpleForm
        redirect={false}
        toolbar={
          <FormToolbar
            projectId={projectDetails?.project_id}
            onSaveSuccess={onSave}
            onClose={onClose}
          />
        }
      >
        <FormDataConsumer>
          {({ getSource, scopedFormData, formData, ...rest }) => {
            if (formData) {
              formData.year = year; //moment().format("YYYY");
              formData.project_detail_id = projectDetails?.id;

              if (
                (formData && !formData.cost_plan_items) ||
                (formData.cost_plan_items &&
                  formData.cost_plan_items.length === 0)
              ) {
                formData.cost_plan_items = innvestments?.map((it) => ({
                  activity_id: it?.activity_id,
                  fund_body_type: String(it?.fund_body_type),
                  fund_id: it?.fund_id,
                  cash_flow: {},
                }));
              }
            }

            const totalByFund = {};
            const totalByFundIds = {};

            const fundByIdType = groupBy(
              formData.cost_plan_items,
              (it) =>
                `${it.fund.name} ${
                  it.fund_body_type && Number(it.fund_body_type) < 3
                    ? `(${FUND_BODY_TYPES[it.fund_body_type]})`
                    : ""
                } `
            );

            const fundByIds = groupBy(
              formData.cost_plan_items,
              (it) => it?.fund?.code
            );

            keys(fundByIdType).forEach((fundName) => {
              const items = fundByIdType[fundName];

              items.forEach((item) => {
                if (!totalByFund[fundName]) {
                  totalByFund[fundName] = 0;
                }

                keys(item.cash_flow).forEach((m) => {
                  totalByFund[fundName] += parseFloat(item.cash_flow[m] || 0);
                });
              });
            });

            keys(fundByIds).forEach((fundName) => {
              const items = fundByIds[fundName];

              items.forEach((item) => {
                if (!totalByFundIds[fundName]) {
                  totalByFundIds[fundName] = 0;
                }

                keys(item.cash_flow).forEach((m) => {
                  totalByFundIds[fundName] += parseFloat(
                    item.cash_flow[m] || 0
                  );
                });
              });
            });

            console.log(totalByFundIds, "totalByFundIds");
            console.log(totalByFund, "totalByFund");

            return (
              <>
                <TableContainer style={{ overflow: "auto" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ width: 150 }}></TableCell>
                        <TableCell style={{ width: 150 }} align="right">
                          Proposed Annual
                        </TableCell>
                        {prevMonths.length > 0 && (
                          <TableCell
                            style={{ width: 150 }}
                            align="right"
                          >{`${moment(prevMonths[0], "MM").format(
                            "MMM"
                          )} - ${moment(
                            prevMonths[prevMonths.length - 1],
                            "MM"
                          ).format("MMM")}`}</TableCell>
                        )}
                        {monthsCurrent.map((month) => {
                          const monthLabel = moment(month, "MM")
                            .format("MMM")
                            .toLowerCase();

                          return (
                            <TableCell
                              align="center"
                              style={{
                                textTransform: "capitalize",
                              }}
                            >
                              {monthLabel}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.keys(grFund).map((fundId) => {
                        const fundCode = grFund[fundId][0]?.fund?.code;
                        const grComp = groupBy(
                          grFund[fundId],
                          (it) => it?.component?.name
                        );

                        const compRow = Object.keys(grComp).map(
                          (compId, idx) => {
                            const element = grComp[compId];

                            const activity = element.map((item) => {
                              const actIdx = findIndex(
                                formData.cost_plan_items,
                                (it) =>
                                  it?.activity_id === item?.activity_id &&
                                  it?.fund_id === item?.fund_id &&
                                  it?.fund_body_type === item?.fund_body_type
                              );

                              // console.log(actIdx, "actIdx");
                              const totalByActivity = () => {
                                let total = 0;
                                prevMonths.forEach((month) => {
                                  const monthLabel = moment(month, "MM")
                                    .format("MMMM")
                                    .toLowerCase();

                                  total += parseFloat(
                                    formData?.cost_plan_items[actIdx]
                                      ?.cash_flow[monthLabel] || 0
                                  );
                                });

                                return total;
                              };

                              if (actIdx === -1) return null;

                              return (
                                <TableRow>
                                  <TableCell
                                    style={{
                                      maxWidth: 300,
                                      textOverflow: "ellipsis",
                                      overflow: "hidden",
                                      whiteSpace: "nowrap",
                                    }}
                                    title={item?.activity?.name}
                                  >
                                    {item?.activity?.name}
                                  </TableCell>
                                  {prevMonths.length > 0 && (
                                    <TableCell align="right">
                                      {costSumFormatter(
                                        totalByActivity(item?.activity)
                                      )}
                                    </TableCell>
                                  )}
                                  <TableCell align="right">
                                    {costSumFormatter(
                                      getAnnualByActivity(item.activity.id)
                                    )}
                                  </TableCell>
                                  {monthsCurrent.map((month) => {
                                    const monthLabel = moment(month, "MM")
                                      .format("MMMM")
                                      .toLowerCase();

                                    return (
                                      <TableCell
                                        style={{ width: 150 }}
                                        align="right"
                                      >
                                        <TextInput
                                          source={`cost_plan_items[${actIdx}].cash_flow.${monthLabel}`}
                                          label={false}
                                          variant="outlined"
                                          margin="none"
                                          format={commasFormatter}
                                          parse={commasParser}
                                          style={{ width: 120 }}
                                          validate={[number()]}
                                          InputProps={{
                                            textAlign: "right",
                                          }}
                                        />
                                      </TableCell>
                                    );
                                  })}
                                </TableRow>
                              );
                            });

                            const component = (
                              <TableRow>
                                <TableCell colSpan={monthsCurrent.length + 3}>
                                  {`Component: ${getComponentCodeName(
                                    element[0].component
                                  )}`}
                                </TableCell>
                              </TableRow>
                            );

                            return [component, activity];
                          }
                        );

                        const fundRow = (
                          <TableRow>
                            <TableCell
                              colSpan={monthsCurrent.length + 3}
                              variant="head"
                            >
                              Fund Source: {fundId}
                            </TableCell>
                          </TableRow>
                        );

                        const fundRowTotal = [
                          <TableRow>
                            <TableCell
                              style={{
                                fontWeight: "bold",
                                border: "none",
                              }}
                            >
                              Fund Source Total
                            </TableCell>
                            <TableCell
                              style={{
                                fontWeight: "bold",
                                textAlign: "right",
                                border: "none",
                              }}
                            >
                              {costSumFormatter(totalByFund[fundId])}
                            </TableCell>
                          </TableRow>,
                          <TableRow>
                            <TableCell
                              style={{
                                fontWeight: "bold",
                                border: "none",
                              }}
                            >
                              Budget Total
                            </TableCell>
                            <TableCell
                              style={{
                                fontWeight: "bold",
                                textAlign: "right",
                                border: "none",
                              }}
                            >
                              {costSumFormatter(
                                (bpmsData && bpmsData[fundCode]) || 0
                              )}
                            </TableCell>
                            
                          </TableRow>,
                          <TableRow>
                            <TableCell
                              style={{
                                fontWeight: "bold",
                                border: "none",
                              }}
                            >
                              Balance
                            </TableCell>
                            <TableCell
                              style={{
                                fontWeight: "bold",
                                color:
                                  ((bpmsData && bpmsData[fundCode]) || 0) -
                                    (totalByFund[fundId] || 0) <
                                  0
                                    ? "red"
                                    : "inherit",
                                textAlign: "right",
                                border: "none",
                              }}
                            >
                              {costSumFormatter(
                                ((bpmsData && bpmsData[fundCode]) || 0) -
                                  (totalByFund[fundId] || 0)
                              )}
                            </TableCell>
                          </TableRow>,
                        ];

                        return [fundRow, compRow, fundRowTotal];
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            );
          }}
        </FormDataConsumer>
      </SimpleForm>
    </Edit>
  );
};

export default WorkPlansEditForms;
