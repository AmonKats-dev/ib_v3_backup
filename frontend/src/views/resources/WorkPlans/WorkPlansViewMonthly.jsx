import { TableFooter, Typography } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { find, findIndex, groupBy, keys, sumBy, uniq, uniqBy } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Button,
  Show,
  SimpleShowLayout,
  TopToolbar,
  useDataProvider,
  useShowController,
} from "react-admin";
import { useDispatch } from "react-redux";
import { setBreadCrumps } from "../../../actions/ui";
import { FUND_BODY_TYPES } from "../../../constants/common";
import { costSumFormatter } from "../../../helpers";
import { months } from "./constants";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";
import { getComponentCodeName } from "../../pages/helpers";
import Preloader from "../../components/Preloader";
import { useCheckPermissions } from "../../../helpers/checkPermission";

const Actions = ({ onClose, onApprove, isSubmitted, ...props }) => {
  const checkPermissions = useCheckPermissions();

  return (
    <TopToolbar
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Button
        onClick={onClose}
        label="Back"
        color="primary"
        startIcon={<ArrowBackIcon />}
      />
      {!isSubmitted && checkPermissions("publish_warrant_request") && (
        <Button
          onClick={onApprove}
          label={"Publish"}
          color="primary"
          variant="text"
          startIcon={<PlaylistAddCheckIcon />}
        />
      )}
    </TopToolbar>
  );
};

