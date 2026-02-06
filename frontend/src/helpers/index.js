import lodash from "lodash";
import { dataProvider } from "../data/providers";
import moment from "moment";
import numeral from "numeral";
import { getFeatureValue } from "./checkPermission";
import { parseBuildingBlocks } from "./dataHelpers";
import { checkFeature } from "./checkPermission";

export const checkTitleDublication = (props) => {
  //return true - if title duplicated;
  return dataProvider("CUSTOM", "projects", {
    type: "validate-title",
    query: { title: props.title },
  }).then((response) => {
    if (response && !response.data) {
      return true;
    }
  });
};

const option_modules = [
  "demand_module",
  "technical_module",
  "environmental_module",
  "hr_module",
  "legal_module",
];
const analytics = checkFeature("has_pimis_fields")
  ? ["financial_evaluation", "economic_evaluation", "stakeholder_evaluations"]
  : [
    "financial_evaluation",
    "economic_evaluation",
    "stakeholder_evaluations",
    "risk_evaluations",
  ];

const emptyValues = (blockData) =>
  lodash.keys(blockData).filter((key) => !blockData[key]);

const formatResultString = (fieldsData) =>
  lodash
    .keys(fieldsData)
    .filter(
      (optionTitle) =>
        fieldsData[optionTitle] && fieldsData[optionTitle].length !== 0
    )
    .map((optionTitle) => {
      return `${optionTitle}: ${fieldsData[optionTitle].join(", ")}`;
    });

export const validateModulesFill = (formValues, translate) => {
  const { project_options } = formValues;
  const summaryFields = ["advantage", "disadvantage", "description", "score"];
  const emptyFieldsObj = {};
  const translationString = "validation.project_options.building_blocks";

  project_options.forEach((option) => {
    emptyFieldsObj[option.name] = [];
  });

  project_options.forEach((option, idx) => {
    option_modules.forEach((modul) => {
      summaryFields.forEach((key) => {
        if (option[modul]) {
          if (checkFeature("has_legacy_ndp", formValues.phase_id)) {
            if (!option[modul]["description"]) {
              emptyFieldsObj[option.name].push(
                `${translate(
                  `${translationString}.modules.${modul}`
                )}(${translate(`${translationString}.${"description"}`)})`
              );
            }
          } else {
            if (!option[modul][key]) {
              if (!emptyFieldsObj[option.name].includes(key)) {
                emptyFieldsObj[option.name].push(
                  `${translate(
                    `${translationString}.modules.${modul}`
                  )}(${translate(`${translationString}.${key}`)})`
                );
              }
            }
          }
        } else {
          if (
            !emptyFieldsObj[option.name].includes(
              `${translate(
                `${translationString}.modules.${modul}`
              )}(${translate("validation.project_options.all_fields")})`
            )
          ) {
            emptyFieldsObj[option.name].push(
              `${translate(
                `${translationString}.modules.${modul}`
              )}(${translate("validation.project_options.all_fields")})`
            );
          }
        }
      });
    });
  });
  return formatResultString(emptyFieldsObj);
};

export const validateBestSelectionFill = (formValues) => {
  const { project_options } = formValues;
};

