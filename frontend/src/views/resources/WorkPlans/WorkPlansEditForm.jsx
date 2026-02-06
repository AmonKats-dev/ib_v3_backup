import {
  Button,
  makeStyles,
  Step,
  StepLabel,
  Stepper,
} from "@material-ui/core";
import lodash from "lodash";
import moment from "moment";
import React, { useState } from "react";
import {
  ArrayInput,
  DateInput,
  FormDataConsumer,
  maxLength,
  number,
  ReferenceInput,
  required,
  SelectArrayInput,
  SelectInput,
  SimpleForm,
  SimpleFormIterator,
  TextInput,
  Toolbar,
  useRefresh,
  useTranslate,
} from "react-admin";
import { useFormState } from "react-final-form";
import { DEFAULT_SORTING, FUND_BODY_TYPES } from "../../../constants/common";
import {
  commasFormatter,
  commasParser,
  costSumFormatter,
  generateChoices,
} from "../../../helpers";
import { checkFeature } from "../../../helpers/checkPermission";
import {
  getCalendarYearsRangeForIntervals,
  getFiscalYearsRange,
  getFiscalYearValueFromYear,
} from "../../../helpers/formatters";
import CustomInput from "../../components/CustomInput";
import CustomTextArea from "../../components/CustomTextArea";
import OrganisationalStructure from "../../modules/OrganisationalStructure";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: "0 5px",
  },
  activeStep: {
    width: "100%",
    height: 2,
    marginTop: 10,
    backgroundColor: "#3f51b5",
    position: "absolute",
  },
  disabled: {
    color: "#000 !important",
    pointerEvents: "none",
    "& .MuiStepIcon-completed": {
      color: "#e0e0e0 !important",
      pointerEvents: "none",
    },
  },
}));

function ProjectToolbar(props) {
  const { values } = useFormState();
  const translate = useTranslate();
  const steps = [0, 1];
  const refresh = useRefresh();

  const handleBack = () => {
    props.setActiveStep(props.activeStep - 1 !== 0 ? props.activeStep - 1 : 0);
  };

  const handleNext = () => {
    const currentStep = props.activeStep + 1;
    props.setActiveStep(currentStep);

    if (currentStep === steps.length) {
      props.handleSubmit();
      refresh();
    } else {
      props.handleSubmitWithRedirect(false);
      refresh();
    }
  };

  const handleSave = () => {
    props.save(values, `/cost-plans/${props.project?.id}/show`);
  };

  return (
    <Toolbar>
      <Button
        style={{ margin: "0 5px" }}
        variant="outlined"
        disabled={props.activeStep === 0}
        onClick={handleBack}
      >
        {translate("buttons.back")}
      </Button>
      <Button
        style={{ margin: "0 5px" }}
        color="primary"
        variant="contained"
        onClick={handleSave}
      >
        {translate("buttons.save_exit")}
      </Button>
    </Toolbar>
  );
}

