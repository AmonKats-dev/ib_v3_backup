import React, { useMemo } from "react";
import {
  ReferenceArrayInput,
  SelectInput,
  BooleanInput,
  SelectArrayInput,
  Edit,
  FormDataConsumer,
  SimpleForm,
  TextInput,
} from "react-admin";
import { useSelector } from "react-redux";
import { DEFAULT_SORTING } from "../../../constants/common";
import { checkFeature } from "../../../helpers/checkPermission";
import CustomInput from "../../components/CustomInput";
import CustomToolbar from "../../components/CustomToolbar";
import PermissionConfig from "./PermissionConfig";
import ug_permissions_map from "./ug_permissions_map.json";
import jm_permissions_map from "./permissions_map.json";

const RoleEdit = (props) => {
  const appConfig = useSelector((state) => state.app.appConfig);
  const { application_config, organizational_config } = appConfig;

  const choicesLevel = Object.keys(organizational_config).map((key) => ({
    id: key,
    name: `(${key}) ${organizational_config[key].name}`,
  }));

  const permissionsMap = application_config?.prefix === 'ug' ? ug_permissions_map : jm_permissions_map

  return (
    <Edit {...props} style={{ width: "80vw" }} actions={false}>
      <SimpleForm redirect="show" toolbar={<CustomToolbar />}>
        <CustomInput tooltipText="tooltip" fullWidth>
          <TextInput source="name" variant="outlined" margin="none" />
        </CustomInput>
        <CustomInput
          tooltipText={"tooltips.resources.roles.fields.organization_level"}
          fullWidth
        >
          <FormDataConsumer>
            {({ formData, scopedFormData, getSource, ...rest }) => {
              return (
                <PermissionConfig
                  permissionsConfig={permissionsMap}
                  source="permissions"
                  record={formData.permissions}
                  {...props}
                />
              );
            }}
          </FormDataConsumer>
        </CustomInput>
        {checkFeature("has_roles_organization_level") && (
          <CustomInput tooltipText="tooltip" fullWidth>
            <SelectInput
              source="organization_level"
              choices={choicesLevel}
              variant="outlined"
              margin="none"
            />
          </CustomInput>
        )}

        <CustomInput tooltipText="tooltip" bool>
          <BooleanInput
            source="has_allowed_projects"
            variant="outlined"
            margin="none"
          />
        </CustomInput>
        <CustomInput
          tooltipText={"tooltips.resources.roles.fields.phase_ids"}
          fullWidth
        >
          <ReferenceArrayInput
            label={"resources.file-types.fields.phase_ids"}
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
      </SimpleForm>
    </Edit>
  );
};

export default RoleEdit;
