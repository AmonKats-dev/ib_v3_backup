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
import { ACTION_TYPES, PROJECT_PHASE_STATUS } from "../../../constants/common";
import CustomToolbar from "../../components/CustomToolbar";
import WorkflowEdit from "../Workflow/WorkflowEdit";
import { useSelector } from "react-redux";

const WorkflowInstancesEdit = (props) => {
  const appConfig = useSelector((state) => state.app.appConfig);
  const { organizational_config } = appConfig;

  const choicesLevel = Object.keys(organizational_config).map((key) => ({
    id: key,
    name: `(${key}) ${organizational_config[key].name}`,
  }));

  return (
    <>
      <Edit {...props}>
        <SimpleForm toolbar={<CustomToolbar />}>
          <TextInput source="name" variant="outlined" margin="none" />
          <TextInput source="entity_type" variant="outlined" margin="none" />
          <SelectInput
            source="organization_level"
            choices={choicesLevel}
            variant="outlined"
            margin="none"
          />
        </SimpleForm>
      </Edit>
    </>
  );
};

export default WorkflowInstancesEdit;
