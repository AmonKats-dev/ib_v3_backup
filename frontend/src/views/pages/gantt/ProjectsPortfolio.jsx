// import './styles.css';

// import {
//   Button,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   Table,
//   TableCell,
//   TableHead,
//   TableRow,
// } from '@material-ui/core';
// import { PROJECT_PHASES, PROJECT_PHASE_STATUS, PROJECT_STATUS } from '../../../constants/common';
// import React, { useState } from 'react';

// import { SelectInput, useTranslate } from 'react-admin';
// import TrendingUpIcon from '@material-ui/icons/TrendingUp';
// import { billionsFormatter } from '../../resources/Projects/Report/helpers';
// import lodash from 'lodash';
// import moment from 'moment';
// import { useDataProvider } from 'react-admin';
// import { useEffect } from 'react';
// import { useHistory } from 'react-router-dom';
// //projectBased
// import { useSelector } from 'react-redux';

// function getActivitiesForOutput(record, outputId) {
//   return record.activities.filter((activity) => activity.output_ids.includes(outputId));
// }

// function ProjectsPortfolio(props) {
//   const appConfig = useSelector((state) => state.app.appConfig);
//   const { organizational_config } = appConfig;
//   const [organizationId, setOrganizationId] = React.useState();
//   const [sectorId, setSectorId] = React.useState();
//   const [voteId, setVoteId] = React.useState();
//   const [phaseId, setPhaseId] = React.useState();
//   const [statusId, setStatusId] = React.useState();
//   const [organizations, setOrganizations] = React.useState();

//   const [projects, setProjects] = useState(null);
//   const dataProvider = useDataProvider();
//   let toggleOverlayFunc;
//   let history = useHistory();
//   const translate = useTranslate();

//   function getSectors(level) {
//     if (!organizations) return [];

//     return organizations.filter((item) => item.level === level);
//   }

//   useEffect(() => {
//     if (projects) {
//       let projectsData = projects
//         .filter((item) => (voteId ? item.project_organization.parent.id === Number(voteId) : true))
//         .filter((item) => (phaseId ? item.phase_id === Number(phaseId) : true))
//         .filter((item) => (statusId ? item.project_status === statusId : true));

//       projectsData = projectsData.map((item) => {
//         const startDateYear = moment(item.current_project_detail.start_date);
//         const endDateYear = moment(item.current_project_detail.end_date);
//         const dateDiff = endDateYear.diff(startDateYear, 'years');
//         item.text = item.name;
//         item.type = window.gantt.config.types.project;
//         item.parent = item.output_id;
//         item.start_date = moment(item.current_project_detail.start_date).format('YYYY');
//         // item.end_date = moment(item.current_project_detail.end_date).format('DD-MM-YYYY');
//         item.duration = dateDiff;
//         item.total_cost = 0;
//         return item;
//       });

//       let outputsData = [];
//       let activities = [];
//       projectsData.forEach((project) => {
//         outputsData = [
//           ...outputsData,
//           ...project.current_project_detail.outputs.map((output) => {
//             let totalCost = 0;
//             const activitiesForMe = getActivitiesForOutput(project.current_project_detail, output.id);
//             activitiesForMe &&
//               activitiesForMe.forEach((item) => {
//                 lodash.sumBy(item.investments, (invest) =>
//                   lodash.keys(invest.costs).forEach((key) => {
//                     totalCost += Number(invest.costs[key]);
//                   })
//                 );
//               });

//             const output_new = {};
//             output_new.text = output.name;
//             output_new.parent = project.id;
//             output_new.id = 10000 + output.id;
//             output_new.total_cost = totalCost;
//             project.total_cost += totalCost;
//             // output.start_date = '01-01-2020';
//             // output.duration = 1;
//             return output_new;
//           }),
//         ];
//       });

//       projectsData.forEach((project) => {
//         activities = [
//           ...activities,
//           ...project.current_project_detail.activities.map((activity) => {
//             const startDateYear = moment(activity.start_date);
//             const endDateYear = moment(activity.end_date);
//             const dateDiff = endDateYear.diff(startDateYear, 'years');
//             const activity_new = {};

//             activity_new.text = activity.name;
//             activity_new.id = 100000 + activity.id;
//             activity_new.parent = 10000 + activity.output_id;
//             activity_new.start_date = moment(activity.start_date).format('YYYY');
//             activity_new.duration = dateDiff === 0 ? 1 : dateDiff;
//             activity_new.total_cost = 0;

//             activity.investments.forEach((invest) => {
//               lodash.keys(invest.costs).forEach((year) => {
//                 activity_new.total_cost += parseFloat(invest.costs[year]);
//               });
//             });

//             // project.total_cost += activity.total_cost;

//             return activity_new;
//           }),
//         ];
//       });

//       const ganttData = {
//         data: [...projectsData, ...outputsData, ...activities],
//       };

//       window.gantt.clearAll();
//       window.gantt.parse(ganttData);
//     }
//   }, [projects, sectorId, voteId, statusId, phaseId]);

//   useEffect(() => {
//     dataProvider
//       .custom('reports', {
//         type: 'projects-report',
//         method: 'GET',
//       })
//       .then((response) => {
//         if (response && response.data) {
//           setProjects(response.data);
//         }
//       });
//     dataProvider.getListOfAll('organizations', {}).then((response) => {
//       if (response && response.data) {
//         setOrganizations(response.data);
//       }
//     });
//   }, []);

//   useEffect(() => {
//     window.gantt.config.columns = [
//       {
//         name: 'text',
//         label: 'Project / Outputs / Activities',
//         tree: true,
//         width: 500,
//         resize: true,
//       },
//       {
//         name: 'duration',
//         align: 'center',
//       },
//     ];

