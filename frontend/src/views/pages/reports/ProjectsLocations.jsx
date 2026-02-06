// in src/Dashboard.js
import * as React from "react";

import {
  Datagrid,
  FunctionField,
  List,
  Pagination,
  TextField,
  Title,
  useDataProvider,
  useTranslate,
} from "react-admin";
import {
  CardHeader,
  Grid,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";

import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { dateFormatter } from "../../../helpers";
import lodash from "lodash";
import { makeStyles } from "@material-ui/core";

import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import CustomMap from "../../components/CustomMap";
import CustomReportMap from "../../components/CustomReportMap";

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

function PhaseFilters({ filters, data, onChangeFilter, ...props }) {
  const handleChange = (id) => (event) => {
    onChangeFilter({ id, checked: event.target.checked });
  };

  return (
    <FormGroup row>
      {data &&
        data.map((item) => {
          return (
            <FormControlLabel
              key={item.id}
              control={
                <Switch
                  onChange={handleChange(item.id)}
                  name={item.id}
                  checked={filters[item.id]}
                />
              }
              label={item.name}
            />
          );
        })}
    </FormGroup>
  );
}

function ProjectsLocations(props) {
  const [data, setData] = React.useState([]);
  const [pivotData, setPivotData] = React.useState([]);
  const [phases, setPhases] = React.useState([]);
  const [phaseFilters, setPhaseFilters] = React.useState({});
  const [orgFilters, setOrgFilters] = React.useState({
    program: null,
    project_organization: null,
  });
  const translate = useTranslate();
  const classes = useStyles();
  const dataProvider = useDataProvider();

  React.useEffect(() => {
    dataProvider
      .custom("reports", { type: "projects-location", method: "GET" })
      .then((response) => {
        if (response && response.data) {
          const filteredData = response.data.filter(
            (item) =>
              item.current_project_detail &&
              item.current_project_detail.geo_location
          );
          const markersData = filteredData.map((item) => ({
            ...item,
            markers: JSON.parse(item.current_project_detail.geo_location),
          }));

          setPivotData(filteredData);
          setData(markersData);
        }
      });

    dataProvider
      .getListOfAll("phases", { sort_field: "sequence" })
      .then((response) => {
        setPhases(response.data);
        const filters = {};
        response.data.forEach((item) => {
          filters[item.id] = true;
        });

        setPhaseFilters(filters);
      });
  }, []);

  function handleChangeFilter(filter) {
    setPhaseFilters({ ...phaseFilters, [filter.id]: filter.checked });
  }

  const handleChangeOrgFilter = (filter) => (event) => {
    setOrgFilters({ ...orgFilters, [filter]: event.target.value });
  };

  function getPrograms() {
    return pivotData ? pivotData.map((item) => item.program) : [];
  }

  function getDepartments() {
    return pivotData ? pivotData.map((item) => item.project_organization) : [];
  }

  function getFilteredData() {
    return data
      ? data
          .filter((item) => phaseFilters[item.phase_id])
          .filter((item) =>
            orgFilters.program
              ? item.program && item.program.id === orgFilters.program
              : true
          )
          .filter((item) =>
            orgFilters.project_organization
              ? item.project_organization &&
                item.project_organization.id === orgFilters.project_organization
              : true
          )
      : [];
  }

  function getGrouppedData() {
    return lodash.groupBy(getFilteredData(), "phase_id");
  }

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
        <Card style={{ padding: 20 }}>
          <Grid container spacing={3}>
            <Grid item xs={5}>
              <Typography variant="h6">Program</Typography>
              <Select
                variant="outlined"
                value={orgFilters.program}
                onChange={handleChangeOrgFilter("program")}
                style={{ margin: "10px" }}
                fullWidth
              >
                {pivotData &&
                  getPrograms().map((item) => (
                    <MenuItem value={item.id}>{item.name}</MenuItem>
                  ))}
              </Select>
            </Grid>
            <Grid item xs={5}>
              <Typography variant="h6">Department</Typography>
              <Select
                variant="outlined"
                value={orgFilters.project_organization}
                onChange={handleChangeOrgFilter("project_organization")}
                style={{ margin: "10px" }}
                fullWidth
              >
                {pivotData &&
                  getDepartments().map((item) => (
                    <MenuItem value={item.id}>{item.name}</MenuItem>
                  ))}
              </Select>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">Phases</Typography>
            {phases.length > 0 && !lodash.isEmpty(phaseFilters) && (
              <div>
                <PhaseFilters
                  data={phases}
                  filters={phaseFilters}
                  onChangeFilter={handleChangeFilter}
                />
              </div>
            )}
          </Grid>
          <Grid item xs={12}>
            <CustomReportMap isReport data={getGrouppedData()} height={600} />
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
}

export default ProjectsLocations;
