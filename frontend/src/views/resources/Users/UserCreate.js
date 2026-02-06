import React, { Fragment, useEffect, useState } from "react";
import {
  Create,
  SimpleForm,
  PasswordInput,
  ReferenceArrayInput,
  TextInput,
  TabbedForm,
  AutocompleteArrayInput,
  SelectArrayInput,
  useDataProvider,
  maxLength,
  number,
  FormTab,
  FormDataConsumer,
  AutocompleteInput,
  ArrayInput,
  SimpleFormIterator,
  email,
  ReferenceInput,
  minLength,
  SelectInput,
  required,
  useTranslate,
  regex,
  BooleanInput,
  Toolbar,
  SaveButton,
  Button,
  ListButton,
} from "react-admin";
import lodash from "lodash";
import Tabs from "../../components/Tabs";

import { useSelector } from "react-redux";
import { useFormState } from "react-final-form";

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { useInput } from "react-admin";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import CustomInput from "../../components/CustomInput";
import OrganisationalStructure from "../../modules/OrganisationalStructure";
import useOrganizationalConfig from "../../../hooks/useOrganizationalConfig";
import {
  validatePassword,
  arrayLength,
  validateUsername,
  validateUserCreation,
} from "./helpers";
import { Link } from "@material-ui/core";
import { ChevronLeft, CloseOutlined } from "@material-ui/icons";
import {
  checkFeature,
  useCheckPermissions,
} from "../../../helpers/checkPermission";
import CustomToolbar from "../../components/CustomToolbar";
import UserRolesForm from "./UserRolesForm";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  tabContainer: {
    display: "flex",
    flexDirection: "column",
  },
  form: {
    "& .MuiCardContent-root": {
      padding: 0,
    },
  },
}));

// const UserToolbar = (props) => {
//   return (
//     <Toolbar>
//       <ListButton
//         basePath={props.basePath}
//         label="Cancel"
//         icon={<CloseOutlined />}
//         color="primary"
//         variant="contained"
//         style={{ marginRight: 5, padding: "7px 15px" }}
//       />
//       <SaveButton {...props} />
//     </Toolbar>
//   );
// };

function formatPhoneNumber(value) {
  if (value) {
    const formValue = value.replace("(", "").replace(")", "");
    const phoneCode = formValue.slice(0, 3);
    const phoneNumber = formValue.slice(3, formValue.length + 2);
    return `(${phoneCode})${phoneNumber}`;
  }
  return value;
}

