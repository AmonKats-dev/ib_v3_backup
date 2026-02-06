import React, { Fragment, useMemo } from "react";
import {
  ArrayInput,
  FormDataConsumer,
  SimpleFormIterator,
  TextInput,
  useTranslate,
  required,
  maxLength,
  number,
} from "react-admin";
import CustomInput from "../../../../components/CustomInput";
import { getIndicatorsYears } from "../../../../../helpers/formatters";
import useCheckFeature from "../../../../../hooks/useCheckFeature";
import {
  checkFeature,
  useChangeField,
} from "../../../../../helpers/checkPermission";
import lodash from "lodash";
import { useFormState } from "react-final-form";

function EditForm({ record, ...props }) {
  const translate = useTranslate();
  const changeIndicators = useChangeField({ name: props.source });
  const formValues = useFormState().values;

  useMemo(() => {
    if (checkFeature("has_default_array_input_value") && formValues) {
      if (lodash.get(formValues, props.source)) {
        if (lodash.get(formValues, props.source).length === 0) {
          changeIndicators([{}]);
        }
      } else {
        changeIndicators([{}]);
      }
    }
  }, [record]);

  return (
    <ArrayInput source={props.source} label={null} className="iterator">
      <SimpleFormIterator>
        <FormDataConsumer>
          {({ getSource, scopedFormData, formData, ...rest }) => {
            if (props.targetYears && scopedFormData) {
              const formattedTargetYears = props.targetYears.map((year) =>
                Number(year.id)
              );
              lodash.keys(scopedFormData.targets).forEach((year) => {
                const currYear = year.slice(0, year.length - 1);
                if (!formattedTargetYears.includes(Number(currYear))) {
                  delete scopedFormData.targets[year];
                }
              });
            }

            return (
              <Fragment>
                <CustomInput
                  tooltipText={"tooltips.resources.indicators.fields.name"}
                  fullWidth
                >
                  <TextInput
                    validate={[required(), maxLength(255)]}
                    source={getSource("name")}
                    label={translate("resources.indicators.fields.name")}
                    variant="outlined"
                    margin="none"
                  />
                </CustomInput>
                <CustomInput
                  tooltipText={"tooltips.resources.indicators.fields.baseline"}
                  fullWidth
                >
                  <TextInput
                    validate={[required(), maxLength(255)]}
                    source={getSource("baseline")}
                    label={`${translate(
                      "resources.indicators.fields.baseline"
                    )} - ${getIndicatorsYears(formData.baseline).name || "-"}`}
                    variant="outlined"
                    margin="none"
                  />
                </CustomInput>

                {!checkFeature("has_pimis_fields") &&
                  props.targetYears &&
                  props.targetYears.map((target) => (
                    <CustomInput
                      tooltipText={"resources.indicators.fields.target"}
                      fullWidth
                    >
                      <TextInput
                        validate={[required(), number()]}
                        label={target.name}
                        source={getSource(`targets.` + String(target.id) + "y")}
                        variant="outlined"
                        margin="none"
                      />
                    </CustomInput>
                  ))}

                {checkFeature("has_pimis_fields") && (
                  <CustomInput
                    tooltipText={"resources.indicators.fields.target"}
                    fullWidth
                  >
                    <TextInput
                      validate={[required(), maxLength(255)]}
                      label="End of Project Target"
                      source={getSource(`targets.project`)}
                      variant="outlined"
                      margin="none"
                    />
                  </CustomInput>
                )}

                <CustomInput
                  tooltipText={
                    "tooltips.resources.indicators.fields.verification_means"
                  }
                  fullWidth
                >
                  <TextInput
                    validate={[required(), maxLength(255)]}
                    source={getSource("verification_means")}
                    label={translate(
                      "resources.indicators.fields.verification_means"
                    )}
                    variant="outlined"
                    margin="none"
                  />
                </CustomInput>
                {checkFeature("has_pimis_fields") ? (
                  <Fragment>
                    <CustomInput
                      tooltipText={
                        "tooltips.resources.indicators.fields.assumptions"
                      }
                      fullWidth
                    >
                      <TextInput
                        source={getSource("assumptions")}
                        validate={[required(), maxLength(255)]}
                        label={translate(
                          "resources.indicators.fields.assumptions"
                        )}
                        variant="outlined"
                        margin="none"
                      />
                    </CustomInput>
                    <CustomInput
                      tooltipText={
                        "tooltips.resources.indicators.fields.risk_factors"
                      }
                      fullWidth
                    >
                      <TextInput
                        source={getSource("risk_factors")}
                        validate={[required(), maxLength(255)]}
                        label={translate(
                          "resources.indicators.fields.risk_factors"
                        )}
                        variant="outlined"
                        margin="none"
                      />
                    </CustomInput>
                  </Fragment>
                ) : (
                  props.source &&
                  props.source !== "indicators" && (
                    <Fragment>
                      <CustomInput
                        tooltipText={
                          "tooltips.resources.indicators.fields.assumptions"
                        }
                        fullWidth
                      >
                        <TextInput
                          source={getSource("assumptions")}
                          validate={[required(), maxLength(255)]}
                          label={translate(
                            "resources.indicators.fields.assumptions"
                          )}
                          variant="outlined"
                          margin="none"
                        />
                      </CustomInput>
                      <CustomInput
                        tooltipText={
                          "tooltips.resources.indicators.fields.risk_factors"
                        }
                        fullWidth
                      >
                        <TextInput
                          source={getSource("risk_factors")}
                          validate={[required(), maxLength(255)]}
                          label={translate(
                            "resources.indicators.fields.risk_factors"
                          )}
                          variant="outlined"
                          margin="none"
                        />
                      </CustomInput>
                    </Fragment>
                  )
                )}
              </Fragment>
            );
          }}
        </FormDataConsumer>
      </SimpleFormIterator>
    </ArrayInput>
  );
}

export default EditForm;
