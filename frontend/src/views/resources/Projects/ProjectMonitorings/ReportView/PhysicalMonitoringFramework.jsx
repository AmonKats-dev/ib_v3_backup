import React from "react";
import HTML2React from "html2react";
import { useTranslate } from "react-admin";
import {
  getFiscalYearsRangeForIntervals,
  romanize,
  getFiscalYearValue,
} from "../../../../../helpers/formatters";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
} from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import moment from "moment";
import lodash from "lodash";
import { formatValuesToQuery } from "../../../../../helpers/dataHelpers";

import {
  FormDataConsumer,
  usePermissions,
  SimpleFormIterator,
  TextInput,
  ArrayInput,
  required,
  maxValue,
  minValue,
  number,
  SelectInput,
} from "react-admin";
import { useFormState } from "react-final-form";
import CustomInput from "../../../../components/CustomInput";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 700,
  },
  bordered: {
    border: `1px solid ${theme.palette.border}`,
    "& td": {
      padding: "0.75rem",
      verticalAlign: "top",
      border: "1px solid #c8ced3",
    },
    "& th": {
      padding: "0.75rem",
      verticalAlign: "top",
      border: "1px solid #c8ced3",
    },
  },
  filledRow: {
    backgroundColor: theme.palette.action.hover,
    fontWeight: "bold",
  },
}));

const STATUS = [
  { id: "NOT_SATISFACTORY", name: "Not Satisfactory" },
  { id: "MODERATELY_SATISFACTORY", name: "Moderately Satisfactory" },
  { id: "SATISFACTORY", name: "Satisfactory" },
];
const STATUSES = [
  { id: "UNDER_PROCUREMENT", name: "Under Procurement" },
  { id: "ONGOING", name: "Ongoing" },
  { id: "COMPLETED", name: "Completed" },
];

