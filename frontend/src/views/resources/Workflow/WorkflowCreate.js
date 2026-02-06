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
import { checkFeature } from "../../../helpers/checkPermission";
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
          choices={generateChoices(ACTION_TYPES)}
        />
        <NumberInput source="step" variant="outlined" margin="none" />
        {/* <ReferenceInput source="assigned_user_id" reference="users">
          <SelectInput optionText="full_name" optionValue="id" />
        </ReferenceInput> */}
        <TextInput source="status_msg" variant="outlined" margin="none" />

        <BooleanInput
          source="additional_data.is_logical_framework_editable"
          variant="outlined"
          margin="none"
          label={"Edit Logical Framework"}
        />

        <FormDataConsumer>
          {({ getSource, scopedFormData, formData, ...rest }) => {
            return (
              <ReferenceInput
                source="revise_to_workflow_id"
                reference="workflows"
                variant="outlined"
                margin="none"
                filter={
                  checkFeature("has_pimis_fields")
                    ? { workflow_instance_id: formData.workflow_instance_id }
                    : null
                }
              >
                <SelectInput
                  optionText="status_msg"
                  optionValue="id"
                  variant="outlined"
                  margin="none"
                />
              </ReferenceInput>
            );
          }}
        </FormDataConsumer>
        {/* 
        <ReferenceInput source="cycle_id" reference="cycles">
          <SelectInput optionText="id" />
        </ReferenceInput> */}

        <ReferenceInput
          source="phases"
          reference="phases"
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

        <SelectInput
          source="project_status"
          optionText="name"
          optionValue="id"
          variant="outlined"
          margin="none"
          choices={generateChoices(PROJECT_PHASE_STATUS)}
        />

        <ReferenceInput
          source="workflow_instance_id"
          reference="workflow-instances"
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
      </SimpleForm>
    </Create>
  );
};

export default WorkflowCreate;
