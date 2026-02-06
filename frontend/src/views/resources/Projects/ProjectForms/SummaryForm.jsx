import {
  FormDataConsumer,
  TextInput,
  useInput,
  AutocompleteArrayInput,
  usePermissions,
  ReferenceArrayInput,
  required,
  useTranslate,
} from "react-admin";
import { useFormState } from "react-final-form";
import React, { Fragment, useEffect, useState } from "react";
import moment from "moment";
import OrganisationalStructure from "../../../modules/OrganisationalStructure";
import ImplementingAgencies from "../../../modules/Project/ImplementingAgencies";
import ProjectGeneralInfo from "../../../modules/Project/ProjectGeneralInfo";
import Location from "../../../modules/Project/Location";
import OperationMaintenance from "../../../modules/Project/OperationMaintenance";
import DefectLiability from "../../../modules/Project/DefectLiability";
import EvaluationPeriod from "../../../modules/Project/EvaluationPeriod";
import ExecutiveSummary from "../../../modules/Project/ExecutiveSummary";
import { useSelector } from "react-redux";
import {
  checkFeature,
  useChangeField,
} from "../../../../helpers/checkPermission";
import HTML2React from "html2react";
import { TextField, Typography } from "@material-ui/core";
import lodash from "lodash";
import ExecutingAgencies from "../../../modules/Project/ExecutingAgencies";
import CustomInput from "../../../components/CustomInput";
import { DEFAULT_SORTING } from "../../../../constants/common";
import CustomTextArea from "../../../components/CustomTextArea";
import { checkRequired } from "../validation";

