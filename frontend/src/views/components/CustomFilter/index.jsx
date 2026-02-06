import React, { useEffect, useState } from "react";
import lodash from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import { SelectInput } from "react-admin";

const useStyles = makeStyles((theme) => ({
  filterInput: {
    "& .MuiFormHelperText-root ": {
      display: "none",
    },
  },
}));

const CustomFilter = (props) => {
  let parentLevel, filterItems;
  const classes = useStyles();
  if (Number(props.level)) {
    parentLevel = `${Number(props.level) - 1}`;
  }

  filterItems = props.organizations?.filter(
    (item) => Number(props.level) === Number(item.level)
  );

  if (props.filterValues && !lodash.isEmpty(props.filterValues)) {
    lodash.keys(props.filterValues).forEach((key) => {});

    const parrentLevelId = props.organizational_config[parentLevel]?.id;

    if (props.filterValues[parrentLevelId]) {
      filterItems = filterItems.filter(
        (item) =>
          Number(item.parent_id) === Number(props.filterValues[parrentLevelId])
      );
    }
  }

  return (
    <SelectInput
      {...props}
      className={classes.filterInput}
      choices={filterItems}
      source={props.source}
      label={props.label}
      variant="outlined"
      margin="none"
    />
  );
};

export default CustomFilter;
