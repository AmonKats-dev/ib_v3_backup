import React, { Fragment, useState } from "react";
import { FormDataConsumer, Labeled, required, useTranslate } from "react-admin";

import CustomInput from "../../../components/CustomInput";
import CustomTextArea from "../../../components/CustomTextArea";
import { checkRequired } from "../../../resources/Projects/validation";

function ExPostEvaluationForm(props) {
  const translate = useTranslate();

  return (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, ...rest }) => {
        return (
          <Fragment>
            <CustomInput
              tooltipText={
                "tooltips.resources.project-details.fields.evaluation_methodology"
              }
              textArea
            >
              <Labeled />
              <CustomTextArea
                label={translate(
                  "resources.project-details.fields.evaluation_methodology"
                )}
                source="post_evaluation.evaluation_methodology"
                formData={formData}
                validate={checkRequired("post_evaluation.evaluation_methodology")}
                isRequired
                {...props}
              />
            </CustomInput>
            <CustomInput
              tooltipText={
                "tooltips.resources.project-details.fields.achieved_outcomes"
              }
              textArea
            >
              <CustomTextArea
                label={translate(
                  "resources.project-details.fields.achieved_outcomes"
                )}
                source="post_evaluation.achieved_outcomes"
                formData={formData}
                validate={checkRequired("post_evaluation.achieved_outcomes")}
                isRequired
                {...props}
              />
            </CustomInput>
            <CustomInput
              tooltipText={
                "tooltips.resources.project-details.fields.deviation_reasons"
              }
              textArea
            >
              <CustomTextArea
                label={translate(
                  "resources.project-details.fields.deviation_reasons"
                )}
                source="deviation_reasons"
                formData={formData}
                validate={checkRequired("deviation_reasons")}
                isRequired
                {...props}
              />
            </CustomInput>
            <CustomInput
              tooltipText={"tooltips.resources.project-details.fields.measures"}
              textArea
            >
              <CustomTextArea
                label={translate("resources.project-details.fields.measures")}
                source="post_evaluation.measures"
                formData={formData}
                validate={checkRequired("post_evaluation.measures")}
                isRequired
                {...props}
              />
            </CustomInput>
            <CustomInput
              tooltipText={
                "tooltips.resources.project-details.fields.lessons_learned"
              }
              textArea
            >
              <CustomTextArea
                label={translate(
                  "resources.project-details.fields.lessons_learned"
                )}
                source="post_evaluation.lessons_learned"
                formData={formData}
                validate={checkRequired("post_evaluation.lessons_learned")}
                isRequired
                {...props}
              />
            </CustomInput>
            <CustomInput
              tooltipText={
                "tooltips.resources.project-details.fields.deviation_reasons"
              }
              textArea
            >
              <CustomTextArea
                label={translate(
                  "resources.project-details.fields.deviation_reasons"
                )}
                source="post_evaluation.deviation_reasons"
                formData={formData}
                validate={checkRequired("post_evaluation.deviation_reasons")}
                isRequired
                {...props}
              />
            </CustomInput>
          </Fragment>
        );
      }}
    </FormDataConsumer>
  );
}

export default ExPostEvaluationForm;
