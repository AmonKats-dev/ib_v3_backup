// import "./resources.css";
// import React, { useRef, useState } from "react";

// import { Button } from "@material-ui/core";
// import { billionsFormatter } from "../../resources/Projects/Report/helpers";
// import { useDataProvider } from "react-admin";
// import { useEffect } from "react";
// import lodash from "lodash";
// import moment from "moment";
// import { useHistory } from "react-router-dom";

// //projectBased
// // let toggleGroups;
// var overlayControl;
// var lineOverlay;

// const UNASSIGNED_ID = 15;
// const WORK_DAY = 8;
// let SHOW_BASE_LINE = false;
// let VIEW_TYPE = "PROJECTS";
// let CRITICAL_PATH = "SHOW";
// var SHOW_SLACK = false;
// let BASELINE = "BASELINE";

// /* show slack */
// function renderSlack() {
//   window.gantt.addTaskLayer(function addSlack(task) {
//     if (!window.gantt.config.show_slack) {
//       return null;
//     }

//     var slack = window.gantt.getFreeSlack(task);

//     if (!slack) {
//       return null;
//     }

//     var state = window.gantt.getState().drag_mode;

//     if (state == "resize" || state == "move") {
//       return null;
//     }

//     var slackStart = new Date(task.end_date);
//     var slackEnd = window.gantt.calculateEndDate(slackStart, slack);
//     var sizes = window.gantt.getTaskPosition(task, slackStart, slackEnd);
//     var el = document.createElement("div");

//     el.className = "slack";
//     el.style.left = sizes.left + "px";
//     el.style.top = sizes.top + (SHOW_BASE_LINE ? 0 : 2) + "px";
//     el.style.width = sizes.width + "px";
//     el.style.height = sizes.height + "px";

//     return el;
//   });
// }
// /* end show slack */

// var humanResources = [
//   {
//     id: 1,
//     text: "Senior Procurement Specialist",
//     parent: null,
//   },
//   {
//     id: 2,
//     text: "Procurement Specialist",
//     parent: null,
//   },
//   {
//     id: 3,
//     text: "Project Manager",
//     parent: null,
//   },
//   {
//     id: 4,
//     text: "Senior Engineer",
//     parent: null,
//   },
//   {
//     id: 5,
//     text: "Engineer",
//     parent: null,
//   },
//   {
//     id: 6,
//     text: "Surveyor",
//     parent: null,
//   },
//   {
//     id: 7,
//     text: "Cost Estimator",
//     parent: null,
//   },
//   {
//     id: 8,
//     text: "Works Supervisor",
//     parent: null,
//   },
//   {
//     id: 9,
//     text: "Technical Advisor",
//     parent: null,
//   },
//   {
//     id: 10,
//     text: "Special Advisor",
//     parent: null,
//   },
//   {
//     id: 11,
//     text: "System Architect",
//     parent: null,
//   },
//   {
//     id: 12,
//     text: "Data Analyst",
//     parent: null,
//   },
//   {
//     id: 13,
//     text: "Licensed Training Provider",
//     parent: null,
//   },
//   { id: 14, text: "Other", parent: null },
//   { id: 15, text: "Unassigned", parent: 14, default: true },
// ];

// function toggleSlack(toggle) {
//   if (!SHOW_SLACK) {
//     SHOW_SLACK = true;
//     window.gantt.config.show_slack = true;
//   } else {
//     SHOW_SLACK = false;
//     window.gantt.config.show_slack = false;
//   }
//   renderSlack();
//   window.gantt.render();
// }

// function updateCriticalPath(toggle) {
//   toggle.enabled = !toggle.enabled;
//   if (toggle.enabled) {
//     window.gantt.config.highlight_critical_path = true;
//   } else {
//     window.gantt.config.highlight_critical_path = false;
//   }
//   window.gantt.render();
// }

// function toggleGroups(input) {
//   window.gantt.$groupMode = !window.gantt.$groupMode;
//   if (window.gantt.$groupMode) {
//     // input.value = "show gantt view";

//     var groups = window.gantt.$resourcesStore.getItems().map(function (item) {
//       var group = window.gantt.copy(item);
//       group.group_id = group.id;
//       group.id = window.gantt.uid();
//       return group;
//     });

//     window.gantt.groupBy({
//       groups: groups,
//       relation_property: window.gantt.config.resource_property,
//       group_id: "group_id",
//       group_text: "text",
//       delimiter: ", ",
//       default_group_label: "Not Assigned",
//       set_relation_value: function (groupIds) {
//         if (groupIds) {
//           var resources = [];
//           groupIds.map(function (id) {
//             resources.push({ resource_id: id, value: WORK_DAY });
//           });
//           return resources;
//         }
//       },
//     });
//   } else {
//     // input.value = "show resource view";
//     window.gantt.groupBy(false);
//   }
// }

// function renderBaselines() {
//   var baseline_progress_drag = false;
//   window.gantt.templates.task_class = function (start, end, task) {
//     if (task.planned_end && SHOW_BASE_LINE) {
//       var classes = ["has-baseline"];
//       if (end.getTime() > task.planned_end.getTime()) {
//         classes.push("overdue");
//       }
//       return classes.join(" ");
//     }
//   };

