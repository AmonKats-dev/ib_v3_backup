import moment from "moment";
import { CURRENT_NUMBER_FORMAT, NUMBER_FORMATS } from "../constants/common";
import lodash from "lodash";
import { checkFeature, getFeatureValue } from "./checkPermission";

export const getFiscalYearsByDuration = (dateFrom, duration) => {
  function calculateYears(countYears, isPrevious) {
    const currentYear = moment(dateFrom).startOf("year");
    let counter = 1;
    let years = [];
    do {
      let yearStart = currentYear.add(isPrevious ? -1 : 1, "years");
      let yearEnd = yearStart.clone().add(1, "years");
      years.push({
        id: yearStart.format("YYYY-MM-DD"),
        name: `${yearStart.format("YYYY")}/${yearEnd.format("YY")}`,
      });
      counter += 1;
    } while (Math.abs(counter) !== countYears);

    return years;
  }
  const currentDate = moment(dateFrom).startOf("year");
  const currentDateEnd = currentDate.clone().add(1, "years");
  const contYears = calculateYears(duration, false);

  if (dateFrom) {
    return [
      {
        id: currentDate.format("YYYY-MM-DD"),
        name: `FY${currentDate.format("YYYY")}/${currentDateEnd.format("YY")}`,
      },
      ...contYears,
    ];
  }

  return []
};

export const getFiscalYearsFromDate = (dateFrom, yearsLimit, showPrevious) => {
  function calculateYears(countYears, isPrevious) {
    const currentYear = moment(dateFrom).startOf("year");
    let counter = 1;
    let years = [];
    do {
      let yearStart = currentYear.add(isPrevious ? -1 : 1, "years");
      let yearEnd = yearStart.clone().add(1, "years");
      years.push({
        id: yearStart.format("YYYY-MM-DD"),
        name: `FY${yearStart.format("YYYY")}/${yearEnd.format("YY")}`,
      });
      counter += 1;
    } while (Math.abs(counter) !== countYears);

    return years;
  }
  const currentDate = moment(dateFrom).startOf("year");
  const currentDateEnd = currentDate.clone().add(1, "years");
  const prevYears = calculateYears(yearsLimit || 4, true).reverse();
  const contYears = calculateYears(10, false);

  if (dateFrom && !showPrevious) {
    return [
      {
        id: currentDate.format("YYYY-MM-DD"),
        name: `FY${currentDate.format("YYYY")}/${currentDateEnd.format("YY")}`,
      },
      ...contYears,
    ];
  }

  return [
    ...prevYears,
    {
      id: currentDate.format("YYYY-MM-DD"),
      name: `FY${currentDate.format("YYYY")}/${currentDateEnd.format("YY")}`,
    },
    ...contYears,
  ];
};

export const getFiscalYears = (yearsLimit) => {
  function calculateYears(countYears, isPrevious) {
    const currentYear = moment().startOf("year");
    let counter = 1;
    let years = [];
    do {
      let yearStart = currentYear.add(isPrevious ? -1 : 1, "years");
      let yearEnd = yearStart.clone().add(1, "years");
      years.push({
        id: yearStart.format("YYYY-MM-DD"),
        name: `FY${yearStart.format("YYYY")}/${yearEnd.format("YY")}`,
      });
      counter += 1;
    } while (Math.abs(counter) !== countYears);

    return years;
  }
  const currentDate = moment().startOf("year");
  const currentDateEnd = currentDate.clone().add(1, "years");
  const prevYears = calculateYears(yearsLimit || 4, true).reverse();
  const contYears = calculateYears(10, false);

  return [
    ...prevYears,
    {
      id: currentDate.format("YYYY-MM-DD"),
      name: `FY${currentDate.format("YYYY")}/${currentDateEnd.format("YY")}`,
    },
    ...contYears,
  ];
};

