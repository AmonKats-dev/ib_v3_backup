import React, { PureComponent, useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  Label,
  ResponsiveContainer,
} from "recharts";
import { useRedirect } from "react-admin";
import { PROJECT_PHASES_COLORS } from "../../../../constants/common";
import lodash from "lodash";
import { billionsFormatter } from "../../../resources/Projects/Report/helpers";
import { checkFeature } from "../../../../helpers/checkPermission";
import CustomTooltip from "./CustomTooltip";

function getGrouppedData(data, isCosts, currentLevel, dimension) {
  let filtered = data.filter((item) =>
    isCosts
      ? !lodash.isEmpty(item?.current_project_detail?.investment_stats)
      : true
  );

  if (isCosts) {
    filtered = filtered.map((item) => {
      // let totalSum = 0;
      // lodash.keys(item.costs).forEach((year) => {
      //   totalSum += parseFloat(item.costs[year]);
      // });

      item.cost = item.current_project_detail.investment_stats.total_cost;
      return item;
    });
  }

  const groupped = lodash.groupBy(filtered, (item) =>
    currentLevel && item[dimension]
      ? item[dimension].id
      : item[dimension].parent && item[dimension].parent.id
  );

  return lodash.keys(groupped).map((item) => ({
    [dimension]: item,
    count: groupped[item].length,
    cost: lodash.sumBy(groupped[item], (it) => Number(it.cost)),
  }));
}

export default function BarChartDrill(props) {
  const redirect = useRedirect();

  if (!props.data) return null;

  function handleClick(data, index) {
    const queryFilters = { [props.field]: data[props.dimension] };
    if (props.onGoingProjects) {
      queryFilters.project_status = "ONGOING";
    }
    redirect(
      `/projects?filter=${encodeURI(
        JSON.stringify(queryFilters)
      )}&page=1&per_page=10&sort_field=id&sort_order=ASC`
    );
  }

  function getDataByPrograms() {
    return getGrouppedData(props.data, true, 1, props.dimension).map((item) => {
      item.name = findSector(item[props.dimension]);
      return item;
    });
  }

  function findSector(id) {
    const org = lodash.find(
      props.items,
      (item) => Number(item.id) === Number(id)
    );
    return org ? org.name : id;
  }

  return (
    <ResponsiveContainer>
      <BarChart
        width={350}
        height={200}
        data={getDataByPrograms()}
        margin={{
          top: 20,
          right: 30,
          left: 100,
          bottom: 140,
        }}
      >
        <XAxis
          dataKey={"name"}
          angle={-45}
          textAnchor="end"
          interval={0}
          tickFormatter={(value) => {
            return value && value.slice(0, 25) + "...";
          }}
        />
        <YAxis
          allowDecimals={false}
          tickFormatter={(label) =>
            props.measure === "cost"
              ? billionsFormatter(parseFloat(label))
              : label
          }
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey={props.measure} onClick={handleClick}>
          {getDataByPrograms().map((entry, index) => {
            return (
              <Cell key={`cell-${index}`} fill={PROJECT_PHASES_COLORS[2]} />
            );
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
