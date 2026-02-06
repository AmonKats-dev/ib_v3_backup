import { Typography } from "@material-ui/core";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslate, useDataProvider } from "react-admin";
import { USER_ROLES } from "../../../../../../constants/common";
import {
  checkFeature,
  useCheckPermissions,
} from "../../../../../../helpers/checkPermission";
import FileUploader from "../../../../../components/FileUploader";
import lodash from "lodash";

function FilesUploaderSection(props) {
  const [fileTypes, setFileTypes] = useState([]);
  const [fileSelected, setFileSelected] = useState(false);
  const [approvedUploading, setApprovedUploading] = useState(false);
  const translate = useTranslate();
  const { workflow } = props.data;
  const checkPermission = useCheckPermissions();
  const dataProvider = useDataProvider();

  useEffect(() => {
    dataProvider.getListOfAll("file-types", {}).then((response) => {
      if (response && response.data) {
        setFileTypes(response.data);
      }
    });
  }, []);

  useEffect(() => {
    if (props.isConfirmed) {
      setApprovedUploading(true);
    }
  }, [props.isConfirmed]);

  let entityType = "timeline";

  if (checkFeature("has_pimis_fields")) {
    entityType =
      checkPermission("upload_file_to_project") && props.isRequired
        ? "project_detail"
        : "timeline";
  } else {
    entityType =
      checkPermission("upload_file_to_project") &&
      props.isRequired &&
      !props.additional_data.submit_project_analysis
        ? "project_detail"
        : "timeline";
  }

  let fileSubtitle = null;

  if (props.isRequired) {
    if (props.type === "PRIMARY") {
      if (checkPermission("upload_file_to_timeline")) {
        fileSubtitle = translate("workflow.workflow_file_upload");
      }
      if (checkPermission("upload_file_to_project")) {
        fileSubtitle = translate("workflow.va_file_subtitle");
      }
    }
    if (props.type === "SECONDARY") {
      if (checkPermission("upload_file_to_timeline")) {
        fileSubtitle = translate("workflow.workflow_additional_file_upload");
      }
      if (checkPermission("upload_file_to_project")) {
        fileSubtitle = translate("workflow.va_additionalFile_subtitle");
      }
    }
  }

  function handleSelectFile(selected) {
    setFileSelected(selected);
    props.onFileSelect();
  }

  function handleFileUpload(selected) {
    props.onFileUploaded(selected);
  }

  function handleFileDelete(selected) {
    props.onDeleteSelected(selected);
  }

  if (!props.record) return null;

  function getFileTypeName(id) {
    const selected = lodash.find(fileTypes, (item) => item.id === id);

    return selected ? selected.name : null;
  }

  const meta = {
    project_analysis: props.additional_data?.submit_project_analysis,
    completion_report: props.additional_data?.completion_report,
    expost_report: props.additional_data?.expost_report,
  };

  return (
    <Fragment>
      {fileSubtitle && (
        <p style={{ fontStyle: "italic" }}>{getFileTypeName(props.fileType)}</p>
      )}
      <FileUploader
        meta={{
          current_step: workflow.step,
          phase_id: props.record.phase_id,
          ...meta,
          // project_analysis: props.projectAnalysis,
          // completion_report: props.completionReport,
          // expost_report: props.expostReport,
        }}
        resource={entityType}
        formData={props.data}
        entityId={
          entityType === "project_detail"
            ? props.details && props.details.id
            : props.record && props.record.id
        }
        fileSelected={fileSelected}
        approvedUploading={approvedUploading}
        placeholder={translate("titles.drop_files")}
        onFileUpload={handleFileUpload}
        onFileSelect={handleSelectFile}
        onFileDelete={handleFileDelete}
      />
    </Fragment>
  );
}

export default FilesUploaderSection;
