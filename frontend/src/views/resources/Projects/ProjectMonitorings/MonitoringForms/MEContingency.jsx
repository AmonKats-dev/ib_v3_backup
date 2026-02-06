import {
  FormDataConsumer,
  usePermissions,
  SimpleFormIterator,
  TextInput,
  required,
  ArrayInput,
  DateInput,
} from "react-admin";
import React, { Fragment } from "react";
import { SelectInput, useTranslate } from "react-admin";

function MEContingency(props) {
  const { permissions } = usePermissions();
  const translate = useTranslate();

  return (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, ...rest }) => {
        return (
          <Fragment>
            <h1>Contingency Liability</h1>
            <ArrayInput source="me_liabilities" label={false}>
              <SimpleFormIterator>
                <FormDataConsumer>
                  {({ formData, scopedFormData, getSource, ...rest }) => {
                    return (
                      <Fragment>
                        <TextInput
                          label={translate(
                            "resources.me-reports.fields.me_liabilities.amount"
                          )}
                          variant="outlined"
                          margin="none"
                          source={getSource(`amount`)}
                          validate={required()}
                          fullWidth
                        />
                        <DateInput
                          label={translate(
                            "resources.me-reports.fields.me_liabilities.due_date"
                          )}
                          variant="outlined"
                          margin="none"
                          source={getSource(`due_date`)}
                          validate={required()}
                          fullWidth
                        />
                        <TextInput
                          label={translate(
                            "resources.me-reports.fields.me_liabilities.description"
                          )}
                          variant="outlined"
                          margin="none"
                          source={getSource(`description`)}
                          validate={required()}
                          rows={5}
                          multiline
                          fullWidth
                        />
                      </Fragment>
                    );
                  }}
                </FormDataConsumer>
              </SimpleFormIterator>
            </ArrayInput>
          </Fragment>
        );
      }}
    </FormDataConsumer>
  );
}

export default MEContingency;
