import React, { Fragment, useMemo } from "react";
import {
  ArrayInput,
  FormDataConsumer,
  SimpleFormIterator,
  TextInput,
  number,
  required,
  SelectInput,
  useTranslate,
  maxLength,
  ReferenceInput,
} from "react-admin";
import {
  DEFAULT_SORTING,
  FINANCIAL_PATTERN_SUBTYPE,
  FINANCIAL_PATTERN_TYPE,
  FUND_BODY_TYPES,
} from "../../../../../constants/common";
import {
  commasFormatter,
  commasParser,
  generateChoices,
} from "../../../../../helpers";
import {
  checkFeature,
  useChangeField,
} from "../../../../../helpers/checkPermission";
import CustomInput from "../../../../components/CustomInput";

import OrganisationalStructure from "../../../OrganisationalStructure";
import lodash, { find, last, uniq } from "lodash";
import { useFormState } from "react-final-form";

function EditForm({ record, ...props }) {
  const translate = useTranslate();
  const hasPimisFields = checkFeature("has_pimis_fields");
  const changeInvestments = useChangeField({ name: props.source });
  const formValues = useFormState().values;

  useMemo(() => {
    if (checkFeature("has_default_array_input_value") && formValues) {
      if (lodash.get(formValues, props.source)) {
        if (lodash.get(formValues, props.source).length === 0) {
          changeInvestments([{}]);
        }
      } else {
        changeInvestments([{}]);
      }
    }
  }, [record]);

  const selectedFundSources =
    record?.proposed_funding_source?.map((it) => it && Number(it.fund_id)) ||
    [];

  const generateFundBody = (scopedFormData) => {
    if (checkFeature("has_filtered_fund_body_type", record.phase_id))
      if (scopedFormData) {
        if (Number(scopedFormData.fund_id) === 1) {
          return generateChoices(FUND_BODY_TYPES).filter(
            (item) => item && Number(item.id) === 3
          );
        } else {
          return generateChoices(FUND_BODY_TYPES).filter((item) => {
            const selected = record?.proposed_funding_source?.filter(
              (it) =>
                it && Number(it.fund_id) === Number(scopedFormData.fund_id)
            );

            return selected?.length === 0 || !selected
              ? []
              : selected
                  .map((it) => Number(it?.fund_body_type))
                  .includes(Number(item?.id));
          });
        }
      }

    if (scopedFormData) {
      if (Number(scopedFormData.fund_id) === 1) {
        return generateChoices(FUND_BODY_TYPES).filter(
          (item) => Number(item.id) === 3
        );
      }
      if (
        Number(scopedFormData.fund_id) === 1 ||
        Number(scopedFormData.fund_id) === 2
      ) {
        return generateChoices(FUND_BODY_TYPES).filter(
          (item) => Number(item.id) === 0 || Number(item.id) === 3
        );
      }
    }
    return generateChoices(FUND_BODY_TYPES).filter(
      (item) =>
        Number(item.id) === 1 || Number(item.id) === 2 || Number(item.id) === 3
    );
  };

  return (
    <ArrayInput source={props.source} label={null} className="iterator">
      <SimpleFormIterator>
        <FormDataConsumer>
          {({ getSource, scopedFormData, formData, ...rest }) => {
            if (props.targetYears && scopedFormData) {
              if (props.type !== "components") {
                const formattedTargetYears = props.targetYears.map((year) =>
                  Number(year.id)
                );
                if (scopedFormData && scopedFormData.costs) {
                  lodash.keys(scopedFormData.costs).forEach((year) => {
                    const currYear = year.slice(0, year.length - 1);
                    if (!formattedTargetYears.includes(Number(currYear))) {
                      delete scopedFormData.costs[year];
                    }
                  });
                }
              }

              if (hasPimisFields && scopedFormData) {
                scopedFormData.financial_pattern_type = 6;
                scopedFormData.financial_pattern_subtype = 1;
              }
            }

            return (
              <Fragment>
                {!hasPimisFields && props.type !== "outputs" && (
                  <OrganisationalStructure
                    {...props}
                    source={getSource("fund_id")}
                    config="fund_config"
                    reference="funds"
                    field={getSource("fund")}
                    isRequired
                    filter={
                      checkFeature(
                        "has_filtered_fund_body_type",
                        record.phase_id
                      )
                        ? { ids: uniq([...selectedFundSources, 1]) }
                        : null
                    }
                  />
                )}
                {hasPimisFields && props.type !== "outputs" && (
                  <ReferenceInput
                    filter={
                      checkFeature(
                        "has_filtered_fund_body_type",
                        record.phase_id
                      )
                        ? { ids: uniq([...selectedFundSources, 1]) }
                        : null
                    }
                    sort={DEFAULT_SORTING}
                    perPage={-1}
                    source={getSource("fund_id")}
                    reference="funds"
                    label={translate(
                      `resources.activities.fields.investments.fields.fund_id`
                    )}
                  >
                    <SelectInput
                      options={{ fullWidth: true }}
                      fullWidth
                      optionText="name"
                      variant="outlined"
                      margin="none"
                    />
                  </ReferenceInput>
                )}
                {hasPimisFields &&
                  scopedFormData &&
                  Number(scopedFormData.fund_id) !== 1 && (
                    <CustomInput
                      fullWidth
                      tooltipText={
                        "tooltips.resources.project-details.fields.fund_body_type"
                      }
                    >
                      <SelectInput
                        options={{ fullWidth: "true" }}
                        label={translate(
                          "resources.project-details.fields.fund_body_type"
                        )}
                        source={getSource("fund_body_type")}
                        choices={generateFundBody(scopedFormData)}
                        validate={[required()]}
                        variant="outlined"
                        margin="none"
                      />
                    </CustomInput>
                  )}

                {props.type !== "outputs" && !hasPimisFields && (
                  <OrganisationalStructure
                    {...props}
                    source={getSource("costing_id")}
                    config="cost_config"
                    reference="costings"
                    field={getSource("costing")}
                    isRequired
                  />
                )}
      
                {/* {hasPimisFields && (
                  <CustomInput
                    tooltipText={"resources.investments.fields.target"}
                    fullWidth
                  >
                    <TextInput
                      label={`Total Cost (${translate("titles.currency")})`}
                      source={getSource(
                        `costs.` + String(last(props.targetYears).id) + "y"
                      )}
                      variant="outlined"
                      margin="none"
                      format={commasFormatter}
                      parse={commasParser}
                      validate={[number(), required(), maxLength(255)]}
                    />
                  </CustomInput>
                )} */}

                {//!hasPimisFields &&
                  props.targetYears &&
                  props.targetYears.map((target) => (
                    <CustomInput
                      tooltipText={"resources.investments.fields.target"}
                      fullWidth
                    >
                      <TextInput
                        label={`${
                          checkFeature("project_dates_fiscal_years")
                            ? target.name
                            : target.id
                        } (${translate("titles.currency")})`}
                        source={getSource(`costs.` + String(target.id) + "y")}
                        variant="outlined"
                        margin="none"
                        format={commasFormatter}
                        parse={commasParser}
                        validate={[number(), required(), maxLength(255)]}
                      />
                    </CustomInput>
                  ))}
              </Fragment>
            );
          }}
        </FormDataConsumer>
      </SimpleFormIterator>
    </ArrayInput>
  );
}

export default EditForm;
