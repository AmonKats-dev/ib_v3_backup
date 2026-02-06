import React from "react";
import HTML2React from "html2react";
import { useTranslate } from "react-admin";
import {
  getFiscalYearsRangeForIntervals,
  romanize,
  getFiscalYearValue,
} from "../../../../../../helpers/formatters";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  TableBody,
} from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import moment from "moment";
import { formatValuesToQuery } from "../../../../../../helpers/dataHelpers";
import { checkFeature } from "../../../../../../helpers/checkPermission";
import { costSumFormatter } from "../../helpers";
import { getComponentCodeName } from "../../../../../pages/helpers";

function getActivitiesForOutput(record, outputId) {
  return record.activities.filter((activity) =>
    activity.output_ids.includes(outputId)
  );
}

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 700,
  },
  bordered: {
    border: `1px solid ${theme.palette.border}`,
    "& td": {
      padding: "0.75rem",
      verticalAlign: "top",
      border: "1px solid #c8ced3",
    },
    "& th": {
      padding: "0.75rem",
      verticalAlign: "top",
      border: "1px solid #c8ced3",
    },
  },
  filledRow: {
    backgroundColor: theme.palette.action.hover,
    fontWeight: "bold",
  },
}));

const getOutcomesForOutput = (record, item) => {
  const filtered = record.outcomes.filter((outcome) =>
    item.outcome_ids.includes(outcome.id)
  );

  return filtered && filtered.length !== 0
    ? filtered.map((outcome) => outcome.name).join(", ")
    : "-";
};

export const CostEstimates = (props) => {
  const classes = useStyles();
  const translate = useTranslate();
  const { customRecord, customBasePath } = props;
  const counter = props.counter || 3;
  const record = formatValuesToQuery(customRecord);

  const fiscalYearsFromProps = getFiscalYearsRangeForIntervals(
    record.start_date,
    record.end_date
  );

  const getComponentTotalCost = (component) => {
    if (component.investments && component.investments.length > 0) {
      let total = 0;
      component.investments.forEach((it) => {
        for (const key in it.costs) {
          if (Object.hasOwnProperty.call(it.costs, key)) {
            const element = it.costs[key];
            total += parseFloat(element);
          }
        }
      });

      return costSumFormatter(total);
    }

    return costSumFormatter(component.cost);
  };
  return (
    <div className="landscapeSection">
      <div className="content-area">
        <h2>
          {romanize(counter)}.{" "}
          {translate("printForm.project_framework.title_cost_estimates")}
        </h2>

        <div className="row">
          <div className="col-sm-6">
            <TableContainer>
              <Table
                size="small"
                className={clsx("bordered", classes.bordered, classes.table)}
              >
                <TableBody>
                  <TableRow className={classes.filledRow}>
                    <TableCell>
                      {translate("printForm.cost_estimates.components.title")}
                    </TableCell>
                    <TableCell style={{ width: 200 }}>
                      {translate("printForm.cost_estimates.components.cost")}
                    </TableCell>
                  </TableRow>

                  {record &&
                    record.components &&
                    record.components.map((component, componentIdx) => [
                      <TableRow>
                        <TableCell>
                          <p>{`${translate(
                            "printForm.cost_estimates.components.name",
                            { smart_count: 1 }
                          )} ${componentIdx + 1}: ${getComponentCodeName(
                            component
                          )}`}</p>
                          <div
                            style={{ fontSize: "12px", fontStyle: "italic" }}
                          >
                            {HTML2React(component.description)}
                            {component.subcomponents &&
                            component.subcomponents.length > 0 ? (
                              <ul>
                                {component.subcomponents.map(
                                  (subcomponent, subcomponentIdx) => (
                                    <li>
                                      <p>{`${translate(
                                        "printForm.cost_estimates.subcomponents.name",
                                        { smart_count: 1 }
                                      )} ${subcomponentIdx + 1}: ${
                                        subcomponent.name
                                      } ${
                                        component.is_milestone
                                          ? "(Major Milestone)"
                                          : ""
                                      }`}</p>
                                      <div
                                        style={{
                                          fontSize: "12px",
                                          fontStyle: "italic",
                                        }}
                                      >
                                        {HTML2React(subcomponent.description)}
                                      </div>
                                    </li>
                                  )
                                )}
                              </ul>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell>
                          {/* {costSumFormatter(component.cost)} */}
                          {getComponentTotalCost(component)}
                        </TableCell>
                      </TableRow>,
                    ])}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
