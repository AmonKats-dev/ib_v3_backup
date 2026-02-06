import React from "react";
import { useTranslate } from "react-admin";
import { romanize } from "../../../../helpers/formatters";

export const Recommendations = (props) => {
  const { customRecord, counter = 1, details } = props;
  const translate = useTranslate();

  const meReport = details && details.me_reports && details.me_reports[0];
//TODO Correct selection
  return (
    <div className="Section2">
      <div className="content-area">
        <h2 className="content-area_title">
          {romanize(counter)}. Challenges, Recommendations and lessons learned
        </h2>
        <div>
         <p>Challenges</p>
         <p>{meReport.challenges}</p>

         <p>Recommendations </p>
         <p>{meReport.recommendations}</p>

         <p>Lessons</p>
         <p>{meReport.lessons_learned}</p>
        </div>
      </div>
    </div>
  );
};
