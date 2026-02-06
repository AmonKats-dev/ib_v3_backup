import React from "react";
import { Fragment } from "react";
import {
  Datagrid,
  EditButton,
  List,
  ReferenceField,
  ShowButton,
  TextField,
  DeleteWithConfirmButton,
  CreateButton,
  TopToolbar,
} from "react-admin";
import { useCheckPermissions } from "../../../../helpers/checkPermission";
const ListActions = (props) => (
  <TopToolbar>{props.hasEditAccess && <CreateButton {...props} />}</TopToolbar>
);

const OutcomesList = ({ translate, ...props }) => {
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
        <ReferenceField source="ndp_goal_id" reference="ndp-goals">
          <TextField source="name" />
        </ReferenceField>
        <TextField source="name" />
        <EditButton />
        <DeleteWithConfirmButton />
      </Datagrid>
    </List>
  );
};

export default OutcomesList;