export const getFiscalYearsBaseline = (startDate, endDate) => {
  function calculateYears(countYears, isPrevious) {
    const currentYear = moment().startOf("year");
    let counter = 1;
    let years = [];
    do {
      let yearStart = currentYear.add(isPrevious ? -1 : 1, "years");
      let yearEnd = yearStart.clone().add(1, "years");
      years.push({
        id: yearStart.format("YYYY-MM-DD 00:00:00"),
        name: `FY${yearStart.format("YYYY")}/${yearEnd.format("YY")}`,
      });
      counter += 1;
    } while (Math.abs(counter) !== countYears);

    return years;
  }
  const currentDate = moment().startOf("year");
  const currentDateEnd = currentDate.clone().add(1, "years");
  const prevYears = calculateYears(10, true).reverse();
  const contYears = calculateYears(10, false);

  return [
    ...prevYears,
    {
      id: currentDate.format("YYYY-MM-DD"),
      name: `FY${currentDate.format("YYYY")}/${currentDateEnd.format("YY")}`,
    },
    ...contYears,
  ];
};

export const getFiscalYearsRange = (startDate, endDate) => {
  function calculateYears(countYears, isPrevious) {
    const currentYear = moment(startDate).startOf("year");
    const currentYearEnd = currentYear.clone().add(1, "years");
    let counter = 0;
    let years = [
      {
        id: currentYear.format("YYYY-MM-DD"),
        name: `FY${currentYear.format("YYYY")}/${currentYearEnd.format("YY")}`,
      },
    ];
    if (countYears === 0) {
      return years;
    }
    do {
      let yearStart = currentYear.add(1, "years");
      let yearEnd = yearStart.clone().add(1, "years");
      years.push({
        id: yearStart.format("YYYY-MM-DD"),
        name: `FY${yearStart.format("YYYY")}/${yearEnd.format("YY")}`,
      });
      counter += 1;
    } while (Math.abs(counter) !== countYears);

    return years;
  }

  let contYears;
  if (startDate && endDate && startDate !== endDate) {
    const startYear = moment(startDate, "YYYY");
    let endYear = moment(endDate, "YYYY");
    let dateDiff = endYear.diff(startYear, "years");

    contYears = calculateYears(dateDiff, false);
    return contYears;
  }

  return calculateYears(0, false);
};

export const getCalendarYearsRangeForIntervals = (startDate, endDate) => {
  function calculateYears(countYears, isPrevious) {
    const currentYear = moment(startDate).startOf("year");
    const currentYearEnd = currentYear.clone().add(1, "years");
    let counter = 0;
    let years = [
      {
        id: currentYear.format("YYYY-MM-DD"),
        name: currentYear.format("YYYY"),
      },
    ];
    if (countYears === 0) {
      return years;
    }
    do {
      let yearStart = currentYear.add(1, "years");
      let yearEnd = yearStart.clone().add(1, "years");
      years.push({
        id: yearStart.format("YYYY-MM-DD"),
        name: yearStart.format("YYYY"),
      });
      counter += 1;
    } while (Math.abs(counter) !== countYears);

    return years;
  }

  let contYears;
  if (startDate && endDate && startDate !== endDate) {
    const startYear = moment(startDate, "YYYY");
    let endYear = moment(endDate, "YYYY");
    let dateDiff = endYear.diff(startYear, "years");

    contYears = calculateYears(dateDiff, false);
    return contYears;
  }

  return calculateYears(0, false);
};

export const getCurrentFiscalYearDate = (date) => {
  const fiscalStartDate = getFeatureValue("fiscal_year_start_date");

  if (!fiscalStartDate) return date;

  const currentDate = moment(date);
  const startYear = currentDate.format("YYYY");
  const startDayMonth = currentDate.format("MM-DD");
  const startFiscalYear = moment(
    `${fiscalStartDate}/${startYear}`,
    "DD/MM/YYYY"
  );
  return currentDate.isSameOrAfter(startFiscalYear)
    ? `${Number(startYear)}-${startDayMonth}`
    : `${Number(startYear) - 1}-${startDayMonth}`

};

