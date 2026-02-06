import {
  number,
  useTranslate,
  SelectInput,
  TextInput,
  minValue,
  maxValue,
  Labeled,
  required,
} from "react-admin";
import React, { Component, Fragment } from "react";

import CustomInput from "../../../../components/CustomInput";
import { commasFormatter, commasParser } from "../../../../../helpers";
import CustomTextArea from "../../../../components/CustomTextArea";
import Criterias from "./Criterias";

function FinancialEvaluation(props) {
  const translate = useTranslate();

  const { getSource, scopedFormData, formData } = props;

  if (
    scopedFormData &&
    scopedFormData.financial_evaluation &&
    scopedFormData.financial_evaluation.appraisal_methodology &&
    scopedFormData.financial_evaluation.appraisal_methodology === "CEA"
  ) {
    scopedFormData.financial_evaluation.fnpv = "0";
    scopedFormData.financial_evaluation.irr = "0";
  }
  if (
    scopedFormData &&
    scopedFormData.financial_evaluation &&
    scopedFormData.financial_evaluation.appraisal_methodology &&
    scopedFormData.financial_evaluation.appraisal_methodology === "CBA"
  ) {
    scopedFormData.financial_evaluation.criterias = [];
  }

  return (
    <Fragment>
      <div>
        <CustomInput
          tooltipText={
            "tooltips.resources.project_options.fields.analytical_modules.financial_evaluation.appraisal_methodology"
          }
          fullWidth
        >
          <SelectInput
            validate={required()}
            variant="outlined"
            margin="none"
            options={{ fullWidth: "true", disabled: props.disabled }}
            className="boolean-selector"
            disabled={props.disabled}
            label={translate(
              "resources.project_options.fields.analytical_modules.appraisal_methodology.title"
            )}
            source={getSource("financial_evaluation.appraisal_methodology")}
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
        scopedFormData.financial_evaluation &&
        scopedFormData.financial_evaluation.appraisal_methodology &&
        scopedFormData.financial_evaluation.appraisal_methodology === "CBA" ? (
          <Fragment>
            <CustomInput
              tooltipText={
                "tooltips.resources.project_options.fields.analytical_modules.financial_evaluation.fnpv"
              }
              fullWidth
            >
              <TextInput
                variant="outlined"
                margin="none"
                source={getSource("financial_evaluation.fnpv")}
                label={translate(
                  "resources.project_options.fields.analytical_modules.financial_evaluation.fnpv"
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
                "tooltips.resources.project_options.fields.analytical_modules.financial_evaluation.irr"
              }
              fullWidth
            >
              <TextInput
                variant="outlined"
                margin="none"
                source={getSource("financial_evaluation.irr")}
                label={translate(
                  "resources.project_options.fields.analytical_modules.financial_evaluation.irr"
                )}
                validate={[number(), minValue(-100), maxValue(100), required()]}
                options={{ fullWidth: "true", disabled: props.disabled }}
                disabled={props.disabled}
              />
            </CustomInput>
          </Fragment>
        ) : null}
        {scopedFormData &&
        scopedFormData.financial_evaluation &&
        scopedFormData.financial_evaluation.appraisal_methodology &&
        scopedFormData.financial_evaluation.appraisal_methodology === "CEA" ? (
          <Criterias {...props} module="financial_evaluation" />
        ) : null}
      </div>

      <CustomInput
        tooltipText={
          "tooltips.resources.project_options.fields.analytical_modules.financial_evaluation.summary"
        }
        textArea
      >
        <CustomTextArea
          {...props}
          source={getSource("financial_evaluation.summary")}
          formData={formData}
          disabled={props.disabled}
          validate={required()}
          label={translate(
            "resources.project_options.fields.analytical_modules.financial_evaluation.summary"
          )}
          isRequired
        />
      </CustomInput>
    </Fragment>
  );
}

export default FinancialEvaluation;
