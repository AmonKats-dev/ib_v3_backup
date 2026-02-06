import {
  Datagrid,
  Edit,
  FormDataConsumer,
  SelectInput,
  SimpleForm,
  SimpleList,
  TextField,
  TextInput,
  required,
  usePermissions,
  BooleanInput,
} from "react-admin";
import { useNotify, useRedirect, useRefresh } from "react-admin";

import CustomInput from "../../components/CustomInput";
import OrganisationalStructure from "../../modules/OrganisationalStructure";
import React from "react";
import { useSelector } from "react-redux";
import CustomToolbar from "../../components/CustomToolbar";

const OrganizationsEdit = (props) => {
  const appConfig = useSelector((state) => state.app.appConfig);
  const {
    permissions_config,
    organizational_config,
    fund_config,
    cost_config,
    location_config,
    programs_config,
  } = appConfig;

  const notify = useNotify();
  const refresh = useRefresh();
  const redirect = useRedirect();

  const getConfig = () => {
    switch (props.basePath) {
      case "/funds":
        return fund_config;
      case "/costs":
        return cost_config;
      case "/locations":
        return location_config;
      case "/programs":
        return programs_config;
      default:
        return organizational_config;
    }
  };

  const choicesLevel = Object.keys(getConfig()).map((key) => ({
    id: key,
    name: `(${key}) ${getConfig()[key].name}`,
  }));

  const translationKey = ""; //getConfig()[props.location.state.record.level]

  return (
    <Edit {...props}>
      <SimpleForm redirect="show"  toolbar={<CustomToolbar />}>
        <CustomInput
          tooltipText={`tooltips.resources.${translationKey}.code`}
          fullWidth
        >
          <TextInput
            source="code"
            validate={[required()]}
            variant="outlined"
            margin="none"
          />
        </CustomInput>
        <CustomInput
          tooltipText={`tooltips.resources.${translationKey}.name`}
          fullWidth
        >
          <TextInput
            source="name"
            validate={[required()]}
            variant="outlined"
            margin="none"
          />
        </CustomInput>
        <CustomInput
          tooltipText={"tooltips.resources.roles.fields.organization_level"}
          fullWidth
        >
          <SelectInput
            source="level"
            choices={choicesLevel}
            variant="outlined"
            margin="none"
            disabled
          />
        </CustomInput>
        <FormDataConsumer>
          {({ formData, scopedFormData, getSource, ...rest }) => {
            return (
              <OrganisationalStructure
                {...props}
                {...formData}
                source="parent_id"
                config={getConfig()}
                reference={props.resource}
                isRequired
              />
            );
          }}
        </FormDataConsumer>
        {props.basePath === "/funds" && (
          <CustomInput
            tooltipText={"tooltips.resources.roles.fields.is_donor"}
            bool
          >
            <BooleanInput source="is_donor" />
          </CustomInput>
        )}
      </SimpleForm>
    </Edit>
  );
};

export default OrganizationsEdit;
