import React from "react";
import { Show, SimpleShowLayout, TextField } from "react-admin";

const GoalsShow = (props) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="id" />
        <TextField source="name" />
      </SimpleShowLayout>
    </Show>
  );
};

export default GoalsShow;
