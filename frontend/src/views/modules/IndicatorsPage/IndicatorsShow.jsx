import { Card } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import {
  Button,
  Show,
  SimpleShowLayout,
  TopToolbar,
  useDataProvider,
  useRedirect,
  useShowContext,
} from "react-admin";
import Subindicators from "./Subindicators";
import IntermediaryTargets from "./IntermediaryTargets";
import { getFiscalYearsRangeForIntervals } from "../../../helpers/formatters";
import { getTargetYearsFromSignedDate } from "./helpers";

const Actions = (props) => {
  const [link, setLink] = useState();
  const redirect = useRedirect();
  const dataProvider = useDataProvider();

  useEffect(() => {
    if (props.data?.project_detail_id)
      dataProvider
        .getOne("project-details", {
          id: props.data.project_detail_id,
        })
        .then((res) => {
          if (res?.data) {
            setLink(res.data.project_id);
          }
        });
  }, [props.data]);

  return (
    <TopToolbar style={{ display: "flex", justifyContent: "flex-start" }}>
      <Button
        onClick={() => {
          redirect(`/project-indicators/${link}`);
        }}
        label="Back"
        color="primary"
        startIcon={<ArrowBackIcon />}
        disabled={!link}
      />
    </TopToolbar>
  );
};

const IndicatorsShow = (props) => {
  const [details, setDetails] = useState();
  const dataProvider = useDataProvider();

  console.log(props, "propspropsprops");

  useEffect(() => {
    if (props.record?.project_detail_id)
      dataProvider
        .getOne("project-details", {
          id: props.record?.project_detail_id,
        })
        .then((res) => {
          if (res?.data) {
            setDetails(res.data);
          }
        });
  }, [props.record]);

  const {
    defaultTitle, // the translated title based on the resource, e.g. 'Post #123'
    error, // error returned by dataProvider when it failed to fetch the record. Useful if you want to adapt the view instead of just showing a notification using the `onError` side effect.
    isFetching, // boolean that is true while the record is being fetched, and false once the record is fetched
    isLoading, // boolean that is true until the record is available for the first time
    record, // record fetched via dataProvider.getOne() based on the id from the location
    refetch, // callback to refetch the record via dataProvider.getOne()
    resource, // the resource name, deduced from the location. e.g. 'posts'
  } = useShowContext();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error!</div>;
  }

  const targetYears = getTargetYearsFromSignedDate(details);
  const targetValue = record?.targets && record.targets["project"];

  const achieved = Math.abs(
    Number(record.achieved_target?.indicator_progress) - Number(record.baseline)
  );

  const target = Math.abs(
    Number(
      record.targets[
        Object.keys(record?.targets)[Object.keys(record?.targets).length - 1]
      ]
    ) - Number(record.baseline)
  );

  const progressValue =
    target > 0 && achieved > 0 ? ((achieved / target) * 100).toFixed(0) : "-";

  return (
    <>
      <Card>
        <SimpleShowLayout>
          <div>
            <p>
              Name: <b>{record?.name}</b>
            </p>
            <p>
              Unit of Measure: <b>{record?.unit?.name || "-"}</b>
            </p>
            <p>
              Format: <b>{record?.format?.name || "-"}</b>
            </p>
            <p>
              Frequency: <b>{record?.frequency?.name || "-"}</b>
            </p>
            <p>
              Format: <b>{record?.format?.name || "-"}</b>
            </p>
            <p>
              Verification Means: <b>{record?.verification_means || "-"}</b>
            </p>
            <p>
              Baseline: <b>{record?.baseline || "-"}</b>
            </p>
            <p>
              Target: <b>{targetValue || "-"}</b>
            </p>
            <p>
              Progress (%): <b>{progressValue || "-"}</b>
            </p>
            {record?.frequency_id && (
              <IntermediaryTargets
                frequency={record?.frequency_id}
                data={record?.intermediary_targets}
                years={targetYears}
              />
            )}
          </div>
        </SimpleShowLayout>
      </Card>
      <br />
      <Card>
        <Subindicators record={record} />
      </Card>
    </>
  );
};

export default (props) => (
  <Show {...props} actions={<Actions />}>
    <IndicatorsShow />
  </Show>
);
