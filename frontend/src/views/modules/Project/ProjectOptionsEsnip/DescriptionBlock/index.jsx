import React, { Fragment } from "react";
import {
  SelectInput,
  ArrayInput,
  TextInput,
  SimpleFormIterator,
  FormDataConsumer,
  useTranslate,
  Labeled,
  number,
  required,
  BooleanInput,
} from "react-admin";
import { commasFormatter, commasParser } from "../../../../../helpers";
import { checkFeature } from "../../../../../helpers/checkPermission";
import CustomInput from "../../../../components/CustomInput";
import CustomTextArea from "../../../../components/CustomTextArea";

function DescriptionBlock(props) {
  const translate = useTranslate();
  const { record } = props;

  return (
    <ArrayInput source="project_options" label={null} className="iterator">
      <SimpleFormIterator
        disableAdd={checkFeature(
          "project_options_disable_change",
          Number(record.phase_id) || props.disabled
        )}
        disableRemove={checkFeature(
          "project_options_disable_change",
          Number(record.phase_id) || props.disabled
        )}
      >
        <FormDataConsumer>
          {({ getSource, scopedFormData, formData, ...rest }) => {
            if (
              checkFeature(
                "project_options_disable_change",
                Number(record.phase_id)
              ) &&
              formData.project_options.length === 0
            ) {
              formData.project_options[0] = {};
            }
            return (
              <Fragment>
                <CustomInput
                  tooltipText={
                    "tooltips.resources.project_options.fields.title"
                  }
                  fullWidth
                >
                  <TextInput
                    source={getSource("name")}
                    label={translate("resources.project_options.fields.title")}
                    variant="outlined"
                    margin="none"
                  />
                </CustomInput>
                <CustomInput
                  tooltipText={
                    "tooltips.resources.project_options.fields.description"
                  }
                  fullWidth
                >
                  <CustomTextArea
                    source={getSource("description")}
                    formData={formData}
                    validate={required()}
                    isRequired
                    label={translate(
                      "resources.project_options.fields.description"
                    )}
                    {...props}
                  />
                </CustomInput>
                <CustomInput
                  tooltipText={"tooltips.resources.project_options.fields.cost"}
                  fullWidth
                >
                  <TextInput
                    source={getSource("cost")}
                    label={translate("resources.project_options.fields.cost")}
                    validate={[number()]}
                    format={commasFormatter}
                    parse={commasParser}
                    variant="outlined"
                    margin="none"
                  />
                </CustomInput>
                <CustomInput
                  tooltipText={
                    "tooltips.resources.project_options.fields.funding_modality.title"
                  }
                  fullWidth
                >
                  <SelectInput
                    variant="outlined"
                    margin="none"
                    options={{
                      fullWidth: "true",
                    }}
                    label={translate(
                      `resources.project_options.fields.funding_modality.title${
                        checkFeature(
                          "project_options_change_modality_title",
                          props.record.phase_id
                        )
                          ? "_pfs"
                          : ""
                      }`
                    )}
                    source={getSource("funding_modality")}
                    choices={[
                      {
                        id: "PROCUREMENT",
                        name: translate(
                          "resources.project_options.fields.funding_modality.procurement"
                        ),
                      },
                      {
                        id: "PARTNERSHIP",
                        name: translate(
                          "resources.project_options.fields.funding_modality.partnership"
                        ),
                      },
                    ]}
                  />
                </CustomInput>
                <CustomInput
                  tooltipText={translate(
                    "tooltips.resources.options_appraisals.fields.is_shortlisted"
                  )}
                  bool
                >
                  <BooleanInput
                    source={getSource("is_shortlisted")}
                    label={translate(
                      "resources.options_appraisals.fields.is_shortlisted"
                    )}
                  />
                </CustomInput>
              </Fragment>
            );
          }}
        </FormDataConsumer>
      </SimpleFormIterator>
    </ArrayInput>
  );
}

export default DescriptionBlock;
