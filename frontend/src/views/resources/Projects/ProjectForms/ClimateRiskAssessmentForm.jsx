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

function ClimateRiskAssessmentForm({ record, ...props }) {
  const [climateHazard, setClimateHazard] = useState([]);
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const changeRisks = useChangeField({ name: "climate_risks" });
  const formValues = useFormState().values;

  useMemo(() => {
    if (checkFeature("has_default_array_input_value") && formValues) {
      if (lodash.get(formValues, "climate_risks")) {
        if (lodash.get(formValues, "climate_risks").length === 0) {
          changeRisks([{}]);
        }
      } else {
        changeRisks([{}]);
      }
    }
  }, [record]);

  useEffect(() => {
    dataProvider
      .getListOfAll("parameters", { sort_field: "id" })
      .then((response) => {
        if (response && response.data) {
          const data = lodash.find(
            response.data,
            (it) => it.param_key === "climate_hazard"
          );
          if (data && data.param_value) {
            setClimateHazard(
              data.param_value.map((item) => ({
                id: item,
                name: item,
              }))
            );
          }
        }
      });
  }, []);

  return (
    <Fragment>
      <ArrayInput
        source="climate_risks"
        label={translate("resources.project-details.fields.climate_risks.name")}
      >
        <SimpleFormIterator>
          <FormDataConsumer>
            {({ formData, scopedFormData, getSource, ...rest }) => {
              return (
                <div>
                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project-details.fields.climate_risks.climate_hazard"
                    }
                    fullWidth
                  >
                    <SelectInput
                      validate={[required()]}
                      options={{ fullWidth: "true" }}
                      label={translate(
                        "resources.project-details.fields.climate_risks.climate_hazard"
                      )}
                      source={getSource("climate_hazard")}
                      choices={climateHazard}
                      variant="outlined"
                      margin="none"
                    />
                  </CustomInput>
                  {scopedFormData && scopedFormData.climate_hazard === "Other" && (
                    <CustomInput
                      tooltipText={
                        "tooltips.resources.project-details.fields.climate_risks.climate_hazard_other"
                      }
                      fullWidth
                    >
                      <TextInput
                        label={translate(
                          "resources.project-details.fields.climate_risks.climate_hazard_other"
                        )}
                        validate={[required()]}
                        source={getSource("climate_hazard_other")}
                        variant="outlined"
                        margin="none"
                      />
                    </CustomInput>
                  )}

                  <div>
                    <CustomInput
                      tooltipText={
                        "tooltips.resources.project-details.fields.climate_risks.exposure_risk"
                      }
                      fullWidth
                    >
                      <SelectInput
                        validate={[required()]}
                        variant="outlined"
                        margin="none"
                        options={{
                          fullWidth: "true",
                          disabled: props.disabled,
                        }}
                        className="boolean-selector"
                        label={translate(
                          "resources.project-details.fields.climate_risks.exposure_risk"
                        )}
                        source={getSource("exposure_risk")}
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
                        "tooltips.resources.project-details.fields.climate_risks.vulnerability_risk"
                      }
                      fullWidth
                    >
                      <SelectInput
                        validate={[required()]}
                        variant="outlined"
                        margin="none"
                        options={{
                          fullWidth: "true",
                          disabled: props.disabled,
                        }}
                        className="boolean-selector"
                        label={translate(
                          "resources.project-details.fields.climate_risks.vulnerability_risk"
                        )}
                        source={getSource("vulnerability_risk")}
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
                        "tooltips.resources.project-details.fields.climate_risks.overall_risk"
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
                          "resources.project-details.fields.climate_risks.overall_risk"
                        )}
                        source={getSource("overall_risk")}
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
                      "tooltips.resources.project-details.fields.climate_risks.vulnerability_impact"
                    }
                    fullWidth
                  >
                    <CustomTextArea
                      source={getSource("vulnerability_impact")}
                      formData={formData}
                      label={translate(
                        "resources.project-details.fields.climate_risks.vulnerability_impact"
                      )}
                      validate={[required()]}
                      isRequired
                      {...props}
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

export default ClimateRiskAssessmentForm;
