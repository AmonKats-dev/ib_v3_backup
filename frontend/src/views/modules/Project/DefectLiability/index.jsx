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

function DefectLiability(props) {
  const translate = useTranslate();
  const { record } = props;

  return record &&
    checkFeature("project_defect_liability_show", record.phase_id) ? (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, ...rest }) => {
        return (
          <Fragment>
            <CustomInput
              tooltipText={"tooltips.resources.project-details.fields.is_dlp"}
              bool
            >
              <BooleanInput
                source="is_dlp"
                label={translate("resources.project-details.fields.is_dlp")}
              />
            </CustomInput>
            {formData && formData.is_dlp ? (
              <Fragment>
                <CustomInput
                  tooltipText={
                    "tooltips.resources.project-details.fields.liability_period"
                  }
                >
                  <NumberInput
                    source="liability_period"
                    label={translate(
                      "resources.project-details.fields.liability_period"
                    )}
                    step={1}
                    validate={[
                      number(),
                      minValue(1),
                      checkRequired("liability_period"),
                    ]}
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

export default DefectLiability;
