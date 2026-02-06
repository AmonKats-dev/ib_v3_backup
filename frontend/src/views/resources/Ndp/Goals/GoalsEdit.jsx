import React from "react";
import {
  
  Edit,
  required,
  SimpleForm,
  TextInput,
  useTranslate,
} from "react-admin";
import CustomInput from "../../../components/CustomInput";
import CustomToolbar from "../../../components/CustomToolbar";

const GoalsEdit = (props) => {
  return (
    <Edit {...props}>
      <SimpleForm  toolbar={<CustomToolbar />}>
      <CustomInput fullWidth tooltipText={"tooltips.resources.ndp-goals.fields.name"}>
          <TextInput
            source="name"
            validate={required()}
            variant="outlined"
            margin="none"
          />
        </CustomInput>
      </SimpleForm>
    </Edit>
  );
};

export default GoalsEdit;
