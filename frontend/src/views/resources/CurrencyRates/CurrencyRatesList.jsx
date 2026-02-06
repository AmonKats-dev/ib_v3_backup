import React from 'react';
import {
    Datagrid,
    EditButton,
    List,
    ShowButton,
    TextField,
    ReferenceField
} from 'react-admin';

const CurrencyRatesList = ({ translate, ...props }) =>
<List {...props} bulkActionButtons={false}>
    <Datagrid>
        <TextField source="id" />
        <ReferenceField source="currency_id" reference="currencies">
            <TextField source="name" />
          </ReferenceField>
        <TextField source="rate" />
        <ShowButton />
        <EditButton />
    </Datagrid>
</List>

export default CurrencyRatesList;