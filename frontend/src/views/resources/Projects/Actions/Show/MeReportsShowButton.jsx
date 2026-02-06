import * as React from "react";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import Assignment from "@material-ui/icons/Assignment";
import { useDataProvider, useNotify, useRedirect } from "react-admin";
import lodash from "lodash";

const MeReportsShowButton = ({ record, reportType, ...props }) => {
  const dataProvider = useDataProvider();
  const redirect = useRedirect();
  const notify = useNotify();

  function handleClick() {
    dataProvider
      .getListOfAll("project-details", {
        filter: { project_id: Number(record.id) },
        sort_field: "id",
      })
      .then((response) => {
        const lastDetailId = lodash.maxBy(response.data, "id");
        redirect(`/project/${lastDetailId?.id}/me-reports/${reportType}`);
      })
      .catch((error) => {
        notify(error.message, "error");
      });
  }

  return (
    <Button
      {...props}
      color="primary"
      startIcon={<Assignment />}
      onClick={handleClick}
    >
      M&E REPORT
    </Button>
  );
};

export default MeReportsShowButton;
