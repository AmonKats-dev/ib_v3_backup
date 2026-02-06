// import "./resources.css";
// import React, { useRef, useState } from "react";

// import { Button } from "@material-ui/core";
// import { billionsFormatter } from "../../resources/Projects/Report/helpers";
// import { useDataProvider } from "react-admin";
// import { useEffect } from "react";
// import lodash, { concat, find } from "lodash";
// import moment from "moment";
// import { useHistory } from "react-router-dom";

// import { gantt, Gantt } from "dhtmlx-gantt";
// import { checkFeature } from "../../../helpers/checkPermission";
// import { useDispatch } from "react-redux";
// import { costSumFormatter } from "../../../helpers";
// import ResourceDialog from "../../resources/ProjectManagement/ResourceDialog";
// import { setBreadCrumps } from "../../../actions/ui";

// const ganttProjectChart = Gantt.getGanttInstance();

// ganttProjectChart.plugins({
//   grouping: true,
//   auto_scheduling: true,
//   critical_path: true,
//   overlay: true,
//   marker: true,
// });

// const UNASSIGNED_ID = 15;
// const WORK_DAY = 8;
// let SHOW_BASE_LINE = false;
// let PROJECT_VIEW = true;
// let CRITICAL_PATH = false;
// var SHOW_SLACK = false;
// var FAST_TRACKING = false;

// /* show slack */
// function renderSlack() {
//   ganttProjectChart.addTaskLayer(function addSlack(task) {
//     if (!ganttProjectChart.config.show_slack) {
//       return null;
//     }

//     var slack = ganttProjectChart.getFreeSlack(task);

//     if (!slack) {
//       return null;
//     }

//     var state = ganttProjectChart.getState().drag_mode;

//     if (state == "resize" || state == "move") {
//       return null;
//     }

//     var slackStart = new Date(task.end_date);
//     var slackEnd = ganttProjectChart.calculateEndDate(slackStart, slack);
//     var sizes = ganttProjectChart.getTaskPosition(task, slackStart, slackEnd);
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

// function toggleSlack(toggle) {
//   if (!SHOW_SLACK) {
//     SHOW_SLACK = true;
//     ganttProjectChart.config.show_slack = true;
//   } else {
//     SHOW_SLACK = false;
//     ganttProjectChart.config.show_slack = false;
//   }
//   renderSlack();
//   ganttProjectChart.render();
// }

// function updateCriticalPath(toggle) {
//   if (!CRITICAL_PATH) {
//     CRITICAL_PATH = true;
//     ganttProjectChart.config.highlight_critical_path = true;
//   } else {
//     CRITICAL_PATH = false;
//     ganttProjectChart.config.highlight_critical_path = false;
//   }
//   ganttProjectChart.render();
// }

// function toggleGroups(input) {
//   ganttProjectChart.$groupMode = !ganttProjectChart.$groupMode;

//   if (PROJECT_VIEW) {
//     PROJECT_VIEW = false;
//     var groups = ganttProjectChart.$resourcesStore
//       .getItems()
//       .map(function (item) {
//         var group = ganttProjectChart.copy(item);
//         group.group_id = group.id;
//         group.id = ganttProjectChart.uid();
//         return group;
//       });

//     ganttProjectChart.groupBy({
//       groups: groups,
//       relation_property: ganttProjectChart.config.resource_property,
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
//     PROJECT_VIEW = true;
//     ganttProjectChart.groupBy(false);
//   }
//   // if (ganttProjectChart.$groupMode) {
//   //   var groups = ganttProjectChart.$resourcesStore
//   //     .getItems()
//   //     .map(function (item) {
//   //       var group = ganttProjectChart.copy(item);
//   //       group.group_id = group.id;
//   //       group.id = ganttProjectChart.uid();
//   //       return group;
//   //     });

//   //   ganttProjectChart.groupBy({
//   //     groups: groups,
//   //     relation_property: ganttProjectChart.config.resource_property,
//   //     group_id: "group_id",
//   //     group_text: "text",
//   //     delimiter: ", ",
//   //     default_group_label: "Not Assigned",
//   //     set_relation_value: function (groupIds) {
//   //       if (groupIds) {
//   //         var resources = [];
//   //         groupIds.map(function (id) {
//   //           resources.push({ resource_id: id, value: WORK_DAY });
//   //         });
//   //         return resources;
//   //       }
//   //     },
//   //   });
//   // } else {
//   //   ganttProjectChart.groupBy(false);
//   // }
// }

// function renderBaselines() {
//   var baseline_progress_drag = false;
//   ganttProjectChart.templates.task_class = function (start, end, task) {
//     if (task.planned_end && SHOW_BASE_LINE) {
//       var classes = ["has-baseline"];
//       if (end.getTime() > task.planned_end.getTime()) {
//         classes.push("overdue");
//       }
//       return classes.join(" ");
//     }
//   };

//   const layer_id = ganttProjectChart.addTaskLayer(function draw_planned(task) {
//     if (!SHOW_BASE_LINE) return;
//     if (task.planned_start && task.planned_end) {
//       if (!task.baseline_progress) task.baseline_progress = 0;
//       var sizes = ganttProjectChart.getTaskPosition(
//         task,
//         task.planned_start,
//         task.planned_end
//       );
//       var el = document.createElement("div");
//       el.className = "baseline";
//       el.style.left = sizes.left + "px";
//       el.style.width = sizes.width + "px";
//       el.style.top =
//         sizes.top + ganttProjectChart.config.task_height + 13 + "px";

//       // adding progressbar
//       var progress = document.createElement("div");
//       progress.className = "baseline_progressbar";
//       progress.style.left = sizes.left + "px";
//       progress.style.width = task.baseline_progress;
//       progress.style.top =
//         sizes.top + ganttProjectChart.config.task_height + 13 + "px";
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
//           ganttProjectChart.refreshTask(task.id);
//         }
//       };
//       return el;
//     }
//     return false;
//   });

