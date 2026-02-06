import * as React from "react";
// import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import Assignment from "@material-ui/icons/Assignment";
import { Button } from "react-admin";

const CreateReportButton = (props) => {
  return props && props.project_id ? (
    <Button
      // href={`/#/project/${props.project_id}/me-report/create/${
      //   props.yearReport || false
      // }`}
      href={`#/project/${props.project_id}/me-report/create/${
        props.yearReport || false
      }`}
      label={
        props.yearReport ? "Create Quarter Report" : "Create Periodical Report"
      }
      startIcon={<Assignment />}
    />
  ) : null;
};

export default CreateReportButton;
