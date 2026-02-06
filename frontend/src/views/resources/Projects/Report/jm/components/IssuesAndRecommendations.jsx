import React from "react";
import HTML2React from "html2react";
import { useTranslate } from "react-admin";
import { romanize } from "../../../../../../helpers/formatters";
import { useCheckPermissions } from "../../../../../../helpers/checkPermission";

export const IssuesAndRecommendations = (props) => {
  const checkPermission = useCheckPermissions();
  const translate = useTranslate();
  const { customRecord, counter = 1 } = props;

  if (!checkPermission("view_project_analysis")) return null;
  if (!customRecord) return null;
  if (!customRecord.issues && !customRecord.recommendations) return null;

  return (
    <div className="Section2">
      <div className="content-area">
        <h2>
          {romanize(counter)}.{" "}
          {translate("printForm.project_info.workflow_issues")}
        </h2>
        <div>
          <p>
            <strong>{translate("printForm.workflow.issues")}</strong>
          </p>
          {HTML2React(customRecord.issues)}
        </div>
        <div>
          <p>
            <strong>{translate("printForm.workflow.recommendations")}</strong>
          </p>
          {HTML2React(customRecord.recommendations)}
        </div>
        <ul style={{ listStyleType: "none" }}>
          {customRecord &&
            customRecord.files &&
            customRecord.files
              .filter((file) => file.meta && file.meta.project_analysis)
              .map((item) => (
                <li key={item.id}>
                  <p>Project Analysis File:</p>
                  <a href={item.link}>{item.title}</a>
                </li>
              ))}
        </ul>
      </div>
    </div>
  );
};
