// in src/comments/ApproveButton.js
import React, { Component, Fragment, useState } from "react";
import {
  useNotify,
  useTranslate,
  useDataProvider,
  useRedirect,
  refreshSaga
} from "react-admin";
import { Button } from "react-admin";
import CircularProgress from "@material-ui/core/CircularProgress";
import ArrowForward from "@material-ui/icons/ArrowForward";

function CustomRestoreButton(props) {
  const dataProvider = useDataProvider();
  const showNotification = useNotify();
  const redirect = useRedirect();
  const translate = useTranslate();
  const [isFetching, setIsFetching] = useState(false);

  function handleClick() {
    const requestParams = {
      data: {
        "is_deleted": 0,
      },
      id: props.id,
    };

    dataProvider
      .update("projects", requestParams)
      .then((response) => {
        if (response) {
          showNotification(translate("workflow.messages.status_change"));
          setIsFetching(false);
          redirect("/projects");
        }
      })
      .catch((err) => {
        showNotification(
          err.message, 
          "warning"
        );
        setIsFetching(false);
      });
  }

  const content = isFetching ? (
    <CircularProgress size={25} thickness={2} />
  ) : (
    <ArrowForward />
  );
  return (
    <Button label={"Restore"} onClick={handleClick} style={props.style}>
      {content}
    </Button>
  );
}
export default CustomRestoreButton;
