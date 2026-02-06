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
import { DEFAULT_SORTING } from "../../../../constants/common";
import CustomInput from "../../../components/CustomInput";
import CustomToolbar from "../../../components/CustomToolbar";
import lodash from "lodash";

const UnitsEdit = (props) => {
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
                  tooltipText={"tooltips.resources.ndp-sdgs.fields.ndp_goal_id"}
                >
                  <ReferenceInput
                    sort={DEFAULT_SORTING}
                    perPage={-1}
                    source="ndp_goal_id"
                    reference="ndp-goals"
                    variant="outlined"
                  >
                    <SelectInput
                      optionText="name"
                      margin="normal"
                      variant="outlined"
                    />
                  </ReferenceInput>
                </CustomInput>
                {formData && lodash.isArray(formData.ndp_outcome_ids) && (
                  <CustomInput
                    fullWidth
                    tooltipText={
                      "tooltips.resources.ndp-sdgs.fields.ndp_outcome_ids"
                    }
                  >
                    <ReferenceArrayInput
                      sort={DEFAULT_SORTING}
                      validate={required()}
                      perPage={-1}
                      source="ndp_outcome_ids"
                      reference="ndp-outcomes"
                      variant="outlined"
                      filter={{
                        ndp_goal_id: formData && formData.ndp_goal_id,
                      }}
                    >
                      <AutocompleteArrayInput
                        margin="none"
                        variant="outlined"
                        fullWidth
                        shouldRenderSuggestions={true}
                      />
                    </ReferenceArrayInput>
                  </CustomInput>
                )}
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

export default UnitsEdit;
