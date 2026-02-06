import { Button, useMediaQuery } from "@material-ui/core";
import {
  CreateButton,
  NumberField,
  ReferenceField,
  Show,
  SimpleShowLayout,
  TextField,
  usePermissions,
} from "react-admin";

import { Link } from "react-router-dom";
import React from "react";

export const OrganizationsShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="code" />
      <TextField source="name" />
      <ReferenceField source="parent_id" reference="organizations">
        <TextField source="name" />
      </ReferenceField>
      <NumberField source="level" />
      <TextField source="additional_data" />
    </SimpleShowLayout>
  </Show>
);

export default OrganizationsShow;
