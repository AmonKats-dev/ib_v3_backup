import React from "react";
import { Show, SimpleShowLayout, TextField } from "react-admin";

const ParametersShow = (props) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="id" />
        <TextField source="param_key" />
        <TextField source="param_value" />
      </SimpleShowLayout>
    </Show>
  );
};

export default ParametersShow;