const WorkPlansViewMonthly = ({
  projectDetails,
  projectCode,
  onClose,
  totalItem,
  onApprove,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [bpms, setBpms] = useState([]);
  const [columnsAmount, setColumnsAmount] = useState({});
  const { record } = useShowController(props);
  const dispatch = useDispatch();
  const dataProvider = useDataProvider();
  const checkPermissions = useCheckPermissions();

  useEffect(() => {
    const getLinks = () => {
      switch (true) {
        case props.showWorkPlan:
          return { to: "/work_plan", title: "Projected Cash Flow" };
        case props.showWorkPlanApproved:
          return { to: "/work_plan_approved", title: "Approved Cash Flow" };
        case props.showWorkPlanAdjusted:
          return { to: "/work_plan_adjusted", title: "Adjusted Cash Flow" };
        case props.showWorkPlanMonthly:
          return {
            to: `cost-plans-monthly/${projectDetails?.project_id}/show`,
            title: "Warrant Request",
            onClick: onClose,
          };
        default:
          break;
      }
    };

    if (!props.defaultBreadcrumbs) {
      dispatch(
        setBreadCrumps([{ ...getLinks() }, { to: "", title: "Details" }])
      );
    }
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
  }, [dispatch, projectDetails.project.name, props.defaultBreadcrumbs]);

  useEffect(() => {
    if (projectCode && checkPermissions("list_bpms_data")) {
      setIsLoading(true);
      dataProvider
        .getIntegrationData("integrations/bpms", {
          filter: {
            project_coa_code: projectCode,
          },
        })
        .then((res) => {
          if (res?.data) {
            setBpms(res?.data)
            const grouped = groupBy(
              res?.data?.filter((it) => it.costing),
              (it) => String(it.object_code)[0] + String(it.object_code)[1]
            );

            const groupedAmount = {};

            Object.keys(grouped).forEach((objectCode) => {
              groupedAmount[objectCode] = sumBy(grouped[objectCode], "amount");
            });

            setColumnsAmount(groupedAmount);
            setColumns(uniq(Object.keys(grouped)));
            setIsLoading(false);
          }
        });
    }
  }, [checkPermissions, dataProvider, projectCode]);

  if (!projectDetails) return null;

  if (!record) return null;

  if (isLoading) return <Preloader />;

  if (record?.cost_plan_items?.length === 0) {
    return (
      <>
        <Button
          onClick={onClose}
          label="Back"
          color="primary"
          startIcon={<ArrowBackIcon />}
          style={{ marginBottom: 35 }}
        />
        <br />
        <Typography variant="h3">Data has not been filled in yet.</Typography>
      </>
    );
  }

  const findObjectByCode = (code) => {
    if (!bpms) return "";
    const selected = find(
      bpms,
      (it) => Number(it.object_code_only) === Number(code)
    );

    return selected?.costing?.name || "";
  };

  const totalByColumn = (monthLabel) => {
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
  const monthLabel = moment(record?.month, "MM").format("MMMM").toLowerCase();

  return (
    <Show
      {...props}
      actions={
        <Actions
          onClose={onClose}
          onApprove={onApprove}
          isSubmitted={record.cost_plan_status === "SUBMITTED"}
        />
      }
    >
      <SimpleShowLayout>
        <div className="Section2">
          <div className="content-area">
            <Typography
              variant="h3"
              style={{
                textTransform: "capitalize",
                marginBottom: 15,
              }}
            >
              {monthLabel}
            </Typography>
            <TableContainer style={{ overflow: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "150px" }}></TableCell>
                    {columns?.map((col) => (
                      <TableCell key={col} style={{ textAlign: "right" }}>
                        {`${col} - ${findObjectByCode(col)}`}
                      </TableCell>
                    ))}
                    <TableCell
                      style={{
                        textAlign: "right",
                      }}
                    >
                      Total
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "right",
                      }}
                    >
                      Approved Budget
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(grFund).map((fundId) => {
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

                        const actTotalIdx = findIndex(
                          totalItem.cost_plan_items,
                          (it) =>
                            it.activity_id === item?.activity?.id &&
                            it.fund_id === item?.fund_id &&
                            it.fund_body_type === item?.fund_body_type
                        );
                        const monthLabel = moment()
                          .month(record?.month - 1)
                          .format("MMMM")
                          .toLowerCase();
                        const totalValue =
                          totalItem?.cost_plan_items[actTotalIdx]?.cash_flow[
                            monthLabel
                          ] || 0;

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
                              {item.activity.name}
                            </TableCell>
                            {columns?.map((col) => {
                              const columnId = `v${col}`;
                              const value =
                                item &&
                                item.cash_flow &&
                                parseFloat(item.cash_flow[`v${col}`] || 0);

                              activityTotal += value || 0;

                              componentTotal[columnId] = componentTotal[
                                columnId
                              ]
                                ? componentTotal[columnId] + value
                                : value;

                              fundTotal[columnId] = fundTotal[columnId]
                                ? fundTotal[columnId] + value
                                : value;

                              return (
                                <TableCell style={{ textAlign: "right" }}>
                                  {costSumFormatter(
                                    item?.cash_flow && item.cash_flow[columnId]
                                  ) || 0}
                                </TableCell>
                              );
                            })}
                            <TableCell
                              style={{
                                fontWeight: "bold",
                                textAlign: "right",
                                color:
                                  activityTotal > totalValue ? "red" : "black",
                              }}
                            >
                              {costSumFormatter(activityTotal)}
                            </TableCell>
                            <TableCell
                              style={{ fontWeight: "bold", textAlign: "right" }}
                            >
                              {costSumFormatter(totalValue)}
                            </TableCell>
                          </TableRow>
                        );
                      });

                      const component = (
                        <TableRow>
                          <TableCell
                            colSpan={columns.length + 3}
                            variant="head"
                          >
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
                        <TableCell colSpan={columns.length + 3} variant="head">
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
                        {columns?.map((col) => {
                          const columnId = `v${col}`;

                          return (
                            <TableCell
                              style={{
                                fontWeight: "bold",
                                color: "blue",
                                textAlign: "right",
                              }}
                            >
                              {costSumFormatter(fundTotal[columnId])}
                            </TableCell>
                          );
                        })}
                        <TableCell
                          style={{
                            fontWeight: "bold",
                            color: "blue",
                            textAlign: "right",
                          }}
                        >
                          {costSumFormatter(calcTotalByYear(fundTotal))}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>,
                      <TableRow>
                        <TableCell
                          colSpan={columns.length + 3}
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
                      {columns?.map((col) => {
                        const columnId = `v${col}`;
                        return (
                          <TableCell
                            style={{
                              fontWeight: "bold",
                              color: "green",
                              textAlign: "right",
                            }}
                          >
                            {costSumFormatter(componentTotal[columnId])}
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
                    </TableRow>
                  );

                  return [component];
                })}
                <TableRow>
                  <TableCell style={{ fontWeight: "bold", color: "red" }}>
                    Grand Total
                  </TableCell>
                  {columns?.map((col) => {
                    const monthLabel = `v${col}`;
                    return (
                      <TableCell
                        style={{
                          fontWeight: "bold",
                          color: "red",
                          textAlign: "right",
                        }}
                      >
                        {costSumFormatter(totalByColumn(monthLabel))}
                      </TableCell>
                    );
                  })}
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      color: "red",
                      textAlign: "right",
                    }}
                  >
                    {/* {costSumFormatter(
                      sumBy(
                        months.map((year) => ({ total: totalByColumn(year) })),
                        "total"
                      )
                    )} */}
                  </TableCell>
                </TableRow>
              </Table>
            </TableContainer>
          </div>
        </div>
      </SimpleShowLayout>
    </Show>
  );
};

export default WorkPlansViewMonthly;
