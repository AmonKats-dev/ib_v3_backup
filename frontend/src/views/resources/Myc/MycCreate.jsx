import {
  Button,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
} from "@material-ui/core";
import { useDispatch } from "react-redux";
import moment from "moment";
import React, { useEffect } from "react";
import {
  ArrayInput,
  Create,
  DateInput,
  Edit,
  FormDataConsumer,
  FormTab,
  number,
  SelectInput,
  SimpleForm,
  SimpleFormIterator,
  TabbedForm,
  TextInput,
  Toolbar,
  useDataProvider,
  useRedirect,
  useTranslate,
} from "react-admin";
import { QUARTERS } from "../../../constants/common";
import { commasFormatter, commasParser } from "../../../helpers";
import {
  getFiscalYears,
  getFiscalYearsFromDate,
  getFiscalYearsRangeForIntervals,
  getFiscalYearValueFromYear,
} from "../../../helpers/formatters";
import CustomInput from "../../components/CustomInput";
import CustomToolbar from "../../components/CustomToolbar";
import Arrears from "./MycForms/Arrears";
import ContractualObligations from "./MycForms/ContractualObligations";
import Counterpart from "./MycForms/Counterpart";
import NonContractualObligations from "./MycForms/NonContractualObligations";
import { useFormState } from "react-final-form";
import Procurement from "./MycForms/Procurement";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import AdditionalInfo from "./MycForms/AdditionalInfo";

export const useStyles = makeStyles((theme) => ({
  inputTable: {
    "& .MuiTableCell-body": {
      padding: "5px",
    },
    "& .MuiOutlinedInput-input": {
      padding: "10px",
    },
    "& .MuiSelect-selectMenu": {
      paddingRight: "30px !important",
    },
  },
}));

