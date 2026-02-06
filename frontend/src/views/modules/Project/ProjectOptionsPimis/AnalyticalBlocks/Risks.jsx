import {
  useTranslate,
  SelectInput,
  TextInput,
  minValue,
  ArrayInput,
  SimpleFormIterator,
  maxValue,
  Labeled,
  FormDataConsumer,
  required,
} from "react-admin";
import React, { Component, Fragment } from "react";

import CustomInput from "../../../../components/CustomInput";
import { checkRequired } from "../../../../resources/Projects/validation";

function Risks(props) {
  const translate = useTranslate();

  return (
    <Fragment>
      <ArrayInput source={props.getSource(`risk_evaluations`)} label={false}>
        <SimpleFormIterator
          disableAdd={props.disabled}
          disableRemove={props.disabled}
        >
          <FormDataConsumer>
            {({ getSource, scopedFormData, formData, ...rest }) => {
              return (
                <div>
                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project_options.fields.analytical_modules.risk_evaluations.description"
                    }
                    fullWidth
                  >
                    <TextInput
                      validate={checkRequired(
                        "risk_evaluations",
                        "description"
                      )}
                      variant="outlined"
                      margin="none"
                      options={{ fullWidth: "true", disabled: props.disabled }}
                      source={getSource("description")}
                      label={translate(
                        "resources.project_options.fields.analytical_modules.risk_evaluations.description"
                      )}
                    />
                  </CustomInput>
                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project_options.fields.analytical_modules.risk_evaluations.occurrence"
                    }
                    fullWidth
                  >
                    <SelectInput
                      validate={checkRequired("risk_evaluations", "occurrence")}
                      variant="outlined"
                      margin="none"
                      options={{ fullWidth: "true", disabled: props.disabled }}
                      className="boolean-selector"
                      label={translate(
                        "resources.project_options.fields.analytical_modules.risk_evaluations.occurrence"
                      )}
                      source={getSource("occurrence")}
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
                        {
                          id: "VERY_HIGH",
                          name: translate(
                            "resources.project_options.fields.analytical_modules.risk_evaluations.levels.very_high"
                          ),
                        },
                      ]}
                    />
                  </CustomInput>
                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project_options.fields.analytical_modules.risk_evaluations.impact"
                    }
                    fullWidth
                  >
                    <SelectInput
                      validate={checkRequired("risk_evaluations", "impact")}
                      variant="outlined"
                      margin="none"
                      options={{ fullWidth: "true", disabled: props.disabled }}
                      className="boolean-selector"
                      label={translate(
                        "resources.project_options.fields.analytical_modules.risk_evaluations.impact"
                      )}
                      source={getSource("impact")}
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
                        {
                          id: "VERY_HIGH",
                          name: translate(
                            "resources.project_options.fields.analytical_modules.risk_evaluations.levels.very_high"
                          ),
                        },
                      ]}
                    />
                  </CustomInput>
                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project_options.fields.analytical_modules.risk_evaluations.mitigation_plan"
                    }
                    fullWidth
                  >
                    <TextInput
                      validate={checkRequired(
                        "risk_evaluations",
                        "mitigation_plan"
                      )}
                      variant="outlined"
                      margin="none"
                      options={{ fullWidth: "true", disabled: props.disabled }}
                      source={getSource("mitigation_plan")}
                      label={translate(
                        "resources.project_options.fields.analytical_modules.risk_evaluations.mitigation_plan"
                      )}
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

export default Risks;
