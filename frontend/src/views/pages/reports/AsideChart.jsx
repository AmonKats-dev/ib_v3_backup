import React, { Component, useEffect, useState } from "react";
import lodash from "lodash";
import { billionsFormatter } from "../../resources/Projects/Report/helpers";
import { useDataProvider, useTranslate } from "react-admin";
import { PROJECT_PHASES } from "../../../constants/common";
import { calculateCost } from "./helpers";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Typography } from "@material-ui/core";

function AsideChart({ record, ...props }) {
  const [data, setData] = useState({});
  const [isFetching, setIsFetching] = useState(true);
  const dataProvider = useDataProvider();
  const translate = useTranslate();

  useEffect(() => {
    if (record && record.id) {
      dataProvider
        .getListOfAll("project-details", {
          sort_field: "id",
          filter: { project_id: record.id },
        })
        .then((response) => {
          const calculatedCost = response.data.map((item) => {
            const result = {};
            let totalCost = 0;

            item.activities.forEach((activity) => {
              activity.investments.forEach((investment) => {
                totalCost += calculateCost(investment.costs);
              });
            });

            item.outputs.forEach((output) => {
              output.investments.forEach((investment) => {
                totalCost += calculateCost(investment.costs);
              });
            });

            result.totalCost = totalCost;
            result.phase_id = item.phase_id;
            return result;
          });
          const grouppedData = lodash.groupBy(calculatedCost, "phase_id");
          const dataSet = lodash.keys(PROJECT_PHASES).map((phase_id) => ({
            name: translate(`resources.phases.phase_${phase_id}`),
            cost: grouppedData[phase_id]
              ? lodash.first(grouppedData[phase_id]).totalCost
              : 0,
          }));

          setData(dataSet);
          setIsFetching(false);
        });
    }
  }, [record]);

  return (
    <div
      style={{
        width: "100%",
        minWidth: "960px",
        height: "250px",
      }}
    >
      <Typography variant="h2">
        {`${(record && record.name) || "-"} (${translate("titles.currency")})`}
      </Typography>
      {isFetching ? (
        <Typography variant="h5">Data is Loading, please wait...</Typography>
      ) : (
        !lodash.isEmpty(data) && (
          <ResponsiveContainer>
            <BarChart
              height={250}
              data={data}
              margin={{
                top: 35,
                right: 30,
                left: 35,
                bottom: 25,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cost" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )
      )}
    </div>
  );
}
// }

export default AsideChart;
