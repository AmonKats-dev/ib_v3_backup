import { TableContainer, TableFooter } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {
  concat,
  find,
  groupBy,
  keys,
  orderBy,
  sortBy,
  sumBy,
  uniq,
} from "lodash";
import React, { useEffect, useState } from "react";
import { setBreadCrumps } from "../../../actions/ui";
import { FUND_BODY_TYPES } from "../../../constants/common";
import { costSumFormatter } from "../../../helpers";
import { getFiscalYearValueFromYear } from "../../../helpers/formatters";
import { useDispatch } from "react-redux";
import { getComponentCodeName } from "../../pages/helpers";

const AnnualContent = ({ projectDetails, ...props }) => {
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
        case props.showExpenditures:
          return { to: "/expenditures", title: "Expenditures" };
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

  if (!projectDetails) return null;

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
            fund_body_type: item.fund_body_type || 3,
          };
        })
      )
    )
  );

  const grFund = groupBy(
    innvestments,
    (it) =>
      `${it.fund.name} ${
        it.fund_body_type && it.fund_body_type < 3
          ? `(${FUND_BODY_TYPES[it.fund_body_type]})`
          : ""
      } `
  );

  const grComponents = groupBy(innvestments, "component_id");
  const yearss = sortBy(
    uniq(concat(...innvestments.map((it) => Object.keys(it.costs || {})))).map(
      (year) => Number(year)
    )
  );

  const totalByColumn = (year) => {
    let total = 0;

    innvestments.forEach((item) => {
      total += parseFloat(item.costs[year] || 0);
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

  const getComponent = (compId, listItems) => {};

  return (
    <TableContainer style={{ overflow: "auto" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {yearss.map((year) => (
              <TableCell style={{ textAlign: "right" }}>
                {getFiscalYearValueFromYear(year).name}
              </TableCell>
            ))}
            <TableCell style={{ textAlign: "right" }}>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(grFund).map((fundId) => {
            const grComp = groupBy(grFund[fundId], (it) => it.component?.name);
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
                      title={item?.activity?.name}
                    >
                      {item.activity.name}
                    </TableCell>
                    {yearss.map((year) => {
                      const value = parseFloat(item.costs[year] || 0);

                      activityTotal += value;

                      componentTotal[year] = componentTotal[year]
                        ? componentTotal[year] + value
                        : value;

                      fundTotal[year] = fundTotal[year]
                        ? fundTotal[year] + value
                        : value;

                      return (
                        <TableCell style={{ textAlign: "right" }}>
                          {costSumFormatter(item.costs[year]) || 0}
                        </TableCell>
                      );
                    })}
                    <TableCell variant="head" style={{ textAlign: "right" }}>
                      {costSumFormatter(activityTotal)}
                    </TableCell>
                  </TableRow>
                );
              });

              const component = (
                <TableRow>
                  <TableCell colSpan={yearss.length + 2}>
                    {`Component: ${getComponentCodeName(element[0].component)}`}
                  </TableCell>
                </TableRow>
              );

              return [component, activity];
            });

            const fundRow = (
              <TableRow>
                <TableCell
                  colSpan={yearss.length + 2}
                  style={{ fontWeight: "bold" }}
                >
                  Fund Source: {fundId}
                </TableCell>
              </TableRow>
            );

            const fundRowTotal = [
              <TableRow>
                <TableCell style={{ fontWeight: "bold", color: "blue" }}>
                  Fund Source Total
                </TableCell>
                {yearss.map((year) => {
                  return (
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        color: "blue",
                        textAlign: "right",
                      }}
                    >
                      {costSumFormatter(fundTotal[year])}
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
              </TableRow>,
              <TableRow>
                <TableCell
                  colSpan={yearss.length + 2}
                  style={{ borderBottom: "1px solid #000" }}
                ></TableCell>
              </TableRow>,
            ];

            return [fundRow, compRow, fundRowTotal];
          })}
        </TableBody>
        {Object.keys(grComponents).map((comp, idx) => {
          const componentTotal = {};
          grComponents[comp].forEach((it) => {
            Object.keys(it.costs).forEach((year) => {
              const value = parseFloat(it.costs[year] || 0);

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
              {yearss.map((year) => {
                return (
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      color: "green",
                      textAlign: "right",
                    }}
                  >
                    {costSumFormatter(componentTotal[year])}
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
          {yearss.map((year) => (
            <TableCell
              style={{ fontWeight: "bold", color: "red", textAlign: "right" }}
            >
              {costSumFormatter(totalByColumn(year))}
            </TableCell>
          ))}
          <TableCell
            style={{ fontWeight: "bold", color: "red", textAlign: "right" }}
          >
            {costSumFormatter(
              sumBy(
                yearss.map((year) => ({ total: totalByColumn(year) })),
                "total"
              )
            )}
          </TableCell>
        </TableRow>
      </Table>
    </TableContainer>
  );
};

export default AnnualContent;
