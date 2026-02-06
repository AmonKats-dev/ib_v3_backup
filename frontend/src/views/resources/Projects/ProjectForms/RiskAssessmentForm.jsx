import {
  useTranslate,
  SelectInput,
  TextInput,
  minValue,
  ArrayInput,
  SimpleFormIterator,
  maxValue,
  required,
  Labeled,
  FormDataConsumer,
} from "react-admin";
import React, { Component, Fragment, useMemo } from "react";

import CustomInput from "../../../components/CustomInput";
import CustomTextArea from "../../../components/CustomTextArea";
import { checkFeature, useChangeField } from "../../../../helpers/checkPermission";
import lodash from 'lodash';

import { useFormState } from "react-final-form";

function RiskAssessmentForm({record, ...props}) {
  const translate = useTranslate();
  const changeRisks = useChangeField({ name: "project_risks" });
  const formValues = useFormState().values;

  useMemo(() => {
    if (checkFeature("has_default_array_input_value") && formValues) {
      if (lodash.get(formValues, "project_risks")) {
        if (lodash.get(formValues, "project_risks").length === 0) {
          changeRisks([{}]);
        }
      } else {
        changeRisks([{}]);
      }
    }
  }, [record]);

  return (
    <Fragment>
      <ArrayInput source={`project_risks`} label={false}>
        <SimpleFormIterator
          disableAdd={props.disabled}
          disableRemove={props.disabled}
        >
          <FormDataConsumer>
            {({ getSource, scopedFormData, formData, ...rest }) => {
              return (
                <div>
                  <CustomInput
                    fullWidth
                    tooltipText={
                      "tooltips.resources.project-details.fields.project_risks.name"
                    }
                  >
                    <TextInput
                      source={getSource("name")}
                      label={translate(
                        "resources.project-details.fields.project_risks.name"
                      )}
                      validate={required()}
                      variant="outlined"
                      margin="none"
                    />
                  </CustomInput>

                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project-details.fields.project_risks.impact_level"
                    }
                    fullWidth
                  >
                    <SelectInput
                      validate={required()}
                      variant="outlined"
                      margin="none"
                      options={{
                        fullWidth: "true",
                        disabled: props.disabled,
                      }}
                      className="boolean-selector"
                      label={translate(
                        "resources.project-details.fields.project_risks.impact_level"
                      )}
                      source={getSource("impact_level")}
                      choices={[
                        {
                          id: "LOW",
                          name: translate(
                            "resources.project_options.fields.analytical_modules.risk_evaluations.levels.low"
                          ),
                        },
                        {
                          id: "MEDIUM",
                          name: translate(
                            "resources.project_options.fields.analytical_modules.risk_evaluations.levels.medium"
                          ),
                        },
                        {
                          id: "HIGH",
                          name: translate(
                            "resources.project_options.fields.analytical_modules.risk_evaluations.levels.high"
                          ),
                        },
                      ]}
                    />
                  </CustomInput>

                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project-details.fields.project_risks.probability"
                    }
                    fullWidth
                  >
                    <SelectInput
                      validate={required()}
                      variant="outlined"
                      margin="none"
                      options={{
                        fullWidth: "true",
                        disabled: props.disabled,
                      }}
                      className="boolean-selector"
                      label={translate(
                        "resources.project-details.fields.project_risks.probability"
                      )}
                      source={getSource("probability")}
                      choices={[
                        {
                          id: "LOW",
                          name: translate(
                            "resources.project_options.fields.analytical_modules.risk_evaluations.levels.low"
                          ),
                        },
                        {
                          id: "MEDIUM",
                          name: translate(
                            "resources.project_options.fields.analytical_modules.risk_evaluations.levels.medium"
                          ),
                        },
                        {
                          id: "HIGH",
                          name: translate(
                            "resources.project_options.fields.analytical_modules.risk_evaluations.levels.high"
                          ),
                        },
                      ]}
                    />
                  </CustomInput>

                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project-details.fields.project_risks.score"
                    }
                    fullWidth
                  >
                    <SelectInput
                      variant="outlined"
                      validate={required()}
                      margin="none"
                      options={{
                        fullWidth: "true",
                        disabled: props.disabled,
                      }}
                      className="boolean-selector"
                      label={translate(
                        "resources.project-details.fields.project_risks.score"
                      )}
                      source={getSource("score")}
                      choices={[
                        {
                          id: "LOW",
                          name: translate(
                            "resources.project_options.fields.analytical_modules.risk_evaluations.levels.low"
                          ),
                        },
                        {
                          id: "MEDIUM",
                          name: translate(
                            "resources.project_options.fields.analytical_modules.risk_evaluations.levels.medium"
                          ),
                        },
                        {
                          id: "HIGH",
                          name: translate(
                            "resources.project_options.fields.analytical_modules.risk_evaluations.levels.high"
                          ),
                        },
                      ]}
                    />
                  </CustomInput>

                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project-details.fields.project_risks.response"
                    }
                    textArea
                    fullWidth
                  >
                    <CustomTextArea
                      {...props}
                      label={translate(
                        "resources.project-details.fields.project_risks.response"
                      )}
                      source={getSource("response")}
                      formData={formData}
                      validate={[required()]}
                      isRequired
                    />
                  </CustomInput>

                  <CustomInput
                    fullWidth
                    tooltipText={
                      "tooltips.resources.project-details.fields.project_risks.owner"
                    }
                  >
                    <TextInput
                      source={getSource("owner")}
                      label={translate(
                        "resources.project-details.fields.project_risks.owner"
                      )}
                      validate={required()}
                      variant="outlined"
                      margin="none"
                    />
                  </CustomInput>
                </div>
              );
            }}
          </FormDataConsumer>
        </SimpleFormIterator>
      </ArrayInput>
    </Fragment>
  );
}

export default RiskAssessmentForm;
