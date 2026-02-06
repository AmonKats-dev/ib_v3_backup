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
} from "react-admin";
import {
  checkFeature,
  useCheckPermissions,
} from "../../../../../helpers/checkPermission";
import CustomPrintButton from "../../Actions/Buttons/CustomPrintButton";
import WorkflowActions from "./WorkflowActions";

//add props undoable={false} for save without undo
const ShowActions = ({
  basePath,
  data,
  resource,
  location,
  projectId,
  projectDetailsId,
  id,
  ...props
}) => {
  const checkPermissions = useCheckPermissions();

  function hasExportRules() {
    return (
      data && checkPermissions("export_me_project") //TODO remove after check
    );
  }

  function hasEditRules() {
    return (
      data &&
      (data.report_status === "DRAFT" || data.report_status === "REVISED") &&
      checkPermissions("me_edit_report")
    );
  }

  function hasActionsRules() {
    return (
      data && checkPermissions("me_actions_report") //TODO remove after check
    );
  }

  return (
    <TopToolbar style={{ minHeight: '45px' }}>
      <Button
        href={`/#/project/${projectDetailsId}/me-reports`}
        label="Back to Reports"
        style={{ position: "absolute", left: 10, top: 0 }}
      />
      {hasEditRules() && <EditButton basePath={basePath} record={data} />}
      {hasActionsRules() && <WorkflowActions record={data} />}
      {checkFeature("me_project_export") && hasExportRules() && (
        <CustomPrintButton
          printId="docx"
          record={data}
          isEditUser={hasExportRules()}
          title={props.title}
          subtitle={props.subtitle}
          meReport
        />
      )}
    </TopToolbar>
  );
};

export default ShowActions;
