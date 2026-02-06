// import "./styles.css";

// import React, { useState } from "react";

// // import { Button } from "@material-ui/core";
// // import TrendingUpIcon from "@material-ui/icons/TrendingUp";
// // import { useEffect } from "react";
// // import { useSelector } from "react-redux";

// // import { Fragment } from "react";

// // var taskData = {
// //   data: [
// //     {
// //       id: 1,
// //       text: "Rehabilitation and Upgrading of Urban Roads Project",
// //       type: "project",
// //       start_date: "02-04-2019 00:00",
// //       duration: 17,
// //       progress: 0.4,
// //       owner_id: 5,
// //       parent: 0,
// //     },
// //     {
// //       id: 2,
// //       text: "Procurement of contractor",
// //       type: "project",
// //       start_date: "02-04-2019 00:00",
// //       duration: 8,
// //       progress: 0.6,
// //       owner_id: "5",
// //       parent: "1",
// //     },
// //     {
// //       id: 3,
// //       text: "Geological Survey",
// //       type: "project",
// //       start_date: "11-04-2019 00:00",
// //       duration: 8,
// //       parent: "1",
// //       progress: 0.6,
// //       owner_id: "5",
// //     },
// //     {
// //       id: 4,
// //       text: "Gravelling and Pavement",
// //       type: "project",
// //       start_date: "13-04-2019 00:00",
// //       duration: 5,
// //       parent: "1",
// //       progress: 0.5,
// //       owner_id: "5",
// //       priority: 3,
// //     },
// //     {
// //       id: 5,
// //       text: "Draft And Issue RfP",
// //       type: "task",
// //       start_date: "03-04-2019 00:00",
// //       duration: 7,
// //       parent: "2",
// //       progress: 0.6,
// //       owner_id: "6",
// //       priority: 1,
// //     },
// //     {
// //       id: 6,
// //       text: "Shortlisting ",
// //       type: "task",
// //       start_date: "03-04-2019 00:00",
// //       duration: 7,
// //       parent: "2",
// //       progress: 0.6,
// //       owner_id: "7",
// //       priority: 2,
// //     },
// //   ],
// // };
// // let toggleOverlayFunc;

// function ProjectManagment(props) {
//   const [loadFunc, setLoadFunc] = useState(() => {});

//   // useEffect(() => {
//   //   window.gantt.plugins({
//   //     marker: true,
//   //     overlay: true,
//   //   });

//   //   var overlayControl = window.gantt.ext.overlay;
//   //   function toggleOverlay() {
//   //     if (overlayControl.isOverlayVisible(lineOverlay)) {
//   //       window.gantt.config.readonly = false;
//   //       overlayControl.hideOverlay(lineOverlay);
//   //       window.gantt.$root.classList.remove('overlay_visible');
//   //     } else {
//   //       window.gantt.config.readonly = true;
//   //       overlayControl.showOverlay(lineOverlay);
//   //       window.gantt.$root.classList.add('overlay_visible');
//   //     }
//   //   }
//   //   toggleOverlayFunc = toggleOverlay;
//   //   setLoadFunc(toggleOverlay);

//   //   function getChartScaleRange() {
//   //     var tasksRange = window.gantt.getSubtaskDates();
//   //     var cells = [];
//   //     var scale = window.gantt.getScale();
//   //     if (!tasksRange.start_date) {
//   //       return scale.trace_x;
//   //     }

//   //     scale.trace_x.forEach(function (date) {
//   //       if (date >= tasksRange.start_date && date <= tasksRange.end_date) {
//   //         cells.push(date);
//   //       }
//   //     });
//   //     return cells;
//   //   }

//   //   function getProgressLine() {
//   //     var tasks = window.gantt.getTaskByTime();
//   //     var scale = window.gantt.getScale();
//   //     var step = scale.unit;

//   //     var timegrid = {};

//   //     var totalDuration = 0;

//   //     window.gantt.eachTask(function (task) {
//   //       if (window.gantt.isSummaryTask(task)) {
//   //         return;
//   //       }
//   //       if (!task.duration) {
//   //         return;
//   //       }

//   //       var currDate = window.gantt.date[scale.unit + '_start'](new Date(task.start_date));
//   //       while (currDate < task.end_date) {
//   //         var date = currDate;
//   //         currDate = window.gantt.date.add(currDate, 1, step);

//   //         if (!window.gantt.isWorkTime({ date: date, task: task, unit: step })) {
//   //           continue;
//   //         }

//   //         var timestamp = currDate.valueOf();
//   //         if (!timegrid[timestamp]) {
//   //           timegrid[timestamp] = {
//   //             planned: 0,
//   //             real: 0,
//   //           };
//   //         }

//   //         timegrid[timestamp].planned += 1;
//   //         if (date <= today) {
//   //           timegrid[timestamp].real += 1 * (task.progress || 0);
//   //         }

//   //         totalDuration += 1;
//   //       }
//   //     });

