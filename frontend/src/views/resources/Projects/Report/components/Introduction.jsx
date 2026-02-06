import React from "react";
import HTML2React from "html2react";
import { useTranslate } from "react-admin";
import { romanize } from "../../../../../helpers/formatters";
import { checkFeature } from "../../../../../helpers/checkPermission";

export const Introduction = (props) => {
  const { customRecord, counter } = props;
  const translate = useTranslate();

  const title =
    customRecord &&
    checkFeature(
      "project_report_organization_study_change_title",
      customRecord.phase_id
    ) ? (
      <p>
        <b>
          {translate("resources.project-details.fields.organization_study_pfs")}
        </b>
      </p>
    ) : (
      <p>
        <b>
          {translate("resources.project-details.fields.organization_study_fs")}
        </b>
      </p>
    );

  return (
    <div className="Section2">
      <div className="content-area">
        <h2>
          {counter ? `${romanize(counter)}.` : ""}{" "}
          {translate("printForm.introduction.title")}
        </h2>
        <div>
          <p>
            <b>
              {translate("resources.project-details.fields.rational_study")}
            </b>
          </p>
          {HTML2React(customRecord.rational_study)}
          <p>
            <b>{translate("resources.project-details.fields.methodology")}</b>
          </p>
          {HTML2React(customRecord.methodology)}
          {title}
          {HTML2React(customRecord.organization_study)}
        </div>
      </div>
    </div>
  );
};
