import React, { useEffect } from "react";
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
  BooleanInput,
} from "react-admin";
import { useNotify, useRefresh, useRedirect } from "react-admin";
import { useSelector } from "react-redux";
import { useFormState } from "react-final-form";
import lodash from "lodash";
import OrganisationalStructure from "../../modules/OrganisationalStructure";
import CustomInput from "../../components/CustomInput";
import CustomToolbar from "../../components/CustomToolbar";

const validateUserCreation = (values) => {
  const errors = {};
  if (!values.parent_id) {
    errors.name = ["The parent is required"];
  }

  return errors;
};

const OrganizationsCreate = (props) => {
  const appConfig = useSelector((state) => state.app.appConfig);
  const notify = useNotify();
  const refresh = useRefresh();
  const redirect = useRedirect();

  const onSuccess = ({ data }) => {
    notify(`Record created!`);
    redirect(data.redirect);
    refresh();
  };

  if (props.location && !props.location.state) {
    redirect("/");
    return null;
  } else {
    const { level, config, field } = props.location.state.record;
    const choicesLevel = Object.keys(appConfig[config]).map((key) => ({
      id: key,
      name: `(${key}) ${appConfig[config][key].name}`,
    }));

    let isDisabled = false,
      translationKey = "";

    if (props.location && props.location.state && props.location.state.record) {
      if (level) {
        translationKey = appConfig[config][level];
        isDisabled = true;
      }
    }

    return (
      <Create onSuccess={onSuccess} {...props}>
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
                  config={config}
                  resource={props.resource}
                  reference={props.resource}
                  field={field}
                  isRequired
                />
              );
            }}
          </FormDataConsumer>
          {field === "funds" && (
          <CustomInput
            tooltipText={"tooltips.resources.roles.fields.is_donor"}
            fullWidth
          >
            <BooleanInput source="is_donor" />
          </CustomInput>
        )}
        </SimpleForm>
      </Create>
    );
  }
};

export default OrganizationsCreate;
