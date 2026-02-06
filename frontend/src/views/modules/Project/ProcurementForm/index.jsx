import { Typography } from "@material-ui/core";
import { LocationDisabledSharp } from "@material-ui/icons";
import React, { Fragment, useState } from "react";
import {
  FormDataConsumer,
  Labeled,
  ReferenceInput,
  useTranslate,
  SelectInput,
  required,
} from "react-admin";

import CustomInput from "../../../components/CustomInput";
import CustomTextArea from "../../../components/CustomTextArea";
import lodash from "lodash";
import { checkRequired } from "../../../resources/Projects/validation";

function ProcurementForm(props) {
  const translate = useTranslate();
  const renderSource = [
    "Public-Private Partnerships",
    "Joint-Venture",
    "Joint-Venture (Unsolicited Proposal)",
    "Public-Private Partnerships (Unsolicited Proposal)",
    "Joint-Venture (Solicited Proposal)",
    "Public-Private Partnerships (Solicited Proposal)",
  ];
  const renderSourceFund = [
    "Public-Private Partnership",
    "Joint Venture",
    "Unsolicited Proposal",
  ];

  const hasProcurementModality =
    props.record &&
    props.record.procurement_modality &&
    props.record.procurement_modality.filter((item) =>
      renderSource.includes(item)
    ).length > 0;

  const hasFundingSource =
    props.record &&
    props.record.proposed_funding_source &&
    props.record.proposed_funding_source !==
      "Source of funding has not been identified" &&
    props.record.proposed_funding_source.filter((item) =>
      renderSourceFund.includes(item)
    ).length > 0;

  if (!hasFundingSource && !hasProcurementModality) {
    return (
      <Fragment>
        <Typography variant="h4">
          This is only for Public Private Partnership (PPP) or Joint Venture
          (JV) Option
        </Typography>
      </Fragment>
    );
  }

  return (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, ...rest }) => {
        return (
          <Fragment>
            <CustomInput
              tooltipText={
                "tooltips.resources.project-details.fields.ppp_similar_reference"
              }
              fullWidth
              textArea
            >
              <CustomTextArea
                source="ppp_similar_reference"
                formData={formData}
                label={translate(
                  "resources.project-details.fields.ppp_similar_reference"
                )}
                validate={checkRequired("ppp_similar_reference")}
                isRequired
                {...props}
              />
            </CustomInput>
            <CustomInput
              tooltipText={
                "tooltips.resources.project-details.fields.ppp_interest"
              }
              fullWidth
              textArea
            >
              <CustomTextArea
                label={translate(
                  "resources.project-details.fields.ppp_interest"
                )}
                source="ppp_interest"
                formData={formData}
                validate={checkRequired("ppp_interest")}
                isRequired
                {...props}
              />
            </CustomInput>
            <CustomInput
              tooltipText={
                "tooltips.resources.project-details.fields.ppp_impediments"
              }
              fullWidth
              textArea
            >
              <CustomTextArea
                label={translate(
                  "resources.project-details.fields.ppp_impediments"
                )}
                source="ppp_impediments"
                formData={formData}
                validate={checkRequired("ppp_impediments")}
                isRequired
                {...props}
              />
            </CustomInput>
            <CustomInput
              tooltipText={
                "tooltips.resources.project-details.fields.ndp_compliance"
              }
              fullWidth
              textArea
            >
              <CustomTextArea
                label={translate(
                  "resources.project-details.fields.ppp_risk_allocation"
                )}
                source="ppp_risk_allocation"
                formData={formData}
                validate={checkRequired("ppp_risk_allocation")}
                isRequired
                {...props}
              />
            </CustomInput>
          </Fragment>
        );
      }}
    </FormDataConsumer>
  );
}

export default ProcurementForm;
