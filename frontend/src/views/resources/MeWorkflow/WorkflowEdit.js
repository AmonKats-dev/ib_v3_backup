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
} from "react-admin";
import { generateChoices } from "../../../helpers";
import {
  ACTION_TYPES,
  ME_ACTION_TYPES,
  ME_REPORT_STATUS,
  PROJECT_PHASE_STATUS,
} from "../../../constants/common";
import CustomToolbar from "../../components/CustomToolbar";

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
    </Edit>
  );
};

export default WorkflowEdit;
