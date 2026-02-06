import * as React from "react";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import Assignment from "@material-ui/icons/Assignment";

const CompletionReportShowButton = (props) => {
  return props && props.project_detail_id ? (
    <Button
      {...props}
      component={Link}
      to={{
        pathname: `/project/${props.project_detail_id}/completion-report`,
      }}
      startIcon={<Assignment />}
    >
     Completion Report
    </Button>
  ) : null;
};

export default CompletionReportShowButton;
