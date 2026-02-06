import {
  SelectInput,
  required,
  useTranslate,
  ArrayInput,
  FormDataConsumer,
  Labeled,
  SimpleFormIterator,
  BooleanInput,
} from "react-admin";
import React, { Component, Fragment, useEffect } from "react";
import lodash from "lodash";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import { useState } from "react";
import FinancialEvaluation from "../AnalyticalBlocks/FinancialEvaluation";
import EconomicalEvaluation from "../AnalyticalBlocks/EconomicalEvaluation";
import Stakeholders from "../AnalyticalBlocks/Stakeholders";
import Risks from "../AnalyticalBlocks/Risks";
import CustomInput from "../../../../components/CustomInput";
import CustomTextArea from "../../../../components/CustomTextArea";
import { useFormState } from "react-final-form";
import { costSumFormatter } from "../../../../../helpers";
import {
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { checkRequired } from "../../../../resources/Projects/validation";

function PreferedSelection(props) {
  const [selected, setSelected] = useState(null);
  const translate = useTranslate();
  const formValues = useFormState().values;

  useEffect(() => {
    if (formValues && formValues.project_options) {
      const isBest = lodash.find(
        formValues.project_options,
        (item) => item.is_preferred
      );
      if (isBest) {
        setSelected(isBest.id);
      }
    }
  }, []);

  function renderSummaryOptionsInfo() {
    return (
      <div style={{ marginBottom: 25 }}>
        <Typography variant="h4">
          {translate("resources.project_options.fields.summary.title")}
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow className="filled-row">
              <TableCell></TableCell>
              <TableCell colSpan="3">
                {translate(
                  "resources.project_options.fields.analytical_modules.financial_evaluation.summary"
                )}
              </TableCell>
              <TableCell colSpan="3">
                {translate(
                  "resources.project_options.fields.analytical_modules.economic_evaluation.summary"
                )}
              </TableCell>
            </TableRow>
            <TableRow className="filled-row">
              <TableCell>
                {translate("resources.project_options.fields.title")}
              </TableCell>
              <TableCell>
                {translate(
                  "resources.project_options.fields.analytical_modules.financial_evaluation.fnpv"
                )}
              </TableCell>
              <TableCell>
                {translate(
                  "resources.project_options.fields.analytical_modules.financial_evaluation.irr"
                )}
              </TableCell>
              <TableCell>CBA / CEA</TableCell>
              <TableCell>
                {translate(
                  "resources.project_options.fields.analytical_modules.economic_evaluation.enpv"
                )}
              </TableCell>
              <TableCell>
                {translate(
                  "resources.project_options.fields.analytical_modules.economic_evaluation.err"
                )}
              </TableCell>
              <TableCell>CBA / CEA</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formValues &&
              formValues.project_options &&
              formValues.project_options
                .filter((option) => option.is_shortlisted)
                .map((option, idx) => (
                  <TableRow>
                    <TableCell>{option.name}</TableCell>
                    <TableCell>
                      {option.financial_evaluation &&
                        costSumFormatter(option.financial_evaluation.fnpv)}
                    </TableCell>
                    <TableCell>
                      {(option.financial_evaluation &&
                        option.financial_evaluation.irr) ||
                        "-"}
                    </TableCell>
                    <TableCell style={{ textTransform: "uppercase" }}>
                      {option.financial_evaluation &&
                        option.financial_evaluation.appraisal_methodology}
                    </TableCell>
                    <TableCell>
                      {option.economic_evaluation &&
                        costSumFormatter(option.economic_evaluation.enpv)}
                    </TableCell>
                    <TableCell>
                      {(option.economic_evaluation &&
                        option.economic_evaluation.err) ||
                        "-"}
                    </TableCell>
                    <TableCell style={{ textTransform: "uppercase" }}>
                      {option.economic_evaluation &&
                        option.economic_evaluation.appraisal_methodology}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  function handleChange(event) {
    setSelected(event.target.value);
    formValues.project_options.forEach((option) => {
      option.is_preferred = false;
    });
    formValues.project_options[
      getOptionId(event.target.value)
    ].is_preferred = true;
  }

  function getOptionId(selected) {
    return selected
      ? lodash.findIndex(
          formValues.project_options,
          (item) => Number(item.id) === Number(selected)
        )
      : null;
  }

  return (
    <Fragment>
      {renderSummaryOptionsInfo()}
      <Select
        fullWidth
        variant="outlined"
        value={selected}
        onChange={handleChange}
      >
        {props.onGetTopScoredOptions() &&
          props.onGetTopScoredOptions().map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
      </Select>
      {selected && getOptionId() > -1 ? (
        <Fragment>
          <CustomInput
            tooltipText={
              "tooltips.resources.project_options.fields.justification"
            }
            textArea
          >
            <CustomTextArea
              label={translate(
                "resources.project_options.fields.justification"
              )}
              source={`project_options[${getOptionId(selected)}].justification`}
              validate={[required()]}
              formData={formValues}
              isRequired
              {...props}
            />
          </CustomInput>
          <CustomInput
            tooltipText={
              "tooltips.resources.project_options.fields.modality_justification"
            }
            textArea
          >
            <CustomTextArea
              isRequired
              label={translate(
                `resources.project_options.fields.modality_justification`
              )}
              validate={checkRequired("modality_justification")}
              source={`project_options[${getOptionId(
                selected
              )}].modality_justification`}
              formData={formValues}
              {...props}
            />
          </CustomInput>
        </Fragment>
      ) : null}
    </Fragment>
  );
}

export default PreferedSelection;
