import React from "react";
import {
  Datagrid,
  ReferenceField,
  DeleteWithConfirmButton,
  ChipField,
  EditButton,
  List,
  ShowButton,
  TextField,
  SingleFieldList,
  CreateButton,
  TopToolbar,
  ReferenceArrayField,
} from "react-admin";
import { useCheckPermissions } from "../../../../helpers/checkPermission";

const ListActions = (props) => (
  <TopToolbar>{props.hasEditAccess && <CreateButton {...props} />}</TopToolbar>
);

const StrategiesList = ({ translate, ...props }) => {
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
        <TextField source="name" />
        <EditButton />
        <DeleteWithConfirmButton />
      </Datagrid>
    </List>
  );
};

export default StrategiesList;
