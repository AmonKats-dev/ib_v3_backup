import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import React, { Fragment, useEffect } from "react";
import { useState } from "react";
import { useFormState } from "react-final-form";

import { Button, useDataProvider, useRefresh, useTranslate } from "react-admin";
import EditForm from "./EditForm";
import { currencyConverter } from "../../../../../helpers";
import lodash from "lodash";
import {
  checkFeature,
  useChangeField,
} from "../../../../../helpers/checkPermission";
// import useCurrencyRates from "../../../../../hooks/useCurrencyRates";

function InvestmentsButton(props) {
  const translate = useTranslate();
  const [initialValues, setInitialValues] = useState(null);
  const [show, setShow] = useState(false);
  const [convRate, setConvRate] = useState(false);
  // const currencyRates = useCurrencyRates();
  const { values, hasValidationErrors } = useFormState();
  const changeCosts = useChangeField({ name: props.source });
  const refresh = useRefresh();

  useEffect(() => {
    setInitialValues(lodash.get(props.record, props.source));
  }, [props.record, props.source]);

  function handleShow() {
    setShow(true);
  }

  function handleClose() {
    setShow(false);
    changeCosts(initialValues);
  }

  function handleSave() {
    props.onSave(values, false);
    setInitialValues(lodash.get(values, props.source));
    setShow(false);
    refresh();
  }

  function handleConvert() {
    // if (!convRate) {
    //   const conversionRate =
    //     (currencyRates &&
    //       lodash.find(currencyRates, (item) => item.currency.code === "USD")
    //         .rate);
    //   setConvRate(conversionRate);
    // } else {
    //   setConvRate(false);
    // }
  }

  function renderButtonLabel() {
    if (checkFeature("has_pimis_fields")) {
      switch (props.type) {
        case "components":
          return translate("buttons.components_investments");
        case "outputs":
          return translate("buttons.output_investments");
        case "activities":
          return translate("buttons.activity_investments");
        default:
          return null;
      }
    }

    return translate("buttons.investments");
  }

  return (
    <Fragment>
      <Button
        onClick={handleShow}
        label={renderButtonLabel()}
        variant="contained"
      />
      <Dialog
        fullWidth
        maxWidth={"md"}
        open={show}
        // onClose={handleClose}
        style={{ overflow: "hidden" }}
        disableBackdropClick
        disableEscapeKeyDown
      >
        <DialogTitle>Investments</DialogTitle>
        <DialogContent>
          <EditForm
            {...props}
            source={props.source}
            targetYears={props.targetYears}
            type={props.type}
            conversionRate={convRate}
          />
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleConvert} label="Convert" variant="contained" /> */}
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

export default InvestmentsButton;
