import {
  DEFAULT_SORTING,
  PROJECT_PHASE_STATUS,
} from "../../../../constants/common";
import {
  DateInput,
  Filter,
  ReferenceInput,
  TextInput,
  translate,
} from "react-admin";
import React, { useEffect, useState } from "react";

import { SelectInput } from "react-admin";
import { checkFeature } from "../../../../helpers/checkPermission";
import { getFiscalYears } from "../../../../helpers/formatters";
import lodash from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  filterInput: {
    "& .MuiFormHelperText-root ": {
      display: "none",
    },
  },
}));

function getChildren(organizations, id) {
  return organizations.filter((item) => Number(item.parent_id) === Number(id));
}

const CustomFilter = (props) => {
  let parentLevel, filterItems;
  const classes = useStyles();
  if (Number(props.level)) {
    parentLevel = `${Number(props.level) - 1}`;
  }

  filterItems = props.organizations.filter(
    (item) => Number(props.level) === Number(item.level)
  );

  if (props.filterValues && !lodash.isEmpty(props.filterValues)) {
    lodash.keys(props.filterValues).forEach((key) => {});

    const parrentLevelId =
      props.organizational_config[parentLevel] &&
      props.organizational_config[parentLevel].id;

    if (props.filterValues[parrentLevelId]) {
      filterItems = filterItems.filter(
        (item) =>
          Number(item.parent_id) === Number(props.filterValues[parrentLevelId])
      );
    }
  }

  return (
    <SelectInput
      className={classes.filterInput}
      choices={filterItems}
      source={props.source}
      label={props.label}
      variant="outlined"
      margin="none"
    />
  );
};

const ProjectsListFilters = (props) => {
  const appConfig = useSelector((state) => state.app.appConfig);
  const { organizational_config, programs_config, functions_config } =
    appConfig;

  return (
    <Filter
      {...props}
      variant="outlined"
      margin="none"
      style={{ alignItems: "center" }}
    >
      <TextInput
        label="Project Number"
        source="code"
        alwaysOn
        variant="outlined"
        margin="none"
      />
      <TextInput
        label="Project Title"
        source="name"
        alwaysOn
        variant="outlined"
        margin="none"
      />
      {organizational_config &&
        lodash.keys(organizational_config).map((level) => {
          return (
            <CustomFilter
              {...props}
              level={level}
              source={organizational_config[level].id}
              label={organizational_config[level].name}
              organizations={props.organizations}
              organizational_config={organizational_config}
            />
          );
        })}
      <SelectInput
        source="project_status"
        choices={lodash.keys(PROJECT_PHASE_STATUS).map((status) => ({
          id: status,
          name: PROJECT_PHASE_STATUS[status],
        }))}
      />
      <SelectInput source="start_date" choices={getFiscalYears()} />
      <SelectInput source="end_date" choices={getFiscalYears()} />
      <DateInput source="created_on_start" />
      <DateInput source="created_on_end" />
      <DateInput source="submission_date_start" />
      <DateInput source="submission_date_end" />
    </Filter>
  );
};

export default ProjectsListFilters;
