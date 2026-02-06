import lodash, { find } from "lodash";
import lodashMemoize from "lodash/memoize";
import { required } from "react-admin";
import { VALIDATION } from "../../../constants/auth";
import { PROJECT_STEPS, VALIDATION_FIELDS } from "../../../constants/common";
import { checkFeature } from "../../../helpers/checkPermission";

var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };

/* eslint-disable no-underscore-dangle */
/* @link http://stackoverflow.com/questions/46155/validate-email-address-in-javascript */
var EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line no-useless-escape
var isEmpty = function (value) {
  return typeof value === "undefined" || value === null || value === "";
};
var getMessage = function (message, messageArgs, value, values, props) {
  return typeof message === "function"
    ? message(
      __assign({ args: messageArgs, value: value, values: values }, props)
    )
    : props.translate(message, __assign({ _: message }, messageArgs));
};
// If we define validation functions directly in JSX, it will
// result in a new function at every render, and then trigger infinite re-render.
// Hence, we memoize every built-in validator to prevent a "Maximum call stack" error.
var memoize = function (fn) {
  return lodashMemoize(fn, function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    return JSON.stringify(args);
  });
};

export var outputsValidation = memoize(function (item, max, message) {
  if (message === void 0) {
    message = "Maximum 2 outcomes per output";
  }
  return function (value, values, props) {
    const result = item && item.outcome_ids.length > max;

    return !isEmpty(result) && result
      ? getMessage(message, { outcomes: item }, value, values, props)
      : undefined;
  };
});

export var outcomesValidation = memoize(function (item, max, message) {
  if (message === void 0) {
    message = "Maximum 2 outcomes per output";
  }
  return function (value, values, props) {
    const result = item && item.outcome_ids.length > max;

    return !isEmpty(result) && result
      ? getMessage(message, { outcomes: item }, value, values, props)
      : undefined;
  };
});

export const projectValidation = (values, step, phase_id) => {
  const errors = {};
  //TODO: make validation by steps
  if (step === PROJECT_STEPS.RESULT_MATRIX) {
    if (phase_id > 1) {
      if (
        checkFeature("project_result_matrix_has_max_2_outcomes") &&
        values.outcomes &&
        values.outcomes.length > 2
      ) {
        errors.outcomes = "Maximum 2 outcomes per project";
      }
      if (
        values.outputs &&
        values.outputs.filter((item) => item.outcome_ids.length > 2).length !==
        0
      ) {
        errors.outcomes = "Maximum 2 outcomes per output";
      }
    }
  }

  if (step === PROJECT_STEPS.OPTIONS_ANALYSIS) {
    if (checkFeature("project_options_max_three_shortlisted_items", phase_id)) {
      if (
        values.project_options &&
        values.project_options.filter((item) => item.is_shortlisted) &&
        values.project_options.filter((item) => item.is_shortlisted).length > 3
      ) {
        errors.project_options = "Maximum 3 shortlisted options";
      }
      if (
        values.project_options &&
        values.project_options.filter((item) => item.is_shortlisted) &&
        values.project_options.filter((item) => item.is_shortlisted).length ===
        0
      ) {
        errors.project_options =
          "At least 1 shortlisted options must be selected";
      }
    }
    if (checkFeature("project_options_max_one_preferred_items", phase_id)) {
      if (
        values.project_options &&
        values.project_options.filter((item) => item.is_preferred).length > 1
      ) {
        errors.project_options = "Maximum 1 is_preferred options";
      }
      if (
        values.project_options &&
        values.project_options.filter((item) => item.is_preferred).length === 0
      ) {
        errors.project_options =
          "At least 1 is_preferred options must be selected";
      }
    }
  }

  return errors;
};

