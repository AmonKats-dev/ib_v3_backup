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
import { costSumFormatter } from "../../resources/Projects/Report/helpers";

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

function MycReport(props) {
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
      <div style={{ margin: "1em", overflow: "auto" }}>
        <Table style={{ overflow: "auto" }}>
          <TableHead>
            <TableRow className={classes.filledRow}>
            <TableCell style={{ minWidth: 350 }}>
                {"Vote"}
              </TableCell>
              <TableCell style={{ minWidth: 350 }}>
                {"Project Code and Name"}
              </TableCell>
              <TableCell style={{ minWidth: 100 }}>{"Funding Source"}</TableCell>
              <TableCell style={{ minWidth: 100 }}>{"Start Date"}</TableCell>
              <TableCell style={{ minWidth: 100 }}>{"End Date"}</TableCell>
              <TableCell style={{ minWidth: 100 }}>{"Project Status"}</TableCell>
              <TableCell style={{ minWidth: 100 }}>
                {"Project Classification"}
              </TableCell>
              <TableCell style={{ minWidth: 100 }}>
                {"Spending since start of project"}
              </TableCell>
              <TableCell style={{ minWidth: 100 }}>
                {"Approved Budget FY "}1
              </TableCell>
              <TableCell style={{ minWidth: 100 }}>
                {"Estimate of Arrears at end of the current FY 1"}
              </TableCell>
              <TableCell style={{ minWidth: 100 }}>
                {"Counterpart Funding signed agreements only (value FY 1)"}
              </TableCell>
              <TableCell style={{ minWidth: 100 }}>
                {"Cash Required for Commitments (FY 1)"}
              </TableCell>
              <TableCell style={{ minWidth: 100 }}>
                {"Arrears + All Contractual Commitments (FY 1 )"}
              </TableCell>
              <TableCell style={{ minWidth: 100 }}>{"FY-2"}</TableCell>
              <TableCell style={{ minWidth: 100 }}>{"FY 3"}</TableCell>
              <TableCell style={{ minWidth: 100 }}>{"FY 4"}</TableCell>
              <TableCell style={{ minWidth: 100 }}>{"FY 5"}</TableCell>
              <TableCell style={{ minWidth: 100 }}>
                {"Outstanding Commitments"}
              </TableCell>
              <TableCell style={{ minWidth: 100 }}>
                {"Cumulative expenditure"}
              </TableCell>
              <TableCell style={{ minWidth: 100 }}>
                {"Approved Project Costs by DC as indicated in the PIP"}
              </TableCell>
              <TableCell style={{ minWidth: 100 }}>{"Comments from MDA"}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ids
              .filter((id) => data[id] && data[id].myc_data)
              .map((id) => {
                const projectData = data[id];

                return (
                  <TableRow
                    key={projectData.id}
                    // onClick={handleRedirect(projectData.id)}
                  >
                    <TableCell>{`${projectData.project_organization.parent.name}`}</TableCell>
                    <TableCell>{`${projectData.code} - ${projectData.name}`}</TableCell>
                    <TableCell>{projectData.myc_data.funding_source}</TableCell>
                    <TableCell>
                      {dateFormatter(projectData.myc_data.start_date)}
                    </TableCell>
                    <TableCell>
                      {dateFormatter(projectData.myc_data.end_date)}
                    </TableCell>
                    <TableCell>{projectData.myc_data.status}</TableCell>
                    <TableCell>{projectData.myc_data.classification}</TableCell>
                    <TableCell>
                      {projectData.myc_data.start_spending &&
                        costSumFormatter(projectData.myc_data.start_spending)}
                    </TableCell>
                    <TableCell>
                      {projectData.myc_data.approved_budget &&
                        costSumFormatter(projectData.myc_data.approved_budget)}
                    </TableCell>
                    <TableCell>
                      {projectData.myc_data.estimate_areas &&
                        costSumFormatter(projectData.myc_data.estimate_areas)}
                    </TableCell>
                    <TableCell>
                      {projectData.myc_data.counterpart_funding &&
                        costSumFormatter(
                          projectData.myc_data.counterpart_funding
                        )}
                    </TableCell>
                    <TableCell>
                      {projectData.myc_data.cash_required &&
                        costSumFormatter(projectData.myc_data.cash_required)}
                    </TableCell>
                    <TableCell>
                      {projectData.myc_data.arrears_contractual &&
                        costSumFormatter(
                          projectData.myc_data.arrears_contractual
                        )}
                    </TableCell>
                    <TableCell>
                      {projectData.myc_data.estimate_f2 &&
                        costSumFormatter(projectData.myc_data.estimate_f2)}
                    </TableCell>
                    <TableCell>
                      {projectData.myc_data.estimate_f3 &&
                        costSumFormatter(projectData.myc_data.estimate_f3)}
                    </TableCell>
                    <TableCell>
                      {projectData.myc_data.estimate_f4 &&
                        costSumFormatter(projectData.myc_data.estimate_f4)}
                    </TableCell>
                    <TableCell>
                      {projectData.myc_data.estimate_f5 &&
                        costSumFormatter(projectData.myc_data.estimate_f5)}
                    </TableCell>
                    <TableCell>
                      {projectData.myc_data.outstanding_commitments &&
                        costSumFormatter(
                          projectData.myc_data.outstanding_commitments
                        )}
                    </TableCell>
                    <TableCell>
                      {projectData.myc_data.cumulative_expenditure &&
                        costSumFormatter(
                          projectData.myc_data.cumulative_expenditure
                        )}
                    </TableCell>
                    <TableCell>
                      {projectData.myc_data.approved_project_costs &&
                        costSumFormatter(
                          projectData.myc_data.approved_project_costs
                        )}
                    </TableCell>
                    <TableCell>{projectData.myc_data.mda_comments}</TableCell>
                  </TableRow>
                );
              })}
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
        <Card style={{ overflow: "auto" }}>
          <List
            {...props}
            basePath="/projects"
            resource="projects"
            bulkActionButtons={false}
            actions={false}
            filter={{ phase_id: 7 }}
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

export default MycReport;
