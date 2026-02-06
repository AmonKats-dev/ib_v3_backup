import {
  BooleanField,
  CardActions,
  Create,
  Datagrid,
  DateField,
  DeleteButton,
  Edit,
  EditButton,
  FunctionField,
  List,
  Show,
  ShowButton,
  SimpleForm,
  SimpleShowLayout,
  TextField,
  TextInput,
  required,
  useDataProvider,
  useTranslate,
  ExportButton,
  Button,
  downloadCSV,
  TopToolbar,
} from "react-admin";
import jsonExport from "jsonexport/dist";

import { Box, Card, Typography } from "@material-ui/core";
import HTML2React from "html2react";
import React, { useState } from "react";
import { dateFormatter } from "../../../helpers";
import moment from "moment";

const NotificationsShowActions = ({ basePath, data, resource }) => (
  <CardActions>
    <DeleteButton basePath={basePath} record={data} resource={resource} />
  </CardActions>
);

export const NotificationsShow = (props) => {
  const translate = useTranslate();

  function generateMessage() {
    const { record } = props;
    const projectLink =
      record &&
      record.project &&
      `#/projects/${record.project.id}/show/${record.project.phase_id}`;

    if (record && record.project && record.project_status === 'IN_PIPELINE') {
      return `The project <b>${record.project.name}</b> has not been selected for ranking. You can check the details of the project by following
      <a href=${projectLink}>this link</a>`
    }

    return (
      record &&
      record.project &&
      `The Project <b>${record.project.name}</b> ${ACTIONS[record.project_status]
      } by <b>${record.sender ? record.sender.full_name : ""
      }</b> at <b>${moment(record.created_on).format(
        "DD/MM/YYYY"
      )}</b>. You can check the details of the project by following
      <a href=${projectLink}>this link</a>
    `
    );
  }
  return (
    <Show actions={<NotificationsShowActions />} {...props}>
      <SimpleShowLayout>
        <DateField source="created_on" showTime />

        <FunctionField
          source="sender"
          label={translate(`resources.notifications.fields.sender`)}
          render={(record) =>
            record && record.sender ? record.sender.full_name : null
          }
        />

        <FunctionField
          source="sender"
          label={translate(`resources.notifications.fields.body_html`)}
          render={(record) => (record ? HTML2React(generateMessage()) : null)}
        />
      </SimpleShowLayout>
    </Show>
  );
};

const rowStyle = (record, index) => ({
  backgroundColor: record && record.is_unread ? "#efe" : "white",
});

const ACTIONS = {
  APPROVED: "has been submitted",
  DRAFT: "has been created",
  SUBMITTED: "has been submitted",
  REJECT: "has been rejected",
  REVISE: "has been revised",
  ASSIGNED: "has been assigned",
  COMPLETED: "has been completed",
  ONGOING: "is being implemented",
  POST_EVALUATION: "has been passed to ex-post evaluation",
  IN_PIPELINE: "is in pipeline",
};

const exporter = (comments) => {
  const commentsForExport = comments.map((post) => {
    const postForExport = {};
    postForExport.date = post.created_on; // add a field
    postForExport.sender = post.sender ? post.sender.full_name : "user"; // add a field
    postForExport.message = `The Project ${post.project ? post.project.name : ""
      } ${ACTIONS[post.project_status]} by ${post.sender ? post.sender.full_name : "user"
      }`;
    return postForExport;
  });
  jsonExport(
    commentsForExport,
    {
      headers: ["date", "sender", "message"], // order fields in the export
    },
    (err, csv) => {
      downloadCSV(csv, "Notifications"); // download as 'posts.csv` file
    }
  );
};

function ListActions(props) {
  return (
    <TopToolbar>
      <ExportButton {...props} style={{ paddingTop: 0, minHeight: 0 }} />
      {props.showDeleted && (
        <Button
          onClick={() => {
            props.onSetFilter();
          }}
          style={{ paddingTop: 0, minHeight: 0 }}
          label={props.showDeleted ? "Show All" : "Show Unread"}
        ></Button>
      )}
    </TopToolbar>
  );
}

const Empty = (props) => {
  const { loading, loaded, total } = props;
  if (total === 0 && !loading && loaded) {
    return (
      <Box textAlign="center" m={1}>
        <Typography variant="h4" paragraph>
          There are no notifications
          <br />
          <br />
          {props.showDeleted && (
            <Button onClick={props.onSetFilter} label={"Show All"}></Button>
          )}
        </Typography>
      </Box>
    );
  }

  return <div></div>;
};

export const NotificationsList = (props) => {
  const [showDeleted, setShowDeleted] = useState(false);
  const translate = useTranslate();

  function handleSetFilter() {
    setShowDeleted(!showDeleted);
  }

  return (
    <List
      {...props}
      bulkActionButtons={false}
      exporter={exporter}
      empty={<Empty onSetFilter={handleSetFilter} {...props} />}
      actions={
        <ListActions onSetFilter={handleSetFilter} showDeleted={showDeleted} />
      }
      filter={{ is_unread: showDeleted }}
    >
      <Datagrid
        rowStyle={rowStyle}
        rowClick="expand"
        expand={<NotificationsShow {...props} />}
        bulkActionButtons={false}
      >
        <DateField source="created_on" showTime />

        <FunctionField
          source="sender"
          label={translate(`resources.notifications.fields.sender`)}
          render={(record) =>
            record && record.sender ? record.sender.full_name : null
          }
        />

        <FunctionField
          source="sender"
          label={translate(`resources.notifications.fields.body_html`)}
          render={(record) => {
            if (!record || !record?.project) return null;

            if (record && record.project && record.project_status === 'IN_PIPELINE') {
              return `The project ${record.project.name} has not been selected for ranking.`
            }

            return `The Project ${record.project.name} ${ACTIONS[record.project_status]
              } by ${record.sender.full_name}`
          }

          }
        />
      </Datagrid>
    </List>
  );
};

export default NotificationsList;
