import React from "react";
import {
  Datagrid,
  DeleteWithConfirmButton,
  EditButton,
  List,
  ShowButton,
  TopToolbar,
  TextField,
  CreateButton,
} from "react-admin";
import { useCheckPermissions } from "../../../../helpers/checkPermission";

const ListActions = (props) => (
  <TopToolbar>{props.hasEditAccess && <CreateButton {...props} />}</TopToolbar>
);

const GoalsList = ({ translate, ...props }) => {
  const checkPermission = useCheckPermissions();

  return (
    <List
      {...props}
      bulkActionButtons={false}
      actions={
        <ListActions {...props} hasEditAccess={checkPermission("edit_ndp")} />
      }
    >
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="name" />
        <EditButton />
        <DeleteWithConfirmButton />
      </Datagrid>
    </List>
  );
};

export default GoalsList;
