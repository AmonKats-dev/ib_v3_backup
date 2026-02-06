import React, { useMemo } from "react";
import {
  FormDataConsumer,
  TextInput,
  useTranslate,
  number,
  ArrayInput,
  required,
  SimpleFormIterator,
  ReferenceInput,
  SelectInput,
} from "react-admin";
import { getFiscalYearsRangeForIntervals } from "../../../../helpers/formatters";
import OrganisationalStructure from "../../OrganisationalStructure";
import CustomInput from "../../../components/CustomInput";
import { commasFormatter, commasParser } from "../../../../helpers";
import moment from "moment";
import {
  checkFeature,
  useChangeField,
} from "../../../../helpers/checkPermission";
import { useFormState } from "react-final-form";
import lodash from "lodash";
import { DEFAULT_SORTING } from "../../../../constants/common";
import { checkRequired } from "../../../resources/Projects/validation";

function OperationMaintenanceCost({ record, ...props }) {
  const translate = useTranslate();
  const { values } = useFormState();
  const changeOMCosts = useChangeField({ name: "om_costs" });

  useMemo(() => {
    if (
      checkFeature("has_multiple_om_costs") &&
      checkFeature("has_default_array_input_value") &&
      values &&
      values.maintenance_period
    ) {
      if (lodash.get(values, "om_costs")) {
        if (lodash.get(values, "om_costs").length === 0) {
          changeOMCosts([{}]);
        }
      } else {
        changeOMCosts([{}]);
      }
    }
  }, [record]);

  if (values && !values.maintenance_period) {
    return <h5>{translate("messages.om_cost")}</h5>;
  }

  if (
    (!checkFeature("has_multiple_om_costs") && !values.om_costs) ||
    values.om_costs.length === 0
  ) {
    changeOMCosts([{}]);
  }

  return (
    <ArrayInput
      source="om_costs"
      label={translate("resources.project-details.fields.om_cost")}
    >
      <SimpleFormIterator
        disableAdd={!checkFeature("has_multiple_om_costs")}
        disableRemove={!checkFeature("has_multiple_om_costs")}
      >
        <FormDataConsumer>
          {({ getSource, scopedFormData, formData, ...rest }) => {
            const currentYear = moment(formData.end_date, "YYYY");
            const startDate = currentYear.clone().add(1, "years");
            const endDate = currentYear
              .clone()
              .add(formData.maintenance_period, "years");

            if (scopedFormData && scopedFormData.costs) {
              lodash.keys(scopedFormData.costs).forEach((year) => {
                const currYear = year.slice(0, year.length - 1);
                if (
                  Number(currYear) < Number(moment(startDate).format("YYYY")) ||
                  Number(currYear) > Number(moment(endDate).format("YYYY"))
                ) {
                  delete scopedFormData.costs[year];
                }
              });
            }

            return (
              <div>
                {formData &&
                  checkFeature(
                    "has_om_responsible_vote",
                    formData.phase_id
                  ) && (
                    <OrganisationalStructure
                      {...props}
                      source={getSource("responsible_organization_id")}
                      title={"Responsible Vote"}
                      config="organizational_config"
                      reference="organizations"
                      field={getSource("responsible_organization")}
                      level={2}
                      filter={{ level: 1 }}
                      isRequired
                    />
                  )}

                <OrganisationalStructure
                  {...props}
                  source={getSource("fund_id")}
                  config="fund_config"
                  reference="funds"
                  field={getSource("fund")}
                  isRequired
                  validate={checkRequired("om_costs", "fund_id")}
                  filter={
                    checkFeature("has_pimis_fields")
                      ? { is_donor: 0, ids: ["1"] }
                      : null
                  }
                />

                <OrganisationalStructure
                  {...props}
                  source={getSource("costing_id")}
                  config="cost_config"
                  reference="costings"
                  field={getSource("costing")}
                  isRequired
                  validate={checkRequired("om_costs", "costing_id")}
                  filter={
                    checkFeature("has_pimis_fields")
                      ? { is_om_applicable: 1 }
                      : null
                  }
                />

                {formData &&
                  getFiscalYearsRangeForIntervals(startDate, endDate).map(
                    (year) => {
                      return (
                        <CustomInput
                          tooltipText={"tooltips.resources.om_costs.om_years"}
                          fullWidth
                        >
                          <TextInput
                            label={`${year.name} (${translate(
                              "titles.currency"
                            )})`}
                            source={getSource("costs." + String(year.id) + "y")}
                            resource={formData}
                            validate={[number(), required()]}
                            format={commasFormatter}
                            parse={commasParser}
                            variant="outlined"
                            margin="none"
                          />
                        </CustomInput>
                      );
                    }
                  )}
              </div>
            );
          }}
        </FormDataConsumer>
      </SimpleFormIterator>
    </ArrayInput>
  );
}

export default OperationMaintenanceCost;
