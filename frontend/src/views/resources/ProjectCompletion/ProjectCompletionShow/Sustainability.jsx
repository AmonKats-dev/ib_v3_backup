import HTML2React from "html2react";
import React from "react";
import { useTranslate } from "react-admin";
import { romanize } from "../../../../helpers/formatters";

export const Sustainability = (props) => {
  const { customRecord, counter = 1 } = props;
  if (!customRecord) return null;
  return (
    <div className="Section2">
      <div className="content-area">
        <h2 className="content-area_title">
          {romanize(counter)}. Sustainability plan
        </h2>
        <div>
          <h4><b>Financial Sustainability</b></h4>
          <div>{HTML2React(customRecord.financial_sustainability)}</div>
        </div>
        <div>
          <h4><b>Environmental Sustainability</b></h4>
          <div>
            {HTML2React(customRecord.environmental_sustainability)}
          </div>
        </div>
      </div>
    </div>
  );
};
