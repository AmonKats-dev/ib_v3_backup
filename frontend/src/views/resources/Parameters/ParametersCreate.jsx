import React from "react";
import {
  ArrayInput,
  Create,
  required,
  SimpleForm,
  SimpleFormIterator,
  TextInput,
} from "react-admin";
import CustomInput from "../../components/CustomInput";
import CustomToolbar from "../../components/CustomToolbar";

const ParametersCreate = (props) => {
  return (
    <Create {...props}>
      <SimpleForm redirect="list"  toolbar={<CustomToolbar />}>
      <CustomInput
          fullWidth
          tooltipText={"tooltips.resources.parameters.fields.param_key"}
        >
          <TextInput
            source="param_key"
            validate={required()}
            variant="outlined"
            margin="none"
            // disabled
          />
        </CustomInput>

        <ArrayInput
          source="param_value"
          variant="outlined"
          label={false}
          margin="none"
        >
          <SimpleFormIterator>
            <TextInput
              label={false}
              validate={required()}
              variant="outlined"
              margin="none"
            />
          </SimpleFormIterator>
        </ArrayInput>
      </SimpleForm>
    </Create>
  );
};

export default ParametersCreate;
