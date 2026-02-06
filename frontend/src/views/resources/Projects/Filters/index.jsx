import { PROJECT_PHASE_STATUS } from "../../../../constants/common";
import { DateInput, Filter, ReferenceInput, TextInput } from "react-admin";
import React from "react";

import { SelectInput } from "react-admin";
import {
  checkFeature,
  useCheckPermissions,
} from "../../../../helpers/checkPermission";
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

const ProjectsFilters = (props) => {
  const { disablePhaseFilter, organizations, programs, ...filterProps } = props;
  const appConfig = useSelector((state) => state.app.appConfig);
  const { organizational_config, programs_config, functions_config } =
    appConfig;
  const checkPermission = useCheckPermissions();

  const workflowFilters = checkPermission("view_ipr_actions")
    ? { is_hidden: false }
    : { is_hidden: false, is_ipr: false };

  return checkFeature("has_filter_panel") ? (
    <Filter
      {...filterProps}
      variant="outlined"
      margin="none"
      style={{ alignItems: "center", flex: "none" }}
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
    </Filter>
  ) : (
    <Filter
      {...filterProps}
      variant="outlined"
      margin="none"
      style={{ alignItems: "center", flex: "none" }}
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
        lodash.keys(organizational_config).map((level) => (
          <CustomFilter
            key={level}
            {...filterProps}
            level={level}
            source={organizational_config[level].id}
            label={organizational_config[level].name}
            organizations={organizations}
            organizational_config={organizational_config}
          />
        ))}
      {programs_config &&
        lodash.keys(programs_config).map((level) => (
          <CustomFilter
            key={level}
            {...filterProps}
            level={level}
            source={`${programs_config[level].id}_id`}
            label={programs_config[level].name}
            organizations={programs}
            organizational_config={programs_config}
          />
        ))}
      {!disablePhaseFilter && (
        <ReferenceInput
          sort={{ field: "sequence", order: "ASC" }}
          perPage={-1}
          source="phase_id"
          reference="phases"
          allowEmpty
        >
          <SelectInput optionText="name" />
        </ReferenceInput>
      )}
      <ReferenceInput
        perPage={-1}
        source="workflow_id"
        reference="workflows"
        allowEmpty
        label="Workflow Status"
        filter={workflowFilters}
      >
        <SelectInput optionText="status_msg" />
      </ReferenceInput>

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

export default ProjectsFilters;