//   if (!SHOW_BASE_LINE) {
//     ganttProjectChart.removeTaskLayer(layer_id);
//   }
// }

// function toggleBaselines(toggle) {
//   if (!SHOW_BASE_LINE) {
//     SHOW_BASE_LINE = true;
//     ganttProjectChart.config.task_height = 20;
//     ganttProjectChart.config.row_height = 40;
//     renderBaselines();
//   } else {
//     SHOW_BASE_LINE = false;
//     ganttProjectChart.config.task_height = 35;
//     ganttProjectChart.config.row_height = 40;
//     renderBaselines();
//   }

//   ganttProjectChart.render();
// }

// function toggleProgressLine() {
//   if (ganttProjectChart.ext.overlay.isOverlayVisible(lineOverlay)) {
//     ganttProjectChart.config.readonly = false;
//     ganttProjectChart.ext.overlay.hideOverlay(lineOverlay);
//     ganttProjectChart.$root.classList.remove("overlay_visible");
//   } else {
//     ganttProjectChart.config.readonly = true;
//     ganttProjectChart.ext.overlay.showOverlay(lineOverlay);
//     ganttProjectChart.$root.classList.add("overlay_visible");
//   }

//   ganttProjectChart.render();
// }

// function enableFastTracking(fastTracking) {
//   if (!FAST_TRACKING) {
//     FAST_TRACKING = true;
//     ganttProjectChart.config.auto_scheduling = true;
//     ganttProjectChart.config.auto_scheduling_strict = true;
//     ganttProjectChart.config.auto_scheduling_compatibility = true;

//     ganttProjectChart.autoSchedule();
//   } else {
//     FAST_TRACKING = false;

//     ganttProjectChart.config.auto_scheduling = false;
//     ganttProjectChart.config.auto_scheduling_strict = false;
//     ganttProjectChart.config.auto_scheduling_compatibility = false;
//   }
// }

// var myChart;

// var lineOverlay = ganttProjectChart.ext.overlay.addOverlay(function (
//   container
// ) {
//   var scaleLabels = [];

//   var chartScale = getChartScaleRange();

//   chartScale.forEach(function (date) {
//     scaleLabels.push(dateToStr(date));
//   });

//   var values = getProgressLine();

//   var canvas = document.createElement("canvas");
//   const dataArea = document.querySelector("div.gantt_overlay_area");
//   dataArea.innerHTML = "";
//   dataArea.appendChild(canvas);
//   canvas.style.height = container.offsetHeight + "px";
//   canvas.style.width = container.offsetWidth + "px";

//   var ctx = canvas.getContext("2d");

//   if (myChart) {
//     myChart.destroy();
//   }

//   myChart = new window.Chart(ctx, {
//     type: "line",
//     data: {
//       datasets: [
//         {
//           label: "Planned progress",
//           backgroundColor: "#001eff",
//           borderColor: "#001eff",
//           data: values.planned,
//           fill: false,
//           cubicInterpolationMode: "monotone",
//         },
//         {
//           label: "Real progress",
//           backgroundColor: "#ff5454",
//           borderColor: "#ff5454",
//           data: values.real,
//           fill: false,
//           cubicInterpolationMode: "monotone",
//         },
//         {
//           label: "Real progress (predicted)",
//           backgroundColor: "#ff5454",
//           borderColor: "#ff5454",
//           data: values.predicted,
//           borderDash: [5, 10],
//           fill: false,
//           cubicInterpolationMode: "monotone",
//         },
//       ],
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//       layout: {
//         padding: getScalePaddings(),
//       },
//       onResize: function (chart, newSize) {
//         var dataRange = ganttProjectChart.getSubtaskDates();
//         if (dataRange.start_date) {
//           // align chart with the scale range
//           chart.options.layout.padding = getScalePaddings();
//         }
//       },
//       legend: {
//         display: false,
//       },
//       tooltips: {
//         mode: "index",
//         intersect: false,
//         callbacks: {
//           label: function (tooltipItem, data) {
//             var dataset = data.datasets[tooltipItem.datasetIndex];
//             return dataset.label + ": " + dataset.data[tooltipItem.index] + "%";
//           },
//         },
//       },
//       hover: {
//         mode: "nearest",
//         intersect: true,
//       },
//       scales: {
//         xAxes: [
//           {
//             labels: scaleLabels,
//             gridLines: {
//               display: false,
//             },
//             ticks: {
//               display: false,
//             },
//           },
//           {
//             position: "top",
//             labels: scaleLabels,
//             gridLines: {
//               display: false,
//             },
//             ticks: {
//               display: false,
//             },
//           },
//         ],
//         yAxes: [
//           {
//             display: true,
//             gridLines: {
//               display: false,
//             },
//             ticks: {
//               display: true,
//               min: 0,
//               max: 100,
//               stepSize: 10,
//               callback: function (current) {
//                 if (current > 100) {
//                   return "";
//                 }
//                 return current + "%";
//               },
//             },
//           },
//           {
//             display: true,
//             position: "right",
//             gridLines: {
//               display: false,
//             },
//             ticks: {
//               display: true,
//               min: 0,
//               max: 100,
//               stepSize: 10,
//               callback: function (current) {
//                 if (current > 100) {
//                   return "";
//                 }
//                 return current + "%";
//               },
//             },
//           },
//         ],
//       },
//     },
//   });
//   return canvas;
// });

// function getScalePaddings() {
//   var scale = ganttProjectChart.getScale();
//   var dataRange = ganttProjectChart.getSubtaskDates();

//   var chartScale = getChartScaleRange();
//   var newWidth = scale.col_width;
//   var padding = {
//     left: 0,
//     right: 0,
//   };

