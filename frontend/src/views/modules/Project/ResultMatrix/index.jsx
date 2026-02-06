import React, { Fragment, useState } from "react";
import {
  FormDataConsumer,
  useTranslate,
  required,
  SelectInput,
} from "react-admin";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";

import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import CustomInput from "../../../components/CustomInput";
import { useEffect } from "react";
import {
  getFiscalYears,
  getFiscalYearsBaseline,
} from "../../../../helpers/formatters";
import Goals from "./Goals";
import Outcomes from "./Outcomes";
import Outputs from "./Outputs";
import Activities from "./Activities";

import { useFormState } from "react-final-form";
import { checkFeature } from "../../../../helpers/checkPermission";
import IndicatorsForm from "./IndicatorsForm";

const iconStyle = {
  marginRight: "10px",
};

function TabContainer({ children }) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

function ResultMatrix(props) {
  const translate = useTranslate();
  const { values } = useFormState();

  const handleChange = (event, newValue) => {
    props.setMatrixStep(newValue);
    props.save(values, false);
  };

  function renderTabContent(value) {
    if (checkFeature("has_pimis_fields")){
      switch (value) {
        case 0:
          return <Goals {...props} />;
        case 1:
          return <Outcomes {...props} />;
        case 2:
          return <Outputs {...props} />;
        case 3:
          return <IndicatorsForm {...props} />;
        case 4:
          return <Activities {...props} />;
        default:
          return <Goals {...props} />;
      }
    }

    switch (value) {
      case 0:
        return <Goals {...props} />;
      case 1:
        return <Outcomes {...props} />;
      case 2:
        return <Outputs {...props} />;
      case 3:
        return <Activities {...props} />;
      default:
        return <Goals {...props} />;
    }
  }

  const renderActiveTabLoading = (tabId) => {
    const iconLoading =
      props.loading == false ? null : (
        <CircularProgress style={iconStyle} size={25} thickness={2} />
      );

    if (tabId === props.matrixStep) {
      return iconLoading;
    }

    return null;
  };

  return (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, ...rest }) => {
        return (
          <Fragment>
            {formData &&
              checkFeature(
                "project_result_matrix_baseline_show",
                formData.phase_id
              ) && (
                <CustomInput
                  tooltipText={
                    "tooltips.resources.project-details.fields.baseline"
                  }
                  fullWidth
                >
                  <SelectInput
                    options={{ fullWidth: "true" }}
                    label={translate(
                      "resources.project-details.fields.baseline"
                    )}
                    source="baseline"
                    choices={getFiscalYearsBaseline()}
                    variant="outlined"
                    margin="none"
                    validate={required()}
                  />
                </CustomInput>
              )}
            <br />
            <Tabs
              value={props.matrixStep}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant={null}
            >
              <Tab
                label={
                  <span>
                    {renderActiveTabLoading(0)}
                    {translate("resources.project-details.fields.goals", {
                      smart_count: 2,
                    })}
                  </span>
                }
              />
              <Tab
                label={
                  <span>
                    {renderActiveTabLoading(1)}
                    {translate("resources.outcomes.name", {
                      smart_count: 2,
                    })}
                  </span>
                }
              />
              <Tab
                label={
                  <span>
                    {renderActiveTabLoading(2)}
                    {translate("resources.outputs.name", {
                      smart_count: 2,
                    })}
                  </span>
                }
              />

              {checkFeature("has_pimis_fields") && (
                <Tab
                  label={
                    <span>
                      {renderActiveTabLoading(3)}
                      {translate("resources.indicators.name", {
                        smart_count: 2,
                      })}
                    </span>
                  }
                />
              )}

              {formData &&
                checkFeature(
                  "project_result_matrix_activity_show",
                  formData.phase_id
                ) && (
                  <Tab
                    label={
                      <span>
                        {renderActiveTabLoading(4)}
                        {translate("resources.activities.name", {
                          smart_count: 2,
                        })}
                      </span>
                    }
                  />
                )}
            </Tabs>
            <TabContainer>{renderTabContent(props.matrixStep)}</TabContainer>
          </Fragment>
        );
      }}
    </FormDataConsumer>
  );
}

const mapStateToProps = (state) => ({
  loading: state.admin.loading,
});

export default connect(mapStateToProps, null)(ResultMatrix);
