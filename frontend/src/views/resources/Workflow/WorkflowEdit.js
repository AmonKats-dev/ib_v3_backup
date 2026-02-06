import React, { Fragment, useEffect, useState } from "react";
import {
  Edit,
  TextInput,
  NumberInput,
  SelectInput,
  ReferenceInput,
  SimpleForm,
  SelectArrayInput,
  FormDataConsumer,
  BooleanInput,
} from "react-admin";
import { generateChoices } from "../../../helpers";
import { ACTION_TYPES, PROJECT_PHASE_STATUS } from "../../../constants/common";
import CustomToolbar from "../../components/CustomToolbar";
import { checkFeature } from "../../../helpers/checkPermission";

const WorkflowEdit = (props) => {
  return (
    <Edit {...props}>
      <SimpleForm toolbar={<CustomToolbar />}>
        <ReferenceInput
          source="role_id"
          reference="roles"
          variant="outlined"
          margin="none"
        >
          <SelectInput
            optionText="name"
            optionValue="id"
            variant="outlined"
            margin="none"
          />
        </ReferenceInput>
        <SelectArrayInput
          source="actions"
          variant="outlined"
          margin="none"
          choices={generateChoices(ACTION_TYPES)}
        />
        <NumberInput source="step" variant="outlined" margin="none" />

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
    </Edit>
  );
};

export default WorkflowEdit;
