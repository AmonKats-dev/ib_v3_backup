// in src/Dashboard.js
import * as React from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";

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
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";

import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { dateFormatter } from "../../../helpers";
import lodash, { filter } from "lodash";
import { makeStyles } from "@material-ui/core";
import { costSumFormatter } from "../../resources/Projects/Report/helpers";
import { EXPORT_TYPES, PROJECT_PHASE_STATUS } from "../../../constants/common";
import { checkFeature } from "../../../helpers/checkPermission";
import ExportActions from "./ExportActions";

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
  filledRow: {
    backgroundColor: theme.palette.action.hover,
    fontWeight: "bold",
  },
  filters: {
    padding: "15px 10px",
    display: "flex",
    justifyContent: "space-between",
    width: "40%",
    minWidth: "700px",
    position: "relative",
  },
  bordered: {
    border: `1px solid ${theme.palette.border}`,
    "& td": {
      padding: "0.75rem",
      verticalAlign: "top",
      border: "1px solid #c8ced3",
    },
    "& th": {
      padding: "0.75rem",
      verticalAlign: "top",
      border: "1px solid #c8ced3",
    },
  },
  filledRow: {
    backgroundColor: theme.palette.action.hover,
    fontWeight: "bold",
  },
  table: {
    minWidth: 700,
  },
}));

function RankingReport(props) {
  const [data, setData] = React.useState([]);
  const [filterType, setFilterType] = React.useState("enpv");
  const [sectorId, setSectorId] = React.useState();
  const [voteId, setVoteId] = React.useState();
  const [organizations, setOrganizations] = React.useState([]);
  const translate = useTranslate();
  const classes = useStyles();
  const dataProvider = useDataProvider();
  const [filters, setFilters] = React.useState({});
  const appConfig = useSelector((state) => state.app.appConfig);

  React.useEffect(() => {
    dataProvider
      .custom("reports", { type: "pivot", method: "GET" })
      .then((response) => {
        if (response && response.data) {
          const filteredProjects = response.data.filter(
            (item) => !lodash.isEmpty(item.ranking_data)
          );

          setData(filteredProjects);
          const projectOrganizations = [];

          filteredProjects.forEach((project) => {
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
  }, []);

  function getFilteredByType() {
    return lodash
      .sortBy(data, (item) => Number(item.ranking_data[filterType]))
      .reverse()
      .filter((item) =>
        filters[1]
          ? item.project_organization &&
            item.project_organization.parent.id === filters[1]
          : true
      )
      .filter((item) =>
        filters[2]
          ? item.project_organization &&
            item.project_organization.id === filters[2]
          : true
      );
  }

  function getOrganizations(level) {
    if (!organizations) return [];

    return lodash.uniqBy(
      organizations.filter((item) => item && item.level === level),
      "id"
    );
  }

  return (
    <Grid container spacing={3}>
      <ExportActions
        reportId="report-container"
        title="Ranking Report"
        exportTypes={[EXPORT_TYPES.WORD, EXPORT_TYPES.PDF, EXPORT_TYPES.XLS]}
      />
      <Grid item xs={12}>
        <Typography variant="h4" style={{ marginBottom: 20 }}>
          {translate(
            `resources.${props.location.pathname.slice(
              1,
              props.location.pathname.length
            )}.name`
          )}
        </Typography>
        <Card>
          <div className={classes.filters}>
            <div className={classes.filters}>
              <FormControl variant="outlined">
                <InputLabel
                  style={{ transform: "translate(14px, -12px) scale(0.75)" }}
                >
                  Project Ranking by
                </InputLabel>
                <Select
                  variant="outlined"
                  style={{ width: "220px" }}
                  placeholder="Sector"
                  value={filterType}
                  onChange={(event) => {
                    setFilterType(event.target.value);
                  }}
                >
                  <MenuItem value="enpv">
                    <em>ENPV</em>
                  </MenuItem>
                  <MenuItem value="fnpv">
                    <em>FNPV</em>
                  </MenuItem>
                  <MenuItem value="irr">
                    <em>IRR</em>
                  </MenuItem>
                  <MenuItem value="err">
                    <em>ERR</em>
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl variant="outlined">
                <InputLabel
                  style={{ transform: "translate(14px, -12px) scale(0.75)" }}
                >
                  {appConfig && appConfig.organizational_config[1].name}
                </InputLabel>
                <Select
                  style={{ width: "220px" }}
                  placeholder="Vote"
                  value={filters[1]}
                  onChange={(event) => {
                    setFilters({ 1: event.target.value });
                  }}
                >
                  <MenuItem value="">
                    <em>-</em>
                  </MenuItem>
                  {getOrganizations(1).map((item) => (
                    <MenuItem value={item.id}>{item.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl variant="outlined">
                <InputLabel
                  style={{ transform: "translate(14px, -12px) scale(0.75)" }}
                >
                  {appConfig &&
                    appConfig.organizational_config[2] &&
                    appConfig.organizational_config[2].name}
                </InputLabel>
                <Select
                  style={{ width: "220px" }}
                  placeholder="Department"
                  value={filters[2]}
                  onChange={(event) => {
                    setFilters({ ...filters, 2: event.target.value });
                  }}
                >
                  <MenuItem value="">
                    <em>-</em>
                  </MenuItem>
                  {getOrganizations(2)
                    .filter((item) =>
                      filters[1] ? item.parent_id === filters[1] : true
                    )
                    .map((item) => (
                      <MenuItem value={item.id}>{item.name}</MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <div id="report-container">
            <div className="landscapeSection">
              <Table
                size="small"
                className={clsx("bordered", classes.bordered, classes.table)}
                style={{ width: "100%" }}
              >
                <TableHead>
                  <TableRow className={classes.filledRow}>
                    <TableCell>
                      {appConfig &&
                        appConfig.organizational_config[1] &&
                        appConfig.organizational_config[1].name}
                    </TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>
                      {appConfig &&
                        appConfig.organizational_config[2] &&
                        appConfig.organizational_config[2].name}
                    </TableCell>
                    <TableCell>Cost ({translate("titles.currency")})</TableCell>
                    <TableCell>
                      {filterType.toUpperCase()} ({translate("titles.currency")}
                      )
                    </TableCell>
                    <TableCell style={{ width: 50 }}>Rank</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data &&
                    getFilteredByType().map((item, rank) => {
                      item.total_cost = 0;
                      lodash.keys(item.costs).forEach((key) => {
                        item.total_cost += item.costs[key];
                      });

                      return (
                        <TableRow>
                          <TableCell>
                            {item.project_organization &&
                              item.project_organization.parent &&
                              item.project_organization.parent.name}
                          </TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>
                            {item.project_organization &&
                              item.project_organization.name}
                          </TableCell>
                          <TableCell>
                            {costSumFormatter(item.total_cost)}
                          </TableCell>
                          <TableCell>
                            {costSumFormatter(item.ranking_data[filterType])}
                          </TableCell>
                          <TableCell style={{ fontWeight: "bold", width: 50 }}>
                            {rank + 1}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
      </Grid>
    </Grid>
  );
}

export default RankingReport;