//   const layer_id = window.gantt.addTaskLayer(function draw_planned(task) {
//     if (!SHOW_BASE_LINE) return;
//     if (task.planned_start && task.planned_end) {
//       if (!task.baseline_progress) task.baseline_progress = 0;
//       var sizes = window.gantt.getTaskPosition(
//         task,
//         task.planned_start,
//         task.planned_end
//       );
//       var el = document.createElement("div");
//       el.className = "baseline";
//       el.style.left = sizes.left + "px";
//       el.style.width = sizes.width + "px";
//       el.style.top = sizes.top + window.gantt.config.task_height + 13 + "px";

//       // adding progressbar
//       var progress = document.createElement("div");
//       progress.className = "baseline_progressbar";
//       progress.style.left = sizes.left + "px";
//       progress.style.width = task.baseline_progress;
//       progress.style.top =
//         sizes.top + window.gantt.config.task_height + 13 + "px";
//       el.appendChild(progress);

//       //adding progressbar drag
//       var progress_drag = document.createElement("div");
//       progress_drag.className = "baseline_progress_drag";
//       progress_drag.style.left = task.baseline_progress;
//       progress_drag.style.width = "4px";
//       progress.appendChild(progress_drag);
//       progress_drag.onmousedown = function () {
//         baseline_progress_drag = true;
//       };
//       el.onmousemove = function (e) {
//         if (
//           baseline_progress_drag &&
//           e.target.className != "baseline_progress_drag"
//         ) {
//           task.baseline_progress = e.layerX;
//           window.gantt.refreshTask(task.id);
//         }
//       };
//       return el;
//     }
//     return false;
//   });

//   if (!SHOW_BASE_LINE) {
//     window.gantt.removeTaskLayer(layer_id);
//   }
// }

// function toggleBaselines(toggle) {
//   toggle.enabled = !toggle.enabled;
//   if (toggle.enabled) {
//     SHOW_BASE_LINE = true;
//     window.gantt.config.task_height = 20;
//     window.gantt.config.row_height = 40;
//     renderBaselines();
//   } else {
//     SHOW_BASE_LINE = false;
//     window.gantt.config.task_height = 35;
//     window.gantt.config.row_height = 40;
//     renderBaselines();
//   }

//   window.gantt.render();
// }

// function toggleProgressLine() {
//   if (overlayControl.isOverlayVisible(lineOverlay)) {
//     window.gantt.config.readonly = false;
//     overlayControl.hideOverlay(lineOverlay);
//     window.gantt.$root.classList.remove("overlay_visible");
//   } else {
//     window.gantt.config.readonly = true;
//     overlayControl.showOverlay(lineOverlay);
//     window.gantt.$root.classList.add("overlay_visible");
//   }
// }

// function enableFastTracking() {
//   window.gantt.config.auto_scheduling = true;
//   window.gantt.config.auto_scheduling_strict = true;
//   window.gantt.config.auto_scheduling_compatibility = true;

//   window.gantt.autoSchedule();
// }

// function ProjectResourcesManagmentForm(props) {
//   const [ganttData, setGanttData] = useState({});
//   const [showSlack, setShowSlack] = useState(false);
//   const [criticalPath, setCriticalPath] = useState(false);
//   const [projectView, setProjectView] = useState(false);
//   const [showBaseline, setShowBaseline] = useState(false);
//   const [showProgress, setShowProgress] = useState(false);
//   let history = useHistory();

//   useEffect(() => {
//   //   if (
//   //     localStorage.getItem("ganttChartInit") &&
//   //     localStorage.getItem("ganttChartInit") !== "project_manag"
//   //   ) {
//   //     localStorage.removeItem("ganttChartInit");
//   //     history.go(0);
//   //   }
//   //   // window.gantt.init('gantt_here');
//   //   localStorage.setItem("ganttChartInit", "project_manag");

//   //   return () => {
//   //     localStorage.setItem("ganttChartInit", "project_manag");
//   //   };
//   }, []);

//   useEffect(() => {
//     window.gantt.plugins({
//       grouping: true,
//       auto_scheduling: true,
//       critical_path: true,
//       overlay: true,
//       marker: true,
//     });

//     overlayControl = window.gantt.ext.overlay;
//     //progress-line

//     function getChartScaleRange() {
//       var tasksRange = window.gantt.getSubtaskDates();
//       var cells = [];
//       var scale = window.gantt.getScale();
//       if (!tasksRange.start_date) {
//         return scale.trace_x;
//       }

//       scale.trace_x.forEach(function (date) {
//         if (date >= tasksRange.start_date && date <= tasksRange.end_date) {
//           cells.push(date);
//         }
//       });
//       return cells;
//     }

//     function getProgressLine() {
//       var tasks = window.gantt.getTaskByTime();
//       var scale = window.gantt.getScale();
//       var step = scale.unit;

//       var timegrid = {};

//       var totalDuration = 0;

//       window.gantt.eachTask(function (task) {
//         if (window.gantt.isSummaryTask(task)) {
//           return;
//         }
//         if (!task.duration) {
//           return;
//         }

//         var currDate = window.gantt.date[scale.unit + "_start"](
//           new Date(task.start_date)
//         );
//         while (currDate < task.end_date) {
//           var date = currDate;
//           currDate = window.gantt.date.add(currDate, 1, step);

//           if (
//             !window.gantt.isWorkTime({ date: date, task: task, unit: step })
//           ) {
//             continue;
//           }

//           var timestamp = currDate.valueOf();
//           if (!timegrid[timestamp]) {
//             timegrid[timestamp] = {
//               planned: 0,
//               real: 0,
//             };
//           }

