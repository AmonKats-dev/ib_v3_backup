import { Box, Button, Typography } from "@material-ui/core";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import moment from "moment";
import React from "react";
import {
  CreateButton,
  Datagrid,
  EditButton,
  Filter,
  List,
  ShowButton,
  TextField,
  TextInput,
  TopToolbar,
  useCreate,
  useDataProvider,
  useNotify,
  useRedirect,
} from "react-admin";
import { useHistory } from "react-router-dom";
import { useCheckPermissions } from "../../../helpers/checkPermission";
import { getFiscalYearValueFromYear } from "../../../helpers/formatters";

const ListActions = ({ onCreate, onGoBack, ...props }) => {
  return (
    <TopToolbar
      style={{
        justifyContent: "space-between",
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Button
        onClick={onGoBack}
        label="Back"
        color="primary"
        startIcon={<ArrowBackIcon />}
      >
        Back
      </Button>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddOutlinedIcon />}
        onClick={onCreate}
      >
        Create
      </Button>
    </TopToolbar>
  );
};

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

const MycList = ({ translate, ...props }) => {
  const redirectTo = useRedirect();

  return (
    <>
      <List
        {...props}
        empty={<Empty {...props} />}
        bulkActionButtons={false}
        actions={
          <ListActions
            {...props}
            onCreate={() => {
              redirectTo(
                `/${props.resource}/${Number(props.match?.params?.id)}/create`
              );
            }}
            onGoBack={() => {
              redirectTo(
                `/implementation-module/${Number(
                  props.match?.params?.id
                )}/costed-annualized-plan`
              );
            }}
          />
        }
        // filters={<ListFilters {...props} />}
        filter={{ project_detail_id: props.match?.params?.id }}
      >
        <Datagrid rowClick={false}>
          <TextField source="reporting_date" />
          <TextField source="reporting_quarter" />
          <TextField source="name" />
          <TextField source="position" />
          <TextField source="interest_level" />
          <TextField source="position" />

          <ShowButton {...props} />
          <EditButton {...props} />
          {/* <DeleteWithConfirmButton {...props} /> */}
        </Datagrid>
      </List>
    </>
  );
};

export default MycList;
