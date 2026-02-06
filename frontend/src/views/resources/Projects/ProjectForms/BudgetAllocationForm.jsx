import {
  FormDataConsumer,
  TextInput,
  number,
  required,
  useTranslate,
  DateInput,
  ReferenceInput,
  useDataProvider,
  SelectInput,
} from "react-admin";
import {
  Grid,
  Table,
  Typography,
  TableBody,
  TableRow,
  TableCell,
  Tabs,
  Tab,
} from "@material-ui/core";
import React, { Fragment, useEffect } from "react";
import { commasFormatter, commasParser } from "../../../../helpers";

import { getFiscalYearsRange } from "../../../../helpers/formatters";
import moment from "moment";
import {
  checkFeature,
  useCheckPermissions,
} from "../../../../helpers/checkPermission";

import { useState } from "react";
import { TabPanel } from "@material-ui/lab";
import CustomInput from "../../../components/CustomInput";
import { DEFAULT_SORTING } from "../../../../constants/common";
import { checkRequired } from "../validation";
import ErrorBoundary from "./ErrorBoundary";
import { TOKEN } from "../../../../constants/auth";
import { API_URL } from "../../../../constants/config";

const allocations = {};
function BudgetAllocationForm(props) {
  const [totalCost, setTotalCost] = useState(null);
  const hasPimisFields = checkFeature("has_pimis_fields");
  const translate = useTranslate();
  const checkPermission = useCheckPermissions();
  const [activeTab, setActiveTab] = useState(0);

  function getGovState() {
    // if (checkFeature("has_ibp_fields")) return "Government of Uganda";
    // if (checkFeature("has_pimis_fields")) return "Government of Jamaica";

    return "Government of Uganda";
  }
  useEffect(() => {
    getProjectCost(props.id)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.at(-1).investment_stats.total_cost);
        setTotalCost(data.at(-1).investment_stats.total_cost);
      });
  }, []);
  return (
    <Fragment>
      <FormDataConsumer>
        {({ getSource, formData, scopedFormData, ...rest }) => {
          //TODO: fix first year must be current fiscal year not project dates "iat" from token,
          const targetYears = checkFeature("has_pimis_fields")
            ? getFiscalYearsRange(moment(), moment().add(3, "years"))
            : getFiscalYearsRange(
                props.record.start_date,
                props.record.end_date
              );

          const budgetCodeValidation = checkFeature("has_pimis_fields")
            ? checkRequired("budget_code")
            : [checkRequired("budget_code"), number()];
          const pimisValidation =
            !formData?.budget_code ||
            !formData?.signed_date ||
            !formData.financing_agreement_date;
          const ibpValidation =
            !formData?.budget_code ||
            !formData?.signed_date 

          const isDisabledTab = checkFeature("has_pimis_fields")
            ? pimisValidation
            : ibpValidation;

          return (
            <div>
              <Tabs
                value={activeTab}
                onChange={(ev, id) => setActiveTab(id)}
                indicatorColor="primary"
                textColor="primary"
                variant={null}
                style={{ marginBottom: 20, borderBottom: "1px solid #cacaca" }}
              >
                <Tab label={translate("titles.budget_code")} />
                <Tab
                  label={translate("titles.budget_allocation")}
                  disabled={isDisabledTab}
                />
              </Tabs>
              <div style={{ display: activeTab === 0 ? "block" : "none" }}>
                <TextInput
                  source="budget_code"
                  label={translate("resources.projects.fields.budget_code")}
                  validate={budgetCodeValidation}
                  variant="outlined"
                  margin="none"
                  fullWidth
                  disabled={
                    !checkFeature("has_pimis_fields") &&
                    !checkPermission("full_access")
                  }
                  style={{ marginBottom: 15 }}
                />
                {/* {checkFeature("has_pimis_fields") && ( */}
                <DateInput
                  source="signed_date"
                  label={translate("resources.projects.fields.signed_date")}
                  validate={checkRequired("signed_date")}
                  variant="outlined"
                  margin="none"
                  fullWidth
                />
                {/* )} */}
                {checkFeature("has_pimis_fields") && (
                  <DateInput
                    source="financing_agreement_date"
                    label={translate(
                      "resources.projects.fields.financing_agreement_date"
                    )}
                    validate={checkRequired("financing_agreement_date")}
                    variant="outlined"
                    margin="none"
                    fullWidth
                  />
                )}
                {/* {checkFeature("has_budgeting_coordinator") && (
                  <>
                    <CustomInput
                      tooltipText={
                        "tooltips.resources.project-details.fields.coordinator"
                      }
                      fullWidth
                    >
                      <TextInput
                        source="coordinator"
                        label={"Coordinator"}
                        variant="outlined"
                        margin="none"
                        fullWidth
                        validate={checkRequired("coordinator")}
                      />
                    </CustomInput>
                    <CustomInput
                      tooltipText={translate(
                        "tooltips.resources.project-details.fields.me_creator"
                      )}
                      label={""}
                      fullWidth
                    >
                      <TextInput
                        source="me_creator"
                        label={"M&E Creator"}
                        variant="outlined"
                        margin="none"
                        validate={checkRequired("me_creator")}
                        fullWidth
                      />
                    </CustomInput>
                  </>
                )} */}
              </div>
              <div style={{ display: activeTab === 1 ? "block" : "none" }}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Budget Type</TableCell>
                      {targetYears &&
                        targetYears.map((year) => {
                          const yearFormatted = moment(
                            year.id,
                            "YYYY-MM-DD"
                          ).format("YYYY");

                          return (
                            <TableCell align="center">{`${
                              year.name
                            } (${translate("titles.currency")})`}</TableCell>
                          );
                        })}
                    </TableRow>
                    <TableRow id={"gou-allocations"}>
                      <TableCell>{getGovState()}</TableCell>
                      {targetYears &&
                        targetYears.map((year) => {
                          const yearFormatted = moment(
                            year.id,
                            "YYYY-MM-DD"
                          ).format("YYYY");
                          return (
                            <TableCell align="center">
                              {" "}
                              <TextInput
                                defaultValue={0}
                                id={`gou-${year.name}`}
                                label={false}
                                source={
                                  "budget_allocation.gov." +
                                  String(yearFormatted) +
                                  "y"
                                }
                                variant="outlined"
                                margin="none"
                                format={commasFormatter}
                                parse={commasParser}
                                onChange={(e) => {
                                  allocations[`gou-${year.name}`] = parseInt(
                                    e.target.value.replaceAll(",", "")
                                  );
                                  if (allocationsSum(allocations) > totalCost) {
                                    alert(
                                      `Warning! The total of amounts entered exceeds the approved total project cost(${totalCost})`
                                    );
                                    document.getElementById(
                                      `gou-${year.name}`
                                    ).value = 0;
                                  }
                                }}
                              />
                            </TableCell>
                          );
                        })}
                    </TableRow>
                    <TableRow id={"ext-allocations"}>
                      <TableCell>External financing</TableCell>
                      {targetYears &&
                        targetYears.map((year) => {
                          const yearFormatted = moment(
                            year.id,
                            "YYYY-MM-DD"
                          ).format("YYYY");
                          return (
                            <TableCell align="center">
                              {" "}
                              <TextInput
                                id={`ext-${year.name}`}
                                defaultValue={0}
                                label={false}
                                source={
                                  "budget_allocation.donor." +
                                  String(yearFormatted) +
                                  "y"
                                }
                                variant="outlined"
                                margin="none"
                                format={commasFormatter}
                                parse={commasParser}
                                onChange={(e) => {
                                  allocations[`ext-${year.name}`] = parseInt(
                                    e.target.value.replaceAll(",", "")
                                  );

                                  if (allocationsSum(allocations) > totalCost) {
                                    alert(
                                      `Warning! The total of amounts entered exceeds the approved total project cost(${totalCost})`
                                    );
                                    document.getElementById(
                                      `ext-${year.name}`
                                    ).value = "0";
                                  }
                                }}
                              />
                            </TableCell>
                          );
                        })}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          );
        }}
      </FormDataConsumer>
    </Fragment>
  );
}

export default BudgetAllocationForm;

async function getProjectCost(id) {
  return await fetch(
    `${API_URL}/project-details?filter=%7B%22project_id%22%3A${id}%7D&page=1&per_page=-1&sort_field=id&sort_order=ASC`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(TOKEN)}`,
        ContentType: "JSON/TEXT",
      },
      filter: { id: id },
    }
  );
}

function allocationsSum(allocations) {
  let counter = 0;
  for (const [key, value] of Object.entries(allocations)) {
    counter += value;
  }
  return counter;
}
