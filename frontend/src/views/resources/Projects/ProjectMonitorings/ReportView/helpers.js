import {
  getFiscalYearValue,
  getFiscalYearValueFromYear,
} from "../../../../../helpers/formatters";

export function getActivitiesForOutput(record, outputId) {
  return record.me_activities
    ? record.me_activities.filter(
        (activityItem) =>
          activityItem &&
          activityItem.activity &&
          activityItem.activity.output_ids.includes(outputId)
      )
    : [];
}

export function renderTitle(record, projectDetails, title) {
  if (record && record.frequency === "ANNUAL") {
    return `${title} for the quarter - ${record.quarter}, ${
      getFiscalYearValueFromYear(record.year).name
    } `;
  }

  return `${title} from ${
    getFiscalYearValue(projectDetails.start_date).name
  } to ${record.quarter},${
    getFiscalYearValueFromYear(record.year).name
  } (cumulative)`;
}
