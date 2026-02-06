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
  useRefresh,
  useTranslate,
} from "react-admin";
import { optionRenderer } from "../../../../../helpers";
import { checkFeature } from "../../../../../helpers/checkPermission";
import { getFiscalYearValue } from "../../../../../helpers/formatters";
import CustomInput from "../../../../components/CustomInput";

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
      <SaveButton {...props} onSuccess={onSaveSuccess} undoable={false} />
    </Toolbar>
  );
};
function EditForm({
  details,
  record,
  onClose,
  onRefresh,
  referencedOptions,
  ...props
}) {
  const translate = useTranslate();
  return (
    <Edit
      basePath="/indicators"
      resource="indicators"
      undoable={false}
      variant="outlined"
      redirect={false}
      record={record}
      id={record.id}
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
            if (formData) {
              formData.project_detail_id = details.id;
              formData.entity_type = props.type;

              if (props.type === "project_detail") {
                formData.entity_id = details.id;
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
                        moment(details?.baseline, "YYYY-MM-DD")
                      ).name || ""
                    }`}
                    variant="outlined"
                    margin="none"
                  />
                </CustomInput>

                {checkFeature("has_pimis_fields") && (
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

                <CustomInput
                  tooltipText={"tooltips.resources.indicators.fields.kpi"}
                  fullWidth
                >
                  <BooleanInput
                    source="has_kpi"
                    variant="outlined"
                    label="KPI"
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
