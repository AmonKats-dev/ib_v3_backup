import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Badge, Typography } from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/NotificationsOutlined";
import PersonIcon from "@material-ui/icons/Person";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import InputIcon from "@material-ui/icons/Input";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import classnames from "classnames";

const ITEM_HEIGHT = 48;

const useStyles = makeStyles((theme) => ({
  menuItem: {
    width: 200,
  },
  icon: {
    marginRight: 15,
  },
  menu: {
    top: 60,
  },
  title: {
    backgroundColor: "grey",
    fontWeight: "bold",
  },
}));

export default function IconWithMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const classes = useStyles();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        {props.icon}
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        onClose={handleClose}
        className={classes.menu}
      >
        {props.menu.map((item, idx) => (
          <MenuItem
            key={`menu-item-${idx}`}
            disabled={item.disabled}
            className={classnames(classes.menuItem, classes[item.className])}
            onClick={item.onClick}
          >
            <div className={classes.icon}>{item.icon} </div>
            {item.title && (
              <Typography variant="inherit">{item.title}</Typography>
            )}
            {item.component}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
