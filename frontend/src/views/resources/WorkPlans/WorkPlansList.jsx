import {
  Button,
  Datagrid,
  FunctionField,
  List,
  ReferenceField,
  TextField,
  TopToolbar,
  useDataProvider,
  useRedirect,
} from "react-admin";
import React, { useEffect } from "react";
import { dateFormatter } from "../../../helpers";
import WorkPlansView from "./WorkPlansView";
import { formatValuesToQuery } from "../../../helpers/dataHelpers";
import { Typography } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

const AsideData = ({ record, projectDetails, ...props }) => {
  if (!projectDetails) return null;

  return (
    <WorkPlansView
      basePath="/cost-plans"
      id={record.id}
      resource="cost-plans"
      record={record}
      projectDetails={projectDetails}
      defaultBreadcrumbs
      isHistory={props.isHistory}
    />
  );
};

const Actions = ({ projectId, ...props }) => {
  const redirect = useRedirect();

  return (
    <TopToolbar
      style={{ display: "flex", justifyContent: "flex-start", width: "100%" }}
    >
      <Button
        onClick={() => {
          redirect(`/cost-plans-adjusted/${projectId}/show`);
        }}
        label="Back"
        color="primary"
        startIcon={<ArrowBackIcon />}
      />
    </TopToolbar>
  );
};

const WorkPlansList = (props) => {
  const [projectDetails, setProjectDetails] = React.useState(null);

  const dataProvider = useDataProvider();
  const detailsId = props?.match?.params?.id;
  const year = props?.match?.params?.year;

  useEffect(() => {
    dataProvider
      .getOne("project-details", {
        id: detailsId,
      })
      .then((resp) => {
        if (resp && resp.data) {
          setProjectDetails(formatValuesToQuery({ ...resp.data }));
        }
      });
  }, []);

  return (
    <List
      {...props}
      bulkActionButtons={false}
      sort={{
        field: "modified_on",
        order: "DESC",
      }}
      filter={{
        project_detail_id: detailsId,
        year: year,
        cost_plan_type: "ADJUSTED",
        cost_plan_status: "SUBMITTED",
      }}
      actions={<Actions projectId={projectDetails?.project_id} />}
    >
      <Datagrid
        rowClick={false}
        expand={<AsideData {...props} projectDetails={projectDetails} />}
      >
        <FunctionField
          source="created_on"
          label="Created"
          render={(record) => record && dateFormatter(record.created_on)}
        />
        <FunctionField
          source="created_on"
          label="Created by"
          render={(record) => record && record.user && record.user.full_name}
        />
        <FunctionField
          source="modified_on"
          label="Approved"
          render={(record) => record && dateFormatter(record.modified_on)}
        />
        <ReferenceField
          label="Approved by"
          source="modified_by"
          reference="users"
          linkType={null}
        >
          <FunctionField
            source="modified_by"
            label="Approved by"
            render={(record) => record && record.full_name}
          />
        </ReferenceField>

        <TextField source="year" />
      </Datagrid>
    </List>
  );
};

export default WorkPlansList;
