import { Button } from "react-admin";
import ImageEye from "@material-ui/icons/RemoveRedEye";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { linkToRecord } from "ra-core";
import { getCurrentPhaseId } from "../../../../../helpers";
import { useSelector } from "react-redux";
import { useDataProvider, useQueryWithStore } from "react-admin";
import { SettingsSystemDaydreamTwoTone } from "@material-ui/icons";

const stopPropagation = (e) => e.stopPropagation();

const CustomShowButton = ({
  basePath = "",
  label = "ra.action.show",
  record = {},
  icon = <ImageEye />,
  id = "",
  link,
  hasList,
  hasEdit,
  hasShow,
  hasCreate,
  syncWithLocation,
  ...rest
}) => {
  const userInfo = useSelector((state) => state.user.userInfo);
  let phaseLink = getCurrentPhaseId(record, userInfo);

  if (!phaseLink || phaseLink <= 0) {
    phaseLink = record.phase_id;
  }

  return (
    <Button
      component={Link}
      to={
        link || linkToRecord(basePath, record.id) + "/show/" + record.phase_id
      }
      label={label}
      onClick={stopPropagation}
      {...rest}
    >
      {icon}
    </Button>
  );
};

CustomShowButton.propTypes = {
  basePath: PropTypes.string,
  className: PropTypes.string,
  classes: PropTypes.object,
  label: PropTypes.string,
  record: PropTypes.object,
  icon: PropTypes.element,
  id: PropTypes.number,
};

export default CustomShowButton;
