import lodash from "lodash";
import React, { Fragment, useEffect } from "react";
import {
  AutocompleteArrayInput,
  BooleanInput,
  CheckboxGroupInput,
  ReferenceArrayInput,
  ReferenceInput,
  required,
  SelectInput,
  useTranslate,
} from "react-admin";
import CustomInput from "../../components/CustomInput";

import { checkFeature, useChangeField } from "../../../helpers/checkPermission";

const UserRolesForm = ({
  roles,
  sourceOrg,
  getSource,
  selectedRole,
  scopedFormData,
  userOrganization,
  userOrganizationLevel,
  ...props
}) => {
  const changeOrgs = useChangeField({ name: sourceOrg });
  const translate = useTranslate();

  useEffect(() => {
    if (checkFeature("has_pimis_fields")) changeOrgs([userOrganization]);
  }, [userOrganization]);

  const handleChange = (scopedFormData) => (checked) => {
    if (scopedFormData) {
      scopedFormData.additional_data = {
        allow_all_organizations: checked,
      };

      if (checked) {
        changeOrgs(["all"]);
      } else {
        checkFeature("has_pimis_fields")
          ? changeOrgs([userOrganization])
          : changeOrgs([]);
      }
    }
  };

  return (
    <Fragment>
      <CustomInput
        tooltipText="tooltips.resources.users.fields.role_id"
        fullWidth
      >
        <ReferenceInput
          label={translate("resources.users.fields.role_id")}
          source={getSource("role_id")}
          reference="roles"
        >
          <SelectInput
            optionText="name"
            margin="none"
            optionValue="id"
            variant="outlined"
          />
        </ReferenceInput>
      </CustomInput>

      {selectedRole &&
        (selectedRole.organization_level || userOrganizationLevel) && (
          <>
            <BooleanInput
              label="Allow all Organizations"
              source={getSource("additional_data.allow_all_organizations")}
              onChange={handleChange(scopedFormData)}
            />
            <CustomInput
              tooltipText="tooltips.resources.users.fields.allowed_organization_ids"
              fullWidth
              style={
                scopedFormData &&
                scopedFormData.additional_data &&
                scopedFormData.additional_data.allow_all_organizations
                  ? { display: "none" }
                  : {}
              }
            >
              <ReferenceArrayInput
                label={translate(
                  "resources.users.fields.allowed_organization_ids"
                )}
                perPage={-1}
                filter={{
                  level: checkFeature("has_roles_organization_level")
                    ? selectedRole.organization_level
                    : userOrganizationLevel,
                  is_hidden: false,
                }}
                reference="organizations"
                source={getSource("allowed_organization_ids")}
                validate={[required()]}
              >
                <AutocompleteArrayInput
                  margin="none"
                  variant="outlined"
                  fullWidth
                  suggestionLimit={0}
                />
              </ReferenceArrayInput>
            </CustomInput>
          </>
        )}
      {selectedRole && selectedRole.has_allowed_projects && (
        <>
          <CheckboxGroupInput
            label={false}
            source={getSource("filter_projects")}
            choices={[{ id: "filtered", name: "Show filtered projects" }]}
          />
          <CustomInput
            tooltipText="tooltips.resources.users.fields.allowed_project_ids"
            fullWidth
          >
            <ReferenceArrayInput
              perPage={-1}
              label={translate("resources.users.fields.allowed_project_ids")}
              reference="projects"
              source={getSource("allowed_project_ids")}
              filter={
                scopedFormData &&
                !lodash.isEmpty(scopedFormData.filter_projects)
                  ? {
                      organization_ids: scopedFormData.allowed_organization_ids,
                    }
                  : null
              }
            >
              <AutocompleteArrayInput
                margin="none"
                variant="outlined"
                fullWidth
              />
            </ReferenceArrayInput>
          </CustomInput>
        </>
      )}
    </Fragment>
  );
};

export default UserRolesForm;