//   if (dataRange.start_date) {
//     var yScaleLabelsWidth = 48;
//     // fine tune values in order to align chart with the scale range
//     padding.left =
//       ganttProjectChart.posFromDate(dataRange.start_date) - yScaleLabelsWidth;
//     padding.right =
//       scale.full_width -
//       ganttProjectChart.posFromDate(dataRange.end_date) -
//       yScaleLabelsWidth;
//     padding.top = ganttProjectChart.config.row_height - 12;
//     padding.bottom = ganttProjectChart.config.row_height - 12;
//   }
//   return padding;
// }

// function getChartScaleRange() {
//   var tasksRange = ganttProjectChart.getSubtaskDates();
//   var cells = [];
//   var scale = ganttProjectChart.getScale();
//   if (!tasksRange.start_date) {
//     return scale.trace_x;
//   }

//   scale.trace_x.forEach(function (date) {
//     if (date >= tasksRange.start_date && date <= tasksRange.end_date) {
//       cells.push(date);
//     }
//   });
//   return cells;
// }

// function getProgressLine() {
//   var tasks = ganttProjectChart.getTaskByTime();
//   var scale = ganttProjectChart.getScale();
//   var step = scale.unit;

//   var timegrid = {};

//   var totalDuration = 0;

//   ganttProjectChart.eachTask(function (task) {
//     if (ganttProjectChart.isSummaryTask(task)) {
//       return;
//     }
//     if (!task.duration) {
//       return;
//     }

//     var currDate = ganttProjectChart.date[scale.unit + "_start"](
//       new Date(task.start_date)
//     );
//     while (currDate < task.end_date) {
//       var date = currDate;
//       currDate = ganttProjectChart.date.add(currDate, 1, step);

//       if (
//         !ganttProjectChart.isWorkTime({ date: date, task: task, unit: step })
//       ) {
//         continue;
//       }

//       var timestamp = currDate.valueOf();
//       if (!timegrid[timestamp]) {
//         timegrid[timestamp] = {
//           planned: 0,
//           real: 0,
//         };
//       }

//       timegrid[timestamp].planned += 1;
//       if (date <= today) {
//         timegrid[timestamp].real += 1 * (task.progress || 0);
//       }

//       totalDuration += 1;
//     }
//   });

//   var cumulativePlannedDurations = [];
//   var cumulativeRealDurations = [];
//   var cumulativePredictedDurations = [];
//   var totalPlanned = 0;
//   var totalReal = 0;

//   var chartScale = getChartScaleRange();
//   var dailyRealProgress = -1;
//   var totalPredictedProgress = 0;

//   for (var i = 0; i < chartScale.length; i++) {
//     var start = new Date(chartScale[i]);
//     var end = ganttProjectChart.date.add(start, 1, step);
//     var cell = timegrid[start.valueOf()] || { planned: 0, real: 0 };
//     totalPlanned = cell.planned + totalPlanned;

//     cumulativePlannedDurations.push(totalPlanned);
//     if (start <= today) {
//       totalReal = (cell.real || 0) + totalReal;
//       cumulativeRealDurations.push(totalReal);
//       cumulativePredictedDurations.push(null);
//     } else {
//       if (dailyRealProgress < 0) {
//         dailyRealProgress = totalReal / cumulativeRealDurations.length;
//         totalPredictedProgress = totalReal;
//         cumulativePredictedDurations.pop();
//         cumulativePredictedDurations.push(totalPredictedProgress);
//       }
//       totalPredictedProgress += dailyRealProgress;
//       cumulativePredictedDurations.push(totalPredictedProgress);
//     }
//   }

//   for (var i = 0; i < cumulativePlannedDurations.length; i++) {
//     cumulativePlannedDurations[i] = Math.round(
//       (cumulativePlannedDurations[i] / totalPlanned) * 100
//     );
//     if (cumulativeRealDurations[i] !== undefined) {
//       cumulativeRealDurations[i] = Math.round(
//         (cumulativeRealDurations[i] / totalPlanned) * 100
//       );
//     }

//     if (cumulativePredictedDurations[i] !== null) {
//       cumulativePredictedDurations[i] = Math.round(
//         (cumulativePredictedDurations[i] / totalPlanned) * 100
//       );
//     }
//   }

//   return {
//     planned: cumulativePlannedDurations,
//     real: cumulativeRealDurations,
//     predicted: cumulativePredictedDurations,
//   };
// }

// var dateToStr = ganttProjectChart.date.date_to_str("%F %j, %Y");
// var today = new Date();

// function shouldHighlightTask(task) {
//   var store = ganttProjectChart.$resourcesStore;
//   if (store) {
//     var taskResource = task[ganttProjectChart.config.resource_property],
//       selectedResource = store.getSelectedId();
//     if (
//       taskResource == selectedResource ||
//       store.isChildOf(taskResource, selectedResource)
//     ) {
//       return true;
//     }
//   }
// }

// ganttProjectChart.templates.grid_row_class = function (start, end, task) {
//   var css = [];
//   if (ganttProjectChart.hasChild(task.id)) {
//     css.push("folder_row");
//   }

//   if (task.$virtual) {
//     css.push("group_row");
//   }

//   if (shouldHighlightTask(task)) {
//     css.push("highlighted_resource");
//   }

//   if (task.$level === 2) {
//     css.push("nested_task");
//   }

//   if (task.$rendered_type === ganttProjectChart.config.types.task) {
//     css.push("nested_task");
//   }

//   return css.join(" ");
// };

// ganttProjectChart.templates.task_row_class = function (start, end, task) {
//   if (shouldHighlightTask(task)) {
//     return "highlighted_resource";
//   }
//   return "";
// };

// ganttProjectChart.templates.timeline_cell_class = function (task, date) {
//   if (!ganttProjectChart.isWorkTime({ date: date, task: task }))
//     return "week_end";
//   return "";
// };

