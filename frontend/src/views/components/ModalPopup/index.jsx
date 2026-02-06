// in PostQuickCreateButton.js
import React, { Component, Fragment } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { setPopupVisibility, setPopupContent } from "../../../actions/ui";
import { useSelector, useDispatch } from "react-redux";

const  ModalPopup = (props) =>  {
  const dispatch = useDispatch();
  const ui = useSelector((state) => state.ui);

  function handleClose() {
    dispatch(setPopupVisibility(false));
    dispatch(setPopupContent(null));
  }

  return (
    <Dialog
      fullWidth
      maxWidth={"md"}
      open={ui.popupVisible}
      onClose={handleClose}
      style={{ overflow: "hidden" }}
    >
      <DialogTitle>{ui.popupContent && ui.popupContent.title}</DialogTitle>
      <DialogContent>
        {/* {ui.popupContent && ui.popupContent.content} */}
        { props.children }
      </DialogContent>
      {/* {ui.popupContent && ui.popupContent.actions && (
        <DialogActions>
          {ui.popupContent && ui.popupContent.actions}
        </DialogActions>
      )} */}
    </Dialog>
  );
}

export default ModalPopup;
