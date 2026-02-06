import { FormDataConsumer, TextInput, required } from "react-admin";
import { useTranslate } from "react-admin";
import React, { Fragment } from "react";

import CustomInput from "../../../../components/CustomInput";
import moment from "moment";
import { useChangeField } from "../../../../../helpers/checkPermission";

function MEOverviewForm(props) {
  const translate = useTranslate();
  const changeReleases = useChangeField({ name: "me_releases" });
  const changeYear = useChangeField({ name: "year" });
  const changeReportType = useChangeField({ name: "frequency" });

  return (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, ...rest }) => {
        formData.project_detail_id = props.details.id;
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

        if (typeof props.isYearReport !== "undefined") {
          changeReportType(props.isYearReport ? "ANNUAL" : "CUSTOM");
        }

        return (
          <Fragment>
            <CustomInput
              tooltipText="tooltips.resources.me-reports.fields.summary"
              fullWidth
            >
              <TextInput
                label={"Executive summary"}
                variant="outlined"
                margin="none"
                source={`summary`}
                validate={required()}
                rows={5}
                multiline
                fullWidth
              />
            </CustomInput>
            <CustomInput
              tooltipText="tooltips.resources.me-reports.fields.rational_study"
              fullWidth
            >
              <TextInput
                label={"Introduction"}
                variant="outlined"
                margin="none"
                source={`rational_study`}
                validate={required()}
                rows={5}
                multiline
                fullWidth
              />
            </CustomInput>
            <CustomInput
              tooltipText="tooltips.resources.me-reports.fields.methodology"
              fullWidth
            >
              <TextInput
                variant="outlined"
                margin="none"
                source={`methodology`}
                validate={required()}
                rows={5}
                multiline
                fullWidth
              />
            </CustomInput>
            <CustomInput
              tooltipText="tooltips.resources.me-reports.fields.environmental_issues"
              fullWidth
            >
              <TextInput
                variant="outlined"
                margin="none"
                source={`environmental_issues`}
                validate={required()}
                rows={5}
                multiline
                fullWidth
              />
            </CustomInput>
            <CustomInput
              tooltipText="tooltips.resources.me-reports.fields.gender_equity"
              fullWidth
            >
              <TextInput
                label={"Gender Equity"}
                variant="outlined"
                margin="none"
                source={`gender_equity`}
                validate={required()}
                rows={5}
                multiline
                fullWidth
              />
            </CustomInput>
            <CustomInput
              tooltipText="tooltips.resources.me-reports.fields.social_safe_guards"
              fullWidth
            >
              <TextInput
                label={"Social Safeguards"}
                variant="outlined"
                margin="none"
                source={`social_safe_guards`}
                validate={required()}
                rows={5}
                multiline
                fullWidth
              />
            </CustomInput>
          </Fragment>
        );
      }}
    </FormDataConsumer>
  );
}

export default MEOverviewForm;
