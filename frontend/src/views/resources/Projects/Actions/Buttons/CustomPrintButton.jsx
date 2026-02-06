import {
  Button,
  useDataProvider,
  usePermissions,
  useTranslate,
} from "react-admin";
import React, { Component, Fragment, useEffect, useState } from "react";

import CircularProgress from "@material-ui/core/CircularProgress";
import MenuItem from "@material-ui/core/MenuItem";
import Print from "@material-ui/icons/Print";
import PropTypes from "prop-types";
import Select from "@material-ui/core/Select";
import {
  checkFeature,
  useCheckPermissions,
} from "../../../../../helpers/checkPermission";
import { imgEncoded } from "./helper";
import { STATIC_URL } from "../../../../../constants/config";
import { useSelector } from "react-redux";
import { PROJECT_STATUS } from "../../../../../constants/common";
import { useDispatch } from "react-redux";
import { delay } from "lodash";

const defaultProps = {
  label: "ra.action.export",
  record: {},
  icon: <Print />,
  id: 0,
  printId: "",
};

function CustomPrintButton(props) {
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const [exportType, setExportType] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const checkPermission = useCheckPermissions();
  const appConfig = useSelector((state) => state.app.appConfig);
  const appPrefix = appConfig.application_config.prefix;
  const { permissions } = usePermissions();

  useEffect(() => {
    if (isExporting && exportType) {
      const { printId, record } = props;
      if (exportType === "html") {
        handleHTMLexport(printId, record);
      } else {
        handlePDFexport(printId, record);
      }
    }
  }, [exportType, isExporting]);

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

  const handleExportType = (event) => {
    event.stopPropagation();
    setShowMenu(false);
    setExportType(event.target.value);
    setIsExporting(true);
  };

  const dispatch = useDispatch();

  const handleExport = () => {
    const { printId, record } = props;

    dispatch({
      type: "SET_IS_EXPORTING",
      payload: {
        data: true,
      },
    });

    if (exportType === "html") {
      return handleHTMLexport(printId, record);
    } else {
      if (checkFeature("export_project_word", props.phase)) {
        if (checkPermission("export_project_word_always")) {
          setShowMenu(true);
        } else {
          if (
            checkPermission("export_project_word") &&
            props.record &&
            props.record.project_status ===
              PROJECT_STATUS.STATUS_DRAFT.toUpperCase()
          ) {
            setShowMenu(true);
          } else {
            handlePDFexport(printId, record);
          }
        }
      }
    }
  };

  const handleCloseMenu = () => {
    setShowMenu(false);
  };

  const reportTemplateHTML = (clone) => {
    return !checkFeature("has_pimis_fields")
      ? `<html>
          <head>
          <style>
                  .gantt_task_line {
                    border-radius: 2px;
                    position: absolute;
                    box-sizing: border-box;
                    background-color: #3db9d3;
                    border: 1px solid #2898b0;
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
                    outline: none;
                  }
        
                  .bordered th {
                    padding: 0.25rem;
                    vertical-align: top;
                    border: 1px solid #c8ced3;
                    outline: none;
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

                  figure table td { 
                    padding: 0.25rem;
                    vertical-align: top;
                    border: 1px solid #c8ced3;
                    outline: none;
                  }
          </style>
          </head>
          <body>        
            <div id="title_content" style="width: 100%; text-align: center;">
              <div>
                <img src="${STATIC_URL}/assets/images/${appPrefix}/coat_of_arms.png" height="350" />
              </div>
              <br />
          <h1 style="font-size: 30px;">Government of Uganda</h1>
          <h2 style="font-size: 30px">${
            props.record &&
            props.record.project_organization &&
            props.record.project_organization.parent.name
          }</h2>
              <h2 style="font-size: 30px">${
                props.record &&
                props.record.project_organization &&
                props.record.project_organization.name
              }</h2>
              <h2 style="font-size: 30px">${
                props.record && props.record.name
              }</h2>
              <h1 style="font-size: 30px">${translate(
                `resources.phases.phase_${props.phase}`
              )}</h1>
            </div>
          
            <!-- HTML Content -->
            <div id='page_content' class="page_content">
              ${clone.innerHTML}
            </div>
          </body>
        </html>`
      : `<html>
      <head>
      <style>
              .gantt_task_line {
                border-radius: 2px;
                position: absolute;
                box-sizing: border-box;
                background-color: #3db9d3;
                border: 1px solid #2898b0;
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
                outline: none;
              }
    
              .bordered th {
                padding: 0.25rem;
                vertical-align: top;
                border: 1px solid #c8ced3;
                outline: none;
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
    
              figure table td { 
                padding: 0.25rem;
                vertical-align: top;
                border: 1px solid #c8ced3;
                outline: none;
              }
      </style>
      </head>
      <body>        
        <div id="title_content" style="width: 100%; text-align: center;">
          <div>
            <img src="${STATIC_URL}/assets/images/${appPrefix}/coat_of_arms.png" width="250px" height="250px"/>
          </div>
          <br />
          <h1 style="font-size: 30px;">Government of Jamaica</h1>
          <h2 style="font-size: 30px;">${
            props.record &&
            props.record.project_organization &&
            props.record.project_organization.parent &&
            props.record.project_organization.parent.name
          }</h2>
          <h2 style="font-size: 30px;">${props.record && props.record.name}</h2>
          <h1 style="font-size: 30px;">${translate(
            `resources.phases.phase_${props.phase}`
          )}</h1>
        </div>
      
        <!-- HTML Content -->
        <div id='page_content' class="page_content">
          ${clone.innerHTML}
        </div>
      </body>
    </html>`;
  };

  const reportTemplate = (clone) => {
    return !checkFeature("has_pimis_fields")
      ? `<html>
          <body>        
            <div id="title_content" style="width: 100%; text-align: center;">
              <div>
                <img src="${STATIC_URL}/assets/images/${appPrefix}/coat_of_arms.png" height="750px" />
              </div>
              <br />
              <h1 style="font-size: 20px;">Government of Uganda</h1>
              ${
                props.record && props.record.program
                  ? `<h2 style="font-size: 25px">${props.record.program.name}</h2>`
                  : ""
              }</h2>
              ${
                props.record && props.record.project_organization
                  ? `<h2 style="font-size: 25px">${props.record.project_organization.name}</h2>`
                  : ""
              }</h2>
              <h2 style="font-size: 25px">${
                props.title || (props.record && props.record.name)
              }</h2>
              <h1 style="font-size: 25px">${
                props.phase
                  ? translate(`resources.phases.phase_${props.phase}`)
                  : ""
              }</h1>
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
          <h2 style="font-size: 35px;">${
            props.title ||
            (props.record &&
              props.record.project_organization &&
              props.record.project_organization.parent &&
              props.record.project_organization.parent.name)
          }</h2>
          <h2 style="font-size: 35px;">${props.record.name}</h2>
          <h1 style="font-size: 35px;">${
            props.phase
              ? translate(`resources.phases.phase_${props.phase}`)
              : ""
          }</h1>
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

  const handlePDFexport = (id, record) => {
    var content = document.getElementById(id);
    var clone = content.cloneNode(true);
    // var imgMap = clone.getElementsByClassName("static_map")[0];
    var static_map_btn = clone.getElementsByClassName("static_map_btn")[0];
    var me_btn = clone.getElementsByClassName("me_report_btn")[0];
    var gantt = clone.getElementsByClassName("gantt_container")[0];

    if (gantt && gantt.parentNode) {
      gantt.parentNode.removeChild(gantt);
    }
    if (static_map_btn && static_map_btn.parentNode) {
      static_map_btn.parentNode.removeChild(static_map_btn);
    }
    // if (imgMap && imgMap.parentNode) {
    //   imgMap.parentNode.removeChild(imgMap);
    // }
    if (me_btn && me_btn.parentNode) {
      me_btn.parentNode.removeChild(me_btn);
    }

    dataProvider
      .export("projects", {
        export_name: props.title || `${record.code}-${record.name}`,
        data: {
          content: document.getElementById(id) ? reportTemplate(clone) : "",
          style: `
          .gantt_task_line {
            border-radius: 2px;
            position: absolute;
            box-sizing: border-box;
            background-color: #3db9d3;
            border: 1px solid #2898b0;
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
            margin-bottom: 35px;
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

          figure table td { 
            padding: 0.25rem;
            vertical-align: top;
            border: 1px solid #c8ced3;
            min-width: 50px;
          }
          
          `,
          export_type: exportType || 'pdf',
          instance: appPrefix,
        },
      })
      .then((response) => {
        setIsExporting(false);
        setExportType(null);
        dispatch({
          type: "SET_IS_EXPORTING",
          payload: {
            data: false,
          },
        });
      })
      .catch((err) => {
        setIsExporting(false);
        setExportType(null);
        dispatch({
          type: "SET_IS_EXPORTING",
          payload: {
            data: false,
          },
        });
      });
  };

  const handleHTMLexport = (id, record) => {
    var content = document.getElementById(id);
    var clone = content.cloneNode(true);
    // var imgMap = clone.getElementsByClassName("static_map")[0];
    var static_map_btn = clone.getElementsByClassName("static_map_btn")[0];
    var me_btn = clone.getElementsByClassName("me_report_btn")[0];

    if (static_map_btn && static_map_btn.parentNode) {
      static_map_btn.parentNode.removeChild(static_map_btn);
    }
    // if (imgMap && imgMap.parentNode) {
    //   imgMap.parentNode.removeChild(imgMap);
    // }
    if (me_btn && me_btn.parentNode) {
      me_btn.parentNode.removeChild(me_btn);
    }

    var link = document.createElement("a");
    const mimeType = "text/html";

    link.setAttribute("download", `${record.code}-${record.name}.html`);
    link.setAttribute(
      "href",
      "data:" +
        mimeType +
        ";charset=utf-8," +
        encodeURIComponent(reportTemplateHTML(clone))
    );
    link.click();
    setIsExporting(false);
    setExportType(null);
  };

  return (
    <div style={{ position: "relative" }}>
      <Button
        component={"span"}
        label={"ra.action.export"}
        onClick={handleExport}
      >
        {isExporting ? (
          <CircularProgress
            style={{ marginRight: "10px" }}
            size={25}
            thickness={2}
          />
        ) : (
          <Print />
        )}
      </Button>
      {checkFeature("export_project_word", props.phase) && showMenu && (
        <div style={{ position: "absolute", top: 5 }}>
          <Select
            style={{
              "min-width": "0px",
              fontSize: "0.8125rem",
              color: "#3f51b5",
              "border-bottom": "none",
              "padding-left": "3px",
              width: 100,
            }}
            value={exportType}
            onChange={handleExportType}
            open={showMenu}
            onClose={handleCloseMenu}
          >
            {checkPermission("export_project_pdf") && (
              <MenuItem value={"pdf"}>PDF</MenuItem>
            )}
            {!props.meReport &&
              (checkPermission("export_project_word") ||
                checkPermission("export_project_word_always")) && (
                <MenuItem value={"word"}>WORD</MenuItem>
              )}
            {!props.meReport && checkPermission("export_project_html") && (
              <MenuItem value={"html"}>HTML</MenuItem>
            )}
          </Select>
        </div>
      )}
    </div>
  );
}

CustomPrintButton.propTypes = {
  basePath: PropTypes.string,
  className: PropTypes.string,
  classes: PropTypes.object,
  label: PropTypes.string,
  record: PropTypes.object,
  icon: PropTypes.element,
  id: PropTypes.number,
};

CustomPrintButton.defaultProps = defaultProps;

export default CustomPrintButton;
