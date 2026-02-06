import {
  ArrayInput,
  Button,
  Datagrid,
  FormDataConsumer,
  Labeled,
  ReferenceArrayInput,
  ReferenceInput,
  AutocompleteArrayInput,
  SelectArrayInput,
  SelectInput,
  SimpleFormIterator,
  TextField,
  TextInput,
  minLength,
  number,
  required,
  translate,
  maxLength,
  useQueryWithStore,
  useTranslate,
} from "react-admin";
import React, { Component, Fragment, useMemo } from "react";
import { setPopupContent, setPopupVisibility } from "../../../../../actions/ui";
import { useDispatch, useSelector } from "react-redux";

import Actions from "../Indicators/Actions";
import CustomInput from "../../../../components/CustomInput";
import CustomTextArea from "../../../../components/CustomTextArea";
import { DEFAULT_SORTING } from "../../../../../constants/common";
import { DialogActions } from "@material-ui/core";
import EditForm from "../Indicators/EditForm";
import IndicatorList from "../Indicators/IndicatorList";
import IndicatorsButton from "../Indicators/IndicatorsButton";
import InvestmentsButton from "../Costs/InvestmentsButton";
import InvestmentsList from "../Costs/InvestmentsList";
import ModalPopup from "../../../../components/ModalPopup";
import { getFiscalYearsRangeForIntervals } from "../../../../../helpers/formatters";
import getReference from "../../../../../helpers/getReference";
import lodash from "lodash";
import { useFormState } from "react-final-form";
import {
  checkFeature,
  useChangeField,
} from "../../../../../helpers/checkPermission";
import useCheckFeature from "../../../../../hooks/useCheckFeature";
import {
  getSelectedVotesForProject,
  optionRenderer,
} from "../../../../../helpers";

// const optionRenderer = (choice) => {
//   return choice
//     ? `${
//         choice.name && choice.name.length > 100
//           ? choice.name.slice(0, 100) + "..."
//           : choice.name
//       }`
//     : null;
// };
// const getSelectedVotesForProject = (formData, currentProject) => {
//   let votesList = [];
//   if (currentProject && currentProject.project_organization) {
//     votesList = checkFeature("has_ibp_fields")
//       ? lodash
//           .concat(
//             formData.implementing_agencies &&
//               formData.implementing_agencies.map(
//                 (element) => element.organization
//               )
//           )
//           .map((item) => {
//             return { id: item.id, name: item.name };
//           })
//       : lodash
//           .concat(
//             {
//               id: currentProject.project_organization.id,
//               name: currentProject.project_organization.name,
//             },
//             formData.implementing_agencies &&
//               formData.implementing_agencies.map(
//                 (element) => element.organization
//               )
//           )
//           .filter((item) => item)
//           .map((item) => {
//             return { id: item.id, name: item.name };
//           });
//   }

//   return lodash.uniqBy(votesList, (it) => it.id) || [];
// };

