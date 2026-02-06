import * as React from "react";
import Button from "@material-ui/core/Button";
import Assignment from "@material-ui/icons/Assignment";
import { useDataProvider, useRedirect } from "react-admin";
import lodash from "lodash";
import { checkFeature } from "../../../helpers/checkPermission";

const CompletionReportInList = ({
  record,
  reportType,
  link,
  title,
  ...props
}) => {
  const dataProvider = useDataProvider();
  const redirect = useRedirect();

  function getMeReportProjectDetail(projectDetails, field) {
    const lastDetailId = lodash.maxBy(projectDetails, "id");
    const mePhase = lodash.find(projectDetails, (item) =>
      checkFeature("project_actions_create_me_form", item.phase_id)
    );
    return mePhase ? mePhase[field] : lastDetailId[field];
  }

  function handleClick() {
    dataProvider
      .getListOfAll("project-details", {
        filter: { project_id: Number(record.id) },
        sort_field: "id",
      })
      .then((response) => {
        const projectDetailId = getMeReportProjectDetail(response.data, "id");
        redirect(`/project/${projectDetailId}/${link}`);
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

export default CompletionReportInList;
