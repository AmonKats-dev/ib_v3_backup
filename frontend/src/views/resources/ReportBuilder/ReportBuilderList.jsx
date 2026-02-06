import { Box, Typography } from "@material-ui/core";
import React from "react";
import {
  Datagrid,
  DeleteWithConfirmButton,
  EditButton,
  List,
  ShowButton,
  TextField,
  CreateButton,
  TopToolbar,
  BooleanField,
  BooleanInput,
  Filter,
  TextInput,
  FunctionField,
} from "react-admin";
import {
  checkFeature,
  useCheckPermissions,
} from "../../../helpers/checkPermission";

const ListActions = (props) => (
  <TopToolbar>{props.hasEditAccess && <CreateButton {...props} />}</TopToolbar>
);

const ListFilters = (props) => {
  return (
    <Filter
      {...props}
      variant="outlined"
      margin="none"
      style={{ alignItems: "center", flex: "none", marginTop: 5 }}
    >
      <TextInput
        label="Report Name"
        source="name"
        alwaysOn
        variant="outlined"
        margin="none"
      />
      {checkFeature("has_public_custom_report") && (
        <BooleanInput
          label="Is Public Report"
          source="is_public"
          alwaysOn
          variant="outlined"
          margin="none"
        />
      )}
    </Filter>
  );
};

const Empty = (props) => {
  const { loading, loaded, total } = props;
  const checkPermission = useCheckPermissions();

  if (total === 0 && !loading && loaded) {
    return (
      <Box textAlign="center" m={1}>
        <Typography variant="h4" paragraph>
          There are no custom reports in the system
          <br />
          <br />
          {checkPermission("create_custom_report") && (
            <CreateButton basePath="/custom-reports" />
          )}
        </Typography>
      </Box>
    );
  }

  return <div></div>;
};

const ReportBuilderList = ({ translate, ...props }) => {
  const checkPermission = useCheckPermissions();
  const rowClickEvent = checkPermission("edit_custom_report")
    ? "edit"
    : checkPermission("view_custom_report")
    ? "show"
    : false;

  return (
    <List
      {...props}
      empty={<Empty {...props} />}
      bulkActionButtons={false}
      actions={
        <ListActions
          {...props}
          hasEditAccess={checkPermission("create_custom_report")}
        />
      }
      filters={<ListFilters {...props} />}
    >
      <Datagrid rowClick={rowClickEvent}>
        <TextField source="name" />
        {checkFeature("has_public_custom_report") && <BooleanField source="is_public" />}
        {checkPermission("view_custom_report") && <ShowButton />}
        <FunctionField
          render={(record) => {
            if (record) {
              if (record.is_public) {
                return (
                  checkPermission("save_public_custom_report") &&
                  checkPermission("edit_custom_report") && (
                    <EditButton basePath="custom-reports" record={record} />
                  )
                );
              }

              return (
                checkPermission("edit_custom_report") && (
                  <EditButton basePath="custom-reports" record={record} />
                )
              );
            }
          }}
        />
        <FunctionField
          render={(record) => {
            if (record) {
              if (record.is_public) {
                return (
                  checkPermission("save_public_custom_report") &&
                  checkPermission("delete_custom_report") && (
                    <DeleteWithConfirmButton
                      basePath="custom-reports"
                      record={record}
                    />
                  )
                );
              }

              return (
                checkPermission("delete_custom_report") && (
                  <DeleteWithConfirmButton
                    basePath="custom-reports"
                    record={record}
                  />
                )
              );
            }
          }}
        />
      </Datagrid>
    </List>
  );
};

export default ReportBuilderList;
