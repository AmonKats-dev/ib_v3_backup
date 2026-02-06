import React, { Fragment } from "react";
import {
  FormDataConsumer,
  TextInput,
  useTranslate,
  required,
  maxLength,
} from "react-admin";
import CustomInput from "../../../../components/CustomInput";
import { useDispatch } from "react-redux";
import IndicatorList from "../Indicators/IndicatorList";
import IndicatorsButton from "../Indicators/IndicatorsButton";
import { getFiscalYearsRangeForIntervals } from "../../../../../helpers/formatters";
import { checkFeature } from "../../../../../helpers/checkPermission";
import CustomTextArea from "../../../../components/CustomTextArea";

function Goals(props) {
  const translate = useTranslate();
  //ToDO get targetYears

  return (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, handleSubmit, ...rest }) => {
        return (
          <Fragment>
            <CustomInput
              tooltipText={"tooltips.resources.project-details.fields.goal"}
              fullWidth
            >
              <TextInput
                validate={[required(), maxLength(255)]}
                source="goal"
                label={translate("resources.project-details.fields.goal")}
                variant="outlined"
                margin="none"
              />
            </CustomInput>
            {formData &&
              checkFeature(
                "project_result_matrix_goals_description_show",
                formData.phase_id
              ) && (
                <CustomInput
                  tooltipText={
                    "tooltips.resources.project-details.fields.goal_description"
                  }
                  fullWidth
                  textArea
                >
                  <CustomTextArea
                    label={translate(
                      "resources.project-details.fields.goal_description"
                    )}
                    source={"goal_description"}
                    validate={[required()]}
                    isRequired
                    formData={formData}
                    {...props}
                  />
                </CustomInput>
              )}
            <br />
            {formData &&
              checkFeature(
                "project_result_matrix_goals_indicators_show",
                formData.phase_id
              ) && (
                <Fragment>
                  <IndicatorsButton
                    record={formData}
                    onSave={props.save}
                    source={"indicators"}
                    targetYears={getFiscalYearsRangeForIntervals(
                      props.record.start_date,
                      props.record.end_date
                    )}
                    type="goals"
                  />
                  {formData.indicators && formData.indicators.length !== 0 && (
                    <IndicatorList
                      indicators={formData.indicators}
                      type="goals"
                    />
                  )}
                </Fragment>
              )}
          </Fragment>
        );
      }}
    </FormDataConsumer>
  );
}

export default Goals;
