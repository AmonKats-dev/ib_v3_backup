import React, { Fragment } from "react";
import {
  useTranslate,
  Button,
} from "react-admin";

function Actions(props) {
  const translate = useTranslate();

  return (
    <Fragment>
      <Button onClick={props.onSave} label="Save" variant="contained" />
      <Button onClick={props.onClose} label="Cancel" variant="contained" />
    </Fragment>
  );
}

export default Actions;
