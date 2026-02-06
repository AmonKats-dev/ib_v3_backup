import React, { Fragment, useEffect } from "react";
import CustomInput from "../../../components/CustomInput";
import {
  ArrayInput,
  TextInput,
  FormDataConsumer,
  SimpleFormIterator,
  useTranslate,
  Labeled,
  SelectInput,
  required,
  minValue,
  number,
  NumberInput,
  BooleanInput,
} from "react-admin";
import moment from "moment";
import CustomTextArea from "../../../components/CustomTextArea";
import { getFiscalYearsRange } from "../../../../helpers/formatters";

function ProjectOptions(props) {
  const translate = useTranslate();
  return (
    <Fragment>
      <Fragment>
        <FormDataConsumer>
          {({ getSource, scopedFormData, formData, ...rest }) => {
            formData.default_option_name = "Do Nothing";
            return (
              <CustomInput
                tooltipText={
                  "tooltips.resources.project-details.default_option_name"
                }
                fullWidth
              >
                <TextInput
                  source={"default_option_name"}
                  variant="standard"
                  margin="none"
                  placeholder="Do Nothing"
                />
              </CustomInput>
            );
          }}
        </FormDataConsumer>

        <CustomInput
          tooltipText={
            "tooltips.resources.project-details.default_option_description"
          }
          textArea
          fullWidth
        >
          <CustomTextArea
            source={"default_option_description"}
            label={translate("resources.default_option_description")}
            isRequired
            validate={required()}
            {...props}
          />
        </CustomInput>
      </Fragment>
      <ArrayInput source="project_options" label={null} className="iterator">
        <SimpleFormIterator>
          <FormDataConsumer>
            {({ getSource, scopedFormData, formData, ...rest }) => {
              const targetYears = getFiscalYearsRange(
                props.record.start_date,
                props.record.end_date
              );
              let yearsData = [];
              let omYearsData = [];

              if (scopedFormData) {
                scopedFormData.duration =
                  moment(scopedFormData.end_date, "YYYY-MM-DD").diff(
                    moment(scopedFormData.start_date, "YYYY-MM-DD"),
                    "years"
                  ) + 1;

                for (let index = 0; index < scopedFormData.duration; index++) {
                  const year = moment(scopedFormData.start_date, "YYYY-MM-DD")
                    .add("years", index)
                    .format("YYYY");

                  yearsData.push(
                    <CustomInput
                      tooltipText={
                        "tooltips.resources.project_options.fields.capital_expenditure"
                      }
                    >
                      <TextInput
                        label={year}
                        source={getSource(
                          "capital_expenditure." + String(year) + "y"
                        )}
                        variant="outlined"
                        margin="none"
                      />
                    </CustomInput>
                  );
                }

                scopedFormData.om_duration =
                  moment(scopedFormData.om_end_date, "YYYY-MM-DD").diff(
                    moment(scopedFormData.om_start_date, "YYYY-MM-DD"),
                    "years"
                  ) + 1;

                for (
                  let index = 0;
                  index < scopedFormData.om_duration;
                  index++
                ) {
                  const year = moment(
                    scopedFormData.om_start_date,
                    "YYYY-MM-DD"
                  )
                    .add("years", index)
                    .format("YYYY");

                  omYearsData.push(
                    <CustomInput
                      tooltipText={
                        "tooltips.resources.project_options.fields.om_cost"
                      }
                      fullWidth
                    >
                      <TextInput
                        label={year}
                        variant="outlined"
                        margin="none"
                        source={getSource("om_cost." + String(year) + "y")}
                        validate={[number()]}
                      />
                    </CustomInput>
                  );
                }
              }

              return (
                <Fragment>
                  <h5>
                    <b>{scopedFormData && scopedFormData.name}</b>
                  </h5>
                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project_options.fields.name"
                    }
                    fullWidth
                  >
                    <TextInput
                      label={translate("resources.project_options.fields.name")}
                      source={getSource("name")}
                      variant="outlined"
                      margin="none"
                      validate={[required()]}
                    />
                  </CustomInput>
                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project_options.fields.description"
                    }
                    textArea
                    fullWidth
                  >
                    <CustomTextArea
                      label={translate(
                        "resources.project_options.fields.description"
                      )}
                      source={getSource("description")}
                      formData={formData}
                      isRequired
                      validate={required()}
                      {...props}
                    />
                  </CustomInput>
                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project_options.fields.swot_analysis"
                    }
                    textArea
                    fullWidth
                  >
                    <CustomTextArea
                      source={getSource("swot_analysis")}
                      formData={formData}
                      isRequired
                      validate={required()}
                      label={translate(
                        "resources.project_options.fields.swot_analysis"
                      )}
                      {...props}
                    />
                  </CustomInput>
                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project_options.fields.start_date"
                    }
                    fullWidth
                  >
                    <SelectInput
                      options={{ fullWidth: "true" }}
                      label={translate(
                        "resources.project_options.fields.start_date"
                      )}
                      source={getSource("start_date")}
                      choices={targetYears}
                      variant="outlined"
                      margin="none"
                    />
                  </CustomInput>
                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project_options.fields.end_date"
                    }
                    fullWidth
                  >
                    <SelectInput
                      options={{ fullWidth: "true" }}
                      label={translate(
                        "resources.project_options.fields.end_date"
                      )}
                      source={getSource("end_date")}
                      choices={targetYears}
                      variant="outlined"
                      margin="none"
                    />
                  </CustomInput>
                  <CustomInput
                    fullWidth
                    tooltipText={
                      "tooltips.resources.project_options.fields.duration"
                    }
                  >
                    <NumberInput
                      disabled
                      label={translate(
                        "resources.project_options.fields.duration"
                      )}
                      source={getSource("duration")}
                      step={1}
                      variant="outlined"
                      margin="none"
                      validate={[required(), minValue(0)]}
                    />
                  </CustomInput>
                  {yearsData.length > 0 ? yearsData : null}
                  <CustomInput
                    fullWidth
                    tooltipText={
                      "tooltips.resources.project_options.fields.has_omp"
                    }
                  >
                    <BooleanInput
                      label={translate(
                        "resources.project_options.fields.has_omp"
                      )}
                      source={getSource("has_omp")}
                      variant="outlined"
                      margin="none"
                      validate={[required()]}
                    />
                  </CustomInput>
                  {scopedFormData && scopedFormData.has_omp ? (
                    <Fragment>
                      <CustomInput
                        tooltipText={
                          "tooltips.resources.project_options.fields.om_start_date"
                        }
                        fullWidth
                      >
                        <SelectInput
                          options={{ fullWidth: "true" }}
                          label={translate(
                            "resources.project_options.fields.om_start_date"
                          )}
                          source={getSource("om_start_date")}
                          choices={targetYears}
                          variant="outlined"
                          margin="none"
                        />
                      </CustomInput>
                      <CustomInput
                        tooltipText={
                          "tooltips.resources.project_options.fields.om_end_date"
                        }
                        fullWidth
                      >
                        <SelectInput
                          options={{ fullWidth: "true" }}
                          label={translate(
                            "resources.project_options.fields.om_end_date"
                          )}
                          source={getSource("om_end_date")}
                          choices={targetYears}
                          variant="outlined"
                          margin="none"
                        />
                      </CustomInput>
                      <CustomInput
                        fullWidth
                        tooltipText={
                          "tooltips.resources.project_options.fields.om_duration"
                        }
                      >
                        <NumberInput
                          disabled
                          label={translate(
                            "resources.project_options.fields.om_duration"
                          )}
                          source={getSource("om_duration")}
                          step={1}
                          variant="outlined"
                          margin="none"
                          validate={[required(), minValue(0)]}
                        />
                      </CustomInput>
                      {omYearsData.length > 0 ? omYearsData : null}
                    </Fragment>
                  ) : null}
                </Fragment>
              );
            }}
          </FormDataConsumer>
        </SimpleFormIterator>
      </ArrayInput>
    </Fragment>
  );
}

export default ProjectOptions;
