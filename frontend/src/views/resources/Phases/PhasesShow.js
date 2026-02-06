import React from "react";
import {
  TextField,
  Show,
  SimpleShowLayout,
} from "react-admin";

const PhasesShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="sequence" />
    </SimpleShowLayout>
  </Show>
);

export default PhasesShow;
