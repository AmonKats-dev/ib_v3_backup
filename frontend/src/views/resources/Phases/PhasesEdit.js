import React from "react";
import {
  NumberInput,
  ReferenceArrayInput,
  ReferenceInput,
  SelectInput,
  SimpleFormIterator,
  FunctionField,
  BooleanInput,
  SelectArrayInput,
  Edit,
  SimpleForm,
  TextInput,
  required,
  usePermissions,
} from "react-admin";
import { useSelector } from "react-redux";
import CustomInput from "../../components/CustomInput";
import CustomToolbar from "../../components/CustomToolbar";

const PhasesEdit = (props) => {
  return (
    <Edit {...props}>
      <SimpleForm  toolbar={<CustomToolbar />}>
        <CustomInput
          tooltipText={"tooltips.resources.roles.fields.name"}
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
    </Edit>
  );
};

export default PhasesEdit;
