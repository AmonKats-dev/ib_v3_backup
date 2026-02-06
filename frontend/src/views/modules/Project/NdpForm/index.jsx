import React, { Fragment, useEffect, useMemo, useState } from "react";
import {
  FormDataConsumer,
  Labeled,
  ReferenceInput,
  useTranslate,
  SelectInput,
  required,
  ArrayInput,
  SimpleFormIterator,
  AutocompleteArrayInput,
  ReferenceArrayInput,
  useDataProvider,
} from "react-admin";
import { DEFAULT_SORTING } from "../../../../constants/common";
import {
  checkFeature,
  useChangeField,
} from "../../../../helpers/checkPermission";
import useCheckFeature from "../../../../hooks/useCheckFeature";

import CustomInput from "../../../components/CustomInput";
import CustomTextArea from "../../../components/CustomTextArea";
import { useFormState } from "react-final-form";
import lodash from "lodash";
import { checkRequired } from "../../../resources/Projects/validation";

function SdgAutocomplete({ scopedFormData, getSource, sdgData, formData }) {
  const [ids, setIds] = useState(scopedFormData?.ndp_sdgs_ids || []);
  const translate = useTranslate();
  const changeUpdate = useChangeField({ name: "check_update_sdg" });

  useEffect(() => {
    if (scopedFormData && scopedFormData.ndp_outcome_id) {
      if (!lodash.isEqual(scopedFormData.ndp_sdgs_ids, ids)) {
        scopedFormData.ndp_sdgs_ids = getItemsByParent(
          scopedFormData.ndp_outcome_id
        );
      }

      changeUpdate(!formData.check_update_sdg);
    }
  }, [scopedFormData?.ndp_outcome_id]);

  function getItemsByParent(parentId) {
    const filtered = lodash.filter(sdgData, (item) =>
      item.ndp_outcome_ids
        .split(",")
        .map((it) => Number(it))
        .includes(Number(parentId))
    );
    return filtered ? filtered.map((item) => item.id) : [];
  }

  return (
    <CustomInput
      fullWidth
      tooltipText={"tooltips.resources.project-details.fields.ndp_sdgs_id"}
    >
      <ReferenceArrayInput
        sort={DEFAULT_SORTING}
        label={translate("resources.project-details.fields.ndp_sdgs_id")}
        perPage={-1}
        source={getSource("ndp_sdgs_ids")}
        reference="ndp-sdgs"
        filter={{
          ndp_outcome_id: scopedFormData && scopedFormData.ndp_outcome_id,
        }}
      >
        <AutocompleteArrayInput
          optionText="name"
          margin="normal"
          variant="outlined"
          fullWidth
          shouldRenderSuggestions={true}
          autoFocus
        />
      </ReferenceArrayInput>
    </CustomInput>
  );
}
function NationalStrategyAutocomplete({
  scopedFormData,
  getSource,
  sdgData,
  formData,
}) {
  const [ids, setIds] = useState(scopedFormData?.ndp_strategy_ids || []);
  const translate = useTranslate();
  const changeUpdate = useChangeField({ name: "check_update_strategy" });

  function getItemsByParent(parentId) {
    const filtered = lodash.filter(
      sdgData,
      (item) => item.ndp_outcome_id === parentId
    );

    return filtered ? filtered.map((item) => item.id) : [];
  }

  useEffect(() => {
    if (scopedFormData && scopedFormData.ndp_outcome_id) {
      if (!lodash.isEqual(scopedFormData.ndp_strategy_ids, ids)) {
        scopedFormData.ndp_strategy_ids = getItemsByParent(
          scopedFormData.ndp_outcome_id
        );
      }

      changeUpdate(!formData.check_update_strategy);
    }
  }, [scopedFormData?.ndp_outcome_id]);

  return (
    <CustomInput
      fullWidth
      tooltipText={"tooltips.resources.project-details.fields.ndp_sdgs_id"}
    >
      <ReferenceArrayInput
        sort={DEFAULT_SORTING}
        label={translate("resources.project-details.fields.ndp_strategy_id")}
        perPage={-1}
        source={getSource("ndp_strategy_ids")}
        reference="ndp-strategies"
        filter={{
          ndp_outcome_id: scopedFormData && scopedFormData.ndp_outcome_id,
        }}
      >
        <AutocompleteArrayInput
          optionText="name"
          margin="normal"
          variant="outlined"
          fullWidth
          shouldRenderSuggestions={true}
          autoFocus
        />
      </ReferenceArrayInput>
    </CustomInput>
  );
}
function MtfAutocomplete({ scopedFormData, getSource, sdgData, formData }) {
  const translate = useTranslate();

  return (
    <CustomInput
      fullWidth
      tooltipText={"tooltips.resources.project-details.fields.ndp_mtfs_id"}
    >
      <ReferenceArrayInput
        sort={DEFAULT_SORTING}
        label={translate("resources.project-details.fields.ndp_mtf_id")}
        perPage={-1}
        source={getSource("ndp_mtfs_ids")}
        reference="ndp-mtfs"
      >
        <AutocompleteArrayInput
          optionText="name"
          margin="normal"
          variant="outlined"
          fullWidth
          shouldRenderSuggestions={true}
          autoFocus
        />
      </ReferenceArrayInput>
    </CustomInput>
  );
}
function NdpForm({ record, ...props }) {
  const [sdgData, setSdgData] = useState([]);
  const [ndpStrategies, setNdpStrategies] = useState([]);
  const formValues = useFormState().values;
  const translate = useTranslate();
  const hasDefaultArrayInputValue = useCheckFeature(
    "has_default_array_input_value"
  );
  const changeNdp = useChangeField({ name: "ndp_strategies" });
  const dataProvider = useDataProvider();

  useEffect(() => {
    if (checkFeature("has_pimis_fields") || checkFeature("has_esnip_fields"))
      dataProvider
        .getListOfAll("ndp-sdgs", { sort_field: "id" })
        .then((response) => {
          if (response && response.data) {
            setSdgData(response.data);
          }
        });
    dataProvider
      .getListOfAll("ndp-strategies", { sort_field: "id" })
      .then((response) => {
        if (response && response.data) {
          setNdpStrategies(response.data);
        }
      });
  }, []);

  useMemo(() => {
    if (hasDefaultArrayInputValue && formValues) {
      if (formValues.ndp_strategies) {
        if (formValues.ndp_strategies.length === 0) {
          changeNdp([{}]);
        }
      } else {
        changeNdp([{}]);
      }
    }
  }, [record]);

  return (
    <Fragment>
      <ArrayInput
        source="ndp_strategies"
        label={null}
        className="iterator"
        validate={checkRequired("ndp_strategies")}
      >
        <SimpleFormIterator>
          <FormDataConsumer>
            {({ getSource, scopedFormData, formData, ...rest }) => {
              return (
                <Fragment>
                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project-details.fields.ndp_goal_id"
                    }
                    fullWidth
                  >
                    <ReferenceInput
                      sort={DEFAULT_SORTING}
                      label={translate(
                        "resources.project-details.fields.ndp_goal_id"
                      )}
                      validate={checkRequired("ndp_strategies", "ndp_goal_id")}
                      perPage={-1}
                      source={getSource("ndp_goal_id")}
                      reference="ndp-goals"
                    >
                      <SelectInput
                        optionText="name"
                        margin="normal"
                        variant="outlined"
                      />
                    </ReferenceInput>
                  </CustomInput>
                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project-details.fields.ndp_outcome_id"
                    }
                    fullWidth
                  >
                    <ReferenceInput
                      label={translate(
                        "resources.project-details.fields.ndp_outcome_id"
                      )}
                      sort={DEFAULT_SORTING}
                      validate={checkRequired("ndp_strategies", "ndp_outcome_id")}
                      perPage={-1}
                      source={getSource("ndp_outcome_id")}
                      reference="ndp-outcomes"
                      filter={{
                        ndp_goal_id:
                          scopedFormData && scopedFormData.ndp_goal_id,
                      }}
                    >
                      <SelectInput
                        optionText="name"
                        margin="normal"
                        variant="outlined"
                      />
                    </ReferenceInput>
                  </CustomInput>

                  <NationalStrategyAutocomplete
                    getSource={getSource}
                    scopedFormData={scopedFormData}
                    sdgData={ndpStrategies}
                    formData={formData}
                  />

                  <SdgAutocomplete
                    getSource={getSource}
                    scopedFormData={scopedFormData}
                    sdgData={sdgData}
                    formData={formData}
                  />

                  <MtfAutocomplete
                    getSource={getSource}
                    scopedFormData={scopedFormData}
                    sdgData={sdgData}
                    formData={formData}
                  />
                </Fragment>
              );
            }}
          </FormDataConsumer>
        </SimpleFormIterator>
      </ArrayInput>
      <FormDataConsumer>
        {({ getSource, scopedFormData, formData, ...rest }) => {
          return (
            <>
              <CustomInput
                tooltipText={
                  "tooltips.resources.project-details.fields.ndp_policy_alignment"
                }
                fullWidth
                textArea
              >
                <CustomTextArea
                  validate={checkRequired("ndp_policy_alignment")}
                  label={translate(
                    "resources.project-details.fields.ndp_policy_alignment"
                  )}
                  isRequired={Boolean(checkRequired("ndp_policy_alignment"))}
                  source={"ndp_policy_alignment"}
                  formData={formData}
                  {...props}
                />
              </CustomInput>
              <CustomInput
                tooltipText={
                  "tooltips.resources.project-details.fields.ndp_compliance"
                }
                fullWidth
                textArea
              >
                <CustomTextArea
                  validate={checkRequired("ndp_compliance")}
                  label={translate(
                    "resources.project-details.fields.ndp_compliance"
                  )}
                  isRequired={Boolean(checkRequired("ndp_compliance"))}
                  source={"ndp_compliance"}
                  formData={formData}
                  {...props}
                />
              </CustomInput>
            </>
          );
        }}
      </FormDataConsumer>
    </Fragment>
  );
}

export default NdpForm;
