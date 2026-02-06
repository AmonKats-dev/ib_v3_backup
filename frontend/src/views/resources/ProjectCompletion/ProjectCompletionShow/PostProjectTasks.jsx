import HTML2React from "html2react";
import React from "react";
import { useTranslate } from "react-admin";
import { romanize } from "../../../../helpers/formatters";

export const PostProjectTasks = (props) => {
  const { customRecord, counter = 1 } = props;
  const translate = useTranslate();
  if (!customRecord) return null;

  return (
    <div className="Section2">
      <div className="content-area">
        <h2 className="content-area_title">
          {romanize(counter)}. Post-project tasks / future considerations
        </h2>
        <div>
          <div>{HTML2React(customRecord.future_considerations)}</div>
        </div>
      </div>
    </div>
  );
};
