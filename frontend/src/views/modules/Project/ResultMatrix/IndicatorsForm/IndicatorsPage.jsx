import { groupBy } from "lodash";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { FormDataConsumer, useDataProvider } from "react-admin";
import { checkFeature } from "../../../../../helpers/checkPermission";
import { getFiscalYearsRangeForIntervals } from "../../../../../helpers/formatters";
import IndicatorList from "./IndicatorList";
import IndicatorsButton from "./IndicatorsButton";

const IndicatorsPage = (props) => {
  const [indicators, setIndicators] = useState({
    project_detail: [],
    outcome: [],
    output: [],
  });
  const dataProvider = useDataProvider();

  const handleRefresh = () => {
    dataProvider
      .getListOfAll("indicators", {
        filter: { project_detail_id: Number(props.record?.id) },
      })
      .then((res) => {
        if (res && res.data) {
          setIndicators(groupBy(res.data, "entity_type"));
        }
      });
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  if (!indicators) return null;

  const targetYears =
    props.record &&
    getFiscalYearsRangeForIntervals(
      props.record.start_date,
      props.record.end_date
    );

  return (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, handleSubmit, ...rest }) => {
        return (
          <div>
            <div>
              <h4>Goals Indicators</h4>
              <IndicatorsButton
                record={props.record}
                onSave={props.save}
                source={"indicators"}
                targetYears={targetYears}
                type={"project_detail"}
                reference={"project_detail"}
                onRefresh={handleRefresh}
              />
              <IndicatorList
                type="project_detail"
                record={props.record}
                indicators={indicators["project_detail"]}
                onSave={props.save}
                targetYears={targetYears}
                source={"indicators"}
                reference={"project_detail"}
                onRefresh={handleRefresh}
              />
            </div>
            <div>
              <h4>Outcome Indicators</h4>
              <IndicatorsButton
                record={props.record}
                onSave={props.save}
                targetYears={targetYears}
                source={"indicators"}
                type={"outcome"}
                reference={"outcomes"}
                onRefresh={handleRefresh}
              />

              <IndicatorList
                type="outcome"
                record={props.record}
                indicators={indicators["outcome"]}
                onSave={props.save}
                targetYears={targetYears}
                source={"indicators"}
                reference={"outcomes"}
                onRefresh={handleRefresh}
              />
            </div>
            <div>
              <h4>outputs Indicators</h4>
              <IndicatorsButton
                record={props.record}
                onSave={props.save}
                targetYears={targetYears}
                source={"indicators"}
                type={"output"}
                reference={"outputs"}
                onRefresh={handleRefresh}
              />
              <IndicatorList
                type="output"
                record={props.record}
                indicators={indicators["output"]}

                onSave={props.save}
                targetYears={targetYears}
                source={"indicators"}
                reference={"outputs"}
                onRefresh={handleRefresh}

              />
            </div>
          </div>
        );
      }}
    </FormDataConsumer>
  );
};

export default IndicatorsPage;
