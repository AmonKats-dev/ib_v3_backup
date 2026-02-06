import React from "react";
import HTML2React from "html2react";
import { useTranslate } from "react-admin";
import { romanize } from "../../../../../helpers/formatters";
import {
  checkFeature,
  useCheckPermissions,
} from "../../../../../helpers/checkPermission";

export const Attacments = (props) => {
  const checkPermission = useCheckPermissions();
  const translate = useTranslate();
  const { customRecord, customBasePath, counter = 1 } = props;
  const record = customRecord;
  const basePath = customBasePath;

  return (
    <div className="Section2">
      <div className="content-area">
        <h2>
          {romanize(counter)}. {translate("printForm.attachments.title")}
        </h2>
        <div>
          {record.files && record.files.length !== 0 ? (
            <ul style={{ listStyleType: "none" }}>
              {record.files
                .filter(
                  (file) =>
                    file.meta &&
                    !file.meta.project_analysis &&
                    !file.meta.completion_report &&
                    !file.meta.expost_report
                )
                .map((item) => (
                  <li>
                    <a href={item.link}>{item.title}</a>
                  </li>
                ))}
            </ul>
          ) : (
            <p>{translate("printForm.attachments.no_attachments")}</p>
          )}
        </div>
        {checkFeature("has_completion_report", record.phase_id) && (
          <div>
            {record.files && record.files.length !== 0 ? (
              <ul style={{ listStyleType: "none" }}>
                {record.files
                  .filter((file) => file.meta && file.meta.completion_report)
                  .map((item) => (
                    <li>
                      <p style={{ marginBottom: 2 }}>
                        {translate("printForm.attachments.completion_report")}
                      </p>
                      <a href={item.link}>{item.title}</a>
                    </li>
                  ))}
              </ul>
            ) : null}
          </div>
        )}
        {checkFeature("has_expost_report", record.phase_id) && (
          <div>
            {record.files && record.files.length !== 0 ? (
              <ul style={{ listStyleType: "none" }}>
                {record.files
                  .filter((file) => file.meta && file.meta.expost_report)
                  .map((item) => (
                    <li>
                      <p style={{ marginBottom: 2 }}>
                        {translate("printForm.attachments.expost_report")}
                      </p>
                      <a href={item.link}>{item.title}</a>
                    </li>
                  ))}
              </ul>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
