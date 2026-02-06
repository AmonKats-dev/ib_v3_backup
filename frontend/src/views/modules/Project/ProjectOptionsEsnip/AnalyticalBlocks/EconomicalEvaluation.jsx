import {
  number,
  required,
  useTranslate,
  SelectInput,
  TextInput,
  minValue,
  maxValue,
} from "react-admin";
import React, { Component, Fragment } from "react";

import CustomInput from "../../../../components/CustomInput";
import { commasFormatter, commasParser } from "../../../../../helpers";
import CustomTextArea from "../../../../components/CustomTextArea";
import Criterias from "./Criterias";

function EconomicalEvaluation(props) {
  const translate = useTranslate();

  const { getSource, scopedFormData, formData } = props;

  if (
    scopedFormData &&
    scopedFormData.economic_evaluation &&
    scopedFormData.economic_evaluation.appraisal_methodology &&
    scopedFormData.economic_evaluation.appraisal_methodology === "CEA"
  ) {
    scopedFormData.economic_evaluation.enpv = "0";
    scopedFormData.economic_evaluation.err = "0";
  }
  if (
    scopedFormData &&
    scopedFormData.economic_evaluation &&
    scopedFormData.economic_evaluation.appraisal_methodology &&
    scopedFormData.economic_evaluation.appraisal_methodology === "CBA"
  ) {
    scopedFormData.economic_evaluation.criterias = [];
  }

  return (
    <Fragment>
      <div>
        <CustomInput
          tooltipText={
            "tooltips.resources.project_options.fields.analytical_modules.economic_evaluation.appraisal_methodology"
          }
          fullWidth
        >
          <SelectInput
            validate={required()}
            variant="outlined"
            margin="none"
            options={{ fullWidth: "true", disabled: props.disabled }}
            className="boolean-selector"
            label={translate(
              "resources.project_options.fields.analytical_modules.appraisal_methodology.title"
            )}
            source={getSource("economic_evaluation.appraisal_methodology")}
            choices={[
              {
                id: "CBA",
                name: translate(
                  "resources.project_options.fields.analytical_modules.appraisal_methodology.cba"
                ),
              },
              {
                id: "CEA",
                name: translate(
                  "resources.project_options.fields.analytical_modules.appraisal_methodology.cea"
                ),
              },
            ]}
          />
        </CustomInput>
        {scopedFormData &&
        scopedFormData.economic_evaluation &&
        scopedFormData.economic_evaluation.appraisal_methodology &&
        scopedFormData.economic_evaluation.appraisal_methodology === "CBA" ? (
          <Fragment>
            <CustomInput
              tooltipText={
                "tooltips.resources.project_options.fields.analytical_modules.economic_evaluation.enpv"
              }
              fullWidth
            >
              <TextInput
                variant="outlined"
                margin="none"
                source={getSource("economic_evaluation.enpv")}
                label={translate(
                  "resources.project_options.fields.analytical_modules.economic_evaluation.enpv"
                )}
                validate={[number(), required()]}
                format={commasFormatter}
                parse={commasParser}
                options={{ fullWidth: "true", disabled: props.disabled }}
                disabled={props.disabled}
              />
            </CustomInput>
            <CustomInput
              tooltipText={
                "tooltips.resources.project_options.fields.analytical_modules.economic_evaluation.err"
              }
              fullWidth
            >
              <TextInput
                variant="outlined"
                margin="none"
                source={getSource("economic_evaluation.err")}
                label={translate(
                  "resources.project_options.fields.analytical_modules.economic_evaluation.err"
                )}
                options={{ fullWidth: "true", disabled: props.disabled }}
                validate={[number(), minValue(-100), maxValue(100), required()]}
                disabled={props.disabled}
              />
            </CustomInput>
          </Fragment>
        ) : null}
        {scopedFormData &&
        scopedFormData.economic_evaluation &&
        scopedFormData.economic_evaluation.appraisal_methodology &&
        scopedFormData.economic_evaluation.appraisal_methodology === "CEA" ? (
          <Criterias {...props} module="economic_evaluation" />
        ) : null}
      </div>

      <CustomInput
        tooltipText={
          "tooltips.resources.project_options.fields.analytical_modules.economic_evaluation.summary"
        }
        textArea
      >
        <CustomTextArea
          {...props}
          source={getSource("economic_evaluation.summary")}
          formData={formData}
          validate={required()}
          isRequired
          label={translate(
            "resources.project_options.fields.analytical_modules.economic_evaluation.summary"
          )}
        />
      </CustomInput>
    </Fragment>
  );
}

export default EconomicalEvaluation;
