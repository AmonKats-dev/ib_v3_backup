import React from "react";
import {
  List,
  SimpleList,
  Datagrid,
  TextField,
  TopToolbar,
  CreateButton,
  usePermissions,
  ShowButton
} from "react-admin";
import { useMediaQuery, Button } from "@material-ui/core";
import { Link } from 'react-router-dom';
import CustomCreateButton from "./CustomCreateButton";

const CreateRelatedRecord = (props) => (
  <Button
      component={Link}
      to={{
          pathname: '/organizations/create',
          state: { record: { level: props.level, redirect: props.basePath } },
      }}
  >
      Create
  </Button>
);

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
  level
}) => (
  <TopToolbar>
    <CustomCreateButton basePath={basePath} level={level} />
  </TopToolbar>
);

const OrganizationsList = (props) => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("xs"));

  return (
    <List filter={{ level: props.level }} actions={<ListActions level={props.level} />} {...props}  bulkActionButtons={false}>
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
          <ShowButton basePath="organizations" />
        </Datagrid>
      )}
    </List>
  );
};

export default OrganizationsList;
