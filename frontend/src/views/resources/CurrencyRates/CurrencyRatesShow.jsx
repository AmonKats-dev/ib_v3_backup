import React from "react";
import { Show, SimpleShowLayout, TextField , ReferenceField} from "react-admin";

const CurrencyRatesShow = (props) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
      <TextField source="id" />
        <ReferenceField source="currency_id" reference="currencies">
            <TextField source="name" />
          </ReferenceField>
        <TextField source="rate" />
      </SimpleShowLayout>
    </Show>
  );
};

export default CurrencyRatesShow;
