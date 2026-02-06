import React, { useEffect, useState } from "react";
import {
  List,
  Filter,
  FunctionField,
  TextInput,
  SimpleList,
  Datagrid,
  TextField,
  usePermissions,
  ReferenceInput,
  SelectInput,
  TopToolbar,
  CreateButton,
  ExportButton,
  FilterButton,
  Button,
  useDataProvider,
} from "react-admin";
import { Box, Typography, useMediaQuery } from "@material-ui/core";
import { Fragment } from "react";
import CustomFilter from "../../components/CustomFilter";
import { useSelector } from "react-redux";
import lodash from "lodash";

const Empty = (props) => {
  const { loading, loaded, total } = props;
  const { permissions } = usePermissions();
  if (total === 0 && !loading && loaded) {
    return (
      <Box textAlign="center" m={1}>
        <Typography variant="h4" paragraph>
          There are no deleted users in the system
          <br />
          <br />
          <Button onClick={props.onSetFilter} label={"Show All"}></Button>
        </Typography>
      </Box>
    );
  }

  return <div></div>;
};

const Filters = (props) => {
  const appConfig = useSelector((state) => state.app.appConfig);
  const { organizational_config } = appConfig;

  return (
    <Filter
      {...props}
      variant="outlined"
      margin="none"
      style={{ alignItems: "center" }}
    >
      <TextInput
        label="Username"
        source="username"
        alwaysOn
        variant="outlined"
        margin="none"
      />
      <TextInput
        label="User Full Name"
        source="full_name"
        alwaysOn
        variant="outlined"
        margin="none"
      />

      <ReferenceInput
        perPage={-1}
        source="role_id"
        reference="roles"
        alwaysOn
        allowEmpty
      >
        <SelectInput optionText="name" />
      </ReferenceInput>
      <CustomFilter
        {...props}
        level={1}
        source={organizational_config[1].id}
        label={organizational_config[1].name}
        organizations={props.organizations}
        organizational_config={organizational_config}
        alwaysOn
        allowEmpty
      />
    </Filter>
  );
};

const Actions = (props) => {
  return (
    <TopToolbar>
      <CreateButton {...props} style={{ paddingTop: 0, minHeight: 0 }} />
      <ExportButton {...props} style={{ paddingTop: 0, minHeight: 0 }} />
      <Button
        onClick={() => {
          props.onSetFilter();
        }}
        style={{ paddingTop: 0, minHeight: 0 }}
        label={props.showDeleted ? "Hide Deleted" : "Show Deleted"}
      ></Button>
    </TopToolbar>
  );
};

const UserList = (props) => {
  const [showDeleted, setShowDeleted] = useState(false);
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("xs"));
  const [organizations, setOrganizations] = useState([]);
  const organizationsResources = useSelector(
    (state) => state.admin.resources.organizations
  );
  const dataProvider = useDataProvider();

  useEffect(() => {
    if (
      !organizationsResources ||
      (organizationsResources && lodash.isEmpty(organizationsResources.data))
    ) {
      dataProvider
        .getList("organizations", {
          pagination: { page: 1, perPage: -1 },
          sort: { sort_field: "name", sort_order: "asc" },
          filter: {
            is_hidden: false,
          },
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

  function handleSetFilter() {
    setShowDeleted(!showDeleted);
  }

  return (
    <List
      {...props}
      filters={<Filters organizations={organizations} />}
      perPage={25}
      empty={<Empty onSetFilter={handleSetFilter} {...props} />}
      actions={
        <Actions onSetFilter={handleSetFilter} showDeleted={showDeleted} />
      }
      filter={{ is_deleted: showDeleted }}
      bulkActionButtons={false}
    >
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.username}
          secondaryText={(record) => `${record.full_name}`}
          tertiaryText={(record) => record.roles}
        />
      ) : (
        <Datagrid rowClick="show">
          <TextField source="id" />
          <TextField source="username" />
          <TextField source="full_name" />
          <FunctionField
            source="organization"
            label="Department"
            render={(record) =>
              record
                ? record.organization &&
                  `${record.organization.code} - ${record.organization.name}`
                : null
            }
          />
        </Datagrid>
      )}
    </List>
  );
};

export default UserList;
