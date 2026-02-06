import React from 'react';
import { TextField, EmailField, Show, SimpleShowLayout } from 'react-admin';

const WorkflowShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" />
        </SimpleShowLayout>
    </Show>
);

export default WorkflowShow;
