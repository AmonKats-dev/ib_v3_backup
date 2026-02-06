import moment from "moment";
import React from "react";
import {
  SimpleForm,
  TextInput,
  DateInput,
  useDataProvider,
  SelectInput,
  useTranslate,
  FormDataConsumer,
  number,
  BooleanInput,
} from "react-admin";
import { QUARTERS } from "../../../constants/common";
import { getFiscalYearsRangeForIntervals } from "../../../helpers/formatters";
import CustomInput from "../../components/CustomInput";
import CustomToolbar from "../../components/CustomToolbar";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { FIN_VALUES } from "./constants";
import FilesUploaderSection from "../Projects/Actions/Buttons/ActionButton/FilesUploaderSection";
import FileUploader from "../../components/FileUploader";
import { commasFormatter, commasParser } from "../../../helpers";
import { Typography } from "@material-ui/core";

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

const AppealsEditForm = ({ projectDetails, project, ...props }) => {
  const [dateRange, setDateRange] = React.useState([]);
  const dataProvider = useDataProvider();
  const classes = useStyles();

  React.useEffect(() => {
    if (projectDetails) {
      const { start_date, end_date } = projectDetails;
      setDateRange(getFiscalYearsRangeForIntervals(start_date, end_date));
    }
  }, [projectDetails]);

  const translate = useTranslate();

  return (
    <SimpleForm
      {...props}
      toolbar={
        <CustomToolbar projectDetailId={props.record?.project_detail_id} />
      }
      sanitizeEmptyValues={false}
      redirect="show"
    >
      <CustomInput
        tooltipText={"tooltips.resources.appeals.fields.interventions"}
        fullWidth
      >
        <TextInput source="interventions" variant="outlined" margin="none" />
      </CustomInput>

      <CustomInput
        tooltipText={"tooltips.resources.appeals.fields.appeal_reason"}
        fullWidth
      >
        <Typography variant="h6">Appeals Reasons</Typography>
        <div style={{ display: "flex", gap: "25px", marginTop: 10 }}>
          <BooleanInput
            source="is_time"
            label="Time"
            variant="outlined"
            margin="none"
          />
          <BooleanInput
            source="is_scope"
            label="Scope"
            variant="outlined"
            margin="none"
          />
          <BooleanInput
            source="is_cost"
            label="Cost"
            variant="outlined"
            margin="none"
          />
        </div>
      </CustomInput>

      <CustomInput
        tooltipText={"tooltips.resources.appeals.fields.challenges"}
        fullWidth
      >
        <TextInput source="challenges" variant="outlined" margin="none" />
      </CustomInput>

      <CustomInput
        tooltipText={"tooltips.resources.appeals.fields.recommendations"}
        fullWidth
      >
        <TextInput source="recommendations" variant="outlined" margin="none" />
      </CustomInput>

      <CustomInput
        tooltipText={"tooltips.resources.appeals.fields.additional_info"}
        fullWidth
      >
        <TextInput source="additional_info" variant="outlined" margin="none" />
      </CustomInput>

      <CustomInput
        tooltipText={
          "tooltips.resources.appeals.fields.proposed_extension_date"
        }
        fullWidth
      >
        <DateInput
          source="proposed_extension_date"
          variant="outlined"
          margin="none"
        />
      </CustomInput>

      <FormDataConsumer>
        {({ getSource, scopedFormData, formData, ...rest }) => {
          const targetYears = getFiscalYearsRangeForIntervals(
            moment(),
            formData.proposed_extension_date
          );

          return (
            <div>
              <h2>PROJECT FINANCIAL PERFORMANCE</h2>
              <TableContainer>
                <Table
                  size="medium"
                  className={clsx("bordered", classes.bordered, classes.table)}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      {targetYears?.map((year) => {
                        return <TableCell colSpan={2}>{year.name}</TableCell>;
                      })}
                    </TableRow>
                    <TableRow>
                      <TableCell></TableCell>
                      {targetYears?.map((year) => {
                        return (
                          <>
                            <TableCell>GoU</TableCell>
                            <TableCell>Donor</TableCell>
                          </>
                        );
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {FIN_VALUES.map((item, idx) => {
                      return (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          {targetYears?.map((year) => {
                            return (
                              <>
                                <TableCell>
                                  <TextInput
                                    label={false}
                                    variant="outlined"
                                    margin="none"
                                    source={`financial_performance.fv${item.id}.${year.id}y.gou`}
                                    parse={commasParser}
                                    format={commasFormatter}
                                    validate={number()}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextInput
                                    label={false}
                                    variant="outlined"
                                    margin="none"
                                    source={`financial_performance.fv${item.id}.${year.id}y.donor`}
                                    parse={commasParser}
                                    format={commasFormatter}
                                    validate={number()}
                                  />
                                </TableCell>
                              </>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              <div>
                <h2>PROJECT PHYSICAL PERFORMANCE </h2>
                <TableContainer>
                  <Table
                    size="medium"
                    className={clsx(
                      "bordered",
                      classes.bordered,
                      classes.table
                    )}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell rowSpan={2}>
                          Outcome / Output / Indicator
                        </TableCell>
                        <TableCell rowSpan={2}>Original Baseline </TableCell>
                        <TableCell rowSpan={2}>Original Target</TableCell>
                        <TableCell colSpan={5}>
                          Assessment of cumulative physical performance
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        {targetYears?.map((year) => {
                          return <TableCell>{year.name}</TableCell>;
                        })}
                        <TableCell>Outstanding physical performance</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {projectDetails?.outcomes?.map((outcome, idx) => {
                        const outcomeRender = (
                          <TableRow>
                            <TableCell colSpan={4 + targetYears.length}>
                              Outcome: {outcome.name}
                            </TableCell>
                          </TableRow>
                        );

                        const outcomeIndicators = outcome?.indicators?.map(
                          (indicator, idx) => {
                            const years = Object.keys(indicator.targets);
                            const targetValue =
                              indicator.targets[years[years.length - 1]];

                            return (
                              <TableRow key={indicator.id}>
                                <TableCell>{indicator.name}</TableCell>
                                <TableCell>{indicator.baseline}</TableCell>
                                <TableCell>{targetValue}</TableCell>
                                {targetYears?.map((year) => {
                                  return (
                                    <TableCell>
                                      <TextInput
                                        label={false}
                                        variant="outlined"
                                        margin="none"
                                        source={`physical_performance.ind${indicator.id}.${year.id}y`}
                                        parse={commasParser}
                                        format={commasFormatter}
                                        validate={number()}
                                      />
                                    </TableCell>
                                  );
                                })}
                                <TableCell>
                                  <TextInput
                                    label={false}
                                    variant="outlined"
                                    margin="none"
                                    source={`physical_performance.ind${indicator.id}.performance`}
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          }
                        );

                        return (
                          <>
                            {outcomeRender}
                            {outcomeIndicators}
                          </>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              <div>
                <h2>
                  FINANCIAL REQUIREMENTS OF PROJECT OUTPUTS TO BE ACHIEVED
                  DURING THE PROPOSED EXTENSION
                </h2>
                <TableContainer>
                  <Table
                    size="medium"
                    className={clsx(
                      "bordered",
                      classes.bordered,
                      classes.table
                    )}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell colSpan={2}>Output</TableCell>
                        {targetYears?.map((year) => {
                          return <TableCell>{year.name}</TableCell>;
                        })}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {projectDetails?.outputs?.map((output, idx) => {
                        return (
                          <TableRow key={output.id}>
                            <TableCell style={{ width: "50px" }}>{`1. ${
                              idx + 1
                            }`}</TableCell>
                            <TableCell>{output.name}</TableCell>
                            {targetYears?.map((year) => {
                              return (
                                <TableCell>
                                  <TextInput
                                    label={false}
                                    variant="outlined"
                                    margin="none"
                                    source={`financial_requirements.otp${output.id}.${year.id}y`}
                                    parse={commasParser}
                                    format={commasFormatter}
                                    validate={number()}
                                  />
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <h2>Implementation Plan</h2>
                <TableContainer>
                  <Table
                    size="medium"
                    className={clsx(
                      "bordered",
                      classes.bordered,
                      classes.table
                    )}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Outputs</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell>End Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {projectDetails?.outputs?.map((output, idx) => {
                        return (
                          <TableRow key={output.id}>
                            <TableCell>{`Output ${idx + 1}: ${
                              output.name
                            }`}</TableCell>
                            <TableCell>
                              <DateInput
                                label={false}
                                variant="outlined"
                                margin="none"
                                source={`implementation_plan.otp${output.id}.start_date`}
                              />
                            </TableCell>
                            <TableCell>
                              <DateInput
                                label={false}
                                variant="outlined"
                                margin="none"
                                source={`implementation_plan.otp${output.id}.end_date`}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <h2>Attachments</h2>
              <FileUploader
                meta={{ relatedField: `appeals_${props.record.id}` }}
                resource="appeal"
                entityId={props.record.id}
                fileTypeId={0}
                placeholder={translate("titles.drop_files")}
                record={formData}
                approvedUploading
              />
            </div>
          );
        }}
      </FormDataConsumer>
    </SimpleForm>
  );
};

export default AppealsEditForm;
