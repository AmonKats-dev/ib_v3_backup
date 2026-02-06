import React, { Fragment } from "react";
import OperationMaintenanceCost from "../../../modules/Project/OperationMaintenanceCost";

function OmCostForm(props) {
  return (
    <Fragment>
      <OperationMaintenanceCost {...props} /> 
    </Fragment>
  );
}

export default OmCostForm;
