import {
  useTranslate,
  SelectInput,
  TextInput,
  minValue,
  ArrayInput,
  SimpleFormIterator,
  maxValue,
  required,
  FormDataConsumer,
} from "react-admin";
import React, { Component, Fragment } from "react";

import CustomInput from "../../../../components/CustomInput";
import CustomTextArea from "../../../../components/CustomTextArea";

function Stakeholders(props) {
  const translate = useTranslate();

  return (
    <Fragment>
      <ArrayInput
        source={props.getSource(`stakeholder_evaluations`)}
        label={false}
      >
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
                      "tooltips.resources.project_options.fields.analytical_modules.stakeholder_evaluations.name"
                    }
                    fullWidth
                  >
                    <TextInput
                      variant="outlined"
                      validate={required()}
                      margin="none"
                      options={{ fullWidth: "true", disabled: props.disabled }}
                      source={getSource("name")}
                      label={translate(
                        "resources.project_options.fields.analytical_modules.stakeholder_evaluations.name"
                      )}
                    />
                  </CustomInput>
                  <div>
                    <CustomInput
                      tooltipText={
                        "tooltips.resources.project_options.fields.analytical_modules.stakeholder_evaluations.impact_sign.title"
                      }
                      fullWidth
                    >
                      <SelectInput
                        validate={required()}
                        options={{
                          fullWidth: "true",
                          disabled: props.disabled,
                        }}
                        className="boolean-selector"
                        label={translate(
                          "resources.project_options.fields.analytical_modules.stakeholder_evaluations.impact_sign.title"
                        )}
                        variant="outlined"
                        margin="none"
                        source={getSource("impact_sign")}
                        choices={[
                          {
                            id: "POSITIVE",
                            name: translate(
                              "resources.project_options.fields.analytical_modules.stakeholder_evaluations.impact_sign.positive"
                            ),
                          },
                          {
                            id: "NEGATIVE",
                            name: translate(
                              "resources.project_options.fields.analytical_modules.stakeholder_evaluations.impact_sign.negative"
                            ),
                          },
                        ]}
                      />
                    </CustomInput>
                    <CustomInput
                      tooltipText={
                        "tooltips.resources.project_options.fields.analytical_modules.stakeholder_evaluations.beneficiary.title"
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
                          "resources.project_options.fields.analytical_modules.stakeholder_evaluations.beneficiary.title"
                        )}
                        label={"Relation"}
                        source={getSource("beneficiary")}
                        choices={[
                          {
                            id: "DIRECT",
                            name: translate(
                              "resources.project_options.fields.analytical_modules.stakeholder_evaluations.beneficiary.direct"
                            ),
                          },
                          {
                            id: "INDIRECT",
                            name: translate(
                              "resources.project_options.fields.analytical_modules.stakeholder_evaluations.beneficiary.indirect"
                            ),
                          },
                        ]}
                      />
                    </CustomInput>
                  </div>
                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project_options.fields.analytical_modules.stakeholder_evaluations.description"
                    }
                    fullWidth
                  >
                    <CustomTextArea
                      {...props}
                      source={getSource("description")}
                      formData={formData}
                      validate={required()}
                      isRequired
                      label={translate(
                        "resources.project_options.fields.analytical_modules.stakeholder_evaluations.description"
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

export default Stakeholders;