export const validateEvaluationsFill = (formValues, translate) => {
  const { project_options } = formValues;

  const emptyFieldsObj = {};
  const summaryFields = ["appraisal_methodology", "summary"];
  const stakeholdersFields = [
    "name",
    "impact_sign",
    "beneficiary",
    "description",
  ];
  const riskFactors = [
    "description",
    "occurrence",
    "impact",
    "mitigation_plan",
  ];
  const translationString = "validation.project_options";

  project_options.forEach((option) => {
    emptyFieldsObj[option.name] = [];
  });

  project_options
    .filter((item) => item.is_shortlisted)
    .forEach((option, idx) => {
      analytics.forEach((modul) => {
        if (option[modul]) {
          if (
            modul === "financial_evaluation" ||
            modul === "economic_evaluation"
          ) {
            summaryFields.forEach((key) => {
              if (!option[modul][key]) {
                if (!emptyFieldsObj[option.name].includes(key)) {
                  emptyFieldsObj[option.name].push(
                    `${translate(
                      `${translationString}.${modul}.title`
                    )}(${translate(`${translationString}.${modul}.${key}`)})`
                  );
                }
              } else {
                if (modul === "financial_evaluation") {
                  if (
                    key === "appraisal_methodology" &&
                    option[modul][key] === "cba"
                  ) {
                    if (!option[modul]["fnpv"]) {
                      emptyFieldsObj[option.name].push(
                        `${translate(
                          `${translationString}.${modul}.title`
                        )}(${translate(`${translationString}.${modul}.fnpv`)})`
                      );
                    }
                    if (!option[modul]["irr"]) {
                      emptyFieldsObj[option.name].push(
                        `${translate(
                          `${translationString}.${modul}.title`
                        )}(${translate(`${translationString}.${modul}.irr`)})`
                      );
                    }
                  }
                  if (
                    key === "appraisal_methodology" &&
                    option[modul][key] === "cea"
                  ) {
                    if (
                      !option[modul]["criterias"] ||
                      option[modul]["criterias"].length === 0
                    ) {
                      emptyFieldsObj[option.name].push(
                        `${translate(
                          `${translationString}.${modul}.title`
                        )}(${translate(
                          `${translationString}.${modul}.criterias`
                        )})`
                      );
                    }
                  }
                }
                if (modul === "economic_evaluation") {
                  if (
                    key === "appraisal_methodology" &&
                    option[modul][key] === "cba"
                  ) {
                    if (!option[modul]["enpv"]) {
                      emptyFieldsObj[option.name].push(
                        `${translate(
                          `${translationString}.${modul}.title`
                        )}(${translate(`${translationString}.${modul}.enpv`)})`
                      );
                    }
                    if (!option[modul]["err"]) {
                      emptyFieldsObj[option.name].push(
                        `${translate(
                          `${translationString}.${modul}.title`
                        )}(${translate(`${translationString}.${modul}.err`)})`
                      );
                    }
                  }
                  if (
                    key === "appraisal_methodology" &&
                    option[modul][key] === "cea"
                  ) {
                    if (
                      !option[modul]["criterias"] ||
                      option[modul]["criterias"].length === 0
                    ) {
                      emptyFieldsObj[option.name].push(
                        `${translate(
                          `${translationString}.${modul}.title`
                        )}(${translate(
                          `${translationString}.${modul}.criterias`
                        )})`
                      );
                    }
                  }
                }
              }
            });
          } else {
            if (option[modul].length === 0) {
              if (
                !emptyFieldsObj[option.name].includes(
                  `${translate(
                    `${translationString}.${modul}.title`
                  )}(${translate(`${translationString}.all_fields`)})`
                )
              ) {
                emptyFieldsObj[option.name].push(
                  `${translate(
                    `${translationString}.${modul}.title`
                  )}(${translate(`${translationString}.all_fields`)})`
                );
              }
            } else {
              const fieldsValidating =
                modul === "stakeholder_evaluations" ? stakeholdersFields : null;

              option[modul].forEach((item) => {
                fieldsValidating &&
                  fieldsValidating.map((field) => {
                    if (!item[field]) {
                      emptyFieldsObj[option.name].push(
                        `${translate(
                          `${translationString}.${modul}.title`
                        )}(${translate(
                          `${translationString}.${modul}.${field}`
                        )})`
                      );
                    }
                  });
              });
            }
          }
        } else {
          if (
            !emptyFieldsObj[option.name].includes(
              `${translate(`${translationString}.${modul}.name`)}(${translate(
                `${translationString}.all_fields`
              )})`
            )
          ) {
            emptyFieldsObj[option.name].push(
              `${translate(`${translationString}.${modul}.name`)}(${translate(
                `${translationString}.all_fields`
              )})`
            );
          }
        }
      });
    });
  return formatResultString(emptyFieldsObj);
};

