// in src/Dashboard.js
import { Divider, Grid, makeStyles, Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import * as React from "react";
import { useEffect } from "react";
import {
  Datagrid,
  FunctionField,
  List,
  Pagination,
  TextField,
  useDataProvider,
  useTranslate,
} from "react-admin";
import { EXPORT_TYPES } from "../../../constants/common";
import { dateFormatter } from "../../../helpers";
import { checkFeature } from "../../../helpers/checkPermission";
import MeReportsShowButton from "../../resources/Projects/Actions/Show/MeReportsShowButton";
import { MeReportView } from "../../resources/Projects/ProjectMonitorings/MEReportsShow";
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
          No projects are in Pipeline status
        </Typography>
      </Box>
    );
  }
  return <Pagination {...props} />;
};

function ConsolidatedAnnualReport(props) {
  const [details, setDetails] = React.useState([]);
  const [reports, setReports] = React.useState([]);
  const translate = useTranslate();
  const dataProvider = useDataProvider();

  useEffect(() => {
    // me-reports/?filter={"project_detail_ids":[1,2,3], "report_status":"PUBLISHED"}
    dataProvider
      .getListOfAll("projects", {
        filter: {
          is_deleted: false,
          phase_id: 7,
        },
      })
      .then((response) => {
        if (response && response.data) {
          const ids = response.data
            .map((item) => item?.current_project_detail?.id)
            .filter((item) => item);

          //       setDetails(ids);

          dataProvider
            .getListOfAll("me-reports", {
              sort_field: "id",
              filter: {
                report_status: "COMPLETED",
                project_detail_ids: ids,
              },
            })
            .then((response) => {
              if (response && response.data) {
                setReports(response.data);
              }
            });
        }
      });
  }, []);

  return (
    <Grid container spacing={3} style={{ paddingTop: 20 }}>
      <Grid item xs={12}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 20,
            marginTop: 10,
            alignItems: "center",
          }}
        >
          <Typography variant="h4" style={{ width: "100%" }}>
            {translate(
              `resources.${props.location.pathname.slice(
                1,
                props.location.pathname.length
              )}.name`
            )}
          </Typography>
          <ExportActions
            reportId="report-container"
            title="Consolidated M&E Report"
            exportTypes={[
              EXPORT_TYPES.WORD,
              EXPORT_TYPES.PDF,
              EXPORT_TYPES.XLS,
            ]}
          />
        </div>

        <Card style={{ padding: 25 }} id="report-container">
          {/* {reports.map((item) => (
            <p key={item.id}>{item.id}</p>
          ))} */}
          {reports.map((report) => (
            <>
              <MeReportView
                record={report}
                projectDetails={report.project_detail}
              />
              <Divider variant="fullWidth" style={{ margin: '35px 0px'}} />
            </>
          ))}
        </Card>
      </Grid>
    </Grid>
  );
}

export default ConsolidatedAnnualReport;
