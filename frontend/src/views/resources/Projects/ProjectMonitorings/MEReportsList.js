import React, { useState, useEffect } from "react";
import {
  Edit,
  ShowButton,
  useDataProvider,
  List,
  TextField,
  Datagrid,
  EditButton,
  DateField,
  FunctionField,
  Button,
  DeleteWithConfirmButton,
} from "react-admin";
import { useNotify, useRefresh, useRedirect, SimpleForm } from "react-admin";
import {
  // Button,
  FormControl,
  Grid,
  InputLabel,
  // List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import { ThemeProvider, makeStyles, useTheme } from "@material-ui/core/styles";
import lodash from "lodash";
import ListActions from "./Actions/ListActions";
import {
  checkFeature,
  useCheckPermissions,
} from "../../../../helpers/checkPermission";

const redirectEdit = (basePath, id, data) => {
  return `/projects/${data.project_id}/show/${data.phase_id}`;
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    paddingTop: theme.spacing(8),
  },
  ganttChartTable: {
    "& th": {
      borderLeft: "3px solid #c8ced3",
    },

    "& td": {
      padding: "3px 0px !important",
      borderLeft: "1px solid #c8ced3",
    },

    "& .title": {
      paddingLeft: "15px !important",
    },

    "& .filledCell": {
      background: "blue",
      padding: "12px 0px",
    },
  },
  button: {
    marginLeft: 15,
  },
  actions: {
    width: "100%",
    marginBottom: 20,
  },
}));

function Empty(props) {
  return (
    <div>
      <Typography variant="h4" style={{ textAlign: "center" }}>
        No reports
      </Typography>
      <ListActions
        projectId={props.projectId}
        yearReport={props.yearReport}
        {...props}
      />
    </div>
  );
}

function MEReportsList(props) {
  const [projectDetails, setProjectDetails] = useState({});
  const [value, setValue] = React.useState(0);
  const classes = useStyles();
  const dataProvider = useDataProvider();
  const checkPermission = useCheckPermissions();

  const projectDetailId =
    props.location &&
    props.match &&
    props.match.params &&
    props.match.params.id;

  useEffect(() => {
    if (props.match?.params?.report_type === "quarter") {
      setValue(1);
    }
    if (props.match?.params?.report_type === "periodical") {
      setValue(0);
    }

    dataProvider
      .getOne("project-details", {
        id: projectDetailId,
      })
      .then((resp) => {
        if (resp && resp.data) {
          setProjectDetails(resp.data);
        }
      });
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function disableCreateButton() {
    if (checkFeature("has_pimis_fields")) {
      return (
        projectDetails.project &&
        (projectDetails.project.project_status === "COMPLETED" ||
          projectDetails.project.project_status === "POST_EVALUATION")
      );
    }

    const isDisabled =
      props.match?.params?.report_type === "periodical" ||
      props.match?.params?.report_type === "quarter" ||
      (projectDetails.project &&
        (projectDetails.project.project_status === "COMPLETED" ||
          projectDetails.project.project_status === "POST_EVALUATION"));

    return checkPermission("create_me_report") && !isDisabled;
  }

  function renderContent() {
    switch (value) {
      case 0:
        return (
          <List
            basePath="/me-reports"
            resource="me-reports"
            filter={{ project_detail_id: projectDetailId, frequency: "CUSTOM" }}
            bulkActionButtons={false}
            exporter={false}
            actions={
              <ListActions
                projectId={projectDetails.project_id}
                disableCreate={disableCreateButton()}
              />
            }
            empty={
              <Empty
                projectId={projectDetails.project_id}
                disableCreate={disableCreateButton()}
              />
            }
          >
            <Datagrid>
              <TextField source="id" />
              <TextField source="report_status" />
              <DateField source="created_on" />
              <FunctionField
                label="Created by"
                render={(record) => record.user && `${record.user.full_name}`}
              />
              <FunctionField
                label="Department"
                render={(record) =>
                  record.user &&
                  record.user.organization &&
                  `${record.user.organization.name}`
                }
              />
              <TextField source="year" />
              <TextField source="quarter" />
              {checkPermission("me_show_periodical_report") && <ShowButton />}
            </Datagrid>
          </List>
        );
      case 1:
        return (
          <List
            basePath="/me-reports"
            resource="me-reports"
            filter={{ project_detail_id: projectDetailId, frequency: "ANNUAL" }}
            bulkActionButtons={false}
            empty={
              <Empty
                projectId={projectDetails.project_id}
                yearReport
                disableCreate={disableCreateButton()}
              />
            }
            exporter={false}
            actions={
              <ListActions
                projectId={projectDetails.project_id}
                yearReport
                disableCreate={disableCreateButton()}
              />
            }
          >
            <Datagrid>
              <TextField source="id" />
              <TextField source="report_status" />
              <DateField source="created_on" />
              <FunctionField
                label="Created by"
                render={(record) => record.user && `${record.user.full_name}`}
              />
              <FunctionField
                label="Department"
                render={(record) =>
                  record.user &&
                  record.user.organization &&
                  `${record.user.organization.name}`
                }
              />
              <TextField source="year" />
              <TextField source="quarter" />
              {checkPermission("me_show_year_report") && <ShowButton />}
            </Datagrid>
          </List>
        );
      default:
        break;
    }
  }

  return (
    <div className={classes.reportContainer}>
      <div className={classes.actions}>
        <Button
          href={`/#/projects/${projectDetails.project_id}/show`}
          label="Back to Project"
        />
      </div>

      <Paper>
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
        >
          {props.match?.params?.report_type !== "quarter" &&
            checkPermission("me_list_periodical_report") && (
              <Tab label="Periodical Reports" />
            )}
          {props.match?.params?.report_type !== "periodical" &&
            checkPermission("me_list_year_report") && (
              <Tab label="Quarterly Reports" />
            )}
        </Tabs>
        {renderContent()}
      </Paper>
    </div>
  );
}

export default MEReportsList;