//   //     var cumulativePlannedDurations = [];
//   //     var cumulativeRealDurations = [];
//   //     var cumulativePredictedDurations = [];
//   //     var totalPlanned = 0;
//   //     var totalReal = 0;

//   //     var chartScale = getChartScaleRange();
//   //     var dailyRealProgress = -1;
//   //     var totalPredictedProgress = 0;
//   //     for (var i = 0; i < chartScale.length; i++) {
//   //       var start = new Date(chartScale[i]);
//   //       var end = window.gantt.date.add(start, 1, step);
//   //       var cell = timegrid[start.valueOf()] || { planned: 0, real: 0 };
//   //       totalPlanned = cell.planned + totalPlanned;

//   //       cumulativePlannedDurations.push(totalPlanned);
//   //       if (start <= today) {
//   //         totalReal = (cell.real || 0) + totalReal;
//   //         cumulativeRealDurations.push(totalReal);
//   //         cumulativePredictedDurations.push(null);
//   //       } else {
//   //         if (dailyRealProgress < 0) {
//   //           dailyRealProgress = totalReal / cumulativeRealDurations.length;
//   //           totalPredictedProgress = totalReal;
//   //           cumulativePredictedDurations.pop();
//   //           cumulativePredictedDurations.push(totalPredictedProgress);
//   //         }
//   //         totalPredictedProgress += dailyRealProgress;
//   //         cumulativePredictedDurations.push(totalPredictedProgress);
//   //       }
//   //     }

//   //     for (var i = 0; i < cumulativePlannedDurations.length; i++) {
//   //       cumulativePlannedDurations[i] = Math.round((cumulativePlannedDurations[i] / totalPlanned) * 100);
//   //       if (cumulativeRealDurations[i] !== undefined) {
//   //         cumulativeRealDurations[i] = Math.round((cumulativeRealDurations[i] / totalPlanned) * 100);
//   //       }

//   //       if (cumulativePredictedDurations[i] !== null) {
//   //         cumulativePredictedDurations[i] = Math.round((cumulativePredictedDurations[i] / totalPlanned) * 100);
//   //       }
//   //     }
//   //     return {
//   //       planned: cumulativePlannedDurations,
//   //       real: cumulativeRealDurations,
//   //       predicted: cumulativePredictedDurations,
//   //     };
//   //   }

//   //   var dateToStr = window.gantt.date.date_to_str('%F %j, %Y');
//   //   var today = new Date(2019, 3, 14);
//   //   window.gantt.addMarker({
//   //     start_date: today,
//   //     css: 'today',
//   //     text: 'Today',
//   //     title: 'Today: ' + dateToStr(today),
//   //   });
//   //   var projectEnd = new Date(2019, 3, 19);
//   //   window.gantt.addMarker({
//   //     start_date: projectEnd,
//   //     text: 'Project end',
//   //     title: 'Project end: ' + dateToStr(today),
//   //   });

//   //   window.gantt.config.open_tree_initially = true;

//   //   function getScalePaddings() {
//   //     var scale = window.gantt.getScale();
//   //     var dataRange = window.gantt.getSubtaskDates();

//   //     var chartScale = getChartScaleRange();
//   //     var newWidth = scale.col_width;
//   //     var padding = {
//   //       left: 0,
//   //       right: 0,
//   //     };

//   //     if (dataRange.start_date) {
//   //       var yScaleLabelsWidth = 48;
//   //       // fine tune values in order to align chart with the scale range
//   //       padding.left = window.gantt.posFromDate(dataRange.start_date) - yScaleLabelsWidth;
//   //       padding.right = scale.full_width - window.gantt.posFromDate(dataRange.end_date) - yScaleLabelsWidth;
//   //       padding.top = window.gantt.config.row_height - 12;
//   //       padding.bottom = window.gantt.config.row_height - 12;
//   //     }
//   //     return padding;
//   //   }

//   //   var myChart;
//   //   var lineOverlay = overlayControl.addOverlay(function (container) {
//   //     var scaleLabels = [];

//   //     var chartScale = getChartScaleRange();

//   //     chartScale.forEach(function (date) {
//   //       scaleLabels.push(dateToStr(date));
//   //     });

//   //     var values = getProgressLine();

//   //     var canvas = document.createElement('canvas');
//   //     container.appendChild(canvas);
//   //     canvas.style.height = container.offsetHeight + 'px';
//   //     canvas.style.width = container.offsetWidth + 'px';

