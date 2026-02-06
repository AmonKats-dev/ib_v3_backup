import { Card, IconButton } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDataProvider, useRefresh } from "react-admin";
import { getFiscalYearsRangeForIntervals } from "../../../../helpers/formatters";
import IndicatorList from "./IndicatorList";
import IndicatorsButton from "./IndicatorsButton";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import { getTargetYearsFromSignedDate } from "../helpers";
import { useCheckPermissions } from "../../../../helpers/checkPermission";

const Subindicators = ({ record, ...props }) => {
  const [helpers, setHelpers] = useState({
    units: [],
    formats: [],
    frequencies: [],
    disaggregationTypes: [],
  });
  const [projectDetails, setProjectDetails] = useState(null);
  const dataProvider = useDataProvider();
  const refresh = useRefresh();
  const checkPermissions = useCheckPermissions();

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
    dataProvider.getListOfAll("disaggregation-types", {}).then((res) => {
      if (res && res.data) {
        setHelpers((prev) => ({ ...prev, disaggregationTypes: res.data }));
      }
    });
  }, []);

  useEffect(() => {
    if (record && record.project_detail_id && !projectDetails)
      dataProvider
        .getOne("project-details", {
          id: record.project_detail_id,
        })
        .then((resp) => {
          if (resp && resp.data) {
            setProjectDetails(resp.data);
          }
        });
  }, [dataProvider, projectDetails, record]);

  const targetYears = getTargetYearsFromSignedDate(projectDetails);

  return (
    <Card style={{ padding: "25px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        <h2>Sub-Indicators</h2>
        <div>
          <IndicatorsButton
            projectDetails={projectDetails}
            source={"indicators"}
            targetYears={targetYears}
            type={"indicators"}
            reference={"indicator"}
            onRefresh={refresh}
            helpers={helpers}
            record={record}
          />
          {checkPermissions("edit_indicators") && (
            <IconButton
              href={`/#/achieve-sub-targets/${record?.id}`}
              title="Achieved Targets"
            >
              <TrendingUpIcon color="primary" />
            </IconButton>
          )}
        </div>
      </div>
      <IndicatorList
        type="indicators"
        record={projectDetails}
        indicators={record?.subindicators}
        targetYears={targetYears}
        source={"indicators"}
        reference={"indicator"}
        onRefresh={refresh}
        helpers={helpers}
      />
    </Card>
  );
};

export default Subindicators;
