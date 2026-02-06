import React, { Fragment } from "react";
import {
  FormDataConsumer,
  TextInput,
  translate,
  ArrayInput,
  SimpleFormIterator,
  SelectInput,
} from "react-admin";
import CustomInput from "../../../components/CustomInput";
import { STRATEGIC_VALUES } from "../../../../constants/common";

const StrategicAlignmentForm = (props) => (
  <FormDataConsumer>
    {({ getSource, scopedFormData, formData, ...rest }) => {
      return (
        <div style={{ width: "80%" }}>
          <ArrayInput source={`strategic_alignments`} label={false}>
            <SimpleFormIterator>
              <FormDataConsumer>
                {({ getSource, scopedFormData, formData, ...rest }) => {
                  return (
                    <>
                      <CustomInput
                        tooltipText={props.translate(
                          "tooltips.resources.project-details.fields.strategic_alignments.fields.plan"
                        )}
                      >
                        <SelectInput
                          options={{ fullWidth: "true" }}
                          label={props.translate(
                            "resources.project-details.fields.strategic_alignments.fields.plan"
                          )}
                          source={getSource("plan")}
                          choices={STRATEGIC_VALUES.PLANS}
                        />
                      </CustomInput>
                      <CustomInput
                        tooltipText={props.translate(
                          "tooltips.resources.project-details.fields.strategic_alignments.fields.objective_reference"
                        )}
                      >
                        <SelectInput
                          options={{ fullWidth: "true" }}
                          label={props.translate(
                            "resources.project-details.fields.strategic_alignments.fields.objective_reference"
                          )}
                          source={getSource("objective_reference")}
                          choices={
                            (scopedFormData &&
                              STRATEGIC_VALUES.OBJECTIVES[
                                scopedFormData.plan
                              ]) ||
                            []
                          }
                        />
                      </CustomInput>
                      <CustomInput
                        fullWidth
                        tooltipText={props.translate(
                          "resources.project-details.fields.strategic_alignments.fields.explanation"
                        )}
                      >
                        <TextInput
                          source={getSource("explanation")}
                          label={props.translate(
                            "resources.project-details.fields.strategic_alignments.fields.explanation"
                          )}
                        />
                      </CustomInput>
                    </>
                  );
                }}
              </FormDataConsumer>
            </SimpleFormIterator>
          </ArrayInput>
        </div>
      );
    }}
  </FormDataConsumer>
);

export default translate(StrategicAlignmentForm);