//           timegrid[timestamp].planned += 1;
//           if (date <= today) {
//             timegrid[timestamp].real += 1 * (task.progress || 0);
//           }

//           totalDuration += 1;
//         }
//       });

//       var cumulativePlannedDurations = [];
//       var cumulativeRealDurations = [];
//       var cumulativePredictedDurations = [];
//       var totalPlanned = 0;
//       var totalReal = 0;

//       var chartScale = getChartScaleRange();
//       var dailyRealProgress = -1;
//       var totalPredictedProgress = 0;

//       for (var i = 0; i < chartScale.length; i++) {
//         var start = new Date(chartScale[i]);
//         var end = window.gantt.date.add(start, 1, step);
//         var cell = timegrid[start.valueOf()] || { planned: 0, real: 0 };
//         totalPlanned = cell.planned + totalPlanned;

//         cumulativePlannedDurations.push(totalPlanned);
//         if (start <= today) {
//           totalReal = (cell.real || 0) + totalReal;
//           cumulativeRealDurations.push(totalReal);
//           cumulativePredictedDurations.push(null);
//         } else {
//           if (dailyRealProgress < 0) {
//             dailyRealProgress = totalReal / cumulativeRealDurations.length;
//             totalPredictedProgress = totalReal;
//             cumulativePredictedDurations.pop();
//             cumulativePredictedDurations.push(totalPredictedProgress);
//           }
//           totalPredictedProgress += dailyRealProgress;
//           cumulativePredictedDurations.push(totalPredictedProgress);
//         }
//       }

//       for (var i = 0; i < cumulativePlannedDurations.length; i++) {
//         cumulativePlannedDurations[i] = Math.round(
//           (cumulativePlannedDurations[i] / totalPlanned) * 100
//         );
//         if (cumulativeRealDurations[i] !== undefined) {
//           cumulativeRealDurations[i] = Math.round(
//             (cumulativeRealDurations[i] / totalPlanned) * 100
//           );
//         }

//         if (cumulativePredictedDurations[i] !== null) {
//           cumulativePredictedDurations[i] = Math.round(
//             (cumulativePredictedDurations[i] / totalPlanned) * 100
//           );
//         }
//       }

//       return {
//         planned: cumulativePlannedDurations,
//         real: cumulativeRealDurations,
//         predicted: cumulativePredictedDurations,
//       };
//     }

//     var dateToStr = window.gantt.date.date_to_str("%F %j, %Y");
//     var today = new Date();
//     window.gantt.addMarker({
//       start_date: today,
//       css: "today",
//       text: "Today",
//       title: "Today: " + dateToStr(today),
//     });
//     // var dataRange = window.gantt.getSubtaskDates();
//     // window.gantt.addMarker({
//     //   start_date: dataRange.end_date,
//     //   text: 'Project end',
//     //   title: 'Project end: ' + dateToStr(dataRange.end_date),
//     // });
//     // window.gantt.addMarker({
//     //   start_date: dataRange.start_date,
//     //   text: 'Project start',
//     //   title: 'Project Start: ' + dateToStr(dataRange.start_date),
//     // });

//     function getScalePaddings() {
//       var scale = window.gantt.getScale();
//       var dataRange = window.gantt.getSubtaskDates();

//       var chartScale = getChartScaleRange();
//       var newWidth = scale.col_width;
//       var padding = {
//         left: 0,
//         right: 0,
//       };

//       if (dataRange.start_date) {
//         var yScaleLabelsWidth = 48;
//         // fine tune values in order to align chart with the scale range
//         padding.left =
//           window.gantt.posFromDate(dataRange.start_date) - yScaleLabelsWidth;
//         padding.right =
//           scale.full_width -
//           window.gantt.posFromDate(dataRange.end_date) -
//           yScaleLabelsWidth;
//         padding.top = window.gantt.config.row_height - 12;
//         padding.bottom = window.gantt.config.row_height - 12;
//       }
//       return padding;
//     }

//     var myChart;
//     lineOverlay = overlayControl.addOverlay(function (container) {
//       var scaleLabels = [];

//       var chartScale = getChartScaleRange();

//       chartScale.forEach(function (date) {
//         scaleLabels.push(dateToStr(date));
//       });

//       var values = getProgressLine();

//       var canvas = document.createElement("canvas");
//       const dataArea = document.querySelector("div.gantt_overlay_area");
//       dataArea.appendChild(canvas);
//       canvas.style.height = container.offsetHeight + "px";
//       canvas.style.width = container.offsetWidth + "px";

//       var ctx = canvas.getContext("2d");

//       if (myChart) {
//         myChart.destroy();
//       }