export const getFiscalYearsRangeForIntervals = (startDate, endDate) => {
  function calculateYears(countYears, isPrevious) {
    const currentYear = moment(startDate, "YYYY");
    const currentYearEnd = currentYear.clone().add(1, "years");
    let counter = 0;
    let years = [
      {
        id: currentYear.format("YYYY"),
        name: `FY${currentYear.format("YYYY")}/${currentYearEnd.format("YY")}`,
      },
    ];
    if (countYears === 0) {
      return years;
    }

    do {
      let yearStart = currentYear.add(1, "years");
      let yearEnd = yearStart.clone().add(1, "years");
      years.push({
        id: yearStart.format("YYYY"),
        name: `FY${yearStart.format("YYYY")}/${yearEnd.format("YY")}`,
      });
      counter += 1;
    } while (Math.abs(counter) !== countYears || isNaN(countYears));

    return years;
  }

  let contYears;
  if (startDate && endDate && startDate !== endDate) {
    const startYear = moment(getCurrentFiscalYearDate(startDate), "YYYY");
    let endYear = moment(getCurrentFiscalYearDate(endDate), "YYYY");
    let dateDiff = endYear.diff(startYear, "years");
    contYears = calculateYears(dateDiff, false);
    return contYears;
  }

  return calculateYears(0, false);
};

export const getFiscalYearValue = (startDate) => {
  const currentYear = moment(startDate).startOf("year");
  const currentYearEnd = currentYear.clone().add(1, "years");
  return {
    id: currentYear.format("YYYY-MM-DD"),
    name: `FY${currentYear.format("YYYY")}/${currentYearEnd.format("YY")}`,
  };
};

export const getFiscalYearValueFromYear = (startDate) => {
  const currentYear = moment(startDate, "YYYY").startOf("year");
  const currentYearEnd = currentYear.clone().add(1, "years");
  return {
    id: currentYear.format("YYYY-MM-DD"),
    name: `FY${currentYear.format("YYYY")}/${currentYearEnd.format("YY")}`,
  };
};

export const romanize = (num) => {
  if (CURRENT_NUMBER_FORMAT === NUMBER_FORMATS.ARABIC) {
    return num;
  }

  var key = [
    "",
    "C",
    "CC",
    "CCC",
    "CD",
    "D",
    "DC",
    "DCC",
    "DCCC",
    "CM",
    "",
    "X",
    "XX",
    "XXX",
    "XL",
    "L",
    "LX",
    "LXX",
    "LXXX",
    "XC",
    "",
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
  ];
  var roman = "";

  if (String(num).indexOf(".") > -1) {
    var digitsWithDots = String(num).split(".");
    var resultArray = digitsWithDots.map((item) => {
      var idx = 3;
      roman = "";
      var subCounters = String(+item).split("");
      while (idx--) {
        roman = (key[+subCounters.pop() + idx * 10] || "") + roman;
      }

      return Array(+subCounters.join("") + 1).join("M") + roman;
    });
    return resultArray.join(".");
  } else {
    var digits = String(+num).split("");
    var i = 3;
    roman = "";

    while (i--) roman = (key[+digits.pop() + i * 10] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
  }
};

export const optionRendererCodeName = (choice) => {
  return choice ? `${choice.code}-${choice.name}` : null;
};

export const getYears = (years) => {
  if (years) {
    const startDate = years[0];
    const endDate = years[years.length - 1];

    return getFiscalYearsRangeForIntervals(startDate, endDate);
  }

  return [];
};

export const getIndicatorsYears = (years) => {
  if (years) {
    if (lodash.isArray(years)) {
      const startDate = years[0];
      const endDate = years[years.length - 1];

      return getFiscalYearsRangeForIntervals(startDate, endDate);
    } else {
      return getFiscalYearValue(years);
    }
  }

  return [];
};

export const getYearsRange = (startDate, endDate) => {
  function calculateYears(countYears, isPrevious) {
    const currentYear = moment(startDate).startOf("year");
    const currentYearEnd = currentYear.clone().add(1, "years");
    let counter = 0;
    let years = [
      {
        id: currentYear.format("YYYY"),
        name: currentYear.format("YYYY"),
      },
    ];
    if (countYears === 0) {
      return years;
    }
    do {
      let yearStart = currentYear.add(1, "years");
      let yearEnd = yearStart.clone().add(1, "years");
      years.push({
        id: currentYear.format("YYYY"),
        name: currentYear.format("YYYY"),
      });
      counter += 1;
    } while (Math.abs(counter) !== countYears);

    return years;
  }

  let contYears;
  if (startDate && endDate && startDate !== endDate) {
    const startYear = moment(startDate, "YYYY");
    let endYear = moment(endDate, "YYYY");
    let dateDiff = endYear.diff(startYear, "years");

    contYears = calculateYears(dateDiff, false);
    return contYears;
  }

  return calculateYears(0, false);
};
