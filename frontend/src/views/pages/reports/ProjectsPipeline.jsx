import React from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import ExportActions from "./ExportActions";
import { EXPORT_TYPES } from "../../../constants/common";
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
import { checkFeature } from "../../../helpers/checkPermission";
import { dateFormatter } from "../../../helpers";
import Box from "@material-ui/core/Box";

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
          No projects in Pipeline stage
        </Typography>
      </Box>
    );
  }
  return <Pagination {...props} />;
};

export default function ProjectsPipeline(props) {
  const classes = useStyles();
  const translate = useTranslate();

  return (
    <div>
      <ExportActions
        reportId="report-container"
        title="Projects in Pipeline"
        exportTypes={[EXPORT_TYPES.WORD, EXPORT_TYPES.PDF, EXPORT_TYPES.XLS]}
      />
      <Typography className={classes.title}>Projects in Pipeline</Typography>
      <List
        {...props}
        basePath="/projects"
        resource="projects"
        bulkActionButtons={false}
        actions={false}
        // filter={{ is_deleted: false, phase_id: 3 }} //TODO change 3 with feature
        filter={{ is_deleted: false, phase_ids: [5] }}
        perPage={25}
        pagination={<EmptyDashboard />}
      >
        <Datagrid rowClick={"show"}>
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
        </Datagrid>
      </List>
    </div>
  );
}
