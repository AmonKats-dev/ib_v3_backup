// in src/Dashboard.js
import { Grid, makeStyles, Tab, Tabs, Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import React, { Fragment } from "react";
import {
  ArrayInput,
  Edit,
  FormDataConsumer,
  required,
  SimpleForm,
  TabbedForm,
  FormTab,
  maxLength,
  SimpleFormIterator,
  TextInput,
  useDataProvider,
  useTranslate,
  SelectInput,
  SelectArrayInput,
  DateInput,
  TopToolbar,
  Button,
} from "react-admin";
import {
  commasFormatter,
  commasParser,
  costSumFormatter,
} from "../../../helpers";
import { checkFeature } from "../../../helpers/checkPermission";
import { formatValuesToQuery } from "../../../helpers/dataHelpers";
import {
  getCalendarYearsRangeForIntervals,
  getFiscalYearsRange,
  getFiscalYearsRangeForIntervals,
} from "../../../helpers/formatters";
import CustomInput from "../../components/CustomInput";
import CustomTextArea from "../../components/CustomTextArea";
import OrganisationalStructure from "../../modules/OrganisationalStructure";
import InvestmentsButton from "../../modules/Project/ResultMatrix/Costs/InvestmentsButton";
import InvestmentsList from "../../modules/Project/ResultMatrix/Costs/InvestmentsList";

const useStyles = makeStyles((theme) => ({
  topGroup: {
    display: "flex",
    justifyContent: "space-around",
  },
  title: {
    textAlign: "left",
    fontSize: "15px",
    fontWeight: "bold",
    paddingLeft: "30px",
    margin: "10px auto",
  },
  button: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 35,
    margin: 15,
    "&:hover > $buttonTitle,": {
      display: "none",
    },
    "&:hover > $actions,": {
      display: "flex",
    },
  },
  buttonTitle: {
    display: "flex",
    fontWeight: "bold",
    fontSize: "18px",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
  },
  actions: {
    display: "none",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
  },
  formProcurement: {
    display: "flex",
    flexDirection: "column",
  },
  procurementDates: {
    display: "flex",
    gap: 15,
    padding: "0 10px",
  },
}));

function Actions(props) {
  return (
    <TopToolbar>
      <Button label="Submit" />
    </TopToolbar>
  );
}
function TabContainer({ children }) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

function CostedAnnualizedPlanEdit(props) {
  const translate = useTranslate();
  const classes = useStyles();

  const [activeTab, setActiveTab] = React.useState(0);
  const [projectDetails, setProjectDetails] = React.useState(null);
  const dataProvider = useDataProvider();

  React.useEffect(() => {
    dataProvider
      .getOne("project-details", {
        id: props.match?.params?.id,
      })
      .then((resp) => {
        if (resp && resp.data) {
          setProjectDetails(
            formatValuesToQuery({ ...resp.data, cost_reports: [] })
          );
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

  function renderTabContent() {
    switch (activeTab) {
      case 0:
        return (
          <ArrayInput source="activities" label={false}>
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
                      <br />
                      {activityData &&
                        activityData.investments &&
                        activityData.investments.length !== 0 && (
                          <InvestmentsList
                            type="activities"
                            formData={activityData}
                            investments={activityData.investments}
                          />
                        )}
                      <br />
                    </React.Fragment>
                  );
                }}
              </FormDataConsumer>
            </SimpleFormIterator>
          </ArrayInput>
        );
      case 1:
        return (
          <ArrayInput source="cost_reports" label={false}>
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
                          "resources.activities.fields.start_date"
                        )}
                        source={getSource("activity_id")}
                        choices={
                          formData && formData.activities
                            ? formData.activities
                            : []
                        }
                        variant="outlined"
                        margin="none"
                      />
                      <h3>Costed annualized plan</h3>
                      <div className={classes.formProcurement}>
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
                        <div className={classes.procurementDates}>
                          <DateInput
                            validate={[required()]}
                            source={getSource("procurement_start_date")}
                            label={translate(
                              "resources.activities.fields.procurement_start_date"
                            )}
                            variant="outlined"
                            margin="none"
                          />

                          <DateInput
                            validate={[required()]}
                            source={getSource("procurement_contract_sign")}
                            label={translate(
                              "resources.activities.fields.procurement_contract_sign"
                            )}
                            variant="outlined"
                            margin="none"
                          />
                        </div>

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
                            "tooltips.resources.activities.fields.procurement_amount"
                          }
                          fullWidth
                        >
                          <TextInput
                            validate={[required()]}
                            source={getSource("procurement_amount")}
                            label={translate(
                              "resources.activities.fields.procurement_amount"
                            )}
                            variant="outlined"
                            margin="none"
                            format={commasFormatter}
                            parse={commasParser}
                          />
                        </CustomInput>
                      </div>
                    </div>
                  );
                }}
              </FormDataConsumer>
            </SimpleFormIterator>
          </ArrayInput>
        );

      default:
        return null;
    }
  }

  function handleChange(event, newValue) {
    setActiveTab(newValue);
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        {projectDetails && (
          <div style={{ padding: 33 }}>
            <Edit
              {...props}
              basePath="/project-details"
              resource="project-details"
              record={projectDetails}
              id={projectDetails.id}
              actions={<Actions />}
            >
              <SimpleForm>
                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <Typography>Select Period:</Typography>
                  <SelectInput
                    source="period"
                    validate={required()}
                    variant="outlined"
                    margin="none"
                    choices={[
                      { id: "current", name: "Current Fiscal Year" },
                      { id: "next", name: "Next Fiscal Year" },
                    ]}
                  />
                </div>
                <FormDataConsumer>
                  {({ getSource, scopedFormData, formData, ...rest }) => (
                    <>
                      <Tabs
                        value={activeTab}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant={null}
                        style={{ width: "100%" }}
                      >
                        <Tab label={"Activities"} value={0} />
                        <Tab label={"Costs"} value={1} />
                      </Tabs>
                      {/* <EditForm
                        activeTab={activeTab}
                        projectDetails={projectDetails}
                      /> */}
                      <TabContainer>{renderTabContent(activeTab)}</TabContainer>
                    </>
                  )}
                </FormDataConsumer>
                {/* <Tabs
                  value={activeTab}
                  onChange={handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant={null}
                  style={{ width: "100%" }}
                >
                  <Tab label={"Activities"} value={0} />
                  <Tab label={"Costs"} value={1} />
                </Tabs>
                <EditForm
                  activeTab={activeTab}
                  projectDetails={projectDetails}
                />
                <TabContainer>{renderTabContent(activeTab)}</TabContainer> */}
              </SimpleForm>
            </Edit>
          </div>
        )}
      </Grid>
    </Grid>
  );
}

