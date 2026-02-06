import {
  CreateButton,
  Datagrid,
  FunctionField,
  List,
  SimpleList,
  TextField,
  useDataProvider,
  usePermissions,
  useTranslate,
} from "react-admin";
import React, { useEffect, useState } from "react";
import {
  checkFeature,
  checkPermission,
} from "../../../../helpers/checkPermission";

import Box from "@material-ui/core/Box";
import CustomShowButton from "../../../resources/Projects/Actions/Buttons/CustomShowButton";
import ProjectsActions from "../../../resources/Projects/Actions/List";
import ProjectsFilters from "../../../resources/Projects/Filters";
import ProjectsListFilters from "./ProjectsListFilters";
import Typography from "@material-ui/core/Typography";
import { dateFormatter } from "../../../../helpers";
import {
  exporter,
  WorkflowStatusMessage,
} from "../../../modules/Reports/helpers";
import lodash from "lodash";
import { useMediaQuery } from "@material-ui/core";
import { useSelector } from "react-redux";

const NavigationProjectsList = (props) => {
  const [organizations, setOrganizations] = useState([]);
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("xs"));
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const { permissions } = usePermissions();
  const organizationsResources = useSelector(
    (state) => state.admin.resources.organizations
  );

  const Empty = (props) => {
    const { loading, loaded, total } = props;
    const { permissions } = usePermissions();

    if (total === 0 && !loading && loaded) {
      return (
        <Box textAlign="center" m={1}>
          <Typography variant="h4" paragraph>
            There are no projects in the system
            <br />
            <br />
            {checkPermission(props.permissions, "create_project") && (
              <CreateButton
                basePath="/projects"
                permissions={props.permissions}
              />
            )}
          </Typography>
        </Box>
      );
    }

    return <div></div>;
  };

  useEffect(() => {
    if (
      !organizationsResources ||
      (organizationsResources && lodash.isEmpty(organizationsResources.data))
    ) {
      dataProvider
        .getList("organizations", {
          pagination: { page: 1, perPage: -1 },
          sort: { sort_field: "id", sort_order: "asc" },
          filter: {},
        })
        .then((response) => {
          setOrganizations(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      const organizationsData = lodash
        .keys(organizationsResources.data)
        .map((key) => organizationsResources.data[key]);
      setOrganizations(organizationsData);
    }
  }, []);

  return (
    <List
      sort={{ field: "id", order: "DESC" }}
      filter={{ is_deleted: false, ...props.filter }}
      filters={<ProjectsListFilters organizations={organizations} />}
      actions={<ProjectsActions {...props} />}
      bulkActionButtons={false}
      empty={<Empty {...props} />}
      exporter={exporter}
      basePath="/projects"
      resource="projects"
    >
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.name}
          secondaryText={(record) => `${record.code}`}
          tertiaryText={(record) => record.phase_id}
        />
      ) : (
        <Datagrid>
          <TextField source="code" />
          <TextField source="name" />
          <FunctionField
            source="created_on"
            label={translate(`resources.projects.fields.created_at`)}
            render={(record) =>
              record ? dateFormatter(record.submission_date) : null
            }
          />
          <FunctionField
            source="created_on"
            label={translate(`resources.projects.fields.created_by`)}
            render={(record) =>
              record ? record.user && record.user.full_name : null
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

          <FunctionField
            source="phase"
            label={`resources.projects.fields.phase_id`}
            render={(record) =>
              record && record.phase ? record.phase.name : null
            }
          />
          <FunctionField
            source="workflow_id"
            label={"Workflow Status"}
            render={(record) => {
              return record && <WorkflowStatusMessage record={record} />;
            }}
          />
          <CustomShowButton />
        </Datagrid>
      )}
    </List>
  );
};

export default NavigationProjectsList;
