import {
  Datagrid,
  Filter,
  FunctionField,
  List,
  useTranslate,
  ReferenceField,
  ReferenceInput,
  Responsive,
  SelectInput,
  SimpleList,
  TextField,
  TextInput,
} from "react-admin";
import lodash from "lodash";
import moment from "moment";
import React, { Component, Fragment } from "react";
import { dateFormatter } from "../../../helpers";
import { Typography } from "@material-ui/core";
import ExportActions from "./ExportActions";
import { EXPORT_TYPES } from "../../../constants/common";

function ReportDC({ record, ...props }) {
  const translate = useTranslate();

  return (
    <>
      <ExportActions
        reportId="report-container"
        title="Projects scheduled for DC"
        exportTypes={[EXPORT_TYPES.WORD, EXPORT_TYPES.PDF, EXPORT_TYPES.XLS]}
      />
      <div id="report-container">
        <Typography variant="h4" style={{ marginBottom: 20 }}>
          {translate(
            `resources.${props.location.pathname.slice(
              1,
              props.location.pathname.length
            )}.name`
          )}
        </Typography>
        <List
          {...props}
          basePath="/projects"
          resource="projects"
          sort={{ field: "id", order: "DESC" }}
          bulkActionButtons={false}
          actions={false}
          perPage={100}
          filter={{
            steps: [6, 9, 10, 11, 12, 13, 14, 15, 16, 18],
            expand: "timeline",
          }} //TODO add last step workflow
        >
          {/* <CustomProjectsList /> */}
          <Datagrid rowClick={"show"}>
            <TextField source="code" />
            <FunctionField
              source="department"
              label={translate(`resources.projects.fields.vote_id`)}
              render={(record) =>
                record &&
                record.project_organization &&
                record.project_organization.parent.name
              }
            />
            <TextField source="name" />
            <FunctionField
              source="phase"
              label={translate(`resources.projects.fields.phase`)}
              render={(record) => record && record.phase && record.phase.name}
            />
            <FunctionField
              source="workflow"
              label={translate(`resources.projects.fields.status`)}
              render={(record) =>
                record && record.phase && record.workflow.status_msg
              }
            />
            <FunctionField
              source="programs"
              label={translate(`resources.programs.name`)}
              render={(record) =>
                record && record.program && record.program.name
              }
            />
            <FunctionField
              source="created_on"
              label={translate(`resources.projects.fields.created_on`)}
              render={(record) =>
                record
                  ? record.current_timeline &&
                    dateFormatter(record.current_timeline.created_on, false)
                  : null
              }
            />
          </Datagrid>
        </List>
      </div>
    </>
  );
}

export default ReportDC;
