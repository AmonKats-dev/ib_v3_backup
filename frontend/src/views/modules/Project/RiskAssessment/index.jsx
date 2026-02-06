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
import React, { Component, Fragment } from "react";

import CustomInput from "../../../components/CustomInput";
import CustomTextArea from "../../../components/CustomTextArea";

function RiskAssessment(props) {
  const translate = useTranslate();

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
                      "tooltips.resources.project-details.fields.risk_assessment.name"
                    }
                  >
                    <TextInput
                      source="name"
                      label={translate(
                        "resources.project-details.fields.risk_assessment.name"
                      )}
                      validate={required()}
                      variant="outlined"
                      margin="none"
                    />
                  </CustomInput>

                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project_options.fields.risk_assessment.impact_level"
                    }
                    fullWidth
                  >
                    <SelectInput
                      variant="outlined"
                      margin="none"
                      options={{
                        fullWidth: "true",
                        disabled: props.disabled,
                      }}
                      className="boolean-selector"
                      label={translate(
                        "resources.project_options.fields.risk_assessment.impact_level"
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
                      "tooltips.resources.project_options.fields.risk_assessment.probability"
                    }
                    fullWidth
                  >
                    <SelectInput
                      variant="outlined"
                      margin="none"
                      options={{
                        fullWidth: "true",
                        disabled: props.disabled,
                      }}
                      className="boolean-selector"
                      label={translate(
                        "resources.project_options.fields.risk_assessment.probability"
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
                      "tooltips.resources.project_options.fields.risk_assessment.score"
                    }
                    fullWidth
                  >
                    <SelectInput
                      variant="outlined"
                      margin="none"
                      options={{
                        fullWidth: "true",
                        disabled: props.disabled,
                      }}
                      className="boolean-selector"
                      label={translate(
                        "resources.project_options.fields.risk_assessment.score"
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
                      "tooltips.resources.project-details.fields.risk_assessment.response"
                    }
                    textArea
                    fullWidth
                  >
                    <CustomTextArea
                      source="response"
                      label={translate(
                        "resources.project-details.fields.risk_assessment.response"
                      )}
                      validate={[required()]}
                      isRequired
                      {...props}
                    />
                  </CustomInput>

                  <CustomInput
                    fullWidth
                    tooltipText={
                      "tooltips.resources.project-details.fields.risk_assessment.owner"
                    }
                  >
                    <TextInput
                      source="owner"
                      label={translate(
                        "resources.project-details.fields.risk_assessment.owner"
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

export default RiskAssessment;
