import React from "react";
import { Datagrid, EditButton, List, ShowButton, TextField } from "react-admin";

const CurrenciesList = ({ translate, ...props }) => (
  <List {...props} bulkActionButtons={false}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="code" />
      <TextField source="name" />
      <TextField source="sign" />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);

export default CurrenciesList;
