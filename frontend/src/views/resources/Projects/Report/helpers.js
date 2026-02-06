import lodash, { repeat } from "lodash";
import moment from "moment";
import numeral from "numeral";
import { checkFeature } from "../../../../helpers/checkPermission";
import {
  getFiscalYearsRange,
  getFiscalYearsRangeForIntervals,
} from "../../../../helpers/formatters";

export const getInvestmentYears = (activities) => {
  const years = [];
  activities.forEach((item) => {
    return lodash.concat(
      item.investments.forEach((investment) =>
        lodash.keys(investment.costs).forEach((cost) => {
          years.push(cost);
        })
      )
    );
  });
  return lodash.uniq(lodash.flatten(years));
};

export const getInvestmentValue = (activity, year) => {
  const summByYear = lodash.sumBy(activity.investments, (item) =>
    parseFloat(item[year])
  );
  return lodash.isNaN(summByYear) ? 0 : summByYear;
};

export const getTotalForInvestment = (activity, investment) => {
  let total = 0;
  activity.investment_years.forEach((year) => {
    total += investment[year] ? parseFloat(investment[year]) : 0;
  });
  return lodash.isNaN(total) ? 0 : total;
};

export const getTotalValueForActivity = (activities, year) => {
  let summByYear = 0;
  let totalByYear = 0;
  activities.forEach((activity) => {
    activity.investments.forEach((investment) => {
      totalByYear += investment[year] ? parseFloat(investment[year]) : 0;
    });
  });

  return lodash.isNaN(totalByYear) ? 0 : totalByYear;
};

export const getTotalProjectCost = (record) => {
  const targetYears = getFiscalYearsRangeForIntervals(
    record.start_date,
    record.end_date
  );
  let total = 0;
  if (record.activities && record.activities.length > 0) {
    record.activities.forEach((activity) => {
      if (activity.investments && activity.investments.length > 0) {
        targetYears.forEach((year) => {
          activity.investments.forEach((investment) => {
            if (investment.costs[Number(year.id)]) {
              total += parseFloat(investment.costs[Number(year.id)]);
            }
          });
        });
      }
    });
  }

  return lodash.isNaN(total) ? 0 : total;
};

export const getTotalProjectOutputsCost = (record) => {
  let totalOutput = 0;
  const targetYears = getFiscalYearsRangeForIntervals(
    record.start_date,
    record.end_date
  );
  if (record.outputs && record.outputs.length > 0) {
    record.outputs.forEach((output) => {
      if (output.investments && output.investments.length > 0) {
        targetYears.forEach((year) => {
          output.investments &&
            output.investments.forEach((investment) => {
              if (investment?.costs && investment.costs[Number(year.id)]) {
                totalOutput += parseFloat(investment.costs[Number(year.id)]);
              }
            });
        });
      }
    });
  }
  return lodash.isNaN(totalOutput) ? 0 : totalOutput;
};

export const costSumFormatter = (value, decimalCount) => {
  if (!value) {
    return "-";
  }
  return typeof value !== "undefined" && value !== 0
    ? checkFeature("has_ibp_fields")
      ? numeral(value).format("0,0")
      : numeral(value).format(`0,0.00`) //remove all coins
    : // : numeral(value).format(`0,0.${decimalCount === 1 ? "0" : "00"}`) //remove all coins
      "-";
};

export const costSumFormatterReportBuilder = (
  value,
  decimalCount,
  currency
) => {
  if (!value) {
    return "-";
  }

  return typeof value !== "undefined" && parseFloat(value) !== 0
    ? numeral(value / 1000).format(
        `0,0.${repeat("0", decimalCount)}`
      ) //numeral(parseFloat(value) / 1000).format(`0,0.00`) //remove all coins
    : "-";
};

export const costSumFormatterReports = (value) => {
  if (!value) {
    return "-";
  }
  return typeof value !== "undefined" && value !== 0
    ? numeral(value).format("0,0.00a")
    : "-";
};

export const billionsFormatter = (value, onlyNumbers) => {
  if (!value) {
    return "0";
  }
  if (typeof value !== "undefined" && value !== 0) {
    if (value > 1000000) {
      return numeral(value / 1000000).format("0,0.00") + "M";
    }
    if (value > 1000) {
      return numeral(value / 1000).format("0,0.00") + "K";
    }

    return numeral(value).format("0,0.00");
  }
  // ? numeral(value / 1000).format("0,0.00")
  // : "0";
};

export const getFiscalYears = (startDate, endDate) => {
  const startDateYear = moment(startDate).startOf("year");
  const startDateFiscalEnd = startDateYear.clone().add(1, "years");

  const endDateYear = moment(endDate).startOf("year");
  const endDateFiscalEnd = endDateYear.clone().add(1, "years");

  const dateDiff = endDateYear.diff(startDateYear, "years");
  // const endDateFiscalEnd = endDateYear.clone().add(1, 'years');

  return `Start Date: FY${startDateYear.format(
    "YYYY"
  )}/${startDateFiscalEnd.format("YY")}, 
    End Date: FY${endDateYear.format("YYYY")}/${endDateFiscalEnd.format("YY")}, 
    Duration years: ${dateDiff + 1} years`;
};
export const getCalendarDates = (startDate, endDate) => {
  return `Start Date: ${startDate}, 
    End Date: ${endDate}`;
};

export const getTargetYearsFromSignedDate = (projectDetails) => {
    if (!projectDetails) return [];

    const duration =
        (projectDetails &&
            moment(projectDetails.end_date, "YYYY-MM-DD").diff(
                moment(projectDetails.start_date, "YYYY-MM-DD"),
                "years"
            ) + 1) ||
        0;
    const startDate = projectDetails.project.signed_date || projectDetails.start_date;

    const targetYears =
        projectDetails &&
        getFiscalYearsRangeForIntervals(
            startDate,
            moment(startDate).add(duration, "years")
        );

    return targetYears
}