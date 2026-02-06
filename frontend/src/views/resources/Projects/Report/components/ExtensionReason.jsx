import React from "react";
import { romanize } from "../../../../../helpers/formatters";
import { useTranslate } from "react-admin";

export const ExtensionReason = (props) => {
  const { customRecord, counter = 1 } = props;
  const translate = useTranslate();

  return (
    <div className="Section2">
      <div className="content-area">
        <h2 className="content-area_title">
          {romanize(counter)}.{" "}
          {translate("printForm.project_info.extension_reason")}
        </h2>
        {customRecord.extension_reason}
      </div>
    </div>
  );
};
