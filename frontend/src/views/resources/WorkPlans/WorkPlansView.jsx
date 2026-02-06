import { TableFooter, Typography } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { concat, find, groupBy, keys, sumBy, uniq } from "lodash";
import moment from "moment";
import React, { useEffect } from "react";
import { Show, SimpleShowLayout, useShowController } from "react-admin";
import { useDispatch } from "react-redux";
import { setBreadCrumps } from "../../../actions/ui";
import { EXPORT_TYPES, FUND_BODY_TYPES } from "../../../constants/common";
import { costSumFormatter } from "../../../helpers";
import { getComponentCodeName } from "../../pages/helpers";
import ExportActions from "../../pages/reports/ExportActions";
import { months } from "./constants";

const WorkPlansView = ({ projectDetails, bpmsData, ...props }) => {
  const { record } = useShowController(props);
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
      dispatch(
        setBreadCrumps([{ ...getLinks() }, { to: "", title: "Details" }])
      );
    }

    return () => {
      dispatch(setBreadCrumps([]));
    };
  }, []);

  useEffect(() => {
    if (!props.defaultBreadcrumbs) {
      dispatch({
        type: "SET_PROJECT_TITLE_HEADER",
        payload: {
          data: `${projectDetails?.project?.name}`,
        },
      });
    }
  }, [projectDetails?.project?.name]);

  if (!projectDetails) return null;

  if (!record) return null;

  if (record?.cost_plan_items?.length === 0) {
    return (
      <Typography variant="h3">Data has not been filled in yet.</Typography>
    );
  }

  const totalByColumn = (month) => {
    const monthLabel = moment(month, "MM").format("MMMM").toLowerCase();

    let total = 0;
    record.cost_plan_items.forEach((item) => {
      total +=
        (item.cash_flow && parseFloat(item.cash_flow[monthLabel] || 0)) || 0;
    });

    return total;
  };

  const calcTotalByYear = (data) => {
    let total = 0;

    keys(data).forEach((year) => {
      total += parseFloat(data[year] || 0);
    });

    return total;
  };

  const costItems = record?.cost_plan_items?.map((item) => {
    const { activity } = item;

    const outputId = activity.output_ids && activity.output_ids[0];
    const output = find(projectDetails.outputs, (it) => it.id === outputId);
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
      fund_body_type: item.fund_body_type || 3,
    };
  });

  const grFund = groupBy(
    costItems,
    (it) =>
      `${it.fund.name} ${
        it.fund_body_type && it.fund_body_type < 3
          ? `(${FUND_BODY_TYPES[it.fund_body_type]})`
          : ""
      } `
  );

  const grComponents = groupBy(costItems, "component_id");

  const innvestments = uniq(
    concat(
      ...projectDetails.activities.map((activity) =>
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

  const getAnnualByActivity = (id) => {
    const activity = find(innvestments, (it) => it.activity_id === id);

    return activity && activity.costs ? activity.costs[props.record.year] : 0;
  };

  return (
    <Show {...props} actions={false}>
      <SimpleShowLayout>
        <div className="Section2">
          {props.isHistory && (
            <div style={{ display: "inline-block" }}>
              <ExportActions
                reportId="history-container"
                title="Cash Flow Adjusted History"
                exportTypes={[
                  EXPORT_TYPES.PDF,
                  EXPORT_TYPES.WORD,
                  EXPORT_TYPES.XLS,
                ]}
              />
            </div>
          )}

          <div className="content-area" id="history-container">
            <TableContainer
              style={{
                overflow: "auto",
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell align="right">Total</TableCell>
                    {months.map((month) => {
                      const monthLabel = moment(month, "MM")
                        .format("MMMM")
                        .toLowerCase();

                      return (
                        <TableCell
                          align="right"
                          style={{
                            textTransform: "capitalize",
                          }}
                        >
                          {monthLabel}
                        </TableCell>
                      );
                    })}
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="right">Proposed Annual</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(grFund).map((fundId) => {
                    const fundCode = grFund[fundId][0]?.fund?.code;
                    const grComp = groupBy(
                      grFund[fundId],
                      (it) => it.component?.name
                    );
                    const fundTotal = {};
                    const compRow = Object.keys(grComp).map((compId, idx) => {
                      const element = grComp[compId];
                      const componentTotal = {};

                      const activity = element.map((item) => {
                        let activityTotal = 0;

                        return (
                          <TableRow>
                            <TableCell
                              style={{
                                maxWidth: 300,
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                              }}
                              title={item.activity.name}
                            >
                              {item.activity.name}
                            </TableCell>
                            <TableCell></TableCell>
                            {months.map((year) => {
                              const monthLabel = moment(year, "MM")
                                .format("MMMM")
                                .toLowerCase();

                              const value =
                                item &&
                                item.cash_flow &&
                                parseFloat(item.cash_flow[monthLabel] || 0);

                              activityTotal += value || 0;

                              componentTotal[monthLabel] = componentTotal[
                                monthLabel
                              ]
                                ? componentTotal[monthLabel] + value
                                : value;

                              fundTotal[monthLabel] = fundTotal[monthLabel]
                                ? fundTotal[monthLabel] + value
                                : value;

                              return (
                                <TableCell style={{ textAlign: "right" }}>
                                  {costSumFormatter(
                                    item?.cash_flow &&
                                      item.cash_flow[monthLabel]
                                  ) || 0}
                                </TableCell>
                              );
                            })}
                            <TableCell
                              align="right"
                              style={{ fontWeight: "bold" }}
                            >
                              {costSumFormatter(activityTotal)}
                            </TableCell>
                            <TableCell
                              align="right"
                              style={{ fontWeight: "bold" }}
                            >
                              {costSumFormatter(
                                getAnnualByActivity(item.activity.id)
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      });

                      const component = (
                        <TableRow>
                          <TableCell colSpan={months.length + 3}>
                            {`Component: ${getComponentCodeName(
                              element[0].component
                            )}`}
                          </TableCell>
                        </TableRow>
                      );

                      return [component, activity];
                    });

                    const fundRow = (
                      <TableRow>
                        <TableCell
                          colSpan={months.length + 3}
                          style={{ fontWeight: "bold" }}
                        >
                          Fund Source: {fundId}
                        </TableCell>
                      </TableRow>
                    );

                    const fundRowTotal = [
                      <TableRow>
                        <TableCell
                          style={{ fontWeight: "bold", color: "blue" }}
                        >
                          Fund Source Total
                        </TableCell>
                        <TableCell
                          style={{
                            fontWeight: "bold",
                            color: "blue",
                            textAlign: "right",
                          }}
                        >
                          {costSumFormatter(calcTotalByYear(fundTotal))}
                        </TableCell>
                        {/* <TableCell></TableCell> */}
                        {months.map((year) => {
                          const monthLabel = moment(year, "MM")
                            .format("MMMM")
                            .toLowerCase();
                          return (
                            <TableCell
                              style={{
                                fontWeight: "bold",
                                color: "blue",
                                textAlign: "right",
                              }}
                            >
                              {costSumFormatter(fundTotal[monthLabel])}
                            </TableCell>
                          );
                        })}
                        {/* <TableCell
                          style={{
                            fontWeight: "bold",
                            color: "blue",
                            textAlign: "right",
                          }}
                        >
                          {costSumFormatter(calcTotalByYear(fundTotal))}
                        </TableCell>
                        <TableCell></TableCell> */}
                        <TableCell colSpan={2}></TableCell>

                      </TableRow>,
                      <TableRow>
                        <TableCell
                          style={{ fontWeight: "bold", color: "blue" }}
                          // colSpan={months.length + 1}
                        >
                          Budget Total
                        </TableCell>
                        <TableCell
                          style={{
                            fontWeight: "bold",
                            color: "blue",
                            textAlign: "right",
                          }}
                        >
                          {costSumFormatter(
                            (bpmsData && bpmsData[fundCode]) || 0
                          )}
                        </TableCell>
                      </TableRow>,
                      <TableRow>
                        <TableCell
                          style={{ fontWeight: "bold", color: "blue" }}
                          // colSpan={months.length + 1}
                        >
                          Balance
                        </TableCell>
                        <TableCell
                          style={{
                            fontWeight: "bold",
                            color:
                              ((bpmsData && bpmsData[fundCode]) || 0) -
                                calcTotalByYear(fundTotal) <
                              0
                                ? "red"
                                : "blue",
                            textAlign: "right",
                          }}
                        >
                          {costSumFormatter(
                            ((bpmsData && bpmsData[fundCode]) || 0) -
                              calcTotalByYear(fundTotal)
                          )}
                        </TableCell>
                      </TableRow>,
                      <TableRow>
                        <TableCell
                          colSpan={months.length + 4}
                          style={{ borderBottom: "1px solid #000" }}
                        ></TableCell>
                      </TableRow>,
                    ];

                    return [fundRow, compRow, fundRowTotal];
                  })}
                </TableBody>

                {Object.keys(grComponents).map((compId, idx) => {
                  const componentTotal = {};
                  grComponents[compId].forEach((it) => {
                    Object.keys(it.cash_flow).forEach((year) => {
                      const value = parseFloat(it.cash_flow[year] || 0);

                      componentTotal[year] = componentTotal[year]
                        ? componentTotal[year] + value
                        : value;
                    });
                  });

                  const component = (
                    <TableRow>
                      <TableCell style={{ fontWeight: "bold" }}>{`Component ${
                        idx + 1
                      }: Total`}</TableCell>
                      {months.map((year) => {
                        const monthLabel = moment(year, "MM")
                          .format("MMMM")
                          .toLowerCase();
                        return (
                          <TableCell
                            style={{
                              fontWeight: "bold",
                              color: "green",
                              textAlign: "right",
                            }}
                          >
                            {costSumFormatter(componentTotal[monthLabel])}
                          </TableCell>
                        );
                      })}
                      <TableCell
                        style={{
                          fontWeight: "bold",
                          color: "green",
                          textAlign: "right",
                        }}
                      >
                        {costSumFormatter(calcTotalByYear(componentTotal))}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  );

                  return [component];
                })}
                <TableRow>
                  <TableCell style={{ fontWeight: "bold", color: "red" }}>
                    Grand Total
                  </TableCell>
                  {months.map((year) => (
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        color: "red",
                        textAlign: "right",
                      }}
                    >
                      {costSumFormatter(totalByColumn(year))}
                    </TableCell>
                  ))}
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      color: "red",
                      textAlign: "right",
                    }}
                  >
                    {costSumFormatter(
                      sumBy(
                        months.map((year) => ({ total: totalByColumn(year) })),
                        "total"
                      )
                    )}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </Table>
            </TableContainer>
          </div>
        </div>
      </SimpleShowLayout>
    </Show>
  );
};

export default WorkPlansView;
