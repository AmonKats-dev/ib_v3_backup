import React, { Fragment, useEffect } from "react";
import {
  TextInput,
  SelectInput,
  NumberInput,
  DateInput,
  required,
  useTranslate,
  minValue,
} from "react-admin";
import { useFormState } from "react-final-form";
import { useSelector } from "react-redux";
import moment from "moment";
import { checkFeature, useChangeField } from "../../../../helpers/checkPermission";
import { getFiscalYears, getFiscalYearsFromDate } from "../../../../helpers/formatters";
import { PROJECT_CLASSIFICATION } from "../../../../constants/common";
import { generateChoices } from "../../../../helpers";
import CustomInput from "../../../components/CustomInput";
import CustomTextArea from "../../../components/CustomTextArea";
import OrganisationalStructure from "../../../modules/OrganisationalStructure";
import { checkRequired } from "../validation";

function checkEndDate(value, allValues) {
  if (value && allValues) {
    const start = allValues.start_date || allValues?.additional_data?.start_date_calendar;
    if (start && moment(value).isBefore(moment(start))) {
      return "End date must be more than start date";
    }
  }
  return undefined;
}

function CreateStep1Form(props) {
  const translate = useTranslate();
  const { values } = useFormState();
  const userInfo = useSelector((state) => state.user.userInfo);
  const hasPrograms = checkFeature("project_has_programs");
  const hasFiscalYears = checkFeature("project_dates_fiscal_years");
  const hasProjectDurationField = checkFeature("has_project_duration_field");
  const hasPimisFields = checkFeature("has_pimis_fields");

  const changeEndDate = useChangeField({ name: "end_date" });
  const changeEndDateCalendar = useChangeField({
    name: "additional_data.end_date_calendar",
  });

  // Auto-calculate End Date from Start Date + Duration when duration field is used
  useEffect(() => {
    if (!hasProjectDurationField) return;
    const duration = values?.duration;
    if (!duration || Number(duration) < 1) return;

    if (hasFiscalYears) {
      const startDate = values?.start_date;
      if (startDate) {
        const endDate = moment(startDate, "YYYY-MM-DD")
          .add("years", Number(duration) - 1)
          .format("YYYY-MM-DD");
        changeEndDate(endDate);
      }
    } else {
      const startCalendar = values?.additional_data?.start_date_calendar;
      if (startCalendar) {
        const endDate = moment(startCalendar, "YYYY-MM-DD")
          .add("years", Number(duration) - 1)
          .format("YYYY-MM-DD");
        changeEndDateCalendar(endDate);
      }
    }
  }, [
    hasProjectDurationField,
    hasFiscalYears,
    values?.start_date,
    values?.duration,
    values?.additional_data?.start_date_calendar,
  ]);

  return (
    <Fragment>
      {/* 1. Programs */}
      {hasPrograms && (
        <OrganisationalStructure
          {...props}
          isRequired
          source="program_id"
          config="programs_config"
          reference="programs"
          field="project.program"
          filter={
            hasPimisFields
              ? null
              : {
                  organization_id:
                    userInfo?.organization?.parent_id,
                }
          }
        />
      )}

      {/* 2. Project title (name) */}
      <CustomInput
        fullWidth
        tooltipText="tooltips.resources.project-details.fields.name"
      >
        <TextInput
          source="name"
          label={translate("resources.project-details.fields.name")}
          validate={required()}
          variant="outlined"
          margin="none"
          options={{ fullWidth: true }}
        />
      </CustomInput>

      {/* 3. Technical description (summary) */}
      <CustomInput
        fullWidth
        tooltipText="tooltips.resources.project-details.fields.summary"
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

      {/* 4. Start date */}
      <CustomInput
        fullWidth
        tooltipText="tooltips.resources.project-details.fields.start_date"
      >
        {hasFiscalYears ? (
          <SelectInput
            source="start_date"
            label={translate("resources.project-details.fields.start_date")}
            choices={getFiscalYears(2)}
            validate={checkRequired("start_date")}
            variant="outlined"
            margin="none"
            options={{ fullWidth: true }}
          />
        ) : (
          <DateInput
            source="additional_data.start_date_calendar"
            label={translate("resources.project-details.fields.start_date")}
            validate={required()}
            variant="outlined"
            margin="none"
            options={{ fullWidth: true }}
          />
        )}
      </CustomInput>

      {/* 5. Duration */}
      {hasProjectDurationField && (
        <CustomInput
          tooltipText="tooltips.resources.project-details.fields.duration"
          fullWidth
        >
          <NumberInput
            source="duration"
            step={1}
            variant="outlined"
            margin="none"
            validate={[required(), minValue(0)]}
            options={{ fullWidth: true }}
          />
        </CustomInput>
      )}

      {/* 6. End date (auto-calculated from Start Date + Duration when duration field is used) */}
      <CustomInput
        fullWidth
        tooltipText="tooltips.resources.project-details.fields.end_date"
      >
        {hasFiscalYears ? (
          <SelectInput
            source="end_date"
            label={translate("resources.project-details.fields.end_date")}
            choices={getFiscalYearsFromDate(values?.start_date, 2)}
            validate={[checkRequired("end_date"), checkEndDate]}
            variant="outlined"
            margin="none"
            options={{ fullWidth: true }}
            disabled={hasProjectDurationField}
          />
        ) : (
          <DateInput
            source="additional_data.end_date_calendar"
            label={translate("resources.project-details.fields.end_date")}
            validate={[required(), checkEndDate]}
            variant="outlined"
            margin="none"
            options={{ fullWidth: true }}
            disabled={hasProjectDurationField}
          />
        )}
      </CustomInput>

      {/* 7. Project classification */}
      <CustomInput
        fullWidth
        tooltipText="tooltips.resources.project-details.fields.classification"
      >
        <SelectInput
          source="classification"
          label={translate("resources.project-details.fields.classification")}
          choices={generateChoices(PROJECT_CLASSIFICATION)}
          validate={required()}
          variant="outlined"
          margin="none"
          options={{ fullWidth: true }}
        />
      </CustomInput>
    </Fragment>
  );
}

export default CreateStep1Form;