//   //     var ctx = canvas.getContext('2d');
//   //     if (myChart) {
//   //       myChart.destroy();
//   //     }
//   //     myChart = new window.Chart(ctx, {
//   //       type: 'line',
//   //       data: {
//   //         datasets: [
//   //           {
//   //             label: 'Planned progress',
//   //             backgroundColor: '#001eff',
//   //             borderColor: '#001eff',
//   //             data: values.planned,
//   //             fill: false,
//   //             cubicInterpolationMode: 'monotone',
//   //           },
//   //           {
//   //             label: 'Real progress',
//   //             backgroundColor: '#ff5454',
//   //             borderColor: '#ff5454',
//   //             data: values.real,
//   //             fill: false,
//   //             cubicInterpolationMode: 'monotone',
//   //           },
//   //           {
//   //             label: 'Real progress (predicted)',
//   //             backgroundColor: '#ff5454',
//   //             borderColor: '#ff5454',
//   //             data: values.predicted,
//   //             borderDash: [5, 10],
//   //             fill: false,
//   //             cubicInterpolationMode: 'monotone',
//   //           },
//   //         ],
//   //       },
//   //       options: {
//   //         responsive: true,
//   //         maintainAspectRatio: false,
//   //         layout: {
//   //           padding: getScalePaddings(),
//   //         },
//   //         onResize: function (chart, newSize) {
//   //           var dataRange = window.gantt.getSubtaskDates();
//   //           if (dataRange.start_date) {
//   //             // align chart with the scale range
//   //             chart.options.layout.padding = getScalePaddings();
//   //           }
//   //         },
//   //         legend: {
//   //           display: false,
//   //         },
//   //         tooltips: {
//   //           mode: 'index',
//   //           intersect: false,
//   //           callbacks: {
//   //             label: function (tooltipItem, data) {
//   //               var dataset = data.datasets[tooltipItem.datasetIndex];
//   //               return dataset.label + ': ' + dataset.data[tooltipItem.index] + '%';
//   //             },
//   //           },
//   //         },
//   //         hover: {
//   //           mode: 'nearest',
//   //           intersect: true,
//   //         },
//   //         scales: {
//   //           xAxes: [
//   //             {
//   //               labels: scaleLabels,
//   //               gridLines: {
//   //                 display: false,
//   //               },
//   //               ticks: {
//   //                 display: false,
//   //               },
//   //             },
//   //             {
//   //               position: 'top',
//   //               labels: scaleLabels,
//   //               gridLines: {
//   //                 display: false,
//   //               },
//   //               ticks: {
//   //                 display: false,
//   //               },
//   //             },
//   //           ],
//   //           yAxes: [
//   //             {
//   //               display: true,
//   //               gridLines: {
//   //                 display: false,
//   //               },
//   //               ticks: {
//   //                 display: true,
//   //                 min: 0,
//   //                 max: 100,
//   //                 stepSize: 10,
//   //                 callback: function (current) {
//   //                   if (current > 100) {
//   //                     return '';
//   //                   }
//   //                   return current + '%';
//   //                 },
//   //               },
//   //             },
//   //             {
//   //               display: true,
//   //               position: 'right',
//   //               gridLines: {
//   //                 display: false,
//   //               },
//   //               ticks: {
//   //                 display: true,
//   //                 min: 0,
//   //                 max: 100,
//   //                 stepSize: 10,
//   //                 callback: function (current) {
//   //                   if (current > 100) {
//   //                     return '';
//   //                   }
//   //                   return current + '%';
//   //                 },
//   //               },
//   //             },
//   //           ],
//   //         },
//   //       },
//   //     });
//   //     return canvas;
//   //   });

//   //   window.gantt.config.columns = [
//   //     {
//   //       name: 'text',
//   //       label: 'Project / Outputs / Activities',
//   //       tree: true,
//   //       width: 300,
//   //       resize: true,
//   //     },
//   //     {
//   //       name: 'duration',
//   //       align: 'center',
//   //     },
//   //     {
//   //       name: 'add',
//   //     },
//   //   ];
//   //   window.gantt.config.scale_unit = 'year';
//   //   window.gantt.config.step = 1;
//   //   window.gantt.config.date_scale = '%Y';
//   //   window.gantt.config.duration_unit = 'year';
//   //   window.gantt.config.duration_step = 1;
//   //   window.gantt.config.scale_height = 70;
//   //   window.gantt.config.round_dnd_dates = false;

//   //   // window.gantt.clearAll();
//   //   window.gantt.init('gantt_here');
//   //   window.gantt.parse(taskData);
//   // }, []);

//   // return (
//   //   <div style={{ width: '98%', height: '80vh' }}>
//   //     <div class='gantt_control'>
//   //       <Button
//   //         startIcon={<TrendingUpIcon />}
//   //         variant='contained'
//   //         style={{ margin: 10 }}
//   //         onClick={() => toggleOverlayFunc()}
//   //       >
//   //         View Project Planned / Fact Data
//   //       </Button>
//   //     </div>
//   //     <div id='gantt_here' style={{ width: '100%', height: '100%' }}></div>
//   //   </div>
//   // );

//   return (
//     <div style={{ width: '98%', height: '80vh' }}>
//       {/* <div class='gantt_control'>
//         <Button
//           startIcon={<TrendingUpIcon />}
//           variant='contained'
//           style={{ margin: 10 }}
//           onClick={() => toggleOverlayFunc()}
//         >
//           View Project Planned / Fact Data
//         </Button>
//       </div>
//       <div id='gantt_here' style={{ width: '100%', height: '100%' }}></div> */}
//     </div>
//   );
// }

// export default ProjectManagment;