// function getAllocatedValue(tasks, resource) {
//   var result = 0;
//   tasks.forEach(function (item) {
//     var assignments = ganttProjectChart.getResourceAssignments(
//       resource.id,
//       item.id
//     );
//     assignments.forEach(function (assignment) {
//       result += Number(assignment.value);
//     });
//   });
//   return result;
// }

// function getCapacity(date, resource) {
//   /* it is sample function your could to define your own function for get Capability of resources in day */
//   // 1st level - resource groups
//   // 2nd level - resources
//   // 3rd level - assigned tasks
//   if (resource.$level !== 1) {
//     return -1;
//   }
//   return Number(resource.capacity) || 0;
// }

// ganttProjectChart.templates.histogram_cell_class = function (
//   start_date,
//   end_date,
//   resource,
//   tasks
// ) {
//   if (resource.$level === 1) {
//     if (
//       getAllocatedValue(tasks, resource) > getCapacity(start_date, resource)
//     ) {
//       return "column_overload";
//     }
//   } else if (resource.$level === 2) {
//     return "resource_task_cell";
//   }
// };

// ganttProjectChart.templates.histogram_cell_label = function (
//   start_date,
//   end_date,
//   resource,
//   tasks
// ) {
//   if (tasks?.length && resource.$level === 1) {
//     return (
//       getAllocatedValue(tasks, resource) +
//       "/" +
//       getCapacity(start_date, resource)
//     );
//   } else if (resource.$level === 0) {
//     return "";
//   } else if (resource.$level === 2) {
//     if (
//       ganttProjectChart.isWorkTime({
//         date: start_date,
//         task: ganttProjectChart.getTask(resource.$task_id),
//       })
//     ) {
//       if (
//         start_date.valueOf() < resource.end_date.valueOf() &&
//         end_date.valueOf() > resource.start_date.valueOf()
//       ) {
//         var assignment = ganttProjectChart.getResourceAssignments(
//           resource.$resource_id,
//           resource.$task_id
//         )[0];
//         return assignment.value;
//       } else {
//         return "&ndash;";
//       }
//     }
//   }
//   return "&ndash;";
// };
// ganttProjectChart.templates.histogram_cell_allocated = function (
//   start_date,
//   end_date,
//   resource,
//   tasks
// ) {
//   return getAllocatedValue(tasks, resource);
// };

// ganttProjectChart.templates.histogram_cell_capacity = function (
//   start_date,
//   end_date,
//   resource,
//   tasks
// ) {
//   if (!ganttProjectChart.isWorkTime(start_date)) {
//     return 0;
//   }
//   return getCapacity(start_date, resource);
// };

// function shouldHighlightResource(resource) {
//   var selectedTaskId = ganttProjectChart.getState().selected_task;
//   if (ganttProjectChart.isTaskExists(selectedTaskId)) {
//     var selectedTask = ganttProjectChart.getTask(selectedTaskId),
//       selectedResource =
//         selectedTask[ganttProjectChart.config.resource_property];

//     if (resource.id == selectedResource) {
//       return true;
//     } else if (
//       ganttProjectChart.$resourcesStore.isChildOf(selectedResource, resource.id)
//     ) {
//       return true;
//     }
//   }
//   return false;
// }

// var resourceTemplates = {
//   grid_row_class: function (start, end, resource) {
//     var css = [];
//     if (resource.$level === 0) {
//       css.push("folder_row");
//       css.push("group_row");
//     }
//     if (shouldHighlightResource(resource)) {
//       css.push("highlighted_resource");
//     }
//     return css.join(" ");
//   },
//   task_row_class: function (start, end, resource) {
//     var css = [];
//     if (shouldHighlightResource(resource)) {
//       css.push("highlighted_resource");
//     }
//     if (resource.$level === 0) {
//       css.push("group_row");
//     }

//     return css.join(" ");
//   },
// };

// //   ganttProjectChart.config.lightbox.sections = [
// //     {name:"description", height:38, map_to:"text", type:"textarea", focus:true},
// //     {name:"time",type:"duration",map_to:"auto",time_format:["%d","%m","%Y","%H:%i"]}
// // ];
// ganttProjectChart.locale.labels.baseline_enable_button = "Set";
// ganttProjectChart.locale.labels.baseline_disable_button = "Remove";
// ganttProjectChart.locale.labels.section_owner = "Owner";
// ganttProjectChart.config.lightbox.sections = [
//   {
//     name: "description",
//     height: 38,
//     map_to: "text",
//     type: "textarea",
//     focus: true,
//   },
//   {
//     name: "cost",
//     height: 24,
//     map_to: "total_cost",
//     type: "textarea",
//     focus: true,
//     label: "Cost",
//   },
//   {
//     name: "owner",
//     type: "resources",
//     map_to: "owner",
//     options: ganttProjectChart.serverList("people"),
//     default_value: WORK_DAY,
//     unassigned_value: UNASSIGNED_ID,
//   },
//   { name: "time", type: "duration", map_to: "auto" },

//   {
//     name: "baseline",
//     map_to: { start_date: "planned_start", end_date: "planned_end" },
//     button: true,
//     type: "duration_optional",
//   },
//   {
//     name: "progress",
//     height: 24,
//     map_to: "progress",
//     type: "select",
//     options: [
//       { key: "0", label: "Not started" },
//       { key: "0.1", label: "10%" },
//       { key: "0.2", label: "20%" },
//       { key: "0.3", label: "30%" },
//       { key: "0.4", label: "40%" },
//       { key: "0.5", label: "50%" },
//       { key: "0.6", label: "60%" },
//       { key: "0.7", label: "70%" },
//       { key: "0.8", label: "80%" },
//       { key: "0.9", label: "90%" },
//       { key: "1", label: "Complete" },
//     ],
//   },
// ];
// ganttProjectChart.locale.labels.section_baseline = "Planned";
// ganttProjectChart.locale.labels.section_cost = "Cost";
// ganttProjectChart.locale.labels.section_progress = "Progress";

