import React from "react";
import {
  ReferenceInput,
  Edit,
  required,
  SimpleForm,
  TextInput,
  useTranslate,
  SelectInput
} from "react-admin";
import { DEFAULT_SORTING } from "../../../../constants/common";
import CustomInput from "../../../components/CustomInput";
import CustomToolbar from "../../../components/CustomToolbar";

const UnitsEdit = (props) => {
  return (
    <Edit {...props}>
      <SimpleForm  toolbar={<CustomToolbar />}> 
      <CustomInput
          fullWidth
          tooltipText={"tooltips.resources.ndp-strategies.fields.ndp_outcome_id"}
        >
          <ReferenceInput
            sort={DEFAULT_SORTING}
            validate={required()}
            perPage={-1}
            source="ndp_outcome_id"
            reference="ndp-outcomes"
            variant="outlined"
          >
            <SelectInput optionText="name" margin="normal" variant="outlined" />
          </ReferenceInput>
        </CustomInput>
        <CustomInput fullWidth tooltipText={"tooltips.resources.ndp-strategies.fields.name"}>
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

export default UnitsEdit;
