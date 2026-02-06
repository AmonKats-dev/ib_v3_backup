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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#fff",
          border: "1px solid #ccc",
          padding: "0px 15px",
        }}
      >
        <p style={{ marginBottom: 2 }}>{`${label}`}</p>
        <p style={{ fontWeight: "bold" }}>
          {billionsFormatter(parseFloat(payload[0].value))}
        </p>
      </div>
    );
  }

  return null;
};

function getGroupedData(data, isCosts, currentLevel, dimension, items) {
  let filtered = data
    .filter((item) => (isCosts ? !lodash.isEmpty(item.costs) : true))
    .filter((item) => !lodash.isEmpty(item[dimension]))
    .filter((item) => currentLevel ? true : !lodash.isEmpty(item[dimension].parent))

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
  
  if (currentLevel) {
    filtered = filtered.filter((item) =>
      item[dimension] && item[dimension].parent
        ? item[dimension].parent.id === currentLevel
        : false
    );
  }
  
  const grouped = lodash.groupBy(filtered, (item) => {
    return currentLevel
      ? item[dimension].name
      : item[dimension].parent && item[dimension].parent.name;
  });

  return lodash.keys(grouped).map((item) => ({
    [dimension]: item,
    name: item,
    count: grouped[item].length,
    cost: lodash.sumBy(grouped[item], (it) => Number(it.cost)),
    id:
      lodash.find(items, (org) => org.name === item) &&
      lodash.find(items, (org) => org.name === item).id,
  }));
}

export default function BarChartDrill(props) {
  const [currentLevel, setCurrentLevel] = useState();
  const redirect = useRedirect();

  if (!props.data) return null;

  function handleClick(data, index) {
    if (currentLevel) {
      setCurrentLevel(null);
      const queryFilters = { [props.field]: data.id };
      if (props.onGoingProjects) {
        queryFilters.project_status = "ONGOING";
      }
      redirect(
        `/projects?filter=${encodeURI(
          JSON.stringify(queryFilters)
        )}&page=1&per_page=10&sort_field=id&sort_order=ASC`
      );
    } else {
      setCurrentLevel(data.id);
    }
  }

  function getDataByPrograms() {
    return getGroupedData(
      props.data,
      true,
      currentLevel,
      props.dimension,
      props.items
    );
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
          left: 40,
          bottom: 40,
        }}
      >
        <XAxis dataKey={"name"} />
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
          {getDataByPrograms().map((entry, index) => (
            <Cell key={`cell-${index}`} fill={PROJECT_PHASES_COLORS[2]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
