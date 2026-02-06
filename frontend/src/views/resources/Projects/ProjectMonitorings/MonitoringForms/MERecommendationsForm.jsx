import { FormDataConsumer, TextInput, required } from "react-admin";
import { useTranslate } from "react-admin";
import React, { Fragment, useEffect } from "react";
import CustomInput from "../../../../components/CustomInput";

function MERecommendationsForm(props) {
  const translate = useTranslate();

  return (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, ...rest }) => {
        return (
          <Fragment>
            <CustomInput
              tooltipText="tooltips.resources.me-reports.fields.challenges"
              fullWidth
            >
              <TextInput
                label={translate("resources.me-reports.fields.challenges")}
                variant="outlined"
                margin="none"
                source={`challenges`}
                validate={required()}
                rows={5}
                multiline
                fullWidth
              />
            </CustomInput>
            <CustomInput
              tooltipText="tooltips.resources.me-reports.fields.recommendations"
              fullWidth
            >
              <TextInput
                label={translate("resources.me-reports.fields.recommendations")}
                variant="outlined"
                margin="none"
                source={`recommendations`}
                validate={required()}
                rows={5}
                multiline
                fullWidth
              />
            </CustomInput>
            <CustomInput
              tooltipText="tooltips.resources.me-reports.fields.lessons_learned"
              fullWidth
            >
              <TextInput
                label={translate("resources.me-reports.fields.lessons_learned")}
                variant="outlined"
                margin="none"
                source={`lessons_learned`}
                validate={required()}
                rows={5}
                multiline
                fullWidth
              />
            </CustomInput>
            <CustomInput
              tooltipText="tooltips.resources.me-reports.fields.remarks"
              fullWidth
            >
              <TextInput
                label={translate("resources.me-reports.fields.remarks")}
                variant="outlined"
                margin="none"
                source={`remarks`}
                validate={required()}
                rows={5}
                multiline
                fullWidth
              />
            </CustomInput>
            <CustomInput
              tooltipText="tooltips.resources.me-reports.fields.overall_project_rating"
              fullWidth
            >
              <TextInput
                label={translate(
                  "resources.me-reports.fields.overall_project_rating"
                )}
                variant="outlined"
                margin="none"
                source={`overall_project_rating`}
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

export default MERecommendationsForm;
