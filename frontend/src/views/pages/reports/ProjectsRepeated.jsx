// in src/Dashboard.js
import React, { useEffect, useState } from "react";

import { useDataProvider, useTranslate } from "react-admin";
import {
  Grid,
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
import { WorkflowStatusMessage } from "../../modules/Reports/helpers";

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

function ProjectsRepeated(props) {
  const [data, setData] = useState([]);
  const translate = useTranslate();
  const classes = useStyles();
  const dataProvider = useDataProvider();

  useEffect(() => {
    dataProvider
      .getListOfAll("projects", { sort_field: "id" })
      .then((response) => {
        if (response && response.data) {
          if (!checkFeature("has_pimis_fields")) {
            const filteredData = lodash.groupBy(
              response.data,
              (item) => item.name
            );
            let duplicates = [];

            for (const key in filteredData) {
              if (filteredData.hasOwnProperty(key)) {
                const element = filteredData[key];

                if (element.length > 1) {
                  duplicates = [...duplicates, ...element];
                }
              }
            }

            setData(duplicates);
          } else {
            const filteredData = lodash.groupBy(
              response.data,
              (item) => item.organization_id
            );
            for (const key in filteredData) {
              if (filteredData.hasOwnProperty(key)) {
                const element = filteredData[key];

                if (element.length > 1) {
                  const groupedData = lodash.groupBy(element, (item) =>
                    moment(item.start_date)
                  );

                  for (const keyData in groupedData) {
                    if (groupedData.hasOwnProperty(keyData)) {
                      const keyDataElement = groupedData[keyData];
                      const groupedKeyData = lodash.groupBy(
                        keyDataElement,
                        (item) => moment(item.end_date)
                      );
                      if (
                        groupedKeyData[Object.keys(groupedKeyData)[0]].length >
                        1
                      ) {
                        setData(groupedKeyData[Object.keys(groupedKeyData)[0]]);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });
  }, []);

  return (
    <Grid container spacing={3}>
      <ExportActions
        reportId="report-container"
        title="Repeated Projects"
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
          <Table>
            <TableHead>
              <TableRow className={classes.filledRow}>
                <TableCell width="100px">ID</TableCell>
                <TableCell className={classes.titleColumn}>Title</TableCell>
                <TableCell align="center">Phase</TableCell>
                <TableCell align="center">Start Date</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Last Modified</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((project) => (
                <TableRow>
                  <TableCell>{project.code}</TableCell>
                  <TableCell>{project.name}</TableCell>
                  <TableCell align="center">
                    {project.phase && project.phase.name}
                  </TableCell>
                  <TableCell align="center">
                    {getFiscalYearValue(project.created_on).name}
                  </TableCell>
                  <TableCell align="center">
                  {project.workflow && (
                        <WorkflowStatusMessage record={project} />
                      )}
                  </TableCell>
                  <TableCell align="center">
                    {dateFormatter(project.modified_on)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Grid>
    </Grid>
  );
}

export default ProjectsRepeated;
