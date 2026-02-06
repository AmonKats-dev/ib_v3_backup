import {
  Button,
  makeStyles,
  Step,
  StepLabel,
  Stepper,
  Tooltip,
  Typography,
  Card,
} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import lodash from "lodash";
import moment from "moment";
import React, { useState } from "react";
import {
  ArrayInput,
  DateInput,
  FormDataConsumer,
  maxLength,
  number,
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
import {
  commasFormatter,
  commasParser,
  costSumFormatter,
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
import HelpOutline from "@material-ui/icons/HelpOutline";

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
  tooltipItem: {
    margin: "5px 0px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tooltipItemKey: {
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
}));

function ProjectToolbar(props) {
  const { values } = useFormState();
  const translate = useTranslate();
  const steps = [0, 1];
  const refresh = useRefresh();

  const handleBack = () => {
    window.scrollTo(0, 0);

    props.setActiveStep(props.activeStep - 1 !== 0 ? props.activeStep - 1 : 0);
  };

  const handleNext = () => {
    window.scrollTo(0, 0);

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
    props.save(values, `/cost-plans/${props.record.id}/show`);
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
      {props.activeStep === steps.length - 1 ? null : (
        <Button
          style={{ margin: "0 5px" }}
          variant="contained"
          color="primary"
          onClick={handleNext}
        >
          {translate("buttons.next")}
        </Button>
      )}
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

const CostPlansEditForm = ({ projectDetails, project, ...props }) => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Activities", "Costs"];
  const classes = useStyles();
  const refresh = useRefresh();
  const translate = useTranslate();
  // const dataProvider = useDataProvider();
  // const [details, setDetails] = React.useState(null);

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

  //Amon
  const GetTitle = () => {
    return (
      <h1 style={{ width: "100%" }}>
        {projectDetails &&
          projectDetails.project &&
          `${projectDetails.project.code} - ${projectDetails.project.name}`}
      </h1>
    );
  };

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
                      zIdex: 1,
                    }}
                  >
                    <table></table>
                    {/* <h2>
                      Fiscal Year:{" "}
                      {getFiscalYearValueFromYear(formData.year).name}
                    </h2> */}
                    <h3 className={classes.tooltipItem}>
                      <span className={classes.tooltipItemKey}>
                        Planned Value:
                        <Tooltip
                          title={
                            "This represents expected periodic project execution in terms of Project Spend/Disbursement determined at the Project start."
                          }
                          placement="right"
                        >
                          <HelpOutline style={{ fontSize: 16 }} />
                        </Tooltip>
                      </span>
                      <span>{costSumFormatter(getTotalCost())}</span>
                    </h3>
                    <h3 className={classes.tooltipItem}>
                      <span className={classes.tooltipItemKey}>
                        Earned Value:{" "}
                        <Tooltip
                          title={
                            "This represents the actual project spent/disbursement that has been achieved at any point in time."
                          }
                          placement="right"
                        >
                          <HelpOutline style={{ fontSize: 16 }} />
                        </Tooltip>{" "}
                      </span>
                      <span
                        style={{
                          float: "right",
                          marginLeft: "10px",
                        }}
                      >
                        {costSumFormatter(getTotalCostME())}
                      </span>
                    </h3>
                    <h3 className={classes.tooltipItem}>
                      <span className={classes.tooltipItemKey}>
                        Ceiling available :{" "}
                        <Tooltip
                          title={
                            "This is the maximum budget for a given project"
                          }
                          placement="right"
                        >
                          <HelpOutline style={{ fontSize: 16 }} />
                        </Tooltip>{" "}
                      </span>
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
                    <h3 className={classes.tooltipItem}>
                      <span className={classes.tooltipItemKey}>
                        Planned expenditure:{" "}
                        <Tooltip
                          title={
                            "This is the amount planned to be spent on the given activity."
                          }
                          placement="right"
                        >
                          <HelpOutline style={{ fontSize: 16 }} />
                        </Tooltip>{" "}
                      </span>
                      <span
                        style={{
                          float: "right",
                          marginLeft: "10px",
                        }}
                      >
                        {costSumFormatter(getTotalFormCost(formData))}
                      </span>
                    </h3>
                    <h3 className={classes.tooltipItem}>
                      <span className={classes.tooltipItemKey}>
                        Balance:{" "}
                        <Tooltip
                          title={
                            "This represents the actual project spent/disbursement that has been achieved at any point in time."
                          }
                          placement="right"
                        >
                          <HelpOutline style={{ fontSize: 16 }} />
                        </Tooltip>
                      </span>
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
                          {/* <TextInput
                            validate={[required()]}
                            source={getSource("procurement_method")}
                            label={translate(
                              "resources.activities.fields.procurement_method"
                            )}
                            variant="outlined"
                            margin="none"
                          /> */}
                          <SelectInput
                            options={{ fullWidth: "true" }}
                            validate={[required()]}
                            source={getSource("procurement_method")}
                            label={translate(
                              "resources.activities.fields.procurement_method"
                            )}
                            choices={[
                              {
                                id: "Indirect procurement",
                                name: "Indirect procurement",
                              },
                              {
                                id: "Direct procurement",
                                name: "Direct procurement",
                              },
                              {
                                id: "Services procurement",
                                name: "Services procurement",
                              },
                            ]}
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

    if (project?.budget_allocation) {
      totalCost +=
        parseFloat(
          project?.budget_allocation?.gov?.[props.record.year + "y"] || 0
        ) +
        parseFloat(
          project?.budget_allocation?.donor?.[props.record.year + "y"] || 0
        );
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

  return (
    <SimpleForm
      {...props}
      toolbar={
        <ProjectToolbar
          setActiveStep={setActiveStep}
          activeStep={activeStep}
          {...props}
        />
      }
      sanitizeEmptyValues={false}
    >
      {/* Amon */}
      <GetTitle />

      <FormDataConsumer>
        {({ getSource, scopedFormData, formData, ...rest }) => {
          return steps && steps.length > 1 ? (
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                const props = {};
                const labelProps = {};

                return (
                  <Step
                    key={label}
                    {...props}
                    onClick={handleStep(index, formData)}
                  >
                    <StepLabel {...labelProps}>{label}</StepLabel>
                    {index === activeStep ? (
                      <div className={classes.activeStep}></div>
                    ) : null}
                  </Step>
                );
              })}
            </Stepper>
          ) : null;
        }}
      </FormDataConsumer>
      <div style={{ width: "max-content", minWidth: 755, padding: "0px 25px" }}>
        <div className="sampletitle">{getStepContent(activeStep)}</div>
      </div>
    </SimpleForm>
  );
};

export default CostPlansEditForm;
