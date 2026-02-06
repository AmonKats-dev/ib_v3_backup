import React, { Fragment } from "react";
import { getFiscalYearValue } from "../../../../../helpers/formatters";
import { PhysicalMonitoringFramework } from "../ReportView/PhysicalMonitoringFramework";

function MEOutputsForm(props) {
  function renderTitle() {
    const { record } = props;
    if (record && record.frequency === "ANNUAL") {
      return `Physical Progress reporting for the quarter - ${
        record.quarter
      }, ${getFiscalYearValue("01-01-" + record.year).name} `;
    }

    return `Physical Progress reporting until ${record.quarter}, ${
      getFiscalYearValue("01-01-" + record.year).name
    } (cumulative)`;
  }

  return (
    <Fragment>
      <h2>{renderTitle()}</h2>
      <PhysicalMonitoringFramework
        {...props}
        projectDetails={props.details}
        hideTitle
      />
    </Fragment>
  );
}

export default MEOutputsForm;
