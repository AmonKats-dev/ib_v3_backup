import {
  number,
  required,
  useTranslate,
  ArrayInput,
  FormDataConsumer,
  SimpleFormIterator,
} from "react-admin";
import React, { Component, Fragment } from "react";

import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import { useState } from "react";
import FinancialEvaluation from "./FinancialEvaluation";
import EconomicalEvaluation from "./EconomicalEvaluation";
import Stakeholders from "./Stakeholders";
import Risks from "./Risks";
import { checkFeature } from "../../../../../helpers/checkPermission";
import CustomFormIterator from "../../../../components/CustomFormIterator";

const validateStock = [number()];

function TabContainer({ children }) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

function AnalyticalBlocks(props) {
  const [activeTab, setActiveTab] = useState(0);
  const translate = useTranslate();

  const option_modules = [
    {
      name: translate(
        "resources.project_options.fields.analytical_modules.modules.financial"
      ),
      id: "financial",
    },
    {
      name: translate(
        "resources.project_options.fields.analytical_modules.modules.economic"
      ),
      id: "economic",
    },
    {
      name: translate(
        "resources.project_options.fields.analytical_modules.modules.distributional"
      ),
      id: "distributional",
    },
  ];

  function handleChange(event, newValue) {
    setActiveTab(newValue);
    // props.save(props.formValues , false);
  }

  function renderTabContent(value, props) {
    switch (value) {
      case 0:
        return <FinancialEvaluation {...props} />;
      case 1:
        return <EconomicalEvaluation {...props} />;
      case 2:
        return <Stakeholders {...props} />;
      default:
        return null;
    }
  }

  function renderTabs() {
    return option_modules.map((module) => <Tab label={module.name} />);
  }

  return (
    <ArrayInput source="project_options" label={null} className="iterator">
      <CustomFormIterator
        prefix={"Option"}
        disableAdd={
          props.activeStep !== 0 ||
          checkFeature(
            "project_options_disable_change",
            Number(props.record.phase_id)
          )
        }
        disableRemove={
          props.activeStep > 1 ||
          checkFeature(
            "project_options_disable_change",
            Number(props.record.phase_id)
          )
        }
      >
        <FormDataConsumer>
          {(formProps) => {
            return formProps.scopedFormData &&
              formProps.scopedFormData.is_shortlisted ? (
              <Fragment>
                <Typography variant="h4">
                  <b>
                    {formProps.scopedFormData && formProps.scopedFormData.name}
                  </b>
                </Typography>
                <br />
                <h5>
                  {translate(
                    "resources.project_options.fields.analytical_modules.title"
                  )}
                </h5>
                <Tabs
                  value={activeTab}
                  onChange={handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant={null}
                >
                  {renderTabs()}
                </Tabs>
                {activeTab === 0 && (
                  <TabContainer>
                    {renderTabContent(activeTab, formProps)}
                  </TabContainer>
                )}
                {activeTab === 1 && (
                  <TabContainer>
                    {renderTabContent(activeTab, formProps)}
                  </TabContainer>
                )}
                {activeTab === 2 && (
                  <TabContainer>
                    {renderTabContent(activeTab, formProps)}
                  </TabContainer>
                )}
                {activeTab === 3 && (
                  <TabContainer>
                    {renderTabContent(activeTab, formProps)}
                  </TabContainer>
                )}
              </Fragment>
            ) : null;
          }}
        </FormDataConsumer>
      </CustomFormIterator>
    </ArrayInput>
  );
}

//TODO CustomFormIterator find refactor

export default AnalyticalBlocks;
