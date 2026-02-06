import React, { Fragment, useMemo } from "react";
import {
  ArrayInput,
  FormDataConsumer,
  SimpleFormIterator,
  TextInput,
  required,
  useTranslate,
  maxLength,
} from "react-admin";
import CustomInput from "../../../../components/CustomInput";
import { getFiscalYearsRangeForIntervals } from "../../../../../helpers/formatters";
import IndicatorsButton from "../Indicators/IndicatorsButton";
import IndicatorList from "../Indicators/IndicatorList";
import {
  checkFeature,
  useChangeField,
} from "../../../../../helpers/checkPermission";
import { useFormState } from "react-final-form";
import useCheckFeature from "../../../../../hooks/useCheckFeature";
import CustomTextArea from "../../../../components/CustomTextArea";

export const validation = (values) => {
  return values && values.outcomes && values.outcomes.length >= 2;
};

function Outcomes({ record, ...props }) {
  const formValues = useFormState().values;
  const translate = useTranslate();
  const hasDefaultArrayInputValue = useCheckFeature(
    "has_default_array_input_value"
  );
  const changeOutcomes = useChangeField({ name: "outcomes" });

  useMemo(() => {
    if (hasDefaultArrayInputValue && formValues) {
      if (formValues.outcomes) {
        if (formValues.outcomes.length === 0) {
          changeOutcomes([{}]);
        }
      } else {
        changeOutcomes([{}]);
      }
    }
  }, [record]);

  return (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, ...rest }) => {
        return (
          <Fragment>
            <ArrayInput source="outcomes" label={false}>
              <SimpleFormIterator
                disableAdd={
                  checkFeature("project_result_matrix_has_max_2_outcomes") &&
                  validation(formData)
                }
              >
                <FormDataConsumer>
                  {({ getSource, scopedFormData, formData, ...rest }) => (
                    <Fragment>
                      <div style={{ minWidth: "500px" }}>
                        <div>
                          <CustomInput
                            tooltipText={
                              "tooltips.resources.outcomes.fields.name"
                            }
                            fullWidth
                          >
                            <TextInput
                              validate={[required(), maxLength(255)]}
                              source={getSource("name")}
                              label={translate(
                                "resources.outcomes.fields.name"
                              )}
                              variant="outlined"
                              margin="none"
                            />
                          </CustomInput>
                          {formData &&
                            checkFeature(
                              "project_result_matrix_outcomes_description_show",
                              formData.phase_id
                            ) && (
                              <CustomInput
                                tooltipText={
                                  "tooltips.resources.outcomes.fields.description"
                                }
                                fullWidth
                                textArea
                              >
                                <CustomTextArea
                                  label={translate(
                                    "resources.outcomes.fields.description"
                                  )}
                                  source={getSource("description")}
                                  validate={[required()]}
                                  isRequired
                                  formData={formData}
                                  {...props}
                                />
                              </CustomInput>
                            )}
                        </div>
                        <br />
                        {formData &&
                        checkFeature(
                          "project_result_matrix_outcomes_indicators_show",
                          formData.phase_id
                        )
                          ? scopedFormData && (
                              <Fragment>
                                <IndicatorsButton
                                  record={formData}
                                  onSave={props.save}
                                  source={getSource("indicators")}
                                  targetYears={getFiscalYearsRangeForIntervals(
                                    record.start_date,
                                    record.end_date
                                  )}
                                  type="outcomes"
                                />

                                {scopedFormData.indicators &&
                                  scopedFormData.indicators.length !== 0 && (
                                    <IndicatorList
                                      indicators={scopedFormData.indicators}
                                      type="outcomes"
                                    />
                                  )}
                              </Fragment>
                            )
                          : null}
                      </div>
                      <br />
                    </Fragment>
                  )}
                </FormDataConsumer>
              </SimpleFormIterator>
            </ArrayInput>
          </Fragment>
        );
      }}
    </FormDataConsumer>
  );
}

export default Outcomes;
