import React, { Component, Fragment, useMemo } from "react";
import {
  ArrayInput,
  FormDataConsumer,
  SimpleFormIterator,
  Labeled,
  TextInput,
  DateInput,
  SelectArrayInput,
  SelectInput,
  useTranslate,
  SaveButton,
  Button,
  ArrayField,
  translate,
  required,
  AutocompleteArrayInput,
  maxLength,
} from "react-admin";
import CustomInput from "../../../../components/CustomInput";
import {
  getCalendarYearsRangeForIntervals,
  getFiscalYearsRange,
  getFiscalYearsRangeForIntervals,
} from "../../../../../helpers/formatters";
import CustomTextArea from "../../../../components/CustomTextArea";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";

import { useFormState } from "react-final-form";
import InvestmentsButton from "../Costs/InvestmentsButton";
import InvestmentsList from "../Costs/InvestmentsList";
import {
  checkFeature,
  useChangeField,
} from "../../../../../helpers/checkPermission";
import lodash from "lodash";
import moment from "moment/moment";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(() => ({
  list: {
    "& li": {
      display: "block",
    },
  },
}));

function Activities(props) {
  const translate = useTranslate();
  const formValues = useFormState().values;

  const changeActivities = useChangeField({ name: "activities" });

  useMemo(() => {
    if (checkFeature("has_default_array_input_value") && formValues) {
      if (formValues.activities) {
        if (formValues.activities.length === 0) {
          changeActivities([{}]);
        }
      } else {
        changeActivities([{}]);
      }
    }
  }, [props.record]);

  function getDatesForRange() {
    return checkFeature("project_dates_fiscal_years")
      ? getFiscalYearsRange(props.record.start_date, props.record.end_date)
      : getCalendarYearsRangeForIntervals(
          props.record.start_date,
          props.record.end_date
        );
  }

  const getComponentsActivities = (formData, componentId, activityId) => {
    const activities =
      formData &&
      formData.activities.map((activity) => {
        const output = lodash.find(formData.outputs, (output) => {
          return (
            activity &&
            activity.output_ids &&
            output.id === activity.output_ids[0]
          );
        });

        const component = lodash.find(formData.components, (component) => {
          return output && component.id === output.component_id;
        });

        return {
          activity_id: activity ? activity.id : "",
          output_id:
            activity && activity.output_ids ? activity.output_ids[0] : "",
          component_id: component ? component.id : "",
        };
      });
    const groupedByComponent = lodash.groupBy(activities, "component_id");
    const selComponentIdx =
      groupedByComponent && groupedByComponent[componentId]
        ? lodash.findIndex(
            groupedByComponent[componentId],
            (it) => it.activity_id === activityId
          )
        : 0;

    return selComponentIdx;
  };

  return (
    <Fragment>
      <ArrayInput source="activities" label={false}>
        <SimpleFormIterator>
          <FormDataConsumer>
            {({ getSource, scopedFormData, formData, id, ...rest }) => {
              const activityData = scopedFormData;
              const targetYears = getDatesForRange();
              const outputSelected = lodash.find(formData.outputs, (output) => {
                return (
                  scopedFormData &&
                  scopedFormData.output_ids &&
                  output.id === scopedFormData.output_ids[0]
                );
              });
              console.log(outputSelected, "outputSelected");
              const componentSelected = lodash.find(
                formData.components,
                (component) => {
                  return (
                    outputSelected &&
                    component.id === outputSelected.component_id
                  );
                }
              );

              if (
                checkFeature(
                  "project_has_log_frame_data_edit",
                  formData && formData.phase_id
                )
              ) {
                const curIdx =
                  componentSelected &&
                  scopedFormData &&
                  getComponentsActivities(
                    formData,
                    componentSelected.id,
                    scopedFormData.id
                  );

                const code =
                  curIdx + 1 <= 9 ? `0${curIdx + 1}` : `${curIdx + 1}`;

                if (!scopedFormData) {
                  scopedFormData = {};
                  scopedFormData["code"] =
                    componentSelected &&
                    `${
                      componentSelected.code &&
                      componentSelected.code.slice(
                        0,
                        componentSelected.code &&
                          componentSelected.code.length - 2
                      )
                    }${code}`;
                } else {
                  scopedFormData["code"] =
                    componentSelected &&
                    `${
                      componentSelected.code &&
                      componentSelected.code.slice(
                        0,
                        componentSelected.code.length - 2
                      )
                    }${code}`;
                }
              }

              const isValidDates = (start, end) => {
                const startDate = moment(start);
                const endDate = moment(end);
                const dateDiff = endDate.diff(startDate, "days");

                return dateDiff >= 0;
              };

              return (
                <div>
                  <div className="row">
                    <div className="col-sm-6">
                      {checkFeature(
                        "project_has_log_frame_data_edit",
                        formData && formData.phase_id
                      ) && <h3>Code: {scopedFormData.code}</h3>}

                      <CustomInput
                        tooltipText={
                          "tooltips.resources.activities.fields.name"
                        }
                        fullWidth
                      >
                        <TextInput
                          validate={[required(), maxLength(255)]}
                          source={getSource("name")}
                          label={translate("resources.activities.fields.name")}
                          variant="outlined"
                          margin="none"
                        />
                      </CustomInput>
                      <CustomInput
                        tooltipText={
                          "tooltips.resources.activities.fields.start_date"
                        }
                        fullWidth
                      >
                        {checkFeature("has_dates_activity_interval") ? (
                          <DateInput
                            validate={[required()]}
                            variant="outlined"
                            margin="none"
                            label={translate(
                              "resources.activities.fields.start_date"
                            )}
                            source={getSource("start_date")}
                            InputProps={{
                              inputProps: {
                                min: props.record?.start_date,
                                max: props.record?.end_date,
                              },
                            }}
                          />
                        ) : (
                          <SelectInput
                            options={{ fullWidth: "true" }}
                            validate={[required()]}
                            label={translate(
                              "resources.activities.fields.start_date"
                            )}
                            source={getSource("start_date")}
                            choices={targetYears}
                            variant="outlined"
                            margin="none"
                          />
                        )}
                      </CustomInput>
                      <CustomInput
                        tooltipText={
                          "tooltips.resources.activities.fields.end_date"
                        }
                        fullWidth
                      >
                        {checkFeature("has_dates_activity_interval") ? (
                          <DateInput
                            validate={[required()]}
                            variant="outlined"
                            margin="none"
                            label={translate(
                              "resources.activities.fields.end_date"
                            )}
                            source={getSource("end_date")}
                            InputProps={{
                              inputProps: {
                                min: props.record?.start_date,
                                max: props.record?.end_date,
                              },
                            }}
                          />
                        ) : (
                          <SelectInput
                            options={{ fullWidth: "true" }}
                            label={translate(
                              "resources.activities.fields.end_date"
                            )}
                            source={getSource("end_date")}
                            choices={targetYears}
                            validate={[required()]}
                            variant="outlined"
                            margin="none"
                          />
                        )}
                      </CustomInput>

                      <CustomInput
                        tooltipText={
                          "tooltips.resources.activities.fields.output_id"
                        }
                        fullWidth
                      >
                        {checkFeature("has_pimis_fields") ? (
                          <SelectInput
                            validate={[required()]}
                            options={{
                              fullWidth: "true",
                            }}
                            label={"resources.activities.fields.output_ids"}
                            source={getSource("output_ids")}
                            choices={
                              formData.outputs &&
                              formData.outputs.map((item) => {
                                const component = lodash.find(
                                  formData.components,
                                  (component) => {
                                    return (
                                      item && component.id === item.component_id
                                    );
                                  }
                                );
                                const componentName = component
                                  ? component.name
                                  : "-";

                                return {
                                  id: item.id,
                                  name: item.name + " / " + componentName,
                                };
                              })
                            }
                            variant="outlined"
                            margin="none"
                            format={(value) => [value]}
                            parse={(value) => [value]}
                            SelectProps={{
                              renderValue: () => {
                                if (outputSelected) {
                                  return `${outputSelected?.name || "-"} / ${
                                    componentSelected?.name || "-"
                                  }`;
                                }
                                return "";
                              },
                            }}
                          />
                        ) : (
                          // )
                          // : (
                          //   <AutocompleteArrayInput
                          //     margin="none"
                          //     variant="outlined"
                          //     fullWidth
                          //     label={"resources.activities.fields.output_ids"}
                          //     source={getSource("output_ids")}
                          //     choices={
                          //       formData.outputs &&
                          //       formData.outputs.map((item) => {
                          //         return {
                          //           id: item.id,
                          //           name: item.name,
                          //         };
                          //       })
                          //     }
                          //     validate={required()}
                          //     shouldRenderSuggestions={true}
                          //   />
                          // )
                          <SelectArrayInput
                            validate={[required()]}
                            options={{
                              fullWidth: "true",
                            }}
                            label={"resources.activities.fields.output_ids"}
                            source={getSource("output_ids")}
                            choices={
                              formData.outputs &&
                              formData.outputs.map((item) => {
                                return {
                                  id: item.id,
                                  name: item.name,
                                };
                              })
                            }
                            variant="outlined"
                            margin="none"
                          />
                        )}
                      </CustomInput>

                      {/* {checkFeature("has_pimis_fields") && (
                        <CustomInput
                          tooltipText={
                            "tooltips.resources.activities.fields.subcomponent_id"
                          }
                          fullWidth
                        >
                          <SelectInput
                            validate={[required()]}
                            options={{
                              fullWidth: "true",
                            }}
                            label={
                              "resources.activities.fields.subcomponent_id"
                            }
                            source={getSource("subcomponent_id")}
                            choices={componentSelected?.subcomponents || []}
                            variant="outlined"
                            margin="none"
                            // format={(value) => [value]}
                            // parse={(value) => [value]}
                            // SelectProps={{
                            //   renderValue: (value) =>
                            //     outputSelected &&
                            //     componentSelected &&
                            //     outputSelected.name +
                            //       " / " +
                            //       componentSelected.name,
                            // }}
                          />
                        </CustomInput>
                      )} */}
                    </div>
                    <div className="col-sm-6">
                      <CustomInput
                        tooltipText={
                          "tooltips.resources.activities.fields.description"
                        }
                        textArea
                      >
                        <CustomTextArea
                          source={getSource("description")}
                          validate={[required()]}
                          label={translate(
                            "resources.activities.fields.description"
                          )}
                          isRequired
                          formData={formData}
                          {...props}
                        />
                      </CustomInput>
                    </div>
                  </div>
                  <br />
                  {(checkFeature(
                    "project_has_log_frame_data_edit",
                    formData.phase_id
                  ) ||
                    checkFeature(
                      "project_result_matrix_activity_investments_show",
                      formData.phase_id
                    )) &&
                    activityData &&
                    activityData.start_date &&
                    activityData.end_date &&
                    isValidDates(
                      activityData.start_date,
                      activityData.end_date
                    ) && (
                      <InvestmentsButton
                        {...props}
                        record={formData}
                        onSave={props.save}
                        type="activities"
                        source={getSource("investments")}
                        targetYears={getFiscalYearsRangeForIntervals(
                          activityData.start_date,
                          activityData.end_date
                        )}
                      />
                    )}
                  <br />
                  <br />
                  {activityData &&
                    activityData.investments &&
                    activityData.investments.length !== 0 &&
                    isValidDates(
                      activityData.start_date,
                      activityData.end_date
                    ) && (
                      <InvestmentsList
                        type="activities"
                        formData={activityData}
                        investments={activityData.investments}
                      />
                    )}
                </div>
              );
            }}
          </FormDataConsumer>
        </SimpleFormIterator>
      </ArrayInput>
    </Fragment>
  );
}

export default Activities;
