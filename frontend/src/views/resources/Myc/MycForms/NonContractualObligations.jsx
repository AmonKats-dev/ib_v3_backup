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
} from "react-admin";
import { getFiscalYearsByDuration } from "../../../../helpers/formatters";
import { commasFormatter, commasParser } from "../../../../helpers";
import { useStyles } from "../MycCreate";

const NonContractualObligations = ({ activities, record, ...props }) => {
  const classes = useStyles();

  const duration =
    record &&
    moment(record.end_date, "YYYY-MM-DD").diff(
      moment(record.start_date, "YYYY-MM-DD"),
      "years"
    ) + 1;

  const targetYears = record
    ? getFiscalYearsByDuration(record.signed_date, duration)
    : [];
  const options = activities.map((item) => {
    return {
      id: item.id,
      name: item.costing_name,
      label: `${item.costing_code} - ${item.costing_name}`,
    };
  });

  const fundSources = [
    {
      id: "external",
      name: "External",
    },
    {
      id: "gou",
      name: "GOU",
    },
  ];

  if (!activities || (activities && activities.length === 0)) {
    return <h2>No data from PBS</h2>;
  }

  return (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, ...rest }) => (
        <div style={{ overflow: "auto", width: "100%" }}>
          <ArrayInput source={"myc_data.non_contractual"} label={false}>
            <SimpleFormIterator>
              <FormDataConsumer>
                {({ formData, scopedFormData, getSource, ...rest }) => {
                  return (
                    <Table className={classes.inputTable}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Item</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>Source funding </TableCell>
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
                            <SelectInput
                              source={getSource("activity")}
                              variant="outlined"
                              margin="none"
                              label={false}
                              choices={options}
                              optionText="label"
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
                              source={getSource("funding_source")}
                              variant="outlined"
                              margin="none"
                              label={false}
                              choices={fundSources}
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
                  );
                }}
              </FormDataConsumer>
            </SimpleFormIterator>
          </ArrayInput>
        </div>
      )}
    </FormDataConsumer>
  );
};

export default NonContractualObligations;
