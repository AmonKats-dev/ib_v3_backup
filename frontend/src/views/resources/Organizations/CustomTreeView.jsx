import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";

const useStyles = makeStyles({
  root: {
    height: 216,
    flexGrow: 1,
    maxWidth: 400,
  },
});

function renderChildrens() {
  const levels = {};

  function findChildrens(item) {
    levels[item.level] = item.id;

    if (item.children) {
      return findChildrens(item.children);
    }
    return item;
  }
}

export default function CustomTreeView(props) {
  const classes = useStyles();
  const { item } = props;

  if (!item) return null;

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      multiSelect
    >
      <TreeItem nodeId={item.id} label={item.name}>
        {item &&
          item.children &&
          item.children.length > 0 &&
          item.children.map((child) => (
            <TreeItem nodeId={child.id} label={child.name} />
          ))}
      </TreeItem>
    </TreeView>
  );
}
