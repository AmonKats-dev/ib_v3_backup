import { groupBy } from "lodash";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { FormDataConsumer, useDataProvider } from "react-admin";
import { checkFeature } from "../../../../../helpers/checkPermission";
import { getFiscalYearsRangeForIntervals } from "../../../../../helpers/formatters";
import IndicatorList from "./IndicatorList";
import IndicatorsButton from "./IndicatorsButton";

const IndicatorsForm = (props) => {
  const details = props.record;

  const [helpers, setHelpers] = useState({
    units: [],
    formats: [],
    frequencies: [],
  });
  const [indicators, setIndicators] = useState({
    project_detail: [],
    outcome: [],
    output: [],
  });
  const dataProvider = useDataProvider();

  useEffect(() => {
    dataProvider.getListOfAll("formats", {}).then((res) => {
      if (res && res.data) {
        setHelpers((prev) => ({ ...prev, formats: res.data }));
      }
    });
    dataProvider.getListOfAll("frequencies", {}).then((res) => {
      if (res && res.data) {
        setHelpers((prev) => ({ ...prev, frequencies: res.data }));
      }
    });
    dataProvider.getListOfAll("units", {}).then((res) => {
      if (res && res.data) {
        setHelpers((prev) => ({ ...prev, units: res.data }));
      }
    });
  }, []);

  const handleRefresh = (id) => {
    if (details)
      dataProvider
        .getListOfAll("indicators", {
          filter: { project_detail_id: Number(details?.id || id) },
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "50px",
                }}
              >
                <h2>Project Indicators</h2>
                <IndicatorsButton
                  record={props.record}
                  source={"indicators"}
                  targetYears={targetYears}
                  type={"project_detail"}
                  reference={"project_detail"}
                  onRefresh={handleRefresh}
                  helpers={helpers}
                  details={details}
                  referencedOptions={details["outcomes"]}
                />
              </div>

              <IndicatorList
                type="project_detail"
                record={props.record}
                indicators={indicators["project_detail"]}
                targetYears={targetYears}
                source={"indicators"}
                reference={"project_detail"}
                onRefresh={handleRefresh}
                helpers={helpers}
                details={details}
              />
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "50px",
                }}
              >
                <h2>Outcome Indicators</h2>
                <IndicatorsButton
                  record={props.record}
                  targetYears={targetYears}
                  source={"indicators"}
                  type={"outcome"}
                  reference={"outcomes"}
                  onRefresh={handleRefresh}
                  helpers={helpers}
                  details={details}
                  referencedOptions={details["outcomes"]}
                />
              </div>

              <IndicatorList
                type="outcome"
                record={props.record}
                indicators={indicators["outcome"]}
                targetYears={targetYears}
                source={"indicators"}
                reference={"outcomes"}
                onRefresh={handleRefresh}
                helpers={helpers}
                details={details}
              />
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "50px",
                }}
              >
                <h2>Outputs Indicators</h2>
                <IndicatorsButton
                  record={props.record}
                  targetYears={targetYears}
                  source={"indicators"}
                  type={"output"}
                  reference={"outputs"}
                  onRefresh={handleRefresh}
                  helpers={helpers}
                  details={details}
                  referencedOptions={details["outputs"]}
                />
              </div>
              <IndicatorList
                type="output"
                record={props.record}
                indicators={indicators["output"]}
                targetYears={targetYears}
                source={"indicators"}
                reference={"outputs"}
                onRefresh={handleRefresh}
                helpers={helpers}
                details={details}
              />
            </div>
          </div>
        );
      }}
    </FormDataConsumer>
  );
};

export default IndicatorsForm;
