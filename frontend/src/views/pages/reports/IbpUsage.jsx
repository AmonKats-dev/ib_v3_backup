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
import { dateFormatter } from "../../../helpers";
import lodash from "lodash";
import { makeStyles } from "@material-ui/core";
import CustomProjectsList from "./CustomProjectsList";
import ExportActions from "./ExportActions";
import { EXPORT_TYPES } from "../../../constants/common";
import { useEffect } from "react";
import moment from "moment";
import { costSumFormatter } from "../../resources/Projects/Report/helpers";
import { WorkflowStatusMessage } from "../../modules/Reports/helpers";

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

function IbpUsage(props) {
  const [data, setData] = React.useState([]);
  const [dataPivot, setDataPivot] = React.useState([]);
  const [organizations, setOrganizations] = React.useState([]);
  const translate = useTranslate();
  const classes = useStyles();
  const dataProvider = useDataProvider();

  useEffect(() => {
    dataProvider
      .getListOfAllProjects("reports/projects-min-report", {
        sort_field: "id",
      })
      .then((response) => {
        if (response && response.data) {
          const projects = lodash
            .sortBy(
              response.data.filter((item) => item && item.current_step > 1),
              (it) =>
                it.current_timeline &&
                getDaysFromSubmisson(it.current_timeline.created_on)
            )
            .reverse();

          const grouppedData = lodash.groupBy(
            projects,
            (item) =>
              item &&
              item.project_organization &&
              item.project_organization.parent &&
              item.project_organization.parent.name
          );

          setData(grouppedData);
        }
      });
  }, []);

  const getDaysFromSubmisson = (date) => {
    const dateStart = moment(date);
    const dateSEnd = moment();
    const diff = dateSEnd.diff(dateStart, "days");
    return diff;
  };

  return (
    <Grid container spacing={3}>
      <ExportActions
        reportId="report-container"
        title="IBP User Action Tracking Report"
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
          {
            <div style={{ margin: "1em" }}>
              <table
                style={{ width: "100%" }}
                cellSpacing={0}
                className="bordered"
              >
                <thead>
                  <tr>
                    <th style={{ width: "15%" }}>
                      {translate("resources.projects.fields.project_no")}
                    </th>
                    <th style={{ width: "30%" }}>
                      {translate("resources.projects.fields.title")}
                    </th>
                    <th style={{ width: "30%" }}>
                      {translate("resources.projects.fields.vote_id")}
                    </th>
                    <th style={{ width: "20%" }}>
                      {translate("resources.projects.fields.status")}
                    </th>
                    <th style={{ width: "20%" }}>
                      {translate("resources.projects.fields.total_costs")}
                    </th>
                    <th
                      style={{ width: "15%" }}
                    >{`Time waiting for Decision as at ${moment().format(
                      "Do MMMM YYYY"
                    )} `}</th>
                    <th style={{ width: "15%" }}>
                      {translate("resources.projects.fields.created_at")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lodash.keys(data).map((sectorId) => [
                    <tr>
                      <td
                        colSpan={7}
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                        }}
                      >
                        {sectorId}
                      </td>
                    </tr>,
                    data[sectorId].map((item) => (
                      <tr>
                        <td style={{ width: "150px" }}>{item.code}</td>
                        <td>{item.name}</td>
                        <td>
                          {item.project_organization &&
                            item.project_organization.name}
                        </td>

                        <td>
                          {item.workflow && (
                            <WorkflowStatusMessage record={item} />
                          )}
                        </td>
                        <td>
                          {item.total_costs &&
                            costSumFormatter(item.total_costs)}
                        </td>
                        <td>
                          {item.current_timeline &&
                            `${getDaysFromSubmisson(
                              item.current_timeline.created_on
                            )} days`}
                        </td>
                        <td>
                          {item.current_timeline &&
                            dateFormatter(
                              item.current_timeline.created_on,
                              false
                            )}
                        </td>
                      </tr>
                    )),
                  ])}
                </tbody>
              </table>
            </div>
          }
          {/* <List
            {...props}
            basePath="/projects"
            resource="projects"
            bulkActionButtons={false}
            actions={false}
            perPage={100}
            filter={{ expand: "timeline" }} //TODO add last step workflow
          >
            <CustomProjectsList grouppedBySector />
          </List> */}
        </Card>
      </Grid>
    </Grid>
  );
}

export default IbpUsage;
