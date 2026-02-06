import React, { Fragment } from "react";
import lodash, { isString } from "lodash";
import { Chip } from "@material-ui/core";
import { percentageFormatter } from "../../../../../helpers";

function StatusFieldValue(props) {
  function getStatusIndication() {
    if (isString(props.value)) {
      switch (props.value) {
        case "UNDERFUNDED":
        case "NOT_SATISFACTORY":
          return "red";
        case "MODERATELY_SATISFACTORY":
          return "#66e066";
        case "SATISFACTORY":
          return "green";
        default:
          return "";
      }
    }
    if (100 - props.value <= 10) {
      return "green";
    }
    if (100 - props.value > 10 && 100 - props.value <= 20) {
      return "#66e066";
    }
    if (100 - props.value > 20) {
      return "red";
    }
  }

  function getStatusTExt(value) {
    if (isString(value)) {
      switch (value) {
        case "UNDERFUNDED":
        case "NOT_SATISFACTORY":
          return "Not Satisfactory";
        case "MODERATELY_SATISFACTORY":
          return "Moderately Satisfactory";
        case "SATISFACTORY":
          return "Satisfactory";
        default:
          return "";
      }
    }

    if (value <= 10) {
      return "Satisfactory";
    }
    if (value > 10 && value <= 20) {
      return "Moderately Satisfactory";
    }
    if (value > 20) {
      return "Not Satisfactory";
    }
  }

  return (
    <Chip
      label={percentageFormatter(props.value)}
      style={{
        color: "white",
        borderRadius: 10,
        backgroundColor: getStatusIndication(),
      }}
    />
  );
}

export default StatusFieldValue;
