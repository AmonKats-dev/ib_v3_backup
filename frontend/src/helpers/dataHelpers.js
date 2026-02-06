import lodash, { concat, isArray } from "lodash";
import { checkFeature } from "./checkPermission";

const INDICATORS = [
  { resource: "indicators", source: "", field: "targets" },
  { resource: "outputs", source: "indicators", field: "targets" },
  { resource: "outcomes", source: "indicators", field: "targets" }];

const REFERENCES = [
  { resource: "outputs", source: "investments", field: "costs" },
  { resource: "activities", source: "investments", field: "costs" },
  { resource: "me_releases", source: "", field: "donor_funded" },
  { resource: "me_releases", source: "", field: "government_funded" },
  { resource: "project_options", source: "", field: "capital_expenditure" },
  { resource: "project_options", source: "", field: "om_cost" },
  { resource: "budget_allocation", source: "", field: "gov" },
  { resource: "budget_allocation", source: "", field: "donor" },
  { resource: "om_costs", source: "", field: "costs" },
];
//ptoject filter converter
export const changeFilterQuery = (filters) => {
  const orgLevel = [
    "sector",
    "vote",
    "vote_function",
    "ministry",
    "public_body",
  ];
  if (lodash.keys(filters).includes("q")) {
    filters.name = filters["q"];
  }

  let filterResult = { ...filters };

  Object.keys(filters).forEach((key) => {
    if (orgLevel.includes(key)) {
      filterResult = {
        ...filterResult,
        organization_id: filters[key],
      };
    }
    // else {
    //   filterResult = { ...filterResult, ...filters[key] };
    // }
  });

  return filterResult;
};
export const parseBuildingBlocks = (values) => {
  if (!values.project_options) return values;
  values.project_options = values.project_options.map((option) => {
    if (option.building_blocks) {
      option.building_blocks.forEach((block) => {
        option[block.module_type.toLowerCase()] = {
          ...block,
        };
      });
    }

    return option;
  });

  return values;
};

const formatBuildingBlocks = (values) => {
  const option_modules = [
    "demand_module",
    "technical_module",
    "environmental_module",
    "hr_module",
    "legal_module",
  ];

  if (!values.project_options) return values;

  values.project_options = values.project_options.map((option) => {
    option.building_blocks = [];

    option_modules.forEach((mod) => {
      if (option[mod]) {
        option.building_blocks.push({
          module_type: mod.toUpperCase(),
          ...option[mod],
        });
      }
    });

    if (option.building_blocks.length === 0) {
      delete option.building_blocks;
    }

    return option;
  });

  return values;
};

const formatOmCosts = (values) => {
  if (!values.om_cost) return values;

  const obj = {};
  lodash.keys(values.om_cost).forEach((key) => {
    if (key.indexOf("y") !== -1) {
      obj[key.slice(0, -1)] = values.om_cost[key];
    }
  });

  if (!lodash.isEmpty(obj)) {
    values.om_cost = obj;
  }

  return values;
};

const parseOmCosts = (values) => {
  if (!values.om_cost) return values;

  const obj = {};
  lodash.keys(values.om_cost).forEach((key) => {
    if (key.indexOf("y") === -1) {
      obj[key + "y"] = values.om_cost[key];
    }
  });

  if (!lodash.isEmpty(obj)) {
    values.om_cost = obj;
  }

  return values;
};

export function formatYearsValues(values, reference) {
  reference.forEach((reference) => {
    if (values[reference.resource]) {
      if (!reference.field) {
        const obj = {};
        lodash.keys(values[reference.resource]).forEach((key) => {
          if (key.indexOf("y") !== -1) {
            obj[key.slice(0, -1)] = values[reference.resource][key];
          }
        });

        if (!lodash.isEmpty(obj)) {
          values[reference.resource] = obj;
        }
      } else {
        lodash.isArray(values[reference.resource]) &&
          values[reference.resource].forEach((item) => {
            if (item) {
              if (!reference.source) {
                const obj = {};
                if (reference.field && item[reference.field]) {
                  lodash.keys(item[reference.field]).forEach((key) => {
                    if (key.indexOf("y") !== -1) {
                      obj[key.slice(0, -1)] = item[reference.field][key];
                    }
                  });
                }

                if (!lodash.isEmpty(obj)) {
                  item[reference.field] = obj;
                }
              } else {
                if (item[reference.source]) {
                  item[reference.source] = item[reference.source].map(
                    (item) => {
                      const obj = {};
                      if (item && reference.field && item[reference.field]) {
                        lodash.keys(item[reference.field]).forEach((key) => {
                          if (key.indexOf("y") !== -1) {
                            obj[key.slice(0, -1)] = item[reference.field][key];
                          }
                        });
                      }

                      if (!lodash.isEmpty(obj)) {
                        item[reference.field] = obj;
                      }

                      return item;
                    }
                  );
                }
              }
            }

            return item;
          });
      }
    }
  });

  return values;
}

