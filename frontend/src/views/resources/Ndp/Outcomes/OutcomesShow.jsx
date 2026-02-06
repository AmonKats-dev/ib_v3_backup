import React from "react";
import { ReferenceField, Show, SimpleShowLayout, TextField } from "react-admin";

const OutcomesShow = (props) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="id" />
        <ReferenceField source="ndp_goal_id" reference="ndp-goals">
          <TextField source="name" />
        </ReferenceField>
        <TextField source="name" />
      </SimpleShowLayout>
    </Show>
  );
};

export default OutcomesShow;
