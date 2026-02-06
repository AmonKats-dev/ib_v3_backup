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
import { PROJECT_PHASES_COLORS } from "../../../../constants/common";
import lodash from "lodash";
import CustomTooltip from "./CustomTooltip";
import { useRedirect } from "ra-core";

function getParent(item) {
  let currentParent = item.parent;

  if (currentParent.parent) {
    return getParent(currentParent);
  }

  return currentParent;
}

function getGrouppedData(data, isCosts) {
  let filtered = data.filter((item) =>
    isCosts ? !lodash.isEmpty(item.costs) : true
  );

  if (isCosts) {
    filtered = filtered.map((item) => {
      let totalSum = 0;
      lodash.keys(item.costs).forEach((year) => {
        totalSum += parseFloat(item.costs[year]);
      });

      item.cost = totalSum;
      return item;
    });
  }

  const groupped = lodash.groupBy(
    filtered,
    (item) => getParent(item.project_organization).id
  );

  return lodash.keys(groupped).map((item) => ({
    project_organization: item,
    count: groupped[item].length,
    cost: lodash.sumBy(groupped[item], (it) => Number(it.cost)),
  }));
}

export default function CustomBarChart(props) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const redirect = useRedirect();

  if (!props.data) return null;

  function handleClick(data, index) {
    setCurrentLevel(index);
    const queryFilters = { "phase_id": index + 1 };
      redirect(
        `/projects?filter=${encodeURI(
          JSON.stringify(queryFilters)
        )}&page=1&per_page=10&sort_field=id&sort_order=ASC`
      );
  }

  function getDataBySectors() {
    return getGrouppedData(props.data, false).map((item) => {
      item.name = findSector(item.project_organization);
      return item;
    });
  }

  function findSector(id) {
    const org = lodash.find(
      props.organizations,
      (item) => Number(item.id) === Number(id)
    );
    return org ? org.name : id;
  }

  return (
    <ResponsiveContainer>
      <BarChart
        width={350}
        height={200}
        data={props.data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 40,
        }}
      >
        <XAxis dataKey={props.dimension} />
        <YAxis allowDecimals={false} />
        <Tooltip content={<CustomTooltip />} />

        <Bar dataKey={props.measure} onClick={handleClick}>
          {props.data.map((entry, index) => {
            return (
              <Cell
                key={`cell-${index}`}
                fill={PROJECT_PHASES_COLORS[index + 1]}
              />
            );
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
