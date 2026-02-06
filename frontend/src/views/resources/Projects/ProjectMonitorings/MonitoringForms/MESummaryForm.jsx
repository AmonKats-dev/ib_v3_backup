import { FormDataConsumer, TextInput, required, number } from "react-admin";
import { DateInput, SelectInput, useTranslate } from "react-admin";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { getFiscalYearsRangeForIntervals } from "../../../../../helpers/formatters";

import CustomInput from "../../../../components/CustomInput";
import lodash from "lodash";
import moment from "moment";
import { useChangeField } from "../../../../../helpers/checkPermission";

const QUARTERS = [
  { id: "Q1", name: "Q1" },
  { id: "Q2", name: "Q2" },
  { id: "Q3", name: "Q3" },
  { id: "Q4", name: "Q4" },
];

const ME_ACTIVITY_TYPE = [
  { id: "Monitoring", name: "Monitoring" },
  { id: "Evaluation", name: "Evaluation" },
  { id: "Assessment", name: "Assessment" },
  { id: "Rapid Appraisal", name: "Rapid Appraisal" },
  { id: "Others", name: "Others" },
];

function MESummaryForm(props) {
  const translate = useTranslate();
  const changeReleases = useChangeField({ name: "me_releases" });
  const changeYear = useChangeField({ name: "year" });
  const changeReportType = useChangeField({ name: "frequency" });
  const changeOutputs = useChangeField({ name: "me_outputs" });
  const changeActivity = useChangeField({ name: "me_activities" });
  const userInfo = useSelector((state) => state.user.userInfo);

  return (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, ...rest }) => {
        if (formData && userInfo) {
          if (userInfo.organization_id) {
            formData.organization_id = userInfo.organization_id;
          }
        }
        formData.project_detail_id = props.details.id;
        formData.contract_signed_date =
          props.projectData && props.projectData.signed_date;

        if (!formData.me_releases) {
          const me_releases = [
            { release_type: "PLANNED" },
            { release_type: "ACTUAL" },
          ];

          changeReleases(me_releases);
        }

        if (formData.start_date) {
          changeYear(moment(formData.start_date).format("YYYY"));
        }

        if (typeof props.isYearReport !== "undefined" && !formData.frequency) {
          changeReportType(props.isYearReport ? "ANNUAL" : "CUSTOM");
        }

        if (props.isNew) {
          if (
            props.details.outputs &&
            (!formData.me_outputs ||
              (formData.me_outputs && formData.me_outputs.length === 0))
          ) {
            const me_outputs = lodash
              .cloneDeep(props.details.outputs)
              .map((output) => {
                output.output_id = output.id;
                output.output_progress = 0;
                delete output.id;
                return output;
              });
            changeOutputs(me_outputs);
          }

          if (
            props.details.activities &&
            (!formData.me_activities ||
              (formData.me_activities && formData.me_activities.length === 0))
          ) {
            const me_activities = lodash
              .cloneDeep(props.details.activities)
              .map((activity) => {
                activity.activity_id = activity.id;
                delete activity.id;

                return activity;
              });
            changeActivity(me_activities);
          }
        }

        return (
          <Fragment>
            <CustomInput
              tooltipText="tooltips.resources.me-reports.fields.year"
              bool
            >
              <SelectInput
                source="year"
                variant="outlined"
                validate={[required()]}
                margin="none"
                choices={getFiscalYearsRangeForIntervals(
                  props.details.start_date,
                  props.details.end_date
                )}
                className={props.classes.textInput}
                // disabled={props.disabled} ://Amon
              />
            </CustomInput>
            <CustomInput
              tooltipText="tooltips.resources.me-reports.fields.quarter"
              bool
            >
              <SelectInput
                source="quarter"
                variant="outlined"
                validate={[required()]}
                margin="none"
                choices={QUARTERS}
                className={props.classes.textInput}
                // disabled={props.disabled} ://Amon
              />
            </CustomInput>

            <CustomInput
              tooltipText="tooltips.resources.me-reports.fields.data_collection_type"
              fullWidth
            >
              <TextInput
                label="resources.me-reports.fields.data_collection_type"
                variant="outlined"
                margin="none"
                validate={[required()]}
                source={"data_collection_type"}
                // disabled={props.disabled} ://Amon
              />
            </CustomInput>
            <CustomInput
              tooltipText="tooltips.resources.me-reports.fields.me_type"
              fullWidth
            >
              <SelectInput
                choices={ME_ACTIVITY_TYPE}
                label="resources.me-reports.fields.me_type"
                variant="outlined"
                margin="none"
                source={"me_type"}
                validate={[required()]}
                // disabled={props.disabled} ://Amon
              />
            </CustomInput>
            <CustomInput tooltipText="tooltips.resources.me-reports.fields.effectiveness_date">
              <DateInput
                source="effectiveness_date"
                variant="outlined"
                margin="none"
                // disabled={props.disabled} ://Amon
              />
            </CustomInput>
            {props.isYearReport || formData.frequency === "ANNUAL" ? (
              <CustomInput
                tooltipText="tooltips.resources.me-reports.fields.disbursement"
                fullWidth
              >
                <TextInput
                  label="resources.me-reports.fields.disbursement"
                  variant="outlined"
                  margin="none"
                  source={"disbursement"}
                  validate={[required(), number()]}
                  // disabled={props.disabled} ://Amon
                />
              </CustomInput>
            ) : null}
            {/* <CustomInput tooltipText="tooltips.resources.me-reports.fields.financing_agreement_date">
              <DateInput
                source="financing_agreement_date"
                variant="outlined"
                margin="none"
                // disabled={props.disabled}
              />
            </CustomInput> */}
            <CustomInput tooltipText="tooltips.resources.me-reports.fields.signed_date">
              <DateInput
                source="contract_signed_date"
                variant="outlined"
                margin="none"
                // disabled ://Amon
              />
            </CustomInput>
          </Fragment>
        );
      }}
    </FormDataConsumer>
  );
}

export default MESummaryForm;
