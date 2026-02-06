// in src/Dashboard.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useDataProvider, useTranslate } from "react-admin";
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
import moment from "moment";
import Card from "@material-ui/core/Card";
import { costSumFormatter, dateFormatter } from "../../../helpers";
import lodash from "lodash";
import { makeStyles } from "@material-ui/core";
import ExportActions from "./ExportActions";
import { getFiscalYearValue } from "../../../helpers/formatters";
import { calculateCost, getProjectsBySectors } from "./helpers";
import {
  EXPORT_TYPES,
  PROJECT_PHASES,
  PROJECT_STATUS,
} from "../../../constants/common";
import { checkFeature } from "../../../helpers/checkPermission";
import { costSumFormatterReports } from "../../resources/Projects/Report/helpers";
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

function PiplineProjects(props) {
  const [statusFilter, setStatusFilter] = useState(null);
  const [phaseId, setPhaseId] = useState(null);
  const [organizationId, setOrganizationId] = useState(null);
  const [data, setData] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [phases, setPhases] = useState([]);
  const translate = useTranslate();
  const classes = useStyles();
  const dataProvider = useDataProvider();
  const appConfig = useSelector((state) => state.app.appConfig);

  useEffect(() => {
    dataProvider
      .getListOfAll("phases", { sort_field: "sequence" })
      .then((response) => {
        if (response && response.data) {
          setPhases(response.data);
        }
      });

    if (checkFeature("has_ibp_fields")) {
      dataProvider
        .getListOfAllProjects("reports/projects-report", {
          sort_field: "id",
          filter: { phase_ids: [1, 2, 3, 4] },
        })
        .then((response) => {
          if (response && response.data) {
            const filteredData = response.data
              .filter(
                (item) =>
                  item.project_status !==
                  PROJECT_STATUS.STATUS_DRAFT.toUpperCase()
              )
              .filter(
                (item) =>
                  moment().diff(moment(moment(item.modified_on)), "days") >= 14 //days
              );
            setData(filteredData);
            const projectOrganizations = [];

            filteredData.forEach((project) => {
              projectOrganizations.push(project.project_organization);
              if (
                project.project_organization &&
                project.project_organization.parent
              ) {
                projectOrganizations.push(project.project_organization.parent);
              }

              if (
                project.project_organization &&
                project.project_organization.parent
              ) {
                projectOrganizations.push(project.project_organization.parent);
              }
            });
            setOrganizations(projectOrganizations);
          }
        });
    } else {
      dataProvider
        .getListOfAllProjects("reports/projects-report", {
          sort_field: "id",
          filter: { phase_ids: [1, 2, 3, 4] },
        })
        .then((response) => {
          if (response && response.data) {
            const filteredData = response.data.filter(
              (item) =>
                moment().diff(moment(moment(item.modified_on)), "days") >= 14 //days
            );
            setData(filteredData);
            const projectOrganizations = [];

            filteredData.forEach((project) => {
              projectOrganizations.push(project.project_organization);
              if (
                project.project_organization &&
                project.project_organization.parent
              ) {
                projectOrganizations.push(project.project_organization.parent);
              }

              if (
                project.project_organization &&
                project.project_organization.parent
              ) {
                projectOrganizations.push(project.project_organization.parent);
              }
            });
            setOrganizations(projectOrganizations);
          }
        });
    }
  }, []);

  const getFilteredProjects = () => {
    return data
      .filter((item) =>
        phaseId ? Number(item.phase_id) === Number(phaseId) : true
      )
      .filter((item) =>
        statusFilter
          ? item.workflow && Number(item.workflow.step) === Number(statusFilter)
          : true
      )
      .filter((item) =>
        organizationId
          ? Number(item.project_organization.parent.id) ===
            Number(organizationId)
          : true
      );
  };

  const getOrganizationFilter = () => {
    return lodash.uniqBy(
      data.map((project) => project.project_organization.parent),
      (item) => item.id
    );
  };

  const getOrganizationSubFilter = () => {
    return lodash.uniqBy(
      data.map((project) =>
        checkFeature("has_pimis_fields")
          ? project.project_organization
          : project.project_organization.parent
      ),
      (item) => item.id
    );
  };

  const getStatusFilter = () => {
    return lodash.uniqBy(
      data
        .filter((item) => item.workflow)
        .map((project) => ({
          id: project.workflow.step,
          name: project.workflow.status_msg,
        })),
      (item) => item.id
    );
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" style={{ marginBottom: 20 }}>
          {translate(
            `resources.${props.location.pathname.slice(
              1,
              props.location.pathname.length
            )}.name`
          )}
        </Typography>

        <Grid item xs={12}>
          <FormControl variant="outlined" className={classes.select}>
            <InputLabel
              style={{ transform: "translate(14px, -12px) scale(0.75)" }}
            >
              {translate("printForm.reports.phase")}
            </InputLabel>
            <Select
              style={{ width: "220px" }}
              placeholder="Phase"
              value={phaseId}
              onChange={(event) => {
                setPhaseId(event.target.value);
              }}
            >
              <MenuItem value="">
                <em>-</em>
              </MenuItem>
              {phases.map((phase) => (
                <MenuItem value={phase.id}>
                  <em>{phase.name}</em>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" className={classes.select}>
            <InputLabel
              style={{ transform: "translate(14px, -12px) scale(0.75)" }}
            >
              {appConfig && appConfig.organizational_config[1].name}
            </InputLabel>
            <Select
              style={{ width: "220px" }}
              placeholder="Phase"
              value={organizationId}
              onChange={(event) => {
                setOrganizationId(event.target.value);
              }}
            >
              <MenuItem value="">
                <em>-</em>
              </MenuItem>
              {getOrganizationFilter().map((item) => (
                <MenuItem value={item.id}>
                  <em>{item.name}</em>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" className={classes.select}>
            <InputLabel
              style={{ transform: "translate(14px, -12px) scale(0.75)" }}
            >
              {appConfig && appConfig.organizational_config[2].name}
            </InputLabel>
            <Select
              style={{ width: "220px" }}
              placeholder="Phase"
              value={organizationId}
              onChange={(event) => {
                setOrganizationId(event.target.value);
              }}
            >
              <MenuItem value="">
                <em>-</em>
              </MenuItem>
              {getOrganizationSubFilter().map((item) => (
                <MenuItem value={item.id}>
                  <em>{item.name}</em>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" className={classes.select}>
            <InputLabel
              style={{ transform: "translate(14px, -12px) scale(0.75)" }}
            >
              {translate("printForm.reports.status")}
            </InputLabel>
            <Select
              style={{ width: "220px" }}
              placeholder="Phase"
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
              }}
            >
              <MenuItem value="">
                <em>-</em>
              </MenuItem>
              {getStatusFilter().map((item) => (
                <MenuItem value={item.id}>
                  <em>{item.name}</em>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <ExportActions
            reportId="report-container"
            title="Projects that are stagnant for 14 days"
            exportTypes={[
              EXPORT_TYPES.WORD,
              EXPORT_TYPES.PDF,
              EXPORT_TYPES.XLS,
            ]}
            className={classes.buttonsContainer}
          />
        </Grid>
        <Card id="report-container">
          <Table>
            <TableHead>
              <TableRow className={classes.filledRow}>
                <TableCell width="120px">ID</TableCell>
                <TableCell className={classes.titleColumn}>
                  {translate("printForm.reports.title")}
                </TableCell>
                <TableCell align="center">
                  {appConfig && appConfig.organizational_config[1].name}
                </TableCell>
                <TableCell align="center">
                  {appConfig && appConfig.organizational_config[2].name}
                </TableCell>
                <TableCell align="center">
                  {translate("printForm.reports.total_cost")}
                </TableCell>
                <TableCell align="center">
                  {translate("printForm.reports.phase")}
                </TableCell>
                <TableCell align="center">
                  {translate("printForm.reports.start_date")}
                </TableCell>
                <TableCell align="center">
                  {translate("printForm.reports.status")}
                </TableCell>
                <TableCell align="center">
                  {translate("printForm.reports.date_modify")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getFilteredProjects().map((project) => (
                <TableRow>
                  <TableCell>{project.code}</TableCell>
                  <TableCell>{project.name}</TableCell>
                  <TableCell align="center">
                    {project.phase &&
                      project.project_organization &&
                      project.project_organization.parent &&
                      project.project_organization.parent.name}
                  </TableCell>
                  <TableCell align="center">
                    {project.phase &&
                      project.project_organization &&
                      project.project_organization.parent.name}
                  </TableCell>
                  <TableCell align="center">
                    {project.phase && costSumFormatter(project.total_costs)}
                  </TableCell>
                  <TableCell align="center">
                    {project.phase && project.phase.name}
                  </TableCell>
                  <TableCell align="center">
                    {getFiscalYearValue(project.created_on).name}
                  </TableCell>
                  <TableCell align="center">
                  {project.workflow && (
                        <WorkflowStatusMessage record={project} />
                      )}
                  </TableCell>
                  <TableCell align="center">
                    {dateFormatter(project.modified_on)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Grid>
    </Grid>
  );
}

export default PiplineProjects;
