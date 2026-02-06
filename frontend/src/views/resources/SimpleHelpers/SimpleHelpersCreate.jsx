import React from "react";
import { Create, required, SimpleForm, TextInput } from "react-admin";
import CustomToolbar from "../../components/CustomToolbar";

const UnitsCreate = (props) => {
  return (
    <Create {...props}>
      <SimpleForm redirect="list" toolbar={<CustomToolbar />}>
        <TextInput
          source="name"
          validate={required()}
          variant="outlined"
          margin="none"
          fullWidth
          style={{ width: '100%'}}
        />
      </SimpleForm>
    </Create>
  );
};

export default UnitsCreate;
