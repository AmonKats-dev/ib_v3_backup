import React, { Fragment, useEffect, useState } from "react";
import {
  SelectInput,
  ArrayInput,
  TextInput,
  SimpleFormIterator,
  FormDataConsumer,
  useTranslate,
  Labeled,
  number,
  minValue,
  NumberInput,
  required,
  BooleanInput,
  useDataProvider,
} from "react-admin";
import { commasFormatter, commasParser } from "../../../../../helpers";
import { checkFeature } from "../../../../../helpers/checkPermission";
import CustomInput from "../../../../components/CustomInput";
import CustomTextArea from "../../../../components/CustomTextArea";
import moment from "moment";
import lodash from "lodash";
import {
  getFiscalYearsRange,
  getFiscalYearValueFromYear,
} from "../../../../../helpers/formatters";
import OMSection from "./OMSection";
import CommercialSection from "./CommercialSection";
import CustomFormIterator from "../../../../components/CustomFormIterator";
import InFormFileUploader from "../../../../components/InFormFileUploader";
import { checkRequired } from "../../../../resources/Projects/validation";

function DescriptionBlock(props) {
  const translate = useTranslate();
  const { record } = props;
  const dataProvider = useDataProvider();
  const [procurementValues, setProcurementValues] = useState([]);

  useEffect(() => {
    dataProvider
      .getListOfAll("parameters", { sort_field: "id" })
      .then((response) => {
        if (response && response.data) {
          const procurementModality = lodash.find(
            response.data,
            (it) => it.param_key === "procurement_modality"
          );
          if (procurementModality && procurementModality.param_value) {
            setProcurementValues(
              procurementModality.param_value.map((item) => ({
                id: item,
                name: item,
              }))
            );
          }
        }
      });
  }, []);

  return (
    <ArrayInput source="project_options" label={null} className="iterator">
      <CustomFormIterator
        prefix={"Option"}
        disableAdd={checkFeature(
          "project_options_disable_change",
          Number(record.phase_id)
        )}
        disableRemove={checkFeature(
          "project_options_disable_change",
          Number(record.phase_id)
        )}
      >
        <FormDataConsumer>
          {({ getSource, scopedFormData, formData, ...rest }) => {
            const targetYears = getFiscalYearsRange(
              props.record.start_date,
              props.record.end_date
            );

            let yearsData = [];

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
                      label={`${
                        getFiscalYearValueFromYear(year).name
                      } (${translate("titles.currency")})`}
                      source={getSource(
                        "capital_expenditure." + String(year) + "y"
                      )}
                      variant="outlined"
                      margin="none"
                      format={commasFormatter}
                      parse={commasParser}
                      validate={required()}
                    />
                  </CustomInput>
                );
              }
            }

            return (
              <Fragment>
                <h4>
                  <b>{scopedFormData && scopedFormData.name}</b>
                </h4>
                <CustomInput
                  tooltipText={"tooltips.resources.project_options.fields.name"}
                  fullWidth
                >
                  <TextInput
                    label={translate("resources.project_options.fields.name")}
                    source={getSource("name")}
                    variant="outlined"
                    margin="none"
                    validate={checkRequired("project_options", "name")}
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
                    {...props}
                    source={getSource("description")}
                    formData={formData}
                    validate={checkRequired("project_options", "description")}
                    isRequired
                    label={translate(
                      "resources.project_options.fields.description"
                    )}
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
                    validate={checkRequired("project_options", "swot_analysis")}
                    label={translate(
                      "resources.project_options.fields.swot_analysis"
                    )}
                    {...props}
                  />
                </CustomInput>
                <CustomInput
                  tooltipText={
                    "tooltips.resources.project_options.fields.funding_modality.title"
                  }
                  fullWidth
                >
                  <SelectInput
                    validate={checkRequired(
                      "project_options",
                      "funding_modality"
                    )}
                    variant="outlined"
                    margin="none"
                    options={{
                      fullWidth: "true",
                    }}
                    label={translate(
                      `resources.project_options.fields.funding_modality.title`
                    )}
                    source={getSource("funding_modality")}
                    choices={procurementValues}
                  />
                </CustomInput>
                {scopedFormData &&
                scopedFormData.funding_modality &&
                scopedFormData.funding_modality !==
                  "Regular GOJ Procurement" ? (
                  <Fragment>
                    <CustomInput
                      tooltipText={
                        "tooltips.resources.project_options.fields.value_for_money"
                      }
                      fullWidth
                      textArea
                    >
                      <CustomTextArea
                        source={getSource("value_for_money")}
                        isRequired={Boolean(
                          checkRequired("project_options", "value_for_money")
                        )}
                        validate={checkRequired(
                          "project_options",
                          "value_for_money"
                        )}
                        formData={formData}
                        label={translate(
                          "resources.project_options.fields.value_for_money"
                        )}
                        {...props}
                      />
                    </CustomInput>
                    <CustomInput
                      tooltipText={
                        "tooltips.resources.project_options.fields.risk_allocation"
                      }
                      textArea
                      fullWidth
                    >
                      <CustomTextArea
                        source={getSource("risk_allocation")}
                        validate={checkRequired(
                          "project_options",
                          "risk_allocation"
                        )}
                        isRequired={Boolean(
                          checkRequired("project_options", "risk_allocation")
                        )}
                        formData={formData}
                        label={translate(
                          "resources.project_options.fields.risk_allocation"
                        )}
                        {...props}
                      />
                    </CustomInput>
                    <CustomInput
                      tooltipText={
                        "tooltips.resources.project_options.fields.contract_management"
                      }
                      textArea
                      fullWidth
                    >
                      <CustomTextArea
                        label={translate(
                          "resources.project_options.fields.contract_management"
                        )}
                        source={getSource("contract_management")}
                        validate={checkRequired("project_options", "contract_management")}
                        isRequired={Boolean(checkRequired("project_options", "contract_management"))}
                        formData={formData}
                        {...props}
                      />
                    </CustomInput>
                    <CustomInput
                      tooltipText={
                        "tooltips.resources.project_options.fields.me_strategy"
                      }
                      fullWidth
                      textArea
                    >
                      <CustomTextArea
                        source={getSource("me_strategy")}
                        validate={checkRequired("project_options", "me_strategy")}
                        formData={formData}
                        isRequired={Boolean(checkRequired("project_options", "me_strategy"))}
                        label={translate(
                          "resources.project_options.fields.me_strategy"
                        )}
                        {...props}
                      />
                    </CustomInput>
                    {scopedFormData && scopedFormData.id ? (
                      <InFormFileUploader
                        meta={{ relatedField: `financial_model` }}
                        resource="project_option"
                        entityId={scopedFormData.id}
                        fileTypeId={0}
                        placeholder={translate("titles.drop_files")}
                        record={scopedFormData}
                        approvedUploading
                        onDelete={() => {}}
                        onBeforeUpload={props.onSave}
                      />
                    ) : null}
                  </Fragment>
                ) : null}
                <CustomInput
                  tooltipText={
                    "tooltips.resources.project_options.fields.start_date"
                  }
                  fullWidth
                >
                  <SelectInput
                    validate={checkRequired("project_options", "start_date")}
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
                    validate={checkRequired("project_options", "end_date")}
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
                  />
                </CustomInput>
                <p>
                  {translate(
                    "resources.project_options.fields.capex_cost_title"
                  )}
                </p>
                {yearsData.length > 0 ? yearsData : null}
                <OMSection
                  getSource={getSource}
                  scopedFormData={scopedFormData}
                  record={formData}
                />

                <CustomInput
                  fullWidth
                  tooltipText={
                    "tooltips.resources.project_options.fields.is_shortlisted"
                  }
                >
                  <BooleanInput
                    label={translate(
                      "resources.project_options.fields.is_shortlisted"
                    )}
                    source={getSource("is_shortlisted")}
                    variant="outlined"
                    margin="none"
                  />
                </CustomInput>

                <CommercialSection
                  getSource={getSource}
                  scopedFormData={scopedFormData}
                  record={formData}
                  onSave={props.save}
                />
              </Fragment>
            );
          }}
        </FormDataConsumer>
      </CustomFormIterator>
    </ArrayInput>
  );
}

export default DescriptionBlock;
