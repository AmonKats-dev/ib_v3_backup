import React, { Component, useEffect, useMemo, useState } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  TextField,
} from "@material-ui/core";
import ExportActions from "../../pages/reports/ExportActions";
import { EXPORT_TYPES } from "../../../constants/common";
import {
  useDataProvider,
  useNotify,
  useRefresh,
  useTranslate,
} from "react-admin";
import { dateFormatter } from "../../../helpers";
import { DeleteForeverOutlined, EditOutlined } from "@material-ui/icons";
import Tooltip from "@material-ui/core/Tooltip";
import { useCheckPermissions } from "../../../helpers/checkPermission";
import PublicIcon from "@material-ui/icons/Public";
import LockIcon from "@material-ui/icons/Lock";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 500,
    height: "80vh",
    margin: "auto",
    position: "relative",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
    fontWeight: "bold",
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  details: {
    display: "block",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    marginTop: 15,
  },
  item: {
    padding: "10px 5px",
    margin: "10px 0px",
    position: "relative",
    paddingRight: 30,
    "&:hover $contentActions": {
      visibility: "visible",
    },
  },
  divider: {
    margin: "5px auto",
  },
  contentItem: {
    display: "flex",
  },
  contentActions: {
    position: "absolute",
    right: 0,
    top: 20,
    display: "flex",
    flexDirection: "row",
    visibility: "hidden",
  },
  actionIcon: {
    cursor: "pointer",
    marginRight: 10,
  },
  subtitle: {
    fontSize: 8,
  },
  contentItemIcon: {
    marginRight: 10,
  },
}));

function CommentsSection(props) {
  const [publicNote, setPublicNote] = useState(false);
  const [text, setText] = useState("");
  const [commentEdit, setCommentEdit] = useState(null);
  const classes = useStyles();
  const dataProvider = useDataProvider();
  const showNotification = useNotify();
  const refresh = useRefresh();
  const translate = useTranslate();
  const checkPermission = useCheckPermissions();
  const { userInfo } = useSelector((state) => state.user);

  useMemo(() => {
    if (commentEdit) {
      setText(commentEdit.content);
    }
  }, [commentEdit]);

  function checkUserCreator(data) {
    return userInfo && Number(userInfo.id) === Number(data.created_by);
  }

  function handleChange(event) {
    setText(event.target.value);
  }

  function handleSetPublic(event) {
    setPublicNote(event.target.checked);
  }

  function handleSave() {
    if (commentEdit) {
      dataProvider
        .update("comments", {
          id: commentEdit.id,
          data: {
            content: text,
            project_id: props.projectId,
            is_public: publicNote,
          },
        })
        .then((response) => {
          if (response.data) {
            showNotification(translate("comments.edited"));
            setText("");
            setPublicNote(false);
            setCommentEdit(null);
            refresh();
          }
        })
        .catch((err) => {
          showNotification(err, "error");
        });
    } else {
      dataProvider
        .create("comments", {
          data: {
            content: text,
            project_id: props.projectId,
            is_public: publicNote,
          },
        })
        .then((response) => {
          if (response.data) {
            showNotification(translate("comments.created"));
            setText("");
            setPublicNote(false);
            refresh();
          }
        })
        .catch((err) => {
          showNotification(err, "error");
        });
    }
  }

  const handleDelete = (commentId) => () => {
    dataProvider
      .delete("comments", {
        id: commentId,
      })
      .then((response) => {
        if (response.data) {
          showNotification(translate("comments.deleted"));
          refresh();
        }
      })
      .catch((err) => {
        showNotification(err, "error");
      });
  };

  const handleEdit = (comment) => () => {
    setCommentEdit(comment);
    setPublicNote(comment.is_public);
  };

  const isEditable = (item) => {
    if (!item.is_public) return true;

    return checkUserCreator(item) || checkPermission("full_access");
  };

  return (
    <div className={classes.root}>
      {checkPermission("view_comment") && (
        <ExportActions
          reportId="comments-container"
          title="Projects Comments"
          exportTypes={[EXPORT_TYPES.PDF, EXPORT_TYPES.WORD]}
        />
      )}

      {props.data && props.data.length === 0 ? (
        translate("comments.empty")
      ) : (
        <div className={classes.content} id="comments-container">
          {props.data &&
            props.data.map((item) => (
              <div key={item.id} className={classes.item}>
                <div className={classes.contentItem}>
                  {item.is_public ? (
                    <PublicIcon className={classes.contentItemIcon} />
                  ) : (
                    <LockIcon className={classes.contentItemIcon} />
                  )}
                  <div>
                    <Typography variant="h5">{item.content}</Typography>
                    <Typography variant="span" className={classes.subtitle}>
                      {dateFormatter(item.created_on)}
                    </Typography>
                  </div>
                </div>
                {isEditable(item) && (
                  <div className={classes.contentActions}>
                    {checkPermission("edit_comment") && (
                      <Tooltip
                        title={translate("comments.edit_comment")}
                        placement="top"
                      >
                        <EditOutlined
                          className={classes.actionIcon}
                          onClick={handleEdit(item)}
                        />
                      </Tooltip>
                    )}
                    {checkPermission("delete_comment") && (
                      <Tooltip
                        title={translate("comments.delete_comment")}
                        placement="top"
                      >
                        <DeleteForeverOutlined
                          className={classes.actionIcon}
                          onClick={handleDelete(item.id)}
                        />
                      </Tooltip>
                    )}
                  </div>
                )}
                <Divider className={classes.divider} />
              </div>
            ))}
        </div>
      )}
      {checkPermission("edit_comment") && (
        <div className={classes.footer}>
          <TextField
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            onChange={handleChange}
            value={text}
          ></TextField>
          <FormControlLabel
            control={
              <Checkbox checked={publicNote} onChange={handleSetPublic} />
            }
            label="Public note"
          />
          <Button
            variant="contained"
            fullWidth
            color="primary"
            onClick={handleSave}
            className={classes.button}
            disabled={!text}
          >
            {translate("buttons.save")}
          </Button>
        </div>
      )}
    </div>
  );
}

export default CommentsSection;
