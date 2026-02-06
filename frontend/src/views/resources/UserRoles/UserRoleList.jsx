import React from "react";
import {
  BooleanField,
  Datagrid,
  EditButton,
  FunctionField,
  List,
  ShowButton,
  TextField,
} from "react-admin";

const UserRoleList = ({ translate, ...props }) => (
  <List {...props} bulkActionButtons={false} filter={{ is_approved: false }}>
    <Datagrid>
      <TextField source="id" />
      <BooleanField source="is_approved" />
      <FunctionField label="Role" render={(record) => record.role.name} />
      <FunctionField label="User" render={(record) => record.user.username} />
      <FunctionField
        label="Full Name"
        render={(record) => record.user.full_name}
      />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);

export default UserRoleList;
