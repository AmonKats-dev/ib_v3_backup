import React from "react";
import { useEffect } from "react";
import {
  Create,
  required,
  SimpleForm,
  ArrayInput,
  TextInput,
  FormDataConsumer,
  BooleanInput,
  SimpleFormIterator,
  SelectInput,
  useTranslate,
  DateInput,
  TabbedForm,
  maxLength,
  FormTab,
  SelectArrayInput,
  useDataProvider,
  number,
  useCreateController,
  useRedirect,
} from "react-admin";
import { commasFormatter, commasParser } from "../../../helpers";
import {
  checkFeature,
  useChangeField,
  useCheckPermissions,
} from "../../../helpers/checkPermission";
import { formatValuesToQuery } from "../../../helpers/dataHelpers";
import {
  getFiscalYearsRange,
  getCalendarYearsRangeForIntervals,
} from "../../../helpers/formatters";
import CustomInput from "../../components/CustomInput";
import CustomTextArea from "../../components/CustomTextArea";
import CustomToolbar from "../../components/CustomToolbar";
import OrganisationalStructure from "../../modules/OrganisationalStructure";
import { useFormState } from "react-final-form";
import moment from "moment";

const InitialFormData = ({ formData, projectDetails, ...props }) => {
  const changeYear = useChangeField({ name: "year" });
  const changeActivities = useChangeField({ name: "cost_plan_activities" });
  const changeOutputs = useChangeField({ name: "outputs" });
  const changeProjDetailsId = useChangeField({ name: "project_detail_id" });

  useEffect(() => {
    if (formData && projectDetails && !formData.cost_plan_activities) {
      changeActivities(
        projectDetails.activities.map((item) => {
          item.activity_id = item.id;
          delete item.id;

          return item;
        })
      );
      changeOutputs(projectDetails.outputs);
    }
    if (formData && !formData.year) {
      changeYear(moment().format('YYYY'));
    }
    if (formData && projectDetails && !formData.project_detail_id) {
      changeProjDetailsId(projectDetails.id);
    }
  }, [
    formData,
    projectDetails,
    changeProjDetailsId,
    changeActivities,
    changeYear,
    changeOutputs,
  ]);

  return <></>;
};

const EditFormData = ({ isSaving, onSaved, ...props }) => {
  const { values } = useFormState();
  const createControllerProps = useCreateController(props);
  const { save } = createControllerProps;
  const redirect = useRedirect();

  // useEffect(() => {
  //   if (isSaving) {
  //     save(values, false, {
  //       onSuccess: (response) => {
  //         console.log(response);
  //         onSaved();
  //         if (response && response.data) {
  //           redirect(`/cost-plans/${response.data.id}`);
  //         }
  //       },
  //     });
  //   }
  // }, [isSaving, save]);

  return <></>;
};

