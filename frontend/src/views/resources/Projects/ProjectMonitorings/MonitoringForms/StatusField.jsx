import React, { Fragment } from "react";
import lodash, { isString } from "lodash";
import { Chip } from "@material-ui/core";

function StatusField(props) {
  function getStatusIndication() {
    if (isString(props.value)) {
      switch (props.value) {
        case "UNDERFUNDED":
        case "NOT_SATISFACTORY":
          return "red";
        case "MODERATELY_SATISFACTORY":
          return "yellow";
        case "SATISFACTORY":
          return "green";
        default:
          return "";
      }
    }

    if (100 - props.value < 1) {
      return "green";
    }
    if (100 - props.value >= 1 && 100 - props.value <= 25) {
      return "yellow";
    }
    if (100 - props.value > 25) {
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

    if (value < 1) {
      return "Satisfactory";
    }
    if (value >= 1 && value <= 25) {
      return "Moderately Satisfactory";
    }
    if (value > 25) {
      return "Not Satisfactory";
    }
  }

  return (
    <Chip
      label={getStatusTExt(props.value)}
      style={{
        color: "white",
        borderRadius: 10,
        backgroundColor: getStatusIndication(),
      }}
    />
  );
}

export default StatusField;