// ganttProjectChart.config.resource_render_empty_cells = true;
// ganttProjectChart.config.task_height = 35;
// ganttProjectChart.config.row_height = 40;

// function getResourceAssignments(resourceId) {
//   var assignments;
//   var store = ganttProjectChart.getDatastore(
//     ganttProjectChart.config.resource_store
//   );
//   var resource = store.getItem(resourceId);

//   if (resource.$level === 0) {
//     assignments = [];
//     store.getChildren(resourceId).forEach(function (childId) {
//       assignments = assignments.concat(
//         ganttProjectChart.getResourceAssignments(childId)
//       );
//     });
//   } else if (resource.$level === 1) {
//     assignments = ganttProjectChart.getResourceAssignments(resourceId);
//   } else {
//     assignments = ganttProjectChart.getResourceAssignments(
//       resource.$resource_id,
//       resource.$task_id
//     );
//   }
//   return assignments;
// }

// var resourceConfig = {
//   scale_height: 30,
//   row_height: 45,
//   scales: [
//     { unit: "month", step: 1, format: "%F" },
//     // { unit: "day", step: 1, date: "%d %M" }
//   ],
//   columns: [
//     {
//       name: "name",
//       label: "Name",
//       tree: true,
//       width: 200,
//       template: function (resource) {
//         return resource.text;
//       },
//       resize: true,
//     },
//     {
//       name: "progress",
//       label: "Complete",
//       align: "center",
//       template: function (resource) {
//         var store = ganttProjectChart.getDatastore(
//           ganttProjectChart.config.resource_store
//         );
//         var totalToDo = 0,
//           totalDone = 0;

//         var completion = 0;
//         if (resource.$level == 2) {
//           completion = resource.progress * 100;
//         } else {
//           var assignments = getResourceAssignments(resource.id);
//           assignments.forEach(function (assignment) {
//             var task = ganttProjectChart.getTask(assignment.task_id);
//             totalToDo += task.duration;
//             totalDone += task.duration * (task.progress || 0);
//           });

//           if (totalToDo) {
//             completion = (totalDone / totalToDo) * 100;
//           }
//         }

//         return Math.floor(completion) + "%";
//       },
//       resize: true,
//     },
//     {
//       name: "workload",
//       label: "Workload",
//       align: "center",
//       template: function (resource) {
//         var totalDuration = 0;

//         if (resource.$level == 2) {
//           var assignment = ganttProjectChart.getResourceAssignments(
//             resource.$resource_id,
//             resource.$task_id
//           )[0];
//           if (assignment) totalDuration = resource.duration * assignment.value;
//         } else {
//           var assignments = getResourceAssignments(resource.id);
//           assignments.forEach(function (assignment) {
//             var task = ganttProjectChart.getTask(assignment.task_id);
//             if (assignment) {
//               const startDateYear = moment(task.start_date);
//               const endDateYear = moment(task.end_date);
//               const dateDiff = endDateYear.diff(startDateYear, "month");
//               totalDuration += Number(assignment.value) * dateDiff;
//             }
//           });
//         }

//         return (totalDuration || 0) + "d";
//       },
//       resize: true,
//     },

//     {
//       name: "capacity",
//       label: "Capacity",
//       align: "center",
//       template: function (resource) {
//         if (resource.$level == 2) {
//           return resource.duration * WORK_DAY + "d";
//         }
//         var store = ganttProjectChart.getDatastore(
//           ganttProjectChart.config.resource_store
//         );
//         var n =
//           resource.$level === 0 ? store.getChildren(resource.id).length : 1;

//         var state = ganttProjectChart.getState();

//         const startDateYear = moment(state.min_date);
//         const endDateYear = moment(state.max_date);
//         const dateDiff = endDateYear.diff(startDateYear, "month");

//         return (dateDiff * Number(resource.capacity) || 0).toFixed(0) + "d";
//       },
//     },
//   ],
// };

// ganttProjectChart.config.scales = [
//   { unit: "year", step: 1, format: "%Y" },
//   { unit: "month", format: "%F" },
// ];

// ganttProjectChart.attachEvent("onBeforeAutoSchedule", function () {
//   ganttProjectChart.message("Recalculating project schedule...");
//   return true;
// });
// ganttProjectChart.attachEvent(
//   "onAfterTaskAutoSchedule",
//   function (task, new_date, constraint, predecessor) {
//     if (task && predecessor) {
//       ganttProjectChart.message({
//         text:
//           "<b>" +
//           task.text +
//           "</b> has been rescheduled to " +
//           ganttProjectChart.templates.task_date(new_date) +
//           " due to <b>" +
//           predecessor.text +
//           "</b> constraint",
//         expire: 4000,
//       });
//     }
//   }
// );

// // ganttProjectChart.config.work_time = true;
// ganttProjectChart.config.columns = [
//   {
//     name: "text",
//     label: "Outputs / Activities",
//     tree: true,
//     width: 300,
//     resize: true,
//   },
//   { name: "start_date", align: "center", width: 80, resize: true },
//   {
//     name: "total_cost",
//     label: "Cost",
//     align: "center",
//     width: 80,
//     resize: true,
//     template: function (item) {
//       if (item?.total_cost) return costSumFormatter(item.total_cost);
//       return "";
//     },
//   },
//   //
//   {
//     name: "owner",
//     align: "center",
//     width: 100,
//     label: "Owner",
//     template: function (task) {
//       if (
//         !task ||
//         (task && !task.parent) ||
//         task?.hideResources ||
//         task?.type === "project"
//       ) {
//         return "";
//       }

//       var store = ganttProjectChart.getDatastore("resource");
//       var assignments = task[ganttProjectChart.config.resource_property];

