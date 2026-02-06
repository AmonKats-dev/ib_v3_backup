import React from "react";
import {
  List,
  SimpleList,
  Datagrid,
  TextField,
  TopToolbar,
  CreateButton,
  usePermissions,
  ShowButton,
  EditButton
} from "react-admin";
import { useMediaQuery, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import CustomCreateButton from "./CustomCreateButton";
import {
  checkPermission,
  useCheckPermissions,
} from "../../../helpers/checkPermission";

const RESOURCES = {
  organizations: "create_organization",
  programs: "create_program",
  functions: "create_function",
  funds: "create_fund",
  costings: "create_costing",
  locations: "create_location",
};

const ListActions = ({
  currentSort,
  resource,
  displayedFilters,
  filterValues,
  hasCreate,
  basePath,
  selectedIds,
  showFilter,
  total,
  level,
  config,
  field,
  hasEditAccess,
}) => (
  <TopToolbar>
    {hasEditAccess && (
      <CustomCreateButton
        basePath={"/" + resource}
        level={level}
        config={config}
        field={field}
      />
    )}
  </TopToolbar>
);

const OrganizationsList = (props) => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("xs"));
  const checkPermission = useCheckPermissions();

  return (
    <List
      filter={{ level: props.level }}
      actions={
        <ListActions
          resource={props.resource}
          level={props.level}
          config={props.config}
          field={props.field}
          hasEditAccess={
            props.resource && checkPermission(RESOURCES[props.resource])
          }
        />
      }
      {...props}
      bulkActionButtons={false}
    >
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.username}
          secondaryText={(record) => `${record.full_name}`}
          tertiaryText={(record) => record.roles}
        />
      ) : (
        <Datagrid>
          <TextField source="id" />
          <TextField source="code" />
          <TextField source="name" />
          <TextField source="parent_id" />
          <TextField source="level" />
          <ShowButton basePath={props.resource} />
          <EditButton basePath={props.resource} />
        </Datagrid>
      )}
    </List>
  );
};

export default OrganizationsList;
