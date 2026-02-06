import {
  ArrayInput,
  SimpleFormIterator,
  FormDataConsumer,
  required,
  useTranslate,
  SelectInput,
  TextInput,
  minValue,
  maxValue,
  Labeled,
} from "react-admin";
import React, { Component, Fragment, useMemo } from "react";

import CustomInput from "../../../../components/CustomInput";
import {
  checkFeature,
  useChangeField,
} from "../../../../../helpers/checkPermission";
import lodash from "lodash";
import { useFormState } from "react-final-form";
import { checkRequired } from "../../../../resources/Projects/validation";

function Criterias(props) {
  const { getSource, record } = props;
  const translate = useTranslate();
  const changeCriterias = useChangeField({
    name: getSource(`${props.module}.criteria`),
  });
  const formValues = useFormState().values;

  useMemo(() => {
    if (checkFeature("has_default_array_input_value") && formValues) {
      if (lodash.get(formValues, getSource(`${props.module}.criteria`))) {
        if (
          lodash.get(formValues, getSource(`${props.module}.criteria`)).length === 0
        ) {
          changeCriterias([{}]);
        }
      } else {
        changeCriterias([{}]);
      }
    }
  }, [props.record]);

  return (
    <ArrayInput source={getSource(`${props.module}.criteria`)} label={false}>
      <SimpleFormIterator
        disableAdd={props.disabled}
        disableRemove={props.disabled}
      >
        <FormDataConsumer>
          {({ getSource, scopedFormData, formData, ...rest }) => {
            return (
              <div>
                <CustomInput
                  tooltipText={
                    "tooltips.resources.project_options.fields.analytical_modules.criterias.criteria_title"
                  }
                  fullWidth
                >
                  <TextInput
                    variant="outlined"
                    validate={checkRequired("project_options.criteria", "title")}
                    margin="none"
                    options={{ fullWidth: "true", disabled: props.disabled }}
                    source={getSource("title")}
                    label={translate(
                      "resources.project_options.fields.analytical_modules.criterias.criteria_title"
                    )}
                  />
                </CustomInput>
                <CustomInput
                  tooltipText={
                    "tooltips.resources.project_options.fields.analytical_modules.criterias.criteria_value"
                  }
                  fullWidth
                >
                  <TextInput
                    variant="outlined"
                    validate={checkRequired("project_options.criteria", "criteria_value")}
                    margin="none"
                    options={{ fullWidth: "true", disabled: props.disabled }}
                    source={getSource("criteria_value")}
                    label={translate(
                      "resources.project_options.fields.analytical_modules.criterias.criteria_value"
                    )}
                  />
                </CustomInput>
                <CustomInput
                  tooltipText={
                    "tooltips.resources.project_options.fields.analytical_modules.criterias.measure_unit"
                  }
                  fullWidth
                >
                  <TextInput
                    validate={checkRequired("project_options.criteria", "measure_unit")}
                    variant="outlined"
                    margin="none"
                    options={{ fullWidth: "true", disabled: props.disabled }}
                    source={getSource("measure_unit")}
                    label={translate(
                      "resources.project_options.fields.analytical_modules.criterias.measure_unit"
                    )}
                  />
                </CustomInput>
              </div>
            );
          }}
        </FormDataConsumer>
      </SimpleFormIterator>
    </ArrayInput>
  );
}
export default Criterias;
