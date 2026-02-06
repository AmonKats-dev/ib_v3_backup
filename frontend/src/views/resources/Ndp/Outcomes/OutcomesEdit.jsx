import React from "react";
import {
  
  Edit,
  ReferenceInput,
  required,
  SimpleForm,
  TextInput,
  SelectInput,
  useTranslate,
} from "react-admin";
import { DEFAULT_SORTING } from "../../../../constants/common";
import CustomInput from "../../../components/CustomInput";
import CustomToolbar from "../../../components/CustomToolbar";

const OutcomesEdit = (props) => {
  return (
    <Edit {...props}>
      <SimpleForm  toolbar={<CustomToolbar />}>
      <CustomInput
          fullWidth
          tooltipText={"tooltips.resources.ndp-outcomes.fields.ndp_goal_id"}
        >
          <ReferenceInput
            sort={DEFAULT_SORTING}
            validate={required()}
            perPage={-1}
            source="ndp_goal_id"
            reference="ndp-goals"
          >
            <SelectInput optionText="name" margin="normal"
            variant="outlined"
            />
          </ReferenceInput>
        </CustomInput>
        <CustomInput
          fullWidth
          tooltipText={"tooltips.resources.ndp-outcomes.fields.name"}
        >
          <TextInput
            source="name"
            validate={required()}
            variant="outlined"
            margin="none"
          />
        </CustomInput>
      </SimpleForm>
    </Edit>
  );
};

export default OutcomesEdit;
