import React, { Fragment, Component, useState } from "react";
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
import BuildingBlocks from "./BuildingBlocks";
import AnalyticalBlocks from "./AnalyticalBlocks";
import DescriptionBlock from "./DescriptionBlock";
import { useMemo } from "react";
import PreferedSelection from "./PreferedSelection";
import { checkFeature } from "../../../../helpers/checkPermission";

function ProjectAppraisal(props) {
  const [shortlistedOptions, setShortlistedOptions] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [tempStep, setTempStep] = useState(0);
  const translate = useTranslate();
  const showNotification = useNotify();
  const formValues = useFormState().values;

  function getTopScoredOptions(isBestId) {
    if (!formValues) return null;
    if (
      !formValues.project_options ||
      (formValues.project_options && formValues.project_options.length === 0)
    )
      return null;

    const optionsScore =
      formValues.project_options &&
      formValues.project_options.map((option, idx) => {
        if (!option) return null;

        return {
          id: option.id,
          idx: idx,
          name: option.name,
          score:
            (option.demand_module ? option.demand_module.score : 0) +
            (option.technical_module ? option.technical_module.score : 0) +
            (option.environmental_module
              ? option.environmental_module.score
              : 0) +
            (option.hr_module ? option.hr_module.score : 0) +
            (option.legal_module ? option.legal_module.score : 0),
        };
      });
    const shortlistedOptions = lodash
      .sortBy(optionsScore, "score")
      .reverse()
      .slice(0, optionsScore.length > 3 ? 3 : optionsScore.length); //top scored 3 selection

    formValues.project_options.forEach((item, idx) => {
      if (item) {
        if (item.is_preferred) {
          formValues.is_preferred = idx;
        }
        item.is_shortlisted = 0;
        item.is_preferred = 0;
      }
    });

    if (!lodash.isEmpty(shortlistedOptions)) {
      shortlistedOptions.forEach((item, idx) => {
        if (item) {
          formValues.project_options[item.idx].is_shortlisted =
            idx < 3 && item.score > 0 ? 1 : 0;
          formValues.project_options[item.idx].score = isNaN(item.score)
            ? 0
            : item.score;

          if (
            typeof isBestId !== "undefined" ||
            (formValues && typeof formValues.is_preferred !== "undefined")
          ) {
            const bestOptionIndex =
              isBestId || (formValues && formValues.is_preferred);
            if (formValues.project_options[bestOptionIndex]) {
              formValues.project_options[bestOptionIndex].is_preferred = 1;
            }
          }
        }
      });
    }

    return shortlistedOptions.filter((item) => (item ? item.score > 0 : false));
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
      // if (
      //   nextProps.formValues &&
      //   formValues &&
      //   nextProps.formValues.is_preferred !== formValues.is_preferred
      // ) {
      //   getTopScoredOptions(nextProps.formValues.is_preferred);
      // } else {
      getTopScoredOptions(formValues.is_preferred);
      // }
      // if (nextProps.isSaving === false) {
      //   setActiveStep(tempStep);
      // }
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
      modulesValidation = validateModulesFill(formValues, translate);
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
    if (step > 2) {
      topOptions = formValues.project_options.filter(
        (item) => item.is_shortlisted
      );

      evaluationsValidation = validateEvaluationsFill(formValues, translate);
      if (evaluationsValidation.length !== 0) {
        showNotification(
          `${translate(
            "validation.empty_fields"
          )}: ${evaluationsValidation.join(", ")}`,
          "warning"
        );
        return;
      }
    }
    if (step === 3) {
      topOptionsValidation = validateTopOptions(formValues, translate);

      if (topOptionsValidation) {
        lodash.keys(topOptionsValidation).forEach((key) => {
          if (topOptionsValidation[key].length > 1) {
            const sameOptions = topOptionsValidation[key]
              .map((option) => option.name)
              .join(", ");
            showNotification(`${sameOptions} has the same score`, "warning");
          }
        });
      }
    }

    props.setOptionStep(step);
    props.save(formValues, false);
  };

  function renderStepContent(activeStep) {
    switch (activeStep) {
      case 0:
        return <DescriptionBlock {...props} activeStep={activeStep} />;
      case 1:
        return <BuildingBlocks {...props} activeStep={activeStep} />;
      case 2:
        return <AnalyticalBlocks {...props} activeStep={activeStep} />;
      case 3:
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
    return [
      translate("resources.project_options.fields.stepper.description"),
      translate("resources.project_options.fields.stepper.building_blocks"),
      translate("resources.project_options.fields.stepper.analytical_modules"),
      translate("resources.project_options.fields.stepper.best_option"),
    ];
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
                  <BuildingBlocks
                    getSource={getSource}
                    record={props.record}
                    formData={formData}
                    scopedFormData={scopedFormData}
                    disabled={checkFeature(
                      "project_options_disable_input",
                      Number(formData.phase_id)
                    )}
                    {...props}
                    activeStep={activeStep}
                  />
                  <AnalyticalBlocks
                    getSource={getSource}
                    record={props.record}
                    formData={formData}
                    scopedFormData={scopedFormData}
                    {...props}
                    activeStep={activeStep}
                    disabled={checkFeature(
                      "project_options_disable_input",
                      Number(formData.phase_id)
                    )}
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

    return (
      <div style={{ position: "relative", minHeight: "275px" }}>
        <h4>{translate("resources.project_options.name")}</h4>
        <Grid container>
          <Grid item xs={3}>
            <Stepper
              orientation="vertical"
              activeStep={props.optionsStep}
              style={{ position: "fixed" }}
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
          <Grid item xs={8}>
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

export default connect(mapStateToProps, null)(ProjectAppraisal);
