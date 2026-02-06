import {
  FormDataConsumer,
  SimpleFormIterator,
  TextInput,
  required,
  number,
  ArrayInput,
} from "react-admin";
import React, { Fragment } from "react";
import { useTranslate } from "react-admin";

import { getYearsRange } from "../../../../../helpers/formatters";
import lodash from "lodash";
import { commasFormatter, commasParser } from "../../../../../helpers";

function MEReleasesForm(props) {
  const translate = useTranslate();

  return (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, ...rest }) => {
        const projectInfo = lodash.cloneDeep(formData);

        return (
          <Fragment>
            <h1>Releases</h1>
            <ArrayInput source="me_releases" label={false}>
              <SimpleFormIterator disableAdd disableRemove>
                <FormDataConsumer>
                  {({ formData, scopedFormData, getSource, ...rest }) => {
                    return (
                      <Fragment>
                        <h2>{scopedFormData.release_type}</h2>
                        <br />

                        {getYearsRange(
                          projectInfo.start_date,
                          projectInfo.end_date
                        ).map((year) => (
                          <TextInput
                            label="resources.me-reports.fields.government"
                            style={{ width: "200px", margin: "auto 15px" }}
                            variant="outlined"
                            margin="none"
                            format={commasFormatter}
                            parse={commasParser}
                            validate={[required(), number()]}
                            source={getSource(
                              "government_funded." + year.name + "y"
                            )}
                          />
                        ))}
                        {getYearsRange(
                          projectInfo.start_date,
                          projectInfo.end_date
                        ).map((year) => (
                          <TextInput
                            label="resources.me-reports.fields.donor"
                            style={{ width: "200px", margin: "auto 15px" }}
                            validate={[required(), number()]}
                            variant="outlined"
                            margin="none"
                            format={commasFormatter}
                            parse={commasParser}
                            source={getSource(
                              "donor_funded." + year.name + "y"
                            )}
                          />
                        ))}
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

export default MEReleasesForm;
