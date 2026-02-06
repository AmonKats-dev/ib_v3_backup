import React, { Fragment, useEffect, useState } from "react";
import CustomInput from "../../../components/CustomInput";
import {
  FormDataConsumer,
  number,
  TextInput,
  SelectInput,
  useTranslate,
  Labeled,
  useDataProvider,
  required,
  SelectArrayInput,
} from "react-admin";
import CustomTextArea from "../../../components/CustomTextArea";
import { checkFeature } from "../../../../helpers/checkPermission";
import lodash from "lodash";
import { generateChoices } from "../../../../helpers";
import { checkRequired } from "../../../resources/Projects/validation";

//NDP Form
function StrategicAlignment(props) {
  const [ndpNumbers, setNdpNumbers] = useState([]);
  const [focusAreas, setFocusAreas] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const translate = useTranslate();
  const dataProvider = useDataProvider();

  useEffect(() => {
    dataProvider
      .getListOfAll("parameters", { sort_field: "id" })
      .then((response) => {
        if (response && response.data) {
          const ndpNumbers = lodash.find(
            response.data,
            (it) => it.param_key === "ndp_number"
          );
          if (ndpNumbers) {
            setNdpNumbers(ndpNumbers.param_value);
          }
          const focusAreas = lodash.find(
            response.data,
            (it) => it.param_key === "focus_areas"
          );
          if (focusAreas) {
            setFocusAreas(focusAreas.param_value);
          }
        }
      });
  }, []);

  useEffect(() => {
    dataProvider
      .getListOfAll("interventions", {
        sort_field: "id",
        filter: { program_id: props.projectData.program_id },
      })
      .then((response) => {
        if (response && response.data) {
          setInterventions(response.data);
        }
      });
  }, [props.projectData.program_id]);

  const OTHER_PLANS = [
    {
      id: "development_partners",
      name: translate(
        "resources.project-details.fields.other_plans.development_partners"
      ),
    },
    {
      id: "cabinet_directives",
      name: translate(
        "resources.project-details.fields.other_plans.cabinet_directives"
      ),
    },
    {
      id: "parliament_approval",
      name: translate(
        "resources.project-details.fields.other_plans.parliament_approval"
      ),
    },
    {
      id: "stare_owned_enterprise",
      name: translate(
        "resources.project-details.fields.other_plans.stare_owned_enterprise"
      ),
    },
    {
      id: "regional_integration_policy",
      name: translate(
        "resources.project-details.fields.other_plans.regional_integration_policy"
      ),
    },
    {
      id: "political_manifestos",
      name: translate(
        "resources.project-details.fields.other_plans.political_manifestos"
      ),
    },
    {
      id: "interest_groups_or_beneficiaries",
      name: translate(
        "resources.project-details.fields.other_plans.interest_groups_or_beneficiaries"
      ),
    },
    {
      id: "private_sponsors",
      name: translate(
        "resources.project-details.fields.other_plans.private_sponsors"
      ),
    },
    {
      id: "sustainable_development_goals",
      name: translate(
        "resources.project-details.fields.other_plans.sustainable_development_goals"
      ),
    },
  ];
  return (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, ...rest }) => {
        return (
          <Fragment>
            {checkFeature("has_legacy_ndp", formData.phase_id) && (
              <Fragment>
                <h5>
                  {translate(
                    "resources.project-details.fields.strategic_alignment"
                  )}
                </h5>
                <CustomInput
                  tooltipText={
                    "tooltips.resources.project-details.fields.in_ndp.title"
                  }
                  bool
                >
                  <SelectInput
                    label={translate(
                      "resources.project-details.fields.in_ndp.title"
                    )}
                    source={"in_ndp"}
                    choices={[
                      {
                        id: true,
                        name: translate(
                          "resources.project-details.fields.in_ndp.yes"
                        ),
                      },
                      {
                        id: false,
                        name: translate(
                          "resources.project-details.fields.in_ndp.other"
                        ),
                      },
                    ]}
                    options={{ fullWidth: "true" }}
                    variant="outlined"
                    margin="none"
                    style={{ width: 250 }}
                  />
                </CustomInput>
                {formData && formData.in_ndp && (
                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project-details.fields.ndp_type.title"
                    }
                    bool
                  >
                    <SelectInput
                      label={translate(
                        "resources.project-details.fields.ndp_type.title"
                      )}
                      source="ndp_type"
                      choices={[
                        {
                          id: "CORE",
                          name: translate(
                            "resources.project-details.fields.ndp_type.core"
                          ),
                        },
                        {
                          id: "PRIORITY",
                          name: translate(
                            "resources.project-details.fields.ndp_type.priority"
                          ),
                        },
                      ]}
                      options={{ fullWidth: "true" }}
                      variant="outlined"
                      margin="none"
                    />
                  </CustomInput>
                )}
                {formData && formData.in_ndp && (
                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project-details.fields.ndp_number"
                    }
                  >
                    <SelectInput
                      options={{ fullWidth: "true" }}
                      label={translate(
                        "resources.project-details.fields.ndp_number"
                      )}
                      source="ndp_number"
                      choices={generateChoices(ndpNumbers)}
                      validate={checkRequired("ndp_number")}
                      variant="outlined"
                      margin="none"
                    />
                  </CustomInput>
                )}
                {formData &&
                  formData.in_ndp &&
                  formData.ndp_type === "CORE" && (
                    <Fragment>
                      <CustomInput
                        tooltipText={
                          "tooltips.resources.project-details.fields.ndp_name"
                        }
                        fullWidth
                      >
                        <TextInput
                          label={translate(
                            "resources.project-details.fields.ndp_name"
                          )}
                          source="ndp_name"
                          variant="outlined"
                          margin="none"
                        />
                      </CustomInput>
                      <CustomInput
                        tooltipText={
                          "tooltips.resources.project-details.fields.ndp_page_no"
                        }
                        fullWidth
                      >
                        <TextInput
                          label={translate(
                            "resources.project-details.fields.ndp_page_no"
                          )}
                          source="ndp_page_no"
                          validate={number()}
                          variant="outlined"
                          margin="none"
                        />
                      </CustomInput>
                      <CustomInput
                        tooltipText={
                          "tooltips.resources.project-details.fields.ndp_focus_area.title"
                        }
                        bool
                      >
                        <SelectInput
                          label={translate(
                            "resources.project-details.fields.ndp_focus_area.title"
                          )}
                          source="ndp_focus_area"
                          choices={generateChoices(focusAreas)}
                          options={{ fullWidth: "true" }}
                          variant="outlined"
                          margin="none"
                        />
                      </CustomInput>
                      <CustomInput
                        tooltipText={
                          "tooltips.resources.project-details.fields.ndp_intervention"
                        }
                        fullWidth
                      >
                        <TextInput
                          label={translate(
                            "resources.project-details.fields.ndp_intervention"
                          )}
                          source="ndp_intervention"
                          variant="outlined"
                          margin="none"
                        />
                      </CustomInput>
                      {checkFeature("has_ibp_fields") && (
                        <CustomInput
                          tooltipText={
                            "tooltips.resources.project-details.fields.ndp_intervention"
                          }
                          fullWidth
                        >
                          <SelectArrayInput
                            label={translate(
                              "resources.project-details.fields.ndp_intervention"
                            )}
                            source="intervention_ids"
                            choices={interventions}
                            options={{ fullWidth: "true" }}
                            variant="outlined"
                            margin="none"
                          />
                        </CustomInput>
                      )}
                    </Fragment>
                  )}
                {formData &&
                  formData.in_ndp &&
                  formData.ndp_type === "PRIORITY" && (
                    <Fragment>
                      <CustomInput
                        tooltipText={
                          "tooltips.resources.project-details.fields.ndp_focus_area.title"
                        }
                        bool
                      >
                        <SelectInput
                          label={translate(
                            "resources.project-details.fields.ndp_focus_area.title"
                          )}
                          source="ndp_focus_area"
                          choices={[
                            {
                              id: "wealth_creation",
                              name: translate(
                                "resources.project-details.fields.ndp_focus_area.wealth_creation"
                              ),
                            },
                            {
                              id: "inclusive_growth",
                              name: translate(
                                "resources.project-details.fields.ndp_focus_area.inclusive_growth"
                              ),
                            },
                            {
                              id: "competitiveness",
                              name: translate(
                                "resources.project-details.fields.ndp_focus_area.competitiveness"
                              ),
                            },
                          ]}
                          options={{ fullWidth: "true" }}
                          variant="outlined"
                          margin="none"
                        />
                      </CustomInput>
                      {/* Benard commented out */}
                      {/* <CustomInput
                        tooltipText={
                          "tooltips.resources.project-details.fields.ndp_intervention"
                        }
                        fullWidth
                      >
                        <TextInput
                          label={translate(
                            "resources.project-details.fields.intervention"
                          )}
                          source="ndp_intervention"
                          variant="outlined"
                          margin="none"
                        />
                      </CustomInput> */}
                      {checkFeature("has_ibp_fields") && (
                        <CustomInput
                          tooltipText={
                            "tooltips.resources.project-details.fields.ndp_intervention"
                          }
                          fullWidth
                        >
                          <SelectArrayInput
                            label={translate(
                              "resources.project-details.fields.ndp_intervention"
                            )}
                            source="intervention_ids"
                            choices={interventions}
                            options={{ fullWidth: "true" }}
                            variant="outlined"
                            margin="none"
                          />
                        </CustomInput>
                      )}
                    </Fragment>
                  )}
                {formData && !formData.in_ndp && (
                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project-details.fields.ndp_strategic_directives"
                    }
                    bool
                  >
                    <SelectInput
                      label={translate(
                        "resources.project-details.fields.ndp_strategic_directives"
                      )}
                      source="ndp_strategic_directives"
                      choices={OTHER_PLANS}
                      options={{ fullWidth: "true" }}
                      variant="outlined"
                      margin="none"
                      style={{ width: 250 }}
                    />
                  </CustomInput>
                )}
              </Fragment>
            )}
            {checkFeature("has_strategic_alignment", formData.phase_id) && (
              <CustomInput
                tooltipText={
                  "tooltips.resources.project-details.fields.ndp_plan_details"
                }
                fullWidth
              >
                <CustomTextArea
                  source="ndp_plan_details"
                  formData={formData}
                  validate={checkRequired("ndp_plan_details")}
                  isRequired={Boolean(checkRequired("ndp_plan_details"))}
                  label={translate(
                    "resources.project-details.fields.ndp_plan_details"
                  )}
                  {...props}
                />
              </CustomInput>
            )}
          </Fragment>
        );
      }}
    </FormDataConsumer>
  );
}

export default StrategicAlignment;
