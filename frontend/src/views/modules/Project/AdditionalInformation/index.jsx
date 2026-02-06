import React, { Fragment, useState } from "react";
import {
  FormDataConsumer,
  Labeled,
  useTranslate,
  useRefresh,
  BooleanInput,
  SelectInput,
} from "react-admin";
import lodash from "lodash";

import CustomInput from "../../../components/CustomInput";
import Button from "@material-ui/core/Button";
import { useEffect } from "react";
import CustomTextArea from "../../../components/CustomTextArea";
import FileUploader from "../../../components/FileUploader";
import useFileTypes from "../../../../hooks/useFileTypes";
import { DeleteOutline, AttachFileIcon } from "@material-ui/icons";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { ADDITIONAL_SOURCES, FILE_TYPES } from "../../../../constants/common";
import useCheckFeature from "../../../../hooks/useCheckFeature";
import { Typography } from "@material-ui/core";
import useAdditionalFileTypes from "../../../../hooks/useAdditionalFileTypes";
import { checkFeature } from "../../../../helpers/checkPermission";
import { render } from "@testing-library/react";

function AdditionalInfoForm(props) {
  const translate = useTranslate();
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [mandatoryFiles, setMandatoryFiles] = useState([]);
  const hasAdditionalAttachments = useCheckFeature(
    "project_additional_attachments"
  );
  const fileTypes = useFileTypes(
    props.record.phase_id,
    props.record.classification === "RETOOLING" ||
      props.record.classification === "STUDIES"
  );
  const additionalFileTypes = useAdditionalFileTypes(props.record.phase_id);
  //FEATURE: add section with additional attachemts for the project

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

      const mandatoryExtensions = fileTypes.map((item) => item.name);
      const mandatoryFiles = props.record.files.filter((item) => {
        const meta =
          item.meta && typeof item.meta === "string"
            ? JSON.parse(item.meta)
            : item.meta;
        return (
          meta.relatedField && mandatoryExtensions.includes(meta.relatedField)
        );
      });
      setAdditionalFiles(additionalFiles);
      setMandatoryFiles(mandatoryFiles);
    }
  }, [props.record, fileTypes]);

  function handleAddAttachment() {
    setAdditionalFiles([...additionalFiles, {}]);
  }

  const handleDeleteAttachments = (type) => (id) => {
    if (type === FILE_TYPES.MANDATORY) {
      setMandatoryFiles(mandatoryFiles.filter((item) => item.id !== id));
      refresh();
    } else {
      setAdditionalFiles(additionalFiles.filter((item, idx) => idx !== type));
    }
  };

  function renderAdditionalAttachments(formData) {
    return additionalFiles.map((item, idx) => (
      <div style={{ display: "flex", alignItems: "center" }}>
        <FileUploader
          meta={{ relatedField: `attachments_${idx}` }}
          resource="project_detail"
          entityId={formData.id}
          fileTypeId={0}
          placeholder={translate("titles.drop_files")}
          record={formData}
          approvedUploading
          onDelete={item ? handleDeleteAttachments() : () => {}}
          onFileUpload={() => {
            props.save(formData, false);
          }}
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
    if (hasAdditionalAttachments) {
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
          <br />
          {additionalFiles.length
            ? renderAdditionalAttachments(formData)
            : null}
        </>
      );
    }

    return null;
  }

  function renderSourceSection(formData) {
    return (
      <FormDataConsumer>
        {({ getSource, scopedFormData, formData, ...rest }) => {
          if (
            formData?.additional_data?.has_other_financing === false &&
            formData?.additional_data?.other_finance_source
          ) {
            formData.additional_data.other_finance_source = "";
          }

          return (
            <>
              <BooleanInput
                source="additional_data.has_other_financing"
                label="Is the project financed by other sources?"
              />
              {formData?.additional_data?.has_other_financing && (
                <SelectInput
                  source="additional_data.other_finance_source"
                  variant="outlined"
                  label={false}
                  choices={ADDITIONAL_SOURCES}
                />
              )}
            </>
          );
        }}
      </FormDataConsumer>
    );
  }

  return (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, ...rest }) => {
        return (
          <Fragment>
            <CustomInput
              tooltipText={
                "tooltips.resources.project-details.fields.other_info"
              }
              textArea
            >
              <CustomTextArea
                label={translate("resources.project-details.fields.other_info")}
                source="other_info"
                formData={formData}
                {...props}
              />
            </CustomInput>

            {checkFeature(
              "has_additional_funding_source_question",
              formData?.phase_id
            ) && renderSourceSection(formData)}
            <div>
              <h3>
                {translate(
                  "resources.project-details.fields.attachments.title"
                )}
              </h3>
              {fileTypes.length > 0 &&
                fileTypes.map((item) => (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="h5"
                      style={{ marginRight: "25px" }}
                    >{`${item.name} ${
                      item.is_required ? "*" : ""
                    }`}</Typography>
                    <FileUploader
                      meta={{ relatedField: item.name }}
                      approvedUploading
                      resource="project_detail"
                      entityId={props.record.id}
                      fileTypeId={item.id}
                      extensions={item.extensions}
                      placeholder={translate("titles.drop_files")}
                      record={props.record}
                      onDelete={handleDeleteAttachments(FILE_TYPES.MANDATORY)}
                      onFileUpload={() => {
                        props.save(formData, false);
                      }}
                    />
                  </div>
                ))}
              {additionalFileTypes.length > 0 &&
                additionalFileTypes.map((item) => (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="h5"
                      style={{ marginRight: "25px" }}
                    >{`${item.name} ${
                      item.is_required ? "*" : ""
                    }`}</Typography>
                    <FileUploader
                      meta={{ relatedField: item.name }}
                      approvedUploading
                      resource="project_detail"
                      entityId={props.record.id}
                      fileTypeId={item.id}
                      extensions={item.extensions}
                      placeholder={translate("titles.drop_files")}
                      record={props.record}
                      onDelete={handleDeleteAttachments(FILE_TYPES.MANDATORY)}
                      onFileUpload={() => {
                        props.save(formData, false);
                      }}
                    />
                  </div>
                ))}
            </div>
            <hr style={{ margin: "10px auto" }} />
            {renderAdditionalFilesSection(formData)}
          </Fragment>
        );
      }}
    </FormDataConsumer>
  );
}

export default AdditionalInfoForm;