export function parseYearsValues(values, reference) {
  reference.forEach((reference) => {
    if (values[reference.resource]) {
      if (!reference.field) {
        if (!reference.source) {
          const obj = {};
          values &&
            lodash.keys(values[reference.resource]).forEach((key) => {
              if (key.indexOf("y") === -1) {
                obj[key + "y"] = values[reference.resource][key];
              }
            });

          if (!lodash.isEmpty(obj)) {
            values[reference.resource] = obj;
          }
        }
      } else {
        lodash.isArray(values[reference.resource]) &&
          values[reference.resource].forEach((item) => {
            if (item) {
              if (!reference.source) {
                const obj = {};
                item &&
                  lodash.keys(item[reference.field]).forEach((key) => {
                    if (key.indexOf("y") === -1) {
                      obj[key + "y"] = item[reference.field][key];
                    }
                  });

                if (!lodash.isEmpty(obj)) {
                  item[reference.field] = obj;
                }
              } else {
                if (item[reference.source]) {
                  item[reference.source] = item[reference.source].map(
                    (item) => {
                      const obj = {};
                      item &&
                        lodash.keys(item[reference.field]).forEach((key) => {
                          if (key.indexOf("y") === -1) {
                            obj[key + "y"] = item[reference.field][key];
                          }
                        });

                      if (!lodash.isEmpty(obj)) {
                        item[reference.field] = obj;
                      }

                      return item;
                    }
                  );
                }
              }
            }

            return item;
          });
      }
    }
  });

  return values;
}

function formatLocations(values) {
  if (checkFeature("project_locations_multiselect_input")) {
    if (!values.locations) return values;

    const obj = values.locations.map((key) => {
      if (key && !key.location_id) {
        return { location_id: Number(key) };
      } else {
        return { location_id: Number(key.location_id) };
      }
    });

    if (!lodash.isEmpty(obj)) {
      values.locations = obj;
    }

    return values;
  }

  return values;
}

function formatLocationsPimis(values) {
  if (checkFeature("has_pimis_fields") && values.locations) {
    const clone = lodash.cloneDeep(values.locations);
    let location_ids = [];

    clone &&
      clone.forEach((item) => {
        if (item.location_parent_id === 77 && item.location_ids.length === 0) {
          //Island wide
          item.location_ids.push(item.location_parent_id);
        }

        if (item.location_ids && item.location_ids.length > 0) {
          location_ids = [
            ...location_ids,
            ...item.location_ids.map((locId) => ({
              location_id: locId,
              name: (item.location && item.location.name) || item.name,
            })),
          ];
        }
      });

    if (location_ids && location_ids.length > 0) {
      values.locations = location_ids;
    }

    return values;
  }

  if (checkFeature("has_ibp_fields") && values.locations) {
    const clone = lodash.cloneDeep(values.locations);
    let location_ids = [];

    clone &&
      clone.forEach((item) => {
        if (item.location_ids && item.location_ids.length > 0) {
          location_ids = [
            ...location_ids,
            ...item.location_ids.map((locId) => ({
              location_id: locId,
              name: (item.location && item.location.name) || item.name,
            })),
          ];
        }
      });

    if (location_ids && location_ids.length > 0) {
      values.locations = location_ids;
    }

    return values;
  }

  return values;
}

function parseLocations(values) {
  if (checkFeature("project_locations_multiselect_input")) {
    if (!values.locations) return values;

    const obj = values.locations.map((item) => {
      return item && item.location_id;
    });

    if (!lodash.isEmpty(obj)) {
      values.locations = obj;
    }
  }

  return values;
}
function parseLocationsPimis(values) {
  if (
    checkFeature("has_pimis_fields") &&
    values.locations &&
    values.locations.length > 0
  ) {
    const cloneLocations = lodash.cloneDeep(
      values.locations.map((item) => {
        if (item.location_id === 77) {
          return {
            ...item,
            name: item.location && item.location.name,
            parent_id: item.location_id,
          };
        }

        return {
          ...item,
          name: item.location && item.location.name,
          parent_id: item.location && item.location.parent_id,
        };
      })
    );

    const grouppedLocations = lodash.groupBy(cloneLocations, "parent_id");

    if (
      lodash.keys(grouppedLocations) &&
      lodash.keys(grouppedLocations).length > 0
    ) {
      values.locations = lodash.keys(grouppedLocations).map((key) => {
        return {
          location_parent_id: key,
          location_ids: grouppedLocations[key].map((item) => item.location_id),
          name: grouppedLocations[key].map(
            (item) => item.location && item.location.name
          ),
        };
      });
    }

    return values;
  }

  if (
    checkFeature("has_ibp_fields") &&
    values.locations &&
    values.locations.length > 0
  ) {
    const cloneLocations = lodash.cloneDeep(
      values.locations.map((item) => {
        return {
          ...item,
          name: item.location && item.location.name,
          parent_id: item.location && item.location.parent_id,
        };
      })
    );

    const grouppedLocations = lodash.groupBy(cloneLocations, "parent_id");

    if (
      lodash.keys(grouppedLocations) &&
      lodash.keys(grouppedLocations).length > 0
    ) {
      values.locations = lodash.keys(grouppedLocations).map((key) => {
        return {
          location_parent_id: key,
          location_ids: grouppedLocations[key].map((item) => item.location_id),
          name: grouppedLocations[key].map(
            (item) => item.location && item.location.name
          ),
        };
      });
    }

    return values;
  }

  return values;
}

