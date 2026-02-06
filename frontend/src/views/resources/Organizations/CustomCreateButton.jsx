import * as React from "react";
import { FC, ReactElement, memo } from "react";
import PropTypes from "prop-types";
import { Fab, useMediaQuery, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ContentAdd from "@material-ui/icons/Add";
import classnames from "classnames";
import { Link } from "react-router-dom";
import { useTranslate } from "ra-core";

import { Button } from "react-admin";

const CreateButton = (props) => {
  const {
    basePath = "",
    className,
    classes: classesOverride,
    label = "ra.action.create",
    icon = defaultIcon,
    variant,
    ...rest
  } = props;
  const classes = useStyles(props);
  const translate = useTranslate();
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  return isSmall ? (
    <Fab
      component={Link}
      color="primary"
      className={classnames(classes.floating, className)}
      to={{
        pathname: `${basePath}/create`,
        state: { record: { level: props.level, redirect: props.basePath, config: props.config, field: props.field } },
      }}
      aria-label={label && translate(label)}
      {...rest}
    >
      {icon}
    </Fab>
  ) : (
    <Button
      component={Link}
      to={{
        pathname: `${basePath}/create`,
        state: { record: { level: props.level, redirect: props.basePath, config: props.config, field: props.field } },
      }}
      className={className}
      label={label}
      variant={variant}
      {...rest}
    >
      {icon}
    </Button>
  );
};

const defaultIcon = <ContentAdd />;

const useStyles = makeStyles(
  (theme) => ({
    floating: {
      color: theme.palette.getContrastText(theme.palette.primary.main),
      margin: 0,
      top: "auto",
      right: 20,
      bottom: 60,
      left: "auto",
      position: "fixed",
      zIndex: 1000,
    },
    floatingLink: {
      color: "inherit",
    },
  }),
  { name: "RaCreateButton" }
);

CreateButton.propTypes = {
  basePath: PropTypes.string,
  classes: PropTypes.object,
  className: PropTypes.string,
  icon: PropTypes.element,
  label: PropTypes.string,
};

export default memo(CreateButton, (prevProps, nextProps) => {
  return (
    prevProps.basePath === nextProps.basePath &&
    prevProps.label === nextProps.label &&
    prevProps.translate === nextProps.translate &&
    prevProps.to === nextProps.to
  );
});
