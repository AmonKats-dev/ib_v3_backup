import React, { Fragment } from "react";
import {
  useTranslate,
  Button,
  Toolbar   
} from "react-admin";

function Actions(props) {
  const translate = useTranslate();

  function handleSave(){
    props.onSave();
    props.handleSubmitWithRedirect(false);
  }

  return (
    <Toolbar>
      <Button onClick={props.onConvert} label="Convert" variant="contained" />
      <Button onClick={handleSave} label="Save" variant="contained" />
      <Button onClick={props.onClose} label="Cancel" variant="contained" />
    </Toolbar>
  );
}

export default Actions;
