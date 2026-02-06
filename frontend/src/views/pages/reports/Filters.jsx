import React, { useEffect, useState } from "react";
import { Filter, TextInput, ReferenceInput } from "react-admin";
import { useSelector } from "react-redux";
import lodash from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import { SelectInput } from "react-admin";
import { DEFAULT_SORTING } from "../../../constants/common";

const useStyles = makeStyles((theme) => ({
  filterInput: {
    "& .MuiFormHelperText-root ": {
      display: 'none'
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

const ProjectsFilters = (props) => {
  const appConfig = useSelector((state) => state.app.appConfig);
  const { organizational_config } = appConfig;

  return (
    <Filter alwaysOn {...props} variant="outlined" margin="none" style={{ alignItems: 'center'}}>
      {organizational_config &&
        lodash.keys(organizational_config).map((level) => {
          return (
            <CustomFilter
              {...props}
              alwaysOn
              level={level}
              source={organizational_config[level].id}
              label={organizational_config[level].name}
              organizations={props.organizations}
              organizational_config={organizational_config}
            />
          );
        })}
        <ReferenceInput sort={DEFAULT_SORTING} perPage={-1} source="phase_id" reference="phases" allowEmpty>
            <SelectInput optionText="name" />
        </ReferenceInput>
        <SelectInput source="status" choices={[
                { id: 'draft', name: 'Draft' },
                { id: 'submitted', name: 'Submitted' },
                { id: 'revised', name: 'Revised' },
                { id: 'approved', name: 'Approved' },
                { id: 'rejected', name: 'Rejected' },
                { id: 'in pipeline', name: 'In Pipeline' },
                { id: 'completed', name: 'Completed' },
            ]}
        />
    </Filter>
  );
};

export default ProjectsFilters;