export const validateSummaryFill = (formValues, translate) => {
  const { project_options } = formValues;

  let summaryFields = ["name", "description", "funding_modality", "cost"];
  if (checkFeature("has_pimis_fields")) {
    summaryFields = [
      "name",
      "description",
      "funding_modality",
      "is_shortlisted",
    ];
  }
  if (checkFeature("has_esnip_fields")) {
    summaryFields = [
      "name",
      "description",
      "funding_modality",
      "cost",
      "is_shortlisted",
    ];
  }

  const translationString = "validation.project_options.summary";
  const emptyFieldsObj = {};

  project_options.forEach((option) => {
    emptyFieldsObj[option.name] = [];
  });

  project_options.forEach((option, idx) => {
    summaryFields.forEach((key) => {
      if (!option[key]) {
        if (!emptyFieldsObj[option.name].includes(key)) {
          emptyFieldsObj[option.name].push(
            translate(`${translationString}.${key}`)
          );
        }
      }
    });
  });

  return formatResultString(emptyFieldsObj);
};

export const validateOptionsBeforeSave = (
  formValues,
  showNotification,
  translate
) => {
  if (formValues && checkFeature("validate_options", formValues.phase_id))
    return true;

  formValues = parseBuildingBlocks(formValues);
  if (
    formValues &&
    formValues.project_options &&
    formValues.project_options.length !== 0
  ) {
    let errorMessage = `${translate("validation.empty_fields")}:`;
    let errorsCount = 0;

    const summaryValidation = validateSummaryFill(formValues, translate);
    const modulesValidation = validateModulesFill(formValues, translate);
    const evaluationsValidation = validateEvaluationsFill(
      formValues,
      translate
    );
    const bestSelection = validateBestSelectionFill(formValues, translate);

    if (summaryValidation.length !== 0) {
      errorMessage = errorMessage + ` ${summaryValidation.join(", ")}`;
      errorsCount += 1;
    }
    if (modulesValidation.length !== 0) {
      errorMessage = errorMessage + ` ${modulesValidation.join(", ")}`;
      errorsCount += 1;
    }
    if (evaluationsValidation.length !== 0) {
      errorMessage = errorMessage + ` ${evaluationsValidation.join(", ")}`;
      errorsCount += 1;
    }

    return errorsCount > 0 ? errorMessage : false;
  }

  return translate("validation.options_appraisal_empty");
};

export const validateTopOptions = (formValues, translate) => {
  const { project_options } = formValues;
  return lodash.groupBy(project_options, "score");
};

export const commasFormatter = (value) => {
  if (value) {
    const parts = value.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return parts.join(".");
  }

  return value;
};

export const commasParser = (value) => {
  if (value) {
    return value.replace(/,/g, "");
  }

  return value;
};

//TODO fix % vlue
export const percentageFormatter = (value) => {
  // if (value) {
  //   return value.toString() + '%'
  // }

  return value ? value.toFixed(2) + "%" : "-";
};

export const percentageParser = (value) => {
  // if (value) {
  //   return value.replace(/%/g, "");
  // }

  return value;
};

export const costSumFormatter = (value) => {
  if (!value) {
    return "-";
  }
  return typeof value !== "undefined" && value !== 0
    ? checkFeature("has_ibp_fields")
      ? numeral(value).format("0,0")
      : numeral(value).format("0,0.00") //remove all coins
    : "-";
};

export const costFormatterCeil = (value) => {
  if (!value) {
    return "-";
  }
  return typeof value !== "undefined" && value !== 0
    ? numeral(value).format("0,0")
    : "-";
};

export const dateFormatter = (value, format) => {
  if (!value) return "-";
  if (value) {
    if (format) {
      return moment(value).format(format);
    }
    return moment(value).format("DD-MM-YYYY");
  }

  return value;
};

