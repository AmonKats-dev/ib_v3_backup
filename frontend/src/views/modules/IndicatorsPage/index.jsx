import {
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@material-ui/core";
import { groupBy } from "lodash";
import React, { useEffect, useState } from "react";
import { Button, LoadingIndicator, useDataProvider } from "react-admin";
import { setBreadCrumps } from "../../../actions/ui";
import { getFiscalYearsRangeForIntervals } from "../../../helpers/formatters";
import { ProjectInformation } from "../../resources/Projects/Report/components/ProjectInformation";
import IndicatorList from "./IndicatorList";
import IndicatorsButton from "./IndicatorsButton";
import { useDispatch, useSelector } from "react-redux";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import SettingsIcon from "@material-ui/icons/Settings";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import InfoIcon from "@material-ui/icons/Info";
import PostAdd from "@material-ui/icons/PostAdd";
import { getTargetYearsFromSignedDate } from "./helpers";
import { useCheckPermissions } from "../../../helpers/checkPermission";

const IndicatorsPage = (props) => {
  const [showDetails, setShowDetails] = React.useState(false);
  const [sectors, setSectors] = React.useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [helpers, setHelpers] = useState({
    units: [],
    formats: [],
    frequencies: [],
    disaggregationTypes: [],
  });
  const [projectDetails, setProjectDetails] = useState(null);
  const [project, setProject] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [indicators, setIndicators] = useState({
    project_detail: [],
    outcome: [],
    output: [],
  });
  const dataProvider = useDataProvider();
  const dispatch = useDispatch();
  const checkPermissions = useCheckPermissions();

  useEffect(() => {
    if (project?.name)
      dispatch({
        type: "SET_PROJECT_TITLE_HEADER",
        payload: {
          data: `${project?.name}`,
        },
      });

    return () => {
      dispatch({
        type: "SET_PROJECT_TITLE_HEADER",
        payload: {
          data: "",
        },
      });
    };
  }, [dispatch, project]);

  useEffect(() => {
    dispatch(
      setBreadCrumps([
        {
          to: `/reports-indicators-projects`,
          title: "Indicators",
        },
        { to: "", title: "Project Indicators" },
      ])
    );

    return () => {
      dispatch(setBreadCrumps([]));
    };
  }, [dispatch]);

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
    dataProvider
      .getListOfAll("sectors", {
        sort_field: "id",
      })
      .then((response) => {
        if (response && response.data) {
          setSectors(response.data);
        }
      });
  }, []);

  const handleRefresh = (id) => {
    dataProvider
      .getListOfAll("indicators", {
        filter: { project_detail_id: Number(projectDetails?.id || id) },
      })
      .then((res) => {
        if (res && res.data) {
          setIndicators(groupBy(res.data, "entity_type"));
        }
      });
  };

  useEffect(() => {
    dataProvider
      .getOne("projects", {
        id: props.match.params?.projectId,
      })
      .then((res) => {
        if (res && res.data) {
          setProject(res.data);
          if (res.data?.current_project_detail?.id) {
            dataProvider
              .getOne("project-details", {
                id: res.data?.current_project_detail?.id,
              })
              .then((resp) => {
                if (resp && resp.data) {
                  setProjectDetails(resp.data);
                  dataProvider
                    .getListOfAll("indicators", {
                      filter: { project_detail_id: Number(resp.data?.id) },
                    })
                    .then((res) => {
                      if (res && res.data) {
                        setIndicators(groupBy(res.data, "entity_type"));
                        setIsFetching(false);
                      }
                    });
                }
              });
          }
        }
      });
  }, []);

  if (isFetching) return null;

  const targetYears = getTargetYearsFromSignedDate(projectDetails);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "100px",
          margin: "15px 0px",
        }}
      >
        <Button
          label="Back"
          color="primary"
          startIcon={<ArrowBackIcon />}
          href={`/#/reports-indicators-projects`}
        />
      </div>
      <Card style={{ padding: "25px" }}>
        <div>
          <br />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "50px",
                marginBottom: "20px",
              }}
            >
              <h2>Project Indicators</h2>
              <div>
                <IndicatorsButton
                  record={projectDetails}
                  source={"indicators"}
                  targetYears={targetYears}
                  type={"project_detail"}
                  reference={"project_detail"}
                  onRefresh={handleRefresh}
                  helpers={helpers}
                  details={projectDetails}
                />
                {checkPermissions("edit_indicator") && (
                  <IconButton
                    href={`/#/achieve-targets/${projectDetails?.id}/project_detail`}
                    title="Achieved Targets"
                  >
                    <PostAdd color="primary" />
                  </IconButton>
                )}
              </div>
            </div>
            <IndicatorList
              type="project_detail"
              record={projectDetails}
              indicators={indicators["project_detail"]}
              targetYears={targetYears}
              source={"indicators"}
              reference={"project_detail"}
              onRefresh={handleRefresh}
              helpers={helpers}
            />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "50px",
              marginBottom: "20px",
            }}
          >
            <h2>Outcomes Indicators</h2>
            <div>
              <IndicatorsButton
                record={projectDetails}
                targetYears={targetYears}
                source={"indicators"}
                type={"outcome"}
                reference={"outcomes"}
                onRefresh={handleRefresh}
                helpers={helpers}
                referencedOptions={projectDetails["outcomes"]}
                details={projectDetails}
              />
              {checkPermissions("edit_indicator") && (
                <IconButton
                  href={`/#/achieve-targets/${projectDetails?.id}/outcome`}
                  title="Achieved Targets"
                >
                  <PostAdd color="primary" />
                </IconButton>
              )}
            </div>
          </div>

          {projectDetails?.outcomes?.map((outcome) => {
            const outcomeData =
              indicators["outcome"]?.filter(
                (it) => it.entity_id === outcome.id
              ) || [];

            return (
              <div>
                <h3>{outcome.name}</h3>
                <IndicatorList
                  type="outcome"
                  record={projectDetails}
                  indicators={outcomeData}
                  targetYears={targetYears}
                  source={"indicators"}
                  reference={"outcomes"}
                  onRefresh={handleRefresh}
                  helpers={helpers}
                />
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "50px",
              marginBottom: "20px",
            }}
          >
            <h2>Outputs Indicators</h2>
            <div style={{ alignSelf: "end", marginBottom: "20px" }}>
              <IndicatorsButton
                record={projectDetails}
                targetYears={targetYears}
                source={"indicators"}
                type={"output"}
                reference={"outputs"}
                onRefresh={handleRefresh}
                helpers={helpers}
                referencedOptions={projectDetails["outputs"]}
                details={projectDetails}
              />
              {checkPermissions("edit_indicator") && (
                <IconButton
                  href={`/#/achieve-targets/${projectDetails?.id}/output`}
                  title="Achieved Targets"
                >
                  <PostAdd color="primary" />
                </IconButton>
              )}
            </div>
          </div>

          {projectDetails?.outputs?.map((output) => {
            const outputData =
              indicators["output"]?.filter(
                (it) => it.entity_id === output.id
              ) || [];
            const outcomes =
              projectDetails.outcomes?.filter((it) =>
                output.outcome_ids.includes(it.id)
              ) || [];

            return (
              <div>
                <h3>Output: {output.name}</h3>
                <p style={{ fontStyle: "italic" }}>
                  Outcome: {outcomes?.map((it) => it.name).join(", ") || "-"}
                </p>
                <IndicatorList
                  type="output"
                  record={projectDetails}
                  indicators={outputData}
                  targetYears={targetYears}
                  source={"indicators"}
                  reference={"outputs"}
                  onRefresh={handleRefresh}
                  helpers={helpers}
                />
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
};

export default IndicatorsPage;
