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
  usePermissions
} from "react-admin";
import { useNotify, useRedirect, useRefresh } from "react-admin";

import CustomInput from "../../components/CustomInput";
import OrganisationalStructure from "../../modules/OrganisationalStructure";
import React from "react";
import { useSelector } from "react-redux";

const OrganizationsEdit = (props) => {
  const appConfig = useSelector((state) => state.app.appConfig);
  const { permissions_config, organizational_config } = appConfig;

  const notify = useNotify();
  const refresh = useRefresh();
  const redirect = useRedirect();

  const choicesLevel = Object.keys(organizational_config).map((key) => ({
    id: key,
    name: `(${key}) ${organizational_config[key].name}`,
  }));

  const onSuccess = ({ data }) => {
    notify(`Changes to post "${data.name}" saved`);
    redirect(data.redirect);
    refresh();
  };
  const translationKey = ''; //organizational_config[props.location.state.record.level]

  return (
    <Edit onSuccess={onSuccess} {...props}>
      <SimpleForm redirect="list">
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
        /></CustomInput>
        {/* <TextInput source="parent_id" /> */}
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
            let selectedRole;
            return (
              <OrganisationalStructure
                {...props}
                {...formData}
                source="parent_id"
                config="organizational_config"
                reference="organizations"
                isRequired
                isEdit
              />
            );
          }}
        </FormDataConsumer>
      </SimpleForm>
    </Edit>
  );
};

export default OrganizationsEdit;
