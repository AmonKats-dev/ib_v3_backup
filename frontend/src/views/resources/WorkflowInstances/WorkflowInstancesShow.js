import React from "react";
import { TextField, EmailField, Show, SimpleShowLayout } from "react-admin";

const WorkflowInstancesShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="entity_type" />
    </SimpleShowLayout>
  </Show>
);

export default WorkflowInstancesShow;
