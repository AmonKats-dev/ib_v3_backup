// import React, { useMemo, useState } from "react";
// import { useEffect } from "react";
// import { useSelector } from "react-redux";
// import moment from "moment";
// import lodash, { concat, find } from "lodash";
// import { romanize } from "../../../helpers/formatters";
// import { billionsFormatter } from "../../resources/Projects/Report/helpers";
// import { useHistory } from "react-router-dom";
// import { gantt, Gantt } from "dhtmlx-gantt";
// import { useTranslate } from "react-admin";
// import { checkFeature } from "../../../helpers/checkPermission";

// const ganttChart = Gantt.getGanttInstance();

// function getActivitiesForOutput(record, outputId) {
//   return record.activities.filter((activity) =>
//     activity.output_ids.includes(outputId)
//   );
// }

// function GanttChartView(props) {
//   const [chartData, setChartData] = useState(null);
//   let history = useHistory();
//   const translate = useTranslate();

//   useEffect(() => {
//     const startDateYear = moment(props.record.start_date);
//     const endDateYear = moment(props.record.end_date);
//     const dateDiff = endDateYear.diff(startDateYear, "years") + 1;

//     if (props && props.record) {
//       const dataProject = {
//         id: props.record.project_id,
//         name: props.record?.project?.name || "Project",
//         project: {
//           id: props.record.project_id,
//           text: props.record?.project?.name || "Project",
//           parent: null,
//           start_date: moment(props.record.start_date).format("YYYY"),
//           duration: dateDiff === 0 ? 1 : dateDiff,
//           open: true,
//           type: ganttChart.config.types.task,
//         },
//         components: props.record?.components?.map((component) => {
//           let totalCost = 0;
//           const component_new = {};
//           component_new.hideResources = true;
//           component_new.text = component.name;
//           component_new.parent = props.record.project_id; //props.project.id;
//           component_new.id = 10000 + component.id;
//           component_new.total_cost = totalCost;
//           component_new.owner = [];
//           component_new.open = true;
//           component_new.type = ganttChart.config.types.project;
//           component_new.subcomponents = component.subcomponents;

//           return component_new;
//         }),
//         subcomponents: concat(
//           ...props.record?.components?.map((component) => {
//             return component?.subcomponents?.map((subcomponent) => {
//               const subcomponent_new = {};
//               subcomponent_new.hideResources = true;
//               subcomponent_new.text = subcomponent.name;
//               subcomponent_new.parent = 10000 + component.id;
//               subcomponent_new.id = 10000 + subcomponent.id;
//               subcomponent_new.type = ganttChart.config.types.project;

//               return subcomponent_new;
//             }) || [];
//           })
//         ),
//         outputs: props.record.outputs?.map((output) => {
//           let totalCost = 0;
//           const activitiesForMe = getActivitiesForOutput(
//             props.record,
//             output.id
//           );
//           activitiesForMe &&
//             activitiesForMe.forEach((item) => {
//               lodash.sumBy(item.investments, (invest) =>
//                 lodash.keys(invest.costs).forEach((key) => {
//                   totalCost += Number(invest.costs[key]);
//                 })
//               );
//             });

//           const newOutput = {};
//           newOutput.text = output.name;
//           newOutput.open = true;
//           newOutput.id = 1000 + output.id;
//           newOutput.totalCost = totalCost;
//           newOutput.parent = 10000 + output.subcomponent_id;
//           newOutput.parent = output.subcomponent_id
//             ? 10000 + output.subcomponent_id
//             : 10000 + output.component_id;
//           newOutput.type = ganttChart.config.types.project;

//           return newOutput;
//         }),
//         activities: props.record?.activities?.map((item) => {
//           let totalCost = 0;

//           lodash.sumBy(item.investments, (invest) =>
//             lodash.keys(invest.costs).forEach((key) => {
//               totalCost += Number(invest.costs[key]);
//             })
//           );

//           const output = find(
//             props.project?.current_project_detail?.outputs,
//             (it) => Number(it.id) === Number(item.output_ids[0])
//           );

//           const startDateYear = moment(item.start_date);
//           const endDateYear = moment(item.end_date);
//           const dateDiff = endDateYear.diff(startDateYear, "years");
//           const newActivity = {};

//           newActivity.has_subcomponent = Boolean(output?.subcomponent_id);
//           newActivity.text = item.name;
//           newActivity.parent = 1000 + item.output_ids[0];
//           newActivity.start_date = moment(item.start_date).format("YYYY");
//           newActivity.duration = dateDiff === 0 ? 1 : dateDiff + 1;
//           newActivity.totalCost = totalCost;
//           newActivity.type = ganttChart.config.types.task;

