import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import moment from "moment";
import {
  ArrayInput,
  DateInput,
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

const Procurement = ({ activities, project, arraySource, ...props }) => {
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
        return (
          <ArrayInput source={arraySource("procurement")} label={false}>
            <SimpleFormIterator>
              <FormDataConsumer>
                {({ formData, scopedFormData, getSource, ...rest }) => {
                  const targetYears =
                    formData &&
                    formData.start_date &&
                    formData.end_date &&
                    getFiscalYearsRangeForIntervals(
                      formData.start_date,
                      formData.end_date
                    );

                  return (
                    <div style={{ overflow: "auto", width: "100%" }}>
                      <Table className={classes.inputTable}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Procurement Ref. No.</TableCell>
                            <TableCell>Description of Procurement</TableCell>
                            <TableCell>Category of Procurement</TableCell>
                            <TableCell>Stage of Procurement</TableCell>
                            <TableCell>
                              Estimated Contract Value (UGX){" "}
                            </TableCell>
                            <TableCell>Source of Financing</TableCell>
                            <TableCell>Estimated Commencement Date</TableCell>
                            <TableCell>Estimated Contract End Date</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <TextInput
                                source={getSource("pipeline_number")}
                                variant="outlined"
                                margin="none"
                                label={false}
                              />
                            </TableCell>
                            <TableCell>
                              <TextInput
                                source={getSource("description")}
                                variant="outlined"
                                margin="none"
                                label={false}
                              />
                            </TableCell>
                            <TableCell>
                              <SelectInput
                                style={{ marginTop: 0 }}
                                source={getSource("category")}
                                variant="outlined"
                                label={false}
                                choices={[
                                  { id: "works", name: "Works" },
                                  { id: "supplies", name: "Supplies" },
                                  { id: "consultancy", name: "Consultancy" },
                                  {
                                    id: "non_consultancy_services",
                                    name: "Non-Consultancy Services",
                                  },
                                ]}
                              />
                            </TableCell>
                            <TableCell>
                              <SelectInput
                                style={{ marginTop: 0 }}
                                source={getSource("stage")}
                                variant="outlined"
                                label={false}
                                choices={[
                                  { id: "initiation", name: "Initiation" },
                                  { id: "bidding", name: "Bidding" },
                                  { id: "evaluation", name: "Evaluation" },
                                  {
                                    id: "award_and_contract_signing ",
                                    name: "Award and Contract signing",
                                  },
                                ]}
                              />
                            </TableCell>
                            <TableCell>
                              <TextInput
                                source={getSource("contract_value")}
                                variant="outlined"
                                margin="none"
                                label={false}
                                format={commasFormatter}
                                parse={commasParser}
                                validate={[number()]}
                              />
                            </TableCell>

                            <TableCell>
                              <SelectInput
                                source={getSource("source")}
                                variant="outlined"
                                margin="none"
                                label={false}
                                choices={[
                                  { id: "gou", name: "Government of Uganda" },
                                  { id: "donor", name: "External Financing" },
                                ]}
                              />
                            </TableCell>
                            <TableCell>
                              {/* <DateInput
                                source={getSource("comm_date")}
                                variant="outlined"
                                margin="none"
                                label={false}
                              /> */}
                              <SelectInput
                                options={{ fullWidth: "true" }}
                                label={false}
                                source={getSource("comm_date")}
                                choices={getFiscalYearsFromDate(moment(), 10)}
                                variant="outlined"
                                margin="none"
                              />
                            </TableCell>
                            <TableCell>
                              {/* <DateInput
                                source={getSource("contract_end")}
                                variant="outlined"
                                margin="none"
                                label={false}
                              /> */}
                              <SelectInput
                                options={{ fullWidth: "true" }}
                                label={false}
                                source={getSource("contract_end")}
                                choices={getFiscalYearsFromDate(moment(), 10)}
                                variant="outlined"
                                margin="none"
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                      {targetYears && (
                        <>
                          <h2>Annual pipeline procurement cost</h2>
                          <TableContainer style={{ overflow: 'auto'}}>
                            <Table className={classes.inputTable}>
                              <TableHead>
                                <TableRow>
                                  <TableCell>
                                    Estimated contract value (UGX)
                                  </TableCell>
                                  {targetYears &&
                                    targetYears.map((year, idx) => (
                                      <TableCell>{`${year.name} (UGX)`}</TableCell>
                                    ))}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell>
                                    <TextInput
                                      source={getSource("contract_value")}
                                      variant="outlined"
                                      margin="none"
                                      label={false}
                                      format={commasFormatter}
                                      parse={commasParser}
                                      validate={[number()]}
                                      disabled
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
                          </TableContainer>
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

export default Procurement;
