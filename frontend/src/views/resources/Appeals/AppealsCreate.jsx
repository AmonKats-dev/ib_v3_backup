import {
  Box,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import moment from "moment";
import React from "react";
import {
  BooleanInput,
  Button,
  Create,
  DateInput,
  FormDataConsumer,
  number,
  SelectInput,
  SimpleForm,
  TextInput,
  TopToolbar,
  useNotify,
  useRedirect,
  useTranslate,
} from "react-admin";
import axios from "axios";
import { QUARTERS } from "../../../constants/common";
import {
  getFiscalYearsRangeForIntervals,
  getFiscalYearValueFromYear,
} from "../../../helpers/formatters";
import CustomInput from "../../components/CustomInput";
import CustomToolbar from "../../components/CustomToolbar";
import GavelIcon from "@material-ui/icons/Gavel";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { formatValuesToQuery } from "../../../helpers/dataHelpers";
import { API_URL } from "../../../constants/config";
import { TOKEN } from "../../../constants/auth";
import classNames from "classnames";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import RestoreRoundedIcon from "@material-ui/icons/RestoreRounded";
import TimerRoundedIcon from "@material-ui/icons/TimerRounded";
import MonetizationOnRoundedIcon from "@material-ui/icons/MonetizationOnRounded";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import clsx from "clsx";
import { FIN_VALUES } from "./constants";
import { isNaN } from "lodash";
import { commasFormatter, commasParser } from "../../../helpers";

const useStyles = makeStyles((theme) => ({
  topGroup: {
    display: "flex",
    justifyContent: "space-around",
  },
  title: {
    textAlign: "center",
    fontSize: "18px",
    lineHeight: "24px",
    margin: "10px 30px",
    color: "#3f50b5",
  },
  button: {
    backgroundColor: "#f4f8ff",
    color: "#3f50b5",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 35,
    width: 200,
    height: 200,
    borderRadius: "4px",
    margin: 15,
    textAlign: "center",
    "&:hover": {
      outline: "1px solid #d0d7ff",
      cursor: "pointer",
    },
    "&:hover > $buttonTitle": {
      // display: "none",
      opacity: 0.5,
    },
    "&:hover > $actions": {
      display: "flex",
    },
  },
  buttonSelected: {
    opacity: 1,
  },
  buttonNotSelected: {
    opacity: 0.5,
  },
  buttonTitle: {
    color: "#3f50b5",
    position: "absolute",
    top: 0,
    left: 0,
    display: "flex",
    fontWeight: "bold",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    height: "100%",
    width: "100%",
    justifyContent: "center",

    gap: "15px",
    "& > * ": {
      fontSize: "18px",
    },
  },
  actions: {
    display: "none",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
  },
  actionBtn: {
    width: "100%",
  },
  select: {
    width: "50%",
  },
}));

const Actions = ({ project_detail_id, props }) => {
  const redirect = useRedirect();
  const notify = useNotify();

  return (
    <TopToolbar style={{ justifyContent: "flex-start" }}>
      <Button
        onClick={() => {
          redirect(
            `/implementation-module/${Number(
              project_detail_id
            )}/costed-annualized-plan`
          );
        }}
        label="Back"
        color="primary"
        startIcon={<ArrowBackIcon />}
        // style={{ position: "absolute", left: 0 }}
      />
      {/* <Button
        onClick={() => {
          notify("Appeal Form Revised");
          redirect(
            `/implementation-module/${Number(
              project_detail_id
            )}/costed-annualized-plan`
          );
        }}
        label="Revise"
        color="primary"
        startIcon={<RestoreRoundedIcon />}
      />{" "}
      <Button
        onClick={() => {
          notify("Appeal Form Approved");
          redirect(
            `/implementation-module/${Number(
              project_detail_id
            )}/costed-annualized-plan`
          );
        }}
        label="Approve"
        color="primary"
        startIcon={<CheckRoundedIcon />}
      />{" "} */}
    </TopToolbar>
  );
};

const AppealsCreate = (props) => {
  const translate = useTranslate();
  const [selected, setSelected] = React.useState(null);
  const [dateRange, setDateRange] = React.useState([]);
  const [details, setDetails] = React.useState(null);
  const [project, setProject] = React.useState(null);
  const classes = useStyles();
  const [role, setRole] = React.useState(null);
  const projectDetailId = props.match?.params?.projectId;

  const handleChange = (event) => {
    setSelected(event.target.value);
  };

  React.useEffect(() => {
    if (!projectDetailId) return;
    const token = localStorage.getItem(TOKEN);
    const headers = {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    };

    axios
      .get(`${API_URL}/project-details/${projectDetailId}?missing_ok=1`, {
        headers,
        validateStatus: (status) => status === 200 || status === 404,
      })
      .then((res) => {
        if (res.status !== 200) return;
        const detailData = res.data?.data ?? res.data;
        if (!detailData) return;
        setDetails(formatValuesToQuery({ ...detailData }));

        const projectId = detailData.project_id;
        if (projectId == null || Number.isNaN(Number(projectId))) return;
        return axios.get(`${API_URL}/projects/${projectId}`, {
          headers,
          validateStatus: (status) => status === 200 || status === 404,
        });
      })
      .then((res) => {
        if (!res || !res.config) return;
        if (res.status === 200 && res.data) {
          const data = res.data?.data ?? res.data;
          if (data) setProject(formatValuesToQuery({ ...data }));
        }
      })
      .catch(() => {});
  }, [projectDetailId]);

  const GetTitle = () => {
    const code = details?.project?.code ?? project?.code;
    const name = details?.project?.name ?? project?.name;
    if (code && name) return <h1 style={{ width: "100%" }}>{`${code} - ${name}`}</h1>;
    return null;
  };

  return (
    <Create
      {...props}
      undoable={false}
      actions={<Actions project_detail_id={props.match?.params?.projectId} />}
    >
      <SimpleForm redirect="show">
        <GetTitle />
        <FormDataConsumer>
          {({ getSource, scopedFormData, formData, ...rest }) => {
            if (props.match?.params?.projectId && formData) {
              formData.project_id = details?.project_id;
              // formData.workflow_id = 1;
              // formData.workflow_instance_id = 1;
              // formData.current_step = 1;

              //Budget = Release / Approved budget. Absorption = Expenditure / Release.
            }

            return null;
          }}
        </FormDataConsumer>

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
          <TextInput
            source="recommendations"
            variant="outlined"
            margin="none"
          />
        </CustomInput>

        <CustomInput
          tooltipText={"tooltips.resources.appeals.fields.additional_info"}
          fullWidth
        >
          <TextInput
            source="additional_info"
            variant="outlined"
            margin="none"
          />
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
                    className={clsx(
                      "bordered",
                      classes.bordered,
                      classes.table
                    )}
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
                        // Budget = Release / Approved budget.
                        // Absorption = Expenditure / Release.

                        return (
                          <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            {targetYears?.map((year) => {
                              if (formData) {
                                if (!formData.financial_performance) {
                                  formData.financial_performance = {};
                                }
                                if (
                                  !formData.financial_performance[
                                    `fv${item.id}`
                                  ]
                                ) {
                                  formData.financial_performance[
                                    `fv${item.id}`
                                  ] = {};
                                }
                                if (
                                  !formData.financial_performance[
                                    `fv${item.id}`
                                  ][`${year.id}y`]
                                ) {
                                  formData.financial_performance[
                                    `fv${item.id}`
                                  ][`${year.id}y`] = {};
                                }

                                if (item.id === 5) {
                                  const valueGou =
                                    parseFloat(
                                      formData.financial_performance[`fv3`][
                                        `${year.id}y`
                                      ].gou || 0
                                    ) /
                                    parseFloat(
                                      formData.financial_performance[`fv2`][
                                        `${year.id}y`
                                      ].gou || 0
                                    );

                                  formData.financial_performance[`fv5`][
                                    `${year.id}y`
                                  ].gou =
                                    !isNaN(valueGou) && isFinite(valueGou)
                                      ? (valueGou * 100).toFixed(2)
                                      : "";

                                  const valueDonor =
                                    parseFloat(
                                      formData.financial_performance[`fv3`][
                                        `${year.id}y`
                                      ].donor || 0
                                    ) /
                                    parseFloat(
                                      formData.financial_performance[`fv2`][
                                        `${year.id}y`
                                      ].donor || 0
                                    );

                                  formData.financial_performance[`fv5`][
                                    `${year.id}y`
                                  ].donor =
                                    !isNaN(valueDonor) && isFinite(valueDonor)
                                      ? (valueDonor * 100).toFixed(2)
                                      : "";
                                }

                                if (item.id === 6) {
                                  const valueGou =
                                    parseFloat(
                                      formData.financial_performance[`fv4`][
                                        `${year.id}y`
                                      ].gou || 0
                                    ) /
                                    parseFloat(
                                      formData.financial_performance[`fv3`][
                                        `${year.id}y`
                                      ].gou || 0
                                    );

                                  formData.financial_performance[`fv6`][
                                    `${year.id}y`
                                  ].gou =
                                    !isNaN(valueGou) && isFinite(valueGou)
                                      ? (valueGou * 100).toFixed(2)
                                      : "";

                                  const valueDonor =
                                    parseFloat(
                                      formData.financial_performance[`fv4`][
                                        `${year.id}y`
                                      ].donor || 0
                                    ) /
                                    parseFloat(
                                      formData.financial_performance[`fv3`][
                                        `${year.id}y`
                                      ].donor || 0
                                    );

                                  formData.financial_performance[`fv6`][
                                    `${year.id}y`
                                  ].donor =
                                    !isNaN(valueDonor) && isFinite(valueDonor)
                                      ? (valueDonor * 100).toFixed(2)
                                      : "";
                                }
                              }

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
                          <TableCell>
                            Outstanding physical performance
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {details?.outcomes?.map((outcome, idx) => {
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
                        {details?.outputs?.map((output, idx) => {
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
                        {details?.outputs?.map((output, idx) => {
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
              </div>
            );
          }}
        </FormDataConsumer>
      </SimpleForm>
    </Create>
  );
};

export default AppealsCreate;
