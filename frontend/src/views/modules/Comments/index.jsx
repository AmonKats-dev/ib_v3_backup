import React, { Component, useEffect } from "react";
import CommentsSection from "./CommentsSection";
import { useTranslate, useDataProvider } from "react-admin";
import { useState } from "react";
import lodash from "lodash";
import { useSelector } from "react-redux";

function CustomComments(props) {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const content = useSelector((state) => state.ui.rightPanelContent);

  useEffect(() => {
    if (content) {
      dataProvider
        .getListOfAll("comments", {
          sort_field: "id",
          filter: { project_id: content.data.id },
        })
        .then((result) => {
          setIsLoading(false);
          setComments(result.data);
        })
        .catch((error) => {
          setIsLoading(false);
        });
    }
  }, [props.project]);

  if (isLoading) return <h3>Loading...</h3>;

  return (
    <CommentsSection
      data={comments}
      translate={translate}
      projectId={content.data.id}
    />
  );
}

export default CustomComments;
