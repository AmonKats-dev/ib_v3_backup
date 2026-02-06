import React, { Fragment } from "react";

import FormControl from "@material-ui/core/FormControl";
import HelpOutline from "@material-ui/icons/HelpOutline";
import Tooltip from "@material-ui/core/Tooltip";
import classNames from "classnames";
import lodash from "lodash";
import useStyles from "./styles";
import { useTranslate } from "react-admin";

const CustomInput = (props) => {
  const translate = useTranslate();
  const classes = useStyles();
  const iconStyle = classNames({
    [classes.icon]: true,
    [classes.iconRight]: props.textArea,
  });
  const contentStyle = classNames({
    [classes.content]: true,
    [classes.contentBoolean]: props.bool,
    [classes.contentDisabled]: props.disabled,
  });

  return (
    <div className={classes.inputWrapper} style={props.style}>
      <div className={contentStyle}>
        <FormControl
          variant="outlined"
          className={classes.formControl}
          fullWidth={props.fullWidth}
          required={props.required}
          error={props.error}
        >
          {props.children}
        </FormControl>
      </div>
      {props.tooltipText && (
        <Tooltip
          title={translate(props.tooltipText) || props.tooltipText}
          placement="right"
        >
          <HelpOutline className={iconStyle} />
        </Tooltip>
      )}
    </div>
  );
};

export default CustomInput;
