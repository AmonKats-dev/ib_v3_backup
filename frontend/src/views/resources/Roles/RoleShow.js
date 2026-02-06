import React from "react";
import {
  NumberField,
  ReferenceArrayField,
  ReferenceField,
  Datagrid,
  ArrayField,
  TextField,
  BooleanField,
  Show,
  FunctionField,
  SimpleShowLayout,
  ChipField,
} from "react-admin";

const RoleShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      {/* <ArrayField source="permissions">
        <Datagrid>
          <FunctionField label="Name" render={(record) => record} />
        </Datagrid>
      </ArrayField> */}
    </SimpleShowLayout>
  </Show>
);

export default RoleShow;
