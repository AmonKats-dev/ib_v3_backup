import React from 'react';
import {
    CardActions,
    Create,
    Datagrid,
    DeleteButton,
    DisabledInput,
    BooleanInput,
    BooleanField,
    Edit,
    EditButton,
    List,
    required,
    Show,
    ShowButton,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput,
    SelectInput,
    ReferenceInput,
    ReferenceField,
    ReferenceArrayInput,
    SelectArrayInput,
    ArrayField,
    SingleFieldList,
    ChipField,
    ReferenceArrayField,
    ReferenceManyField,
    translate
} from 'react-admin';

const FileTypesList = ({ translate, ...props }) =>
<List {...props} bulkActionButtons={false} filter={{ is_deleted: false}}>
    <Datagrid>
        <TextField source="id" />
        <TextField source="name" />
        <ReferenceArrayField reference="phases" source="phase_ids">
            <SingleFieldList>
                <ChipField source="name" />
            </SingleFieldList>
        </ReferenceArrayField >
        <TextField source="extensions" />
        <BooleanField source="is_required" />
        <ShowButton />
        <EditButton />
        <DeleteButton />
    </Datagrid>
</List>

export default FileTypesList;