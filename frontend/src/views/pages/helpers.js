import lodash from "lodash";

export function getLevelChain(data, config) {
  const { organizational_config, programs_config, functions_config } = config;
  const formatted = data
    // .filter((item) => item.costs && !lodash.isEmpty(item.costs))
    .map((item) => {
      const levels = {};
      function findParents(item) {
        if (item && item.level && organizational_config[item.level]) {
          levels[organizational_config[item.level].name] = item.name;
        }
        if (item && item.parent) {
          return findParents(item.parent);
        }

        return item;
      }

      if (item.project_organization) findParents(item.project_organization);

      return { ...item, ...levels };
    })
    .map((item) => {
      const levels = {};
      function findParents(item) {
        if (item && item.level && programs_config[item.level]) {
          levels[programs_config[item.level].name] = item.name;
        }

        if (item && item.parent) {
          return findParents(item.parent);
        }

        return item;
      }
      if (item.program) findParents(item.program);

      return { ...item, ...levels };
    })
    .map((item) => {
      const levels = {};
      function findParents(item) {
        if (item && item.level && functions_config[item.level]) {
          levels[functions_config[item.level].name] = item.name;
        }

        if (item && item.parent) {
          return findParents(item.parent);
        }

        return item;
      }

      if (item.function) findParents(item.function);

      return { ...item, ...levels };
    })
    .map((item) => {
      delete item.program;
      delete item.function;
      delete item.project_organization;
      return item;
    });

  return formatted.map((item) => {
    item.TotalCost =
      item.current_project_detail?.investment_stats?.total_cost || 0;
    item.TotalCount = 1;
    item.Phase = `${item.phase.sequence}. ${item.phase.name}`;
    item.PhaseSequence = item.phase.sequence;
    item.Name = item.name;
    item.Code = item.code;
    item.Status = item.project_status;

    delete item.phase;
    delete item.costs;
    delete item.id;
    delete item.ranking_data;
    delete item.program;
    delete item.project_status;
    delete item.name;
    delete item.code;
    return item;
  });
}

export function getLevelChainUg(data, config) {
  const { organizational_config, programs_config, functions_config } = config;
  const formatted = data
    .map((item) => {
      const levels = {};
      function findParents(item) {
        if (item && item.level && organizational_config[item.level]) {
          levels[organizational_config[item.level].name] = item.name;
        }
        if (item && item.parent) {
          return findParents(item.parent);
        }

        return item;
      }

      if (item.project_organization) findParents(item.project_organization);

      return { ...item, ...levels };
    })
    .map((item) => {
      const levels = {};
      function findParents(item) {
        if (item && item.level && programs_config[item.level]) {
          levels[programs_config[item.level].name] = item.name;
        }

        if (item && item.parent) {
          return findParents(item.parent);
        }

        return item;
      }
      if (item.program) findParents(item.program);

      return { ...item, ...levels };
    })
    .map((item) => {
      const levels = {};
      function findParents(item) {
        if (item && item.level && functions_config[item.level]) {
          levels[functions_config[item.level].name] = item.name;
        }

        if (item && item.parent) {
          return findParents(item.parent);
        }

        return item;
      }

      if (item.function) findParents(item.function);

      return { ...item, ...levels };
    })
    .map((item) => {
      delete item.program;
      delete item.function;
      delete item.project_organization;
      return item;
    });

  return formatted.map((item) => {
    item.TotalCost =
      item.current_project_detail?.investment_stats?.total_cost || 0;
    item.TotalCount = 1;
    item.Phase = `${item.phase && item.phase.sequence}. ${item.phase && item.phase.name
      }`;
    item.Name = item.name;
    item.Code = item.code;
    item.Status = item.project_status;
    item.Classification = item.current_project_detail?.classification;
    item.ImplementingAgencies =
      item.current_project_detail?.implementing_agencies;
    item.StartDate = item.current_project_detail?.start_date;
    item.EndDate = item.current_project_detail?.end_date;
    item.NdpType = item.current_project_detail?.ndp_type;
    item.Enpv = item.ranking_data?.enpv;
    item.Err = item.ranking_data?.err;
    item.Fnpv = item.ranking_data?.fnpv;
    item.Irr = item.ranking_data?.irr;

    let TotalOmCost = 0;
    if (item.current_project_detail?.om_cost === "object") {
      lodash.keys(item.current_project_detail?.om_cost).forEach((cost) => {
        TotalOmCost += parseFloat(item.current_project_detail?.om_cost[cost]);
      });
      item.TotalCost = TotalOmCost;
    }

    item.OmCosts = TotalOmCost;

    delete item.phase;
    delete item.costs;
    delete item.id;
    delete item.ranking_data;
    delete item.program;
    delete item.project_status;
    delete item.name;
    delete item.code;
    return item;
  });
}

export function getComponentCodeName(component) {
  if (!component) return '';

  return component?.code ? component?.code.slice(0, 2) + " - " + component?.name : component?.name
}