//       if (!assignments || !assignments.length) {
//         return "Unassigned";
//       }

//       if (assignments.length === 1) {
//         const assignment_item = store.getItem(assignments[0].resource_id);
//         return assignment_item !== undefined ? assignment_item.text : "";
//       }

//       var result = "";
//       assignments.forEach(function (assignment) {
//         var owner = store.getItem(assignment.resource_id);
//         if (!owner) return;
//         result +=
//           "<div class='owner-label' title='" +
//           owner.text +
//           "'>" +
//           owner.text.substr(0, 1) +
//           "</div>";
//       });

//       return result;
//     },
//     resize: true,
//   },
//   { name: "duration", width: 60, align: "center", resize: true },
//   {
//     name: "add",
//     width: 44,
//   },
// ];

// ganttProjectChart.config.resource_store = "resource";
// ganttProjectChart.config.resource_property = "owner";
// ganttProjectChart.config.order_branch = true;
// ganttProjectChart.config.open_tree_initially = true;
// ganttProjectChart.config.scale_height = 50;
// ganttProjectChart.config.min_duration = 24 * 60 * 60 * 1000 * 10;
// ganttProjectChart.config.auto_types = true;
// ganttProjectChart.config.drag_project = true;

// ganttProjectChart.config.layout = {
//   css: "gantt_container",
//   rows: [
//     {
//       gravity: 2,
//       cols: [
//         { view: "grid", group: "grids", scrollY: "scrollVer" },
//         { resizer: true, width: 1 },
//         { view: "timeline", scrollX: "scrollHor", scrollY: "scrollVer" },
//         { view: "scrollbar", id: "scrollVer", group: "vertical" },
//       ],
//     },
//     { resizer: true, width: 1, next: "resources" },
//     {
//       gravity: 1,
//       id: "resources",
//       config: resourceConfig,
//       templates: resourceTemplates,
//       cols: [
//         {
//           view: "resourceGrid",
//           group: "grids",
//           scrollY: "resourceVScroll",
//         },
//         { resizer: true, width: 1 },
//         {
//           view: "resourceHistogram",
//           capacity: 24,
//           scrollX: "scrollHor",
//           scrollY: "resourceVScroll",
//         },
//         { view: "scrollbar", id: "resourceVScroll", group: "vertical" },
//       ],
//     },
//     { view: "scrollbar", id: "scrollHor" },
//   ],
// };

// ganttProjectChart.$resourcesStore = ganttProjectChart.createDatastore({
//   name: ganttProjectChart.config.resource_store,
//   type: "treeDatastore",
//   fetchTasks: true,
//   initItem: function (item) {
//     item.parent = (item && item.parent) || ganttProjectChart.config.root_id;
//     item[ganttProjectChart.config.resource_property] = item && item.parent;
//     item.open = true;
//     return item;
//   },
// });

// ganttProjectChart.$resourcesStore.attachEvent("onAfterSelect", function (id) {
//   ganttProjectChart.refreshData();
// });

// ganttProjectChart.attachEvent("onTaskCreated", function (task) {
//   ganttProjectChart.refreshData();
//   return true;
// });

// ganttProjectChart.attachEvent("onTaskLoading", function (task) {
//   if (task) {
//     var ownerValue = task[ganttProjectChart.config.resource_property];

//     if (
//       !task.$virtual &&
//       (!ownerValue || !Array.isArray(ownerValue) || !ownerValue.length)
//     ) {
//       task[ganttProjectChart.config.resource_property] = [
//         // { resource_id: 7, value: 0 },
//       ]; //'Unassigned' group
//     }
//   }

//   return true;
// });

// ganttProjectChart.$resourcesStore.attachEvent("onParse", function () {
//   var people = [];
//   ganttProjectChart.$resourcesStore.eachItem(function (res) {
//     if (res.$level === 1) {
//       var copy = ganttProjectChart.copy(res);
//       copy.key = res.id;
//       copy.label = res.text;
//       copy.unit = "days";
//       people.push(copy);
//     }
//   });
//   ganttProjectChart.updateCollection("people", people);
//   ganttProjectChart.refreshData();
// });

// ganttProjectChart.attachEvent("onTaskLoading", function (task) {
//   task.planned_start = ganttProjectChart.date.parseDate(
//     task.planned_start,
//     "xml_date"
//   );
//   task.planned_end = ganttProjectChart.date.parseDate(
//     task.planned_end,
//     "xml_date"
//   );
//   ganttProjectChart.refreshData();
//   return true;
// });
// ganttProjectChart.attachEvent("onAfterTaskAdd", function (id, item) {
//   if (item.$level === 0) {
//     item.type = "project";
//     item.duration = 30;
//   }
// });

// ganttProjectChart.createDataProcessor(function (mode, taskState, data, rowId) {
//   var workData = [];
//   if (localStorage[mode] && JSON.parse(localStorage[mode])) {
//     workData = JSON.parse(localStorage[mode]);
//   }

//   switch (taskState) {
//     case "create":
//       if (!lodash.find(workData, (item) => item.id === data.id)) {
//         workData.push(data);
//       }
//       break;
//     case "update":
//       var itemIndex = workData.findIndex(function (entry, index) {
//         return entry.id == rowId;
//       });
//       workData[itemIndex] = data;
//       break;
//     case "delete":
//       var itemIndex = workData.findIndex(function (entry, index) {
//         return entry.id == rowId;
//       });
//       workData.splice(itemIndex, 1);
//       break;
//     default:
//     // non
//   }

//   localStorage[mode] = JSON.stringify(workData);

//   ganttProjectChart.render();
// });

// function ProjectResourcesManagmentForm({ humanResources, ...props }) {
//   const [fastTracking, setFastTracking] = useState(false);
//   const [showSlack, setShowSlack] = useState(false);
//   const [criticalPath, setCriticalPath] = useState(false);
//   const [projectView, setProjectView] = useState(false);
//   const [showBaseline, setShowBaseline] = useState(false);
//   const [showProgress, setShowProgress] = useState(false);
//   let history = useHistory();
//   let ref = useRef(null);

