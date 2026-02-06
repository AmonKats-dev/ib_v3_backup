import React, { Fragment, useMemo } from "react";
import CustomInput from "../../../components/CustomInput";
import {
  ArrayInput,
  TextInput,
  FormDataConsumer,
  SimpleFormIterator,
  useTranslate,
  Labeled,
  required,
} from "react-admin";
import CustomTextArea from "../../../components/CustomTextArea";
import OrganisationalStructure from "../../OrganisationalStructure";
import useCheckFeature from "../../../../hooks/useCheckFeature";
import { useFormState } from "react-final-form";
import { useChangeField } from "../../../../helpers/checkPermission";
import { checkRequired } from "../../../resources/Projects/validation";

function CoordinationGA(props) {
  const translate = useTranslate();
  const hasMDAgencies = useCheckFeature("project_MDA_government_agencies");
  const hasGovernmentAgencies = useCheckFeature(
    "project_has_government_agencies"
  );
  const hasDefaultArrayInputValue = useCheckFeature(
    "has_default_array_input_value"
  );
  const formValues = useFormState().values;
  const changeAgencies = useChangeField({ name: "government_coordinations" });

  useMemo(() => {
    if (
      hasGovernmentAgencies &&
      hasDefaultArrayInputValue &&
      formValues &&
      formValues.government_coordinations &&
      formValues.government_coordinations.length === 0
    ) {
      changeAgencies([{}]);
    }
  }, [props.record]);

  if (!hasGovernmentAgencies) return null;

  return (
    <ArrayInput
      source="government_coordinations"
      label={translate(
        "resources.project-details.fields.government_coordinations.title"
      )}
    >
      <SimpleFormIterator>
        <FormDataConsumer>
          {({ formData, scopedFormData, getSource, ...rest }) => {
            return (
              <Fragment>
                <CustomInput
                  tooltipText={
                    "tooltips.resources.project-details.fields.government_agencies.name"
                  }
                  fullWidth
                >
                  {hasMDAgencies ? (
                    <OrganisationalStructure
                      {...props}
                      source={getSource("organization_id")}
                      title={translate(
                        "resources.project-details.fields.government_agencies.name"
                      )}
                      config="organizational_config"
                      reference="organizations"
                      field={getSource("organization")}
                      level={2}
                    />
                  ) : (
                    <TextInput
                      label={translate(
                        "resources.project-details.fields.government_agencies.name"
                      )}
                      source={getSource("organization_id")}
                      variant="outlined"
                      margin="none"
                    />
                  )}
                </CustomInput>
                {scopedFormData &&
                  !scopedFormData.organization_id &&
                  scopedFormData.additional_data && (
                    <CustomInput
                      tooltipText={
                        "tooltips.resources.project-details.fields.government_agencies.name"
                      }
                      fullWidth
                    >
                      <TextInput
                        label={translate(
                          "resources.project-details.fields.government_agencies.name"
                        )}
                        source={getSource("additional_data.name")}
                        variant="outlined"
                        margin="none"
                        disabled
                      />
                    </CustomInput>
                  )}
                <CustomInput
                  tooltipText={
                    "tooltips.resources.project-details.fields.government_agencies.description"
                  }
                  textArea
                  fullWidth
                >
                  <CustomTextArea
                    label={translate(
                      "resources.project-details.fields.government_agencies.description"
                    )}
                    source={getSource("description")}
                    formData={formData}
                    validate={checkRequired("government_coordinations", "description")}
                    isRequired
                    {...props}
                  />
                </CustomInput>
              </Fragment>
            );
          }}
        </FormDataConsumer>
      </SimpleFormIterator>
    </ArrayInput>
  );
}

export default CoordinationGA;
