import { faLaptopHouse } from "@fortawesome/free-solid-svg-icons";
import lodash from "lodash";
import moment from "moment";
import React, { Fragment } from "react";
import {
  BooleanInput,
  Button,
  Create,
  Edit,
  FormDataConsumer,
  maxLength,
  ReferenceInput,
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
import { checkFeature } from "../../../helpers/checkPermission";
import {
  getFiscalYearValue,
  getIndicatorsYears,
} from "../../../helpers/formatters";
import CustomInput from "../../components/CustomInput";
import CustomToolbar from "../../components/CustomToolbar";
import { FREQUENCIES } from "./CreateForm";
import IntermediaryTargets from "./IntermediaryTargets";

const FormToolbar = ({ onSaveSuccess, onClose, ...props }) => {
  return (
    <Toolbar style={{ width: "100%" }}>
      <Button
        onClick={onClose}
        label="Cancel"
        style={{ marginRight: 5, padding: "7px 15px" }}
        color="primary"
        variant="contained"
      />
      <SaveButton {...props} onSuccess={onSaveSuccess} />
    </Toolbar>
  );
};

function EditForm({
  record,
  onClose,
  isReadOly,
  onRefresh,
  referencedOptions,
  ...props
}) {
  const translate = useTranslate();
  return (
    <Edit
      basePath="/indicators"
      resource="indicators"
      record={record}
      id={record.id}
      redirect={false}
      undoable={false}
    >
      <SimpleForm
        undoable={false}
        variant="outlined"
        redirect={false}
        toolbar={
          <FormToolbar
            onSaveSuccess={() => {
              onRefresh();
              onClose();
            }}
            onClose={onClose}
          />
        }
      >
        <FormDataConsumer>
          {({ getSource, scopedFormData, formData, ...rest }) => {
            const label = props.type === "outcome" ? "Outcome" : "Output";
            const lastYear =
              props.targetYears &&
              props.targetYears[props.targetYears.length - 1];

            const targetSource = lastYear && `targets.${String(lastYear.id)}y`

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
                    disabled={isReadOly}
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
                    disabled={isReadOly}
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
                    disabled={isReadOly}
                  />
                </CustomInput>
                {targetSource && (
                  <CustomInput
                    tooltipText={"resources.indicators.fields.target"}
                    fullWidth
                  >
                    <TextInput
                      validate={[required(), maxLength(255)]}
                      label="End of Project Target"
                      source={'targets.project'}
                      variant="outlined"
                      margin="none"
                      disabled={isReadOly}
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
                    onChange={() => {
                      if (scopedFormData) {
                        scopedFormData.intermediary_targets = null;
                      }
                    }}
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
    </Edit>
  );
}

export default EditForm;
