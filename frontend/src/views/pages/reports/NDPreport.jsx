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
  getProjectsByFunctions,
} from "./helpers";
import { EXPORT_TYPES, PROJECT_PHASES } from "../../../constants/common";
import { costSumFormatter } from "../../resources/Projects/Report/helpers";
import ExportActions from "./ExportActions";
import { useSelector } from "react-redux";
import { checkFeature } from "../../../helpers/checkPermission";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
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

function NDPreport(props) {
  const [level, setLevel] = React.useState(0);
  const [selectedLevel, setSelectedLevel] = React.useState({});
  const [selected, setSelected] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [dataPivot, setDataPivot] = React.useState([]);
  const translate = useTranslate();
  const classes = useStyles();
  const dataProvider = useDataProvider();
  const appConfig = useSelector((state) => state.app.appConfig);

  React.useEffect(() => {
    dataProvider
      .custom("reports", { type: "ndp-report", method: "GET" })
      .then((response) => {
        if (response && response.data) {
          setData(response.data);
        }
      });
  }, []);

  const projectsGroupByGoals = lodash.groupBy(
    data,
    (item) => item.ndp_goal_name
  );
  const projectsGroupByOutcomes = lodash.groupBy(
    data,
    (item) => item.ndp_outcome_name
  );

  let allTotalCount = 0;
  let allTotalCost = 0;

  const handleSelectGroup = (group) => () => {
    if (level < 2) {
      setSelected(group);
      setSelectedLevel({
        ...selectedLevel,
        [level + 1]: group,
      });
      setLevel(level + 1);
    } else {
      setSelected(null);
      setLevel(0);
    }
  };

  const handleLevelUp = () => {
    if (level > 0) {
      setLevel(level - 1);
      setSelectedLevel({
        ...selectedLevel,
        [level]: null,
      });
    }
  };

  function getReportData() {
    if (level === 1) {
      const projectsOutcomes = lodash.groupBy(
        projectsGroupByGoals[selectedLevel[level]],
        (item) => item.ndp_outcome_name
      );
      return projectsOutcomes;
    }
    if (level === 2) {
      const projectsGroupByStrategies = lodash.groupBy(
        projectsGroupByOutcomes[selectedLevel[level]],
        (item) => item.ndp_strategy_name
      );
      return projectsGroupByStrategies;
    }

    return projectsGroupByGoals;
  }

  return (
    <Grid container spacing={3}>
      <ExportActions
        reportId="report-container"
        title="National Development Projects"
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
          {level > 0 && (
            <Typography
              variant="h5"
              className={classes.backButton}
              onClick={handleLevelUp}
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
                    <TableCell>Name</TableCell>
                    <TableCell>Cost ({translate("titles.currency")})</TableCell>
                    <TableCell>Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lodash.keys(getReportData()).map((group) => {
                    allTotalCost += lodash.sumBy(
                      getReportData()[group],
                      (item) => item.costs
                    );
                    allTotalCount += lodash.sumBy(
                      getReportData()[group],
                      (item) => item.total_count
                    );

                    return (
                      <TableRow
                        className={classes.titleRow}
                        onClick={handleSelectGroup(group)}
                      >
                        <TableCell>{group}</TableCell>
                        <TableCell>
                          {costSumFormatter(
                            lodash.sumBy(
                              getReportData()[group],
                              (item) => item.costs
                            )
                          )}
                        </TableCell>
                        <TableCell>
                          {lodash.sumBy(
                            getReportData()[group],
                            (item) => item.total_count
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell variant="head">
                      Total ({translate("titles.currency")})
                    </TableCell>
                    <TableCell variant="head">
                      {costSumFormatter(allTotalCost)}
                    </TableCell>
                    <TableCell variant="head">{allTotalCount}</TableCell>
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

export default NDPreport;
