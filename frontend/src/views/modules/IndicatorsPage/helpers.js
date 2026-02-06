import moment from "moment";
import { getFiscalYearsRangeForIntervals } from "../../../helpers/formatters";

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