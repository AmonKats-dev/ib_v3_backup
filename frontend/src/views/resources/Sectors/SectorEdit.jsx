import { LocalDrinkSharp } from "@material-ui/icons";
import React from "react";
import {
  ReferenceInput,
  Edit,
  required,
  SimpleForm,
  TextInput,
  useTranslate,
  SelectInput,
  AutocompleteArrayInput,
  FormDataConsumer,
  ReferenceArrayInput,
} from "react-admin";
import CustomInput from "../../components/CustomInput";
import CustomToolbar from "../../components/CustomToolbar";

const SectorEdit = (props) => {
  return (
    <Edit {...props}>
      <SimpleForm toolbar={<CustomToolbar />}>
        <FormDataConsumer>
          {({ getSource, scopedFormData, formData, ...rest }) => {
            if (!formData) return null;

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
    </Edit>
  );
};

export default SectorEdit;