//       myChart = new window.Chart(ctx, {
//         type: "line",
//         data: {
//           datasets: [
//             {
//               label: "Planned progress",
//               backgroundColor: "#001eff",
//               borderColor: "#001eff",
//               data: values.planned,
//               fill: false,
//               cubicInterpolationMode: "monotone",
//             },
//             {
//               label: "Real progress",
//               backgroundColor: "#ff5454",
//               borderColor: "#ff5454",
//               data: values.real,
//               fill: false,
//               cubicInterpolationMode: "monotone",
//             },
//             {
//               label: "Real progress (predicted)",
//               backgroundColor: "#ff5454",
//               borderColor: "#ff5454",
//               data: values.predicted,
//               borderDash: [5, 10],
//               fill: false,
//               cubicInterpolationMode: "monotone",
//             },
//           ],
//         },
//         options: {
//           responsive: true,
//           maintainAspectRatio: false,
//           layout: {
//             padding: getScalePaddings(),
//           },
//           onResize: function (chart, newSize) {
//             var dataRange = window.gantt.getSubtaskDates();
//             if (dataRange.start_date) {
//               // align chart with the scale range
//               chart.options.layout.padding = getScalePaddings();
//             }
//           },
//           legend: {
//             display: false,
//           },
//           tooltips: {
//             mode: "index",
//             intersect: false,
//             callbacks: {
//               label: function (tooltipItem, data) {
//                 var dataset = data.datasets[tooltipItem.datasetIndex];
//                 return (
//                   dataset.label + ": " + dataset.data[tooltipItem.index] + "%"
//                 );
//               },
//             },
//           },
//           hover: {
//             mode: "nearest",
//             intersect: true,
//           },
//           scales: {
//             xAxes: [
//               {
//                 labels: scaleLabels,
//                 gridLines: {
//                   display: false,
//                 },
//                 ticks: {
//                   display: false,
//                 },
//               },
//               {
//                 position: "top",
//                 labels: scaleLabels,
//                 gridLines: {
//                   display: false,
//                 },
//                 ticks: {
//                   display: false,
//                 },
//               },
//             ],
//             yAxes: [
//               {
//                 display: true,
//                 gridLines: {
//                   display: false,
//                 },
//                 ticks: {
//                   display: true,
//                   min: 0,
//                   max: 100,
//                   stepSize: 10,
//                   callback: function (current) {
//                     if (current > 100) {
//                       return "";
//                     }
//                     return current + "%";
//                   },
//                 },
//               },
//               {
//                 display: true,
//                 position: "right",
//                 gridLines: {
//                   display: false,
//                 },
//                 ticks: {
//                   display: true,
//                   min: 0,
//                   max: 100,
//                   stepSize: 10,
//                   callback: function (current) {
//                     if (current > 100) {
//                       return "";
//                     }
//                     return current + "%";
//                   },
//                 },
//               },
//             ],
//           },
//         },
//       });
//       return canvas;
//     });

//     //=============

//     function shouldHighlightTask(task) {
//       var store = window.gantt.$resourcesStore;
//       var taskResource = task[window.gantt.config.resource_property],
//         selectedResource = store.getSelectedId();
//       if (
//         taskResource == selectedResource ||
//         store.isChildOf(taskResource, selectedResource)
//       ) {
//         return true;
//       }
//     }

//     window.gantt.templates.grid_row_class = function (start, end, task) {
//       var css = [];
//       if (window.gantt.hasChild(task.id)) {
//         css.push("folder_row");
//       }

//       if (task.$virtual) {
//         css.push("group_row");
//       }

//       if (shouldHighlightTask(task)) {
//         css.push("highlighted_resource");
//       }

//       if (task.parent) {
//         css.push("nested_task");
//       }

//       return css.join(" ");
//     };

//     window.gantt.templates.task_row_class = function (start, end, task) {
//       if (shouldHighlightTask(task)) {
//         return "highlighted_resource";
//       }
//       return "";
//     };

//     window.gantt.templates.timeline_cell_class = function (task, date) {
//       if (!window.gantt.isWorkTime({ date: date, task: task }))
//         return "week_end";
//       return "";
//     };

//     function getAllocatedValue(tasks, resource) {
//       var result = 0;
//       tasks.forEach(function (item) {
//         var assignments = window.gantt.getResourceAssignments(
//           resource.id,
//           item.id
//         );
//         assignments.forEach(function (assignment) {
//           result += Number(assignment.value);
//         });
//       });
//       return result;
//     }
//     var cap = {};

//     function getCapacity(date, resource) {
//       /* it is sample function your could to define your own function for get Capability of resources in day */
//       // 1st level - resource groups
//       // 2nd level - resources
//       // 3rd level - assigned tasks
//       if (resource.$level !== 1) {
//         return -1;
//       }
//       return Number(resource.capacity) || 0;
//     }

//     window.gantt.templates.histogram_cell_class = function (
//       start_date,
//       end_date,
//       resource,
//       tasks
//     ) {
//       if (resource.$level === 1) {
//         if (
//           getAllocatedValue(tasks, resource) > getCapacity(start_date, resource)
//         ) {
//           return "column_overload";
//         }
//       } else if (resource.$level === 2) {
//         return "resource_task_cell";
//       }
//     };

//     window.gantt.templates.histogram_cell_label = function (
//       start_date,
//       end_date,
//       resource,
//       tasks
//     ) {
//       if (tasks.length && resource.$level === 1) {
//         return (
//           getAllocatedValue(tasks, resource) +
//           "/" +
//           getCapacity(start_date, resource)
//         );
//       } else if (resource.$level === 0) {
//         return "";
//       } else if (resource.$level === 2) {
//         if (
//           window.gantt.isWorkTime({
//             date: start_date,
//             task: window.gantt.getTask(resource.$task_id),
//           })
//         ) {
//           if (
//             start_date.valueOf() < resource.end_date.valueOf() &&
//             end_date.valueOf() > resource.start_date.valueOf()
//           ) {
//             var assignment = window.gantt.getResourceAssignments(
//               resource.$resource_id,
//               resource.$task_id
//             )[0];
//             return assignment.value;
//           } else {
//             return "&ndash;";
//           }
//         }
//       }
//       return "&ndash;";
//     };
//     window.gantt.templates.histogram_cell_allocated = function (
//       start_date,
//       end_date,
//       resource,
//       tasks
//     ) {
//       return getAllocatedValue(tasks, resource);
//     };

