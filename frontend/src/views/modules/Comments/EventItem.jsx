import ArrowForward from "@material-ui/icons/ArrowForward";
import Assignment from "@material-ui/icons/Assignment";
import Avatar from "./Avatar";
import Cancel from "@material-ui/icons/Cancel";
import Card from "@material-ui/core/Card";
import Check from "@material-ui/icons/Check";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import Refresh from "@material-ui/icons/Refresh";
import Timeline from "@material-ui/icons/Timeline";
import moment from "moment";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  root: {
    padding: '10px 15px',
  },
  item: {
    width: '100%',
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    padding: "10px",
    paddingLeft: "45px",
    position: "relative",
  },
  status: {
    position: "absolute",
    height: "100%",
    width: "30px",
    right: 0,
    top: 0,
  },
  submit: {
    backgroundColor: "rgba(128, 128, 128, 0.5)",
  },
  approve: {
    backgroundColor: "rgba(0, 128, 0, 0.5)",
  },
  reject: {
    backgroundColor: "rgba(255, 0, 0, 0.8)",
  },
  revise: {
    backgroundColor: "rgba(255, 165, 0, 0.8)",
  },
  assign: {
    backgroundColor: "rgba(232, 232, 0, 0.7)",
  },
  revert: {
    backgroundColor: "rgba(128, 0, 128, 0.5)",
  },
  create: {
    backgroundColor: "rgba(128, 0, 128, 0.5)",
  },
  header: {
    fontWeight: "bold",
    fontSize: "16px",
  },
  title: {
    fontWeight: "bold",
    fontSize: "14px",
  },
  subtitle: {
    fontWeight: "normal",
    fontSize: "12px",
    margin: "0",
    whiteSpace: "normal",
    width: '85%'
  },
  footer: {
    fontSize: "10px",
    margin: "0",
  },
  headerTitle: {
    margin: 0
  }
};


const getActionType = (action) => {
  switch (action) {
    case "CREATE":
      return " create ";
    case "SUBMIT":
      return " has submitted ";
    case "APPROVE":
      return " has approved ";
    case "REJECT":
      return " has rejected ";
    case "REVISE":
      return " has revised ";
    case "ASSIGN":
      return " has assigned ";
    case "REVERT":
      return " has reverted ";
    default:
      return "";
  }
};

const getFormattedStatusText = (username, action, classes) => {
  return (
    <p className={classes.headerTitle}>
      <strong>{username}</strong>
      <strong>{getActionType(action)}</strong>
    </p>
  );
};

const renderIcon = (action) => {
  switch (action) {
    case "CREATE":
      return <Check style={{ fill: "#3f51b5" }} />;
    case "SUBMIT":
      return <Check style={{ fill: "#3f51b5" }} />;
    case "APPROVE":
      return <Check style={{ fill: "#3f51b5" }} />;
    case "REJECT":
      return <Cancel style={{ fill: "#3f51b5" }} />;
    case "REVISE":
      return <Refresh style={{ fill: "#3f51b5" }} />;
    case "ASSIGN":
      return <Assignment style={{ fill: "#3f51b5" }} />;
    case "REVERT":
      return <ArrowForward style={{ fill: "#3f51b5" }} />;
    default:
      return null;
  }
};

const renderStatus = (action, classes) => (
  <div class={`${classes.status} ${classes[action.toLowerCase()]}`} />
);

const EventItemView = ({ event, classes }) => (
  <ListItem className={classes.root}>
    <Card className={classes.item}>
      <ListItemAvatar>
        <Avatar>{renderIcon(event.project_action)}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <div>
            <div className={classes.title}>
              {getFormattedStatusText(event.user.full_name, event.project_action, classes)}
            </div>
            <div className={classes.subtitle}>
              {event.username ? `Username: ${event.username}` : ""}
            </div>
            <div className={classes.subtitle}>
              {event.phase_id ? `Phase: ${event.phase.name}` : ""}
            </div>
            <div className={classes.subtitle}>
              {event.reason ? `Comments: ${event.reason}` : ""}
            </div>
            <br />
            {event.files && event.files.length !== 0 && (
              <div className={classes.subtitle}>
                <span>Files:</span>
                <br />
                <ul style={{ paddingLeft: "15px" }}>
                  {event.files.map((item) => (
                    <li>
                      <a href={item.filename}>{item.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        }
        secondary={
          <div className={classes.footer}>
            {moment(event.created_on)
              .format("DD.MM.YYYY hh:mm")
              .toLocaleString()}
          </div>
        }
      />
      {renderStatus(event.project_action, classes)}
    </Card>
  </ListItem>
);

const EventItem = withStyles(styles)(EventItemView);

export default EventItem;
