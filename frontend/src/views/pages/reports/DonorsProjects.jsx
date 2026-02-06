// in src/Dashboard.js
import * as React from "react";

import {
  Datagrid,
  Filter,
  FunctionField,
  List,
  Pagination,
  ReferenceInput,
  SelectInput,
  TextField,
  Title,
  useDataProvider,
  useTranslate,
} from "react-admin";
import { Grid, Typography } from "@material-ui/core";

import Box from "@material-ui/core/Box";
import { dateFormatter } from "../../../helpers";
import lodash from "lodash";
import { makeStyles } from "@material-ui/core";
import ExportActions from "./ExportActions";
import { EXPORT_TYPES } from "../../../constants/common";

const useStyles = makeStyles((theme) => ({
  topGroup: {
    display: "flex",
    justifyContent: "space-around",
  },
  title: {
    textAlign: "left",
    fontSize: "15px",
    fontWeight: "bold",
    paddingLeft: "30px",
    margin: "10px auto",
  },
}));

const EmptyDashboard = (props) => {
  const { loading, loaded, total } = props;
  if (total === 0 && !loading && loaded) {
    return (
      <Box textAlign="center" m={3}>
        <Typography variant="h5" paragraph>
          No projects are in this status
        </Typography>
      </Box>
    );
  }
  return <Pagination {...props} />;
};

function DonorsProjects(props) {
  const [funds, setFunds] = React.useState([]);
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const classes = useStyles();

  React.useEffect(() => {
    dataProvider.getListOfAll("funds", {}).then((response) => {
      setFunds(response.data);
    });
  }, []);

  function getFundById(id) {
    const fund = lodash.find(funds, (item) => Number(item.id) === Number(id));
    return fund ? `${fund.code} - ${fund.name}` : "-";
  }

  return (
    <Grid container spacing={3}>
      <ExportActions
        reportId="report-container"
        title="Donors Projects"
        exportTypes={[EXPORT_TYPES.WORD, EXPORT_TYPES.PDF, EXPORT_TYPES.XLS]}
      />
      <Grid item xs={12} id="report-container">
        <Typography variant="h4" style={{ marginBottom: 20 }}>
          {translate(
            `resources.${
              props.location &&
              props.location.pathname.slice(
                1,
                props.location && props.location.pathname.length
              )
            }.name`
          )}
        </Typography>
        <List
          {...props}
          basePath="/projects"
          resource="projects"
          bulkActionButtons={false}
          actions={false}
          pagination={<EmptyDashboard />}
          filters={false}
          perPage={20}
          filter={{ is_donor_funded: true }}
          sort={{ field: "id", order: "DESC" }}
        >
          <Datagrid rowClick={"show"}>
            <TextField source="code" />
            <TextField source="name" />
            <FunctionField
              source="created_on"
              label={translate(`resources.projects.fields.created_at`)}
              render={(record) =>
                record ? dateFormatter(record.created_on) : null
              }
            />
            <FunctionField
              source="status"
              label={translate(`resources.projects.fields.status`)}
              render={(record) =>
                record
                  ? translate(`timeline.${record.project_status.toLowerCase()}`)
                  : null
              }
            />
            <FunctionField
              source="status"
              label={translate(`resources.projects.fields.phase_id`)}
              render={(record) =>
                record ? record.phase && record.phase.name : null
              }
            />
            <FunctionField
              source="status"
              label={"Donors"}
              render={(record) => {
                return (
                  record &&
                  record.fund_ids &&
                  record.fund_ids.split(",").map((fund) => {
                    return <p style={{ margin: 1 }}>{getFundById(fund)}</p>;
                  })
                );
              }}
            />
          </Datagrid>
        </List>
      </Grid>
    </Grid>
  );
}

export default DonorsProjects;

// in src/Dashboard.js
// import React, { useEffect, useState } from "react";

