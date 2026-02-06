import React, { useState } from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  ReferenceArrayInput,
  SelectArrayInput,
  BooleanInput,
  SelectInput,
} from "react-admin";

import { useSelector } from "react-redux";
import CustomInput from "../../components/CustomInput";
import PermissionConfig from "./PermissionConfig";
import { DEFAULT_SORTING } from "../../../constants/common";
import CustomToolbar from "../../components/CustomToolbar";
import { parseUrl } from "query-string";
import { checkFeature } from "../../../helpers/checkPermission";

import ug_permissions_map from "./ug_permissions_map.json";
import jm_permissions_map from "./permissions_map.json";

const RoleCreate = (props) => {
  const locationStore = useSelector((state) => state.router.location.search);
  const appConfig = useSelector((state) => state.app.appConfig);
  const { application_config, organizational_config } = appConfig;

  const inputParams =
    locationStore &&
    parseUrl(locationStore) &&
    parseUrl(locationStore).query &&
    parseUrl(locationStore).query.source &&
    JSON.parse(parseUrl(locationStore).query.source);

  const choicesLevel = Object.keys(organizational_config).map((key) => ({
    id: key,
    name: `(${key}) ${organizational_config[key].name}`,
  }));

  console.log(appConfig);
  const permissionsMap = application_config.prefix === 'ug' ? ug_permissions_map : jm_permissions_map

  return (
    <Create {...props} style={{ width: "80vw" }}>
      <SimpleForm redirect="show" toolbar={<CustomToolbar />}>
        <CustomInput
          tooltipText={"tooltips.resources.roles.fields.name"}
          fullWidth
        >
          <TextInput source="name" variant="outlined" margin="none" />
        </CustomInput>
        <CustomInput
          tooltipText={"tooltips.resources.roles.fields.organization_level"}
          fullWidth
        >
          <PermissionConfig
            permissionsConfig={permissionsMap}
            source="permissions"
            record={inputParams && inputParams.permissions}
            {...props}
          />
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

        <CustomInput
          tooltipText={"tooltips.resources.roles.fields.has_allowed_projects"}
          bool
        >
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
    </Create>
  );
};

export default RoleCreate;
