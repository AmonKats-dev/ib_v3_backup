import React from "react";
import {
  CreateButton,
  Datagrid,
  List,
  TextField,
  TopToolbar,
} from "react-admin";

const WorkflowInstancesActions = (props) => {
  return (
    <TopToolbar>
      <CreateButton {...props} />
    </TopToolbar>
  );
};
const WorkflowInstancesList = (props) => {
  return (
    <List
      {...props}
      actions={<WorkflowInstancesActions />}
      bulkActionButtons={false}
    >
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="name" />
        <TextField source="entity_type" />
        <TextField source="organization_level" />
      </Datagrid>
    </List>
  );
};

export default WorkflowInstancesList;