function Outputs({ record, ...props }) {
  const translate = useTranslate();
  const { loaded, error, data } = useQueryWithStore({
    type: "getOne",
    resource: "projects",
    payload: { id: record ? record.project_id : 0 },
  });
  const hasNdpStrategySelector = useCheckFeature("has_ndp_strategy_selector");
  const hasDefaultArrayInputValue = useCheckFeature(
    "has_default_array_input_value"
  );
  const changeOutputs = useChangeField({ name: "outputs" });
  const formValues = useFormState().values;

  useMemo(() => {
    if (hasDefaultArrayInputValue && formValues) {
      if (formValues.outputs) {
        if (formValues.outputs.length === 0) {
          changeOutputs([{}]);
        }
      } else {
        changeOutputs([{}]);
      }
    }
  }, [record]);

  return (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, ...rest }) => {
        return (
          <Fragment>
            <ArrayInput source="outputs" label={false}>
              <SimpleFormIterator>
                <FormDataConsumer>
                  {({ getSource, scopedFormData, formData, ...rest }) => (
                    <Fragment>
                      <div className="row">
                        <div className="col-sm-6 col-m-6">
                          <CustomInput
                            tooltipText={
                              "tooltips.resources.outputs.fields.name"
                            }
                            fullWidth
                          >
                            <TextInput
                              validate={[required(), maxLength(255)]}
                              variant="outlined"
                              margin="none"
                              source={getSource("name")}
                              label={translate("resources.outputs.fields.name")}
                            />
                          </CustomInput>
                          {!checkFeature("has_pimis_fields") && (
                            <CustomInput
                              tooltipText={
                                "tooltips.resources.outputs.fields.output_value"
                              }
                              fullWidth
                            >
                              <TextInput
                                source={getSource("output_value")}
                                label={translate(
                                  "resources.outputs.fields.output_value"
                                )}
                                validate={[
                                  required(),
                                  number(),
                                  maxLength(255),
                                ]}
                                variant="outlined"
                                margin="none"
                              />
                            </CustomInput>
                          )}
                          {!checkFeature("has_pimis_fields") && (
                            <CustomInput
                              tooltipText={
                                "tooltips.resources.outputs.fields.unit_id"
                              }
                              fullWidth
                            >
                              <ReferenceInput
                                validate={[required()]}
                                perPage={-1}
                                sort={DEFAULT_SORTING}
                                source={getSource("unit_id")}
                                label={translate(
                                  "resources.outputs.fields.unit_id"
                                )}
                                reference="units"
                              >
                                <SelectInput
                                  validate={[required(), number()]}
                                  options={{ fullWidth: "true" }}
                                  optionText="name"
                                  optionValue="id"
                                  variant="outlined"
                                />
                              </ReferenceInput>
                            </CustomInput>
                          )}

                          <CustomInput
                            tooltipText={
                              "tooltips.resources.outputs.fields.outcome_ids"
                            }
                            fullWidth
                          >
                            {/* TODO fix aarray display  */}
                            {checkFeature("has_pimis_fields") ? (
                              <AutocompleteArrayInput
                                margin="none"
                                variant="outlined"
                                fullWidth
                                label={translate(
                                  "resources.outputs.fields.outcome_ids"
                                )}
                                source={getSource("outcome_ids")}
                                choices={
                                  formData && formData.outcomes
                                    ? formData.outcomes
                                    : []
                                }
                                validate={required()}
                                shouldRenderSuggestions={true}
                                optionText={optionRenderer}
                              />
                            ) : (
                              <SelectArrayInput
                                validate={[required()]}
                                options={{ fullWidth: "true" }}
                                label={translate(
                                  "resources.outputs.fields.outcome_ids"
                                )}
                                source={getSource("outcome_ids")}
                                optionText={optionRenderer}
                                choices={
                                  formData && formData.outcomes
                                    ? formData.outcomes
                                    : []
                                }
                                variant="outlined"
                                margin="none"
                              />
                            )}
                          </CustomInput>

                          {checkFeature("has_pimis_fields") && (
                            <CustomInput
                              tooltipText={
                                "tooltips.resources.outputs.fields.component_id"
                              }
                              fullWidth
                            >
                              <SelectInput
                                margin="none"
                                variant="outlined"
                                fullWidth
                                label={translate(
                                  "resources.outputs.fields.component_id"
                                )}
                                source={getSource("component_id")}
                                choices={
                                  formData && formData.components
                                    ? formData.components
                                    : []
                                }
                                validate={required()}
                                optionText={optionRenderer}
                              />
                            </CustomInput>
                          )}
                          {checkFeature("has_pimis_fields") && (
                            <CustomInput
                              tooltipText={
                                "tooltips.resources.outputs.fields.subcomponent_id"
                              }
                              fullWidth
                            >
                              <SelectInput
                                disabled={!scopedFormData?.component_id}
                                margin="none"
                                variant="outlined"
                                fullWidth
                                label={translate(
                                  "resources.outputs.fields.subcomponent_id"
                                )}
                                source={getSource("subcomponent_id")}
                                choices={
                                  formData &&
                                  formData.components &&
                                  scopedFormData
                                    ? lodash.find(
                                        formData.components,
                                        (it) =>
                                          it.id === scopedFormData.component_id
                                      )?.subcomponents || []
                                    : []
                                }
                                // validate={required()}
                                optionText={optionRenderer}
                              />
                            </CustomInput>
                          )}

                          {checkFeature("has_pimis_fields") ? null : (
                            <CustomInput
                              tooltipText={
                                "tooltips.resources.outputs.fields.vote_id"
                              }
                              fullWidth
                            >
                              <SelectArrayInput
                                validate={[required()]}
                                options={{ fullWidth: "true" }}
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
                                variant="outlined"
                                margin="none"
                              />
                            </CustomInput>
                          )}
                          {hasNdpStrategySelector && (
                            <CustomInput
                              tooltipText={
                                "tooltips.resources.outputs.fields.ndp_strategy_id"
                              }
                              fullWidth
                            >
                              <ReferenceInput
                                validate={[required()]}
                                perPage={-1}
                                sort={DEFAULT_SORTING}
                                source={getSource("ndp_strategy_id")}
                                label={translate(
                                  "resources.outputs.fields.ndp_strategy_id"
                                )}
                                reference="ndp-strategies"
                                filter={{
                                  ids:
                                    formData &&
                                    formData.ndp_strategies &&
                                    formData.ndp_strategies
                                      .map(
                                        (item) => item && item.ndp_strategy_id
                                      )
                                      .join(","),
                                }}
                              >
                                <SelectInput
                                  options={{ fullWidth: "true" }}
                                  optionText="name"
                                  optionValue="id"
                                  validate={[required(), number()]}
                                  variant="outlined"
                                />
                              </ReferenceInput>
                            </CustomInput>
                          )}
                        </div>
                        <div className="col-sm-6 col-m-6">
                          <CustomInput
                            tooltipText={
                              "tooltips.resources.outputs.fields.description"
                            }
                            fullWidth
                            textArea
                          >
                            <CustomTextArea
                              label={translate(
                                "resources.outputs.fields.description"
                              )}
                              source={getSource("description")}
                              validate={[required()]}
                              isRequired
                              formData={formData}
                              {...props}
                            />
                          </CustomInput>
                        </div>
                        <br />

                        {formData &&
                          checkFeature(
                            "project_result_matrix_tech_specs_show",
                            formData.phase_id
                          ) &&
                          scopedFormData && (
                            <div className="col-sm-6 col-m-6">
                              <CustomInput
                                tooltipText={
                                  "tooltips.resources.outputs.fields.tech_specs"
                                }
                                fullWidth
                                textArea
                              >
                                <CustomTextArea
                                  source={getSource("tech_specs")}
                                  validate={[required()]}
                                  label={translate(
                                    "resources.outputs.fields.tech_specs"
                                  )}
                                  isRequired
                                  formData={formData}
                                  {...props}
                                />
                              </CustomInput>
                              <CustomInput
                                tooltipText={
                                  "tooltips.resources.outputs.fields.alternative_specs"
                                }
                                fullWidth
                                textArea
                              >
                                <CustomTextArea
                                  label={translate(
                                    "resources.outputs.fields.alternative_specs"
                                  )}
                                  source={getSource("alternative_specs")}
                                  formData={formData}
                                  isRequired
                                  validate={[required()]}
                                  {...props}
                                />
                              </CustomInput>
                            </div>
                          )}
                        {formData &&
                          checkFeature(
                            "project_result_matrix_outputs_indicators_show",
                            formData.phase_id
                          ) &&
                          scopedFormData && (
                            <Fragment>
                              <IndicatorsButton
                                type="outputs"
                                record={formData}
                                onSave={props.save}
                                source={getSource("indicators")}
                                targetYears={getFiscalYearsRangeForIntervals(
                                  record.start_date,
                                  record.end_date
                                )}
                              />

                              {scopedFormData.indicators &&
                                scopedFormData.indicators.length !== 0 && (
                                  <IndicatorList
                                    indicators={scopedFormData.indicators}
                                    type="outcomes"
                                  />
                                )}
                            </Fragment>
                          )}
                        {formData &&
                          checkFeature(
                            "project_result_matrix_outputs_investments_show",
                            formData.phase_id
                          ) &&
                          scopedFormData && (
                            <Fragment>
                              <InvestmentsButton
                                {...props}
                                record={formData}
                                type="outputs"
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
                                    type="outputs"
                                    formData={formData}
                                    investments={scopedFormData.investments}
                                  />
                                )}
                              <br />
                            </Fragment>
                          )}
                      </div>
                      <br />
                    </Fragment>
                  )}
                </FormDataConsumer>
              </SimpleFormIterator>
            </ArrayInput>
          </Fragment>
        );
      }}
    </FormDataConsumer>
  );
}

export default Outputs;
