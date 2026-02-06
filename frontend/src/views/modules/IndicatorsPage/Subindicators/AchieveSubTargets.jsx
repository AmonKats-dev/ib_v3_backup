import { Card, CardActions } from "@material-ui/core";
import { groupBy } from "lodash";
import React, { useEffect, useState } from "react";
import { Button, useDataProvider, useRedirect } from "react-admin";
import { getFiscalYearsRangeForIntervals } from "../../../../helpers/formatters";
import IndicatorListAchieved from "../IndicatorListAchieved";
import { useDispatch, useSelector } from "react-redux";
import { setBreadCrumps } from "../../../../actions/ui";
import { getTargetYearsFromSignedDate } from "../helpers";

const AchieveSubTargets = (props) => {
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
          to: `/indicators/${Number(props.match?.params?.indicatorId)}/show`,
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
      .getOne("indicators", {
        id: Number(props.match?.params?.indicatorId),
      })
      .then((res) => {
        if (res && res.data) {
          setIndicators(res.data.subindicators);

          dataProvider
            .getOne("project-details", {
              id: res.data.project_detail_id,
            })
            .then((resp) => {
              if (resp && resp.data) {
                setProjectDetails(resp.data);
                setIsFetching(false);
              }
            });
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
          redirect(
            `/indicators/${Number(props.match?.params?.indicatorId)}/show`
          );
        }
      })
      .catch((err) => alert(err));
  };

  return (
    <Card style={{ padding: "25px" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div>
          <IndicatorListAchieved
            type="indicator"
            record={projectDetails}
            indicators={indicators}
            indicatorsData={indicatorsData}
            targetYears={targetYears}
            source={"indicators"}
            reference={"indicators"}
            onChange={handleChangeIndicator}
          />
        </div>
      </div>
      <CardActions>
        <Button
          label="Cancel"
          variant="outlined"
          onClick={() => {
            if (projectDetails)
              redirect(
                `/indicators/${Number(props.match?.params?.indicatorId)}/show`
              );
          }}
        />
        <Button label="Save" variant="contained" onClick={handleSave} />
      </CardActions>
    </Card>
  );
};

export default AchieveSubTargets;
