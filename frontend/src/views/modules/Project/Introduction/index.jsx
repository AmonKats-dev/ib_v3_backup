import React, { Fragment } from "react";
import CustomInput from "../../../components/CustomInput";
import { FormDataConsumer, useTranslate, required } from "react-admin";
import CustomTextArea from "../../../components/CustomTextArea";
import { checkFeature } from "../../../../helpers/checkPermission";
import { checkRequired } from "../../../resources/Projects/validation";

function Introduction(props) {
  const translate = useTranslate();

  return (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, ...rest }) => {
        const title =
          formData &&
          checkFeature(
            "project_organization_study_phase_title",
            formData.phase_id
          )
            ? translate(
                "resources.project-details.fields.organization_study_pfs"
              )
            : translate(
                "resources.project-details.fields.organization_study_fs"
              );

        return (
          <Fragment>
            <CustomInput
              tooltipText={
                "tooltips.resources.project-details.fields.rational_study"
              }
              textArea
              fullWidth
            >
              <CustomTextArea
                label={translate(
                  "resources.project-details.fields.rational_study"
                )}
                source="rational_study"
                validate={checkRequired("rational_study")}
                isRequired
                formData={formData}
                {...props}
              />
            </CustomInput>
            <CustomInput
              tooltipText={
                "tooltips.resources.project-details.fields.methodology"
              }
              textArea
              fullWidth
            >
              <CustomTextArea
                label={translate(
                  "resources.project-details.fields.methodology"
                )}
                source="methodology"
                validate={checkRequired("methodology")}
                isRequired
                formData={formData}
                {...props}
              />
            </CustomInput>
            <CustomInput
              tooltipText={
                "tooltips.resources.project-details.fields.organization_study"
              }
              textArea
              fullWidth
            >
              <CustomTextArea
                label={title}
                source="organization_study"
                validate={checkRequired("organization_study")}
                isRequired
                formData={formData}
                {...props}
              />
            </CustomInput>
          </Fragment>
        );
      }}
    </FormDataConsumer>
  );
}

export default Introduction;
