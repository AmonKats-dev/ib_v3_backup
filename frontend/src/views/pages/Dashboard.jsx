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
import { Grid, Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CustomBarChart from "./components/Charts/BarChart";
import { PROJECT_PHASES } from "../../constants/common";
import ProjectsCount from "./components/ProjectsCount";
import { dateFormatter } from "../../helpers";
import lodash from "lodash";
import { makeStyles } from "@material-ui/core";
import BarChartDrill from "./components/Charts/BarChartDrill";
import BarChartPrograms from "./components/Charts/BarChartPrograms";
import CustomPieChart from "./components/Charts/PieChartDrill";
import { useSelector } from "react-redux";
import CustomShowButton from "../resources/Projects/Actions/Buttons/CustomShowButton";
import { checkFeature } from "../../helpers/checkPermission";
import Blocks from "./components/Charts/Blocks";

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

function getParent(item) {
  let currentParent = item.parent;

  if (currentParent.parent) {
    return getParent(currentParent);
  }

  return currentParent;
}

// function getGrouppedData(data, isCosts) {
//   let filtered = data.filter((item) =>
//     isCosts ? !lodash.isEmpty(item.costs) : true
//   );

//   if (isCosts) {
//     filtered = filtered.map((item) => {
//       let totalSum = 0;
//       lodash.keys(item.costs).forEach((year) => {
//         totalSum += parseFloat(item.costs[year]);
//       });

//       item.cost = totalSum;
//       return item;
//     });
//   }

//   const groupped = lodash.groupBy(
//     filtered,
//     (item) => getParent(item.project_organization).id
//   );

//   return lodash.keys(groupped).map((item) => ({
//     project_organization: item,
//     count: groupped[item].length,
//     cost: lodash.sumBy(groupped[item], (it) => Number(it.cost)),
//   }));
// }

const EmptyDashboardAction = (props) => {
  const { loading, loaded, total } = props;
  if (total === 0 && !loading && loaded) {
    return (
      <Box textAlign="center" m={3}>
        <Typography variant="h5" paragraph>
          No projects are awaiting your action
        </Typography>
      </Box>
    );
  }
  return <Pagination {...props} />;
};

const EmptyDashboard = (props) => {
  const { loading, loaded, total } = props;
  if (total === 0 && !loading && loaded) {
    return (
      <Box textAlign="center" m={3}>
        <Typography variant="h5" paragraph>
          No projects in Pipeline stage
        </Typography>
      </Box>
    );
  }
  return <Pagination {...props} />;
};

// role_id(pin):7

function Dashboard(props) {
  const [data, setData] = React.useState([]);
  const [organizations, setOrganizations] = React.useState([]);
  const translate = useTranslate();
  const classes = useStyles();
  const dataProvider = useDataProvider();
  const userInfo = useSelector((state) => state.user.userInfo);

  React.useEffect(() => {
    let isMounted = true;
    dataProvider
      .custom("reports", { type: "projects-count", method: "GET" })
      .then((response) => {
        if (isMounted && response) {
          setData(response.data);
        }
      })
      .catch(() => {});

    dataProvider
      .getListOfAll("organizations", {
        filter: { is_hidden: false },
      })
      .then((response) => {
        if (isMounted && response) {
          setOrganizations(response.data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={checkFeature("has_barchart_dashboard") ? 6 : 8}>
        <Typography className={classes.title}>
          Projects waiting for your action
        </Typography>
        <List
          {...props}
          basePath="/projects"
          resource="projects"
          bulkActionButtons={false}
          actions={false}
          filter={{ action: "PENDING", is_deleted: false }}
          perPage={checkFeature("has_pimis_fields") ? 5 : 20}
          pagination={<EmptyDashboardAction />}
        >
          <Datagrid>
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
            <CustomShowButton />
          </Datagrid>
        </List>
      </Grid>

      {checkFeature("has_barchart_dashboard") ? (
        <Grid item xs={6}>
          <Typography className={classes.title}>Projects by Phases</Typography>
          <Card style={{ width: "100%", height: "360px" }}>
            <CustomBarChart
              data={data}
              organizations={organizations}
              dimension="phase_name"
              measure="total_count"
            />
          </Card>
        </Grid>
      ) : (
        <Grid item xs={4}>
          <Typography className={classes.title}>Projects by Phases</Typography>
          <Blocks
            data={data}
            organizations={organizations}
            dimension="phase_name"
            measure="total_count"
          />
        </Grid>
      )}

      {userInfo &&
        userInfo.current_role &&
        Number(userInfo.current_role.role_id) !== 7 && (
          <React.Fragment></React.Fragment>
        )}
    </Grid>
  );
}

export default Dashboard;
