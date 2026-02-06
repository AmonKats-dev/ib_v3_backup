import React from "react";
import {
  Create,
  required,
  SimpleForm,
  TextInput,
} from "react-admin";
import CustomInput from "../../components/CustomInput";
import CustomToolbar from "../../components/CustomToolbar";

const CurrenciesCreate = (props) => {
  return (
    <Create {...props}>
      <SimpleForm redirect="list"  toolbar={<CustomToolbar />}>
        <CustomInput fullWidth tooltipText={"tooltips.resources.currencies.fields.code"}>
          <TextInput
            source="code"
            validate={required()}
            variant="outlined"
            margin="none"
          />
        </CustomInput>
        <CustomInput fullWidth tooltipText={"tooltips.resources.currencies.fields.name"}>
          <TextInput
            source="name"
            validate={required()}
            variant="outlined"
            margin="none"
          />
        </CustomInput>
        <CustomInput fullWidth tooltipText={"tooltips.resources.currencies.fields.sign"}>
          <TextInput
            source="sign"
            validate={required()}
            variant="outlined"
            margin="none"
          />
        </CustomInput>
      </SimpleForm>
    </Create>
  );
};

export default CurrenciesCreate;
