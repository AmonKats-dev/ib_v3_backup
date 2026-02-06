import React, { Fragment } from "react";
import { FormDataConsumer } from "react-admin";
import Typography from "@material-ui/core/Typography";

import { connect } from "react-redux";
import { useFormState } from "react-final-form";
import Components from "./Components";

function CostEstimates(props) {
  const { values } = useFormState();

  return (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, ...rest }) => {
        return (
          <Fragment>
            <Components {...props} />
          </Fragment>
        );
      }}
    </FormDataConsumer>
  );
}

const mapStateToProps = (state) => ({
  loading: state.admin.loading,
});

export default connect(mapStateToProps, null)(CostEstimates);
