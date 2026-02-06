import React from "react";
import {
  Create,
  required,
  SimpleForm,
  ReferenceInput,
  TextInput,
  SelectInput,
  FormDataConsumer,
  AutocompleteArrayInput,
  ReferenceArrayInput,
} from "react-admin";
import CustomInput from "../../components/CustomInput";
import CustomToolbar from "../../components/CustomToolbar";

const SectorCreate = (props) => {
  return (
    <Create {...props}>
      <SimpleForm redirect="list" toolbar={<CustomToolbar />}>
        <CustomInput
          fullWidth
          tooltipText={"tooltips.resources.sectors.fields.name"}
        >
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

export default SectorCreate;
