import React from "react";
import { Show, SimpleShowLayout, TextField, ReferenceField } from "react-admin";

const MtfsShow = (props) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="id" />
        <ReferenceField source="ndp_outcome_id" reference="ndp-outcomes">
          <TextField source="name" />
        </ReferenceField>
        <TextField source="name" />
      </SimpleShowLayout>
    </Show>
  );
};

export default MtfsShow;
