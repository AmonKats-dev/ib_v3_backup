import React, { useEffect, useState } from "react";
import { Typography, makeStyles } from "@material-ui/core";
import {
  checkFeature,
  useCheckPermissions,
} from "../../../helpers/checkPermission";

import cn from 'classnames';
import { useRedirect } from "react-admin";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
    marginTop: 50,
    backgroundColor: "#fff",
    padding: 50,
  },
  link: {
    outline: "1px solid #c8e7f2",
    color: "#3f50b5",
    backgroundColor: "#fff",
    padding: "25px",
    fontSize: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: 155,
    height: 155,
    "&:hover": {
      backgroundColor: "#f4fbff",
      cursor: "pointer",
    },
  },
  report: {
    justifyContent: "space-between",
    width: 195,
    height: 180,
  },
  title: {
    marginBottom: 30,
  },
  icon: {
    "& > *": { fontSize: 54, marginBottom: 10 },
  },
  links: {
    paddingTop: 20,
    display: "flex",
    gap: 50,
    alignItems: "center",
    justifyContent: "flex-start",
    flexWrap: "wrap",
  },
  linksGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: "30px",
  },
}));

const CustomPage = (props) => {
  const classes = useStyles();
  const redirect = useRedirect();
  const checkPermission = useCheckPermissions();

  const handleClick = (link) => () => {
    redirect(link);
  };

  return (
    <div className={classes.root}>
      {props.links &&
        props.links.map((item) => (
          <div className={classes.linksGroup}>
            <Typography variant="h4" className={classes.title}>
              {item.title}
            </Typography>
            <div className={classes.links}>
              {item.items
                .filter((btn) => {
                  const hasFeature = btn.feature
                    ? checkFeature(btn.feature)
                    : true;
                  const hasPermission = btn.permission
                    ? checkPermission(btn.permission)
                    : true;
                  return hasFeature && hasPermission;
                })
                .map((btn) => (
                  <div
                    onClick={handleClick(btn.link)}
                    className={cn(classes.link, {
                      [classes.report]: props.isReport,
                    })}
                  >
                    <div className={classes.icon}>{btn.icon}</div>
                    {btn.name}
                  </div>
                ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default CustomPage;
