import React from "react";
import HTML2React from "html2react";
import { useTranslate } from "react-admin";
import { romanize } from "../../../../../helpers/formatters";
import { checkFeature } from "../../../../../helpers/checkPermission";

export const Behavior = (props) => {
  const { customRecord, counter } = props;
  const translate = useTranslate();

  return (
    <div className="Section2">
      <div className="content-area">
        <h2>
          {counter ? `${romanize(counter)}.` : ""}{" "}
          {translate("printForm.behavior.title")}
        </h2>
        <div>
          <p>
            <strong>
              {translate("printForm.behavior.behavior_knowledge_products")}
            </strong>
          </p>
          {HTML2React(customRecord.behavior_knowledge_products)}
        </div>
        <div>
          <p>
            <strong>
              {translate("printForm.behavior.behavior_project_results")}
            </strong>
          </p>
          {HTML2React(customRecord.behavior_project_results)}
        </div>
        <div>
          <p>
            <strong>{translate("printForm.behavior.behavior_measures")}</strong>
          </p>
          {HTML2React(customRecord.behavior_measures)}
        </div>
      </div>
    </div>
  );
};
