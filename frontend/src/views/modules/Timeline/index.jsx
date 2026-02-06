import React, { Component, useEffect } from "react";
import Timeline from "./Timeline";
import { useTranslate, useDataProvider } from "react-admin";
import { useState } from "react";
import lodash from "lodash";
import { useSelector } from "react-redux";

function CustomTimeline(props) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const content = useSelector((state) => state.ui.rightPanelContent);

  useEffect(() => {
    if (content) {
      dataProvider
        .getListOfAll("timeline", {
          sort_field: "id",
          filter: { project_id: content.data.id },
        })
        .then((result) => {
          setIsLoading(false);
          setEvents(result.data);
        })
        .catch((error) => {
          setIsLoading(false);
        });
    }
  }, [props.project]);

  if (isLoading) return <h3>Loading...</h3>;

  if (events.length === 0) {
    return <h3>{translate("timeline.no_data")}</h3>;
  }
  return <Timeline events={events} translate={translate} />;
}

export default CustomTimeline;
