import React from "react";
import { Drawer, makeStyles } from "@material-ui/core";
import CustomTimeline from "../../../../../views/modules/Timeline";
import { useTranslate, Button } from "react-admin";
import { useSelector } from "react-redux";
import CustomComments from "../../../../../views/modules/Comments";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "35px 25px",
    position: "relative",
  },
  title: {
    fontWeight: "bold",
    fontSize: "25px",
    textTransform: "uppercase",
    marginBottom: "15px",
  },
  btnClose: {
    position: "fixed",
    right: "20px",
    top: "15px",
  },
  content: {},
  eventDescriptionTitle: {
    marginBottom: "4px",
  },
  iconWrapper: {
    background: "#3f51b5",
    borderRadius: "50%",
    padding: "10px",
  },
}));

function RightPanelContent(props) {
  const classes = useStyles();
  const translate = useTranslate();
  const { rightPanelContent } = useSelector((state) => state.ui);

  if (!rightPanelContent) return null;

  switch (rightPanelContent.type) {
    case "TIMELINE":
      return (
        <div className={classes.container}>
          <p className={classes.title}>{translate("timeline.title")}</p>
          <br />
          <div className={classes.btnClose}>
            <Button
              label={translate("buttons.close")}
              onClick={props.onToggleDrawer}
            />
          </div>
          <div className={classes.content}>
            <CustomTimeline {...props} />
          </div>
        </div>
      );
    case "COMMENTS":
      return (
        <div className={classes.container}>
          <p className={classes.title}>{translate("comments.title")}</p>
          <br />
          <div className={classes.btnClose}>
            <Button
              label={translate("buttons.close")}
              onClick={props.onToggleDrawer}
            />
          </div>
          <div className={classes.content}>
            <CustomComments {...props} />
          </div>
        </div>
      );
    default:
      return null;
  }
}

function RightPanel(props) {
  const classes = useStyles();

  return (
    <Drawer
      anchor="right"
      open={props.open}
      onClose={props.onToggleDrawer}
      classes={classes.timelineContainer}
    >
      <div tabIndex={0} role="button">
        <RightPanelContent {...props} />
      </div>
    </Drawer>
  );
}

export default RightPanel;
