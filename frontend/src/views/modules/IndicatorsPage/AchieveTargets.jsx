import { Card, CardActions } from "@material-ui/core";
import { groupBy } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { Button, useDataProvider, useRedirect } from "react-admin";
import { getFiscalYearsRangeForIntervals } from "../../../helpers/formatters";
import IndicatorListAchieved from "./IndicatorListAchieved";
import { useDispatch, useSelector } from "react-redux";
import { setBreadCrumps } from "../../../actions/ui";
import moment from "moment";
import { getTargetYearsFromSignedDate } from "./helpers";

const AchieveTargets = (props) => {
  const [indicatorsData, setIndicatorsData] = useState({});
  const [projectDetails, setProjectDetails] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [indicators, setIndicators] = useState([]);
  const dataProvider = useDataProvider();
  const redirect = useRedirect();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBreadCrumps([
        {
          to: `/project-indicators/${projectDetails?.project_id}`,
          title: "Indicators",
        },
        { to: "", title: "Achieved Targets" },
      ])
    );

    return () => {
      dispatch(setBreadCrumps([]));
    };
  }, [dispatch, projectDetails?.project_id]);

  useEffect(() => {
    dataProvider
      .getOne("project-details", {
        id: props.match?.params?.projectDetailsId,
      })
      .then((resp) => {
        if (resp && resp.data) {
          setProjectDetails(resp.data);
        }
      });

    dataProvider
      .getListOfAll("indicators", {
        filter: {
          project_detail_id: Number(props.match?.params?.projectDetailsId),
        },
      })
      .then((res) => {
        if (res && res.data) {
          const filtered = res.data.filter(
            (it) => it.entity_type === props.match?.params?.achieveType
          );
          setIndicators(groupBy(filtered, "entity_type"));
          setIsFetching(false);
        }
      });
  }, []);

  if (isFetching) return null;

  const targetYears = getTargetYearsFromSignedDate(projectDetails);

  const handleChangeIndicator = ({ id, value, comments }) => {
    setIndicatorsData((prev) => ({
      ...prev,
      [id]: {
        value: value || indicatorsData[id]?.value,
        comments: comments || indicatorsData[id]?.comments,
      },
    }));
  };

  const handleSave = () => {
    const data = Object.keys(indicatorsData).map((key) => {
      return {
        indicator_id: Number(key),
        indicator_progress: Number(indicatorsData[key].value),
        comments: indicatorsData[key].comments,
      };
    });

    dataProvider
      .achievedTargets({ data })
      .then((res) => {
        if (res && projectDetails) {
          redirect(`/project-indicators/${projectDetails?.project_id}`);
        }
      })
      .catch((err) => alert(err));
  };

  const renderContent = () => {
    switch (props.match?.params?.achieveType) {
      case "outcome":
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {projectDetails?.outcomes?.map((outcome) => {
              const outcomeData =
                indicators["outcome"]?.filter(
                  (it) => it.entity_id === outcome.id
                ) || [];

              return (
                <div>
                  <IndicatorListAchieved
                    type="outcome"
                    record={projectDetails}
                    indicators={outcomeData}
                    indicatorsData={indicatorsData}
                    targetYears={targetYears}
                    source={"indicators"}
                    reference={"outcomes"}
                    parent={<p>{outcome.name}</p>}
                    onChange={handleChangeIndicator}
                  />
                </div>
              );
            })}
          </div>
        );
      case "output":
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
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
                  <IndicatorListAchieved
                    type="output"
                    record={projectDetails}
                    indicators={outputData}
                    targetYears={targetYears}
                    source={"indicators"}
                    reference={"outputs"}
                    parent={
                      <>
                        <p> {output.name}</p>
                        <p style={{ fontStyle: "italic" }}>
                          Outcome:{" "}
                          {outcomes?.map((it) => it.name).join(", ") || "-"}
                        </p>
                      </>
                    }
                    onChange={handleChangeIndicator}
                  />
                </div>
              );
            })}
          </div>
        );
      default:
        return (
          <div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <IndicatorListAchieved
                type="project_detail"
                record={projectDetails}
                indicators={indicators["project_detail"]}
                targetYears={targetYears}
                source={"indicators"}
                reference={"project_detail"}
                onChange={handleChangeIndicator}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <Card style={{ padding: "25px" }}>
      {renderContent()}
      <CardActions>
        <Button
          label="Cancel"
          variant="outlined"
          onClick={() => {
            if (projectDetails)
              redirect(`/project-indicators/${projectDetails?.project_id}`);
          }}
        />
        <Button label="Save" variant="contained" onClick={handleSave} />
      </CardActions>
    </Card>
  );
};

export default AchieveTargets;
