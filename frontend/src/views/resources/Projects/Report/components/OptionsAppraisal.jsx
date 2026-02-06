import React from "react";
import HTML2React from "html2react";
import {
  FinancialEvaluation,
  EconomicalEvaluation,
  StakeHolders,
  RiskManagement,
} from "./Options";
import { useTranslate } from "react-admin";
import { romanize } from "../../../../../helpers/formatters";
import { parseQueryToValues } from "../../../../../helpers/dataHelpers";
import lodash from "lodash";

export const OptionsAppraisal = (props) => {
  const translate = useTranslate();

  const { customRecord } = props;
  const counter = Number(props.counter);
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
  const formattedRecord = customRecord//parseQueryToValues(lodash.cloneDeep(customRecord));
  const { project_options } = formattedRecord;

  
  if (!customRecord || !project_options) {
    return null;
  }

  return (
    <div className="Section2">
      <div className="content-area">
        {project_options.map((option) =>
          option_modules.map((modul, idx) => {
            const currentBlock = lodash.find(
              option.building_blocks,
              (block) => block.module_type === modul.id.toUpperCase()
            );
            
            return (
              <div className="content-area">
                <h2>
                  {romanize(counter + idx)}. {modul.name}
                </h2>
                {currentBlock ? (
                  <div>
                    <p className="content-area_subtitle">
                      {translate("printForm.options.description")}:
                    </p>
                    {HTML2React(currentBlock.description)}
                  </div>
                ) : (
                  <div>
                    <p className="content-area_subtitle">
                      {translate("printForm.options.description")}:
                    </p>
                    {"-"}
                  </div>
                )}
              </div>
            );
          })
        )}
        <FinancialEvaluation
          subCounter={Number(counter) + option_modules.length}
          {...props}
        />
        <EconomicalEvaluation
          subCounter={Number(counter) + option_modules.length + 1}
          {...props}
        />
        <StakeHolders
          subCounter={Number(counter) + option_modules.length + 2}
          {...props}
        />
        <RiskManagement
          subCounter={Number(counter) + option_modules.length + 3}
          {...props}
        />
      </div>
    </div>
  );
};
