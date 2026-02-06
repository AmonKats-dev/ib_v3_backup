// import "./resource.css";

// import React, { useState } from "react";

// import { Button } from "@material-ui/core";
// import { billionsFormatter } from "../../resources/Projects/Report/helpers";
// import { useDataProvider } from "react-admin";
// import { useEffect } from "react";
// //projectBased
// let toggleGroups;

// var taskData = {
//   data: [
//     {
//       id: 1,
//       text: "Rehabilitation and Upgrading of Urban Roads Project",
//       type: "project",
//       start_date: "02-04-2019 00:00",
//       duration: 17,
//       progress: 0.4,
//       // owner_id: 5,
//       parent: 0,
//     },
//     {
//       id: 2,
//       text: "Procurement of contractor",
//       type: "project",
//       start_date: "02-04-2019 00:00",
//       duration: 8,
//       progress: 0.6,
//       // owner_id: "5",
//       parent: "1",
//     },
//     {
//       id: 3,
//       text: "Geological Survey",
//       type: "project",
//       start_date: "11-04-2019 00:00",
//       duration: 8,
//       parent: "1",
//       progress: 0.6,
//       // owner_id: "5",
//     },
//     {
//       id: 4,
//       text: "Gravelling and Pavement",
//       type: "project",
//       start_date: "13-04-2019 00:00",
//       duration: 5,
//       parent: "1",
//       progress: 0.5,
//       // owner_id: "5",
//       priority: 3,
//     },
//     {
//       id: 5,
//       text: "Draft And Issue RfP",
//       type: "task",
//       start_date: "03-04-2019 00:00",
//       duration: 7,
//       parent: "2",
//       progress: 0.6,
//       // owner_id: "6",
//       priority: 1,
//     },
//     {
//       id: 6,
//       text: "Shortlisting ",
//       type: "task",
//       start_date: "03-04-2019 00:00",
//       duration: 7,
//       parent: "2",
//       progress: 0.6,
//       // owner_id: "7",
//       priority: 2,
//     },
//   ],
// };

// var humanResources = [
//   {
//     id: 1,
//     text: "Rehabilitation and Upgrading of Urban Roads Project",
//     parent: null,
//   },
//   {
//     id: 2,
//     text: "Procurement of Contractor",
//     parent: 1,
//   },
//   {
//     id: 3,
//     text: "Geological Survey",
//     parent: 1,
//   },
//   {
//     id: 4,
//     text: "Procurement of Land",
//     parent: 1,
//   },
//   {
//     id: 5,
//     text: "Gravel Construction",
//     parent: 1,
//   },
//   {
//     id: 6,
//     text: "Pavement",
//     parent: 1,
//   },
// ];

// function ProjectResourcesManagment(props) {
//   useEffect(() => {
//     window.gantt.plugins({
//       grouping: true,
//       auto_scheduling: true,
//       critical_path: true
//     });

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

//     window.gantt.templates.resource_cell_class = function (
//       start_date,
//       end_date,
//       resource,
//       tasks
//     ) {
//       var css = [];
//       css.push("resource_marker");
//       if (tasks.length <= 1) {
//         css.push("workday_ok");
//       } else {
//         css.push("workday_over");
//       }
//       return css.join(" ");
//     };

//     window.gantt.templates.resource_cell_value = function (
//       start_date,
//       end_date,
//       resource,
//       tasks
//     ) {
//       var html = "<div>";
//       if (resourceMode == "hours") {
//         html += tasks.length * 8;
//       } else {
//         html += tasks.length;
//       }
//       html += "</div>";
//       return html;
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
//         if (window.gantt.$resourcesStore.hasChild(resource.id)) {
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
//         if (window.gantt.$resourcesStore.hasChild(resource.id)) {
//           css.push("group_row");
//         }

//         return css.join(" ");
//       },
//     };
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
//         name: "owner",
//         height: 22,
//         map_to: "owner_id",
//         type: "select",
//         options: window.gantt.serverList("people"),
//       },
//       { name: "time", type: "duration", map_to: "auto" },
//     ];

//     function getResourceTasks(resourceId) {
//       var store = window.gantt.getDatastore(window.gantt.config.resource_store),
//         field = window.gantt.config.resource_property,
//         tasks;

