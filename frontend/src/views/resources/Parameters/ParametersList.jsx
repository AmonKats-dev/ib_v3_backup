import React from "react";
import { Datagrid, List, TextField } from "react-admin";
// import ValidationForm from "./ValidationForm";

const ParametersList = ({ translate, ...props }) => (
  <>
    <List {...props} bulkActionButtons={false}>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="param_key" />
        <TextField source="param_value" />
      </Datagrid>
    </List>
    {/* <div><ValidationForm /></div> */}
  </>
);

export default ParametersList;
