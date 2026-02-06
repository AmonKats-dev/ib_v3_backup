import React from "react";
import { Show, SimpleShowLayout, TextField } from "react-admin";

const CurrenciesShow = (props) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="id" />
        <TextField source="code" />
        <TextField source="sign" />
      </SimpleShowLayout>
    </Show>
  );
};

export default CurrenciesShow;
