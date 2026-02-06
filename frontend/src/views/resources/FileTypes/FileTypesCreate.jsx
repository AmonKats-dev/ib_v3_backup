import React, { useEffect, useState } from "react";
import {
  Create,
  BooleanInput,
  required,
  SimpleForm,
  TextInput,
  ReferenceArrayInput,
  SelectArrayInput,
  useTranslate,
  useDataProvider,
} from "react-admin";
import CustomInput from "../../components/CustomInput";
import {
  DEFAULT_SORTING,
  DEFAULT_MEDIA_EXTENSIONS,
} from "../../../constants/common";
import CustomToolbar from "../../components/CustomToolbar";
import lodash from "lodash";

const FileTypesCreate = (props) => {
  const [extensions, setExtensions] = useState(DEFAULT_MEDIA_EXTENSIONS);
  const translate = useTranslate();
  const dataProvider = useDataProvider();

  useEffect(() => {
    dataProvider
      .getListOfAll("parameters", { sort_field: "id" })
      .then((response) => {
        if (response && response.data) {
          const mediaExtensions = lodash.find(
            response.data,
            (it) => it.param_key === "media_extensions"
          );
          if (mediaExtensions && mediaExtensions.param_value) {
            setExtensions(
              mediaExtensions.param_value.map((item) => ({
                id: item,
                name: item,
              }))
            );
          }
        }
      });
  }, []);

  return (
    <Create {...props}>
      <SimpleForm redirect="list" toolbar={<CustomToolbar />}>
        <CustomInput
          fullWidth
          tooltipText={"tooltips.resources.file-types.fields.name"}
        >
          <TextInput
            source="name"
            validate={required()}
            variant="outlined"
            margin="none"
          />
        </CustomInput>
        <CustomInput
          bool
          tooltipText={"tooltips.resources.file-types.fields.is_required"}
        >
          <BooleanInput source="is_required" />
        </CustomInput>
        <CustomInput
          fullWidth
          tooltipText={"tooltips.resources.file-types.fields.phase_ids"}
        >
          <ReferenceArrayInput
            label={translate("resources.file-types.fields.phase_ids")}
            source="phase_ids"
            sort={DEFAULT_SORTING}
            reference="phases"
            linkType="show"
          >
            <SelectArrayInput
              variant="outlined"
              margin="none"
              optionText="name"
              options={{ fullWidth: "true" }}
            />
          </ReferenceArrayInput>
        </CustomInput>
        <CustomInput
          fullWidth
          tooltipText={"tooltips.resources.file-types.fields.extensions"}
        >
          <SelectArrayInput
            source="extensions"
            choices={extensions}
            options={{ fullWidth: "true" }}
            variant="outlined"
            margin="none"
          />
        </CustomInput>
      </SimpleForm>
    </Create>
  );
};

export default FileTypesCreate;
