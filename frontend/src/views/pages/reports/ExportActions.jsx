// in src/Dashboard.js
import React from "react";
import { useDataProvider, useTranslate } from "react-admin";
import { makeStyles, Tooltip } from "@material-ui/core";
import { useSelector } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EXPORT_TYPES } from "../../../constants/common";
import {
  checkFeature,
  useCheckPermissions,
} from "../../../helpers/checkPermission";
import { STATIC_URL } from "../../../constants/config";

const useStyles = makeStyles((theme) => ({
  buttonsContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "10px 25px",
  },
  buttons: {
    width: "100px",
    fontSize: "16px",
    display: "flex",
    justifyContent: "flex-end",
  },
  icon: {
    cursor: "pointer",
    margin: "0px 5px",
    color: theme.palette.primary.main,
  },
}));

const styless = `
.gantt_task_line {
  border-radius: 2px;
  position: absolute;
  box-sizing: border-box;
  background-color: #3db9d3;
  border: 1px solid #2898b0;
}

.gantt-chart-table th {
  border-left: 1px solid #c8ced3;
}

.gantt-chart-table td {
  padding: 3px 0px !important;
  border-left: 1px solid #c8ced3;
}

.gantt-chart-table .title {
  padding-left: 15px !important;
}

.gantt-chart-table .filled-cell {
  background: blue;
  padding: 12px 0px;
}

.pageBreak{
  page-break-before: always;
  -pdf-keep-with-next: false;
  mso-break-type:section-break;
}

.bordered td {
  padding: 0.25rem;
  vertical-align: top;
  border: 1px solid #c8ced3;
}

.bordered th {
  padding: 0.25rem;
  vertical-align: top;
  border: 1px solid #c8ced3;
}

.filled-row {
  background-color: rgba(0, 0, 0, 0.05);
  font-weight: bold;
}

.content-area {
  margin-bottom: 55px;
}

.content-area_subtitle{
  margin-bottom: 2px;
}

.content-area_title {
  margin-top: 20px;
  margin-bottom: 20px;
}

.footer-left {
  text-align:left;
  width: 50pt;
}

.footer-center {
    text-align:center;
}

.footer-right {
    text-align:right;
}

.footer_img {
  margin-right: 10px;
}

.footer_img img {
  padding-right: 30px;
  width: 45px;
  height: 45px;
}

.MuiTableRow-root {
  outline: 0;
  vertical-align: middle;
}

.MuiTableCell-body {
  color: #263238;
}

.MuiTableCell-root {
  color: #263238;
  padding-top: 5px;
  padding-bottom: 5px;
  font-size: 12px;
  text-align: left;
  font-weight: 400;
  outline: 1px solid black;
}

.MuiTableCell-head {
  color: #263238;
  text-align: center;
  font-weight: bold;
  background-color: #fafafa;
  font-size: 12px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 5px;
  padding-right: 5px;
}

.MuiTableHead-root {
  background-color: #fafafa;
}
.MuiTableCell-alignCenter {
  text-align: center;
}

li {
  margin: 0;
}
`;

export function download_csv(csv, filename) {
  var csvFile;
  var downloadLink;

  // CSV FILE
  csvFile = new Blob([csv], { type: "text/csv" });

  // Download link
  downloadLink = document.createElement("a");

  // File name
  downloadLink.download = filename;

  // We have to create a link to the file
  downloadLink.href = window.URL.createObjectURL(csvFile);

  // Make sure that the link is not displayed
  downloadLink.style.display = "none";

  // Add the link to your DOM
  document.body.appendChild(downloadLink);

  // Lanzamos
  downloadLink.click();
}

function export_table_to_csv(html, filename) {
  var csv = [];
  var rows = document.querySelectorAll("table tr");

  for (var i = 0; i < rows.length; i++) {
    var row = [],
      cols = rows[i].querySelectorAll("td, th");

    for (var j = 0; j < cols.length; j++) {
      let value = cols[j].innerText.replace(/,/g, "");
      row.push(value || "");
    }

    csv.push(row.join(","));
  }

  // Download CSV
  download_csv(csv.join("\n"), filename);
}

function renderFooterText(appPrefix) {
  switch (appPrefix) {
    case "ug":
      return "This is a property of the Government of Uganda";
    case "jm":
      return "This is a property of the Government of Jamaica";

    default:
      return "";
  }
}

