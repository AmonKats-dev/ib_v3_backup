import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import moment from "moment";
import {
  ArrayInput,
  FormDataConsumer,
  number,
  SelectInput,
  SimpleFormIterator,
  TextInput,
  useDataProvider,
} from "react-admin";
import {
  getFiscalYearsFromDate,
  getFiscalYearsRangeForIntervals,
} from "../../../../helpers/formatters";
import { commasFormatter, commasParser } from "../../../../helpers";
import { useEffect } from "react";
import { useState } from "react";
import { useStyles } from "../MycCreate";

const Counterpart = ({ activities, project, ...props }) => {
  const [ampData, setAmpData] = useState();
  const dataProvider = useDataProvider();
  const classes = useStyles();

  useEffect(() => {
    dataProvider
      .integrations("amp", {
        filter: { project_id: project.id },
      })
      .then((res) => {
        if (res && res.data) {
          setAmpData(res.data);
        }
      });
  }, []);

  return (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, ...rest }) => {
        if (!ampData || (ampData && ampData.length === 0)) {
          return <h2>No data from AMP</h2>;
        } else {
          if (
            !formData.myc_data.countryPart ||
            formData.myc_data.countryPart.length === 0
          ) {
            formData.myc_data.countryPart = ampData;
          }
        }

        return (
          <ArrayInput source={"myc_data.countryPart"} label={false}>
            <SimpleFormIterator disableAdd disableRemove>
              <FormDataConsumer>
                {({ formData, scopedFormData, getSource, ...rest }) => {
                  if (
                    scopedFormData &&
                    scopedFormData.agreement_sign_date &&
                    scopedFormData.agreement_close_date
                  ) {
                    scopedFormData.start_date = moment(
                      scopedFormData.agreement_sign_date
                    )
                      .startOf("year")
                      .format("YYYY-MM-DD");

                    scopedFormData.end_date = moment(
                      scopedFormData.agreement_close_date
                    )
                      .startOf("year")
                      .format("YYYY-MM-DD");
                  }

                  const targetYears =
                    scopedFormData &&
                    scopedFormData.start_date &&
                    scopedFormData.end_date &&
                    getFiscalYearsRangeForIntervals(
                      scopedFormData.start_date,
                      scopedFormData.end_date
                    );

                  return (
                    <div style={{ overflow: "auto", width: "100%" }}>
                      <h2>Counterpart Summary</h2>
                      <Table className={classes.inputTable}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Financing Agreement Title</TableCell>
                            <TableCell>Project Start Date (FY) </TableCell>
                            <TableCell>Project End Date (FY) </TableCell>
                            <TableCell>Counterpart requirements </TableCell>
                            <TableCell>Counterpart Value (UGX)</TableCell>
                            {targetYears &&
                              targetYears.map((year) => (
                                <TableCell>{year.name} (UGX)</TableCell>
                              ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <TextInput
                                source={getSource("agreement_title")}
                                variant="outlined"
                                margin="none"
                                label={false}
                              />
                            </TableCell>
                            <TableCell>
                              <SelectInput
                                source={getSource("start_date")}
                                options={{ fullWidth: "true" }}
                                label={false}
                                choices={getFiscalYearsFromDate(
                                  moment(),
                                  10,
                                  true
                                )}
                                variant="outlined"
                                margin="none"
                              />
                            </TableCell>
                            <TableCell>
                              <SelectInput
                                source={getSource("end_date")}
                                options={{ fullWidth: "true" }}
                                label={false}
                                choices={getFiscalYearsFromDate(
                                  moment(),
                                  10,
                                  true
                                )}
                                variant="outlined"
                                margin="none"
                              />
                            </TableCell>
                            <TableCell>
                              <TextInput
                                source={getSource("specification")}
                                variant="outlined"
                                margin="none"
                                label={false}
                              />
                            </TableCell>
                            <TableCell>
                              <TextInput
                                source={getSource("value")}
                                variant="outlined"
                                margin="none"
                                label={false}
                                format={commasFormatter}
                                parse={commasParser}
                                validate={[number()]}
                              />
                            </TableCell>
                            {targetYears &&
                              targetYears.map((year) => {
                                return (
                                  <TableCell>
                                    <TextInput
                                      source={getSource(`${year.id}y`)}
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
                        </TableBody>
                      </Table>
                      {targetYears && (
                        <>
                          <h2>Counterpart Obligations</h2>
                          <Table className={classes.inputTable}>
                            <TableHead>
                              <TableRow>
                                <TableCell>Financing Agreement Title</TableCell>
                                <TableCell>{`Approved contract payments ending ${targetYears[0]?.name} (UGX)`}</TableCell>
                                <TableCell>Balance on Counter-part (UGX)</TableCell>{" "}
                                {targetYears &&
                                  targetYears.map((year, idx) => (
                                    <TableCell>{`Y${idx + 1} (${
                                      year.name
                                    }) (UGX)`}</TableCell>
                                  ))}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>
                                  <TextInput
                                    source={getSource("agreement_title")}
                                    variant="outlined"
                                    margin="none"
                                    label={false}
                                    disabled
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextInput
                                    source={getSource("transactions.disbursed")}
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
                                    source={getSource("transactions.balance")}
                                    variant="outlined"
                                    margin="none"
                                    label={false}
                                    format={commasFormatter}
                                    parse={commasParser}
                                    validate={[number()]}
                                  />
                                </TableCell>
                                {targetYears &&
                                  targetYears.map((year) => {
                                    return (
                                      <TableCell>
                                        <TextInput
                                          source={getSource(
                                            `transactions.${year.id}y`
                                          )}
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
                            </TableBody>
                          </Table>
                        </>
                      )}
                    </div>
                  );
                }}
              </FormDataConsumer>
            </SimpleFormIterator>
          </ArrayInput>
        );
      }}
    </FormDataConsumer>
  );
};

export default Counterpart;
