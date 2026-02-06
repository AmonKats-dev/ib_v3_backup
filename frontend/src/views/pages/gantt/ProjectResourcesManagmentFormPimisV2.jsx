// import "./resources.css";
// import React, { useMemo, useRef, useState } from "react";

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

// function ProjectResourcesManagmentFormPimis({ humanResources, ...props }) {
//   const [ganttInstance, setGanttInstance] = useState();
//   const ref = useRef(null);

//   useEffect(() => {
//     if (ref.current) {
//       setGanttInstance(
//         Gantt.getGanttInstance({
//           plugins: {
//             grouping: true,
//             auto_scheduling: true,
//             critical_path: true,
//             overlay: true,
//             marker: true,
//           },
//           container: ref.current,
//           config: {
//             work_time: true,
//             duration_unit: "minute",
//             auto_scheduling_compatibility: true,
//             auto_scheduling: true,
//             auto_scheduling_strict: true,
//             auto_scheduling_initial: true,
//             start_date: new Date(2020, 0, 1),
//             end_date: new Date(2021, 0, 1),
//           },
//           data: {
//             tasks: [
//               {
//                 id: 11,
//                 text: "Project #1",
//                 type: "project",
//                 open: true,
//                 parent: 0,
//               },
//               {
//                 id: 1,
//                 start_date: "05-04-2020",
//                 text: "1",
//                 duration: 1,
//                 parent: "11",
//                 type: "task",
//               },
//               {
//                 id: 2,
//                 start_date: "05-04-2020",
//                 text: "2",
//                 duration: 3,
//                 parent: "11",
//                 type: "task",
//               },
//               {
//                 id: 3,
//                 start_date: "05-04-2020",
//                 text: "3",
//                 duration: 3,
//                 parent: "11",
//                 type: "task",
//               },
//               {
//                 id: 4,
//                 start_date: "05-04-2020",
//                 text: "4",
//                 duration: 3,
//                 parent: "11",
//                 type: "task",
//               },
//               {
//                 id: 5,
//                 start_date: "05-04-2020",
//                 text: "5",
//                 duration: 1,
//                 parent: "11",
//                 type: "task",
//               },
//             ],
//             links: [
//               { source: "1", target: "2", type: "0", id: 1 },
//               { source: "1", target: "3", type: "0", id: 2 },
//               { source: "1", target: "4", type: "0", id: 3 },
//               { source: "2", target: "4", type: "0", id: 4 },
//               { source: "3", target: "4", type: "0", id: 5 },
//               { source: "4", target: "5", type: "0", id: 6 },
//             ],
//           },
//         })
//       );
//     }
//   }, [ref]);

//   console.log(ganttInstance);

//   return (
//     <div style={{ width: "98%", height: "80vh" }}>
//       <div className="gantt_control">
//         {/* <Button
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
//         </Button> */}
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

// export default ProjectResourcesManagmentFormPimis;
