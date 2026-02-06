import React, { Fragment, useEffect, useState } from "react";
import {
  BooleanInput,
  required,
  TextInput,
  NumberInput,
  SelectInput,
  number,
  minValue,
  useTranslate,
} from "react-admin";
import CustomInput from "../../../../components/CustomInput";
import moment from "moment";
import { commasFormatter, commasParser } from "../../../../../helpers";
import {
  getFiscalYearsRange,
  getFiscalYearValueFromYear,
} from "../../../../../helpers/formatters";
import { useChangeField } from "../../../../../helpers/checkPermission";
import { checkRequired } from "../../../../resources/Projects/validation";

function OMSection({ getSource, scopedFormData, record, ...props }) {
  const translate = useTranslate();
  const changeOmp = useChangeField({ name: getSource("has_omp") });
  const changeOmDuration = useChangeField({ name: getSource("om_duration") });
  const changeOmStart = useChangeField({ name: getSource("om_start_date") });
  const changeOmEnd = useChangeField({ name: getSource("om_end_date") });
  const changeOmCost = useChangeField({ name: getSource("om_cost") });

  useEffect(() => {
    if (scopedFormData && typeof scopedFormData.has_omp === "undefined") {
      changeOmp(scopedFormData.om_start_date ? true : false);
    }
  }, []);

  useEffect(() => {
    if (scopedFormData && typeof scopedFormData.has_omp === "undefined") {
      changeOmp(scopedFormData.om_start_date ? true : false);
    }
    if (
      scopedFormData &&
      scopedFormData.has_omp &&
      scopedFormData.om_start_date &&
      scopedFormData.om_end_date
    ) {
      changeOmDuration(
        moment(scopedFormData.om_end_date, "YYYY-MM-DD").diff(
          moment(scopedFormData.om_start_date, "YYYY-MM-DD"),
          "years"
        ) + 1
      );
    }
  }, [scopedFormData]);

  const handleChange = (scopedFormData) => (checked) => {
    changeOmp(checked);

    if (scopedFormData) {
      scopedFormData.has_omp = checked;
      if (!scopedFormData.has_omp) {
        changeOmStart(null);
        changeOmEnd(null);
        changeOmCost(null);
        changeOmDuration(null);
      } else {
        changeOmDuration(
          moment(scopedFormData.om_end_date, "YYYY-MM-DD").diff(
            moment(scopedFormData.om_start_date, "YYYY-MM-DD"),
            "years"
          ) + 1
        );
      }
    }
  };

  const omTargetYears =
    record &&
    getFiscalYearsRange(
      record.end_date,
      moment(record.end_date, "YYYY-MM-DD").add(30, "years")
    );

  let omYearsData = [];

  if (scopedFormData) {
    for (let index = 0; index < scopedFormData.om_duration; index++) {
      const year = moment(scopedFormData.om_start_date, "YYYY-MM-DD")
        .add("years", index)
        .format("YYYY");

      omYearsData.push(
        <CustomInput
          tooltipText={"tooltips.resources.project_options.fields.om_cost"}
        >
          <TextInput
            label={`${getFiscalYearValueFromYear(year).name} (${translate(
              "titles.currency"
            )})`}
            variant="outlined"
            margin="none"
            source={getSource("om_cost." + String(year) + "y")}
            validate={[number()]}
            format={commasFormatter}
            parse={commasParser}
          />
        </CustomInput>
      );
    }
  }

  return (
    <>
      <CustomInput
        fullWidth
        tooltipText={"tooltips.resources.project_options.fields.has_omp"}
      >
        <BooleanInput
          label={translate("resources.project_options.fields.has_omp")}
          source={getSource("has_omp")}
          onChange={handleChange(scopedFormData)}
          variant="outlined"
          margin="none"
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
              validate={checkRequired("project_options", "om_start_date")}
              options={{ fullWidth: "true" }}
              label={translate(
                "resources.project_options.fields.om_start_date"
              )}
              source={getSource("om_start_date")}
              choices={omTargetYears}
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
              validate={checkRequired("project_options", "om_end_date")}
              options={{ fullWidth: "true" }}
              label={translate("resources.project_options.fields.om_end_date")}
              source={getSource("om_end_date")}
              choices={omTargetYears}
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
              label={translate("resources.project_options.fields.om_duration")}
              source={getSource("om_duration")}
              step={1}
              variant="outlined"
              margin="none"
              validate={[minValue(0)]}
            />
          </CustomInput>
          <p>{translate("resources.project_options.fields.om_cost_title")}</p>
          {omYearsData && omYearsData.length > 0 ? omYearsData : null}
        </Fragment>
      ) : null}
    </>
  );
}

export default OMSection;
