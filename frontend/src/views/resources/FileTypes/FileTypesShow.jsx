import React from "react";
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
  TopToolbar,
  ArrayField,
  SingleFieldList,
  ChipField,
  ReferenceArrayField,
  ReferenceManyField,
  useTranslate,
} from "react-admin";
import { Card, CardHeader } from "@material-ui/core";

const FileTypesShowActions = ({ basePath, data, resource }) => (
  <TopToolbar>
    <EditButton basePath={basePath} record={data} />
    {/* <DeleteButton basePath={basePath} record={data} resource={resource} /> */}
  </TopToolbar>
);

const FileTypesShow = (props) => {
  const translate = useTranslate();

  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="id" />
        <TextField source="name" />
        <ReferenceArrayField reference="phases" source="phase_ids">
          <SingleFieldList>
            <ChipField source="name" />
          </SingleFieldList>
        </ReferenceArrayField>
        <TextField source="extensions" />
      </SimpleShowLayout>
    </Show>
  );
};

export default FileTypesShow;
