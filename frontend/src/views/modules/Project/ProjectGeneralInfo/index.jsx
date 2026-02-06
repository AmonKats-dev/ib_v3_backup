import React, { Fragment, useEffect, useState } from "react";
import CustomInput from "../../../components/CustomInput";
import {
  NumberInput,
  SelectInput,
  TextInput,
  Labeled,
  minValue,
  useDataProvider,
  required,
  useTranslate,
  useNotify,
  number,
  DateInput,
  ArrayInput,
  SimpleFormIterator,
  FormDataConsumer,
  SelectArrayInput,
  BooleanInput,
  AutocompleteArrayInput,
  ReferenceInput,
} from "react-admin";
import {
  getFiscalYears,
  getFiscalYearsFromDate,
} from "../../../../helpers/formatters";
import CustomTextArea from "../../../components/CustomTextArea";
import { useFormState } from "react-final-form";
import useCheckFeature from "../../../../hooks/useCheckFeature";
import { generateChoices } from "../../../../helpers";
import {
  DEFAULT_SORTING,
  FUND_BODY_TYPES,
  PROCUREMENT_IMPLEMENTATION_MODALITY,
  PROJECT_CLASSIFICATION,
  PROJECT_TYPE,
} from "../../../../constants/common";
import lodash, { find } from "lodash";
import {
  checkFeature,
  useChangeField,
} from "../../../../helpers/checkPermission";
import moment from "moment";
import OrganisationalStructure from "../../OrganisationalStructure";
import { checkRequired } from "../../../resources/Projects/validation";

function checkEndDate(value, allValues) {
  if (value && allValues) {
    if (moment(value) && moment(value) < moment(allValues.start_date)) {
      return "End date must be more than start date";
    }
  }

  return undefined;
}

