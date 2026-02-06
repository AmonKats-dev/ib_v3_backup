import React, { Fragment } from "react";
import {
  useTranslate,
  FormDataConsumer,
  TextInput,
  SelectInput,
  required,
} from "react-admin";
import CustomInput from "../../../components/CustomInput";
import CustomTextArea from "../../../components/CustomTextArea";

function FinancialAnalysisForm(props) {
  const translate = useTranslate();

  return (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, ...rest }) => {
        return (
          <Fragment>
            <CustomInput tooltipText="IRR %" fullWidth>
              <TextInput
                validate={[required()]}
                source="irr"
                label={translate("resources.project-details.fields.irr")}
              />
            </CustomInput>
            <CustomInput
              tooltipText={`FNPV (${translate("titles.currency")} bln.)`}
              fullWidth
            >
              <TextInput
                validate={[required()]}
                source="fnpv"
                label={translate("resources.project-details.fields.fnpv")}
              />
            </CustomInput>
            <CustomInput tooltipText="ERR %" fullWidth>
              <TextInput
                validate={[required()]}
                source="err"
                label={translate("resources.project-details.fields.err")}
              />
            </CustomInput>
            <CustomInput
              tooltipText={`ENPV (${translate("titles.currency")} bln.)`}
              fullWidth
            >
              <TextInput
                validate={[required()]}
                source="enpv"
                label={translate("resources.project-details.fields.enpv")}
              />
            </CustomInput>
            <CustomInput tooltipText="Financing Modality" fullWidth>
              <SelectInput
                source="financing_modality"
                validate={[required()]}
                label={translate(
                  "resources.project-details.fields.financing_modality"
                )}
                choices={[
                  {
                    id: "traditional procurement", //TODO: check Ids
                    name: "Tradional Procurement",
                  },
                  {
                    id: "public private partnership",
                    name: "Public Private Partnership",
                  },
                ]}
                options={{ fullWidth: "true" }}
              />
            </CustomInput>
            <CustomInput tooltipText="Distribution Module" textArea>
              <CustomTextArea
                validate={[required()]}
                isRequired
                label={translate(
                  "resources.project-details.fields.distributional_assessment"
                )}
                source="distributional_assessment"
                formData={formData}
                {...props}
              />
            </CustomInput>
            <CustomInput tooltipText="Environmental Impact Assessment" textArea>
              <CustomTextArea
                source="env_impact_assessment"
                formData={formData}
                validate={[required()]}
                isRequired
                label={translate(
                  "resources.project-details.fields.env_impact_assessment"
                )}
                {...props}
              />
            </CustomInput>
          </Fragment>
        );
      }}
    </FormDataConsumer>
  );
}

export default FinancialAnalysisForm;
