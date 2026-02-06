import React from "react";
import {
  TextInput,
  NumberInput,
  TextField,
  required,
  NumberField,
  minValue,
} from "react-admin";

export default [
  {
    source: "name",
    input: <TextInput />,
    view: <TextField />,
    // validate: [required()],
    tooltipText: "Phase Name",
    options: {
      fullWidth: true,
      variant: "outlined",
    },
  },
  {
    source: "sequence",
    input: <NumberInput />,
    view: <NumberField />,
    // validate: [required()],
    tooltipText: "Phase Order",
    options: {
      fullWidth: true,
      variant: "outlined",
    },
  },
];
