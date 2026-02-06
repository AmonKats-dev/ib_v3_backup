import React, { Fragment, useEffect, useState } from "react";
import {
  Toolbar,
  ListButton,
  SaveButton,
  useNotify,
  Button,
  ShowButton,
  useRedirect,
  DeleteButton,
} from "react-admin";
import { ChevronLeft, CloseOutlined } from "@material-ui/icons";
import { useHistory } from "react-router-dom";

const CustomToolbar = (props) => {
  const notify = useNotify();
  const history = useHistory();
  const redirect = useRedirect();

  const handleSave = () => {
    if (!props.invalid) {
      props.handleSubmitWithRedirect();

      if (props.onSaveSuccess) {
        props.onSaveSuccess();
      }
    } else {
      window.scrollTo(0, 0);
      notify("You should define required fields  before save!", "error");
    }
  };
  return (
    <Toolbar style={{ width: "100%" }}>
      <Button
        onClick={() => {
          if (props.projectDetailId){
            redirect(`${props.basePath}/${props.projectDetailId}/list`)
          } else {
            redirect(`${props.basePath}`)
          }
        }
        }
        label="Cancel"
        style={{ marginRight: 5, padding: "7px 15px" }}
        color="primary"
        variant="contained"
      />
      <SaveButton {...props} onClick={handleSave} />
    </Toolbar>
  );
};

export default CustomToolbar;
