import React from "react";
import { Create, required, SimpleForm, TextInput, ReferenceInput, SelectInput } from "react-admin";
import CustomInput from "../../components/CustomInput";
import CustomToolbar from "../../components/CustomToolbar";

const CurrencyRatesCreate = (props) => {
  return (
    <Create {...props}>
      <SimpleForm redirect="list"  toolbar={<CustomToolbar />}>
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
    </Create>
  );
};

export default CurrencyRatesCreate;
