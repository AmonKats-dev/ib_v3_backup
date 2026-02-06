import React, { Fragment } from "react";
import CustomInput from "../../../components/CustomInput";
import {
  FormDataConsumer,
  useTranslate,
  NumberInput,
  BooleanInput,
  number,
  minValue,
  required,
} from "react-admin";
import { checkFeature } from "../../../../helpers/checkPermission";
import { checkRequired } from "../../../resources/Projects/validation";

function EvaluationPeriod(props) {
  const translate = useTranslate();
  const { record } = props;

  return record &&
    checkFeature("project_post_evaluation_show", record.phase_id) ? (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, ...rest }) => {
        return (
          <Fragment>
            <CustomInput
              tooltipText={
                "tooltips.resources.project-details.fields.is_evaluation"
              }
              bool
            >
              <BooleanInput
                source="is_evaluation"
                label={translate(
                  "resources.project-details.fields.is_evaluation"
                )}
              />
            </CustomInput>
            {formData && formData.is_evaluation ? (
              <Fragment>
                <CustomInput
                  tooltipText={
                    "tooltips.resources.project-details.fields.evaluation_period"
                  }
                >
                  <NumberInput
                    source="evaluation_period"
                    label={translate(
                      "resources.project-details.fields.evaluation_period"
                    )}
                    step={1}
                    validate={[number(), minValue(1), checkRequired("evaluation_period")]}
                    variant="outlined"
                    margin="none"
                  />
                </CustomInput>
              </Fragment>
            ) : null}
          </Fragment>
        );
      }}
    </FormDataConsumer>
  ) : null;
}

export default EvaluationPeriod;