function wordFooterTemplate(appPrefix) {
  return `
<table class="footer_table" style='margin-left:50in;'>
<tr style='height:1pt;mso-height-rule:exactly'>
  <td>
    <div style='mso-element:footer' id=f1>
        <img src="${STATIC_URL}/assets/images/${appPrefix}/coat_of_arms.png" width="28" height="24" />
        <span style='font-size:10.0pt; mso-tab-count: 1'>
          ${renderFooterText(appPrefix)}
        </span>
        <span style='font-size:10.0pt mso-tab-count: 5'>
          Page 
        </span>
        <span style='margin-left:10px;'></span>
        <span style='mso-field-code:PAGE'></span>
        <w:sdtPr></w:sdtPr>
        <table class="footer_table" width="100%" border="0" cellspacing="0" cellpadding="0" >
          <tr valign="middle">
            <td align="left"></td>
        </tr></table></div>
    </td>
  </tr>
</table>
`;
}

function ExportActions(props) {
  const classes = useStyles();
  const dataProvider = useDataProvider();
  const [isExporting, setIsExporting] = React.useState(false);
  const appConfig = useSelector((state) => state.app.appConfig);
  const translate = useTranslate();
  const appPrefix = appConfig.application_config.prefix;

  const checkPermission = useCheckPermissions();

  const reportTemplate = (clone, exportType) => {
    return !checkFeature("has_pimis_fields")
      ? `<html>
          <body>        
            <div id="title_content" style="width: 100%; text-align: center;">
              <div>
                <img src="${STATIC_URL}/assets/images/${appPrefix}/coat_of_arms.png" height="150px width="150px" />
              </div>
              <br />
              <h1 style="font-size: 20px;">Government of Uganda</h1>
              <h2 style="font-size: 25px">${props.title}</h2>
            </div>

            <div class="pageBreak"></div>
            <span><br clear=all style='page-break-before:always;mso-break-type:section-break' /></span>
            <div class="page-break"></div>
          
            <!-- HTML Content -->
            <div id='page_content' class="page_content">
              ${clone.innerHTML}
            </div>
              ${exportType === "word" ? wordFooterTemplate(appPrefix) : ""}
          </body>
        </html>`
      : `<html>
      <body>        
        <div id="title_content" style="width: 100%; text-align: center;">
          <div>
            <img src="${STATIC_URL}/assets/images/${appPrefix}/coat_of_arms.png" width="350px"/>
          </div>
          <br />
          <h1 style="font-size: 30px;">Government of Jamaica</h1>
          <h2 style="font-size: 35px;">${props.title}</h2>
        </div>
        
        <div class="pageBreak"></div>
        <span><br clear=all style='page-break-before:always;mso-break-type:section-break' /></span>
        <div class="page-break"></div>

        <!-- HTML Content -->
        <div id='page_content' class="page_content">
          ${clone.innerHTML}
        </div>
        ${exportType === "word" ? wordFooterTemplate(appPrefix) : ""}
      </body>
    </html>`;
  };

  const handleExport = (type) => () => {
    var content = document.getElementById(props.reportId);

    if (type === EXPORT_TYPES.XLS.id) {
      export_table_to_csv(content, `${props.title}.csv`);
      return;
    }

    if (content) {
      var clone = content.cloneNode(true);

      setIsExporting(true);
      dataProvider
        .export("projects", {
          export_name: `${props.title}`,
          data: {
            content: content ? reportTemplate(clone) : "",
            // content: `<div>${clone.innerHTML}</div>`,
            style: `${styless}`,
            export_type: type,
            instance: appPrefix,
          },
        })
        .then((response) => {
          setIsExporting(false);
        })
        .catch((err) => {
          setIsExporting(false);
        });
    }
  };

  if (!checkPermission("export")) return null;

  return (
    <div className={props.className || classes.buttonsContainer}>
      <div className={classes.buttons}>
        {props.exportTypes.map((exportType) => (
          <Tooltip
            title={translate(`buttons.export_${exportType.id}`)}
            placement="left"
          >
            <FontAwesomeIcon
              icon={exportType.icon}
              size="2x"
              onClick={handleExport(exportType.id)}
              className={classes.icon}
            />
          </Tooltip>
        ))}
      </div>
    </div>
  );
}

export default ExportActions;
