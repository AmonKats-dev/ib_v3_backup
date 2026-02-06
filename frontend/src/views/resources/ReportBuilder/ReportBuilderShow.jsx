import React from "react";
import { Show, SimpleShowLayout, TopToolbar, EditButton } from "react-admin";
import { EXPORT_TYPES } from "../../../constants/common";
import { useCheckPermissions } from "../../../helpers/checkPermission";
import ReportBuilderViewer from "../../pages/ReportBuilderViewer";
import ExportActions from "../../pages/reports/ExportActions";
import CustomPrintButton from "../Projects/Actions/Buttons/CustomPrintButton";

const ShowView = ({ record, ...props }) => {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h1 style={{ marginRight: "20px" }}>{`${record && record.name}`} </h1>
      </div>

      {/* <ExportActions
        reportId="custom-report-viewer"
        title="Custom Report"
        exportTypes={[EXPORT_TYPES.WORD, EXPORT_TYPES.PDF]}
      /> */}

      <ReportBuilderViewer
        {...props}
        initialParams={record && record.config}
        isReadOnly
      />
    </div>
  );
};

const Actions = (props) => {
  const checkPermission = useCheckPermissions();
  return (
    <TopToolbar>
      {checkPermission("save_public_custom_report") &&
        checkPermission("edit_custom_report") && (
          <EditButton {...props} record={props.data} />
        )}
      {/* <CustomPrintButton printId="pivot" record={props.data} isEditUser /> */}
    </TopToolbar>
  );
};

const ReportBuilderShow = (props) => {
  return (
    <Show {...props} actions={<Actions {...props} />}>
      <SimpleShowLayout>
        <ShowView />
      </SimpleShowLayout>
    </Show>
  );
};

export default ReportBuilderShow;
