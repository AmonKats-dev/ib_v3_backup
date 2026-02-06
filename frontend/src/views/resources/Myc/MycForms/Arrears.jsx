import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import { FormDataConsumer, number, TextInput } from "react-admin";
import { commasFormatter, commasParser } from "../../../../helpers";
import { useStyles } from "../MycCreate";

const Arrears = ({ targetYears, arraySource, previousYear, ...props }) => {
  const classes = useStyles();

  return (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, ...rest }) => {
        return (
          <div style={{ overflow: "auto", width: "100%" }}>
            <Table className={classes.inputTable}>
              <TableHead>
                <TableRow>
                  <TableCell>Contract Reference Number</TableCell>
                  <TableCell>Funding Source </TableCell>
                  <TableCell>{`Cumulative Arrears ending ${previousYear?.name} (UGX)`}</TableCell>
                  {/* <TableCell>Approved Payments (this FY)</TableCell> */}
                  {/* <TableCell>Outstanding (Arrears) </TableCell> */}
                  <TableCell>Verified Arrears (UGX)</TableCell>
                  <TableCell>Un-verified Arrears (UGX)</TableCell>
                  {/* <TableCell>
                    Contract terms (Annual Penalty interest rate, %)
                  </TableCell> */}
                  {/* <TableCell>Arrears Penalty Exposure </TableCell>
                  <TableCell>Arrears Penalty from pervious years</TableCell> */}
                  <TableCell>Cumulative Arrears Penalty Exposure (UGX)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <TextInput
                      source={arraySource("contract_reference_number")}
                      variant="outlined"
                      margin="none"
                      label={false}
                      disabled
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      source={arraySource("arrears.ext.funding_source")}
                      variant="outlined"
                      margin="none"
                      label={false}
                      value={"External"}
                      disabled
                    />
                  </TableCell>
                  <TableCell>
                    <TextInput
                      source={arraySource("arrears.ext.cumulative_arrears")}
                      variant="outlined"
                      margin="none"
                      label={false}
                      format={commasFormatter}
                      parse={commasParser}
                      validate={[number()]}
                    />
                  </TableCell>
                  {/* <TableCell>
                    <TextInput
                      source={arraySource("arrears.ext.approved_payments")}
                      variant="outlined"
                      margin="none"
                      label={false}
                      format={commasFormatter}
                      parse={commasParser}
                      validate={[number()]}
                    />
                  </TableCell> */}
                  {/* <TableCell>
                    <TextInput
                      source={arraySource("arrears.ext.outstanding")}
                      variant="outlined"
                      margin="none"
                      label={false}
                      disabled
                      format={commasFormatter}
                      parse={commasParser}
                      validate={[number()]}
                    />
                  </TableCell> */}
                  <TableCell>
                    <TextInput
                      source={arraySource("arrears.ext.verified_arrears")}
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
                      source={arraySource("arrears.ext.un_verified_arrears")}
                      variant="outlined"
                      margin="none"
                      label={false}
                      format={commasFormatter}
                      parse={commasParser}
                      validate={[number()]}
                    />
                  </TableCell>
                  {/* <TableCell>
                    <TextInput
                      source={arraySource("arrears.ext.contract_terms")}
                      variant="outlined"
                      margin="none"
                      label={false}
                    />
                  </TableCell> */}
                  {/* <TableCell>
                    <TextInput
                      source={arraySource(
                        "arrears.ext.arrears_penalty_exposure"
                      )}
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
                      source={arraySource(
                        "arrears.ext.arrears_penalty_exposure_previous"
                      )}
                      variant="outlined"
                      margin="none"
                      label={false}
                      format={commasFormatter}
                      parse={commasParser}
                      validate={[number()]}
                    />
                  </TableCell> */}
                  <TableCell>
                    <TextInput
                      source={arraySource("arrears.ext.cumulative_penalty")}
                      variant="outlined"
                      margin="none"
                      label={false}
                      format={commasFormatter}
                      parse={commasParser}
                      validate={[number()]}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <TextInput
                      source={arraySource("contract_reference_number")}
                      variant="outlined"
                      margin="none"
                      label={false}
                      disabled
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      source={arraySource("arrears.gov.funding_source")}
                      variant="outlined"
                      margin="none"
                      label={false}
                      value={"GoU"}
                      disabled
                    />
                  </TableCell>
                  <TableCell>
                    <TextInput
                      source={arraySource("arrears.gov.cumulative_arrears")}
                      variant="outlined"
                      margin="none"
                      label={false}
                      format={commasFormatter}
                      parse={commasParser}
                      validate={[number()]}
                    />
                  </TableCell>
                  {/* <TableCell>
                    <TextInput
                      source={arraySource("arrears.gov.approved_payments")}
                      variant="outlined"
                      margin="none"
                      label={false}
                      format={commasFormatter}
                      parse={commasParser}
                      validate={[number()]}
                    />
                  </TableCell> */}
                  {/* <TableCell>
                    <TextInput
                      source={arraySource("arrears.gov.outstanding")}
                      variant="outlined"
                      margin="none"
                      label={false}
                      format={commasFormatter}
                      parse={commasParser}
                      disabled
                    />
                  </TableCell> */}
                  <TableCell>
                    <TextInput
                      source={arraySource("arrears.gov.verified_arrears")}
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
                      source={arraySource("arrears.gov.un_verified_arrears")}
                      variant="outlined"
                      margin="none"
                      label={false}
                      format={commasFormatter}
                      parse={commasParser}
                      validate={[number()]}
                    />
                  </TableCell>
                  {/* <TableCell>
                    <TextInput
                      source={arraySource("arrears.gov.contract_terms")}
                      variant="outlined"
                      margin="none"
                      label={false}
                    />
                  </TableCell>
                  <TableCell>
                    <TextInput
                      source={arraySource(
                        "arrears.gov.arrears_penalty_exposure"
                      )}
                      variant="outlined"
                      margin="none"
                      format={commasFormatter}
                      parse={commasParser}
                      validate={[number()]}
                      label={false}
                    />
                  </TableCell> */}
                  {/* <TableCell>
                    <TextInput
                      source={arraySource(
                        "arrears.gov.arrears_penalty_exposure_previous"
                      )}
                      variant="outlined"
                      margin="none"
                      label={false}
                      format={commasFormatter}
                      parse={commasParser}
                      validate={[number()]}
                    />
                  </TableCell> */}
                  <TableCell>
                    <TextInput
                      source={arraySource("arrears.gov.cumulative_penalty")}
                      variant="outlined"
                      margin="none"
                      label={false}
                      format={commasFormatter}
                      parse={commasParser}
                      validate={[number()]}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        );
      }}
    </FormDataConsumer>
  );
};

export default Arrears;
