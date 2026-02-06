import React from "react";
import { Create, SimpleForm, TextInput, required } from "react-admin";
import FormBuilder from "../../modules/FormBuilder";
import fields from "./fields";
import CustomInput from "../../components/CustomInput";
import CustomToolbar from "../../components/CustomToolbar";

const PhasesCreate = (props) => {
  return (
    <Create {...props}>
      <SimpleForm redirect="show"  toolbar={<CustomToolbar />}>
        <CustomInput
          tooltipText={"tooltips.resources.phases.fields.name"}
          variant="outlined"
          margin="none"
          fullWidth
        >
          <TextInput
            source="name"
            validate={[required()]}
            variant="outlined"
            margin="none"
          />
        </CustomInput>
        <CustomInput
          tooltipText={"tooltips.resources.roles.fields.sequence"}
          variant="outlined"
          margin="none"
          fullWidth
        >
          <TextInput
            source="sequence"
            validate={[required()]}
            variant="outlined"
            margin="none"
          />
        </CustomInput>
      </SimpleForm>
    </Create>
  );
};

export default PhasesCreate;
