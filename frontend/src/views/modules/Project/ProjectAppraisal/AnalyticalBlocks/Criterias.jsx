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
import React, { Component, Fragment } from "react";

import CustomInput from "../../../../components/CustomInput";

function Criterias(props) {
  const { getSource } = props;
  const translate = useTranslate();

  return (
    <ArrayInput
      source={getSource(`${props.module}.criteria`)}
      label={translate(
        "resources.project_options.fields.analytical_modules.criterias.title"
      )}
    >
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
