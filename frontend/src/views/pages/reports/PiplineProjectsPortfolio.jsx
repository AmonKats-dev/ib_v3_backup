// in src/Dashboard.js
import React, { useEffect, useState } from "react";

import { useDataProvider, useTranslate } from "react-admin";
import {
  Button,
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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
import { EXPORT_TYPES } from "../../../constants/common";
import { checkFeature } from "../../../helpers/checkPermission";

const useStyles = makeStyles((theme) => ({
  topGroup: {
    display: "flex",
    justifyContent: "space-around",
  },
  title: {
    fontWeight: "bold",
    margin: "10px auto",
  },
  subtitle: {
    margin: "10px auto",
  },
  buttonsContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "10px 25px",
  },
  buttons: {
    width: "100px",
    fontSize: "16px",
    display: "flex",
    justifyContent: "space-around",
  },
  titleColumn: {
    width: "35%",
  },
}));

function PiplineProjectsPortfolio(props) {
  const [data, setData] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const translate = useTranslate();
  const classes = useStyles();
  const dataProvider = useDataProvider();

  useEffect(() => {
    dataProvider.getListOfAll("organizations", {}).then((response) => {
      if (response && response.data) {
        setOrganizations(lodash.sortBy(response.data, "name"));
      }
    });
    dataProvider
      .custom("reports", { type: "pivot", method: "GET" })
      .then((response) => {
        if (response && response.data) {
          const filteredData = response.data
            .filter((item) => !lodash.isEmpty(item.costs))
            .filter((item) => item.phase && item.phase.sequence === 4);
          setData(filteredData);
        }
      });
  }, []);

  function getProjectsByVotes(items) {
    const levels = {};

    function findParents(item) {
      if (item && item.level) {
        levels[item.level] = item.id;

        if (item.level === 2) {
          return item;
        }
      }

      if (item && item.parent) {
        return findParents(item.parent);
      }
      return item;
    }

    return lodash.groupBy(
      items,
      (item) => findParents(item.project_organization).name
    );
  }

  const projectsBySectors = getProjectsBySectors(data);

  return (
    <Grid container spacing={3}>
      <ExportActions
        reportId="report-container"
        title="Pipeline Projects Portfolio"
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
          {projectsBySectors &&
            lodash.keys(projectsBySectors).map((sector) => {
              const projectsByVotes = getProjectsByVotes(
                projectsBySectors[sector]
              );
              return (
                <div>
                  <Typography
                    variant="h3"
                    align="center"
                    paragraph
                    className={classes.title}
                  >
                    <b>{sector}</b>
                  </Typography>
                  {projectsByVotes &&
                    lodash.keys(projectsByVotes).map((vote) => (
                      <React.Fragment>
                        <Typography
                          variant="h5"
                          align="center"
                          paragraph
                          className={classes.subtitle}
                        >
                          {vote}
                        </Typography>
                        <Table>
                          <TableHead>
                            <TableRow className={classes.filledRow}>
                              <TableCell>ID</TableCell>
                              <TableCell className={classes.titleColumn}>
                                Title
                              </TableCell>
                              <TableCell align="center">
                                Cost of Investment (
                                {translate("titles.currency")})
                              </TableCell>
                              <TableCell align="center">
                                Proposed Commencement FY
                              </TableCell>
                              <TableCell align="center">
                                Duration (years)
                              </TableCell>
                              {checkFeature("has_pimis_fields") ? (
                                <TableCell></TableCell>
                              ) : (
                                <TableCell align="center">
                                  Date of Feasibility
                                </TableCell>
                              )}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {projectsByVotes[vote].map((project) => (
                              <TableRow>
                                <TableCell>
                                  <Link
                                    href={`#/projects/${project.id}/show/${project.phase.sequence}`}
                                    underline="always"
                                  >
                                    {project.code}
                                  </Link>
                                </TableCell>
                                <TableCell>
                                  <Link
                                    href={`#/projects/${project.id}/show/${project.phase.sequence}`}
                                    underline="always"
                                  >
                                    {project.name}
                                  </Link>
                                </TableCell>
                                <TableCell align="center">
                                  {costSumFormatter(
                                    calculateCost(project.budget_allocation)
                                  )}
                                </TableCell>
                                <TableCell align="center">
                                  {project.current_project_detail &&
                                    getFiscalYearValue(
                                      project.current_project_detail.created_on
                                    ).name}
                                </TableCell>
                                <TableCell align="center">
                                  {project.current_project_detail &&
                                    moment(
                                      project.current_project_detail.end_date
                                    ).diff(
                                      project.current_project_detail.start_date,
                                      "years"
                                    )}
                                </TableCell>
                                {/* {checkFeature("has_pimis_fields") ? (
                                  <TableCell>
                                    <Link href={`#/projects/${project.id}`}>
                                      <Button
                                        variant="contained"
                                        color="primary"
                                      >
                                        Allocate Budget
                                      </Button>
                                    </Link>
                                  </TableCell>
                                ) : (
                                  <TableCell align="center">
                                    {project.current_project_detail &&
                                      dateFormatter(
                                        project.current_project_detail
                                          .modified_on
                                      )}
                                  </TableCell>
                                )} */}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </React.Fragment>
                    ))}
                </div>
              );
            })}
        </Card>

        {projectsBySectors && lodash.keys(projectsBySectors).length === 0 && (
          <Typography variant="h4" style={{ marginTop: 20 }}>
            No projects
          </Typography>
        )}
      </Grid>
    </Grid>
  );
}

export default PiplineProjectsPortfolio;
