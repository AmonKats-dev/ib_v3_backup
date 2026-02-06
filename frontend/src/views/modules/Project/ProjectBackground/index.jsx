import { FormDataConsumer, Labeled, useTranslate, required } from "react-admin";
import React, { Fragment } from "react";

import CustomInput from "../../../components/CustomInput";
import CustomTextArea from "../../../components/CustomTextArea";
import { checkFeature } from "../../../../helpers/checkPermission";
import useCheckFeature from "../../../../hooks/useCheckFeature";
import { checkRequired } from "../../../resources/Projects/validation";

function ProjectBackground(props) {
  const translate = useTranslate();
  const hasPimisFields = useCheckFeature("has_pimis_fields");
  const hasPimisClimateRisksTable = useCheckFeature(
    "has_pimis_climate_risks_table",
    props.record.phase_id
  );
  //TODO change phase number dependency
  return (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, ...rest }) => {
        return (
          <Fragment>
            {formData &&
              checkFeature(
                "project_implementing_strategies_show",
                formData.phase_id
              ) && (
                <Fragment>
                  <h2>{translate("titles.implementing_strategies")}</h2>
                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project-details.fields.sustainability_plan"
                    }
                    textArea
                    fullWidth
                  >
                    <CustomTextArea
                      source="sustainability_plan"
                      label={translate(
                        "resources.project-details.fields.sustainability_plan"
                      )}
                      validate={checkRequired("sustainability_plan")}
                      isRequired={Boolean(checkRequired("sustainability_plan"))}
                      formData={formData}
                      {...props}
                    />
                  </CustomInput>
                </Fragment>
              )}
            {hasPimisFields ? (
              hasPimisClimateRisksTable ? null : (
                <CustomInput
                  tooltipText={
                    "tooltips.resources.project-details.fields.situation_analysis"
                  }
                  textArea
                  fullWidth
                >
                  <CustomTextArea
                    source="situation_analysis"
                    isRequired={Boolean(checkRequired("situation_analysis"))}
                    validate={checkRequired("situation_analysis")}
                    formData={formData}
                    label={translate(
                      "resources.project-details.fields.situation_analysis"
                    )}
                    {...props}
                  />
                </CustomInput>
              )
            ) : null}
            {!hasPimisFields ? (
              <CustomInput
                tooltipText={
                  "tooltips.resources.project-details.fields.situation_analysis"
                }
                textArea
                fullWidth
              >
                <CustomTextArea
                  label={translate(
                    "resources.project-details.fields.situation_analysis"
                  )}
                  isRequired={Boolean(checkRequired("situation_analysis"))}
                  source="situation_analysis"
                  validate={checkRequired("situation_analysis")}
                  formData={formData}
                  {...props}
                />
              </CustomInput>
            ) : null}

            <CustomInput
              tooltipText={
                "tooltips.resources.project-details.fields.problem_statement"
              }
              textArea
              fullWidth
            >
              <CustomTextArea
                label={translate(
                  "resources.project-details.fields.problem_statement"
                )}
                source="problem_statement"
                isRequired={Boolean(checkRequired("problem_statement"))}
                validate={checkRequired("problem_statement")}
                formData={formData}
                {...props}
              />
            </CustomInput>

            <CustomInput
              tooltipText={
                "tooltips.resources.project-details.fields.problem_cause"
              }
              textArea
              fullWidth
            >
              <CustomTextArea
                label={translate(
                  "resources.project-details.fields.problem_cause"
                )}
                source="problem_cause"
                validate={checkRequired("problem_cause")}
                isRequired={Boolean(checkRequired("problem_cause"))}
                formData={formData}
                {...props}
              />
            </CustomInput>

            <CustomInput
              tooltipText={
                "tooltips.resources.project-details.fields.problem_effects"
              }
              textArea
              fullWidth
            >
              <CustomTextArea
                label={translate(
                  "resources.project-details.fields.problem_effects"
                )}
                source="problem_effects"
                isRequired={Boolean(checkRequired("problem_effects"))}
                validate={checkRequired("problem_effects")}
                formData={formData}
                {...props}
              />
            </CustomInput>

            <CustomInput
              tooltipText={
                "tooltips.resources.project-details.fields.justification"
              }
              textArea
              fullWidth
            >
              <CustomTextArea
                label={translate(
                  "resources.project-details.fields.justification"
                )}
                isRequired={Boolean(checkRequired("justification"))}
                source="justification"
                validate={checkRequired("justification")}
                formData={formData}
                {...props}
              />
            </CustomInput>

            {formData &&
              checkFeature("has_behaviour_form_fields", formData.phase_id) && (
                <>
                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project-details.fields.procurement_plan_description"
                    }
                    textArea
                    fullWidth
                  >
                    <CustomTextArea
                      label={translate(
                        "resources.project-details.fields.procurement_plan_description"
                      )}
                      source="procurement_plan_description"
                      formData={formData}
                      validate={checkRequired("procurement_plan_description")}
                      isRequired={Boolean(checkRequired("procurement_plan_description"))}
                      {...props}
                    />
                  </CustomInput>
                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project-details.fields.work_plan_description"
                    }
                    textArea
                    fullWidth
                  >
                    <CustomTextArea
                      label={translate(
                        "resources.project-details.fields.work_plan_description"
                      )}
                      source="work_plan_description"
                      formData={formData}
                      validate={checkRequired("work_plan_description")}
                      isRequired={Boolean(checkRequired("work_plan_description"))}
                      {...props}
                    />
                  </CustomInput>
                </>
              )}

            {formData && checkFeature("has_pimis_fields", formData.phase_id) && (
              <Fragment>
                {checkFeature(
                  "show_pimis_risk_assessment_table",
                  formData.phase_id
                ) ? null : (
                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project-details.fields.risk_assessment"
                    }
                    textArea
                    fullWidth
                  >
                    <CustomTextArea
                      label={translate(
                        "resources.project-details.fields.risk_assessment"
                      )}
                      source="risk_assessment"
                      isRequired={Boolean(checkRequired("risk_assessment"))}
                      validate={checkRequired("risk_assessment")}
                      formData={formData}
                      {...props}
                    />
                  </CustomInput>
                )}

                <CustomInput
                  tooltipText={
                    "tooltips.resources.project-details.fields.me_strategies"
                  }
                  textArea
                  fullWidth
                >
                  <CustomTextArea
                    label={translate(
                      "resources.project-details.fields.me_strategies"
                    )}
                    source="me_strategies"
                    validate={checkRequired("me_strategies")}
                    isRequired={Boolean(checkRequired("me_strategies"))}
                    formData={formData}
                    {...props}
                  />
                </CustomInput>
                <CustomInput
                  tooltipText={
                    "tooltips.resources.project-details.fields.governance"
                  }
                  textArea
                  fullWidth
                >
                  <CustomTextArea
                    label={translate(
                      "resources.project-details.fields.governance"
                    )}
                    source="governance"
                    isRequired={Boolean(checkRequired("governance"))}
                    validate={checkRequired("me_strategies")}
                    formData={formData}
                    {...props}
                  />
                </CustomInput>
              </Fragment>
            )}
          </Fragment>
        );
      }}
    </FormDataConsumer>
  );
}

export default ProjectBackground;