function EditForm({ activeTab, projectDetails, ...props }) {
  const translate = useTranslate();
  const classes = useStyles();

  function getDatesForRange() {
    return checkFeature("project_dates_fiscal_years")
      ? getFiscalYearsRange(projectDetails.start_date, projectDetails.end_date)
      : getCalendarYearsRangeForIntervals(
          projectDetails.start_date,
          projectDetails.end_date
        );
  }

  function renderTabContent() {
    switch (activeTab) {
      case 0:
        return (
          <ArrayInput source="activities" label={false}>
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
                      <br />
                      {activityData &&
                        activityData.investments &&
                        activityData.investments.length !== 0 && (
                          <InvestmentsList
                            type="activities"
                            formData={activityData}
                            investments={activityData.investments}
                          />
                        )}
                      <br />
                    </React.Fragment>
                  );
                }}
              </FormDataConsumer>
            </SimpleFormIterator>
          </ArrayInput>
        );
      case 1:
        return (
          <ArrayInput source="cost_reports" label={false}>
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
                          "resources.activities.fields.start_date"
                        )}
                        source={getSource("activity_id")}
                        choices={
                          formData && formData.activities
                            ? formData.activities
                            : []
                        }
                        variant="outlined"
                        margin="none"
                      />
                      <h3>Costed annualized plan</h3>
                      <div className={classes.formProcurement}>
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
                        <div className={classes.procurementDates}>
                          <DateInput
                            validate={[required()]}
                            source={getSource("procurement_start_date")}
                            label={translate(
                              "resources.activities.fields.procurement_start_date"
                            )}
                            variant="outlined"
                            margin="none"
                          />

                          <DateInput
                            validate={[required()]}
                            source={getSource("procurement_contract_sign")}
                            label={translate(
                              "resources.activities.fields.procurement_contract_sign"
                            )}
                            variant="outlined"
                            margin="none"
                          />
                        </div>

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
                            "tooltips.resources.activities.fields.procurement_amount"
                          }
                          fullWidth
                        >
                          <TextInput
                            validate={[required()]}
                            source={getSource("procurement_amount")}
                            label={translate(
                              "resources.activities.fields.procurement_amount"
                            )}
                            variant="outlined"
                            margin="none"
                            format={commasFormatter}
                            parse={commasParser}
                          />
                        </CustomInput>
                      </div>
                    </div>
                  );
                }}
              </FormDataConsumer>
            </SimpleFormIterator>
          </ArrayInput>
        );

      default:
        return null;
    }
  }

  return (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, handleSubmit, ...rest }) => {
        return renderTabContent();
      }}
    </FormDataConsumer>
  );
}

export default CostedAnnualizedPlanEdit;