const WorkPlansEditForm = ({ projectDetails, project, ...props }) => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Activities", "Costs"];
  const classes = useStyles();
  const refresh = useRefresh();
  const translate = useTranslate();

  function getYearsFromCurrent() {
    const currentYear = moment().startOf("year");
    const nextYear = currentYear.clone().add(1, "years");

    return [
      {
        id: moment(getFiscalYearValueFromYear(currentYear).id).format("YYYY"),
        name: getFiscalYearValueFromYear(currentYear).name,
      },
      {
        id: moment(getFiscalYearValueFromYear(nextYear).id).format("YYYY"),
        name: getFiscalYearValueFromYear(nextYear).name,
      },
    ];
  }

  function getDatesForRange() {
    if (!projectDetails) return [];

    return checkFeature("project_dates_fiscal_years")
      ? getFiscalYearsRange(projectDetails.start_date, projectDetails.end_date)
      : getCalendarYearsRangeForIntervals(
          projectDetails.start_date,
          projectDetails.end_date
        );
  }

  const handleStep = (step, formData) => () => {
    setActiveStep(step);
    props.save(formData, false);
    refresh();
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <ArrayInput source="cost_plan_activities" label={false}>
            <SimpleFormIterator>
              <FormDataConsumer>
                {({ getSource, scopedFormData, formData, ...rest }) => {
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

                          {projectDetails && (
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
                                  projectDetails &&
                                  projectDetails.outputs &&
                                  projectDetails.outputs.map((item) => {
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
                          )}
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
        );
      case 1:
        return (
          <>
            <FormDataConsumer>
              {({ getSource, scopedFormData, formData, ...rest }) => {
                return (
                  <div
                    style={{
                      position: "fixed",
                      bottom: 100,
                      right: 180,
                      padding: "10px",
                      outline: "1px solid #bdbdbd",
                      borderRadius: "4px",
                      backgroundColor: "#fff",
                    }}
                  >
                    <table></table>
                    {/* <h2>
                      Fiscal Year:{" "}
                      {getFiscalYearValueFromYear(formData.year).name}
                    </h2> */}
                    <h3 style={{ margin: "5px 0px" }}>
                      <span>Planned Value: </span>
                      <span
                        style={{
                          float: "right",
                          marginLeft: "10px",
                        }}
                      >
                        {costSumFormatter(getTotalCost())}
                      </span>
                    </h3>
                    <h3 style={{ margin: "5px 0px" }}>
                      <span>Earned Value: </span>
                      <span
                        style={{
                          float: "right",
                          marginLeft: "10px",
                        }}
                      >
                        {costSumFormatter(getTotalCostME())}
                      </span>
                    </h3>
                    <h3 style={{ margin: "5px 0px" }}>
                      <span>Ceiling available : </span>
                      <span
                        style={{
                          float: "right",
                          marginLeft: "10px",
                          color:
                            getTotalCost() - getTotalCostME() < 0
                              ? "red"
                              : "black",
                        }}
                      >
                        {costSumFormatter(getTotalCost() - getTotalCostME())}
                      </span>
                    </h3>
                    <h3 style={{ margin: "5px 0px" }}>
                      <span>Planned expenditure: </span>
                      <span
                        style={{
                          float: "right",
                          marginLeft: "10px",
                        }}
                      >
                        {costSumFormatter(getTotalFormCost(formData))}
                      </span>
                    </h3>
                    <h3 style={{ margin: "5px 0px" }}>
                      <span>Balance: </span>
                      <span
                        style={{
                          float: "right",
                          marginLeft: "10px",
                          color:
                            getTotalCost() -
                              getTotalCostME() -
                              getTotalFormCost(formData) <
                            0
                              ? "red"
                              : "black",
                        }}
                      >
                        {costSumFormatter(
                          getTotalCost() -
                            getTotalCostME() -
                            getTotalFormCost(formData)
                        )}
                      </span>
                    </h3>
                  </div>
                );
              }}
            </FormDataConsumer>

            <br />
            {/* <SelectInput
              source="year"
              validate={required()}
              variant="outlined"
              margin="none"
              choices={getYearsFromCurrent()}
              options={{ fullWidth: true }}
              disabled
            /> */}
            <ArrayInput source="cost_plan_items" label={false}>
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
                                  return (
                                    item && {
                                      id: item.id,
                                      name: item.name,
                                    }
                                  );
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
          </>
        );
      default:
        return null;
    }
  }

  function getTotalCost() {
    let totalCost = 0;

    if (project.budget_allocation) {
      totalCost +=
        parseFloat(project.budget_allocation.gov[props.record.year + "y"]) +
        parseFloat(project.budget_allocation.donor[props.record.year + "y"]);
    }

    return totalCost;
  }

  function getTotalCostME() {
    let totalCost = 0;

    const meReport =
      lodash.find(
        projectDetails.me_reports,
        (item) =>
          Number(item.year) === Number(props.record.year) &&
          item.report_status === "COMPLETED"
      ) || projectDetails.me_reports[0];

    meReport &&
      meReport.me_activities.forEach((activity) => {
        totalCost += parseFloat(activity.financial_execution);
      });

    return totalCost;
  }

  function getTotalFormCost(data) {
    let totalCost = 0;

    data &&
      data.cost_plan_items &&
      data.cost_plan_items.forEach((item) => {
        if (item && item.amount) {
          totalCost += parseFloat(item.amount);
        }
      });

    return totalCost;
  }

  const generateFundBody = (scopedFormData) => {
    if (scopedFormData) {
      if (Number(scopedFormData.fund_id) === 1) {
        return generateChoices(FUND_BODY_TYPES).filter(
          (item) => Number(item.id) === 3
        );
      }
      if (
        Number(scopedFormData.fund_id) === 1 ||
        Number(scopedFormData.fund_id) === 2
      ) {
        return generateChoices(FUND_BODY_TYPES).filter(
          (item) => Number(item.id) === 0 || Number(item.id) === 3
        );
      }
    }
    return generateChoices(FUND_BODY_TYPES).filter(
      (item) => Number(item.id) === 1 || Number(item.id) === 2
    );
  };

  const hasSelectedGoJ = (scopedFormData) => {
    if (scopedFormData) {
      if (Number(scopedFormData.fund_id) === 1) {
        scopedFormData.fund_body_type = "";
        return true;
      }
    }
    return false;
  }; // home / project / workplan

  const redirectEdit = (basePath, id, data) => {
    return `/cost-plans/${project?.id}/show2`;
  };

  return (
    <SimpleForm
      {...props}
      toolbar={
        <ProjectToolbar
          {...props}
          setActiveStep={setActiveStep}
          activeStep={activeStep}
          project={project}
        />
      }
      sanitizeEmptyValues={false}
      redirect={"list"}
    >
      <ArrayInput source="cost_plan_items" label={false}>
        <SimpleFormIterator>
          <FormDataConsumer>
            {({ getSource, scopedFormData, formData, ...rest }) => {
              if (formData) {
                formData.year = moment().format("YYYY");
                formData.project_detail_id = projectDetails?.id;
              }

              return (
                <div>
                  <h3>Select Activity</h3>
                  <SelectInput
                    options={{ fullWidth: "true" }}
                    validate={[required()]}
                    label={translate(
                      "resources.activities.fields.work_plan_activities"
                    )}
                    source={getSource("activity_id")}
                    choices={
                      projectDetails
                        ? projectDetails.activities.map((item) => {
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

                  {/* <OrganisationalStructure
                      {...props}
                      source={getSource("fund_id")}
                      config="fund_config"
                      reference="funds"
                      field={getSource("fund")}
                      isRequired
                      basePath="/cost-reports"
                    /> */}
                  <>
                    <ReferenceInput
                      filter={{
                        not_ids: formData?.proposed_funding_source
                          ?.map((item) => item?.fund_id)
                          ?.filter((item) => item !== scopedFormData?.fund_id),
                      }}
                      sort={DEFAULT_SORTING}
                      perPage={-1}
                      source={getSource("fund_id")}
                      reference="funds"
                      allowEmpty
                      label={translate(
                        `resources.activities.fields.investments.fields.fund_id`
                      )}
                    >
                      <SelectInput
                        options={{ fullWidth: true }}
                        fullWidth
                        optionText="name"
                        variant="outlined"
                        margin="none"
                      />
                    </ReferenceInput>
                    <CustomInput
                      fullWidth
                      tooltipText={
                        "tooltips.resources.project-details.fields.fund_body_type"
                      }
                    >
                      <SelectInput
                        options={{ fullWidth: "true" }}
                        label={translate(
                          "resources.project-details.fields.fund_body_type"
                        )}
                        source={getSource("fund_body_type")}
                        choices={generateFundBody(scopedFormData)}
                        // validate={[required()]}
                        variant="outlined"
                        margin="none"
                        disabled={hasSelectedGoJ(scopedFormData)}
                      />
                    </CustomInput>
                  </>

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
                    tooltipText={"tooltips.resources.activities.fields.amount"}
                    fullWidth
                  >
                    <TextInput
                      validate={[required(), number()]}
                      source={getSource("amount")}
                      label={translate("resources.activities.fields.amount")}
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
    </SimpleForm>
  );
};

export default WorkPlansEditForm;
