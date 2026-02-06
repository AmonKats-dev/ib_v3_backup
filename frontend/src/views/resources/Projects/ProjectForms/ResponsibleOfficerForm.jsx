import React, { Fragment, useEffect, useMemo } from "react";
import ResponsibleOfficer from "../../../modules/Project/ResponsibleOfficer";
import { FormDataConsumer } from "react-admin";
import {
  checkFeature,
  useChangeField,
} from "../../../../helpers/checkPermission";

function ResponsibleOfficerForm({ record, ...props }) {
  const hasPimisFields = checkFeature("has_pimis_fields");
  const hasCoordinator = checkFeature(
    "project_responsible_officer_has_coordinator"
  );
  const hasMultipleOfficers = checkFeature(
    "project_responsible_officer_multiple"
  );
  const hasDefaultPhoneCode = checkFeature(
    "project_responsible_officer_default_phone_code"
  );
  const hasDefaultArrayInputValue = checkFeature(
    "has_default_array_input_value"
  );
  const changeOfficers = useChangeField({ name: "responsible_officers" });

  useMemo(() => {
    if (
      (hasMultipleOfficers || hasDefaultArrayInputValue) &&
      ((record &&
        record.responsible_officers &&
        record.responsible_officers.length === 0) ||
        !record?.responsible_officers)
    ) {
      changeOfficers([{}]);
    }
    if (hasCoordinator && record && (record.responsible_officers?.length ?? 0) === 0) {
      changeOfficers([
        { title: "" },
        {
          title: "Project Coordinator / Manager",
        },
      ]);
    }
  }, [record]);

  //FEATURE: project has multiple responcible officers

  return (
    <Fragment>
      <FormDataConsumer>
        {({ getSource, scopedFormData, formData, ...rest }) => {
          // if (hasMultipleOfficers && (!formData.responsible_officers || formData.responsible_officers.length === 0)) {
          //   formData.responsible_officers[0] = {};
          // }
          // if (hasCoordinator && formData && !formData.responsible_officers[1]) {
          //   formData.responsible_officers[1] = {
          //     title: "Project Coordinator / Manager",
          //   };
          // }

          return (
            <ResponsibleOfficer
              multiple={hasMultipleOfficers}
              hasDefaultPhoneCode={hasDefaultPhoneCode}
              hasPimisFields={hasPimisFields}
              {...props}
            />
          );
        }}
      </FormDataConsumer>
    </Fragment>
  );
}

export default ResponsibleOfficerForm;
