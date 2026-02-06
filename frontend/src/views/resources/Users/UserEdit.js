import React, { Fragment, useEffect, useState } from "react";
import {
  Edit,
  SimpleForm,
  Confirm,
  PasswordInput,
  ReferenceArrayInput,
  TextInput,
  TabbedForm,
  useTranslate,
  AutocompleteArrayInput,
  SelectArrayInput,
  maxLength,
  useDataProvider,
  FormTab,
  FormDataConsumer,
  ArrayInput,
  SimpleFormIterator,
  ReferenceInput,
  minLength,
  SelectInput,
  required,
  number,
  email,
  useQueryWithStore,
  AutocompleteInput,
  BooleanInput,
  TopToolbar,
  ShowButton,
  useNotify,
  translate,
} from "react-admin";
import lodash from "lodash";
import Tabs from "../../components/Tabs";
import { makeStyles } from "@material-ui/core/styles";
import CustomInput from "../../components/CustomInput";
import OrganisationalStructure from "../../modules/OrganisationalStructure";
import {
  validatePassword,
  arrayLength,
  validateUsername,
  validateUserCreation,
} from "./helpers";
import { Button } from "@material-ui/core";
import Refresh from "@material-ui/icons/Refresh";
import {
  checkFeature,
  useChangeField,
  useCheckPermissions,
} from "../../../helpers/checkPermission";
import { DONORS_FUNDS_IDS } from "../../../constants/common";
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

function formatPhoneNumber(value) {
  if (value) {
    const formValue = value.replace("(", "").replace(")", "");
    const phoneCode = formValue.slice(0, 3);
    const phoneNumber = formValue.slice(3, formValue.length + 2);
    return `(${phoneCode})${phoneNumber}`;
  }
  return value;
}

const UsersActions = (props) => {
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const checkPermission = useCheckPermissions();
  const showNotification = useNotify();

  function handleConfirm(values) {
    setIsOpenConfirm(false);
    dataProvider
      .reset("users", { id: props.id })
      .then((result) => {
        showNotification("Password changed!");
      })
      .catch((result) => {
        showNotification(
          "Password wasn`t changed! " + result.body.error_message,
          "error"
        );
      });
  }

  function handleOpenConfirmation() {
    setIsOpenConfirm(true);
    //TODO add password reset func
  }

  function handleCloseConfirmation() {
    setIsOpenConfirm(false);
  }

  return (
    <TopToolbar>
      {checkPermission("reset_user_password") &&
        checkFeature("has_user_reset_password_button") && (
          <>
            <Confirm
              isOpen={isOpenConfirm}
              title={translate("messages.reset_password")}
              content={translate("messages.reset_password_confirmation")}
              onConfirm={handleConfirm}
              onClose={handleCloseConfirmation}
              confirm={translate("buttons.confirm")}
              cancel={translate("buttons.cancel")}
            />
            <Button
              variant={"outlinedPrimary"}
              onClick={handleOpenConfirmation}
              style={{ margin: "0px 10px" }}
            >
              <Refresh />
              {translate("buttons.reset_password")}
            </Button>
          </>
        )}
      <ShowButton {...props} record={props} />
    </TopToolbar>
  );
};

const UserEdit = (props) => {
  const [organizations, setOrganizations] = useState([]);
  const [roles, setRoles] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const dataProvider = useDataProvider();
  const checkPermission = useCheckPermissions();
  const translate = useTranslate();

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
    <Edit
      {...props}
      redirect="show"
      actions={<UsersActions {...props} />}
      undoable={false}
    >
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
              label={translate("resources.users.fields.phone")}
              variant="outlined"
              margin="none"
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
            disablePermissions={disablePermissions}
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
    </Edit>
  );
};

export default UserEdit;
