import React, { Fragment } from "react";
import CustomInput from "../../../components/CustomInput";
import {
  FormDataConsumer,
  useTranslate,
  NumberInput,
  BooleanInput,
  number,
  SelectInput,
  minValue,
  required,
} from "react-admin";
import { checkFeature } from "../../../../helpers/checkPermission";
import { Typography } from "@material-ui/core";
import { checkRequired } from "../../../resources/Projects/validation";

function OperationMaintenance(props) {
  const translate = useTranslate();
  const { record } = props;

  return record && checkFeature("project_om_cost_show", record.phase_id) ? (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, ...rest }) => {
        if (
          checkFeature("project_om_cost_drop_down_selection", record.phase_id)
        ) {
          return (
            <Fragment>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h5">
                  {translate("resources.project-details.fields.is_omp")}
                </Typography>
                <CustomInput
                  tooltipText={
                    "tooltips.resources.project-details.fields.is_omp"
                  }
                  bool
                >
                  <SelectInput
                    source="is_omp"
                    variant="outlined"
                    label={false}
                    choices={[
                      { id: true, name: "Yes" },
                      { id: false, name: "No" },
                    ]}
                  />
                </CustomInput>
              </div>
              {formData && formData.is_omp ? (
                <Fragment>
                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project-details.fields.maintenance_period"
                    }
                  >
                    <NumberInput
                      source="maintenance_period"
                      label={translate(
                        "resources.project-details.fields.maintenance_period"
                      )}
                      step={1}
                      validate={[number(), minValue(1), checkRequired("maintenance_period")]}
                      variant="outlined"
                      margin="none"
                    />
                  </CustomInput>
                </Fragment>
              ) : null}
            </Fragment>
          );
        }

        if (
          formData &&
          formData.maintenance_period &&
          formData.maintenance_period < 0
        ) {
          formData.maintenance_period = 1;
        }

        return (
          <Fragment>
            <CustomInput
              tooltipText={"tooltips.resources.project-details.fields.is_omp"}
              bool
            >
              <BooleanInput
                source="is_omp"
                label={translate("resources.project-details.fields.is_omp")}
              />
            </CustomInput>
            {formData && formData.is_omp ? (
              <Fragment>
                <CustomInput
                  tooltipText={
                    "tooltips.resources.project-details.fields.maintenance_period"
                  }
                >
                  <NumberInput
                    source="maintenance_period"
                    label={translate(
                      "resources.project-details.fields.maintenance_period"
                    )}
                    step={1}
                    validate={[number(), checkRequired("maintenance_period")]}
                    variant="outlined"
                    margin="none"
                  />
                </CustomInput>
              </Fragment>
            ) : null}
          </Fragment>
        );
      }}
    </FormDataConsumer>
  ) : null;
}

export default OperationMaintenance;
