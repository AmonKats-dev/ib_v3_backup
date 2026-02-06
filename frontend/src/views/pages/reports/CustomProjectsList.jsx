// in src/comments.js
import React, { Component, Fragment } from "react";

import lodash from "lodash";
import moment from "moment";
import { translate } from "react-admin";
import { dateFormatter } from "../../../helpers";
import { Typography } from "@material-ui/core";
import { WorkflowStatusMessage } from "../../modules/Reports/helpers";

const CustomProjectsList = ({ ids, data, basePath, translate, ...props }) => {
  const getDaysFromSubmisson = (date) => {
    const dateStart = moment(date);
    const dateSEnd = moment();
    const diff = dateSEnd.diff(dateStart, "days");
    return diff;
  };

  const projects = lodash
    .sortBy(
      ids.map((id) => data[id]).filter((item) => item && item.current_step > 1),
      (it) => it.timeline && getDaysFromSubmisson(it.timeline.created_at)
    )
    .reverse();

  if (props.grouppedBySector) {
    const grouppedData = lodash.groupBy(
      projects,
      (item) =>
        item &&
        item.project_organization &&
        item.project_organization.parent &&
        item.project_organization.parent.name
    );

    return (
      <div style={{ margin: "1em" }}>
        <table style={{ width: "100%" }} cellSpacing={0} className="bordered">
          <thead>
            <tr>
              <th style={{ width: "15%" }}>
                {translate("resources.projects.fields.project_no")}
              </th>
              <th style={{ width: "30%" }}>
                {translate("resources.projects.fields.title")}
              </th>
              <th style={{ width: "30%" }}>
                {translate("resources.projects.fields.vote_id")}
              </th>
              <th style={{ width: "20%" }}>
                {translate("resources.projects.fields.status")}
              </th>
              <th
                style={{ width: "15%" }}
              >{`Time waiting for Decision as at ${moment().format(
                "Do MMMM YYYY"
              )} `}</th>
              <th style={{ width: "15%" }}>
                {translate("resources.projects.fields.created_at")}
              </th>
            </tr>
          </thead>
          <tbody>
            {lodash.keys(grouppedData).map((sectorId) => [
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  {sectorId}
                </td>
              </tr>,
              grouppedData[sectorId].map((item) => (
                <tr>
                  <td style={{ width: "150px" }}>{item.code}</td>
                  <td>{item.name}</td>
                  <td>
                    {item.project_organization &&
                      item.project_organization.name}
                  </td>
                  <td>{item.workflow && (
                        <WorkflowStatusMessage record={item} />
                      )}</td>
                  <td>
                    {item.current_timeline &&
                      `${getDaysFromSubmisson(
                        item.current_timeline.created_on
                      )} days`}
                  </td>
                  <td>
                    {item.current_timeline &&
                      dateFormatter(item.current_timeline.created_on, false)}
                  </td>
                </tr>
              )),
            ])}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div style={{ margin: "1em" }} id="report-container">
      <table style={{ width: "100%" }} cellSpacing={0} className="bordered">
        <thead>
          <tr>
            <th style={{ width: "10%" }}>
              {translate("resources.projects.fields.project_no")}
            </th>
            <th style={{ width: "10%" }}>
              {translate("resources.projects.fields.sector_id")}
            </th>
            <th style={{ width: "20%" }}>
              {translate("resources.projects.fields.title")}
            </th>
            <th style={{ width: "20%" }}>
              {translate("resources.projects.fields.vote_id")}
            </th>
            <th style={{ width: "20%" }}>
              {translate("resources.projects.fields.phase_id")}
            </th>
            <th style={{ width: "10%" }}>
              {translate("resources.projects.fields.status")}
            </th>
            <th style={{ width: "10%" }}>
              {translate("resources.projects.fields.created_at")}
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.map((item) => [
            <tr>
              <td style={{ width: "150px" }}>{item.project_no}</td>
              <td>
                {item.department &&
                  item.department.sector &&
                  item.department.sector.name}
              </td>
              <td>{item.title}</td>
              <td>
                {item.department &&
                  item.department.vote &&
                  item.department.vote.name}
              </td>
              <td>{item.phase}</td>
              <td>{item.workflow && item.workflow.status}</td>
              <td>
                {item.timeline &&
                  dateFormatter(item.timeline.created_at, false)}
              </td>
            </tr>,
          ])}
        </tbody>
      </table>
    </div>
  );
};

CustomProjectsList.defaultProps = {
  data: {},
  ids: [],
};

export default translate(CustomProjectsList);