//   function renderMarkers() {
//     ganttProjectChart.addMarker({
//       start_date: today,
//       css: "today",
//       text: "Today",
//       title: "Today: " + dateToStr(today),
//     });
//     var dataRange = ganttProjectChart.getSubtaskDates();
//     ganttProjectChart.addMarker({
//       start_date: dataRange.end_date,
//       text: "Project end",
//       title: "Project end: " + dateToStr(dataRange.end_date),
//     });
//     ganttProjectChart.addMarker({
//       start_date: dataRange.start_date,
//       text: "Project start",
//       title: "Project Start: " + dateToStr(dataRange.start_date),
//     });
//   }

//   useEffect(() => {
//     localStorage.removeItem("task");
//     localStorage.removeItem("link");
//     localStorage.removeItem("staff");
//   }, []);

//   useEffect(() => {
//     if (props && props.task && !lodash.isEmpty(props.task)) {
//       localStorage.setItem(
//         "staff",
//         props.staff ? JSON.stringify(props.staff) : "[]"
//       );
//       localStorage.setItem(
//         "task",
//         props.task ? JSON.stringify(props.task) : "[]"
//       );
//       localStorage.setItem(
//         "link",
//         props.link ? JSON.stringify(props.link) : "[]"
//       );

//       const ganttData = {
//         data: props.task?.map((item) => {
//           item.open = true;
//           return item;
//         }),
//         links: props.link || [],
//       };

//       if (document.getElementById("pm_gantt_here")) {
//         ganttProjectChart.init("pm_gantt_here");
//         ganttProjectChart.clearAll();
//         ganttProjectChart.parse(ganttData);
//         ganttProjectChart.refreshData();

//         renderMarkers();
//       }
//       // props.onSave();
//       return;
//     }

//     if (props && props.project && props.project.current_project_detail) {
//       const startDateYear = moment(
//         props.project.current_project_detail.start_date
//       );
//       const endDateYear = moment(props.project.current_project_detail.end_date);
//       const dateDiff = endDateYear.diff(startDateYear, "years") + 1;

//       const initialStartDate = moment(
//         props.project.current_project_detail.start_date
//       ).format("DD-MM-YYYY");
//       const initialDuration = 0; // endDateYear.diff(startDateYear, "days"); // can set project duration as default

//       let project = {
//         id: props.project_id,
//         text: props.project?.name || "Project",
//         parent: null,
//         start_date: moment(
//           props.project?.current_project_detail?.start_date
//         ).format("YYYY"),
//         duration: dateDiff === 0 ? 1 : dateDiff,
//         open: true,
//         type: ganttProjectChart.config.types.task,
//       };

//       // let componentsData =
//       //   props.project?.current_project_detail?.components?.map((component) => {
//       //     let totalCost = 0;
//       //     const component_new = {};
//       //     component_new.hideResources = true;
//       //     component_new.text = component.name;
//       //     component_new.parent = props.project_id; //props.project.id;
//       //     component_new.id = 10000 + component.id;
//       //     component_new.total_cost = totalCost;
//       //     component_new.owner = [];
//       //     component_new.open = true;
//       //     component_new.type = ganttProjectChart.config.types.project;
//       //     component_new.subcomponents = component.subcomponents;

//       //     component_new.start_date = initialStartDate;
//       //     component_new.duration = initialDuration;

//       //     return component_new;
//       //   });

//       // let subComponentsData = concat(
//       //   ...componentsData?.map((component) => {
//       //     return [
//       //       ...(component.subcomponents?.map((subcomponent) => {
//       //         const subcomponent_new = {};
//       //         subcomponent_new.hideResources = true;
//       //         subcomponent_new.text = subcomponent.name;
//       //         subcomponent_new.parent = component.id;
//       //         subcomponent_new.id = 10000 + subcomponent.id;
//       //         subcomponent_new.type = ganttProjectChart.config.types.project;

//       //         subcomponent_new.start_date = initialStartDate;
//       //         subcomponent_new.duration = initialDuration;

//       //         return subcomponent_new;
//       //       }) || []),
//       //     ];
//       //   })
//       // );

//       let outputsData = props.project?.current_project_detail?.outputs?.map(
//         (output) => {
//           let totalCost = 0;
//           const output_new = {};
//           output_new.hideResources = true;
//           output_new.text = output.name;
//           output_new.parent = props.project_id; //props.project.id;
//           output_new.id = 10000 + output.id;
//           output_new.total_cost = totalCost;
//           output_new.owner = [];
//           output_new.open = true;
//           output_new.parent = props.project_id;
//           output_new.type = ganttProjectChart.config.types.project;

//           // output_new.start_date = initialStartDate;
//           // output_new.duration = initialDuration;

//           return output_new;
//         }
//       );

//       let activities = props.project?.current_project_detail?.activities?.map(
//         (activity) => {
//           const startDateYear = moment(activity.start_date);
//           const endDateYear = moment(activity.end_date);
//           const dateDiff = endDateYear.diff(startDateYear, "days");
//           const activity_new = {};
//           // const output = find(
//           //   props.project?.current_project_detail?.outputs,
//           //   (it) => Number(it.id) === Number(activity.output_ids[0])
//           // );

//           activity_new.type = ganttProjectChart.config.types.task;
//           activity_new.progress = 0;
//           activity_new.open = true;
//           activity_new.text = activity.name;
//           activity_new.id = 100000 + activity.id;
//           activity_new.parent = 10000 + activity.output_ids[0];
//           activity_new.start_date = moment(activity.start_date).format(
//             "DD-MM-YYYY"
//           );