//     window.gantt.templates.histogram_cell_capacity = function (
//       start_date,
//       end_date,
//       resource,
//       tasks
//     ) {
//       if (!window.gantt.isWorkTime(start_date)) {
//         return 0;
//       }
//       return getCapacity(start_date, resource);
//     };

//     function shouldHighlightResource(resource) {
//       var selectedTaskId = window.gantt.getState().selected_task;
//       if (window.gantt.isTaskExists(selectedTaskId)) {
//         var selectedTask = window.gantt.getTask(selectedTaskId),
//           selectedResource =
//             selectedTask[window.gantt.config.resource_property];

//         if (resource.id == selectedResource) {
//           return true;
//         } else if (
//           window.gantt.$resourcesStore.isChildOf(selectedResource, resource.id)
//         ) {
//           return true;
//         }
//       }
//       return false;
//     }

//     var resourceTemplates = {
//       grid_row_class: function (start, end, resource) {
//         var css = [];
//         if (resource.$level === 0) {
//           css.push("folder_row");
//           css.push("group_row");
//         }
//         if (shouldHighlightResource(resource)) {
//           css.push("highlighted_resource");
//         }
//         return css.join(" ");
//       },
//       task_row_class: function (start, end, resource) {
//         var css = [];
//         if (shouldHighlightResource(resource)) {
//           css.push("highlighted_resource");
//         }
//         if (resource.$level === 0) {
//           css.push("group_row");
//         }

//         return css.join(" ");
//       },
//     };

//     //   gantt.config.lightbox.sections = [
//     //     {name:"description", height:38, map_to:"text", type:"textarea", focus:true},
//     //     {name:"time",type:"duration",map_to:"auto",time_format:["%d","%m","%Y","%H:%i"]}
//     // ];
//     window.gantt.locale.labels.baseline_enable_button = "Set";
//     window.gantt.locale.labels.baseline_disable_button = "Remove";
//     window.gantt.locale.labels.section_owner = "Owner";
//     window.gantt.config.lightbox.sections = [
//       {
//         name: "description",
//         height: 38,
//         map_to: "text",
//         type: "textarea",
//         focus: true,
//       },
//       {
//         name: "cost",
//         height: 24,
//         map_to: "total_cost",
//         type: "textarea",
//         focus: true,
//         label: "Cost",
//       },
//       {
//         name: "owner",
//         type: "resources",
//         map_to: "owner",
//         options: window.gantt.serverList("people"),
//         default_value: WORK_DAY,
//         unassigned_value: UNASSIGNED_ID,
//       },
//       { name: "time", type: "duration", map_to: "auto" },

//       {
//         name: "baseline",
//         map_to: { start_date: "planned_start", end_date: "planned_end" },
//         button: true,
//         type: "duration_optional",
//       },
//       {
//         name: "progress",
//         height: 24,
//         map_to: "progress",
//         type: "select",
//         options: [
//           { key: "0", label: "Not started" },
//           { key: "0.1", label: "10%" },
//           { key: "0.2", label: "20%" },
//           { key: "0.3", label: "30%" },
//           { key: "0.4", label: "40%" },
//           { key: "0.5", label: "50%" },
//           { key: "0.6", label: "60%" },
//           { key: "0.7", label: "70%" },
//           { key: "0.8", label: "80%" },
//           { key: "0.9", label: "90%" },
//           { key: "1", label: "Complete" },
//         ],
//       },
//     ];
//     window.gantt.locale.labels.section_baseline = "Planned";
//     window.gantt.locale.labels.section_cost = "Cost";
//     window.gantt.locale.labels.section_progress = "Progress";

//     window.gantt.config.resource_render_empty_cells = true;
//     window.gantt.config.task_height = 35;
//     window.gantt.config.row_height = 40;

//     function getResourceAssignments(resourceId) {
//       var assignments;
//       var store = window.gantt.getDatastore(window.gantt.config.resource_store);
//       var resource = store.getItem(resourceId);

//       if (resource.$level === 0) {
//         assignments = [];
//         store.getChildren(resourceId).forEach(function (childId) {
//           assignments = assignments.concat(
//             window.gantt.getResourceAssignments(childId)
//           );
//         });
//       } else if (resource.$level === 1) {
//         assignments = window.gantt.getResourceAssignments(resourceId);
//       } else {
//         assignments = window.gantt.getResourceAssignments(
//           resource.$resource_id,
//           resource.$task_id
//         );
//       }
//       return assignments;
//     }

//     var resourceConfig = {
//       scale_height: 30,
//       row_height: 45,
//       scales: [
//         { unit: "month", step: 1, format: "%F" },
//         // { unit: "day", step: 1, date: "%d %M" }
//       ],
//       columns: [
//         {
//           name: "name",
//           label: "Name",
//           tree: true,
//           width: 200,
//           template: function (resource) {
//             return resource.text;
//           },
//           resize: true,
//         },
//         {
//           name: "progress",
//           label: "Complete",
//           align: "center",
//           template: function (resource) {
//             var store = window.gantt.getDatastore(
//               window.gantt.config.resource_store
//             );
//             var totalToDo = 0,
//               totalDone = 0;

