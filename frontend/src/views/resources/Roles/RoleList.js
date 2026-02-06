import React from "react";
import {
  List,
  SimpleList,
  Datagrid,
  TextField,
  usePermissions,
  BooleanField,
  ArrayField,
  SingleFieldList,
  ChipField,
  FunctionField,
  CloneButton,
  DeleteWithConfirmButton,
} from "react-admin";
import { useMediaQuery } from "@material-ui/core";
import { checkFeature } from "../../../helpers/checkPermission";

const RoleList = (props) => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("xs"));

  return (
    <List {...props} bulkActionButtons={false}>
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.name}
          secondaryText={(record) =>
            checkFeature("has_roles_organization_level")
              ? `Organization level: ${record.organization_level}`
              : null
          }
        />
      ) : (
        <Datagrid rowClick="edit">
          <TextField source="id" />
          <TextField source="name" />
          {checkFeature("has_roles_organization_level") && (
            <TextField source="organization_level" />
          )}
          <CloneButton />
        </Datagrid>
      )}
    </List>
  );
};

export default RoleList;
