import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@material-ui/core";
import React, { Fragment, useState } from "react";
import { useFormState } from "react-final-form";

import { Button, useTranslate } from "react-admin";
import EditForm from "./EditForm";
import CreateForm from "./CreateForm";
import EditIcon from "@material-ui/icons/Edit";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

function IndicatorsButton({ onRefresh, referencedOptions, ...props }) {
  const translate = useTranslate();
  const [show, setShow] = useState(false);

  function handleShow(ev) {
    ev.stopPropagation();
    setShow(true);
  }

  function handleClose() {
    setShow(false);
  }

  return (
    <Fragment>
      <IconButton
        onClick={handleShow}
        title={props.isEdit ? "Edit Indicator" : "Add Indicator"}
        color="primary"
      >
        {props.isEdit ? (
          <EditIcon color="primary" />
        ) : (
          <AddCircleOutlineIcon color="primary" />
        )}
      </IconButton>
      {show && (
        <Dialog
          fullWidth
          maxWidth={"md"}
          open={show}
          onClose={handleClose}
          style={{ overflow: "hidden" }}
          onClick={(ev) => ev.stopPropagation()}
        >
          <DialogTitle>
            {props.isEdit ? "Edit" : "Create"} Indicator
          </DialogTitle>
          <DialogContent>
            {props.isEdit ? (
              <EditForm
                {...props}
                helpers={props.helpers}
                source={props.source}
                targetYears={props.targetYears}
                onClose={handleClose}
                onRefresh={onRefresh}
                referencedOptions={referencedOptions}
                details={props.details}
              />
            ) : (
              <CreateForm
                {...props}
                helpers={props.helpers}
                source={props.source}
                targetYears={props.targetYears}
                onClose={handleClose}
                onRefresh={onRefresh}
                referencedOptions={referencedOptions}
                details={props.details}
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </Fragment>
  );
}

export default IndicatorsButton;
