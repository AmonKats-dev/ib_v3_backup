import React from "react";
import { FormDataConsumer, required, useTranslate } from "react-admin";
import CustomInput from "../../../components/CustomInput";
import CustomTextArea from "../../../components/CustomTextArea";
import { checkRequired } from "../validation";

const BehaviorChangeForm = (props) => {
  const translate = useTranslate();

  return (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, ...rest }) => {
        return (
          <div>
            <CustomInput
              tooltipText={
                "tooltips.resources.project-details.fields.behavior_knowledge_products"
              }
              textArea
              fullWidth
            >
              <CustomTextArea
                label={translate(
                  "resources.project-details.fields.behavior_knowledge_products"
                )}
                source="behavior_knowledge_products"
                validate={checkRequired("behavior_knowledge_products")}
                isRequired={Boolean(
                  checkRequired("behavior_knowledge_products")
                )}
                formData={formData}
                {...props}
              />
            </CustomInput>
            <CustomInput
              tooltipText={
                "tooltips.resources.project-details.fields.behavior_project_results"
              }
              textArea
              fullWidth
            >
              <CustomTextArea
                label={translate(
                  "resources.project-details.fields.behavior_project_results"
                )}
                source="behavior_project_results"
                formData={formData}
                validate={checkRequired("behavior_project_results")}
                isRequired={Boolean(checkRequired("behavior_project_results"))}
                {...props}
              />
            </CustomInput>
            <CustomInput
              tooltipText={
                "tooltips.resources.project-details.fields.behavior_measures"
              }
              textArea
              fullWidth
            >
              <CustomTextArea
                label={translate(
                  "resources.project-details.fields.behavior_measures"
                )}
                source="behavior_measures"
                formData={formData}
                validate={checkRequired("behavior_measures")}
                isRequired={Boolean(checkRequired("behavior_measures"))}
                {...props}
              />
            </CustomInput>
          </div>
        );
      }}
    </FormDataConsumer>
  );
};

export default BehaviorChangeForm;
