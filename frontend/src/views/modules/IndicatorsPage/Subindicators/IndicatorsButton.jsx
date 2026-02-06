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
import { useCheckPermissions } from "../../../../helpers/checkPermission";

function IndicatorsButton({ onRefresh, referencedOptions, ...props }) {
  const translate = useTranslate();
  const [show, setShow] = useState(false);
  const checkPermissions = useCheckPermissions();

  function handleShow() {
    setShow(true);
  }

  function handleClose() {
    setShow(false);
  }

  const canEdit = props.isEdit && checkPermissions("edit_indicator");
  const canCreate = !props.isEdit && checkPermissions("create_indicator");

  return (
    <Fragment>
      {(canEdit || canCreate) && (
        <IconButton
          onClick={handleShow}
          title={props.isEdit ? "Edit Sub-Indicator" : "Add Sub-Indicator"}
          color="primary"
        >
          {props.isEdit ? (
            <EditIcon color="primary" />
          ) : (
            <AddCircleOutlineIcon color="primary" />
          )}
        </IconButton>
      )}

      {show && (
        <Dialog
          fullWidth
          maxWidth={"md"}
          open={show}
          onClose={handleClose}
          style={{ overflow: "hidden" }}
        >
          <DialogTitle>
            {props.isEdit ? "Edit" : "Create"} Sub-Indicator
          </DialogTitle>
          <DialogContent>
            {props.isEdit ? (
              <EditForm
                {...props}
                projectDetails={props.projectDetails}
                helpers={props.helpers}
                source={props.source}
                targetYears={props.targetYears}
                onClose={handleClose}
                onRefresh={onRefresh}
                referencedOptions={referencedOptions}
              />
            ) : (
              <CreateForm
                {...props}
                projectDetails={props.projectDetails}
                helpers={props.helpers}
                source={props.source}
                targetYears={props.targetYears}
                onClose={handleClose}
                onRefresh={onRefresh}
                referencedOptions={referencedOptions}
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </Fragment>
  );
}

export default IndicatorsButton;