//       if (store.hasChild(resourceId)) {
//         tasks = window.gantt.getTaskBy(field, store.getChildren(resourceId));
//       } else {
//         tasks = window.gantt.getTaskBy(field, resourceId);
//       }
//       return tasks;
//     }

//     var resourceConfig = {
//       scale_height: 30, //TODO change perios
//       scales: [{ unit: "day", step: 1, date: "%d %M" }],
//       columns: [
//         {
//           name: "name",
//           label: "Name",
//           tree: true,
//           width: 300,
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
//             var tasks = getResourceTasks(resource.id);

//             var totalToDo = 0,
//               totalDone = 0;
//             tasks.forEach(function (task) {
//               totalToDo += task.duration;
//               totalDone += task.duration * (task.progress || 0);
//             });

//             var completion = 0;
//             if (totalToDo) {
//               completion = Math.floor((totalDone / totalToDo) * 100);
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
//             var tasks = getResourceTasks(resource.id);
//             var totalDuration = 0;
//             tasks.forEach(function (task) {
//               totalDuration += task.duration;
//             });

//             return (totalDuration || 0) * 8 + "h";
//           },
//           resize: true,
//         },

//         {
//           name: "capacity",
//           label: "Capacity",
//           align: "center",
//           template: function (resource) {
//             var store = window.gantt.getDatastore(
//               window.gantt.config.resource_store
//             );
//             var n = store.hasChild(resource.id)
//               ? store.getChildren(resource.id).length
//               : 1;

//             var state = window.gantt.getState();

//             return (
//               window.gantt.calculateDuration(state.min_date, state.max_date) *
//                 n *
//                 8 +
//               "h"
//             );
//           },
//         },
//       ],
//     };

//     window.gantt.config.scales = [
//       { unit: "month", step: 1, format: "%F, %Y" },
//       { unit: "day", step: 1, format: "%d %M" },
//     ];

//     window.gantt.config.auto_scheduling = true;
//     window.gantt.config.auto_scheduling_strict = true;
//     window.gantt.config.work_time = true;
//     window.gantt.config.columns = [
//       {
//         name: "text",
//         label: "Project / Outputs / Activities",
//         tree: true,
//         width: 300,
//         resize: true,
//       },
//       {
//         name: "start_date",
//         label: "Start Date",
//         align: "center",
//         width: 80,
//         resize: true,
//       },
//       {
//         name: "owner",
//         align: "center",
//         width: 100,
//         label: "Owner",
//         template: function (task) {
//           if (task.type == window.gantt.config.types.project) {
//             return "";
//           }

//           var store = window.gantt.getDatastore(
//             window.gantt.config.resource_store
//           );
//           var owner = store.getItem(
//             task[window.gantt.config.resource_property]
//           );
//           if (owner) {
//             return owner.text;
//           } else {
//             return "Unassigned";
//           }
//         },
//         resize: true,
//       },
//       { name: "duration", width: 80, align: "center", resize: true },
//       { name: "add", width: 44 },
//     ];

//     window.gantt.config.resource_store = "resource";
//     window.gantt.config.resource_property = "owner_id";
//     window.gantt.config.order_branch = true;
//     window.gantt.config.open_tree_initially = true;
//     window.gantt.config.scale_height = 50;
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
//               view: "resourceTimeline",
//               scrollX: "scrollHor",
//               scrollY: "resourceVScroll",
//             },
//             { view: "scrollbar", id: "resourceVScroll", group: "vertical" },
//           ],
//         },
//         { view: "scrollbar", id: "scrollHor" },

//       ],
//     };

//     var resourceMode = "hours";
//     window.gantt.attachEvent("onGanttReady", function () {
//       var radios = [].slice.call(
//         window.gantt.$container.querySelectorAll("input[type='radio']")
//       );
//       radios.forEach(function (r) {
//         window.gantt.event(r, "change", function (e) {
//           var radios = [].slice.call(
//             window.gantt.$container.querySelectorAll("input[type='radio']")
//           );
//           radios.forEach(function (r) {
//             r.parentNode.className = r.parentNode.className.replace(
//               "active",
//               ""
//             );
//           });

//           if (this.checked) {
//             resourceMode = this.value;
//             this.parentNode.className += " active";
//             window.gantt
//               .getDatastore(window.gantt.config.resource_store)
//               .refresh();
//           }
//         });
//       });
//     });

