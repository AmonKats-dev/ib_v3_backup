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
}));

const EmptyDashboard = (props) => {
  const { loading, loaded, total } = props;
  if (total === 0 && !loading && loaded) {
    return (
      <Box textAlign="center" m={3}>
        <Typography variant="h5" paragraph>
          No projects are in Pipeline status
        </Typography>
      </Box>
    );
  }
  return <Pagination {...props} />;
};

function SectorsCount(props) {
  const [data, setData] = React.useState([]);
  const [dataPivot, setDataPivot] = React.useState([]);
  const [organizations, setOrganizations] = React.useState([]);
  const [phases, setPhases] = React.useState([]);
  const translate = useTranslate();
  const classes = useStyles();
  const dataProvider = useDataProvider();
  const appConfig = useSelector((state) => state.app.appConfig);

  React.useEffect(() => {
    dataProvider.getListOfAll("organizations", {
      filter: {
        is_hidden: false,
      },
    }).then((response) => {
      if (response && response.data) {
        setOrganizations(lodash.sortBy(response.data, "name"));
      }
    });
    dataProvider.getListOfAll("phases",  { sort_field: "sequence" }).then((response) => {
      if (response && response.data) {
        setPhases(response.data);
      }
    });
    dataProvider
      .custom("reports", { type: "pivot", method: "GET" })
      .then((response) => {
        if (response && response.data) {
          setData(response.data);
        }
      });
  }, []);

  const projectsGroup = checkFeature("has_pimis_fields")
    ? getProjectsBySectors(data)
    : getProjectsByPrograms(data);
  const projectsByPhases = lodash.groupBy(
    data,
    (item) => item.phase && item.phase.id
  );

  let allTotalCount = 0;
  let allTotalCost = 0;

  return (
    <Grid container spacing={3}>
      <ExportActions
        reportId="report-container"
        title="Projects at different stages of the project cycle"
        exportTypes={[EXPORT_TYPES.WORD, EXPORT_TYPES.PDF, EXPORT_TYPES.XLS]}
      />
      <Grid item xs={12} id="report-container">
        <Typography variant="h4" style={{ marginBottom: 20 }}>
          {translate(
            `resources.${props.location.pathname.slice(
              1,
              props.location.pathname.length
            )}.name`
          )}
        </Typography>

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
                      {appConfig && checkFeature("has_pimis_fields")
                        ? appConfig.organizational_config[1].name
                        : appConfig.programs_config[1].name}{" "}
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
                  {lodash.keys(projectsGroup).map((group) => {
                    const grouupedData = lodash.groupBy(
                      projectsGroup[group],
                      (item) => item.phase && item.phase.id
                    );
                    let rowTotalCount = 0;
                    let rowTotalCost = 0;
                    return (
                      <TableRow>
                        <TableCell>{group}</TableCell>
                        {phases.map((phase) => {
                          const projectCosts =
                            grouupedData[phase.id] &&
                            grouupedData[phase.id]
                              .filter(
                                (project) => !lodash.isEmpty(project.costs)
                              )
                              .map((project) => ({
                                totalCost: calculateCost(project.costs),
                              }));

                          rowTotalCount += grouupedData[phase.id]
                            ? grouupedData[phase.id].length
                            : 0;
                          rowTotalCost += lodash.sumBy(
                            projectCosts,
                            "totalCost"
                          );

                          return [
                            <TableCell>
                              {grouupedData[phase.id]
                                ? grouupedData[phase.id].length
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
                    {phases.map((phase) => {
                      const projectCosts =
                        projectsByPhases[phase.id] &&
                        projectsByPhases[phase.id]
                          .filter((project) => !lodash.isEmpty(project.costs))
                          .map((project) => ({
                            totalCost: calculateCost(project.costs),
                          }));

                      allTotalCount += projectsByPhases[phase.id]
                        ? projectsByPhases[phase.id].length
                        : 0;
                      allTotalCost += lodash.sumBy(projectCosts, "totalCost");

                      return [
                        <TableCell variant="head">
                          {projectsByPhases[phase.id]
                            ? projectsByPhases[phase.id].length
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

export default SectorsCount;
