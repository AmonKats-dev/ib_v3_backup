import React from "react";
import { FormDataConsumer, required, useTranslate } from "react-admin";
import CustomInput from "../../../components/CustomInput";
import CustomTextArea from "../../../components/CustomTextArea";

const FrameworkForm = (props) => {
  const translate = useTranslate();

  return (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, ...rest }) => {
        return (
          <div>
            <CustomInput
              tooltipText={
                "tooltips.resources.project-details.fields.pcn_outcome"
              }
              textArea
            >
              <CustomTextArea
                label={translate(
                  "resources.project-details.fields.pcn_outcome"
                )}
                source="pcn_outcome"
                validate={[required()]}
                isRequired
                formData={formData}
                {...props}
              />
            </CustomInput>
            <CustomInput
              tooltipText={
                "tooltips.resources.project-details.fields.pcn_interventions"
              }
              textArea
            >
              <CustomTextArea
                label={translate(
                  "resources.project-details.fields.pcn_interventions"
                )}
                source="pcn_interventions"
                formData={formData}
                validate={[required()]}
                isRequired
                {...props}
              />
            </CustomInput>
          </div>
        );
      }}
    </FormDataConsumer>
  );
};

export default FrameworkForm;
