// in src/comments/ApproveButton.js
import React, { Component, Fragment, useState } from "react";
import {
  useNotify,
  useTranslate,
  useDataProvider
} from "react-admin";
import { Button } from "react-admin";
import CircularProgress from "@material-ui/core/CircularProgress";
import ArrowForward from "@material-ui/icons/ArrowForward";
import { ArrowBack } from "@material-ui/icons";

function RevertButton(props) {
  const dataProvider = useDataProvider();
  const showNotification = useNotify();
  const translate = useTranslate();
  const [isFetching, setIsFetching] = useState(false);

  function handleClick() {
    const { record, action } = props;

    handleWorkFlowStep(action, record);
  }
  function handleRefresh() {
    window.location.reload();
  }
  function handleWorkFlowStep(action, params) {
    const requestParams = {
      data: {
        action: 'REVERT',
      },
      id: params.id,
    };

    dataProvider
      .action("projects", requestParams)
      .then((response) => {
        showNotification(translate("workflow.messages.status_change"));
        setIsFetching(false);
        handleRefresh();
      })
      .catch((err) => {
        showNotification(
          translate("workflow.messages.status_not_change"),
          "warning"
        );
        setIsFetching(false);
      });
  }

  const content = isFetching ? (
    <CircularProgress size={25} thickness={2} />
  ) : (
    <ArrowBack />
  );
  return (
    <Button label={"REVERT"} onClick={handleClick}>
      {content}
    </Button>
  );
}
export default RevertButton;
