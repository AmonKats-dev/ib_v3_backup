import React, { Fragment, Component, useState, useLayoutEffect } from "react";
import {
  ArrayInput,
  BooleanInput,
  FormDataConsumer,
  SimpleFormIterator,
  TextInput,
  translate,
  SelectInput,
  useTranslate,
  number,
  DisabledInput,
  maxValue,
  required,
  showNotification,
  Labeled,
  useNotify,
  ArrayField,
  SingleFieldList,
} from "react-admin";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Table from "@material-ui/core/Table";
import Typography from "@material-ui/core/Typography";
import StepIcon from "@material-ui/core/StepIcon";
import CircularProgress from "@material-ui/core/CircularProgress";

// import BuildingBlocks from "./BuildingBlocks";
// import AnalyticalModules from "./AnalyticalModules";

import lodash from "lodash";
// import { updateSyncErrors } from 'redux-form/lib/actions';
import { connect } from "react-redux";
import { useEffect } from "react";
import {
  costSumFormatter,
  validateSummaryFill,
  validateModulesFill,
  validateEvaluationsFill,
  validateTopOptions,
} from "../../../../helpers";
import { Grid } from "@material-ui/core";
import { useFormState } from "react-final-form";
import AnalyticalBlocks from "./AnalyticalBlocks";
import DescriptionBlock from "./DescriptionBlock";
import { useMemo } from "react";
import PreferedSelection from "./PreferedSelection";
import {
  checkFeature,
  useChangeField,
} from "../../../../helpers/checkPermission";
import CustomInput from "../../../components/CustomInput";
import CustomTextArea from "../../../components/CustomTextArea";
import useCheckFeature from "../../../../hooks/useCheckFeature";
import { checkRequired } from "../../../resources/Projects/validation";

