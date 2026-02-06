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

// function ProjectResourcesManagmentForm(props) {
//   const [ganttData, setGanttData] = useState({});
//   const [showSlack, setShowSlack] = useState(false);
//   const [criticalPath, setCriticalPath] = useState(false);
//   const [projectView, setProjectView] = useState(false);
//   const [showBaseline, setShowBaseline] = useState(false);
//   const [showProgress, setShowProgress] = useState(false);

//   function getDataFromProjectManagement() {
//     if (props && props.task && !lodash.isEmpty(props.task)) {
//       localStorage.setItem("staff", JSON.stringify(props.staff));
//       localStorage.setItem("task", JSON.stringify(props.task));
//       localStorage.setItem("link", JSON.stringify(props.link));

//       return {
//         data: props.task.map((item) => {
//           item.open = true;
//           return item;
//         }),
//         links: props.link || [],
//       };
//     }

//     return null;
//   }

//   function getDataFromProject() {}

//   function getDataProvider() {
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
//     });
//   }

//   useEffect(() => {
//     if (getDataFromProjectManagement()) {
//       window.projectManagementChart.init("gantt_here");
//       window.projectManagementChart.parse(getDataFromProjectManagement());
//     }
//   }, []);

//   return (
//     <div style={{ width: "98%", height: "80vh" }}>
//       <div id="gantt_here" style={{ width: "100%", height: "90%" }}></div>
//     </div>
//   );
// }

// export default ProjectResourcesManagmentForm;
