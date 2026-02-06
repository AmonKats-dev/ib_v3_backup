import {
  FormDataConsumer,
  usePermissions,
  SimpleFormIterator,
  TextInput,
  required,
  ArrayInput,
} from "react-admin";
import React, { Fragment } from "react";
import { SelectInput, useTranslate } from "react-admin";
import CustomInput from "../../../../components/CustomInput";

const ISSUES = [
  { id: "No issues", name: "No issues" },
  { id: "Right of way acquisition", name: "Right of way acquisition" },
  { id: "Delayed procurement", name: "Delayed procurement" },
  {
    id: "Delayed payment to contractor",
    name: "Delayed payment to contractor",
  },
  {
    id: "Delayed issuance of objection by the funder",
    name: "Delayed issuance of objection by the funder",
  },
  {
    id: "Inadequate counterpart funding",
    name: "Inadequate counterpart funding",
  },
  { id: "Other", name: "Other" },
];

function MEIssuesForm(props) {
  const { permissions } = usePermissions();
  const translate = useTranslate();

  return (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, ...rest }) => {
        return (
          <Fragment>
            <h1>Coordination Issues</h1>
            <ArrayInput source="issues" label={false}>
              <SimpleFormIterator>
                <FormDataConsumer>
                  {({ formData, scopedFormData, getSource, ...rest }) => {
                    return (
                      <Fragment>
                        <SelectInput
                          className={props.classes.textInput}
                          source={getSource("issue")}
                          choices={ISSUES}
                          variant="outlined"
                          margin="none"
                          label={false}
                          options={{ fullWidth: "true" }}
                          fullWidth
                        />
                        {scopedFormData && scopedFormData.issue === "Other" && (
                          <TextInput
                            source={getSource("issues_other")}
                            variant="outlined"
                            margin="none"
                          />
                        )}
                        {scopedFormData &&
                          scopedFormData.issue !== "No issues" && (
                            <>
                              <CustomInput
                                fullWidth
                                textArea
                                tooltipText="tooltips.resources.me-reports.fields.issue_challenges"
                              >
                                <TextInput
                                  label={translate(
                                    "resources.me-reports.fields.challenges"
                                  )}
                                  variant="outlined"
                                  margin="none"
                                  source={getSource(`challenges`)}
                                  validate={required()}
                                  rows={5}
                                  multiline
                                  fullWidth
                                />
                              </CustomInput>
                              <CustomInput
                                fullWidth
                                textArea
                                tooltipText="tooltips.resources.me-reports.fields.issue_recommendations"
                              >
                                <TextInput
                                  label={translate(
                                    "resources.me-reports.fields.recommendations"
                                  )}
                                  variant="outlined"
                                  margin="none"
                                  source={getSource(`recommendations`)}
                                  validate={required()}
                                  rows={5}
                                  multiline
                                  fullWidth
                                />
                              </CustomInput>
                            </>
                          )}
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

export default MEIssuesForm;
