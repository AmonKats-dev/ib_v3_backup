import React from "react";
import {
  Edit,
  required,
  SimpleForm,
  TextInput,
  FormDataConsumer,
  BooleanInput,
} from "react-admin";
import {
  checkFeature,
  useCheckPermissions,
} from "../../../helpers/checkPermission";
import CustomToolbar from "../../components/CustomToolbar";
import ReportBuilder from "../../pages/ReportBuilder";

const ReportBuilderEdit = (props) => {
  const checkPermission = useCheckPermissions();
  return (
    <Edit {...props} actions={false} undoable={false}>
      <SimpleForm toolbar={<CustomToolbar />}>
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <TextInput
            source="name"
            validate={required()}
            variant="outlined"
            margin="none"
            fullWidth
            style={{ marginRight: "25px", width: "80%" }}
          />
          {checkPermission("save_public_custom_report") &&
            checkFeature("has_public_custom_report") && (
              <BooleanInput
                source="is_public"
                variant="outlined"
                margin="none"
              />
            )}
        </div>

        <FormDataConsumer>
          {({ getSource, scopedFormData, formData, ...rest }) => {
            return (
              <ReportBuilder
                {...props}
                initialParams={formData && formData.config}
              />
            );
          }}
        </FormDataConsumer>
      </SimpleForm>
    </Edit>
  );
};

export default ReportBuilderEdit;
