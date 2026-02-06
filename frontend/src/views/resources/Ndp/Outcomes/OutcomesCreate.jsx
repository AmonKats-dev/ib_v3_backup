import React from "react";
import { Create, ReferenceInput, SelectInput, required, SimpleForm, TextInput } from "react-admin";
import { DEFAULT_SORTING } from "../../../../constants/common";
import CustomInput from "../../../components/CustomInput";
import CustomToolbar from "../../../components/CustomToolbar";

const OutcomesCreate = (props) => {
  return (
    <Create {...props}>
      <SimpleForm redirect="list"  toolbar={<CustomToolbar />}>
        <CustomInput
          fullWidth
          tooltipText={"tooltips.resources.ndp-outcomes.fields.ndp_goal_id"}
        >
          <ReferenceInput
            sort={DEFAULT_SORTING}
            perPage={-1}
            validate={required()}
            source="ndp_goal_id"
            reference="ndp-goals"
            variant="outlined"
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
    </Create>
  );
};

export default OutcomesCreate;
