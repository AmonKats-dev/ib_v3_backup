import React, { Fragment, useEffect, useState } from "react";
import {
  BooleanInput,
  required,
  TextInput,
  NumberInput,
  SelectInput,
  number,
  minValue,
  useTranslate,
  useNotify,
} from "react-admin";
import CustomInput from "../../../../components/CustomInput";
import lodash from "lodash";
import { useFormState } from "react-final-form";

import { useChangeField } from "../../../../../helpers/checkPermission";
import InFormFileUploader from "../../../../components/InFormFileUploader";

function CommercialSection({ getSource, scopedFormData, record, ...props }) {
  const translate = useTranslate();
  const notify = useNotify();
  const changeIsCommercial = useChangeField({
    name: getSource("is_commercial"),
  });
  const { values } = useFormState();

  useEffect(() => {
    if (scopedFormData && typeof scopedFormData.is_commercial !== "undefined") {
      changeIsCommercial(hasCommercialFile(scopedFormData) ? true : false);
    }
  }, []);

  useEffect(() => {
    if (scopedFormData && !lodash.isEmpty(scopedFormData.files)) {
      changeIsCommercial(hasCommercialFile(scopedFormData));
    }
  }, [scopedFormData]);

  const hasCommercialFile = (formData) => {
    return (
      formData &&
      lodash.find(
        formData.files,
        (file) =>
          file.meta && file.meta.relatedField === "is_commercial_attachment"
      )
    );
  };

  const handleChange = (checked) => {
    if (!scopedFormData) {
      notify("Please fill in option title!", "warning");
      changeIsCommercial(false);
    } else {
      if (scopedFormData && scopedFormData.id) {
        changeIsCommercial(checked);
        scopedFormData.is_commercial = checked;
      }

      if (checked) {
        if (scopedFormData && !scopedFormData.id) {
          if (scopedFormData.name) {
            props.onSave(values, false);
          } else {
            notify("Please fill in option title!", "warning");
            scopedFormData.is_commercial = false;
            changeIsCommercial(false);
          }
        }
      }
    }
  };

  return (
    <>
      <CustomInput
        fullWidth
        tooltipText={"tooltips.resources.project_options.fields.is_commercial"}
      >
        <BooleanInput
          label={translate("resources.project_options.fields.is_commercial")}
          source={getSource("is_commercial") || false}
          onChange={handleChange}
          variant="outlined"
          margin="none"
        />
      </CustomInput>
      {scopedFormData && scopedFormData.is_commercial && scopedFormData.id ? (
        <InFormFileUploader
          meta={{ relatedField: `is_commercial_attachment` }}
          resource="project_option"
          entityId={scopedFormData.id}
          fileTypeId={0}
          placeholder={translate("titles.drop_files")}
          record={scopedFormData}
          approvedUploading
          onDelete={() => {}}
          onBeforeUpload={props.onSave}
        />
      ) : null}
    </>
  );
}

export default CommercialSection;
