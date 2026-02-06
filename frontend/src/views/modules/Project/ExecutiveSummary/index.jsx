import React, { Fragment } from "react";
import CustomInput from "../../../components/CustomInput";
import {
  FormDataConsumer,
  useTranslate,
  NumberInput,
  BooleanInput,
  number,
  minValue,
  Labeled,
  required,
} from "react-admin";
import CustomTextArea from "../../../components/CustomTextArea";
import { checkFeature } from "../../../../helpers/checkPermission";
import { checkRequired } from "../../../resources/Projects/validation";

function ExecutiveSummary(props) {
  const translate = useTranslate();
  const { record } = props;

  return record &&
    checkFeature("project_executive_summary_show", record.phase_id) ? (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, ...rest }) => {
        return (
          <CustomInput
            tooltipText={
              "tooltips.resources.project-details.fields.exec_management_plan"
            }
            textArea
            fullWidth
          >
            <CustomTextArea
              label={translate(
                `resources.project-details.fields.exec_management_plan${
                  checkFeature(
                    "project_exec_management_plan_title_change",
                    formData.phase_id
                  )
                    ? "_pfs"
                    : ""
                }`
              )}
              source="exec_management_plan"
              validate={checkRequired("exec_management_plan")}
              isRequired
              formData={formData}
              {...props}
            />
          </CustomInput>
        );
      }}
    </FormDataConsumer>
  ) : null;
}

export default ExecutiveSummary;
