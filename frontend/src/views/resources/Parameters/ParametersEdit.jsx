import React from "react";
import {
  ArrayInput,
  Edit,
  required,
  SimpleForm,
  SimpleFormIterator,
  TextInput,
  useTranslate,
} from "react-admin";
import CustomInput from "../../components/CustomInput";
import CustomToolbar from "../../components/CustomToolbar";

const ParametersEdit = (props) => {
  return (
    <Edit {...props}>
      <SimpleForm  toolbar={<CustomToolbar />}>
        <CustomInput
          fullWidth
          tooltipText={"tooltips.resources.parameters.fields.param_key"}
        >
          <TextInput
            source="param_key"
            validate={required()}
            variant="outlined"
            margin="none"
            disabled
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
    </Edit>
  );
};

export default ParametersEdit;