//             if (resource.$level == 2) {
//               completion = resource.progress * 100;
//             } else {
//               var assignments = getResourceAssignments(resource.id);
//               assignments.forEach(function (assignment) {
//                 var task = window.gantt.getTask(assignment.task_id);
//                 totalToDo += task.duration;
//                 totalDone += task.duration * (task.progress || 0);
//               });

//               var completion = 0;
//               if (totalToDo) {
//                 completion = (totalDone / totalToDo) * 100;
//               }
//             }

//             return Math.floor(completion) + "%";
//           },
//           resize: true,
//         },
//         {
//           name: "workload",
//           label: "Workload",
//           align: "center",
//           template: function (resource) {
//             var totalDuration = 0;

//             if (resource.$level == 2) {
//               var assignment = window.gantt.getResourceAssignments(
//                 resource.$resource_id,
//                 resource.$task_id
//               )[0];
//               if (assignment)
//                 totalDuration = resource.duration * assignment.value;
//             } else {
//               var assignments = getResourceAssignments(resource.id);
//               assignments.forEach(function (assignment) {
//                 var task = window.gantt.getTask(assignment.task_id);
//                 if (assignment) {
//                   const startDateYear = moment(task.start_date);
//                   const endDateYear = moment(task.end_date);
//                   const dateDiff = endDateYear.diff(startDateYear, "month");
//                   totalDuration += Number(assignment.value) * dateDiff;
//                 }
//               });
//             }

//             return (totalDuration || 0) + "d";
//           },
//           resize: true,
//         },

//         {
//           name: "capacity",
//           label: "Capacity",
//           align: "center",
//           template: function (resource) {
//             if (resource.$level == 2) {
//               return resource.duration * WORK_DAY + "d";
//             }
//             var store = window.gantt.getDatastore(
//               window.gantt.config.resource_store
//             );
//             var n =
//               resource.$level === 0 ? store.getChildren(resource.id).length : 1;

//             var state = window.gantt.getState();

//             const startDateYear = moment(state.min_date);
//             const endDateYear = moment(state.max_date);
//             const dateDiff = endDateYear.diff(startDateYear, "month");

//             return (dateDiff * Number(resource.capacity) || 0).toFixed(0) + "d";
//           },
//         },
//       ],
//     };

//     window.gantt.config.scales = [
//       { unit: "year", step: 1, format: "%Y" },
//       { unit: "month", format: "%F" },
//       // { unit: "day", step: 1, format: "%d %M" },
//     ];

//     window.gantt.config.auto_scheduling = true;
//     window.gantt.config.auto_scheduling_strict = true;
//     window.gantt.config.auto_scheduling_compatibility = true;

//     window.gantt.attachEvent("onBeforeAutoSchedule", function () {
//       window.gantt.message("Recalculating project schedule...");
//       return true;
//     });
//     window.gantt.attachEvent(
//       "onAfterTaskAutoSchedule",
//       function (task, new_date, constraint, predecessor) {

//         if (task && predecessor) {
//           window.gantt.message({
//             text:
//               "<b>" +
//               task.text +
//               "</b> has been rescheduled to " +
//               window.gantt.templates.task_date(new_date) +
//               " due to <b>" +
//               predecessor.text +
//               "</b> constraint",
//             expire: 4000,
//           });
//         }
//       }
//     );

//     // window.gantt.config.work_time = true;
//     window.gantt.config.columns = [
//       {
//         name: "text",
//         label: "Outputs / Activities",
//         tree: true,
//         width: 300,
//         resize: true,
//       },
//       { name: "start_date", align: "center", width: 80, resize: true },
//       {
//         name: "owner",
//         align: "center",
//         width: 100,
//         label: "Owner",
//         template: function (task) {
//           if (!task.parent) {
//             return "";
//           }

//           var store = window.gantt.getDatastore("resource");
//           var assignments = task[window.gantt.config.resource_property];

//           if (!assignments || !assignments.length) {
//             return "Unassigned";
//           }

//           if (assignments.length === 1) {
//             const assignment_item = store.getItem(assignments[0].resource_id);
//             return assignment_item !== undefined ? assignment_item.text : "";
//           }

//           var result = "";
//           assignments.forEach(function (assignment) {
//             var owner = store.getItem(assignment.resource_id);
//             if (!owner) return;
//             result +=
//               "<div class='owner-label' title='" +
//               owner.text +
//               "'>" +
//               owner.text.substr(0, 1) +
//               "</div>";
//           });

//           return result;
//         },
//         resize: true,
//       },
//       { name: "duration", width: 60, align: "center", resize: true },
//       { name: "add", width: 44 },
//     ];

//     window.gantt.config.resource_store = "resource";
//     window.gantt.config.resource_property = "owner";
//     window.gantt.config.order_branch = true;
//     window.gantt.config.open_tree_initially = true;
//     window.gantt.config.scale_height = 50;
//     window.gantt.config.min_duration = 24 * 60 * 60 * 1000 * 10;
//     window.gantt.config.auto_types = true;
//     window.gantt.config.drag_project = true;

