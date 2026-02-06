import React from "react";
import { Create, required, SimpleForm, ReferenceInput, TextInput , SelectInput} from "react-admin";
import { DEFAULT_SORTING } from "../../../../constants/common";
import CustomInput from "../../../components/CustomInput";
import CustomToolbar from "../../../components/CustomToolbar";

const StrategiesCreate = (props) => {
  return (
    <Create {...props}>
      <SimpleForm redirect="list"  toolbar={<CustomToolbar />}>
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
    </Create>
  );
};

export default StrategiesCreate;
