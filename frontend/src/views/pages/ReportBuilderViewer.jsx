import React from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { useDataProvider } from "react-admin";
import { getLevelChain, getLevelChainUg } from "./helpers";
import { costSumFormatter, costSumFormatterReportBuilder } from "../resources/Projects/Report/helpers";
import { checkFeature } from "../../helpers/checkPermission";

var pivot;

function ReportBuilderViewer(props) {
  const [data, setData] = useState([]);
  const dataProvider = useDataProvider();
  const appConfig = useSelector((state) => state.app.appConfig);

  useEffect(() => {
    dataProvider
      .custom("reports", { type: "pivot", method: "GET" })
      .then((response) => {
        if (checkFeature("has_pimis_fields")) {
          setData(getLevelChain(response.data, appConfig));
        } else {
          setData(getLevelChainUg(response.data, appConfig));
        }
      });

    if (checkFeature("has_pimis_fields")) {
      pivot = new window.dhx.Pivot("pivot", {
        fieldList: [
          { id: "TotalCount", label: "Total Count" },
          {
            id: "TotalCost",
            label: "Total Cost",
            cellTemplate: function (text, row, col) {
              return costSumFormatter(text);
            },
          },
          { id: "Code", label: "Code" },
          { id: "Name", label: "Name" },
          {
            id: "Phase",
            label: "Phase",
            sortDir: "asc",
          },
          { id: "Programs", label: "Programs" },
          { id: "Sub Programs", label: "Sub Programs" },
          { id: "Function", label: "Function" },
          { id: "Sub Function", label: "Sub Function" },
          { id: "Ministry", label: "Ministry" },
          { id: "Status", label: "Status" },
          { id: "Public Body", label: "Public Body" },
        ],
        fields: {
          rows: [],
          columns: [],
          values: [],
        },
        layout: {
          columnsWidth: "auto",
          // gridOnly: true,
          readonly: props.isReadOnly,
          footer: true,
        },
        customFormat: function (cellValue, method) {
          if (method === "sum") {
            return costSumFormatterReportBuilder(cellValue, 2);
          }
          return cellValue;
        },
      });
    } else {
      pivot = new window.dhx.Pivot("pivot", {
        fieldList: [
          { id: "TotalCount", label: "Total Count" },
          {
            id: "TotalCost",
            label: "Total Cost",
            cellTemplate: function (text, row, col) {
              return costSumFormatter(text);
            },
          },
          { id: "Code", label: "Code" },
          { id: "Name", label: "Name" },
          {
            id: "Phase",
            label: "Phase",
            sortDir: "asc",
          },
          { id: "Programs", label: "Programs" },
          { id: "Function", label: "Function" },
          { id: "Vote", label: "Vote" },
          { id: "Status", label: "Status" },
          { id: "Department", label: "Department" },
        ],
        fields: {
          rows: [],
          columns: [],
          values: [],
        },
        layout: {
          columnsWidth: "auto",
          // gridOnly: true,
          readonly: props.isReadOnly,
          footer: true,
        },
        customFormat: function (cellValue, method) {
          if (method === "sum") {
            return costSumFormatter(cellValue);
          }
          return cellValue;
        },
      });
    }
  }, []);

  useEffect(() => {
    if (pivot && data) {
      if (props.initialParams) {
        pivot.setFields({
          ...props.initialParams.fields,
        });
        pivot.setFiltersValues({
          ...props.initialParams.filters,
        });
      } else {
        if (checkFeature("has_pimis_fields")) {
          pivot.setFields({
            rows: ["Ministry"],
            columns: ["Phase"],
            values: [{ id: "TotalCost", method: "sum" }],
          });
        } else {
          pivot.setFields({
            rows: ["Vote"],
            columns: ["Phase"],
            values: [{ id: "TotalCost", method: "sum" }],
          });
        }
      }

      pivot.setData(data);
    }
  }, [data]);

  return (
    <section className="dhx_sample-container" id="custom-report-viewer">
      <div
        className="dhx_sample-container__widget"
        id="pivot"
        style={{ height: "100vh" }}
      ></div>
    </section>
  );
}

export default ReportBuilderViewer;