export const validateFieldsByPhase = (data, currentStep, appPrefix) => {
  if (lodash.isEmpty(data)) {
    return [];
  }

  const RETOOLING_SKIPPED_STEPS = [
    PROJECT_STEPS.BEHAVIOR_CHANGE,
    PROJECT_STEPS.INTRODUCTION,
    PROJECT_STEPS.OM_COSTS,
    PROJECT_STEPS.OPTIONS_ANALYSIS,
  ];

  const validationFields = VALIDATION_FIELDS();
  const emptyFields = validationFields
    .filter((item) => {
      const isRetoolingProject = data?.project?.classification === "RETOOLING" ||
        data?.project?.classification === "STUDIES";
      if (checkFeature("has_retooling_skip_phases") && isRetoolingProject) {
        return !RETOOLING_SKIPPED_STEPS.includes(item.step);
      }

      return true;
    })
    .filter((item) => (currentStep ? item.step === currentStep : true))
    .filter((item) => item.app && item.app.includes(appPrefix))
    .filter((item) => {
      if (item.phases.includes(data.phase_id)) {
        switch (item.field) {
          case "revenue_source":
            if (
              data &&
              find(
                data.proposed_funding_source,
                (it) => it && Number(it.fund_id) === 1
              )
            ) {
              return !data[item.field];
            } else {
              return false;
            }
          case "ppp_similar_reference":
          case "ppp_interest":
          case "ppp_impediments":
          case "ppp_risk_allocation":
            const renderSource = [
              "Public-Private Partnerships",
              "Joint-Venture",
              "Joint-Venture (Unsolicited Proposal)",
              "Public-Private Partnerships (Unsolicited Proposal)",
              "Joint-Venture (Solicited Proposal)",
              "Public-Private Partnerships (Solicited Proposal)",
            ];
            const renderSourceFund = [
              "Public-Private Partnership",
              "Joint Venture",
              "Unsolicited Proposal",
            ];
            const hasProcurementModality =
              data &&
              data.procurement_modality &&
              data.procurement_modality.filter((item) =>
                renderSource.includes(item)
              ).length > 0;

            const hasFundingSource =
              data &&
              data.proposed_funding_source &&
              data.proposed_funding_source !==
              "Source of funding has not been identified" &&
              data.proposed_funding_source.filter((item) =>
                renderSourceFund.includes(item)
              ).length > 0;

            if (hasFundingSource || hasProcurementModality) {
              return !data[item.field];
            } else {
              return false;
            }
          case "om_costs":
            if (data && data["maintenance_period"]) {
              return validateInnerData("om_costs", item.innerFields, data);
            } else {
              return false;
            }
          case "ndp_strategies":
            if (item.condition) {
              return validateInnerConditionedData(
                "ndp_strategies",
                item.innerFields,
                data,
                item.condition
              );
            }
            return validateInnerData("ndp_strategies", item.innerFields, data);
          case "project_options":
            return validateInnerData("project_options", item.innerFields, data);
          case "government_coordinations":
            return validateInnerData(
              "government_coordinations",
              item.innerFields,
              data
            );
          case "outcomes":
            return validateInnerData("outcomes", item.innerFields, data);
          case "outputs":
            return validateInnerData("outputs", item.innerFields, data);
          case "outcomes.indicators":
            return validateInnerArrayData(
              "outcomes",
              "indicators",
              item.innerFields,
              data
            );
          case "outputs.indicators":
            return validateInnerArrayData(
              "outputs",
              "indicators",
              item.innerFields,
              data
            );
          case "indicators":
            return validateInnerData("indicators", item.innerFields, data);
          case "activities":
            return validateInnerData("activities", item.innerFields, data);
          case "activities.investments":
            return validateInnerArrayData(
              "activities",
              "investments",
              item.innerFields,
              data
            );
          case "outputs.investments":
            return validateInnerArrayData(
              "outputs",
              "investments",
              item.innerFields,
              data
            );
          case "components.subcomponents":
            return validateInnerArrayData(
              "components",
              "subcomponents",
              item.innerFields,
              data
            );
          case "components.investments":
            return validateInnerArrayData(
              "components",
              "investments",
              item.innerFields,
              data
            );
          case "responsible_officers":
            return validateInnerData(
              "responsible_officers",
              item.innerFields,
              data
            );
          default:
            if (!data[item.field]) {
              return true;
            }
            if (
              data[item.field] &&
              lodash.isArray(data[item.field]) &&
              lodash.isEmpty(data[item.field])
            ) {
              return true;
            }
            break;
        }
      }
      return false;
    });
  if (emptyFields && emptyFields.length !== 0) {
    return emptyFields;
  }

  return [];
};