export const currencyConverter = (value, rate, sign) => {
  if (value) {
    const formattedValue = value.replace(/,/g, "");

    if (rate) {
      if (sign) {
        return (parseFloat(formattedValue) / parseFloat(rate)).toFixed(2);
      }
      return (parseFloat(formattedValue) * parseFloat(rate)).toFixed(2);
    }
    return formattedValue;
  }

  return value;
};

export const getCurrentPhaseId = (project_details, userInfo) => {
  const maxId = lodash.maxBy(project_details, (item) => item.phase_id);
  const userPhases = userInfo.current_role.role.phase_ids;

  if (maxId && userPhases.includes(maxId.phase_id)) {
    return maxId.phase_id;
  } else {
    return lodash.maxBy(project_details, (item) => Number(item));
  }

  // .keys(data)
  //   .filter((id) =>
  //     getFilterForPhase()
  //       ? getFilterForPhase().includes(Number(data[id].phase_id))
  //       : true
  // //   );

  // return lodash.maxBy(record.project_details, (item) => item.phase_id)
  //   ? lodash.maxBy(record.project_details, (item) => item.phase_id).phase_id
  //   : record.phase_id;
  // TODO chheck
  // return record.project_details && !record.project_details.includes(record.last_detail_id)
  //   ? record.phase_id - 1
  //   : record.phase_id;
};

export const generateChoices = (record) => {
  if (lodash.isArray(record)) {
    return record.map((item) => ({
      id: item,
      name: item,
    }));
  }
  return lodash.keys(record).map((key) => ({
    id: key,
    name: record[key],
  }));
};

export const appendScript = (scriptToAppend) => {
  const script = document.createElement("script");
  script.src = scriptToAppend;
  script.async = true;
  document.head.appendChild(script);
};

export const removeScript = (scriptToremove) => {
  let allsuspects = document.getElementsByTagName("script");
  for (let i = allsuspects.length; i >= 0; i--) {
    if (
      allsuspects[i] &&
      allsuspects[i].getAttribute("src") !== null &&
      allsuspects[i].getAttribute("src").indexOf(`${scriptToremove}`) !== -1
    ) {
      allsuspects[i].parentNode.removeChild(allsuspects[i]);
    }
  }
};

export const getSelectedVotesForProject = (formData, currentProject) => {
  let votesList = [];
  if (currentProject && currentProject.project_organization) {
    // apply this logic for all instances
    votesList = lodash
      .concat(
        formData.implementing_agencies &&
        formData.implementing_agencies.map((element) => element.organization)
      )
      .map((item) => {
        return { id: item.id, name: item.name };
      });

    // votesList = checkFeature("has_ibp_fields")
    //   ? lodash
    //       .concat(
    //         formData.implementing_agencies &&
    //           formData.implementing_agencies.map(
    //             (element) => element.organization
    //           )
    //       )
    //       .map((item) => {
    //         return { id: item.id, name: item.name };
    //       })
    //   : lodash
    //       .concat(
    //         {
    //           id: currentProject.project_organization.id,
    //           name: currentProject.project_organization.name,
    //         },
    //         formData.implementing_agencies &&
    //           formData.implementing_agencies.map(
    //             (element) => element.organization
    //           )
    //       )
    //       .filter((item) => item)
    //       .map((item) => {
    //         return { id: item.id, name: item.name };
    //       });
  }

  return lodash.uniqBy(votesList, (it) => it.id) || [];
};

export const optionRenderer = (choice) => {
  return choice
    ? `${choice.name && choice.name.length > 100
      ? choice.name.slice(0, 100) + "..."
      : choice.name
    }`
    : null;
};



export const getCurrentFiscalYear = () => {
  const currentDate = moment();
  const fiscalStartDate = getFeatureValue("fiscal_year_start_date");
  const startYear = moment().format("YYYY");
  const startFiscalYear = moment(
    `${fiscalStartDate}/${startYear}`,
    "DD/MM/YYYY"
  );

  return currentDate.isSameOrAfter(startFiscalYear)
    ? Number(startYear)
    : Number(startYear) - 1;
};