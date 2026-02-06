import {
  ArrayInput,
  FormDataConsumer,
  Labeled,
  SimpleFormIterator,
  TextInput,
  useTranslate,
  SelectInput,
  required,
  useDataProvider,
} from "react-admin";
import React, { Fragment, useEffect, useState } from "react";

import CustomInput from "../../../components/CustomInput";
import CustomTextArea from "../../../components/CustomTextArea";
import useCheckFeature from "../../../../hooks/useCheckFeature";

import lodash from "lodash";
import { checkRequired } from "../../../resources/Projects/validation";
import { checkFeature } from "../../../../helpers/checkPermission";

function Stakeholders(props) {
  const translate = useTranslate();
  //FEATURE: has multiple or single stakeholders
  const hasMultipleStakeholders = useCheckFeature(
    "project_stakeholders_multiple"
  );
  const hasPimisFields = useCheckFeature("has_pimis_fields");
  const hasPimisStakeholdersTable = useCheckFeature(
    "has_pimis_stakeholders_table",
    props.record.phase_id
  );

  if (hasPimisFields && hasPimisStakeholdersTable) return null;

  if (hasPimisFields && !hasPimisStakeholdersTable) {
    return (
      <FormDataConsumer>
        {({ formData, scopedFormData, getSource, ...rest }) => (
          <CustomInput
            tooltipText={
              "tooltips.resources.project-details.fields.stakeholders_consultation"
            }
            textArea
            fullWidth
          >
            <CustomTextArea
              label={translate(
                "resources.project-details.fields.stakeholders_consultation"
              )}
              source={"stakeholder_consultation"}
              validate={checkRequired("stakeholder_consultation")}
              isRequired
              formData={formData}
              {...props}
            />
          </CustomInput>
        )}
      </FormDataConsumer>
    );
  }

  return (
    <>
      <ArrayInput
        source="stakeholders"
        label={translate("resources.project-details.fields.stakeholders.title")}
        validate={checkRequired("stakeholders")}
      >
        <SimpleFormIterator
          disableAdd={!hasMultipleStakeholders}
          disableRemove={!hasMultipleStakeholders}
        >
          <FormDataConsumer>
            {({ formData, scopedFormData, getSource, ...rest }) => {
              if (hasMultipleStakeholders && !formData.stakeholders) {
                formData.stakeholders[0] = {};
              }

              return (
                <Fragment>
                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project-details.fields.stakeholder.name"
                    }
                    fullWidth
                  >
                    <TextInput
                      label={translate(
                        "resources.project-details.fields.stakeholders.name"
                      )}
                      source={getSource("name")}
                      validate={checkRequired("stakeholders", "name")}
                      variant="outlined"
                      margin="none"
                    />
                  </CustomInput>
                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project-details.fields.stakeholder.responsibilities"
                    }
                    textArea
                    fullWidth
                  >
                    <CustomTextArea
                      source={getSource("responsibilities")}
                      validate={checkRequired(
                        "stakeholders",
                        "responsibilities"
                      )}
                      isRequired
                      label={translate(
                        "resources.project-details.fields.stakeholders.responsibilities"
                      )}
                      formData={formData}
                      {...props}
                    />
                  </CustomInput>
                </Fragment>
              );
            }}
          </FormDataConsumer>
        </SimpleFormIterator>
      </ArrayInput>

      {checkFeature("has_ibp_fields") && (
        <FormDataConsumer>
          {({ formData, scopedFormData, getSource, ...rest }) => {
            return (
              <CustomInput
                tooltipText={
                  "tooltips.resources.project-details.fields.stakeholder.affected_population"
                }
                textArea
                fullWidth
              >
                <CustomTextArea
                  source={"affected_population"}
                  label={translate(
                    "resources.project-details.fields.stakeholders.affected_population"
                  )}
                  formData={formData}
                  {...props}
                />
              </CustomInput>
            );
          }}
        </FormDataConsumer>
      )}
    </>
  );
}

export default Stakeholders;
