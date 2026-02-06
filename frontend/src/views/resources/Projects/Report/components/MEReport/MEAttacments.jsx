import React from "react";
import { useTranslate } from "react-admin";

export const MEAttacments = (props) => {
  const translate = useTranslate();
  const { customRecord, customBasePath, counter = 1 } = props;
  const record = customRecord;
  const basePath = customBasePath;

  return (
    <div className="Section2">
      <div className="content-area">
        <h2>
          Table 11: {translate("printForm.attachments.title")}
        </h2>
        <div>
          {record.files && record.files.length !== 0 ? (
            <ul>
              {record.files.map((item) => (
                <li>
                  <a href={item.link}>{item.title}</a>
                </li>
              ))}
            </ul>
          ) : (
            <p>{translate("printForm.attachments.no_attachments")}</p>
          )}
        </div>
      </div>
    </div>
  );
};