const CostPlansCreate = (props) => {
  const translate = useTranslate();
  const [projectDetails, setProjectDetails] = React.useState(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const dataProvider = useDataProvider();

  React.useEffect(() => {
    dataProvider
      .getOne("project-details", {
        id: props.match?.params?.projectId,
      })
      .then((resp) => {
        if (resp && resp.data) {
          setProjectDetails(formatValuesToQuery({ ...resp.data }));
        }
      });
  }, []);

  function getDatesForRange() {
    return checkFeature("project_dates_fiscal_years")
      ? getFiscalYearsRange(projectDetails.start_date, projectDetails.end_date)
      : getCalendarYearsRangeForIntervals(
          projectDetails.start_date,
          projectDetails.end_date
        );
  }

  const handleSave = () => {
    setIsSaving(true);
  };

  const handleSavedOk = () => {
    setIsSaving(false);
  };

  const redirectEdit = (basePath, id, data) => {
    return `/cost-plans/${data.id || id}`;
  };

  return (
    <Create {...props} undoable={false}>
      <TabbedForm
        redirect={redirectEdit}
        toolbar={<CustomToolbar projectDetailId={props.match?.params?.projectId} />}
        syncWithLocation={false}
      >
        <FormTab label={"Activities"}>
          <FormDataConsumer>
            {({ getSource, scopedFormData, formData, ...rest }) => {
              return (
                <InitialFormData
                  formData={formData}
                  projectDetails={projectDetails}
                  {...props}
                />
              );
            }}
          </FormDataConsumer>
          <ArrayInput source="cost_plan_activities" label={false}>
            <SimpleFormIterator>
              <FormDataConsumer>
                {({ getSource, scopedFormData, formData, ...rest }) => {
                  const activityData = scopedFormData;
                  const targetYears = getDatesForRange();

                  return (
                    <React.Fragment>
                      <div className="row">
                        <div className="col-sm-6">
                          <CustomInput
                            tooltipText={
                              "tooltips.resources.activities.fields.name"
                            }
                            fullWidth
                          >
                            <TextInput
                              validate={[required(), maxLength(255)]}
                              source={getSource("name")}
                              label={translate(
                                "resources.activities.fields.name"
                              )}
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
                          </CustomInput>
                          <CustomInput
                            tooltipText={
                              "tooltips.resources.activities.fields.end_date"
                            }
                            fullWidth
                          >
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
                          </CustomInput>

                          <CustomInput
                            tooltipText={
                              "tooltips.resources.activities.fields.output_id"
                            }
                            fullWidth
                          >
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
                          </CustomInput>
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
                    </React.Fragment>
                  );
                }}
              </FormDataConsumer>
            </SimpleFormIterator>
          </ArrayInput>
        </FormTab>
        <FormTab label={"Cost Plans"} onClick={handleSave}>
          <EditFormData isSaving={isSaving} onSaved={handleSavedOk} />
          <SelectInput
            source="year"
            validate={required()}
            variant="outlined"
            margin="none"
            choices={[
              { id: 2022, name: "Current Fiscal Year" },
              { id: 2023, name: "Next Fiscal Year" },
            ]}
          />
          <ArrayInput
            source="cost_plan_items"
            label={false}
            onClick={handleSave}
          >
            <SimpleFormIterator>
              <FormDataConsumer>
                {({ getSource, scopedFormData, formData, ...rest }) => {
                  return (
                    <div>
                      <h3>Select Activity</h3>
                      <SelectInput
                        options={{ fullWidth: "true" }}
                        validate={[required()]}
                        label={translate(
                          "resources.activities.fields.cost_plan_activities"
                        )}
                        source={getSource("cost_plan_activity_id")}
                        choices={
                          formData && formData.cost_plan_activities
                            ? formData.cost_plan_activities.map((item) => {
                                return {
                                  id: item.id,
                                  name: item.name,
                                };
                              })
                            : []
                        }
                        variant="outlined"
                        margin="none"
                      />

                      <OrganisationalStructure
                        {...props}
                        source={getSource("fund_id")}
                        config="fund_config"
                        reference="funds"
                        field={getSource("fund")}
                        isRequired
                        basePath="/cost-reports"
                      />
                      <OrganisationalStructure
                        {...props}
                        source={getSource("costing_id")}
                        config="cost_config"
                        reference="costings"
                        field={getSource("costing")}
                        isRequired
                        basePath="/cost-reports"
                      />
                      <CustomInput
                        tooltipText={
                          "tooltips.resources.activities.fields.procurement_method"
                        }
                        fullWidth
                      >
                        <TextInput
                          validate={[required()]}
                          source={getSource("procurement_method")}
                          label={translate(
                            "resources.activities.fields.procurement_method"
                          )}
                          variant="outlined"
                          margin="none"
                        />
                      </CustomInput>
                      <CustomInput
                        tooltipText={
                          "tooltips.resources.activities.fields.procurement_start_date"
                        }
                        fullWidth
                      >
                        <DateInput
                          validate={[required()]}
                          source={getSource("procurement_start_date")}
                          label={translate(
                            "resources.activities.fields.procurement_start_date"
                          )}
                          variant="outlined"
                          margin="none"
                        />
                      </CustomInput>
                      <CustomInput
                        tooltipText={
                          "tooltips.resources.activities.fields.contract_signed_date"
                        }
                        fullWidth
                      >
                        <DateInput
                          validate={[required()]}
                          source={getSource("contract_signed_date")}
                          label={translate(
                            "resources.activities.fields.contract_signed_date"
                          )}
                          variant="outlined"
                          margin="none"
                        />
                      </CustomInput>

                      <CustomInput
                        tooltipText={
                          "tooltips.resources.activities.fields.procurement_details"
                        }
                        fullWidth
                      >
                        <TextInput
                          validate={[required()]}
                          source={getSource("procurement_details")}
                          label={translate(
                            "resources.activities.fields.procurement_details"
                          )}
                          variant="outlined"
                          margin="none"
                        />
                      </CustomInput>
                      <CustomInput
                        tooltipText={
                          "tooltips.resources.activities.fields.amount"
                        }
                        fullWidth
                      >
                        <TextInput
                          validate={[required(), number()]}
                          source={getSource("amount")}
                          label={translate(
                            "resources.activities.fields.amount"
                          )}
                          variant="outlined"
                          margin="none"
                          format={commasFormatter}
                          parse={commasParser}
                        />
                      </CustomInput>
                    </div>
                  );
                }}
              </FormDataConsumer>
            </SimpleFormIterator>
          </ArrayInput>
        </FormTab>
      </TabbedForm>
    </Create>
  );
};

export default CostPlansCreate;
