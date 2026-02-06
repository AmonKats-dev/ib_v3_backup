import React from "react";

import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { Button, useDataProvider } from "react-admin";
import { getLevelChain, getLevelChainUg } from "./helpers";
import {
  costSumFormatter,
  costSumFormatterReportBuilder,
} from "../resources/Projects/Report/helpers";
import { checkFeature, useChangeField } from "../../helpers/checkPermission";

var pivot;

function ReportBuilder(props) {
  const changeConfig = useChangeField({ name: "config" }); //TODO refactor builder page
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
          {
            id: "TotalCount",
            label: "Total Count",
            cellTemplate: function (text, row, col) {
              if (text == "0") {
                return 0;
              }
              if (typeof text === "string") {
                const formattedStr = text
                  ? parseFloat(text.replace(/[","]/g, ""))
                  : "";
                return Number(formattedStr).toFixed(0);
              }

              return Number(text).toFixed(0);
            },
          },
          {
            id: "TotalCost",
            label: "Total Cost ($`000)",
            cellTemplate: function (text, row, col) {
              if (typeof text === "number") {
                return costSumFormatterReportBuilder(text, 2, "$");
              }

              const formatted = text
                ? parseFloat(text.replace(/[","]/g, ""))
                : "";
              return costSumFormatterReportBuilder(formatted, 2, "$");
            },
            template: function (text, obj) {
              return "<span>($`000)</span>";
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
          rowsHeadersWidth: "auto",
          readonly: props.isReadOnly,
          footer: true,
          repeatRowsHeaders: true,
          gridMode: "flat",
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
          {
            id: "TotalCount",
            label: "Total Count",
          },
          {
            id: "TotalCost",
            label: "Total Cost",
            cellTemplate: function (text, row, col) {
              const formatted = text
                ? parseFloat(text.replace(/[","]/g, ""))
                : "";
              return costSumFormatterReportBuilder(formatted, 2, "$");
            },
            template: function (text, obj) {
              return '<span class="myCustomClass">' + text + " ($`000)</span>";
            },
          },
          {
            id: "Enpv",
            label: "Enpv",
          },
          {
            id: "Err",
            label: "Err",
          },
          {
            id: "Fnpv",
            label: "Fnpv",
          },
          {
            id: "Irr",
            label: "Irr",
          },
          {
            id: "OmCosts",
            label: "OmCosts",
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
          { id: "Classification", label: "Classification" },
          { id: "NdpType", label: "NDP Type" },
          { id: "StartDate", label: "Start Date" },
          { id: "EndDate", label: "End Date" },
          // {
          //   id: "ImplementingAgencies",
          //   label: "ImplementingAgencies",
          //   cellTemplate: function (text, row, col) {
          //     const formatted = text
          //       ? parseFloat(text.replace(/[","]/g, ""))
          //       : "";
          //     return costSumFormatterReportBuilder(formatted, 2, "$");
          //   },
          // },
        ],
        fields: {
          rows: [],
          columns: [],
          values: [],
        },
        layout: {
          columnsWidth: "auto",
          rowsHeadersWidth: "auto",
          readonly: props.isReadOnly,
          footer: true,
          repeatRowsHeaders: true,
          gridMode: "flat",
        },
        customFormat: function (cellValue, method) {
          if (method === "sum") {
            return costSumFormatter(cellValue);
          }
          return cellValue;
        },
      });

      pivot.grid.data.filter(function (row) {
        return row[pivot.config.fields.rows.length - 1];
      });
    }

    if (pivot) {
      pivot.events.on("Change", function () {
        pivot.grid.data.filter(function (row) {
          return row[pivot.config.fields.rows.length - 1];
        });

        const configFields = pivot.getFields();
        const configFilters = pivot.getFiltersValues();
        changeConfig({ fields: configFields, filters: configFilters });
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

          pivot.setFields({
            rows: [],
            columns: [],
            values: [],
          });
        } else {
          pivot.setFields({
            rows: ["Vote"],
            columns: ["Phase"],
            values: [{ id: "TotalCost", method: "sum" }],
          });

          pivot.setFields({
            rows: [],
            columns: [],
            values: [],
          });
        }
      }

      pivot.setData(data);
    }
  }, [data]);

  return (
    <section className="dhx_sample-container">
      <div
        className="dhx_sample-container__widget"
        id="pivot"
        style={{ height: "100vh" }}
      ></div>
    </section>
  );
}

export default ReportBuilder;
