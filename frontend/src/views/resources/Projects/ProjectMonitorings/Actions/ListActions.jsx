// import { Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import {
  Show,
  TabbedShowLayout,
  Tab,
  SimpleShowLayout,
  useDataProvider,
  TopToolbar,
  ShowButton,
  Button,
  EditButton,
  CreateButton,
} from "react-admin";
import {
  checkFeature,
  useCheckPermissions,
} from "../../../../../helpers/checkPermission";
import CustomPrintButton from "../../Actions/Buttons/CustomPrintButton";
import CreateReportButton from "../../Actions/Show/ReportCreateButton";

//add props undoable={false} for save without undo
const ListActions = ({
  basePath,
  data,
  resource,
  location,
  projectId,
  id,
  ...props
}) => {
  const checkPermissions = useCheckPermissions();

  return (
    <TopToolbar style={{ position: "relative", width: "100%" }}>
      {checkPermissions(
        props.yearReport
          ? "me_create_year_report"
          : "me_create_periodical_report"
      ) &&
        checkPermissions("create_me_report") &&
        !props.disableCreate && (
          <CreateReportButton
            {...props}
            project_id={projectId}
            style={{ color: "#3f50b5" }}
          />
        )}
    </TopToolbar>
  );
};

export default ListActions;