export const PhysicalMonitoringFramework = ({
  record,
  projectDetails,
  ...props
}) => {
  const classes = useStyles();
  const translate = useTranslate();
  const { values } = useFormState();

  if (!projectDetails) return null;

  const fiscalYearsFromProps = getFiscalYearsRangeForIntervals(
    projectDetails.start_date,
    projectDetails.end_date
  );

  return (
    <div className="landscapeSection">
      <div className="content-area">
        {props.hideTitle ? null : <h2>Table 1: Physical Monitoring</h2>}
        <TableContainer>
          <Table
            size="small"
            className={clsx("bordered", classes.bordered, classes.table)}
            style={{ width: "100%" }}
          >
            <TableBody>
              <TableRow className={classes.filledRow}>
                <TableCell rowspan="2">
                  {translate("printForm.project_framework.goal")}
                </TableCell>
                <TableCell rowspan="2">
                  {translate("printForm.result_matrix.indicator_title")}
                </TableCell>
                <TableCell colspan={fiscalYearsFromProps.length + 1}>
                  {translate("printForm.result_matrix.indicator")}
                </TableCell>
                {/* <TableCell rowspan={2}>
                  <CustomInput tooltipText="tooltips.resources.me-reports.fields.target">
                    Achieved Target
                  </CustomInput>
                </TableCell> */}
              </TableRow>
              <TableRow>
                <TableCell>{`${translate("printForm.result_matrix.baseline")} ${
                  projectDetails.baseline &&
                  getFiscalYearValue(
                    moment(projectDetails.baseline, "YYYY-MM-DD")
                  ).name
                }`}</TableCell>
                {fiscalYearsFromProps.map((year) => {
                  if(record.year === parseInt(year.id)){
                    return(<TableCell>
                      <strong>{`${translate("printForm.result_matrix.target")} ${
                        year.name
                      }`}</strong>
                    </TableCell>);
                  }                
})}
    <TableCell align="center">
                      <strong>{"Achieved Target"}</strong>
                    </TableCell>
              </TableRow>
          
              <TableRow className={classes.filledRow}>
                <TableCell colSpan={fiscalYearsFromProps.length + 1 + 2 + 4}>
                  {translate(" .project_framework.output", {
                    smart_count: 2,
                  })}
                </TableCell>
              </TableRow>

              {projectDetails &&
                projectDetails.outputs &&
                projectDetails.outputs.map((item, outputIdx) =>
                  item.indicators && item.indicators.length !== 0 ? (
                    item.indicators.map((indicator, idx) => (
                      <TableRow>
                        {idx === 0 ? (
                          <TableCell rowSpan={item.indicators.length}>
                            <p>{`${translate(
                              "printForm.project_framework.output",
                              { smart_count: 1 }
                            )} ${outputIdx + 1}: ${item.name}`}</p>
                            {/* <div
                              style={{ fontSize: "12px", fontStyle: "italic" }}
                            >
                              {HTML2React(item.description)}
                            </div> */}
                          </TableCell>
                        ) : null}
                        <TableCell>{`Indicator ${idx + 1}: ${
                          indicator.name
                        }`}</TableCell>
                        <TableCell>{indicator.baseline}</TableCell>
                        {fiscalYearsFromProps.map((year) => {
                          if(parseInt(year.id)===record.year){
                            return(<TableCell >
                              {indicator.targets[Number(year.id)]}
                            </TableCell>)
}})}
                        <TableCell  align="center">
                          <TextInput
                            label={false}
                            variant="outlined"
                            margin="none"
                            source={`me_outputs[${outputIdx}].indicators[${idx}].target`}
                            style={{ width: "95%" }}
                           
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={fiscalYearsFromProps.length + 1 + 2 + 5}
                      >
                        <p>{`${translate("printForm.project_framework.output", {
                          smart_count: 1,
                        })} ${outputIdx + 1}: ${item.name}`}</p>
                        {/* <div style={{ fontSize: "12px", fontStyle: "italic" }}>
                          {HTML2React(item.description)}
                        </div> */}
                      </TableCell>
                    </TableRow>
                  )
                )}
            </TableBody>
          </Table>
        </TableContainer>
        <br />
        <TableContainer>
          <Table
            size="small"
            className={clsx("bordered", classes.bordered, classes.table)}
          >
            <TableBody>
              <TableRow>
                <TableCell variant="head">Output Name</TableCell>
                <TableCell variant="head">
                  <CustomInput tooltipText="tooltips.resources.me-reports.fields.output_progress">
                    Output Progress
                  </CustomInput>
                </TableCell>
                <TableCell variant="head">
                  <CustomInput tooltipText="tooltips.resources.me-reports.fields.risk_description">
                    Risk Description{" "}
                  </CustomInput>
                </TableCell>
                <TableCell variant="head">
                  <CustomInput tooltipText="tooltips.resources.me-reports.fields.risk_response">
                    Risk Response{" "}
                  </CustomInput>
                </TableCell>
              </TableRow>
              {projectDetails &&
                projectDetails.outputs &&
                projectDetails.outputs.map((item, outputIdx) => [
                  <TableRow>
                    <TableCell style={{ width: "30%" }}>{item.name}</TableCell>
                    <TableCell style={{ width: "10%" }}>
                      <TextInput
                        fullWidth
                        label={false}
                        variant="outlined"
                        margin="none"
                        source={`me_outputs[${outputIdx}].output_progress`}
                      />
                      <SelectInput
                        choices={STATUSES}
                        label="Status" //physical progress state
                        source={`me_outputs[${outputIdx}].output_state`}
                        variant="outlined"
                        margin="none"
                        fullWidth
                      />
                      <SelectInput
                        choices={STATUS}
                        label="resources.me-reports.fields.status" //physical progress status
                        source={`me_outputs[${outputIdx}].output_status`}
                        variant="outlined"
                        margin="none"
                        fullWidth
                        // className={props.classes.textInput}
                        // validate={[required()]}
                      />
                    </TableCell>

                    <TableCell style={{ width: "30%" }}>
                      <TextInput
                        label={false}
                        variant="outlined"
                        margin="none"
                        source={`me_outputs[${outputIdx}].risk_description`}
                        rows={5}
                        multiline
                        fullWidth
                      />
                    </TableCell>
                    <TableCell style={{ width: "30%" }}>
                      <TextInput
                        label={false}
                        variant="outlined"
                        margin="none"
                        source={`me_outputs[${outputIdx}].risk_response`}
                        multiline
                        rows={5}
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>,
                  values &&
                  values.me_outputs &&
                  values.me_outputs[outputIdx] &&
                  values.me_outputs[outputIdx].output_status ===
                    "NOT_SATISFACTORY" ? (
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell colSpan={3}>
                        <CustomInput tooltipText="tooltips.resources.me-reports.fields.challenges_measures">
                          <TextInput
                            label={"Challenges and Measures"}
                            variant="outlined"
                            margin="none"
                            source={`me_outputs[${outputIdx}].challenges`}
                            rows={5}
                            multiline
                            fullWidth
                          />
                        </CustomInput>
                      </TableCell>
                    </TableRow>
                  ) : null,
                ])}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
