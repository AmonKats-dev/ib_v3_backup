import React from "react";
import { Badge, Button, Select, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useEffect } from "react";

const useStyles = makeStyles((theme) => ({
  select: {
    width: 150,
  },
}));

function RoleSwitch(props) {
  const classes = useStyles();
  const [role, setRole] = React.useState(props.currentRole ?? "");

  useEffect(() => {
    setRole(props.currentRole ?? "");
  }, [props.currentRole]);

  const handleChange = (event) => {
    setRole(event.target.value);
    props.onSelect(event.target.value);
  };

  return (
    <Select
      className={classes.select}
      variant="standard"
      value={role !== null && role !== undefined ? role : ""}
      onChange={handleChange}
    >
      {props.roles &&
        props.roles.map((item) => (
          <MenuItem key={item.role_id} value={item.role_id}>{item.role && item.role.name}</MenuItem>
        ))}
    </Select>
  );
}

export default RoleSwitch;
