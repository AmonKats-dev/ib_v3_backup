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

const ITEM_HEIGHT = 48;

const useStyles = makeStyles((theme) => ({
  menuItem: {
    width: 150,
  },
  icon: {
    marginRight: 15,
  },
}));

export default function MobileActions() {
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
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
      >
        <MenuItem className={classes.menuItem}>
          <Badge badgeContent={9999} color="primary" overlap="rectangular" className={classes.icon}>
            <NotificationsIcon />
          </Badge>
          <Typography variant="inherit">Notifications</Typography>
        </MenuItem>

        <MenuItem className={classes.menuItem}>
          <PersonIcon  className={classes.icon}/>
          <Typography variant="inherit">Profile</Typography>
        </MenuItem>

        <MenuItem className={classes.menuItem}>
          <HelpOutlineIcon  className={classes.icon}/>
          <Typography variant="inherit">Help</Typography>
        </MenuItem>

        <MenuItem className={classes.menuItem}>
          <InputIcon  className={classes.icon}/>
          <Typography variant="inherit">Logout</Typography>
        </MenuItem>
      </Menu>
    </div>
  );
}
