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
import { ACTION_TYPES, ME_ACTION_TYPES, ME_REPORT_STATUS, PROJECT_PHASE_STATUS } from "../../../constants/common";
import { generateChoices } from "../../../helpers";
import CustomToolbar from "../../components/CustomToolbar";

const WorkflowCreate = (props) => {
  return (
    <Create {...props}>
      <SimpleForm variant="outlined" toolbar={<CustomToolbar />}>
        <ReferenceInput
          source="role_id"
          reference="roles"
          variant="outlined"
          margin="none"
        >
          <SelectInput
            variant="outlined"
            margin="none"
            optionText="name"
            optionValue="id"
          />
        </ReferenceInput>
        <SelectArrayInput
          variant="outlined"
          margin="none"
          source="actions"
          choices={generateChoices(ME_ACTION_TYPES)}
        />
        <NumberInput source="step" variant="outlined" margin="none" />
       
        <TextInput source="status_msg" variant="outlined" margin="none" />

        <ReferenceInput
          source="revise_to_me_workflow_id"
          reference="me-workflows"
          variant="outlined"
          margin="none"
        >
          <SelectInput
            optionText="step"
            optionValue="id"
            variant="outlined"
            margin="none"
          />
        </ReferenceInput>
        <SelectInput
          source="report_status"
          optionText="name"
          optionValue="id"
          variant="outlined"
          margin="none"
          choices={generateChoices(ME_REPORT_STATUS)}
        />
         <ReferenceInput
          source="file_type_ids"
          reference="file-types"
          variant="outlined"
          margin="none"
        >
          <SelectArrayInput
            optionText="name"
            optionValue="id"
            variant="outlined"
            margin="none"
          />
        </ReferenceInput>
      </SimpleForm>
    </Create>
  );
};

export default WorkflowCreate;
