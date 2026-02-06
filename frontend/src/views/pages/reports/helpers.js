import lodash from "lodash";

export function calculateCost(costs) {
  let totalSum = 0;
  lodash.keys(costs).forEach((year) => {
    if (costs[year]) {
      totalSum += Number(costs[year]);
    }
  });

  return totalSum;
}


export function getProjectsBySectors(data) {
    const levels = {};

    function findParents(item) {
      if (item && item.level){
        levels[item.level] = item.id;
      }

      if (item && item.parent) {
        return findParents(item.parent);
      }
      return item;
    }

    return lodash.groupBy(
      data,
      (item) => findParents(item.project_organization) && findParents(item.project_organization).name
    );
  }


export function getProjectsByPrograms(data) {
  const levels = {};

  function findParents(item) {
    if (item && item.level){
      levels[item.level] = item.id;
    }

    if (item && item.parent) {
      return findParents(item.parent);
    }
    return item;
  }

  return lodash.groupBy(
    data,
    (item) => findParents(item.program).name
  );
}


export function getProjectsByFunctions(data) {
  const levels = {};

  function findParents(item) {
    if (item && item.level){
      levels[item.level] = item.id;
    }

    if (item && item.parent) {
      return findParents(item.parent);
    }
    return item;
  }

  return lodash.groupBy(
    data,
    (item) => findParents(item.function).name
  );
}