import React from "react";
import HTML2React from "html2react";
import { useTranslate } from "react-admin";
import { romanize } from "../../../../helpers/formatters";

export const Introduction = (props) => {
  const { customRecord, counter } = props;
  const translate = useTranslate();

  return (
    <div className="Section2">
      <div className="content-area">
        <h2>
          {counter ? `${romanize(counter)}.` : ""}{" "}
          {translate("printForm.introduction.title")}
        </h2>
        <div>
          {HTML2React(customRecord.rational_study)}
          {HTML2React(customRecord.methodology)}
          {HTML2React(customRecord.organization_study)}
        </div>
      </div>
    </div>
  );
};
