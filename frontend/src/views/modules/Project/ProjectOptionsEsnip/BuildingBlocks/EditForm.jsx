import React, { Fragment, Component, useState } from "react";
import {
  Labeled,
  TextInput,
  FileInput,
  FileField,
  SelectInput,
  useTranslate,
  required,
  translate,
} from "react-admin";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CustomInput from "../../../../components/CustomInput";
import CustomTextArea from "../../../../components/CustomTextArea";
import { checkFeature } from "../../../../../helpers/checkPermission";

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

function EditForm(props) {
  const [activeTab, setActiveTab] = useState(0);
  const translate = useTranslate();
  const { formData } = props;

  const option_modules = [
    {
      name: translate(
        "resources.project_options.fields.building_blocks.modules.demand_module"
      ),
      id: "demand_module",
    },
    {
      name: translate(
        "resources.project_options.fields.building_blocks.modules.technical_module"
      ),
      id: "technical_module",
    },
    {
      name: translate(
        "resources.project_options.fields.building_blocks.modules.environmental_module"
      ),
      id: "environmental_module",
    },
    {
      name: translate(
        "resources.project_options.fields.building_blocks.modules.hr_module"
      ),
      id: "hr_module",
    },
    {
      name: translate(
        "resources.project_options.fields.building_blocks.modules.legal_module"
      ),
      id: "legal_module",
    },
  ];

  function handleChange(event, newValue) {
    setActiveTab(newValue);
    // props.save(props.formValues , false);
  }

  function renderTabs() {
    return option_modules.map((module) => <Tab label={module.name} />);
  }

  function renderTabContent(activeTab) {
    const { getSource, formValues } = props;
    const optionsCount =
      props.record &&
      props.record.project_options &&
      props.record.project_options.length;

    return (
      <Fragment>
        <CustomInput
          tooltipText={`tooltips.resources.project_options.fields.building_blocks.description.${option_modules[activeTab].id}`}
          textArea
          fullWidth
        >
          <CustomTextArea
            source={getSource(`${option_modules[activeTab].id}.description`)}
            formData={formData}
            validate={required()}
            isRequired
            label={translate(
              "resources.project_options.fields.building_blocks.description"
            )}
            {...props}
          />
        </CustomInput>
        {checkFeature(
          "project_options_building_blocks_show",
          props.record.phase_id
        ) && (
          <Fragment>
            <CustomInput
              tooltipText={`tooltips.resources.project_options.fields.building_blocks.advantage.${option_modules[activeTab].id}`}
              fullWidth
              textArea
            >
              <CustomTextArea
                source={getSource(`${option_modules[activeTab].id}.advantage`)}
                formData={formData}
                validate={required()}
                isRequired
                label={translate(
                  "resources.project_options.fields.building_blocks.advantage"
                )}
                {...props}
              />
            </CustomInput>
            <CustomInput
              tooltipText={`tooltips.resources.project_options.fields.building_blocks.disadvantage.${option_modules[activeTab].id}`}
              textArea
              fullWidth
            >
              <CustomTextArea
                source={getSource(
                  `${option_modules[activeTab].id}.disadvantage`
                )}
                formData={formData}
                validate={required()}
                isRequired
                label={translate(
                  "resources.project_options.fields.building_blocks.disadvantage"
                )}
                {...props}
              />
            </CustomInput>
            <SelectInput
              style={{ margin: 10 }}
              validate={required()}
              variant="outlined"
              margin="none"
              className={"boolean-selector"}
              label={translate(
                "resources.project_options.fields.building_blocks.score"
              )}
              source={getSource(`${option_modules[activeTab].id}.score`)}
              choices={[
                { id: 0, name: "0" },
                { id: 1, name: "1" },
                { id: 2, name: "2" },
                { id: 3, name: "3" },
                { id: 4, name: "4" },
                { id: 5, name: "5" },
              ]}
            />
          </Fragment>
        )}
      </Fragment>
    );
  }

  const { record, getSource } = props;

  return (
    <div className="options-modules">
      <h5 style={{ paddingLeft: "15px", lineHeight: "45px" }}>
        {translate("resources.project_options.fields.building_blocks.title")}
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
        <TabContainer>{renderTabContent(activeTab)}</TabContainer>
      )}
      {activeTab === 1 && (
        <TabContainer>{renderTabContent(activeTab)}</TabContainer>
      )}
      {activeTab === 2 && (
        <TabContainer>{renderTabContent(activeTab)}</TabContainer>
      )}
      {activeTab === 3 && (
        <TabContainer>{renderTabContent(activeTab)}</TabContainer>
      )}
      {activeTab === 4 && (
        <TabContainer>{renderTabContent(activeTab)}</TabContainer>
      )}
    </div>
  );
}

export default EditForm;
