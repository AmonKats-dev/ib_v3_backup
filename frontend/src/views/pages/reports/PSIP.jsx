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
  Grid,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@material-ui/core";

import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { dateFormatter } from "../../../helpers";
import lodash from "lodash";
import { makeStyles } from "@material-ui/core";
import { costSumFormatter } from "../../resources/Projects/Report/helpers";
import { PROJECT_PHASE_STATUS } from "../../../constants/common";
import StatusField from "../../resources/Projects/ProjectMonitorings/MonitoringForms/StatusField";

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
}));

const EmptyDashboard = (props) => {
  const { loading, loaded, total } = props;
  if (total === 0 && !loading && loaded) {
    return (
      <Box textAlign="center" m={3}>
        <Typography variant="h5" paragraph>
          No projects are in Design stage
        </Typography>
      </Box>
    );
  }
  return <Pagination {...props} />;
};

function PSIP(props) {
  const [sorting, setSorting] = React.useState("physical_progress");
  const [sortingType, setSortingType] = React.useState(1);
  const [data, setData] = React.useState([]);
  const [dataPivot, setDataPivot] = React.useState([]);
  const [organizations, setOrganizations] = React.useState([]);
  const translate = useTranslate();
  const classes = useStyles();
  const dataProvider = useDataProvider();

  React.useEffect(() => {
    dataProvider
      .custom("reports", { type: "psip-report", method: "GET" })
      .then((response) => {
        if (response && response.data) {
          setData(response.data);
        }
      });
  }, []);

  const handleSort = (field) => () => {
    if (lodash.isEmpty(sorting)) {
      setSorting(field);
    } else {
      if (field === sorting) {
        setSortingType(!sortingType);
      } else {
        setSorting(field);
      }
    }
  };

  function getSortedData(data) {
    if (lodash.isEmpty(sorting)) {
      return data.sortBy(data, (item) => item.progress[sorting]);
    }

    const sorted = lodash
      .sortBy(data, (item) => item.progress[sorting])
      .reverse();
    return sortingType ? sorted.reverse() : sorted;
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
        <Card>
          <Table>
            <TableHead>
              <TableRow className={classes.filledRow}>
                <TableCell>Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Sector</TableCell>
                <TableCell>Vote</TableCell>
                <TableCell
                  style={{ cursor: "pointer" }}
                  // onClick={handleSort("physical_progress")}
                >
                  <TableSortLabel
                    active={sorting === "physical_progress"}
                    direction={sortingType ? "desc" : "asc"}
                    onClick={handleSort("physical_progress")}
                  >
                    Physical Progress
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  style={{ cursor: "pointer" }}
                  // onClick={handleSort("financial_progress")}
                >
                  <TableSortLabel
                    active={sorting === "financial_progress"}
                    direction={sortingType ? "desc" : "asc"}
                    onClick={handleSort("financial_progress")}
                  >
                    Financial Progress
                  </TableSortLabel>
                  
                </TableCell>
                <TableCell>Costs ({translate('titles.currency')})</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                getSortedData(data).map((item) => {
                  item.total_cost = 0;
                  lodash.keys(item.costs).map((key) => {
                    item.total_cost += item.costs[key];
                  });

                  return (
                    <TableRow>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        {item.project_organization.parent.name}
                      </TableCell>
                      <TableCell>
                        {item.project_organization.name}
                      </TableCell>
                      <TableCell>
                        {item.progress && (
                          <StatusField
                            value={item.progress.physical_progress}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {item.progress && (
                          <StatusField
                            value={item.progress.financial_progress}
                          />
                        )}
                      </TableCell>
                      <TableCell>{costSumFormatter(item.total_cost)}</TableCell>
                    </TableRow>
                  );
                })}

              <TableRow className={classes.filledRow}>
                <TableCell style={{ fontWeight: "bold" }}>Total</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell style={{ fontWeight: "bold" }}>
                  {costSumFormatter(
                    lodash.sumBy(data, (it) => parseFloat(it.total_cost))
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </Grid>
    </Grid>
  );
}

export default PSIP;
