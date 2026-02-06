import React, { useMemo } from "react";
import {
  ArrayInput,
  FormDataConsumer,
  SimpleFormIterator,
  useTranslate,
} from "react-admin";
import { useFormState } from "react-final-form";
import { useSelector } from "react-redux";
import { useChangeField } from "../../../../helpers/checkPermission";
import OrganisationalStructure from "../../OrganisationalStructure";

function ExecutingAgencies(props) {
  const translate = useTranslate();
  const formValues = useFormState().values;
  const { record } = props;
  const userInfo = useSelector((state) => state.user.userInfo);

  const changeAgencies = useChangeField({ name: "executing_agencies" });

  useMemo(() => {
    if (
      formValues?.executing_agencies &&
      formValues?.executing_agencies.length > 0
    ) {
      const hasDefault =
        formValues?.executing_agencies.filter(
          (item) => item?.organization_id === userInfo?.organization?.id
        ).length > 0;
      if (!hasDefault) {
        changeAgencies([
          {
            organization_id: userInfo?.organization?.id,
            organization: userInfo?.organization,
          },
          ...formValues?.executing_agencies,
        ]);
      }
    } else {
      changeAgencies([
        {
          organization_id: userInfo?.organization?.id,
          organization: userInfo?.organization,
        },
      ]);
    }
  }, [record]);

  if (!record || (record && !record.phase_id)) return null;

  return (
    <>
      <h3>
        {translate("resources.project-details.fields.executing_agencies")}
      </h3>
      <p style={{ marginBottom: 0 }}>
        User`s Organization:{" "}
        <b>
          {userInfo?.organization?.code} - {userInfo?.organization?.name}
        </b>
      </p>

      <ArrayInput source={"executing_agencies"} label={false}>
        <SimpleFormIterator>
          <FormDataConsumer>
            {({ formData, scopedFormData, getSource, ...rest }) => {
              return (
                <OrganisationalStructure
                  {...props}
                  source={getSource("organization_id")}
                  title="Executing Agencies"
                  config="organizational_config"
                  reference="organizations"
                  field={getSource("organization")}
                  level={4}
                />
              );
            }}
          </FormDataConsumer>
        </SimpleFormIterator>
      </ArrayInput>
    </>
  );
}

export default ExecutingAgencies;
