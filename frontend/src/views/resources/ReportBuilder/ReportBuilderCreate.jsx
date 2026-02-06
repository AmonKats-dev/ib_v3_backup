import React from "react";
import {
  Create,
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

const ReportBuilderCreate = (props) => {
  const checkPermission = useCheckPermissions();
  return (
    <Create {...props} undoable={false}>
      <SimpleForm redirect="list" toolbar={<CustomToolbar />}>
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
                style={{ width: "20%" }}
              />
            )}{" "}
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
    </Create>
  );
};

export default ReportBuilderCreate;
