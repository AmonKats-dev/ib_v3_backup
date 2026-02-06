import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import InboxIcon from "@material-ui/icons/Inbox";
import lodash from "lodash";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
  },
  item: {
    margin: "8px auto",
  },
}));

export default function ReportList(props) {
  const classes = useStyles();

  const handleClick = (id) => () => {
    props.onLoad(id);
  };

  return (
    <div >
      <List className={classes.root} component="nav" aria-label="main mailbox folders">
        {lodash.keys(props.items).map((item) => [
          <ListItem button onClick={handleClick(item)} className={classes.item}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary={item} />
          </ListItem>,
          <Divider orientation="vertical" flexItem />,
        ])}
      </List>
      <Divider />
    </div>
  );
}