//           // activity_new.has_subcomponent = Boolean(output?.subcomponent_id);
//           activity_new.duration = dateDiff === 0 ? 365 : dateDiff;
//           activity_new.total_cost = 0;
//           activity_new.owner = [];
//           activity_new.planned_start = moment(activity.start_date).format(
//             "DD-MM-YYYY"
//           );
//           activity_new.planned_end = moment(activity.start_date)
//             .add(dateDiff === 0 ? 365 : dateDiff, "days")
//             .format("DD-MM-YYYY");

//           activity.investments.forEach((invest) => {
//             lodash.keys(invest.costs).forEach((year) => {
//               activity_new.total_cost += parseFloat(invest.costs[year]);
//             });
//           });

//           return activity_new;
//         }
//       );

//       const ganttData = {
//         data: [
//           project,
//           ...outputsData,
//           ...activities,
//           // ...componentsData,
//           // ...subComponentsData,
//         ],
//       };

//       localStorage.setItem(
//         "task",
//         JSON.stringify([
//           project,
//           ...outputsData,
//           ...activities,
//           // ...componentsData,
//           // ...subComponentsData,
//         ])
//       );

//       if (document.getElementById("pm_gantt_here")) {
//         if (activities?.length > 0) {
//           ganttProjectChart.init("pm_gantt_here");
//           ganttProjectChart.clearAll();
//           ganttProjectChart.parse(ganttData);
//           ganttProjectChart.refreshData();

//           renderMarkers();
//         }
//       }
//     }
//     // props.onSave();
//   }, []);

//   useEffect(() => {
//     if (props && props.staff && !lodash.isEmpty(props.staff)) {
//       if (lodash.isEmpty(props.staff.filter((item) => !item))) {
//         ganttProjectChart.refreshData();
//         if (
//           ganttProjectChart.$resourcesStore &&
//           !lodash.isEmpty(humanResources) &&
//           !lodash.isEmpty(props.staff)
//         ) {
//           ganttProjectChart.$resourcesStore.parse([
//             ...humanResources,
//             ...props.staff,
//           ]);
//         }
//       }
//     } else {
//       ganttProjectChart.$resourcesStore.parse(humanResources);
//     }
//   }, [props.staff]);

//   const dispatch = useDispatch();

//   useEffect(() => {
//     checkFeature("has_pimis_fields") &&
//       dispatch({
//         type: "SET_PROJECT_TITLE_HEADER",
//         payload: {
//           data: `${props?.project?.name}`,
//         },
//       });

//     return () => {
//       dispatch({
//         type: "SET_PROJECT_TITLE_HEADER",
//         payload: {
//           data: "",
//         },
//       });
//     };
//   }, [props?.project?.name]);

//   useEffect(() => {
//     dispatch(
//       setBreadCrumps([
//         {
//           to: `/gantt_chart`,
//           title: "Gantt chart",
//         },
//         { to: "", title: "Project Management" },
//       ])
//     );

//     return () => {
//       dispatch(setBreadCrumps([]));
//     };
//   }, [dispatch, props.project.name]);

//   function handleSetView(event) {
//     setProjectView(!projectView);
//     toggleGroups(event);
//   }
//   function handleSetCriticalPath(event) {
//     setCriticalPath(!criticalPath);
//     updateCriticalPath(event);
//   }
//   function handleSetFreeTime(event) {
//     setShowSlack(!showSlack);
//     toggleSlack(event);
//   }
//   function handleSetBaseline(event) {
//     setShowBaseline(!showBaseline);
//     toggleBaselines(event);
//   }
//   function handleSetFastTracking(event) {
//     setFastTracking(!fastTracking);
//     enableFastTracking(!fastTracking);
//   }
//   function handleSetProgressView(event) {
//     setShowProgress(!showProgress);
//     toggleProgressLine(event);
//   }

//   return (
//     <div style={{ width: "98%", height: "80vh" }}>
//       <div className="gantt_control">
//         <Button
//           variant="contained"
//           style={{ margin: 10 }}
//           onClick={handleSetView}
//         >
//           {!projectView ? "Resource View" : "Project View"}
//         </Button>
//         <Button
//           variant="contained"
//           style={{ margin: 10 }}
//           onClick={handleSetCriticalPath}
//         >
//           {criticalPath ? "Hide Critical Path" : "Critical Path"}
//         </Button>
//         <Button
//           variant="contained"
//           style={{ margin: 10 }}
//           onClick={handleSetFreeTime}
//         >
//           {showSlack ? "Hide Free Time" : "Free Time"}
//         </Button>
//         <Button
//           variant="contained"
//           style={{ margin: 10 }}
//           onClick={handleSetBaseline}
//         >
//           {showBaseline ? "Hide Baseline" : "Baseline"}
//         </Button>
//         <Button
//           variant="contained"
//           style={{ margin: 10 }}
//           onClick={handleSetFastTracking}
//         >
//           {fastTracking ? "Disable Fast Tracking" : "Enable Fast Tracking"}
//         </Button>
//         <Button
//           variant="contained"
//           style={{ margin: 10 }}
//           onClick={handleSetProgressView}
//         >
//           {showProgress ? "Hide Progress Line" : "Progress Line"}
//         </Button>
//         {/* <Button
//           variant="contained"
//           style={{ margin: 10 }}
//           onClick={() => {
//             if (ganttProjectChart) {
//               ganttProjectChart.exportToPDF({ raw: true });
//             }
//           }}
//         >
//           Export PDF
//         </Button> */}
//       </div>
//       <div
//         id="pm_gantt_here"
//         ref={ref}
//         style={{ width: "100%", height: "90%" }}
//       ></div>
//       {props.show && (
//         <ResourceDialog
//           {...props}
//           humanResources={humanResources}
//           onClose={props.onClose}
//         />
//       )}
//     </div>
//   );
// }

// export default ProjectResourcesManagmentForm;