//           return newActivity;
//         }),
//       };
//       dataProject.project.totalCost = lodash.sumBy(
//         dataProject.outputs,
//         "totalCost"
//       );
//       setChartData(dataProject);
//     }
//   }, [props]);

//   useEffect(() => {
//     if (chartData && chartData.activities?.length > 0) {
//       ganttChart.clearAll();
//       ganttChart.parse({
//         data: [
//           chartData.project,
//           ...chartData.components,
//           ...chartData.subcomponents,
//           ...chartData.outputs,
//           ...chartData.activities,
//         ],
//       });
//       ganttChart.refreshData();
//       ganttChart.templates.task_row_class = function (start, end, task) {
//         if (task.id === props.record.project_id) {
//           return "highlighted_row";
//         }
//         return "";
//       };
//       ganttChart.templates.grid_row_class = function (start, end, task) {
//         if (task.id === props.record.project_id) {
//           return "highlighted_row";
//         }
//         return "";
//       };
//     }
//   }, [chartData]);

//   useEffect(() => {
//     ganttChart.config.columns = [
//       {
//         name: "text",
//         label: checkFeature("has_pimis_fields")
//           ? "Project / Component / SubComponent / Output/Activity"
//           : "Project / Outputs / Activities",
//         tree: true,
//         width: 500,
//         resize: true,
//       },
//       // {
//       //   name: "start_date",
//       //   align: "center",
//       //   label: "Start Date",
//       // },
//       // {
//       //   name: "duration",
//       //   align: "center",
//       // },
//       // {
//       //   name: "add",
//       // },
//     ];

//     var secondGridColumns = {
//       columns: [
//         {
//           align: "center",
//           fontWeight: "bold",
//           name: "total_cost",
//           width: 100,
//           label: `Total Cost (${translate("titles.currency")})`,
//           template: function (task) {
//             return billionsFormatter(task.totalCost);
//           },
//         },
//       ],
//     };

//     ganttChart.config.layout = {
//       css: "gantt_container",
//       rows: [
//         {
//           cols: [
//             { view: "grid", width: 320, scrollY: "scrollVer" },
//             { resizer: true, width: 1 },
//             { view: "timeline", scrollX: "scrollHor", scrollY: "scrollVer" },
//             { resizer: true, width: 1 },
//             {
//               view: "grid",
//               width: 140,
//               bind: "task",
//               scrollY: "scrollVer",
//               config: secondGridColumns,
//             },
//             { view: "scrollbar", id: "scrollVer" },
//           ],
//         },
//         { view: "scrollbar", id: "scrollHor", height: 20 },
//       ],
//     };

//     ganttChart.config.scale_unit = "year";
//     ganttChart.config.step = 1;
//     ganttChart.config.date_scale = "%Y";
//     ganttChart.config.min_column_width = 33;
//     ganttChart.config.duration_unit = "year";
//     ganttChart.config.duration_step = 1;
//     ganttChart.config.scale_height = 70;
//     // ganttChart.config.time_step = 15;
//     ganttChart.config.readonly = true;
//     ganttChart.config.round_dnd_dates = false;
//     ganttChart.config.date_format = "%Y";

//     ganttChart.templates.task_text = function () {
//       return "";
//     };

//     // ganttChart.init("gantt_here");
//     // localStorage.setItem('ganttChartInit', "project");
//   }, []);

//   useEffect(() => {
//     if (
//       localStorage.getItem("ganttChartInit") &&
//       localStorage.getItem("ganttChartInit") !== "project"
//     ) {
//       localStorage.removeItem("ganttChartInit");
//       history.go(0);
//     }
//     ganttChart.init("gantt_here");
//     localStorage.setItem("ganttChartInit", "project");

//     return () => {
//       localStorage.setItem("ganttChartInit", "project");
//     };
//   }, []);

//   if (
//     localStorage.getItem("ganttChartInit") &&
//     localStorage.getItem("ganttChartInit") !== "project"
//   ) {
//     return null;
//   }

//   return (
//     <div className="landscapeSection gantt_container">
//       <div className="content-area">
//         <h2>{romanize(props.counter)}. Gantt Chart</h2>
//         <div style={{ width: "100%", height: "550px" }}>
//           <div id="gantt_here" style={{ width: "100%", height: "100%" }}></div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default GanttChartView;