function formatSdgsPimis(values) {
  if (checkFeature("has_pimis_fields") && values.ndp_outcome_ids) {
    const clone = lodash.cloneDeep(values.ndp_outcome_ids);

    values.ndp_outcome_ids = clone.join(",");
  }

  return values;
}
function parseSdgsPimis(values) {
  if (checkFeature("has_pimis_fields") && values.ndp_outcome_ids) {
    const clone = lodash.cloneDeep(values.ndp_outcome_ids);

    values.ndp_outcome_ids = clone.split(",").map((item) => Number(item));
  }

  return values;
}

function removeIndicatorsFromValues(values) {
  if (checkFeature("has_pimis_fields")) {
    const clone = lodash.cloneDeep(values);

    if (values.indicators) { delete values.indicators; }
    if (values.outcomes) {
      values.outcomes = clone.outcomes.map((it) => {
        delete it.indicators
        return it;
      })
    }
    if (values.outputs) {
      values.outputs = clone.outputs.map((it) => {
        delete it.indicators
        return it;
      })
    }

    return values;
  }

  return values;

}

function removeOrphanedRecords(values) {
  if (!checkFeature("has_pimis_fields")) return values;

  const clonedValues = lodash.cloneDeep(values);

  const outcomesIds = values.outcomes?.map((it) => it.id);
  const outputsIds = values.outputs?.map((it) => it.id);
  const componentsIds = values.components?.map((it) => it.id);
  const subComponentsIds = values.components ? concat(...values.components?.map((it) => it.subcomponents ? it.subcomponents?.map((subItem) => subItem.id) : [])) : [];
  const implementingAgenciesIds = values.implementing_agencies?.map((it) => it.organization_id);

  values.outputs = clonedValues.outputs?.map((output) => {
    if (output.outcome_ids) {
      output.outcome_ids = output.outcome_ids?.filter((outcomeId) => outcomesIds.includes(outcomeId))
    }

    if (output.subcomponent_id) {
      output.subcomponent_id = !subComponentsIds.includes(output.subcomponent_id) ? null : output.subcomponent_id
    }

    if (output.component_id) {
      output.component_id = !componentsIds.includes(output.component_id) ? null : output.component_id
    }

    return output
  })

  values.activities = clonedValues.activities?.map((activity) => {
    if (activity.output_ids) {
      activity.output_ids = activity.output_ids?.filter((outputId) => outputsIds.includes(outputId))
    }

    return activity
  })

  values.components = clonedValues.components?.map((component) => {
    if (component.organization_ids) {
      component.organization_ids = component.organization_ids?.filter((organizationId) => implementingAgenciesIds.includes(organizationId))
    }

    return component
  })

  return values;
}

export function formatValuesToQuery(values, rmvIndicators) {
  const references = checkFeature("has_pimis_fields") ? REFERENCES : [...REFERENCES, ...INDICATORS]

  const parsedYears = formatYearsValues(values, references);
  const parsedOptions = formatBuildingBlocks(parsedYears);
  const result = formatOmCosts(parsedOptions);
  const withLocations = formatLocations(result);
  const formatted = formatLocationsPimis(withLocations);
  const formattedSdgs = formatSdgsPimis(formatted);
  const removedInicators = rmvIndicators ? removeIndicatorsFromValues(formattedSdgs) : formattedSdgs
  const checkedData = removeOrphanedRecords(removedInicators);

  return checkedData;
}

export function parseQueryToValues(values) {
  const references = checkFeature("has_pimis_fields") ? REFERENCES : [...REFERENCES, ...INDICATORS]

  const parsedYears = parseYearsValues(values, references);
  const cleanResult = parseBuildingBlocks(parsedYears);
  const result = parseOmCosts(cleanResult);
  const withLocations = parseLocations(result);
  const parsed = parseLocationsPimis(withLocations);
  const parsedSdg = parseSdgsPimis(parsed);

  return parsedSdg;
}