const MycCreateForm = (props) => {
  const { values } = useFormState();
  const [innerTab, setInnerTab] = React.useState(0);
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: "SET_PROJECT_TITLE_HEADER",
      payload: {
        data: props?.project?.name,
      },
    });

    return () => {
      dispatch({
        type: "SET_PROJECT_TITLE_HEADER",
        payload: {
          data: "",
        },
      });
    };
  }, [dispatch, props]);

  const handleChangeInnerTab = (event, newValue) => {
    setInnerTab(newValue);
  };

  const handleChangeTab = (event, newValue) => {
    props.save(values, false);
    props.onChangeTab(newValue);
  };

  function renderInnerContent(arraySource, rangeSelected, previousYear) {
    if (props.tab === 0) {
      switch (innerTab) {
        case 0:
          return (
            <ContractualObligations
              targetYears={rangeSelected}
              arraySource={arraySource}
              previousYear={previousYear}
            />
          );
        case 1:
          return (
            <Arrears
              targetYears={rangeSelected}
              arraySource={arraySource}
              previousYear={previousYear}
            />
          );
        case 2:
          return (
            <Procurement project={props.project} arraySource={arraySource} />
          );
        default:
        //
      }
    }
  }

  function renderContent(formData) {
    switch (props.tab) {
      case 0:
        return (
          <ArrayInput
            source="myc_data.contractual"
            label={false}
            style={{ overflow: "auto", width: "100%" }}
          >
            <SimpleFormIterator>
              <FormDataConsumer>
                {({ formData, scopedFormData, getSource, ...rest }) => {
                  let previousYear = null;

                  const rangeSelected =
                    scopedFormData &&
                    scopedFormData.end_date &&
                    getFiscalYearsRangeForIntervals(
                      scopedFormData.start_date,
                      scopedFormData.end_date
                    );

                  if (scopedFormData && scopedFormData.start_date) {
                    const currentYear = moment(
                      scopedFormData.start_date,
                      "YYYY"
                    )
                      .startOf("year")
                      .clone()
                      .add(-1, "years");
                    previousYear = getFiscalYearValueFromYear(currentYear);
                  }

                  if (scopedFormData && scopedFormData.arrears) {
                    if (scopedFormData.arrears.ext) {
                      scopedFormData.arrears.ext.outstanding =
                        scopedFormData.arrears.ext.cumulative_arrears -
                        scopedFormData.arrears.ext.approved_payments;
                    }

                    if (scopedFormData.arrears.gov) {
                      scopedFormData.arrears.gov.outstanding =
                        scopedFormData.arrears.gov.cumulative_arrears -
                        scopedFormData.arrears.gov.approved_payments;
                    }
                  }

                  return (
                    <>
                      <h2>Contract Summary</h2>

                      <Table className={classes.inputTable}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Contract Reference Number</TableCell>
                            <TableCell>Contract Name</TableCell>
                            <TableCell>Name of Contractor</TableCell>
                            <TableCell>Contract Start Date (FY)</TableCell>
                            <TableCell>Contract End Date (FY)</TableCell>
                            <TableCell>Contract Value GOU (UGX)</TableCell>
                            <TableCell>Contract Value External (UGX)</TableCell>
                            <TableCell>
                              Annual Penalty interest rate, %
                            </TableCell>
                            <TableCell>Contract status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <TextInput
                                source={getSource("contract_reference_number")}
                                variant="outlined"
                                margin="none"
                                label={false}
                              />
                            </TableCell>
                            <TableCell>
                              <TextInput
                                source={getSource("contract_name")}
                                variant="outlined"
                                margin="none"
                                label={false}
                              />
                            </TableCell>
                            <TableCell>
                              <TextInput
                                source={getSource("contractor_name")}
                                variant="outlined"
                                margin="none"
                                label={false}
                              />
                            </TableCell>
                            <TableCell>
                              <SelectInput
                                options={{ fullWidth: "true" }}
                                label={false}
                                source={getSource("start_date")}
                                choices={getFiscalYearsFromDate(moment(), 10)}
                                variant="outlined"
                                margin="none"
                              />
                            </TableCell>
                            <TableCell>
                              <SelectInput
                                options={{ fullWidth: "true" }}
                                label={false}
                                source={getSource("end_date")}
                                choices={getFiscalYearsFromDate(moment(), 10)}
                                variant="outlined"
                                margin="none"
                              />
                            </TableCell>
                            <TableCell>
                              <TextInput
                                source={getSource("contract_value_gou")}
                                variant="outlined"
                                margin="none"
                                label={false}
                                format={commasFormatter}
                                parse={commasParser}
                                validate={[number()]}
                              />
                            </TableCell>
                            <TableCell>
                              <TextInput
                                source={getSource("contract_value_ext")}
                                variant="outlined"
                                margin="none"
                                label={false}
                                format={commasFormatter}
                                parse={commasParser}
                                validate={[number()]}
                              />
                            </TableCell>
                            <TableCell>
                              <TextInput
                                source={getSource("contract_terms")}
                                variant="outlined"
                                margin="none"
                                label={false}
                              />
                            </TableCell>
                            <TableCell>
                              <SelectInput
                                style={{ marginTop: 0 }}
                                source={getSource("contract_status")}
                                variant="outlined"
                                label={false}
                                choices={[
                                  { id: "ongoing", name: "Ongoing" },
                                  { id: "halted", name: "Halted" },
                                  { id: "terminated", name: "Terminated" },
                                  {
                                    id: "defects_liability ",
                                    name: "Defects Liability ",
                                  },
                                  { id: "completed", name: "Completed" },
                                ]}
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                      {rangeSelected && (
                        <Table
                          style={{ width: "auto" }}
                          className={classes.inputTable}
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell>Funding Source</TableCell>
                              {rangeSelected &&
                                rangeSelected.map((year) => (
                                  <TableCell>{year.name} (UGX)</TableCell>
                                ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>
                                <TextField
                                  source={getSource("ext.funding_source")}
                                  variant="outlined"
                                  margin="none"
                                  label={false}
                                  value={"External"}
                                  disabled
                                />
                              </TableCell>
                              {rangeSelected &&
                                rangeSelected.map((year) => {
                                  return (
                                    <TableCell>
                                      <TextInput
                                        source={getSource(`ext.${year.id}y`)}
                                        variant="outlined"
                                        margin="none"
                                        label={false}
                                        format={commasFormatter}
                                        parse={commasParser}
                                        validate={[number()]}
                                      />
                                    </TableCell>
                                  );
                                })}
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <TextField
                                  source={getSource("gou.funding_source")}
                                  variant="outlined"
                                  margin="none"
                                  label={false}
                                  value={"GoU"}
                                  disabled
                                />
                              </TableCell>

                              {rangeSelected &&
                                rangeSelected.map((year) => {
                                  return (
                                    <TableCell>
                                      <TextInput
                                        source={getSource(`gou.${year.id}y`)}
                                        variant="outlined"
                                        margin="none"
                                        label={false}
                                        format={commasFormatter}
                                        parse={commasParser}
                                      />
                                    </TableCell>
                                  );
                                })}
                            </TableRow>
                          </TableBody>
                        </Table>
                      )}
                      <Tabs
                        value={innerTab}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={handleChangeInnerTab}
                      >
                        <Tab label="Contractual Obligations" />
                        <Tab label="Arrears" />
                        <Tab label="Procurement" />
                      </Tabs>
                      {renderInnerContent(
                        getSource,
                        rangeSelected,
                        previousYear
                      )}
                    </>
                  );
                }}
              </FormDataConsumer>
            </SimpleFormIterator>
          </ArrayInput>
        );
      case 1:
        return (
          <NonContractualObligations
            activities={props.project?.pbs_budget_data}
            record={formData}
          />
        );
      case 2:
        return <Counterpart project={props.project} />;
      case 3:
        return <AdditionalInfo project={props.project} {...props} />;
      default:
      //
    }
  }

  return (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, ...rest }) => (
        <div style={{ overflow: "auto", width: "100%" }}>
          <Tabs
            value={props.tab}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChangeTab}
          >
            <Tab label="Contractual" />
            <Tab label="Non Contractual" />
            <Tab label="Counterpart" />
            <Tab label="Additional MYC information" />
          </Tabs>
          {renderContent(formData)}
        </div>
      )}
    </FormDataConsumer>
  );
};

