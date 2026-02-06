import { faLaptopHouse } from "@fortawesome/free-solid-svg-icons";
import lodash from "lodash";
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
import { optionRenderer } from "../../../../helpers";
import { getIndicatorsYears } from "../../../../helpers/formatters";
import CustomInput from "../../../components/CustomInput";

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

function EditForm({ record, onClose, onRefresh, referencedOptions, ...props }) {
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
            const lastYear =
              props.targetYears &&
              props.targetYears[props.targetYears.length - 1];

            const targetSource = scopedFormData?.[
              `targets.${String(lastYear.id)}`
            ]
              ? `targets.${String(lastYear.id)}`
              : `targets.${String(lastYear.id)}y`;
            console.log(targetSource, "targetSource");
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
                    )} - ${getIndicatorsYears(formData.baseline).name || "-"}`}
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
                        source={'targets.project'}
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
    </Edit>
  );
}

export default EditForm;
