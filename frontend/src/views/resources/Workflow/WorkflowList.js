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
  Filter,
  ReferenceInput,
  SelectInput,
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
const WorkflowFilters = (props) => {
  return (
    <Filter {...props} variant="outlined" margin="none">
      <ReferenceInput
        alwaysOn
        allowEmpty={false}
        source="workflow_instance_id"
        reference="workflow-instances"
        variant="outlined"
        margin="none"
      >
        <SelectInput
          variant="outlined"
          margin="none"
          optionText="name"
          optionValue="id"
          style={{ width: 250 }}
        />
      </ReferenceInput>
    </Filter>
  );
};

const WorkflowList = (props) => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("xs"));

  return (
    <List
      {...props}
      actions={<WorkflowActions />}
      filters={<WorkflowFilters />}
      bulkActionButtons={false}
      filterDefaultValues={{ workflow_instance_id: 1 }}
    >
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <ReferenceField source="role_id" reference="roles">
          <TextField source="name" />
        </ReferenceField>
        <TextField source="actions" />
        <NumberField source="step" />

        <TextField source="status_msg" />
        <TextField source="revise_to_workflow_id" />
        <TextField source="phases" />
        <TextField source="file_type_ids" />
        <ReferenceField
          source="workflow_instance_id"
          reference="workflow-instances"
        >
          <TextField source="name" />
        </ReferenceField>
      </Datagrid>
    </List>
  );
};

export default WorkflowList;