const MycCreate = (props) => {
  const [tab, setTab] = React.useState(0);
  const [targetYears, setTargetYears] = React.useState([]);
  const [project, setProject] = React.useState({});
  const dataProvider = useDataProvider();

  React.useEffect(() => {
    if (props.match?.params?.projectId)
      dataProvider
        .getOne("projects", {
          id: props.match?.params?.projectId,
        })
        .then((resp) => {
          if (resp && resp.data) {
            const { start_date, end_date } = resp.data;
            setTargetYears(
              getFiscalYearsRangeForIntervals(start_date, end_date)
            );
            setProject(resp.data);
          }
        });
  }, [dataProvider, props.match.params.projectId]);

  const transform = (data) => ({
    myc_data: data.myc_data,
  });

  const handleChangeTab = (newValue) => {
    setTab(newValue);
  };

  return (
    <Edit
      {...props}
      too
      undoable={false}
      actions={false}
      id={props.match?.params?.projectId}
      transform={transform}
      redirect={(resource, id, data) => {
        return `/implementation-module/${project?.current_project_detail?.id}/costed-annualized-plan`;
      }}
    >
      <MycForm
        project={project}
        targetYears={targetYears}
        onChangeTab={handleChangeTab}
        tab={tab}
      />
    </Edit>
  );
};

function MycToolbar(props) {
  const translate = useTranslate();
  const redirect = useRedirect();
  const { values, hasValidationErrors } = useFormState();

  const handleBack = () => {
    redirect(
      `/implementation-module/${props.project?.current_project_detail?.id}/costed-annualized-plan`
    );
  };

  const handleSave = () => {
    props.save(
      values,
      `/implementation-module/${props.project?.current_project_detail?.id}/costed-annualized-plan`
    );
    // props.handleSubmitWithRedirect(props.redirect);
  };

  return (
    <Toolbar>
      <Button
        variant="outlined"
        disabled={props.activeStep === 0}
        onClick={handleBack}
      >
        {translate("buttons.back")}
      </Button>

      <Button color="primary" variant="contained" onClick={handleSave}>
        {translate("buttons.save_exit")}
      </Button>
    </Toolbar>
  );
}

const MycForm = (props) => {
  return (
    <SimpleForm
      toolbar={<MycToolbar {...props} />}
      redirect={(resource, id, data) => {
        return `/implementation-module/${props.project?.current_project_detail?.id}/costed-annualized-plan`;
      }}
      {...props}
    >
      <MycCreateForm
        targetYears={props.targetYears}
        project={props.project}
        {...props}
      />
    </SimpleForm>
  );
};

export default MycCreate;