function ProjectGeneralInfo({ record, projectTitle, ...props }) {
  const [enableRevenue, setEnableRevenue] = useState(false);
  const [initial, setInitial] = useState({});
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const { values } = useFormState();
  const notify = useNotify();
  const [proposedFundSource, setProposedFundSource] = useState([]);
  const [procurementValues, setProcurementValues] = useState([]);
  const [revenueSourceValues, setRevenueSourceValues] = useState([]);
  const [funds, setFunds] = useState([]);

  const hasProposedFundingSource = useCheckFeature(
    "project_has_proposed_funding_source",
    record && record.phase_id
  );
  const hasArrayRevenueSource = useCheckFeature(
    "project_has_array_revenue_source",
    record && record.phase_id
  );
  const hasRevenueSource = useCheckFeature(
    "project_has_revenue_source",
    record && record.phase_id
  );
  const hasTitleDuplicationControl = useCheckFeature(
    "project_title_duplication_check"
  );
  const hasTitleChangeEnable = useCheckFeature(
    "project_title_change_enable",
    record && record.phase_id
  );
  const hasProjectDataChangeEnable = useCheckFeature(
    "project_data_change_enable",
    record && record.phase_id
  );
  const hasFiscalYears = useCheckFeature("project_dates_fiscal_years");
  const hasPimisFields = useCheckFeature("has_pimis_fields");
  const hasEsnipFields = useCheckFeature("has_esnip_fields");

  const changeProposedFundingSource = useChangeField({
    name: "proposed_funding_source",
  });
  const changeDataAttr = useChangeField({ name: "project_data_changed" });
  const changeName = useChangeField({ name: "name" });
  const changeStartDateFY = useChangeField({ name: "start_date" });
  const changeEndDateFY = useChangeField({ name: "end_date" });
  const changeRevenueSource = useChangeField({ name: "revenue_source" });

  // const changeProjectGoal = useChangeField({ name: "project_goal" });
  // const changeProjectSummary = useChangeField({ name: "summary" });

  // useEffect(() => {
  //   if (!values?.project_goal) {
  //     changeProjectGoal(
  //       `<figure class="table-full-width"><table><tbody><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table></figure>`
  //     );
  //   }
  //   if (!values?.summary) {
  //     changeProjectSummary(
  //       `<figure class="table-full-width"><table><tbody><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table></figure>`
  //     );
  //   }
  // }, [values]);

  useEffect(() => {
    if (!enableRevenue) {
      changeRevenueSource([]);
    }
  }, [enableRevenue]);

  useEffect(() => {
    if (hasPimisFields) {
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
            const proposedFundSource = lodash.find(
              response.data,
              (it) => it.param_key === "proposed_fund_source"
            );
            if (proposedFundSource && proposedFundSource.param_value) {
              setProposedFundSource(
                proposedFundSource.param_value.map((item) => ({
                  id: item,
                  name: item,
                }))
              );
            }
            const revenueSource = lodash.find(
              response.data,
              (it) => it.param_key === "revenue_source"
            );
            if (revenueSource && revenueSource.param_value) {
              setRevenueSourceValues(
                revenueSource.param_value.map((item) => ({
                  id: item,
                  name: item,
                }))
              );
            }
          }
        });
    }
    setInitial(record.project);
  }, []);

  useEffect(() => {
    if (record && record.project) {
      if (values && !values.name) {
        changeName(record.project.name);
      }
    }
  }, [record && record.project]);

  

  useEffect(() => {
    if (hasTitleChangeEnable && !hasProjectDataChangeEnable) {
      if (values && values.name !== projectTitle) {
        changeDataAttr(true);
      }
    }


    if (hasProjectDataChangeEnable) {
      if (values) {
        if (
          values.name !== initial.name ||
          values.function_id !== initial.function_id ||
          values.program_id !== initial.program_id || values.classification !== initial.classification
        ) {
          changeDataAttr(true);
        }
      }
    }

    if (hasProposedFundingSource) {
      if (
        values &&
        values.proposed_funding_source_lock === true &&
        !values.proposed_funding_source
      ) {
        changeProposedFundingSource([{}]);
      }

      if (
        values &&
        values.proposed_funding_source_lock === true &&
        !enableRevenue
      ) {
        setEnableRevenue(true);
        changeProposedFundingSource([{}]);
      } else {
        if (
          values &&
          (!values.proposed_funding_source_lock ||
            values.proposed_funding_source_lock === false ||
            (values.proposed_funding_source &&
              values.proposed_funding_source[0] &&
              values.proposed_funding_source[0] ===
                "Source of funding has not been identified")) &&
          enableRevenue
        ) {
          setEnableRevenue(false);
          values.proposed_funding_source =
            "Source of funding has not been identified";
        }
      }
    }

    if (
      values &&
      values.additional_data &&
      values.additional_data.start_date_calendar
    ) {
      const calendarMonth = moment(
        values.additional_data.start_date_calendar,
        "YYYY-MM-DD"
      ).format("MM");

      if (Number(calendarMonth) >= 4) {
        changeStartDateFY(
          moment(values.additional_data?.start_date_calendar, "YYYY-MM-DD")
            .startOf("year")
            .format("YYYY-MM-DD")
        );
      } else {
        changeStartDateFY(
          moment(values.additional_data?.start_date_calendar, "YYYY-MM-DD")
            .add("years", -1)
            .startOf("year")
            .format("YYYY-MM-DD")
        );
      }
    }
    if (
      values &&
      values.additional_data &&
      values.additional_data.end_date_calendar
    ) {
      const calendarMonth = moment(
        values.additional_data?.end_date_calendar,
        "YYYY-MM-DD"
      ).format("MM");

      if (Number(calendarMonth) >= 4) {
        changeEndDateFY(
          moment(values.additional_data?.end_date_calendar, "YYYY-MM-DD")
            .startOf("year")
            .format("YYYY-MM-DD")
        );
      } else {
        changeEndDateFY(
          moment(values.additional_data?.end_date_calendar, "YYYY-MM-DD")
            .add("years", -1)
            .startOf("year")
            .format("YYYY-MM-DD")
        );
      }
    }
    // fix for old projects when it was single
    if (
      values &&
      values.revenue_source &&
      typeof values.revenue_source === "string"
    ) {
      values.revenue_source = [values.revenue_source];
    }
    if (
      values &&
      values.proposed_funding_source &&
      typeof values.proposed_funding_source === "string"
    ) {
      values.proposed_funding_source = [values.proposed_funding_source];
    }
    if (
      values &&
      values.procurement_modality &&
      typeof values.procurement_modality === "string"
    ) {
      values.procurement_modality = [values.procurement_modality];
    }

    if (
      values &&
      values.revenue_source &&
      values.revenue_source.length > 0 &&
      values.proposed_funding_source
    ) {
      if (!enableRevenueSourceField(values.proposed_funding_source)) {
        changeRevenueSource([]);
      }
    }
  }, [values]);

  //FEATURE: check duplication of project title on Blur
  function checkTitleDuplication() {
    dataProvider
      .custom("projects", {
        type: "validate-title",
        query: { title: values.title },
      })
      .then((response) => {
        if (response && !response.data) {
          notify(translate("messages.duplicate_project_title"), "warning");
        }
      })
      .catch((err) => {
        notify(err, "warning");
      });
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
  };

  const enableRevenueSourceField = (data) => {
    return find(data, (item) => item?.fund_id === 1);
  };

  return (
    <Fragment>
      {(props.isNewProject ||
        hasProjectDataChangeEnable ||
        hasTitleChangeEnable) && (
        <CustomInput
          fullWidth
          tooltipText={"tooltips.resources.project-details.fields.name"}
        >
          <TextInput
            source="name"
            label={translate("resources.project-details.fields.name")}
            validate={required()}
            variant="outlined"
            margin="none"
            onBlur={hasTitleDuplicationControl && checkTitleDuplication}
          />
        </CustomInput>
      )}
       
      <CustomInput
        fullWidth
        tooltipText={"tooltips.resources.project-details.fields.summary"}
        textArea
      >
        <CustomTextArea
          {...props}
          source="summary"
          validate={checkRequired("summary")}
          formValues={values}
          label={translate("resources.project-details.fields.summary")}
          isRequired={Boolean(checkRequired("summary"))}
        />
      </CustomInput>
      {!props.isNewProject && checkFeature("has_pimis_fields") && (
        <CustomInput
          fullWidth
          tooltipText={"tooltips.resources.project-details.fields.project_goal"}
          textArea
        >
          <CustomTextArea
            {...props}
            source="project_goal"
            validate={checkRequired("project_goal")}
            formValues={values}
            label={translate("resources.project-details.fields.project_goal")}
            isRequired={Boolean(checkRequired("project_goal"))}
          />
        </CustomInput>
      )}
      <CustomInput
        fullWidth
        tooltipText={"tooltips.resources.project-details.fields.start_date"}
      >
        {checkFeature("has_pimis_fields") && (
          <DateInput
            fullWidth
            options={{ fullWidth: true }}
            label={translate("resources.project-details.fields.start_date")}
            source="additional_data.start_date_calendar"
            variant="outlined"
            margin="none"
          />
        )}

        {hasFiscalYears ? (
          checkFeature("has_pimis_fields") ? null : (
            <SelectInput
              options={{ fullWidth: true }}
              label={translate("resources.project-details.fields.start_date")}
              source="start_date"
              choices={getFiscalYears(props.isNewProject ? 2 : 5)}
              validate={checkRequired("start_date")}
              variant="outlined"
              margin="none"
            />
          )
        ) : (
          <DateInput
            options={{ fullWidth: true }}
            label={translate("resources.project-details.fields.start_date")}
            source="additional_data.start_date_calendar"
            validate={required()}
            variant="outlined"
            margin="none"
          />
        )}
      </CustomInput>

      {checkFeature("has_project_duration_field") ? (
        <>
          <CustomInput
            tooltipText={"tooltips.resources.project-details.fields.duration"}
            bool
          >
            <NumberInput
              source="duration"
              step={1}
              variant="outlined"
              margin="none"
              validate={[required(), minValue(0)]}
            />
          </CustomInput>

          <CustomInput
            fullWidth
            tooltipText={"tooltips.resources.project-details.fields.end_date"}
          >
            {hasFiscalYears ? (
              <SelectInput
                options={{ fullWidth: true, disabled: true }}
                label={translate("resources.project-details.fields.end_date")}
                source="end_date"
                choices={
                  hasFiscalYears &&
                  getFiscalYearsFromDate(
                    values.start_date,
                    props.isNewProject ? 2 : 5
                  )
                }
                variant="outlined"
                margin="none"
              />
            ) : (
              <DateInput
                options={{ fullWidth: true }}
                label={translate("resources.project-details.fields.end_date")}
                source="additional_data.end_date_calendar"
                validate={[required(), checkEndDate]}
                variant="outlined"
                margin="none"
              />
            )}
          </CustomInput>
        </>
      ) : (
        <CustomInput
          fullWidth
          tooltipText={"tooltips.resources.project-details.fields.end_date"}
        >
          {checkFeature("has_pimis_fields") && (
            <DateInput
              options={{ fullWidth: true }}
              label={translate("resources.project-details.fields.end_date")}
              source="additional_data.end_date_calendar"
              variant="outlined"
              margin="none"
            />
          )}
          {hasFiscalYears ? (
            checkFeature("has_pimis_fields") ? null : (
              <SelectInput
                options={{ fullWidth: true }}
                label={translate("resources.project-details.fields.end_date")}
                source="end_date"
                choices={
                  hasFiscalYears &&
                  getFiscalYearsFromDate(
                    values.start_date,
                    props.isNewProject ? 2 : 5
                  )
                }
                variant="outlined"
                margin="none"
                validate={[checkRequired("end_date"), checkEndDate]}
              />
            )
          ) : (
            <DateInput
              options={{ fullWidth: true }}
              label={translate("resources.project-details.fields.end_date")}
              source="additional_data.end_date_calendar"
              validate={required()}
              variant="outlined"
              margin="none"
            />
          )}
        </CustomInput>
      )}

      <CustomInput
        fullWidth
        tooltipText={"tooltips.resources.project-details.fields.classification"}
      >
        <SelectInput
          source="classification"
          label={translate("resources.project-details.fields.classification")}
          choices={generateChoices(PROJECT_CLASSIFICATION)}
          validate={required()}
          variant="outlined"
          margin="none"
          fullWidth
          options={{ fullWidth: true }}
        />
      </CustomInput>

      {hasProposedFundingSource && !props.isNewProject && (
        <>
          <CustomInput bool tooltipText={"Source of funding identified"}>
            <BooleanInput
              label={"Source of funding identified"}
              source="proposed_funding_source_lock"
              variant="outlined"
              margin="none"
            />
          </CustomInput>
          {enableRevenue && (
            <ArrayInput source="proposed_funding_source" label={false}>
              <SimpleFormIterator>
                <FormDataConsumer>
                  {({ formData, scopedFormData, getSource, ...rest }) => {
                    return (
                      <>
                        <ReferenceInput
                          // filter={{
                          //   not_ids: formData?.proposed_funding_source
                          //     ?.map((item) => item?.fund_id)
                          //     ?.filter(
                          //       (item) => item !== scopedFormData?.fund_id
                          //     ),
                          // }}
                          sort={DEFAULT_SORTING}
                          perPage={-1}
                          source={getSource("fund_id")}
                          reference="funds"
                          allowEmpty
                          label={translate(
                            `resources.activities.fields.investments.fields.fund_id`
                          )}
                          validate={[required()]}
                        >
                          <SelectInput
                            options={{ fullWidth: true }}
                            fullWidth
                            optionText="name"
                            variant="outlined"
                            margin="none"
                          />
                        </ReferenceInput>
                        {scopedFormData?.fund_id !== 1 && (
                          <CustomInput
                            fullWidth
                            tooltipText={
                              "tooltips.resources.project-details.fields.fund_body_type"
                            }
                          >
                            <SelectInput
                              options={{ fullWidth: true }}
                              label={translate(
                                "resources.project-details.fields.fund_body_type"
                              )}
                              source={getSource("fund_body_type")}
                              choices={generateFundBody(scopedFormData)}
                              validate={[required()]}
                              variant="outlined"
                              margin="none"
                              disabled={hasSelectedGoJ(scopedFormData)}
                            />
                          </CustomInput>
                        )}
                      </>
                    );
                  }}
                </FormDataConsumer>
              </SimpleFormIterator>
            </ArrayInput>
          )}
          {/* {enableRevenue && (
            <CustomInput
              fullWidth
              tooltipText={
                "tooltips.resources.project-details.fields.proposed_fund_source"
              }
            >
              <AutocompleteArrayInput
                margin="none"
                variant="outlined"
                fullWidth
                label={translate(
                  "resources.project-details.fields.proposed_fund_source"
                )}
                source="proposed_funding_source"
                choices={proposedFundSource}
                validate={required()}
                shouldRenderSuggestions={true}
              />
            </CustomInput>
          )} */}
        </>
      )}

      {hasPimisFields &&
      !props.isNewProject &&
      hasArrayRevenueSource &&
      revenueSourceValues &&
      revenueSourceValues.length > 0 ? (
        <>
          <CustomInput
            fullWidth
            tooltipText={
              "tooltips.resources.project-details.fields.revenue_source"
            }
            disabled={
              !enableRevenueSourceField(values?.proposed_funding_source)
            }
          >
            <AutocompleteArrayInput
              margin="none"
              variant="outlined"
              fullWidth
              label={translate(
                "resources.project-details.fields.revenue_source"
              )}
              source="revenue_source"
              choices={revenueSourceValues}
              validate={
                enableRevenueSourceField(values?.proposed_funding_source) &&
                checkRequired("revenue_source")
              }
              shouldRenderSuggestions={true}
              disabled={
                !enableRevenueSourceField(values?.proposed_funding_source)
              }
            />
          </CustomInput>
        </>
      ) : null}

      {hasPimisFields && !props.isNewProject && hasRevenueSource ? (
        <CustomInput
          fullWidth
          tooltipText={
            "tooltips.resources.project-details.fields.revenue_source"
          }
        >
          <SelectInput
            options={{ fullWidth: true }}
            label={translate("resources.project-details.fields.revenue_source")}
            source="revenue_source"
            choices={revenueSourceValues}
            validate={checkRequired("revenue_source")}
            variant="outlined"
            margin="none"
          />
        </CustomInput>
      ) : null}
      {values && values.revenue_source?.includes("other") && (
        <CustomInput
          fullWidth
          tooltipText={
            "tooltips.resources.project-details.fields.revenue_source_other"
          }
        >
          <TextInput
            fullWidth
            source="revenue_source_other"
            variant="outlined"
            validate={required()}
            margin="none"
          />
        </CustomInput>
      )}
      {hasPimisFields && procurementValues && !props.isNewProject && (
        <CustomInput
          fullWidth
          tooltipText={
            "tooltips.resources.project-details.fields.procurement_modality"
          }
        >
          <AutocompleteArrayInput
            margin="none"
            variant="outlined"
            fullWidth
            label={translate(
              "resources.project-details.fields.procurement_modality"
            )}
            source="procurement_modality"
            choices={procurementValues}
            validate={checkRequired("procurement_modality")}
            shouldRenderSuggestions={true}
          />
        </CustomInput>
      )}
    </Fragment>
  );
}
export default ProjectGeneralInfo;
