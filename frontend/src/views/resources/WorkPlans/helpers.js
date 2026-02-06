import moment from "moment";
import { getFeatureValue } from "../../../helpers/checkPermission";

export const checkActivityInFiscalPeriod = ({ start_date, end_date, year }) => {
  const fiscalStartDate = getFeatureValue("fiscal_year_start_date");

  const startFiscalYear = moment(
    `${fiscalStartDate}/${year}`,
    "DD/MM/YYYY"
  );
  const endFiscalYear = moment(
    `${fiscalStartDate}/${year + 1}`,
    "DD/MM/YYYY"
  ).add(-1, 'days');

  const startIsAfter = moment(start_date).isSameOrAfter(startFiscalYear) || moment(end_date).isBefore(startFiscalYear);
  const endIsAfter = moment(end_date).isSameOrAfter(endFiscalYear) || (moment(end_date).isSameOrAfter(startFiscalYear) && moment(end_date).isBefore(endFiscalYear));

  return startIsAfter || endIsAfter
};