function ProjectOptionsPimis(props) {
  const [shortlistedOptions, setShortlistedOptions] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [tempStep, setTempStep] = useState(0);
  const translate = useTranslate();
  const showNotification = useNotify();
  const formValues = useFormState().values;
  const has_project_options_modules = useCheckFeature(
    "has_project_options_modules",
    props.record && props.record.phase_id
  );

  const changeOptions = useChangeField({ name: "project_options" });

  useMemo(() => {
    if (checkFeature("has_default_array_input_value")) {
      if (lodash.get(formValues, "project_options")) {
        if (lodash.get(formValues, "project_options").length === 0) {
          changeOptions([{}]);
        }
      } else {
        changeOptions([{}]);
      }
    }
  }, [props.record]);

  function getTopScoredOptions(isBestId) {
    if (!formValues) return null;
    if (
      !formValues.project_options ||
      (formValues.project_options && formValues.project_options.length === 0)
    )
      return null;

    return (
      formValues.project_options &&
      formValues.project_options.filter((item) => item && item.is_shortlisted)
    );
  }

  useEffect(
    (props) => {
      if (props) {
        const { record } = props;

        if (!record) return null;

        const isBest = lodash.findIndex(
          record.project_options,
          (item) => item.is_preferred
        );
        if (record && typeof isBest !== "undefined") {
          record.is_preferred = isBest;
        }
      }
    },
    [props.record]
  );

  useMemo(
    (props) => {
      getTopScoredOptions(formValues.is_preferred);
    },
    [formValues]
  );

  const handleStep = (step) => () => {
    const { record } = props;
    let summaryValidation,
      topOptions,
      topOptionsValidation,
      modulesValidation,
      evaluationsValidation;

    if (step >= 0) {
      summaryValidation = validateSummaryFill(formValues, translate);

      if (summaryValidation.length !== 0) {
        showNotification(
          `${translate("validation.empty_fields")}: ${summaryValidation.join(
            ", "
          )}`,
          "warning"
        );
        return;
      }
    }
    if (step > 1) {
      topOptions = formValues.project_options.filter(
        (item) => item.is_shortlisted
      );
      modulesValidation = validateEvaluationsFill(formValues, translate);
      if (modulesValidation.length !== 0) {
        showNotification(
          `${translate("validation.empty_fields")}: ${modulesValidation.join(
            ", "
          )}`,
          "warning"
        );
        return;
      }
    }
    // if (step === 2) {
    //   topOptionsValidation = formValues.project_options.filter(
    //     (item) => item.is_preferred
    //   );

    //   if (topOptionsValidation) {
    //     if (topOptionsValidation.length === 0){
    //       showNotification(
    //         `${translate("validation.project_options.is_preferred")}`,
    //         "warning"
    //       );
    //       return;
    //     }
    //   }
    // }

    props.setOptionStep(step);
    props.save(formValues, false);
  };

  function renderStepContent(activeStep) {
    switch (activeStep) {
      case 0:
        return <DescriptionBlock {...props} activeStep={activeStep} />;
      case 1:
        return <AnalyticalBlocks {...props} activeStep={activeStep} />;
      case 2:
        return (
          <PreferedSelection
            {...props}
            activeStep={activeStep}
            onGetTopScoredOptions={getTopScoredOptions}
          />
        );
      default:
        return null;
    }
  }

  function getSteps() {
    if (has_project_options_modules) {
      return [
        translate("resources.project_options.fields.stepper.description"),
        translate(
          "resources.project_options.fields.stepper.analytical_modules"
        ),
        translate("resources.project_options.fields.stepper.best_option"),
      ];
    }
    return [translate("resources.project_options.fields.stepper.description")];
  }

  function renderSingleform() {
    return (
      <ArrayInput source="project_options" label={null} className="iterator">
        <SimpleFormIterator disableAdd disableRemove>
          <FormDataConsumer>
            {({ getSource, scopedFormData, formData, ...rest }) => {
              return (
                <Fragment>
                  <h5>
                    <b>{scopedFormData && scopedFormData.title}</b>
                  </h5>
                  <AnalyticalBlocks
                    getSource={getSource}
                    record={props.record}
                    formData={formData}
                    scopedFormData={scopedFormData}
                    disabled={formData && formData.phase_id > 2}
                    {...props}
                    activeStep={activeStep}
                  />
                </Fragment>
              );
            }}
          </FormDataConsumer>
        </SimpleFormIterator>
      </ArrayInput>
    );
  }

  function renderStepper() {
    const steps = getSteps();
    const stepperStyle = { position: "absolute" };

    return (
      <div style={{ position: "relative", minHeight: "275px" }}>
        <h2>{translate("resources.project_options.name")}</h2>
        <Grid container>
          <Grid item xs={12}>
            <h3
              style={{
                width: "80%",
                margin: 10,
                marginBottom: 25,
                fontStyle: "italic",
              }}
            >
              The project proposer is required to identify and fully describe
              the range of options that may be considered for achieving the
              objective(s) of their project. One option should always be the
              option of doing nothing i.e. maintaining things as they are
              currently with no major change. For each option, the proposer
              should clearly outline among other things, the strengths,
              weaknesses, threat and opportunities. An initial estimate of the
              capital and annual operation cost associated with each option
              should be provided. At least two of these options shall be marked
              as “Shortlisted”. For these two options, users will need to
              provide quantitative indicators such as the Internal rate of
              return.
            </h3>
            <Fragment>
              <FormDataConsumer>
                {({ getSource, scopedFormData, formData, ...rest }) => {
                  formData.default_option_name = "Do Nothing";
                  return (
                    <CustomInput
                      tooltipText={
                        "tooltips.resources.project_options.fields.default_option_name"
                      }
                      fullWidth
                    >
                      <TextInput
                        label={false}
                        source={"default_option_name"}
                        variant="outlined"
                        margin="none"
                        validate={checkRequired("default_option_name")}
                        placeholder="Do Nothing"
                        disabled
                      />
                    </CustomInput>
                  );
                }}
              </FormDataConsumer>

              <CustomInput
                tooltipText={
                  "tooltips.resources.project_options.fields.default_option_description"
                }
                textArea
                fullWidth
              >
                <CustomTextArea
                  label={translate("resources.default_option_description")}
                  source={"default_option_description"}
                  formData={formValues}
                  validate={checkRequired("default_option_description")}
                  isRequired={Boolean(checkRequired("default_option_description"))}
                  {...props}
                />
              </CustomInput>
              <CustomInput
                tooltipText={
                  "tooltips.resources.project_options.fields.default_option_description_impact"
                }
                textArea
                fullWidth
              >
                <CustomTextArea
                  label={translate(
                    "resources.default_option_description_impact"
                  )}
                  source={"default_option_description_impact"}
                  formData={formValues}
                  validate={checkRequired("default_option_description_impact")}
                  isRequired={Boolean(checkRequired("default_option_description_impact"))}
                  {...props}
                />
              </CustomInput>
            </Fragment>
          </Grid>
          {has_project_options_modules &&
          formValues &&
          formValues.project_options &&
          formValues.project_options.length > 0 ? (
            <Grid item xs={3}>
              <Stepper
                orientation="vertical"
                activeStep={props.optionsStep}
                style={stepperStyle}
              >
                {steps.map((label, index) => {
                  const props = {};
                  const labelProps = {};
                  if (props.isSaving && tempStep === index) {
                    labelProps.icon = (
                      <CircularProgress size={25} thickness={2} />
                    );
                  }
                  return (
                    <Step key={label} {...props} onClick={handleStep(index)}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
            </Grid>
          ) : null}

          <Grid item xs={9}>
            {renderStepContent(props.optionsStep)}
          </Grid>
        </Grid>
      </div>
    );
  }

  const { record } = props;

  if (checkFeature("project_options_has_single_form", record.phase_id)) {
    return renderSingleform();
  }
  return renderStepper();
}

const mapStateToProps = (state) => ({
  isSaving: state.admin.saving,
});

export default connect(mapStateToProps, null)(ProjectOptionsPimis);
