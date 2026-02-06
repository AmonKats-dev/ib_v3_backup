import { FormDataConsumer, usePermissions } from "react-admin";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslate } from "react-admin";

import lodash from "lodash";
import FileUploader from "../../../../components/FileUploader";
import { Typography } from "@material-ui/core";

import Button from "@material-ui/core/Button";
import { DeleteOutline } from "@material-ui/icons";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

function MEAttachmentsForm(props) {
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const translate = useTranslate();

  useEffect(() => {
    if (props.record && props.record.files) {
      setAdditionalFiles(props.record.files);
    }
  }, [props.record]);

  function handleAddAttachment() {
    setAdditionalFiles([...additionalFiles, {}]);
  }

  const handleDeleteAttachments = (type) => (id) => {
    setAdditionalFiles(additionalFiles.filter((item, idx) => idx !== type));
  };

  function renderAdditionalAttachments(formData) {
    return additionalFiles.map((item, idx) => (
      <div style={{ display: "flex", alignItems: "center" }}>
        <FileUploader
          meta={{ relatedField: `me_attachment_${idx}` }}
          resource="me-report"
          entityId={props.record.id}
          fileTypeId={0}
          placeholder={translate("titles.drop_files")}
          record={formData}
          approvedUploading
          onDelete={item ? handleDeleteAttachments() : () => {}}
        />
        {lodash.isEmpty(item) && (
          <Button
            variant="contained"
            component="span"
            onClick={handleDeleteAttachments(idx)}
            startIcon={<DeleteOutline />}
            style={{ marginLeft: 15 }}
          >
            {translate("resources.project-details.fields.attachments.remove")}
          </Button>
        )}
      </div>
    ));
  }

  function renderAdditionalFilesSection(formData) {
    return (
      <>
        <Button
          onClick={handleAddAttachment}
          variant="contained"
          startIcon={<CloudUploadIcon />}
        >
          {translate("resources.project-details.fields.attachments.add")}
        </Button>
        <br />
        {additionalFiles.length ? renderAdditionalAttachments(formData) : null}
      </>
    );
  }

  return (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, ...rest }) => {
        return (
          <Fragment>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                flexDirection: "column",
              }}
            >
              <Typography variant="h5" style={{ marginRight: "25px" }}>
                Physical progress evidence
              </Typography>
              <br />
              {renderAdditionalFilesSection(formData)}
            </div>
          </Fragment>
        );
      }}
    </FormDataConsumer>
  );
}

export default MEAttachmentsForm;
