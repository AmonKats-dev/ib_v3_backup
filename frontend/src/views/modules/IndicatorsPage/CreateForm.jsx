import moment from "moment";
import React, { Fragment } from "react";
import {
  BooleanInput,
  Button,
  Create,
  FormDataConsumer,
  maxLength,
  required,
  SaveButton,
  SelectInput,
  SimpleForm,
  TextInput,
  Toolbar,
  useNotify,
  useTranslate,
} from "react-admin";
import { optionRenderer } from "../../../helpers";
import { getFiscalYearValue } from "../../../helpers/formatters";
import CustomInput from "../../components/CustomInput";
import IntermediaryTargets from "./IntermediaryTargets";

export const FREQUENCIES = [
  { id: "", name: "None" },
  { id: 1, name: "Quarterly" },
  { id: 2, name: "Semi-Annually" },
  { id: 3, name: "Annually" },
];

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
  ...props
}) {
  const translate = useTranslate();

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
              formData.project_detail_id = record.id;
              formData.entity_type = props.type;

              if (props.type === "project_detail") {
                formData.entity_id = record.id;
              }
            }

            const label = props.type === "outcome" ? "Outcome" : "Output";

            return (
              <Fragment>
                {props.type !== "project_detail" && (
                  <SelectInput
                    margin="none"
                    variant="outlined"
                    fullWidth
                    source="entity_id"
                    choices={referencedOptions}
                    validate={required()}
                    optionText={optionRenderer}
                    label={label}
                  />
                )}

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
                        moment(props.details?.baseline, "YYYY-MM-DD")
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
                <CustomInput
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
                    choices={FREQUENCIES}
                    optionText={optionRenderer}
                  />
                </CustomInput>

                {formData && formData.frequency_id && (
                  <IntermediaryTargets
                    frequency={formData?.frequency_id}
                    years={props.targetYears}
                    isEdit
                  />
                )}

                <CustomInput
                  tooltipText={"tooltips.resources.indicators.fields.kpi"}
                  fullWidth
                >
                  <BooleanInput
                    source="has_kpi"
                    label="KPI"
                    variant="outlined"
                    margin="none"
                  />
                </CustomInput>
              </Fragment>
            );
          }}
        </FormDataConsumer>
      </SimpleForm>
    </Create>
  );
}

export default CreateForm;
