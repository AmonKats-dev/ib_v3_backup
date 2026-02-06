import lodash from "lodash";
import moment from "moment";
import React, { Fragment } from "react";
import {
  BooleanInput,
  Button,
  Create,
  FormDataConsumer,
  maxLength,
  ReferenceInput,
  required,
  SaveButton,
  SelectInput,
  SimpleForm,
  TextInput,
  Toolbar,
  TopToolbar,
  useNotify,
  useRedirect,
  useTranslate,
} from "react-admin";
import { optionRenderer } from "../../../../helpers";
import {
  getFiscalYearValue,
  getIndicatorsYears,
} from "../../../../helpers/formatters";
import CustomInput from "../../../components/CustomInput";

const FormToolbar = ({ onSaveSuccess, onClose, ...props }) => {
  const notify = useNotify();

  const handleSave = () => {
    if (!props.invalid) {
      props.handleSubmitWithRedirect();

      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } else {
      window.scrollTo(0, 0);
      notify("You should define required fields  before save!", "error");
    }
  };

  return (
    <Toolbar style={{ width: "100%" }}>
      <Button
        onClick={onClose}
        label="Cancel"
        style={{ marginRight: 5, padding: "7px 15px" }}
        color="primary"
        variant="contained"
      />
      <SaveButton {...props} onClick={handleSave} onSuccess={onSaveSuccess} />
    </Toolbar>
  );
};

function CreateForm({
  record,
  onClose,
  onRefresh,
  referencedOptions,
  projectDetails,
  ...props
}) {
  const translate = useTranslate();

  const lastYear =
    props.targetYears && props.targetYears[props.targetYears.length - 1];

  return (
    <Create basePath="/indicators" resource="indicators" redirect={false}>
      <SimpleForm
        variant="outlined"
        toolbar={
          <FormToolbar
            onSaveSuccess={() => {
              onRefresh();
              onClose();
            }}
            onClose={onClose}
          />
        }
        redirect={false}
      >
        <FormDataConsumer>
          {({ getSource, scopedFormData, formData, ...rest }) => {
            if (formData) {
              formData.project_detail_id = projectDetails.id;
              formData.entity_type = "indicator";
              formData.entity_id = record.id;
              formData.parent_id = record.id;
            }

            return (
              <Fragment>
                <CustomInput
                  tooltipText={
                    "tooltips.resources.indicators.fields.disaggregation_type_id"
                  }
                  fullWidth
                >
                  <SelectInput
                    margin="none"
                    variant="outlined"
                    fullWidth
                    source="disaggregation_type_id"
                    choices={
                      (props.helpers && props.helpers["disaggregationTypes"]) ||
                      []
                    }
                    validate={required()}
                    optionText={optionRenderer}
                  />
                </CustomInput>

                <CustomInput
                  tooltipText={"tooltips.resources.indicators.fields.name"}
                  fullWidth
                >
                  <TextInput
                    validate={[required(), maxLength(255)]}
                    source={"name"}
                    label={translate("resources.indicators.fields.name")}
                    variant="outlined"
                    margin="none"
                  />
                </CustomInput>
                <CustomInput
                  tooltipText={"tooltips.resources.indicators.fields.baseline"}
                  fullWidth
                >
                  <TextInput
                    validate={[required(), maxLength(255)]}
                    source={"baseline"}
                    label={`${translate(
                      "resources.indicators.fields.baseline"
                    )} - ${
                      getFiscalYearValue(
                        moment(projectDetails?.baseline, "YYYY-MM-DD")
                      ).name || ""
                    }`}
                    variant="outlined"
                    margin="none"
                  />
                </CustomInput>

                {props.targetYears &&
                  props.targetYears[props.targetYears.length - 1] && (
                    <CustomInput
                      tooltipText={"resources.indicators.fields.target"}
                      fullWidth
                    >
                      <TextInput
                        validate={[required(), maxLength(255)]}
                        label="End of Project Target"
                        source={`targets.project`}
                        variant="outlined"
                        margin="none"
                      />
                    </CustomInput>
                  )}

                <CustomInput
                  tooltipText={
                    "tooltips.resources.indicators.fields.verification_means"
                  }
                  fullWidth
                >
                  <TextInput
                    validate={[required(), maxLength(255)]}
                    source={"verification_means"}
                    label={translate(
                      "resources.indicators.fields.verification_means"
                    )}
                    variant="outlined"
                    margin="none"
                  />
                </CustomInput>
                <CustomInput
                  tooltipText={"tooltips.resources.indicators.fields.unit_id"}
                  fullWidth
                >
                  <SelectInput
                    margin="none"
                    variant="outlined"
                    fullWidth
                    source="unit_id"
                    choices={(props.helpers && props.helpers["units"]) || []}
                    validate={required()}
                    optionText={optionRenderer}
                  />
                </CustomInput>
                <CustomInput
                  tooltipText={"tooltips.resources.indicators.fields.format_id"}
                  fullWidth
                >
                  <SelectInput
                    margin="none"
                    variant="outlined"
                    fullWidth
                    source="format_id"
                    choices={(props.helpers && props.helpers["formats"]) || []}
                    validate={required()}
                    optionText={optionRenderer}
                  />
                </CustomInput>
                {/* <CustomInput
                  tooltipText={
                    "tooltips.resources.indicators.fields.frequency_id"
                  }
                  fullWidth
                >
                  <SelectInput
                    margin="none"
                    variant="outlined"
                    fullWidth
                    source="frequency_id"
                    choices={
                      (props.helpers && props.helpers["frequencies"]) || []
                    }
                    validate={required()}
                    optionText={optionRenderer}
                  />
                </CustomInput> */}
              </Fragment>
            );
          }}
        </FormDataConsumer>
      </SimpleForm>
    </Create>
  );
}

export default CreateForm;
