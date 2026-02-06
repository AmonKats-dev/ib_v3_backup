import {
  ArrayInput,
  FormDataConsumer,
  BooleanInput,
  SimpleFormIterator,
  TextInput,
  number,
  required,
  maxLength,
  useQueryWithStore,
  useTranslate,
  AutocompleteArrayInput,
} from "react-admin";
import React, { Component, Fragment, useMemo } from "react";
import CustomInput from "../../../../components/CustomInput";
import CustomTextArea from "../../../../components/CustomTextArea";
import { useFormState } from "react-final-form";
import {
  checkFeature,
  useChangeField,
} from "../../../../../helpers/checkPermission";
import useCheckFeature from "../../../../../hooks/useCheckFeature";
import { Typography } from "@material-ui/core";
import {
  commasFormatter,
  commasParser,
  getSelectedVotesForProject,
  optionRenderer,
} from "../../../../../helpers";
import InvestmentsButton from "../../ResultMatrix/Costs/InvestmentsButton";
import InvestmentsList from "../../ResultMatrix/Costs/InvestmentsList";
import { getFiscalYearsRangeForIntervals } from "../../../../../helpers/formatters";
import { checkRequired } from "../../../../resources/Projects/validation";

function Components({ record, ...props }) {
  const translate = useTranslate();
  const { loaded, error, data } = useQueryWithStore({
    type: "getOne",
    resource: "projects",
    payload: { id: record ? record.project_id : 0 },
  });
  const hasDefaultArrayInputValue = useCheckFeature(
    "has_default_array_input_value"
  );
  const hasMilestoneSelector = useCheckFeature(
    "has_milestone_component_selector",
    record && record.phase_id
  );
  const changeComponents = useChangeField({ name: "components" });
  const formValues = useFormState().values;

  useMemo(() => {
    if (hasDefaultArrayInputValue && formValues) {
      if (formValues.components) {
        if (formValues.components.length === 0) {
          changeComponents([{}]);
        }
      } else {
        changeComponents([{}]);
      }
    }
  }, [record]);

  return (
    <FormDataConsumer>
      {({ ...rest }) => {
        return (
          <Fragment>
            <ArrayInput source="components" label={false}>
              <SimpleFormIterator>
                <FormDataConsumer>
                  {({ getSource, scopedFormData, formData, id, ...rest }) => {
                    if (formData.project) {
                      const index = Number(id.match(/\d+/)[0]); // "3";
                      const code =
                        index + 1 <= 9 ? `0${index + 1}` : `${index + 1}`;

                      if (!scopedFormData) {
                        scopedFormData = {};
                        scopedFormData["code"] = `${code}00`;
                      } else {
                        scopedFormData["code"] = `${code}00`;
                      }
                    }

                    return (
                      <Fragment>
                        <div className="row">
                          <div className="col-sm-6 col-m-6">
                            {hasMilestoneSelector && (
                              <h3>
                                {translate(
                                  "resources.components.fields.is_milestone"
                                )}
                              </h3>
                            )}
                            <Typography
                              variant="h4"
                              style={{ marginBottom: 10 }}
                            >
                              Component
                            </Typography>

                            {scopedFormData &&
                              scopedFormData.code &&
                              checkFeature(
                                "project_has_log_frame_data_edit",
                                formData && formData.phase_id
                              ) && <h3>Code: {scopedFormData.code}</h3>}
                            <CustomInput
                              tooltipText={
                                "tooltips.resources.components.fields.name"
                              }
                              fullWidth
                            >
                              <TextInput
                                validate={[
                                  checkRequired("components", "name"),
                                  maxLength(255),
                                ]}
                                variant="outlined"
                                margin="none"
                                source={getSource("name")}
                                label={translate(
                                  "resources.components.fields.name"
                                )}
                              />
                            </CustomInput>
                            {/* <CustomInput
                              tooltipText={
                                "tooltips.resources.components.fields.cost"
                              }
                              fullWidth
                            >
                              <TextInput
                                source={getSource("cost")}
                                label={translate(
                                  "resources.components.fields.cost"
                                )}
                                validate={[
                                  required(),
                                  number(),
                                  maxLength(255),
                                ]}
                                variant="outlined"
                                margin="none"
                                format={commasFormatter}
                                parse={commasParser}
                              />
                            </CustomInput> */}
                          </div>
                          <div className="col-sm-6 col-m-6">
                            <CustomInput
                              tooltipText={
                                "tooltips.resources.components.fields.description"
                              }
                              fullWidth
                              textArea
                            >
                              <CustomTextArea
                                label={translate(
                                  "resources.components.fields.description"
                                )}
                                source={getSource("description")}
                                validate={checkRequired(
                                  "components",
                                  "description"
                                )}
                                isRequired={Boolean(
                                  checkRequired("components", "description")
                                )}
                                formData={formData}
                                {...props}
                              />
                            </CustomInput>
                            <CustomInput
                              tooltipText={
                                "tooltips.resources.components.fields.vote_id"
                              }
                              fullWidth
                            >
                              <AutocompleteArrayInput
                                margin="none"
                                variant="outlined"
                                fullWidth
                                label={translate(
                                  "resources.outputs.fields.vote_id"
                                )}
                                source={getSource("organization_ids")}
                                choices={
                                  (formData &&
                                    getSelectedVotesForProject(
                                      formData,
                                      data
                                    )) ||
                                  []
                                }
                                validate={required()}
                                shouldRenderSuggestions={true}
                                optionText={optionRenderer}
                              />
                            </CustomInput>
                          </div>
                          <br />
                          {formData &&
                            checkFeature(
                              "project_result_matrix_components_investments_show",
                              formData.phase_id
                            ) &&
                            scopedFormData && (
                              <Fragment>
                                <InvestmentsButton
                                  {...props}
                                  record={formData}
                                  type="components"
                                  onSave={props.save}
                                  source={getSource("investments")}
                                  targetYears={getFiscalYearsRangeForIntervals(
                                    record.start_date,
                                    record.end_date
                                  )}
                                />
                                <br />
                                <br />
                                {scopedFormData &&
                                  scopedFormData.investments &&
                                  scopedFormData.investments.length !== 0 && (
                                    <InvestmentsList
                                      type="components"
                                      formData={formData}
                                      investments={scopedFormData.investments}
                                    />
                                  )}
                                <br />
                              </Fragment>
                            )}
                          <br />
                          <Typography variant="h4">Sub-Components</Typography>
                          <ArrayInput
                            source={getSource("subcomponents")}
                            label={false}
                            validate={checkRequired(
                              "components",
                              "subcomponents"
                            )}
                          >
                            <SimpleFormIterator>
                              <FormDataConsumer>
                                {({
                                  getSource,
                                  scopedFormData,
                                  formData,
                                  ...rest
                                }) => {
                                  if (scopedFormData && !scopedFormData.id) {
                                    const newId = String(new Date().getTime());
                                    scopedFormData.id = Number(
                                      newId.slice(7, newId.length)
                                    );
                                  }
                                  return (
                                    <Fragment>
                                      <div className="row">
                                        <div className="col-sm-6 col-m-6">
                                          <CustomInput
                                            tooltipText={
                                              "tooltips.resources.subcomponents.fields.name"
                                            }
                                            fullWidth
                                          >
                                            <TextInput
                                              validate={[
                                                checkRequired(
                                                  "components.subcomponents",
                                                  "name"
                                                ),
                                                maxLength(255),
                                              ]}
                                              variant="outlined"
                                              margin="none"
                                              source={getSource("name")}
                                              label={translate(
                                                "resources.subcomponents.fields.name"
                                              )}
                                            />
                                          </CustomInput>
                                        </div>
                                        <div className="col-sm-6 col-m-6">
                                          <CustomInput
                                            tooltipText={
                                              "tooltips.resources.subcomponents.fields.description"
                                            }
                                            fullWidth
                                            textArea
                                          >
                                            <CustomTextArea
                                              label={translate(
                                                "resources.subcomponents.fields.description"
                                              )}
                                              source={getSource("description")}
                                              validate={[
                                                checkRequired(
                                                  "components.subcomponents",
                                                  "description"
                                                ),
                                              ]}
                                              isRequired={Boolean(
                                                checkRequired(
                                                  "components.subcomponents",
                                                  "description"
                                                )
                                              )}
                                              formData={formData}
                                              {...props}
                                            />
                                          </CustomInput>
                                        </div>
                                      </div>
                                    </Fragment>
                                  );
                                }}
                              </FormDataConsumer>
                            </SimpleFormIterator>
                          </ArrayInput>
                        </div>
                      </Fragment>
                    );
                  }}
                </FormDataConsumer>
              </SimpleFormIterator>
            </ArrayInput>
          </Fragment>
        );
      }}
    </FormDataConsumer>
  );
}

export default Components;