//     window.gantt.config.layout = {
//       css: "gantt_container",
//       rows: [
//         {
//           gravity: 2,
//           cols: [
//             { view: "grid", group: "grids", scrollY: "scrollVer" },
//             { resizer: true, width: 1 },
//             { view: "timeline", scrollX: "scrollHor", scrollY: "scrollVer" },
//             { view: "scrollbar", id: "scrollVer", group: "vertical" },
//           ],
//         },
//         { resizer: true, width: 1, next: "resources" },
//         {
//           gravity: 1,
//           id: "resources",
//           config: resourceConfig,
//           templates: resourceTemplates,
//           cols: [
//             {
//               view: "resourceGrid",
//               group: "grids",
//               scrollY: "resourceVScroll",
//             },
//             { resizer: true, width: 1 },
//             {
//               view: "resourceHistogram",
//               capacity: 24,
//               scrollX: "scrollHor",
//               scrollY: "resourceVScroll",
//             },
//             { view: "scrollbar", id: "resourceVScroll", group: "vertical" },
//           ],
//         },
//         { view: "scrollbar", id: "scrollHor" },
//       ],
//     };

//     window.gantt.$resourcesStore = window.gantt.createDatastore({
//       name: window.gantt.config.resource_store,
//       type: "treeDatastore",
//       fetchTasks: true,
//       initItem: function (item) {
//         item.parent = (item && item.parent) || window.gantt.config.root_id;
//         item[window.gantt.config.resource_property] = item && item.parent;
//         item.open = true;
//         return item;
//       },
//     });

//     window.gantt.$resourcesStore.attachEvent("onAfterSelect", function (id) {
//       window.gantt.refreshData();
//     });

//     window.gantt.attachEvent("onTaskCreated", function (task) {
//       window.gantt.refreshData();
//       return true;
//     });

//     // window.gantt.init("gantt_here");

//     window.gantt.attachEvent("onTaskLoading", function (task) {
//       var ownerValue = task[window.gantt.config.resource_property];

//       if (
//         !task.$virtual &&
//         (!ownerValue || !Array.isArray(ownerValue) || !ownerValue.length)
//       ) {
//         task[window.gantt.config.resource_property] = [
//           // { resource_id: 7, value: 0 },
//         ]; //'Unassigned' group
//       }
//       return true;
//     });

//     window.gantt.$resourcesStore.attachEvent("onParse", function () {
//       var people = [];

//       window.gantt.$resourcesStore.eachItem(function (res) {
//         if (res.$level === 1) {
//           var copy = window.gantt.copy(res);
//           copy.key = res.id;
//           copy.label = res.text;
//           copy.unit = "days";
//           // copy.unit = "hours";
//           people.push(copy);
//         }
//       });
//       window.gantt.updateCollection("people", people);
//       window.gantt.refreshData();
//     });

//     if (props.staff) {
//       window.gantt.$resourcesStore.parse([...humanResources, ...props.staff]);
//     } else {
//       window.gantt.$resourcesStore.parse(humanResources);
//     }
//     window.gantt.refreshData();

//     // console.log([...humanResources, ...props.staff]);

//     // window.gantt.config.scale_unit = "year";
//     // window.gantt.config.step = 1;
//     // window.gantt.config.date_scale = "%Y";
//     // window.gantt.config.duration_unit = "year";
//     // window.gantt.config.duration_step = 1;
//     // window.gantt.config.scale_height = 70;
//     // window.gantt.config.round_dnd_dates = false;
//     // window.gantt.config.date_format = "%Y";

//     window.gantt.init("gantt_here");
//     window.gantt.attachEvent("onTaskLoading", function (task) {
//       task.planned_start = window.gantt.date.parseDate(
//         task.planned_start,
//         "xml_date"
//       );
//       task.planned_end = window.gantt.date.parseDate(
//         task.planned_end,
//         "xml_date"
//       );
//       window.gantt.refreshData();
//       return true;
//     });
//     window.gantt.attachEvent("onAfterTaskAdd", function (id, item) {
//       if (item.$level === 0) {
//         item.type = "project";
//         item.duration = 30;
//       }
//       //any custom logic here
//     });

//     var dp = window.gantt.createDataProcessor(function (
//       mode,
//       taskState,
//       data,
//       rowId
//     ) {
//       var workData = [];

//       if (localStorage[mode]) {
//         workData = JSON.parse(localStorage[mode]);
//       }

//       switch (taskState) {
//         case "create":
//           if (!lodash.find(workData, (item) => item.id === data.id)) {
//             workData.push(data);
//           }
//           break;
//         case "update":
//           var itemIndex = workData.findIndex(function (entry, index) {
//             return entry.id == rowId;
//           });
//           workData[itemIndex] = data;
//           break;
//         case "delete":
//           var itemIndex = workData.findIndex(function (entry, index) {
//             return entry.id == rowId;
//           });
//           workData.splice(itemIndex, 1);
//           break;
//       }

//       localStorage[mode] = JSON.stringify(workData);

//       window.gantt.render();

//       // window.gantt.attachEvent("onTaskLoading", function (task) {
//       //
//       //   task.planned_start = window.gantt.date.parseDate(task.planned_start, "xml_date");
//       //   task.planned_end = window.gantt.date.parseDate(task.planned_end, "xml_date");
//       //   return true;
//       // });
//     });

//     window.gantt.render();
//   }, []);

//   useEffect(() => {
//     setTimeout(() => {
//       if (props && props.task && !lodash.isEmpty(props.task)) {
//         localStorage.setItem("staff", JSON.stringify(props.staff));
//         localStorage.setItem("task", JSON.stringify(props.task));
//         localStorage.setItem("link", JSON.stringify(props.link));

