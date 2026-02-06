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
import React, { Component, Fragment, useMemo } from "react";

import CustomInput from "../../../../components/CustomInput";
import CustomTextArea from "../../../../components/CustomTextArea";
import {
  checkFeature,
  useChangeField,
} from "../../../../../helpers/checkPermission";
import lodash from "lodash";
import { useFormState } from "react-final-form";
import { checkRequired } from "../../../../resources/Projects/validation";

function Stakeholders(props) {
  const translate = useTranslate();
  const changeStakeholders = useChangeField({
    name: props.getSource(`stakeholder_evaluations`),
  });
  const formValues = useFormState().values;

  useMemo(() => {
    if (checkFeature("has_default_array_input_value") && formValues) {
      if (lodash.get(formValues, props.getSource(`stakeholder_evaluations`))) {
        if (
          lodash.get(formValues, props.getSource(`stakeholder_evaluations`))
            .length === 0
        ) {
          changeStakeholders([{}]);
        }
      } else {
        changeStakeholders([{}]);
      }
    }
  }, [props.formData]);

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
                      validate={checkRequired(
                        "stakeholder_evaluations",
                        "name"
                      )}
                      variant="outlined"
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
                        validate={checkRequired(
                          "stakeholder_evaluations",
                          "impact_sign"
                        )}
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
                        variant="outlined"
                        validate={checkRequired(
                          "stakeholder_evaluations",
                          "beneficiary"
                        )}
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
                      formData={formData}
                      source={getSource("description")}
                      validate={checkRequired(
                        "stakeholder_evaluations",
                        "description"
                      )}
                      label={translate(
                        "resources.project_options.fields.analytical_modules.stakeholder_evaluations.description"
                      )}
                      isRequired
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
