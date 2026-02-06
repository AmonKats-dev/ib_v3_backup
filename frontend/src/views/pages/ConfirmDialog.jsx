import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";

export default function ConfirmDialog(props) {
  const { onClose, value: valueProp, open, ...other } = props;
  const [value, setValue] = React.useState(valueProp);
  const radioGroupRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(value);
  };

  const handleChange = (field) => (event) => {
    // setValue(event.target.value);
    setValue({ ...value, [field]: event.target.value });
  };

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      onEntering={handleEntering}
      aria-labelledby="confirmation-dialog-title"
      open={open}
      {...other}
    >
      <DialogTitle id="confirmation-dialog-title">
        Save Report COnfig
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          variant="outlined"
          label="Name"
          value={value['name']}
          style={{ margin: '10px auto'}}
          onChange={handleChange("name")}
          fullWidth
        />
        <TextField
          variant="outlined"
          label="Title"
          value={value['title']}
          style={{ margin: '10px auto'}}
          onChange={handleChange("title")}
          fullWidth
        />
        <TextField
          variant="outlined"
          label="Description"
          style={{ margin: '10px auto'}}
          value={value['description']}
          onChange={handleChange("description")}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleOk} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
