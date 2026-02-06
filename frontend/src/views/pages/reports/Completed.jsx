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
  useRedirect,
  useListContext,
} from "react-admin";
import {
  Grid,
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
import lodash from "lodash";
import { makeStyles } from "@material-ui/core";
import { EXPORT_TYPES } from "../../../constants/common";
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
}));

const EmptyDashboard = (props) => {
  const { loading, loaded, total } = props;
  if (total === 0 && !loading && loaded) {
    return (
      <Box textAlign="center" m={3}>
        <Typography variant="h5" paragraph>
          No projects are in Completed status
        </Typography>
      </Box>
    );
  }
  return <Pagination {...props} />;
};

function Completed(props) {
  const [organizations, setOrganizations] = React.useState([]);
  const translate = useTranslate();
  const classes = useStyles();
  const dataProvider = useDataProvider();
  const redirect = useRedirect();

  React.useEffect(() => {
    dataProvider.getListOfAll("organizations", {}).then((response) => {
      if (response && response.data) {
        setOrganizations(lodash.sortBy(response.data, "name"));
      }
    });
  }, []);

  const handleRedirect = (id) => () => {
    redirect(`/projects/${id}/show`);
  };

  const Projects = () => {
    const { ids, data, basePath } = useListContext();
    return (
      <div style={{ margin: "1em" }}>
        <Table>
          <TableHead>
            <TableRow className={classes.filledRow}>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Submission Date</TableCell>
              {/* <TableCell>Sector</TableCell>
              <TableCell>Vote</TableCell> */}
              <TableCell>Status</TableCell>
              <TableCell>Phase</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ids.map((id) => (
              <TableRow key={data[id].id} onClick={handleRedirect(data[id].id)}>
                <TableCell>{data[id].code}</TableCell>
                <TableCell>{data[id].name}</TableCell>
                <TableCell>{dateFormatter(data[id].created_on)}</TableCell>
                <TableCell>
                  {translate(
                    `timeline.${data[id].project_status.toLowerCase()}`
                  )}
                </TableCell>
                <TableCell>{data[id].phase && data[id].phase.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <Grid container spacing={3}>
      <ExportActions
        reportId="report-container"
        title={translate(
          `resources.${props.location.pathname.slice(
            1,
            props.location.pathname.length
          )}.name`
        )}
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
          <List
            {...props}
            basePath="/projects"
            resource="projects"
            bulkActionButtons={false}
            actions={false}
            filter={{ project_status: "COMPLETED" }}
            pagination={<EmptyDashboard />}
            sort={{ field: "id", order: "DESC" }}
          >
            <Projects />
          </List>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Completed;
