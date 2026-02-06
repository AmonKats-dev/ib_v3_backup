import React, { Fragment, useEffect, useState } from "react";
import {
  Create,
  SimpleForm,
  PasswordInput,
  ReferenceArrayInput,
  TextInput,
  TabbedForm,
  AutocompleteArrayInput,
  SelectArrayInput,
  useDataProvider,
  FormTab,
  FormDataConsumer,
  ArrayInput,
  SimpleFormIterator,
  ReferenceInput,
  SelectInput,
  NumberInput,
  BooleanInput,
  required,
} from "react-admin";
import { ACTION_TYPES, PROJECT_PHASE_STATUS } from "../../../constants/common";
import { generateChoices } from "../../../helpers";
import CustomToolbar from "../../components/CustomToolbar";
import { useSelector } from "react-redux";

const WorkflowInstancesCreate = (props) => {
  const appConfig = useSelector((state) => state.app.appConfig);
  const { organizational_config } = appConfig;

  const choicesLevel = Object.keys(organizational_config).map((key) => ({
    id: key,
    name: `(${key}) ${organizational_config[key].name}`,
  }));

  return (
    <Create {...props}>
      <SimpleForm variant="outlined" toolbar={<CustomToolbar />}>
        <TextInput source="name" variant="outlined" margin="none" />
        <TextInput source="entity_type" variant="outlined" margin="none" />
        <SelectInput
          source="organization_level"
          choices={choicesLevel}
          variant="outlined"
          margin="none"
        />
      </SimpleForm>
    </Create>
  );
};

export default WorkflowInstancesCreate;
