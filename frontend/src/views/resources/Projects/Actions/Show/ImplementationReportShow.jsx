import * as React from "react";
import Button from "@material-ui/core/Button";
import Assignment from "@material-ui/icons/Assignment";
import { useDataProvider, useRedirect } from "react-admin";
import lodash from "lodash";

const ImplementationReportShow = ({
  record,
  reportType,
  link,
  title,
  ...props
}) => {
  const dataProvider = useDataProvider();
  const redirect = useRedirect();

  function handleClick() {
    dataProvider
      .getListOfAll("project-details", {
        filter: { project_id: Number(record.id) },
        sort_field: "id",
      })
      .then((response) => {
        const lastDetailId = lodash.maxBy(response.data, "id");
        redirect(`/implementation-module/${lastDetailId?.id}/${link}`);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <Button
      {...props}
      color="primary"
      startIcon={<Assignment />}
      onClick={handleClick}
    >
      {title}
    </Button>
  );
};

export default ImplementationReportShow;
