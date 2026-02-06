import React, { Fragment } from "react";
import Introduction from "../../../modules/Project/Introduction";

function IntroductionForm(props) {
  return (
    <Fragment>
      <Introduction {...props} />
    </Fragment>
  );
}

export default IntroductionForm;