// import { useDataProvider, useTranslate } from "react-admin";
// import {
//   Grid,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Typography,
// } from "@material-ui/core";
// import moment from "moment";
// import Card from "@material-ui/core/Card";
// import { costSumFormatter, dateFormatter } from "../../../helpers";
// import lodash from "lodash";
// import { makeStyles } from "@material-ui/core";
// import ExportActions from "./ExportActions";
// import { getFiscalYearValue } from "../../../helpers/formatters";
// import { calculateCost, getProjectsBySectors } from "./helpers";
// import { EXPORT_TYPES } from "../../../constants/common";

// const useStyles = makeStyles((theme) => ({
//   topGroup: {
//     display: "flex",
//     justifyContent: "space-around",
//   },
//   title: {
//     fontWeight: "bold",
//     margin: "10px auto",
//   },
//   subtitle: {
//     margin: "10px auto",
//   },
//   buttonsContainer: {
//     width: "100%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "flex-end",
//     padding: "10px 25px",
//   },
//   buttons: {
//     width: "100px",
//     fontSize: "16px",
//     display: "flex",
//     justifyContent: "space-around",
//   },
//   titleColumn: {
//     width: "35%",
//   },
// }));

// function DonorsProjects(props) {
//   const [data, setData] = useState([]);
//   const [donors, setDonors] = useState([]);
//   const [funds, setFunds] = useState([]);
//   const translate = useTranslate();
//   const classes = useStyles();
//   const dataProvider = useDataProvider();

//   useEffect(() => {
//     dataProvider.getListOfAll("funds", {}).then((response) => {
//       if (response && response.data) {
//         setFunds(lodash.sortBy(response.data, "name"));
//       }
//     });
//     dataProvider
//       .getListOfAll("projects", { filter: { is_donor_funded: true } })
//       .then((response) => {
//         if (response && response.data) {
//           const filteredData = response.data.map((project) => {
//             project.donors = project.fund_ids && project.fund_ids.split(",");
//             return project;
//           });

//           setData(filteredData);

//           const donors = [];

//           filteredData.forEach((project) => {
//             project.donors.forEach((donor) => {
//               donors.push(Number(donor))
//             })
//           })

//           setDonors(donors)
//         }
//       });
//   }, []);

//   function getFundById(id) {
//     const fund = lodash.find(funds, (item) => Number(item.id) === Number(id));
//     return fund ? `${fund.code} - ${fund.name}` : "-";
//   }

//   function getGrouppedData(){
//   }

//   return (
//     <Grid container spacing={3}>
//       <ExportActions
//         reportId="report-container"
//         title="Pipeline Projects"
//         exportTypes={[EXPORT_TYPES.WORD, EXPORT_TYPES.PDF, EXPORT_TYPES.XLS]}
//       />
//       <Grid item xs={12}>
//         <Card id="report-container">
//           <Table>
//             <TableHead>
//               <TableRow className={classes.filledRow}>
//                 <TableCell width="120px">ID</TableCell>
//                 <TableCell className={classes.titleColumn}>Title</TableCell>
//                 <TableCell align="center">Sector</TableCell>
//                 <TableCell align="center">Phase</TableCell>
//                 <TableCell align="center">Start Date</TableCell>
//                 <TableCell align="center">Status</TableCell>
//                 <TableCell align="center">Last Modified</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {donors.map((item) => ).data.map((project) => (
//                 <TableRow>
//                   <TableCell>{project.code}</TableCell>
//                   <TableCell>{project.name}</TableCell>
//                   <TableCell align="center">
//                     {project.phase &&
//                       project.project_organization &&
//                       project.project_organization.parent &&
//                       project.project_organization.parent.parent &&
//                       project.project_organization.parent.parent.name}
//                   </TableCell>
//                   <TableCell align="center">
//                     {project.phase && project.phase.name}
//                   </TableCell>
//                   <TableCell align="center">
//                     {getFiscalYearValue(project.created_on).name}
//                   </TableCell>
//                   <TableCell align="center">
//                     {project.workflow && project.workflow.status_msg}
//                   </TableCell>
//                   <TableCell align="center">
//                     {dateFormatter(project.modified_on)}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </Card>
//       </Grid>
//     </Grid>
//   );
// }

// export default DonorsProjects;
