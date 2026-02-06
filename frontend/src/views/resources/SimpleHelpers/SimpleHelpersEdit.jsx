import React from "react";
import { Edit, required, SimpleForm, TextInput } from "react-admin";
import CustomToolbar from "../../components/CustomToolbar";

const UnitsEdit = (props) => {
  return (
    <Edit {...props}>
      <SimpleForm toolbar={<CustomToolbar />}>
        <TextInput
          source="name"
          validate={required()}
          variant="outlined"
          margin="none"
          fullWidth
          style={{ width: '100%'}}
        />
      </SimpleForm>
    </Edit>
  );
};

export default UnitsEdit;
