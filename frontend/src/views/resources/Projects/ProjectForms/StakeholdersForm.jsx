import React, { Fragment, useEffect, useMemo, useState } from "react";
import {
  NumberInput,
  SelectInput,
  TextInput,
  Labeled,
  minValue,
  useDataProvider,
  required,
  useTranslate,
  SimpleFormIterator,
  FormDataConsumer,
  ArrayInput,
  useNotify,
} from "react-admin";
import CustomInput from "../../../components/CustomInput";
import CustomTextArea from "../../../components/CustomTextArea";
import lodash from "lodash";
import {
  checkFeature,
  useChangeField,
} from "../../../../helpers/checkPermission";
import { useFormState } from "react-final-form";

function StakeholdersForm({ record, ...props }) {
  const [engagementFrequence, setEngagementFrequence] = useState([]);
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const hasPimisFields = checkFeature("has_pimis_fields");
  const changeStakeholders = useChangeField({ name: "stakeholders" });
  const formValues = useFormState().values;

  useMemo(() => {
    if (checkFeature("has_default_array_input_value") && formValues) {
      if (lodash.get(formValues, "stakeholders")) {
        if (lodash.get(formValues, "stakeholders").length === 0) {
          changeStakeholders([{}]);
        }
      } else {
        changeStakeholders([{}]);
      }
    }
  }, [record]);

  useEffect(() => {
    if (hasPimisFields) {
      dataProvider
        .getListOfAll("parameters", { sort_field: "id" })
        .then((response) => {
          if (response && response.data) {
            const engagementFrequencyParams = lodash.find(
              response.data,
              (it) => it.param_key === "engagement_frequency"
            );
            if (
              engagementFrequencyParams &&
              engagementFrequencyParams.param_value
            ) {
              setEngagementFrequence(
                engagementFrequencyParams.param_value.map((item) => ({
                  id: item,
                  name: item,
                }))
              );
            }
          }
        });
    }
  }, []);

  return (
    <Fragment>
      <ArrayInput
        source="stakeholders"
        label={translate("resources.project-details.fields.stakeholders.title")}
      >
        <SimpleFormIterator>
          <FormDataConsumer>
            {({ formData, scopedFormData, getSource, ...rest }) => {
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
                      margin="none"
                      options={{ fullWidth: "true", disabled: props.disabled }}
                      validate={[required()]}
                      source={getSource("name")}
                      label={translate(
                        "resources.project_options.fields.analytical_modules.stakeholder_evaluations.name"
                      )}
                    />
                  </CustomInput>
                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project_options.fields.analytical_modules.stakeholder_evaluations.responsibilities"
                    }
                    fullWidth
                  >
                    <CustomTextArea
                      label={translate(
                        "resources.project_options.fields.analytical_modules.stakeholder_evaluations.responsibilities"
                      )}
                      source={getSource("responsibilities")}
                      formData={formData}
                      validate={[required()]}
                      isRequired
                      {...props}
                    />
                  </CustomInput>

                  <div>
                    <CustomInput
                      tooltipText={
                        "tooltips.resources.project_options.fields.analytical_modules.stakeholder_evaluations.interest_level"
                      }
                      fullWidth
                    >
                      <SelectInput
                        variant="outlined"
                        margin="none"
                        validate={[required()]}
                        options={{
                          fullWidth: "true",
                          disabled: props.disabled,
                        }}
                        className="boolean-selector"
                        label={translate(
                          "resources.project_options.fields.analytical_modules.stakeholder_evaluations.interest_level"
                        )}
                        source={getSource("interest_level")}
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
                        "tooltips.resources.project_options.fields.analytical_modules.stakeholder_evaluations.influence_level"
                      }
                      fullWidth
                    >
                      <SelectInput
                        variant="outlined"
                        validate={[required()]}
                        margin="none"
                        options={{
                          fullWidth: "true",
                          disabled: props.disabled,
                        }}
                        className="boolean-selector"
                        label={translate(
                          "resources.project_options.fields.analytical_modules.stakeholder_evaluations.influence_level"
                        )}
                        source={getSource("influence_level")}
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
                  </div>
                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project_options.fields.analytical_modules.stakeholder_evaluations.communication_channel"
                    }
                    fullWidth
                  >
                    <CustomTextArea
                      source={getSource("communication_channel")}
                      formData={formData}
                      validate={[required()]}
                      isRequired
                      label={translate(
                        "resources.project_options.fields.analytical_modules.stakeholder_evaluations.communication_channel"
                      )}
                      {...props}
                    />
                  </CustomInput>

                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project_options.fields.analytical_modules.stakeholder_evaluations.engagement_frequency"
                    }
                    fullWidth
                  >
                    <SelectInput
                      options={{ fullWidth: "true" }}
                      validate={[required()]}
                      label={translate(
                        "resources.project_options.fields.analytical_modules.stakeholder_evaluations.engagement_frequency"
                      )}
                      source={getSource("engagement_frequency")}
                      choices={engagementFrequence}
                      variant="outlined"
                      margin="none"
                    />
                  </CustomInput>

                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project_options.fields.analytical_modules.stakeholder_evaluations.responsible_entity"
                    }
                    fullWidth
                  >
                    <TextInput
                      validate={[required()]}
                      variant="outlined"
                      margin="none"
                      options={{ fullWidth: "true" }}
                      source={getSource("responsible_entity")}
                      label={translate(
                        "resources.project_options.fields.analytical_modules.stakeholder_evaluations.responsible_entity"
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

export default StakeholdersForm;
