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
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";
import { PROJECT_PHASES_COLORS } from "../../../../constants/common";
import lodash from "lodash";

// const CustomizedLabel = (props) => {
//   const { x, y, fill, value } = props;
//   return (
//     <text
//       x={x}
//       y={y}
//       // dy={30}
//       // dx={50}
//       fontSize="18"
//       fontFamily="sans-serif"
//       fontWeight="bold"
//       fill="#000"
//       textAnchor="middle"
//     >
//       {value}
//     </text>
//   );
// };

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

export default function CustomPieChart(props) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [current, setCurrent] = useState({});
  const [drillLevel, setDrillLevel] = useState(null);

  if (!props.data) return null;

  const options = {
    responsive: true,
    legend: {
      position: "bottom",
      labels: {
        boxWidth: 10,
      },
    },
  };

  const groupedSectorData = lodash.groupBy(
    props.data,
    (item) => item.project_organization.parent.id
  );

  const datas = {
    labels: ["test", "test1", "test2"], //lodash.keys(groupedSectorData),
    datasets: [
      {
        data: ["120", "32", "45"], //lodash.keys(groupedSectorData).map(key => groupedSectorData[key].length),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };


  if (!props.data) return null;

  return (
      <Pie
        options={options}
        data={[
            { name: 'Group A', value: 400 },
            { name: 'Group B', value: 300 },
            { name: 'Group C', value: 300 },
            { name: 'Group D', value: 200 },
          ]}
        // onElementsClick={(elems) => {
        //   const curr = lodash.find(
        //     current.children,
        //     (it) => it.name === datas.labels[elems[0]._index]
        //   );
        //   if (curr && !lodash.isEmpty(curr.children)) {
        //     setCurrent(curr);
        //     setDrillLevel(curr.parent_id);
        //   } else {
        //     redirect(
        //       `/projects?filter=${encodeURI(
        //         JSON.stringify({ organization_id: curr.id })
        //       )}&page=1&per_page=10&sort_field=id&sort_order=ASC`
        //     );
        //   }
        // }}
      />
  );
}
