import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@material-ui/core";
import { Cancel, Check } from "@material-ui/icons";
import React, { Fragment, useState } from "react";
import { useTranslate, useNotify } from "react-admin";
import { ACTION_TYPES } from "../../../../../../constants/common";

function ConfirmationDialog({ action, show, onClose, onSubmit, ...props }) {
  const translate = useTranslate();

  const renderHelpMessage = (action) => {
    switch (action) {
      case ACTION_TYPES.ALLOCATE_FUNDS:
        return "This action means that the budget will be allocated for the project. Please confirm!";
      case ACTION_TYPES.ASSIGN:
        return "Assign user to next workflow step. Please confirm!";
      case ACTION_TYPES.SUBMIT:
        return `Submit means you are forwarding the project for approval. You will not be able to take any action on the project after the submission. Please confirm!`;
      case ACTION_TYPES.REVISE:
        return `Revise means you are returning the project for modification/amendment. Are you sure you want to revise?`;
      case ACTION_TYPES.APPROVE:
        return `Approve means forwarding the project to the next in tier.  Are you sure you want to approve?`;
      case ACTION_TYPES.CONDITIONALLY_APPROVE:
        return `Conditional approve means forwarding the project to the creator.  Are you sure you want to approve?`;
      case ACTION_TYPES.REJECT:
        return `This action means that the project will be deleted from the system and archived in the recycling bin for only 7 days. No further action will be undertaken once rejected. Are you sure you want to reject the project?`;
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={show}
      onClose={onClose}
      aria-label={translate("messages.project_reject_confirmation")}
    >
      <DialogTitle>{renderHelpMessage(action)}</DialogTitle>
      <DialogActions>
        <Button
          onClick={onSubmit}
          label="ra.action.confirm"
          key="button"
          style={{ color: "green" }}
        >
          <Check />
        </Button>
        <Button
          label="ra.action.cancel"
          onClick={onClose}
          style={{ color: "red" }}
        >
          <Cancel />
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;