//         const ganttData = {
//           data: props.task.map((item) => {
//             item.open = true;
//             return item;
//           }),
//           links: props.link || [],
//         };
//         // window.gantt.refreshData();
//         if (document.getElementById("gantt_here")) {
//           window.gantt.init("gantt_here");
//           window.gantt.parse(ganttData);
//         }

//         return;
//       }

//       if (props && props.project && props.project.current_project_detail) {
//         if (lodash.isEmpty(props.task)) {
//           let outputsData = props.project.current_project_detail.outputs.map(
//             (output) => {
//               let totalCost = 0;
//               const output_new = {};
//               output_new.text = output.name;
//               output_new.parent = null; //props.project.id;
//               output_new.id = 10000 + output.id;
//               output_new.total_cost = totalCost;
//               output_new.owner = [];
//               output_new.open = true;
//               output_new.type = "project";

//               return output_new;
//             }
//           );

//           let activities = props.project.current_project_detail.activities.map(
//             (activity) => {
//               const startDateYear = moment(activity.start_date);
//               const endDateYear = moment(activity.end_date);
//               const dateDiff = endDateYear.diff(startDateYear, "days");
//               const activity_new = {};

//               activity_new.progress = 0;
//               activity_new.open = true;
//               activity_new.text = activity.name;
//               activity_new.id = 100000 + activity.id;
//               activity_new.parent = 10000 + activity.output_id;
//               activity_new.start_date = moment(activity.start_date).format(
//                 "DD-MM-YYYY"
//               );

//               activity_new.duration = dateDiff === 0 ? 365 : dateDiff;
//               activity_new.total_cost = 0;
//               activity_new.owner = [];
//               activity_new.planned_start = moment(activity.start_date).format(
//                 "DD-MM-YYYY"
//               );
//               activity_new.planned_end = moment(activity.start_date)
//                 .add(dateDiff === 0 ? 365 : dateDiff, "days")
//                 .format("DD-MM-YYYY");

//               activity.investments.forEach((invest) => {
//                 lodash.keys(invest.costs).forEach((year) => {
//                   activity_new.total_cost += parseFloat(invest.costs[year]);
//                 });
//               });

//               return activity_new;
//             }
//           );

//           const ganttData = {
//             data: [...outputsData, ...activities],
//           };

//           localStorage.setItem(
//             "task",
//             JSON.stringify([...outputsData, ...activities])
//           );
//           setGanttData(ganttData);

//           if (document.getElementById("gantt_here")) {
//             window.gantt.init("gantt_here");
//             window.gantt.parse(ganttData);
//           }
//         }
//       }
//     }, 1000);
//   }, []);

//   useEffect(() => {
//     if (props && props.staff && !lodash.isEmpty(props.staff)) {
//       if (lodash.isEmpty(props.staff.filter((item) => !item))) {
//         window.gantt.refreshData();
//         window.gantt.$resourcesStore.parse([...humanResources, ...props.staff]);
//       }
//     }
//   }, [props.staff]);

//   if (
//     localStorage.getItem("ganttChartInit") &&
//     localStorage.getItem("ganttChartInit") !== "project_manag"
//   ) {
//     return null;
//   }

//   return (
//     <div style={{ width: "98%", height: "80vh" }}>
//       <div className="gantt_control">
//         <Button
//           variant="contained"
//           style={{ margin: 10 }}
//           onClick={(event) => {
//             setProjectView(!projectView);
//             toggleGroups(event);
//           }}
//         >
//           {!projectView ? "Resource View" : "Project View"}
//         </Button>
//         <Button
//           variant="contained"
//           style={{ margin: 10 }}
//           onClick={(event) => {
//             setCriticalPath(!criticalPath);
//             updateCriticalPath(event);
//           }}
//         >
//           {criticalPath ? "Hide Critical Path" : "Critical Path"}
//         </Button>

//         <Button
//           variant="contained"
//           style={{ margin: 10 }}
//           onClick={(event) => {
//             setShowSlack(!showSlack);
//             toggleSlack(event);
//           }}
//         >
//           {showSlack ? "Hide Free Time" : "Free Time"}
//         </Button>
//         <Button
//           variant="contained"
//           style={{ margin: 10 }}
//           onClick={(event) => {
//             setShowBaseline(!showBaseline);
//             toggleBaselines(event);
//           }}
//         >
//           {showBaseline ? "Hide Baseline" : "Baseline"}
//         </Button>
//         <Button
//           variant="contained"
//           style={{ margin: 10 }}
//           onClick={(event) => {
//             enableFastTracking(event);
//           }}
//         >
//           Enable Fast Tracking
//         </Button>
//         <Button
//           variant="contained"
//           style={{ margin: 10 }}
//           onClick={(event) => {
//             setShowProgress(!showProgress);
//             toggleProgressLine(event);
//           }}
//         >
//           {showProgress ? "Hide Progress Line" : "Progress Line"}
//         </Button>
//         {/* <Button
//           variant="contained"
//           style={{ margin: 10 }}
//           onClick={() => {
//             if (window.gantt) {
//               window.gantt.exportToPDF({ raw: true });
//             }
//           }}
//         >
//           Export PDF
//         </Button> */}
//       </div>
//       <div id="gantt_here" style={{ width: "100%", height: "90%" }}></div>
//     </div>
//   );
// }

// export default ProjectResourcesManagmentForm;
