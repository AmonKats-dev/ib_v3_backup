import React from "react";
import {
  Create,
  required,
  SimpleForm,
  TextInput,
} from "react-admin";
import CustomInput from "../../../components/CustomInput";
import CustomToolbar from "../../../components/CustomToolbar";

const GoalsCreate = (props) => {
  return (
    <Create {...props}>
      <SimpleForm redirect="list"  toolbar={<CustomToolbar />}>
        <CustomInput fullWidth tooltipText={"tooltips.resources.ndp-goals.fields.name"}>
          <TextInput
            source="name"
            validate={required()}
            variant="outlined"
            margin="none"
          />
        </CustomInput>
      </SimpleForm>
    </Create>
  );
};

export default GoalsCreate;
