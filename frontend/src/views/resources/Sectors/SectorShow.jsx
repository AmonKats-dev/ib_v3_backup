import React from "react";
import { Show, SimpleShowLayout, TextField, ReferenceField } from "react-admin";

const SectorShow = (props) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="id" />
        <TextField source="name" />
      </SimpleShowLayout>
    </Show>
  );
};

export default SectorShow;