const UserCreate = (props) => {
  const [roles, setRoles] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const dataProvider = useDataProvider();
  const classes = useStyles();
  const translate = useTranslate();
  const checkPermission = useCheckPermissions();

  useEffect(() => {
    dataProvider
      .getList("roles", {
        pagination: { page: 1, perPage: 99 },
        sort: { field: "id", order: "asc" },
        filter: {},
      })
      .then((result) => {
        setRoles(result.data);
      });

    checkFeature("has_pimis_fields") &&
      dataProvider.getListOfAll("organizations", {}).then((result) => {
        setOrganizations(result.data);
      });
  }, []);

  const getOrganization = (id) => {
    const selected = lodash.find(organizations, (it) => it.id === id);

    return selected ? selected.level : null;
  };


  const disablePermissions = (status) => {
    setDisabled(status);
  };

  return (
    <Create {...props} redirect="show" toolbar={false}>
      <TabbedForm
        redirect="show"
        validate={validateUserCreation}
        toolbar={<CustomToolbar />}
      >
        <FormTab label="summary">
          <CustomInput
            tooltipText="tooltips.resources.users.fields.username"
            fullWidth
          >
            <TextInput
              source="username"
              variant="outlined"
              margin="none"
              validate={validateUsername}
            />
          </CustomInput>
          <CustomInput
            tooltipText="tooltips.resources.roles.fields.full_name"
            fullWidth
          >
            <TextInput
              source="full_name"
              variant="outlined"
              margin="none"
              validate={[required()]}
            />
          </CustomInput>
          <CustomInput
            tooltipText="tooltips.resources.roles.fields.email"
            fullWidth
          >
            <TextInput
              source="email"
              variant="outlined"
              margin="none"
              validate={[email(), required()]}
            />
          </CustomInput>
          <CustomInput
            tooltipText="tooltips.resources.roles.fields.phone"
            fullWidth
          >
            <TextInput
              source="phone"
              variant="outlined"
              margin="none"
              label={translate("resources.users.fields.phone")}
              validate={[maxLength(11), minLength(10), number()]}
              format={formatPhoneNumber}
              parse={(value) => value.replace(/\D/g, "")}
            />
          </CustomInput>
          <OrganisationalStructure
            {...props}
            source="organization_id"
            config="organizational_config"
            reference="organizations"
            field="organization"
            labels={{
              1: "Level 1 Organization",
              2: "Level 2 Organization",
              3: "Level 3 Organization",
            }}
            tooltips={{
              1: "Level 1 includes Ministries",
              2: "Level 2 includes Ministries Departments",
              3: "Level 3 includes Public bodies",
            }}
          />

          {checkFeature("has_supervisor_manager") && (
            <CustomInput
              tooltipText="tooltips.resources.users.fields.user_roles.organization_level"
              fullWidth
            >
              <ReferenceInput
                perPage={-1}
                reference="users"
                source={"supervisor_id"}
                filterToQuery={(searchText) => ({ full_name: searchText })}
              >
                <AutocompleteInput
                  margin="none"
                  variant="outlined"
                  fullWidth
                  suggestionLimit={5}
                  optionText="full_name"
                />
              </ReferenceInput>
            </CustomInput>
          )}
          <FormDataConsumer>
            {({ formData, scopedFormData, getSource, ...rest }) => {
              if (typeof formData.is_donor === "undefined") {
                if (formData.fund_id) {
                  formData.is_donor = true;
                }
              } else {
                if (!formData.is_donor && formData.fund_id) {
                  formData.fund_id = null;
                }
              }

              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    width: "500px",
                    marginTop: 15,
                  }}
                >
                  <BooleanInput
                    label={translate("resources.users.fields.is_donor")}
                    source="is_donor"
                  />
                  {formData.is_donor ? (
                    checkFeature("has_pimis_fields") ? (
                      <TextInput
                        source="external_organization"
                        label="External Organization"
                        variant="outlined"
                        margin="none"
                        validate={[email(), required()]}
                        fullWidth
                      />
                    ) : (
                      <OrganisationalStructure
                        {...props}
                        source="fund_id"
                        config="fund_config"
                        reference="funds"
                        field="fund"
                        filter={{ is_donor: true }}
                      />
                    )
                  ) : null}
                </div>
              );
            }}
          </FormDataConsumer>
        </FormTab>
        {checkPermission("edit_permissions") && (
          <FormTab label="permissions" disabled={disabled}>
            <ArrayInput source="user_roles" label={false}>
              <SimpleFormIterator>
                <FormDataConsumer>
                  {({ formData, scopedFormData, getSource, ...rest }) => {
                    let selectedRole;
                    if (scopedFormData && scopedFormData.role_id && roles) {
                      selectedRole = lodash.find(
                        roles,
                        (item) => item.id === scopedFormData.role_id
                      );

                      if (selectedRole && !selectedRole.organization_level) {
                        scopedFormData.allowed_organization_ids = [
                          formData.organization_id,
                        ];
                      }
                    }

                    return (
                      <UserRolesForm
                        sourceOrg={getSource("allowed_organization_ids")}
                        roles={roles}
                        scopedFormData={scopedFormData}
                        selectedRole={selectedRole}
                        getSource={getSource}
                        userOrganization={formData?.organization_id}
                        userOrganizationLevel={
                          formData?.organization_id &&
                          getOrganization(formData?.organization_id)
                        }
                      />
                    );
                  }}
                </FormDataConsumer>
              </SimpleFormIterator>
            </ArrayInput>
          </FormTab>
        )}
      </TabbedForm>
    </Create>
  );
};

export default UserCreate;
