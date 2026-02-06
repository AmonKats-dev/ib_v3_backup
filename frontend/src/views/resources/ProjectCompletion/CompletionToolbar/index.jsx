import React from "react";
import {
  Button, SaveButton, Toolbar, useNotify, useRedirect
} from "react-admin";

const CompletionToolbar = (props) => {
  const notify = useNotify();
  const redirect = useRedirect();
  const handleSave = () => {
    if (!props.invalid) {
      props.handleSubmitWithRedirect();
    } else {
      window.scrollTo(0, 0);
      notify("You should input all required fields before save!", "error");
    }
  };

  return (
    <Toolbar>
      <Button
        onClick={() => redirect(`${props.basePath}/${props.id}/show`)}
        label="Cancel"
        style={{ marginRight: 5, padding: "7px 15px" }}
        color="primary"
        variant="contained"
      />
      <SaveButton {...props} onClick={handleSave} />
    </Toolbar>
  );
};

export default CompletionToolbar;
