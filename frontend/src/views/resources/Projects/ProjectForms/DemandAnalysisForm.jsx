import React, { Fragment } from "react";
import {
  useTranslate,
  FormDataConsumer,
  Labeled,
  FileInput,
  FileField,
  required,
  translate,
} from "react-admin";
import CustomInput from "../../../components/CustomInput";
import CustomTextArea from "../../../components/CustomTextArea";

function DemandAnalysisForm(props) {
  const translate = useTranslate();

  return (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, ...rest }) => {
        return (
          <Fragment>
            <CustomInput tooltipText="Demand Analysis" textArea>
              <CustomTextArea
                source="demand_analysis"
                validate={[required()]}
                label={translate(
                  "resources.project-details.fields.demand_analysis"
                )}
                isRequired
                formData={formData}
                {...props}
              />
            </CustomInput>

            <FileInput
              source="demand_analysis_files"
              options={{ multiple: true }}
              accept="application/pdf"
              label={translate(
                "resources.project-details.fields.demand_analysis_files"
              )}
            >
              <FileField source="src" title="title" />
            </FileInput>
          </Fragment>
        );
      }}
    </FormDataConsumer>
  );
}

export default translate(DemandAnalysisForm);
