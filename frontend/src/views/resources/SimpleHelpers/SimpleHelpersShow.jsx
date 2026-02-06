import React from "react";
import { Show, SimpleShowLayout, TextField } from "react-admin";

const UnitsShow = (props) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="id" />
        <TextField source="name" />
      </SimpleShowLayout>
    </Show>
  );
};

export default UnitsShow;