//     window.gantt.$resourcesStore = window.gantt.createDatastore({
//       name: window.gantt.config.resource_store,
//       type: "treeDatastore",
//       initItem: function (item) {
//         item.parent = item.parent || window.gantt.config.root_id;
//         item[window.gantt.config.resource_property] = item.parent;
//         item.open = true;
//         return item;
//       },
//     });

//     window.gantt.$resourcesStore.attachEvent("onAfterSelect", function (id) {
//       window.gantt.refreshData();
//     });


//     toggleGroups = function (input) {
//       window.gantt.$groupMode = !window.gantt.$groupMode;
//       if (window.gantt.$groupMode) {
//         input.value = "show window.gantt view";

//         var groups = window.gantt.$resourcesStore
//           .getItems()
//           .map(function (item) {
//             var group = window.gantt.copy(item);
//             group.group_id = group.id;
//             group.id = window.gantt.uid();
//             return group;
//           });

//         window.gantt.groupBy({
//           groups: groups,
//           relation_property: window.gantt.config.resource_property,
//           group_id: "group_id",
//           group_text: "text",
//         });
//       } else {
//         input.value = "show resource view";
//         window.gantt.groupBy(false);
//       }
//     };

//     window.gantt.$resourcesStore.attachEvent("onParse", function () {
//       var people = [];
//       window.gantt.$resourcesStore.eachItem(function (res) {
//         if (!window.gantt.$resourcesStore.hasChild(res.id)) {
//           var copy = window.gantt.copy(res);
//           copy.key = res.id;
//           copy.label = res.text;
//           people.push(copy);
//         }
//       });
//       window.gantt.updateCollection("people", people);
//     });
    
//     window.gantt.$resourcesStore.parse(
//       [
//         ...humanResources,
//         ...props.staff,
//       ] || humanResources
//     );

//     // window.gantt.config.columns = [
//     //   {
//     //     name: "text",
//     //     label: "Project / Outputs / Activities",
//     //     tree: true,
//     //     width: 500,
//     //     resize: true,
//     //   },
//     //   {
//     //     name: "duration",
//     //     align: "center",
//     //   },
//     //   {
//     //     name: "add",
//     //   },
//     // ];

//     // window.gantt.config.layout = {
//     //   css: "gantt_container",
//     //   rows: [
//     //     {
//     //       cols: [
//     //         { view: "grid", width: 250, scrollY: "scrollVer" },
//     //         { resizer: true, width: 1 },
//     //         { view: "timeline", scrollX: "scrollHor", scrollY: "scrollVer" },
//     //         { resizer: true, width: 1 },
//     //       ],
//     //     },
//     //     { view: "scrollbar", id: "scrollHor", height: 20 },
//     //   ],
//     // };

//     // window.gantt.config.duration_unit = "year";
//     // window.gantt.config.duration_step = 1;

//     // window.gantt.config.scales = [{ unit: "year", step: 1, format: "%Y" }];

//     // window.gantt.config.date_format = "%Y";
//     // window.gantt.templates.task_text = function () {
//     //   return "";
//     // };

//     window.gantt.config.scale_unit = "year";
//     window.gantt.config.step = 1;
//     window.gantt.config.date_scale = "%Y";
//     window.gantt.config.duration_unit = "year";
//     window.gantt.config.duration_step = 1;
//     window.gantt.config.scale_height = 70;
//     window.gantt.config.round_dnd_dates = false;
//     window.gantt.config.date_format = '%Y';

//     window.gantt.init("gantt_here");
//     window.gantt.parse(taskData);
//   }, []);

//   return (
//     <div style={{ width: "98%", height: "80vh" }}>
//       <div class="gantt_control">
//         <Button
//           variant="contained"
//           style={{ margin: 10 }}
//           onClick={toggleGroups}
//         >
//           Toggle Project / Resource view
//         </Button>
//         <Button
//           variant="contained"
//           style={{ margin: 10 }}
//           onClick={toggleGroups}
//         >
//           Show / Hide Critical Path
//         </Button>
//         <Button
//           variant="contained"
//           style={{ margin: 10 }}
//           onClick={toggleGroups}
//         >
//           Export PDF
//         </Button>
//       </div>
//       <div id="gantt_here" style={{ width: "100%", height: "90%" }}></div>
//     </div>
//   );
// }

// export default ProjectResourcesManagment;
