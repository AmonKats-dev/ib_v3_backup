import {
  Badge,
  Card,
  CardActions,
  CardContent,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Button, useDataProvider, useNotify, useRefresh } from "react-admin";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import lodash from "lodash";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: "500px",
    },
  },
};

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "25px",
  },
  rootTitle: {
    marginBottom: "20px",
  },
  content: {
    display: "flex",
    gap: "55px",
    width: "100%",
    padding: "25px",
  },
  list: {
    height: "70vh",
    overflow: "auto",
    width: "100%",
    "& .MuiListItem-container": {
      "&:hover $listItemActions": {
        visibility: "visible",
      },
    },
  },
  listContent: {
    width: "100%",
  },
  title: {
    textAlign: "center",
  },
  actions: {
    padding: "20px",
    gap: "20px",
    justifyContent: "space-between",
  },
  iconDelete: {
    color: "#546e7a",
    cursor: "pointer",
  },
  listItem: {},
  listItemActions: {
    visibility: "hidden",
  },
  formControl: {
    justifySelf: "flex-start",
    width: "50%",
  },
}));

const IntegrationsIfmis = () => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <h2 className={classes.rootTitle}>IFMIS Integration</h2>
      <CardActions className={classes.actions}></CardActions>
      <CardContent className={classes.content}>
        <h1>This Integration is in progress...</h1>
      </CardContent>
    </Card>
  );
};

export default IntegrationsIfmis;
