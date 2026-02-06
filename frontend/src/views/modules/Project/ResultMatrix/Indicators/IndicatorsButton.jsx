import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import React, { Fragment } from "react";
import { useState } from "react";
import { useFormState } from "react-final-form";

import { Button, useTranslate } from "react-admin";
import EditForm from "./EditForm";
import {
  checkFeature,
  useChangeField,
} from "../../../../../helpers/checkPermission";
import { useEffect } from "react";
import lodash from "lodash";

function IndicatorsButton(props) {
  const translate = useTranslate();
  const [initialValues, setInitialValues] = useState(null);
  const [show, setShow] = useState(false);
  const { values, hasValidationErrors } = useFormState();
  const changeIndicators = useChangeField({ name: props.source });

  useEffect(() => {
    setInitialValues(lodash.get(props.record, props.source));
  }, []);

  function handleShow() {
    setShow(true);
  }

  function handleClose() {
    setShow(false);
    changeIndicators(initialValues);
  }

  function handleSave() {
    props.onSave(values, false);
    setInitialValues(lodash.get(values, props.source));
    setShow(false);
  }

  return (
    <Fragment>
      <Button
        onClick={handleShow}
        label={translate(`buttons.${props.type}_indicators`)}
        variant="contained"
        style={{ marginRight: 30 }}
      />
      <Dialog
        fullWidth
        maxWidth={"md"}
        open={show}
        onClose={handleClose}
        style={{ overflow: "hidden" }}
        disableBackdropClick
        disableEscapeKeyDown
      >
        <DialogTitle>Indicators</DialogTitle>
        <DialogContent>
          <EditForm
            {...props}
            source={props.source}
            targetYears={props.targetYears}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSave}
            label="Save"
            variant="contained"
            disabled={hasValidationErrors}
          />
          <Button onClick={handleClose} label="Cancel" variant="contained" />
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

export default IndicatorsButton;
