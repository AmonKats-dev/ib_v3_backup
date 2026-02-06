import { Button } from "react-admin";
import React from "react";
import PropTypes from "prop-types";
import ContentCreate from "@material-ui/icons/Create";
import { Link } from "react-router-dom";

const stopPropagation = (e) => e.stopPropagation();

const CustomLinkButton = ({
  basePathLink = "",
  label = "ra.action.edit",
  record = {},
  icon = <ContentCreate />,
  lastDetailId = "",
  ...rest
}) => (
  <Button
    component={Link}
    to={`${basePathLink}`}
    label={label}
    onClick={stopPropagation}
    {...rest}
  >
    {icon}
  </Button>
);

CustomLinkButton.propTypes = {
  basePath: PropTypes.string,
  className: PropTypes.string,
  classes: PropTypes.object,
  label: PropTypes.string,
  record: PropTypes.object,
  icon: PropTypes.element,
  id: PropTypes.number,
};

export default CustomLinkButton;
