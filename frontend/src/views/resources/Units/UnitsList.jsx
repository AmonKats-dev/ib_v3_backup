import React from 'react';
import {
    Datagrid,
    EditButton,
    List,
    ShowButton,
    TextField,
} from 'react-admin';

const UnitsList = ({ translate, ...props }) =>
<List {...props} bulkActionButtons={false}>
    <Datagrid>
        <TextField source="id" />
        <TextField source="code" />
        <TextField source="name" />
        <ShowButton />
        <EditButton />
    </Datagrid>
</List>

export default UnitsList;