//     window.gantt.attachEvent('onTaskClick', function (id, e) {
//       if (id < 10000 && !e.target.classList.contains('gantt_tree_icon')) {
//         history.push('/projects/' + id + '/show');
//       }
//       return true;
//     });

//     var secondGridColumns = {
//       columns: [
//         {
//           align: 'center',
//           fontWeight: 'bold',
//           name: 'total_cost',
//           width: 100,
//           label: `Total Cost (${translate("titles.currency")})`,
//           template: function (task) {
//             return billionsFormatter(task.total_cost);
//           },
//         },
//       ],
//     };

//     window.gantt.config.layout = {
//       css: 'gantt_container',
//       rows: [
//         {
//           cols: [
//             { view: 'grid', width: 320, scrollY: 'scrollVer' },
//             { resizer: true, width: 1 },
//             { view: 'timeline', scrollX: 'scrollHor', scrollY: 'scrollVer' },
//             { resizer: true, width: 1 },
//             {
//               view: 'grid',
//               width: 140,
//               bind: 'task',
//               scrollY: 'scrollVer',
//               config: secondGridColumns,
//             },
//             { view: 'scrollbar', id: 'scrollVer' },
//           ],
//         },
//         { view: 'scrollbar', id: 'scrollHor', height: 20 },
//       ],
//     };

//     window.gantt.config.open_tree_initially = true;

//     window.gantt.config.scale_unit = 'year';
//     window.gantt.config.step = 1;
//     window.gantt.config.date_scale = '%Y';
//     window.gantt.config.duration_unit = 'year';
//     window.gantt.config.duration_step = 1;
//     window.gantt.config.scale_height = 70;
//     window.gantt.config.round_dnd_dates = false;
//     window.gantt.config.date_format = '%Y';
//     // window.gantt.refreshData();
//     // window.gantt.init('gantt_here');
//   }, []);

//   useEffect(() => {
//     if (localStorage.getItem('ganttChartInit') && localStorage.getItem('ganttChartInit') !== "project_portfolio") {
//       localStorage.removeItem('ganttChartInit');
//       history.go(0);
//     }
//     window.gantt.init('gantt_here');
//     localStorage.setItem('ganttChartInit', "project_portfolio");

//     return () => {
//       localStorage.setItem('ganttChartInit', "project_portfolio");
//     };
//   }, [])

//   if (localStorage.getItem('ganttChartInit') && localStorage.getItem('ganttChartInit') !== "project_portfolio") { return null; }

//   return (
//     <div style={{ width: '98%', height: '80vh' }}>
//       <Table style={{ display: 'flex' }}>
//         <TableHead>
//           <TableRow>
//             <TableCell>
//               <FormControl variant='outlined'>
//                 <InputLabel style={{ transform: 'translate(14px, -12px) scale(0.75)' }}>Sector</InputLabel>
//                 <Select
//                   style={{ width: '220px' }}
//                   placeholder='Sector'
//                   value={sectorId}
//                   onChange={(event) => {
//                     setSectorId(event.target.value);
//                     setVoteId('');
//                   }}
//                 >
//                   <MenuItem value=''>
//                     <em>-</em>
//                   </MenuItem>
//                   {getSectors(1).map((item) => (
//                     <MenuItem value={item.id}>{item.name}</MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </TableCell>
//             <TableCell>
//               <FormControl variant='outlined'>
//                 <InputLabel style={{ transform: 'translate(14px, -12px) scale(0.75)' }}>Vote</InputLabel>
//                 <Select
//                   style={{ width: '220px' }}
//                   placeholder='Sector'
//                   value={voteId}
//                   onChange={(event) => {
//                     setVoteId(event.target.value);
//                   }}
//                 >
//                   <MenuItem value=''>
//                     <em>-</em>
//                   </MenuItem>
//                   {getSectors(2)
//                     .filter((item) => (sectorId ? item.parent_id === sectorId : true))
//                     .map((item) => (
//                       <MenuItem value={item.id}>{item.name}</MenuItem>
//                     ))}
//                 </Select>
//               </FormControl>
//             </TableCell>

//             <TableCell>
//               <FormControl variant='outlined'>
//                 <InputLabel style={{ transform: 'translate(14px, -12px) scale(0.75)' }}>Phase</InputLabel>
//                 <Select
//                   style={{ width: '220px' }}
//                   placeholder='Phase'
//                   value={phaseId}
//                   onChange={(event) => {
//                     setPhaseId(event.target.value);
//                   }}
//                 >
//                   <MenuItem value=''>
//                     <em>-</em>
//                   </MenuItem>
//                   {lodash.keys(PROJECT_PHASES).map((phase) => (
//                     <MenuItem value={phase}>
//                       <em>{PROJECT_PHASES[phase]}</em>
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </TableCell>
//             <TableCell>
//               <FormControl variant='outlined'>
//                 <InputLabel style={{ transform: 'translate(14px, -12px) scale(0.75)' }}>Status</InputLabel>
//                 <Select
//                   style={{ width: '220px' }}
//                   placeholder='Phase'
//                   value={statusId}
//                   onChange={(event) => {
//                     setPhaseId(event.target.value);
//                   }}
//                 >
//                   <MenuItem value=''>
//                     <em>-</em>
//                   </MenuItem>
//                   {lodash.keys(PROJECT_PHASE_STATUS).map((status) => (
//                     <MenuItem value={status}>
//                       <em>{PROJECT_PHASE_STATUS[status]}</em>
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </TableCell>
//           </TableRow>
//         </TableHead>
//       </Table>

//       <br />
//       <br />
//       <div id='gantt_here' style={{ width: '100%', height: '100%' }}></div>
//     </div>
//   );
// }

// export default ProjectsPortfolio;
