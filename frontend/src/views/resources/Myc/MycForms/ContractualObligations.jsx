import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import moment from "moment";
import {
  FormDataConsumer,
  number,
  SelectInput,
  TextInput,
  useTranslate,
} from "react-admin";
import { commasFormatter, commasParser } from "../../../../helpers";
import { useStyles } from "../MycCreate";

const ContractualObligations = ({ targetYears, arraySource, previousYear, ...props }) => {
  const classes = useStyles();

  return (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, ...rest }) => (
        <div style={{ overflow: "auto", width: "100%" }}>
          <Table style={{ width: "auto" }} className={classes.inputTable}>
            <TableHead>
              <TableRow>
                <TableCell>Contract Reference Number</TableCell>
                <TableCell>Funding Source </TableCell>
                <TableCell>Contract Value (UGX)</TableCell>
                <TableCell>{`Approved contract payments ending ${previousYear?.name} (UGX)`}</TableCell>
                <TableCell>Balance on Contract Value (UGX)</TableCell>
                {targetYears &&
                  targetYears.map((year) => <TableCell>{year.name} (UGX)</TableCell>)}
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
                    source={arraySource("contractual.ext.funding_source")}
                    variant="outlined"
                    margin="none"
                    label={false}
                    value={"External"}
                    disabled
                  />
                </TableCell>
                <TableCell>
                  <TextInput
                    // source={arraySource("contractual.ext.contract_value")}
                    disabled
                    source={arraySource("contract_value_ext")}
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
                    source={arraySource("contractual.ext.approved_payments")}
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
                    source={arraySource("contractual.ext.balance_value")}
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
                          source={arraySource(`contractual.ext.${year.id}y`)}
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
                    source={arraySource("contractual.gou.funding_source")}
                    variant="outlined"
                    margin="none"
                    label={false}
                    value={"GoU"}
                    disabled
                  />
                </TableCell>
                <TableCell>
                  <TextInput
                    // source={arraySource("contractual.gou.contract_value")}
                    disabled
                    source={arraySource("contract_value_gou")}
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
                    source={arraySource("contractual.gou.approved_payments")}
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
                    source={arraySource("contractual.gou.balance_value")}
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
                          source={arraySource(`contractual.gou.${year.id}y`)}
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
        </div>
      )}
    </FormDataConsumer>
  );
};

export default ContractualObligations;