const getRequiredFilesForPhase = (file_types, phase_id) =>
  file_types
    .filter(
      (item) => item.phase_ids.includes(phase_id) && item.is_required === "yes"
    )
    .map((item) => item.id);

export const fileValidation = (record, fileTypes) => {
  if (lodash.isEmpty(record)) {
    return true;
  }

  if (!fileTypes || !Array.isArray(fileTypes)) return true;

  // const requiredFiles = getRequiredFilesForPhase(
  //     record.file_types,
  //     record.phase_id,
  // );

  if (fileTypes && fileTypes.length !== 0) {
    if (!record.files || record.files.length === 0) {
      return true;
    }
  }
  const recordFiles = record.files && Array.isArray(record.files) ? record.files : [];
  const files = recordFiles
    .filter((item) => {
      const meta =
        item.meta && typeof item.meta === "string"
          ? JSON.parse(item.meta)
          : item.meta;
      return meta ? meta.relatedField : false;
    })
    .map((item) => {
      return item.meta ? item.meta.relatedField : false;
    });
  const result = fileTypes.filter((item) => !files.includes(item.name));

  if (result.length !== 0) {
    return true;
  }
};

export const validateArraysData = (field, checkingField, record) => {
  let errorCounter = 0;

  if (!lodash.isEmpty(record[field])) {
    record[field].forEach((outcome) => {
      if (lodash.isEmpty(outcome[checkingField])) {
        errorCounter += 1;
      }
    });
  }
  return errorCounter;
};

export const validateInnerData = (field, innerFields, data) => {
  if (lodash.isArray(data[field])) {
    if (data[field] && data[field].length === 0) {
      return true;
    }
  }

  const emptyFields =
    data[field] &&
    data[field].filter((innerItem) => {
      const emptyInnerFields =
        innerFields &&
        innerFields.filter((innerField) => {
          if (innerItem) {
            if (
              innerItem[innerField] &&
              lodash.isArray(innerItem[innerField])
            ) {
              return innerItem[innerField].length === 0;
            }

            return !innerItem[innerField];
          }
          return true;
        });
      return emptyInnerFields && emptyInnerFields.length !== 0;
    });

  return emptyFields && emptyFields.length !== 0;
};
export const validateInnerConditionedData = (
  field,
  innerFields,
  data,
  condition
) => {
  if (lodash.isArray(data[field])) {
    if (data[field] && data[field].length === 0) {
      return true;
    }
  }

  const emptyFields =
    data[field] &&
    data[field].filter((innerItem) => {
      const emptyInnerFields =
        innerFields &&
        innerFields.map((innerField) => {
          if (innerItem) {
            if (
              innerItem[innerField] &&
              lodash.isArray(innerItem[innerField])
            ) {
              return innerItem[innerField].length === 0;
            }

            return innerItem[innerField];
          }
          return true;
        });
      const filteredArray = emptyInnerFields.filter((item) => !item).length;
      return filteredArray === emptyInnerFields.length;
    });

  return emptyFields && emptyFields.length !== 0;
};

export const validateInnerArrayData = (
  field,
  arrayField,
  innerFields,
  data
) => {
  if (lodash.isEmpty(data[field])) return true;

  const emptyFields =
    data[field] &&
    data[field].filter((item) => {
      if (lodash.isEmpty(item[arrayField])) return true;

      return validateInnerData(arrayField, innerFields, item[arrayField]);
    });

  return emptyFields && emptyFields.length !== 0;
};

export const checkRequired = (field, innerField) => {
  if (checkFeature("has_pimis_fields")) {
    const validationRules =
      (localStorage.getItem(VALIDATION) &&
        JSON.parse(localStorage.getItem(VALIDATION))) ||
      VALIDATION_FIELDS;
    const selectedItem = find(validationRules, (it) => it.field === field);

    if (innerField) {
      const isInnerFieldSelected = find(
        selectedItem?.innerFields,
        (it) => it === innerField
      );
      return isInnerFieldSelected ? required() : false;
    }

    return selectedItem ? required() : false;
  }

  return required();
};
