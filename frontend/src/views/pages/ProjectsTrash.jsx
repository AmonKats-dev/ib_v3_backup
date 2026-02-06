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

import { dateFormatter } from "../../helpers";
import lodash from "lodash";
import { makeStyles } from "@material-ui/core";
import { useSelector } from "react-redux";
import CustomShowButton from "../resources/Projects/Actions/Buttons/CustomShowButton";

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

function ProjectsTrash(props) {
  const [data, setData] = React.useState([]);
  const [dataPivot, setDataPivot] = React.useState([]);
  const [organizations, setOrganizations] = React.useState([]);
  const translate = useTranslate();
  const classes = useStyles();
  const dataProvider = useDataProvider();
  const userInfo = useSelector((state) => state.user.userInfo);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <List
          {...props}
          basePath="/projects"
          resource="projects"
          bulkActionButtons={false}
          actions={false}
          filter={{ is_deleted: 1 }}
          perPage={25}
          sort={{ field: "id", order: "DESC" }}
        >
          <Datagrid>
            <TextField source="code" />
            <TextField source="name" />
            <FunctionField
              source="modified_on"
              label={translate(`resources.projects.fields.deleted_on`)}
              render={(record) =>
                record ? dateFormatter(record.modified_on) : null
              }
            />
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
    </Grid>
  );
}

export default ProjectsTrash;
