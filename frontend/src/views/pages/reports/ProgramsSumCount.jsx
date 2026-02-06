// in src/Dashboard.js
import * as React from "react";
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
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TableContainer,
} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { dateFormatter } from "../../../helpers";
import lodash from "lodash";
import { makeStyles } from "@material-ui/core";
import {
  calculateCost,
  getProjectsByPrograms,
  getProjectsBySectors,
} from "./helpers";
import { EXPORT_TYPES } from "../../../constants/common";
import { costSumFormatter } from "../../resources/Projects/Report/helpers";
import ExportActions from "./ExportActions";
import { useSelector } from "react-redux";
import { checkFeature } from "../../../helpers/checkPermission";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";

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
  titleRow: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#f3f6f8",
    },
  },
  backButton: {
    marginBottom: 20,
    position: "absolute",
    right: 0,
    top: 0,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
}));

function ProgramsSumCount(props) {
  const [phases, setPhases] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [dataPivot, setDataPivot] = React.useState([]);
  const [organizations, setOrganizations] = React.useState([]);
  const translate = useTranslate();
  const classes = useStyles();
  const dataProvider = useDataProvider();
  const appConfig = useSelector((state) => state.app.appConfig);

  React.useEffect(() => {
    dataProvider.getListOfAll("organizations", {}).then((response) => {
      if (response && response.data) {
        setOrganizations(lodash.sortBy(response.data, "sequence"));
      }
    });
    dataProvider
      .getListOfAll("phases", { sort_field: "sequence" })
      .then((response) => {
        if (response && response.data) {
          setPhases(response.data);
        }
      });
    dataProvider
      .custom("reports", { type: "pivot", method: "GET" })
      .then((response) => {
        if (response && response.data) {
          setData(response.data.filter((item) => item.program));
        }
      });
  }, []);

  const projectsGroup = getProjectsByPrograms(data);

  const projectsByPhases = lodash.groupBy(
    data,
    (item) => item.phase && item.phase.id
  );

  let allTotalCount = 0;
  let allTotalCost = 0;

  const handleSelectGroup = (group) => () => {
    setSelected(group);
  };

  function getProjectsGroup() {
    if (selected) {
      const programsData = lodash.groupBy(
        projectsGroup[selected],
        (item) => item && item.program && item.program.name
      );
      return programsData;
    }

    return projectsGroup;
  }

  function getProjectsGroupPhase() {
    if (selected) {
      const programsData = lodash.groupBy(
        projectsGroup[selected],
        (item) => item.phase && item.phase.id
      );
      return programsData;
    }

    return projectsByPhases;
  }

  return (
    <Grid container spacing={3}>
      <ExportActions
        reportId="report-container"
        title="Projects by Programs"
        exportTypes={[EXPORT_TYPES.WORD, EXPORT_TYPES.PDF, EXPORT_TYPES.XLS]}
      />
      <Grid item xs={12} id="report-container">
        <div style={{ position: "relative" }}>
          <Typography variant="h4" style={{ marginBottom: 20 }}>
            {translate(
              `resources.${props.location.pathname.slice(
                1,
                props.location.pathname.length
              )}.name`
            )}
          </Typography>
          {selected && (
            <Typography
              variant="h5"
              className={classes.backButton}
              onClick={() => setSelected(null)}
            >
              <RotateLeftIcon />
              back
            </Typography>
          )}
        </div>
        <Card>
          <div className="landscapeSection">
            <TableContainer>
              <Table
                size="small"
                className={clsx("bordered", classes.bordered, classes.table)}
                style={{ width: '100%' }}
              >
                <TableHead>
                  <TableRow className={classes.filledRow}>
                    <TableCell>
                      {appConfig.programs_config[1].name}
                      Name
                    </TableCell>
                    {phases.map((phase) => (
                      <TableCell colspan="2">{phase.name}</TableCell>
                    ))}
                    <TableCell colspan="2">Total</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell></TableCell>
                    {phases.map((phase) => [
                      <TableCell>Count</TableCell>,
                      <TableCell>
                        Cost ({translate("titles.currency")})
                      </TableCell>,
                    ])}
                    <TableCell>Count</TableCell>
                    <TableCell>Cost ({translate("titles.currency")})</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!selected &&
                    lodash.keys(projectsGroup).map((group) => {
                      const grouupedData = lodash.groupBy(
                        projectsGroup[group],
                        (item) => item.phase && item.phase.id
                      );
                      let rowTotalCount = 0;
                      let rowTotalCost = 0;
                      return (
                        <TableRow
                          className={classes.titleRow}
                          onClick={handleSelectGroup(group)}
                        >
                          <TableCell>{group}</TableCell>
                          {phases.map((phase) => {
                            const projectCosts =
                              grouupedData[phase.sequence] &&
                              grouupedData[phase.sequence]
                                .filter(
                                  (project) => !lodash.isEmpty(project.costs)
                                )
                                .map((project) => ({
                                  totalCost: calculateCost(project.costs),
                                }));

                            rowTotalCount += grouupedData[phase.sequence]
                              ? grouupedData[phase.sequence].length
                              : 0;
                            rowTotalCost += lodash.sumBy(
                              projectCosts,
                              "totalCost"
                            );

                            return [
                              <TableCell>
                                {grouupedData[phase.sequence]
                                  ? grouupedData[phase.sequence].length
                                  : 0}
                              </TableCell>,
                              <TableCell>
                                {costSumFormatter(
                                  lodash.sumBy(projectCosts, "totalCost")
                                )}
                              </TableCell>,
                            ];
                          })}

                          <TableCell variant="head">{rowTotalCount}</TableCell>
                          <TableCell variant="head">
                            {costSumFormatter(rowTotalCost)}
                          </TableCell>
                        </TableRow>
                      );
                    })}

                  {selected &&
                    lodash.keys(getProjectsGroup()).map((group) => {
                      const grouupedData = lodash.groupBy(
                        getProjectsGroup()[group],
                        (item) => item.phase && item.phase.id
                      );
                      let rowTotalCount = 0;
                      let rowTotalCost = 0;
                      return (
                        <TableRow
                          className={classes.titleRow}
                          onClick={() => setSelected(null)}
                        >
                          <TableCell>{group}</TableCell>
                          {phases.map((phase) => {
                            const projectCosts =
                              grouupedData[phase.sequence] &&
                              grouupedData[phase.sequence]
                                .filter(
                                  (project) => !lodash.isEmpty(project.costs)
                                )
                                .map((project) => ({
                                  totalCost: calculateCost(project.costs),
                                }));

                            rowTotalCount += grouupedData[phase.sequence]
                              ? grouupedData[phase.sequence].length
                              : 0;
                            rowTotalCost += lodash.sumBy(
                              projectCosts,
                              "totalCost"
                            );

                            return [
                              <TableCell>
                                {grouupedData[phase.sequence]
                                  ? grouupedData[phase.sequence].length
                                  : 0}
                              </TableCell>,
                              <TableCell>
                                {costSumFormatter(
                                  lodash.sumBy(projectCosts, "totalCost")
                                )}
                              </TableCell>,
                            ];
                          })}

                          <TableCell variant="head">{rowTotalCount}</TableCell>
                          <TableCell variant="head">
                            {costSumFormatter(rowTotalCost)}
                          </TableCell>
                        </TableRow>
                      );
                    })}

                  <TableRow>
                    <TableCell variant="head">
                      Total ({translate("titles.currency")})
                    </TableCell>
                    {!selected &&
                      phases.map((phase) => {
                        const projectCosts =
                          projectsByPhases[phase.sequence] &&
                          projectsByPhases[phase.sequence]
                            .filter((project) => !lodash.isEmpty(project.costs))
                            .map((project) => ({
                              totalCost: calculateCost(project.costs),
                            }));

                        allTotalCount += projectsByPhases[phase.sequence]
                          ? projectsByPhases[phase.sequence].length
                          : 0;
                        allTotalCost += lodash.sumBy(projectCosts, "totalCost");

                        return [
                          <TableCell variant="head">
                            {projectsByPhases[phase.sequence]
                              ? projectsByPhases[phase.sequence].length
                              : 0}
                          </TableCell>,
                          <TableCell variant="head">
                            {costSumFormatter(
                              lodash.sumBy(projectCosts, "totalCost")
                            )}
                          </TableCell>,
                        ];
                      })}
                    {selected &&
                      phases.map((phase) => {
                        const projectCosts =
                          getProjectsGroupPhase()[phase.sequence] &&
                          getProjectsGroupPhase()
                            [phase.sequence].filter(
                              (project) => !lodash.isEmpty(project.costs)
                            )
                            .map((project) => ({
                              totalCost: calculateCost(project.costs),
                            }));

                        allTotalCount += getProjectsGroupPhase()[phase.sequence]
                          ? getProjectsGroupPhase()[phase.sequence].length
                          : 0;
                        allTotalCost += lodash.sumBy(projectCosts, "totalCost");

                        return [
                          <TableCell variant="head">
                            {getProjectsGroupPhase()[phase.sequence]
                              ? getProjectsGroupPhase()[phase.sequence].length
                              : 0}
                          </TableCell>,
                          <TableCell variant="head">
                            {costSumFormatter(
                              lodash.sumBy(projectCosts, "totalCost")
                            )}
                          </TableCell>,
                        ];
                      })}

                    <TableCell variant="head">{allTotalCount}</TableCell>
                    <TableCell variant="head">
                      {costSumFormatter(allTotalCost)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Card>
      </Grid>
    </Grid>
  );
}

export default ProgramsSumCount;
