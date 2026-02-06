import React from "react";
import {
  List,
  SimpleList,
  Datagrid,
  TextField,
  NumberField,
  ReferenceField,
  BooleanField,
  TopToolbar,
  CreateButton,
  useRedirect,
  Button,
} from "react-admin";
import { useMediaQuery } from "@material-ui/core";

const WorkflowActions = (props) => {
  const redirect = useRedirect();

  return (
    <TopToolbar>
      <CreateButton {...props} />
      {/* <Button
        onClick={() => {
          redirect("/workflow-chart");
        }}
        label="Chart"
      /> */}
    </TopToolbar>
  );
};
const WorkflowList = (props) => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("xs"));

  return (
    <List
      {...props}
      actions={<WorkflowActions />}
      bulkActionButtons={false}
    >
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <ReferenceField source="role_id" reference="roles">
          <TextField source="name" />
        </ReferenceField>
        <TextField source="actions" />
        <NumberField source="step" />

        <TextField source="status_msg" />
        <TextField source="report_status" />
        <TextField source="revise_to_me_workflow_id" />
        <TextField source="file_type_ids" />
      </Datagrid>
    </List>
  );
};

export default WorkflowList;
