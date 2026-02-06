import React, { useEffect, useMemo, useRef } from "react";
import {
  ArrayInput,
  FormDataConsumer,
  ReferenceInput,
  required,
  SelectInput,
  SimpleFormIterator,
  useTranslate,
} from "react-admin";
import {
  checkFeature,
  useChangeField,
} from "../../../../helpers/checkPermission";
import useCheckFeature from "../../../../hooks/useCheckFeature";
import OrganisationalStructure from "../../OrganisationalStructure";
import { useFormState } from "react-final-form";
import CustomInput from "../../../components/CustomInput";
import { DEFAULT_SORTING } from "../../../../constants/common";

function ImplementingAgencies(props) {
  const translate = useTranslate();
  const formValues = useFormState().values;
  const { record, initialRecord, fromCreate } = props;
  const hasMultipleImplementingAgencies = useCheckFeature(
    "project_implementing_agencies_multiple"
  );
  const hasDefaultArrayInputValue = useCheckFeature(
    "has_default_array_input_value"
  );
  const changeAgencies = useChangeField({ name: "implementing_agencies" });

  // When saved data exists on the record but form is empty (e.g. after load),
  // push implementing_agencies into the form once. Never run after user has
  // entered data so that clicking ADD does not clear the current row.
  const hasSyncedRef = useRef(false);
  // Reset sync ref when opening a different project detail so saved values display.
  const prevInitialRecordIdRef = useRef(initialRecord?.id);
  useEffect(() => {
    if (prevInitialRecordIdRef.current !== initialRecord?.id) {
      prevInitialRecordIdRef.current = initialRecord?.id;
      hasSyncedRef.current = false;
    }
  }, [initialRecord?.id]);
  const savedCount =
    initialRecord?.implementing_agencies?.length ?? 0;
  const formCount =
    formValues?.implementing_agencies?.length ?? 0;
  useEffect(() => {
    if (
      !hasSyncedRef.current &&
      savedCount > 0 &&
      formCount === 0 &&
      initialRecord?.implementing_agencies
    ) {
      changeAgencies(initialRecord.implementing_agencies);
      hasSyncedRef.current = true;
    }
  }, [savedCount, formCount, initialRecord?.implementing_agencies, initialRecord?.id]);

  // Only initialize with one empty row when array is empty on initial load.
  // Don't overwrite when user has added rows (e.g. after clicking ADD).
  // Upon project creation (fromCreate), always show one empty field ready for input.
  const initialEmptyRef = useRef(false);
  useMemo(() => {
    const isEmpty =
      formValues &&
      formValues.implementing_agencies &&
      formValues.implementing_agencies.length === 0;
    const shouldAddOne =
      isEmpty &&
      (!initialEmptyRef.current &&
        ((fromCreate && !savedCount) ||
          (!hasMultipleImplementingAgencies || hasDefaultArrayInputValue)));
    if (shouldAddOne) {
      changeAgencies([{}]);
      initialEmptyRef.current = true;
    } else if (formValues?.implementing_agencies?.length > 0) {
      initialEmptyRef.current = true;
    }
  }, [record, fromCreate, savedCount]);

  if (!record) return null;
  if (!record.phase_id && !props.isNewProject) return null;

  //FEATURE: project has multiple implementing agencies
  return (
    <ArrayInput
      source={"implementing_agencies"}
      label={translate(
        "resources.project-details.fields.implementing_agencies"
      )}
    >
      <SimpleFormIterator
        disableAdd={!hasMultipleImplementingAgencies}
        disableRemove={!hasMultipleImplementingAgencies}
      >
        <FormDataConsumer>
          {({ formData, scopedFormData, getSource, ...rest }) => {
            return checkFeature("has_pimis_fields") ? (
                <OrganisationalStructure
                  {...props}
                  source={getSource("organization_id")}
                  title="Implementing Agencies"
                  config="organizational_config"
                  reference="organizations"
                  field={getSource("organization")}
                  level={4}
                />
            ) : (
              <OrganisationalStructure
                {...props}
                source={getSource("organization_id")}
                title="Implementing Agencies"
                config="organizational_config"
                reference="organizations"
                field={getSource("organization")}
                level={checkFeature("has_esnip_fields") ? 4 : 2}
              />
            );
          }}
        </FormDataConsumer>
      </SimpleFormIterator>
    </ArrayInput>
  );
}

export default ImplementingAgencies;
