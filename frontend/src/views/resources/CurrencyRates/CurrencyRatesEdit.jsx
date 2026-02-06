import React from "react";
import {
  Edit,
  required,
  SimpleForm,
  TextInput,
  SelectInput,
  ReferenceInput,
} from "react-admin";
import CustomInput from "../../components/CustomInput";
import CustomToolbar from "../../components/CustomToolbar";

const CurrencyRatesEdit = (props) => {
  return (
    <Edit {...props}>
      <SimpleForm  toolbar={<CustomToolbar />}>
        <CustomInput
          fullWidth
          tooltipText={"tooltips.resources.currencyRates.fields.currency_id"}
        >
          <ReferenceInput
            validate={required()}
            source={"currency_id"}
            reference="currencies"
          >
            <SelectInput
              optionText="name"
              optionValue="id"
              margin="none"
              variant="outlined"
            />
          </ReferenceInput>
        </CustomInput>
        <CustomInput
          fullWidth
          tooltipText={"tooltips.resources.CurrencyRates.fields.rate"}
        >
          <TextInput
            source="rate"
            validate={required()}
            variant="outlined"
            margin="none"
          />
        </CustomInput>
      </SimpleForm>
    </Edit>
  );
};

export default CurrencyRatesEdit;