function SummaryForm(props) {
  const userInfo = useSelector((state) => state.user.userInfo);
  const hasSectors = checkFeature("project_has_sectors");
  const hasPrograms = checkFeature("project_has_programs");
  const hasFunctions = checkFeature("project_has_functions");
  const hasDataChangeEnabled = checkFeature(
    "project_data_change_enable",
    props.record && props.record.phase_id
  );
  const translate = useTranslate();
  const changeOmp = useChangeField({ name: "is_omp" });
  const changeDlp = useChangeField({ name: "is_dlp" });
  const changeEval = useChangeField({ name: "is_evaluation" });
  const changeDuration = useChangeField({ name: "duration" });
  const changeStartCalendar = useChangeField({
    name: "additional_data.start_date_calendar",
  });
  const changeEndCalendar = useChangeField({
    name: "additional_data.end_date_calendar",
  });
  const changeFundingSourceLock = useChangeField({
    name: "proposed_funding_source_lock",
  });
  const { values: formData } = useFormState();

  // Sync form fields in useEffect to avoid "Cannot update while rendering" warning
  useEffect(() => {
    if (!formData) return;
    if (typeof formData.is_dlp === "undefined" && formData.liability_period != null) {
      changeDlp(
        formData.liability_period && Number(formData.liability_period) !== 0
          ? true
          : false
      );
    }
    if (typeof formData.is_omp === "undefined" && formData.maintenance_period != null) {
      changeOmp(
        formData.maintenance_period && Number(formData.maintenance_period) !== 0
          ? true
          : false
      );
    }
    if (typeof formData.is_evaluation === "undefined" && formData.evaluation_period != null) {
      changeEval(
        formData.evaluation_period && Number(formData.evaluation_period) !== 0
          ? true
          : false
      );
    }
    if (checkFeature("has_project_duration_field")) {
      if (
        !formData.duration &&
        formData.end_date &&
        formData.start_date
      ) {
        changeDuration(
          moment(formData.end_date, "YYYY-MM-DD").diff(
            moment(formData.start_date, "YYYY-MM-DD"),
            "years"
          ) + 1
        );
      }
    }
    if (
      checkFeature("project_has_proposed_funding_source", formData?.phase_id) &&
      typeof formData.proposed_funding_source_lock === "undefined" &&
      formData.proposed_funding_source
    ) {
      const disabled =
        formData.proposed_funding_source ===
          "Source of funding has not been identified" ||
        (formData.proposed_funding_source[0] &&
          formData.proposed_funding_source[0] ===
            "Source of funding has not been identified");
      changeFundingSourceLock(!disabled);
    }
    if (
      checkFeature("has_pimis_fields") &&
      formData.start_date &&
      !formData?.additional_data?.start_date_calendar
    ) {
      changeStartCalendar(
        moment(formData.start_date, "YYYY-MM-DD")
          .add("month", 3)
          .format("YYYY-MM-DD")
      );
    }
    if (
      checkFeature("has_pimis_fields") &&
      formData.end_date &&
      !formData?.additional_data?.end_date_calendar
    ) {
      changeEndCalendar(
        moment(formData.end_date, "YYYY-MM-DD")
          .add("month", 3)
          .format("YYYY-MM-DD")
      );
    }
  }, [
    formData?.is_dlp,
    formData?.is_omp,
    formData?.is_evaluation,
    formData?.duration,
    formData?.start_date,
    formData?.end_date,
    formData?.liability_period,
    formData?.maintenance_period,
    formData?.evaluation_period,
    formData?.proposed_funding_source_lock,
    formData?.proposed_funding_source,
    formData?.phase_id,
    formData?.additional_data?.start_date_calendar,
    formData?.additional_data?.end_date_calendar,
  ]);

  return (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, ...rest }) => {
        if (formData && userInfo) {
          if (userInfo.organization_id) {
            formData.organization_id = userInfo.organization_id;
          }
        }

        if (formData) {
          if (formData.is_omp === false) {
            formData.om_costs = [];
            formData.om_cost = null;
            formData.maintenance_period = null;
            formData.om_fund_id = null;
            formData.om_costing_id = null;
          }
          if (formData.is_dlp === false) {
            formData.liability_period = null;
          }
          if (formData.is_evaluation === false) {
            formData.evaluation_period = null;
          }

          if (checkFeature("has_project_duration_field")) {
            if (formData.duration && formData.start_date) {
              formData.end_date = moment(formData.start_date, "YYYY-MM-DD")
                .add("years", Number(formData.duration) - 1)
                .format("YYYY-MM-DD");
            }
          }

          //O&M Formatter
          if (
            formData &&
            formData.om_costs &&
            lodash.isEmpty(formData.om_costs)
          ) {
            if (!lodash.isEmpty(formData.om_cost)) {
              formData.om_costs.push({
                costing: lodash.cloneDeep(formData.om_costing),
                costing_id: formData.om_costing_id,
                fund: lodash.cloneDeep(formData.om_fund),
                fund_id: formData.om_fund_id,
                costs: lodash.cloneDeep(formData.om_cost),
              });
            }
          }
        }

        return (
          <Fragment>
            {checkFeature("has_pimis_fields") && (
              <ProjectGeneralInfo
                {...props}
                title="Project Information"
                record={formData}
                isNewProject={props.isNewProject}
                projectTitle={props.projectTitle}
                projectClassification={props.projectData?.classification}
              />
            )}
            <br />
            {(props.isNewProject || hasDataChangeEnabled) && hasFunctions && (
              <OrganisationalStructure
                {...props}
                isRequired
                source="function_id"
                config="functions_config"
                reference="functions"
                field="project.function"
                excludeLevelNames={props.isNewProject ? ["Directorate"] : []}
                filter={
                  checkFeature("has_pimis_fields")
                    ? null
                    : {
                        organization_id:
                          userInfo.organization &&
                          userInfo.organization.parent_id,
                      }
                }
              />
            )}
            {(props.isNewProject || hasDataChangeEnabled) && hasPrograms && (
              <OrganisationalStructure
                {...props}
                isRequired
                source="program_id"
                config="programs_config"
                reference="programs"
                field="project.program"
                filter={
                  checkFeature("has_pimis_fields")
                    ? null
                    : {
                        organization_id:
                          userInfo.organization &&
                          userInfo.organization.parent_id,
                      }
                }
              />
            )}

            {hasSectors && !props.isNewProject && (
              <CustomInput
                fullWidth
                tooltipText={
                  "tooltips.resources.ndp-sdgs.fields.ndp_outcome_ids"
                }
              >
                <ReferenceArrayInput
                  sort={DEFAULT_SORTING}
                  validate={checkRequired("sector_ids")}
                  perPage={-1}
                  source="sector_ids"
                  reference="sectors"
                  variant="outlined"
                >
                  <AutocompleteArrayInput
                    margin="none"
                    variant="outlined"
                    fullWidth
                    shouldRenderSuggestions={true}
                  />
                </ReferenceArrayInput>
              </CustomInput>
            )}

            <ImplementingAgencies
              source="implementing_agencies"
              title="Implementing Agencies"
              {...props}
              record={formData}
              initialRecord={props.initialRecord}
              fromCreate={props.openOnSummary}
            />

            {checkFeature("has_pimis_fields") && (
              <ExecutingAgencies
                source="executing_agencies"
                title="Executing Agencies"
                {...props}
                record={formData}
                fromCreate={props.openOnSummary}
              />
            )}
            {!checkFeature("has_pimis_fields") && (
              <ProjectGeneralInfo
                {...props}
                title="Project Information"
                record={formData}
                isNewProject={props.isNewProject}
                projectTitle={props.projectTitle}
              />
            )}
            {!props.isNewProject &&
            !checkFeature("has_pimis_fields") &&
            formData.additional_data &&
            formData.additional_data.location ? (
              <div>
                <Typography variant="caption">
                  <b>Previous location</b>
                </Typography>
                {HTML2React(formData.additional_data.location)}
              </div>
            ) : null}
            <Location
              title="Locations"
              {...props}
              record={formData}
              initialRecord={props.initialRecord}
              fromCreate={props.openOnSummary}
            />

            {!props.isNewProject && (
              <OperationMaintenance {...props} record={formData} />
            )}
            {!props.isNewProject && (
              <DefectLiability {...props} record={formData} />
            )}
            {!props.isNewProject && (
              <ExecutiveSummary {...props} record={formData} />
            )}
            {!props.isNewProject && (
              <EvaluationPeriod {...props} record={formData} />
            )}
            {!props.isNewProject &&
              formData &&
              checkFeature("has_behaviour_form_fields", formData.phase_id) && (
                <>
                  {/* <CustomInput
                    tooltipText={
                      "tooltips.resources.project-details.fields.expected_fund_source"
                    }
                    textArea
                    fullWidth
                  >
                    <CustomTextArea
                      label={translate(
                        "resources.project-details.fields.expected_fund_source"
                      )}
                      source="expected_fund_source"
                      formData={formData}
                      validate={[required()]}
                      isRequired
                      {...props}
                    />
                  </CustomInput> */}
                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project-details.fields.national_scope"
                    }
                    fullWidth
                    textArea
                  >
                    <CustomTextArea
                      label={translate(
                        "resources.project-details.fields.national_scope"
                      )}
                      source="national_scope"
                      formData={formData}
                      validate={[checkRequired("national_scope")]}
                      isRequired
                      {...props}
                    />
                  </CustomInput>
                </>
              )}
          </Fragment>
        );
      }}
    </FormDataConsumer>
  );
}

export default SummaryForm;
