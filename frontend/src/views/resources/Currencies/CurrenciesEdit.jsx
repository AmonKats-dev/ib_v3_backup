import React from "react";
import {
  Edit,
  required,
  SimpleForm,
  TextInput,
  useTranslate,
} from "react-admin";
import CustomInput from "../../components/CustomInput";
import CustomToolbar from "../../components/CustomToolbar";

const CurrenciesEdit = (props) => {
  return (
    <Edit {...props}>
      <SimpleForm  toolbar={<CustomToolbar />}>
        <CustomInput
          fullWidth
          tooltipText={"tooltips.resources.currencies.fields.code"}
        >
          <TextInput
            source="code"
            validate={required()}
            variant="outlined"
            margin="none"
          />
        </CustomInput>
        <CustomInput
          fullWidth
          tooltipText={"tooltips.resources.currencies.fields.name"}
        >
          <TextInput
            source="name"
            validate={required()}
            variant="outlined"
            margin="none"
          />
        </CustomInput>
        <CustomInput
          fullWidth
          tooltipText={"tooltips.resources.currencies.fields.sign"}
        >
          <TextInput
            source="sign"
            validate={required()}
            variant="outlined"
            margin="none"
          />
        </CustomInput>
      </SimpleForm>
    </Edit>
  );
};

export default CurrenciesEdit;
