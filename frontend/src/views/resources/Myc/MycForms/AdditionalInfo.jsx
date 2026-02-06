import { Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { FormDataConsumer, useRefresh, useTranslate } from "react-admin";
import { getFiscalYearsRangeForIntervals } from "../../../../helpers/formatters";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { DeleteOutline, AttachFileIcon } from "@material-ui/icons";

import CustomInput from "../../../components/CustomInput";
import CustomTextArea from "../../../components/CustomTextArea";
import FileUploader from "../../../components/FileUploader";
import { useFormState } from "react-final-form";
import { isEmpty } from "lodash";

const AdditionalInfo = ({ activities, project, arraySource, ...props }) => {
  const translate = useTranslate();
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const formValues = useFormState().values;
  const refresh = useRefresh();

  useEffect(() => {
    if (props.record && props.record.files) {
      const additionalFiles = props.record.files.filter((item) => {
        const meta =
          item.meta && typeof item.meta === "string"
            ? JSON.parse(item.meta)
            : item.meta;
        return (
          meta &&
          meta.relatedField &&
          meta.relatedField.indexOf("attachments") > -1
        );
      });

      setAdditionalFiles(additionalFiles);
    }
  }, [props.record]);

  function handleAddAttachment() {
    setAdditionalFiles([...additionalFiles, {}]);
  }

  const handleDeleteAttachments = (index) => {
    setAdditionalFiles(additionalFiles.filter((item, idx) => idx !== index));
  };

  function renderAdditionalAttachments(formData) {
    return additionalFiles.map((item, idx) => (
      <div
        style={{ display: "flex", alignItems: "center" }}
        key={item.id || new Date() + "idx"}
      >
        <FileUploader
          meta={{ relatedField: `myc_attachments_${idx}` }}
          resource="project"
          entityId={formData.id}
          fileTypeId={0}
          placeholder={translate("titles.drop_files")}
          record={formData}
          approvedUploading
          onDelete={() => {}}
          onFileUpload={() => {
            props.save(formData, false);
            refresh();
          }}
        />
        {isEmpty(item) && (
          <Button
            variant="contained"
            component="span"
            onClick={() => handleDeleteAttachments(idx)}
            startIcon={<DeleteOutline />}
            style={{ marginLeft: 15 }}
          >
            {translate("resources.project-details.fields.attachments.remove")}
          </Button>
        )}
      </div>
    ));
  }

  return (
    <>
      <FormDataConsumer>
        {({ formData, scopedFormData, getSource, ...rest }) => {
          const targetYears =
            formData &&
            formData.start_date &&
            formData.end_date &&
            getFiscalYearsRangeForIntervals(
              formData.start_date,
              formData.end_date
            );

          return (
            <div style={{ overflow: "auto", width: "100%" }}>
              <CustomInput
                tooltipText={
                  "tooltips.resources.project-details.fields.other_info"
                }
                textArea
              >
                <CustomTextArea
                  label={"Additional information"}
                  source="myc_data.other_info"
                  formData={formData}
                  {...props}
                />
              </CustomInput>
            </div>
          );
        }}
      </FormDataConsumer>
      <div>
        <Button
          onClick={handleAddAttachment}
          variant="contained"
          startIcon={<CloudUploadIcon />}
        >
          {translate("resources.project-details.fields.attachments.add")}
        </Button>
        <br />
        <br />
        {additionalFiles.length > 0
          ? renderAdditionalAttachments(formValues)
          : null}
      </div>
    </>
  );
};

export default AdditionalInfo;
