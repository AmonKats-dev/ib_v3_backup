import { Box, Button, Typography } from "@material-ui/core";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import moment from "moment";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import {
  CreateButton,
  Datagrid,
  EditButton,
  Filter,
  FunctionField,
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
import { dateFormatter } from "../../../helpers";
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

const AppealsList = ({ translate, ...props }) => {
  const [details, setDetails] = useState();
  const redirectTo = useRedirect();
  const dataProvider = useDataProvider();

  useEffect(() => {
    dataProvider
      .getOne("project-details", {
        id: Number(props.match?.params?.projectId),
      })
      .then((response) => {
        if (response && response.data) {
          setDetails(response.data);
        }
      });
  }, []);

  if (!details) return null;

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
                `/${props.resource}/${Number(
                  props.match?.params?.projectId
                )}/create`
              );
            }}
            onGoBack={() => {
              redirectTo(
                `/implementation-module/${Number(
                  props.match?.params?.projectId
                )}/costed-annualized-plan`
              );
            }}
          />
        }
        filter={{ project_id: details?.project_id }}
      >
        <Datagrid rowClick={false}>
          <FunctionField
            label={"Created on"}
            render={(record) => dateFormatter(record?.created_on)}
          />
          <FunctionField
            label={"Proposed extension date"}
            render={(record) => dateFormatter(record?.proposed_extension_date)}
          />
          <TextField source="appeal_status" />
          <FunctionField
            label=""
            render={(record) =>
              record.appeal_status === "DRAFT" ? (
                <EditButton {...props} record={record} />
              ) : null
            }
          />
          <ShowButton {...props} />
        </Datagrid>
      </List>
    </>
  );
};

export default AppealsList;
