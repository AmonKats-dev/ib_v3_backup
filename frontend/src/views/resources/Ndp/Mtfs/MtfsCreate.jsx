import React from "react";
import {
  Create,
  required,
  SimpleForm,
  ReferenceInput,
  TextInput,
  SelectInput,
  FormDataConsumer,
  AutocompleteArrayInput,
  ReferenceArrayInput
} from "react-admin";
import { DEFAULT_SORTING } from "../../../../constants/common";
import CustomInput from "../../../components/CustomInput";
import CustomToolbar from "../../../components/CustomToolbar";

const MtfsCreate = (props) => {
  return (
    <Create {...props}>
      <SimpleForm redirect="list" toolbar={<CustomToolbar />}>
        <FormDataConsumer>
          {({ getSource, scopedFormData, formData, ...rest }) => {
            return (
              <>
                <CustomInput
                  fullWidth
                  tooltipText={"tooltips.resources.ndp-sdgs.fields.name"}
                >
                  <TextInput
                    source="name"
                    validate={required()}
                    variant="outlined"
                    margin="none"
                  />
                </CustomInput>
              </>
            );
          }}
        </FormDataConsumer>
      </SimpleForm>
    </Create>
  );
};

export default MtfsCreate;
