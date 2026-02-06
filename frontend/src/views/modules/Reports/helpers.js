import lodash from "lodash";
import { unparse as convertToCSV } from "papaparse/papaparse.min";
import React from "react";
import { downloadCSV, useTranslate } from "react-admin";
import { EXPORT_TYPES, PROJECT_PHASE_STATUS } from "../../../constants/common";
import { dateFormatter } from "../../../helpers";
import {
  checkFeature,
  useCheckPermissions
} from "../../../helpers/checkPermission";

export const exporter = (records, fetchRelatedRecords) => {
  const exportedRecords = lodash.cloneDeep(records);
  const data = exportedRecords.map((item) => {
    const newItem = {};
    newItem.code = item.code;
    newItem.name = item.name;
    newItem.phase = item.phase.name;
    newItem.submission_date = dateFormatter(item.submission_date);
    newItem.status = PROJECT_PHASE_STATUS[item.project_status];
    newItem.workflow = item.workflow ? item.workflow.status_msg : "-";
    newItem.user = item.user && item.user.full_name;

    return newItem;
  });

  const csv = convertToCSV({
    data,
    fields: [
      "code",
      "name",
      "submission_date",
      "user",
      "status",
      "phase",
      "workflow",
    ],
  });

  downloadCSV(csv, "projects");
};

export function downloadCSVfile(csv, filename) {
  let csvFile;
  let downloadLink;

  csvFile = new Blob([csv], { type: "text/csv" });
  downloadLink = document.createElement("a");
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
}

export function exportTableToCSV(filename, tableId) {
  let csv = [];
  let rows = document.querySelectorAll(`#${tableId} tr`);

  for (var i = 0; i < rows.length; i++) {
    var row = [],
      cols = rows[i].querySelectorAll("td, th");

    for (var j = 0; j < cols.length; j++) row.push(cols[j].innerText);

    csv.push(row.join(";"));
  }

  // Download CSV file
  downloadCSV(csv.join("\n"), filename);
}

export function exportTable(filename, tableId, type) {
  const content = document.getElementById(tableId);
  const query = {
    title: filename,
    content: content
      ? `<div class="Section2"><div class="landscapeSection">${content.outerHTML}</div></div>`
      : "",
  };

  if (type === EXPORT_TYPES.PDF.id) {
    query.format = EXPORT_TYPES.PDF.id;
  }

  // dataProvider('EXPORT', 'reports', { query })
  //     .then((response) => {
  //         let printName = filename;
  //         let a = document.createElement("a");
  //         a.download = `${printName}.${type}`

  //         if (type === EXPORT_TYPES.PDF.id) {
  //             a.href = "data:application/octet-stream;base64," + response.data;
  //         } else {
  //             var blob = new Blob([response.data], { type:"text/plain" });
  //             var url = window.URL.createObjectURL(blob);
  //             a.href = url;
  //         }

  //         a.click();
  //         a.remove();
  //     })
  //     .catch((err) => {
  //         console.error(err);
  //     })
}

export function WorkflowStatusMessage({ record }) {
  const translate = useTranslate();
  const checkPermission = useCheckPermissions();
  if (checkFeature("has_pimis_fields")) {
    if (record && record.workflow) {
      return <>{record.workflow.status_msg}</>;
    }
  }

  if (record && record.workflow) {
    const message =
      record.project_status === "COMPLETED"
        ? translate(`messages.project_is_completed`)
        : record.workflow.status_msg;
    if (record.workflow.is_ipr) {
      if (checkPermission("view_ipr_actions")) {
        return <>{message}</>;
      } else {
        return <>{translate(`timeline.not_pap_status`)}</>;
      }
    }

    return <>{message}</>;
  }

  return null;
}
