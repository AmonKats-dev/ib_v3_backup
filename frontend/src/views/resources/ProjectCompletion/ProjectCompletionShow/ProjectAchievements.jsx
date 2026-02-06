import HTML2React from "html2react";
import React from "react";
import { useTranslate } from "react-admin";
import { romanize } from "../../../../helpers/formatters";

export const ProjectAchievements = (props) => {
  const { customRecord, counter = 1 } = props;
  if (!customRecord) return null;
  return (
    <div className="Section2">
      <div className="content-area">
        <h2 className="content-area_title">
          {romanize(counter)}. Project Achievements
        </h2>
        <div>
          <div>{HTML2React(customRecord.achievements)}</div>
        </div>
      </div>
    </div>
  );
};
