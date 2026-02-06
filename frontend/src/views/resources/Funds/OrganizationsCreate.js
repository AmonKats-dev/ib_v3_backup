import React from "react";
import {
  Create,
  SimpleList,
  Datagrid,
  TextField,
  SelectInput,
  usePermissions,
  SimpleForm,
  TextInput,
  required,
  FormDataConsumer,
} from "react-admin";
import { useNotify, useRefresh, useRedirect } from "react-admin";
import { useSelector } from "react-redux";
import { useFormState } from "react-final-form";
import lodash from "lodash";
import OrganisationalStructure from "../../modules/OrganisationalStructure";
import CustomInput from "../../components/CustomInput";

const validateUserCreation = (values) => {
  const errors = {};
  if (!values.parent_id) {
    errors.name = ["The parent is required"];
  }

  return errors;
};

const OrganizationsCreate = (props) => {
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

  let isDisabled = false,
    translationKey = "";

  if (props.location && props.location.state && props.location.state.record) {
    const { level } = props.location.state.record;

    if (level) {
      translationKey = organizational_config[level];
      isDisabled = true;
    }
  }

  return (
    <Create onSuccess={onSuccess} {...props}>
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
            validate={[required()]}
            disabled={isDisabled}
          />
        </CustomInput>
        <FormDataConsumer>
          {({ formData, scopedFormData, getSource, ...rest }) => {
            return (
              <OrganisationalStructure
                {...props}
                {...formData}
                source="parent_id"
                config="organizational_config"
                reference="organizations"
                field="organization"
                isRequired
              />
            );
          }}
        </FormDataConsumer>
      </SimpleForm>
    </Create>
  );
};

export default OrganizationsCreate;
