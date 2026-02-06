import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
} from "@material-ui/core";
import React, { useEffect, useMemo } from "react";

export const IdlePopup = ({
  showModal,
  handleClose,
  handleLogout,
  remainingTime,
}) => {
  return (
    <Dialog
      fullWidth
      maxWidth={"xs"}
      open={showModal}
      onClose={(e, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          handleClose();
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h6" style={{ marginLeft: 20 }}>
          You have been idle.
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Divider />
        <Typography variant="h5" style={{ margin: 20 }}>
          You will be logged out soon. Do you want to stay?
        </Typography>
        <Divider />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogout}
          style={{ backgroundColor: "orangered" }}
        >
          {` Sign out (${remainingTime} sec)`}
        </Button>
        <Button variant="contained" color="primary" onClick={handleClose}>
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};
