import {
  Datagrid,
  Filter,
  FunctionField,
  List,
  useTranslate,
  ReferenceField,
  ReferenceInput,
  Responsive,
  SelectInput,
  SimpleList,
  TextField,
  TextInput,
  useDataProvider,
} from "react-admin";
import {
  Grid,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  MenuItem,
  Typography,
} from "@material-ui/core";
import lodash from "lodash";
import moment from "moment";
import React, { Component, Fragment, useState } from "react";
import { costSumFormatter, dateFormatter } from "../../../helpers";
import ExportActions from "./ExportActions";
import { EXPORT_TYPES } from "../../../constants/common";
import { useEffect } from "react";
import { getFiscalYearValue } from "../../../helpers/formatters";
import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import { WorkflowStatusMessage } from "../../modules/Reports/helpers";

const useStyles = makeStyles((theme) => ({
  topGroup: {
    display: "flex",
    justifyContent: "space-around",
  },
  title: {
    fontWeight: "bold",
    margin: "10px 10px 20px 10px",
  },
  subtitle: {
    margin: "10px auto",
  },
  buttonsContainer: {
    width: "155px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "10px 25px",
    float: "right",
  },
  buttons: {
    width: "100px",
    fontSize: "16px",
    display: "flex",
    justifyContent: "space-around",
  },
  titleColumn: {
    width: "25%",
  },
  select: {
    margin: "0px 15px 15px 0px",
  },
}));

function ReportDC({ record, ...props }) {
  const translate = useTranslate();
  const [data, setData] = useState([]);
  const dataProvider = useDataProvider();
  const classes = useStyles();

  useEffect(() => {
    dataProvider
      .getListOfAllProjects("reports/projects-min-report", {
        sort_field: "id",
        filter: { steps: [6, 9, 10, 11, 12, 13, 14, 15, 16, 18] },
      })
      .then((response) => {
        if (response && response.data) {
          setData(response.data);
        }
      });
  }, []);

  return (
    <>
      <ExportActions
        reportId="report-container"
        title="Projects scheduled for DC"
        exportTypes={[EXPORT_TYPES.WORD, EXPORT_TYPES.PDF, EXPORT_TYPES.XLS]}
      />
      <Card id="report-container" style={{ overflow: "auto" }}>
        <Table>
          <TableHead>
            <TableRow className={classes.filledRow}>
              <TableCell width="120px">Code</TableCell>
              <TableCell className={classes.titleColumn}>
                {translate("printForm.reports.title")}
              </TableCell>
              <TableCell align="center">
                {translate(`printForm.reports.vote_id`)}
              </TableCell>
              <TableCell align="center">
                {translate(`printForm.reports.program`)}
              </TableCell>
              <TableCell align="center">
                {translate("printForm.reports.phase")}
              </TableCell>
              <TableCell align="center">
                {translate("printForm.reports.total_cost")}
              </TableCell>
              <TableCell align="center">
                {translate("printForm.reports.status")}
              </TableCell>
              {/* <TableCell align="center">
                {translate("printForm.reports.date_modify")}
              </TableCell> */}
              <TableCell align="center">
                {translate("printForm.reports.previous_decision")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((project) => (
              <TableRow>
                <TableCell>{project.code}</TableCell>
                <TableCell>{project.name}</TableCell>
                <TableCell align="center">
                  {project.phase &&
                    project.project_organization &&
                    project.project_organization.parent &&
                    project.project_organization.parent.name}
                </TableCell>
                <TableCell>{project.program && project.program.name}</TableCell>

                <TableCell align="center">
                  {project.phase && project.phase.name}
                </TableCell>
                <TableCell align="center">
                  {project.phase && costSumFormatter(project.total_costs)}
                </TableCell>

                <TableCell align="center">
                  {project.workflow && (
                    <WorkflowStatusMessage record={project} />
                  )}
                </TableCell>
                {/* <TableCell align="center">
                  {project && project.current_timeline
                    ? dateFormatter(project.current_timeline.created_on, false)
                    : null}
                </TableCell> */}
                <TableCell align="left">
                  {project && project.current_timeline
                    ? project.current_timeline.reason
                      ? project.current_timeline.reason
                      : null
                    : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      {/*         
      <div id="report-container">
        <Typography variant="h4" style={{ marginBottom: 20 }}>
          {translate(
            `resources.${props.location.pathname.slice(
              1,
              props.location.pathname.length
            )}.name`
          )}
        </Typography>
        <List
          {...props}
          basePath="/projects"
          resource="projects"
          bulkActionButtons={false}
          actions={false}
          perPage={100}
          filter={{ current_step: 3, expand: "timeline" }} //TODO add last step workflow
        >
          <Datagrid rowClick={"show"}>
            <TextField source="code" />
            <FunctionField
              source="department"
              label={translate(`resources.projects.fields.vote_id`)}
              render={(record) =>
                record &&
                record.project_organization &&
                record.project_organization.parent.name
              }
            />
            <TextField source="name" />
            <FunctionField
              source="phase"
              label={translate(`resources.projects.fields.phase`)}
              render={(record) => record && record.phase && record.phase.name}
            />
            <FunctionField
              source="workflow"
              label={translate(`resources.projects.fields.status`)}
              render={(record) => "Waiting for DC decision"}
            />
            <FunctionField
              source="created_on"
              label={translate(`resources.projects.fields.created_on`)}
              render={(record) =>
                record
                  ? record.current_timeline &&
                    dateFormatter(record.current_timeline.created_on, false)
                  : null
              }
            />
          </Datagrid>
        </List>
      </div> */}
    </>
  );
}

export default ReportDC;
