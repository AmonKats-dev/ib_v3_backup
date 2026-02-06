import * as React from "react";
import { Form } from "react-final-form";
import {
  Box,
  Button,
  Drawer,
  InputAdornment,
  Typography,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import {
  TextInput,
  NullableBooleanInput,
  useListContext,
  ReferenceInput,
  SelectInput,
  DateInput,
  useDataProvider,
} from "react-admin";
import { PROJECT_PHASE_STATUS } from "../../../../constants/common";
import lodash from "lodash";
import { getFiscalYears } from "../../../../helpers/formatters";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { useCheckPermissions } from "../../../../helpers/checkPermission";

const useStyles = makeStyles((theme) => ({
  filterInput: {
    width: "200px",
    "& .MuiFormHelperText-root ": {
      display: "none",
    },
  },
  filters: {
    "& .MuiDrawer-paperAnchorRight": {
      width: "38%",
    },
  },
}));

const getFilteredItems = (items, filterValue) => {
  return items.filter((item) =>
    filterValue ? item.parent_id === filterValue : true
  );
};

const CustomFilter = (props) => {
  let parentLevel, filterItems;
  const classes = useStyles();

  if (Number(props.level)) {
    parentLevel = `${Number(props.level) - 1}`;
  }

  filterItems = props.items.filter(
    (item) => Number(props.level) === Number(item.level)
  );

  if (props.filterValues && !lodash.isEmpty(props.filterValues)) {
    lodash.keys(props.filterValues).forEach((key) => {});

    const parrentLevelId =
      props.config[parentLevel] && props.config[parentLevel].id;

    if (props.filterValues[parrentLevelId]) {
      filterItems = filterItems.filter(
        (item) =>
          Number(item.parent_id) === Number(props.filterValues[parrentLevelId])
      );
    }
  }

  if (filterItems && filterItems.length === 0) {
    return (
      <SelectInput
        className={classes.filterInput}
        source={props.source}
        label={"Not Available"}
        variant="outlined"
        margin="none"
        disabled
      />
    );
  }

  const notApplicable = filterItems.filter(
    (item) => item.is_hidden
  );
  const allItems = filterItems.filter((item) => !item.is_hidden);
  
  return (
    <SelectInput
      className={classes.filterInput}
      choices={[...notApplicable, ...allItems]}
      source={props.source}
      label={props.label}
      variant="outlined"
      margin="none"
      onChange={props.onChange}
      value={props.filterValue}
      disabled={props.disabled}
    />
  );
};

const FiltersSidebar = (props) => {
  const [programs, setPrograms] = React.useState([]);
  const [functions, setFunctions] = React.useState([]);
  const [organizations, setOrganizations] = React.useState([]);
  const [filtersValues, setFiltersValues] = React.useState({
    organizations: null,
    programs: null,
    functions: null,
  });
  const dataProvider = useDataProvider();
  const classes = useStyles();

  React.useEffect(() => {
    dataProvider
      .getListOfAll("organizations", {})
      .then((response) => {
        setOrganizations(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    dataProvider
      .getListOfAll("programs", {})
      .then((response) => {
        setPrograms(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    dataProvider
      .getListOfAll("functions", {})
      .then((response) => {
        setFunctions(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const { displayedFilters, filterValues, setFilters, hideFilter } =
    useListContext();

  const checkPermission = useCheckPermissions();

  const appConfig = useSelector((state) => state.app.appConfig);
  const { organizational_config, programs_config, functions_config } =
    appConfig;

  if (displayedFilters && !displayedFilters.main) return null;

  const onSubmit = (values) => {
    if (Object.keys(values).length > 0) {
      const filtersQuery = {};
      Object.keys(values).forEach((key) => {
        switch (key) {
          case "function":
          case "sub_function":
            filtersQuery["function_id"] = values[key];
            break;
          case "program":
          case "sub_program":
            filtersQuery["program_id"] = values[key];
            break;
          case "ministry":
          case "departments":
          case "public_body":
            filtersQuery["organization_id"] = values[key];
            break;
          default:
            filtersQuery[key] = values[key];
            break;
        }
      });

      setFilters(filtersQuery);
    } else {
      hideFilter("main");
    }
  };

  const resetFilter = () => {
    setFilters({}, []);
  };

  const handleChangeFilter = (filter, level) => (event) => {
    setFiltersValues((prevValues) => {
      return {
        ...prevValues,
        [filter]: { ...prevValues[filter], [level]: event.target.value },
      };
    });
  };

  return (
    <Drawer
      anchor="right"
      open={displayedFilters && displayedFilters.main}
      onClose={() => hideFilter("main")}
      className={classes.filters}
    >
      <Typography
        variant="h3"
        style={{ textAlign: "right", padding: "15px 25px" }}
      >
        Filters Panel
      </Typography>
      <Form onSubmit={onSubmit} initialValues={filterValues}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit} style={{ padding: 25 }}>
            <Box
              display="flex"
              flexDirection="column"
              mb={1}
              gridGap={"10px"}
              gridRowGap={"10px"}
            >
              <Typography variant="h5">Projects Filter</Typography>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                gridGap={10}
                flexWrap="wrap"
              >
                <TextInput
                  label="Project Title"
                  source="name"
                  alwaysOn
                  variant="outlined"
                  margin="none"
                />
                {checkPermission("full_access") && (
                  <TextInput
                    label="Project Number"
                    source="code"
                    alwaysOn
                    variant="outlined"
                    margin="none"
                  />
                )}
              </Box>
              <Typography variant="h5">Organization Filter</Typography>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                gridGap={10}
                flexWrap="wrap"
              >
                {organizational_config &&
                  lodash.keys(organizational_config).map((level) => {
                    // const items =  level == 1 ? organizations :
                    return (
                      <CustomFilter
                        {...props}
                        level={level}
                        source={organizational_config[level].id}
                        label={organizational_config[level].name}
                        items={
                          level == 1
                            ? organizations
                            : getFilteredItems(
                                organizations,
                                filtersValues.organizations &&
                                  filtersValues.organizations[level - 1]
                              )
                        }
                        config={organizational_config}
                        onChange={handleChangeFilter("organizations", level)}
                        filterValue={
                          filtersValues.organizations &&
                          filtersValues.organizations[level]
                        }
                        disabled={
                          level > 1 &&
                          !filtersValues?.organizations?.[level - 1]
                        }
                      />
                    );
                  })}
              </Box>
              <Typography variant="h5">Program Filter</Typography>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                gridGap={10}
                flexWrap="wrap"
              >
                {programs_config &&
                  lodash.keys(programs_config).map((level) => {
                    return (
                      <CustomFilter
                        {...props}
                        level={level}
                        source={programs_config[level].id}
                        label={programs_config[level].name}
                        items={
                          level == 1
                            ? programs
                            : getFilteredItems(
                                programs,
                                filtersValues.programs &&
                                  filtersValues.programs["1"]
                              )
                        }
                        config={programs_config}
                        onChange={handleChangeFilter("programs", level)}
                        filterValue={
                          filtersValues.programs &&
                          filtersValues.programs[level]
                        }
                      />
                    );
                  })}
              </Box>
              <Typography variant="h5">Functions Filter</Typography>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                gridGap={10}
                flexWrap="wrap"
              >
                {functions_config &&
                  lodash.keys(functions_config).map((level) => {
                    return (
                      <CustomFilter
                        {...props}
                        level={level}
                        source={functions_config[level].id}
                        label={functions_config[level].name}
                        items={
                          level == 1
                            ? functions
                            : getFilteredItems(
                                functions,
                                filtersValues.functions &&
                                  filtersValues.functions["1"]
                              )
                        }
                        config={functions_config}
                        onChange={handleChangeFilter("functions", level)}
                        filterValue={
                          filtersValues.functions &&
                          filtersValues.functions[level]
                        }
                      />
                    );
                  })}
              </Box>

              {!props.disablePhaseFilter && (
                <>
                  <Typography variant="h5">Phase Filter</Typography>
                  <ReferenceInput
                    sort={{ field: "sequence", order: "ASC" }}
                    perPage={-1}
                    source="phase_id"
                    reference="phases"
                    variant="outlined"
                    margin="none"
                    allowEmpty
                  >
                    <SelectInput
                      optionText="name"
                      variant="outlined"
                      margin="none"
                    />
                  </ReferenceInput>
                </>
              )}

              <Typography variant="h5">Project Status Filter</Typography>
              <SelectInput
                variant="outlined"
                margin="none"
                source="project_status"
                choices={lodash.keys(PROJECT_PHASE_STATUS).map((status) => ({
                  id: status,
                  name: PROJECT_PHASE_STATUS[status],
                }))}
              />
              <Typography variant="h5">Project dates</Typography>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                gridGap={10}
                flexWrap="wrap"
              >
                <SelectInput
                  source="start_date"
                  choices={getFiscalYears()}
                  variant="outlined"
                  margin="none"
                  className={classes.filterInput}
                />
                <SelectInput
                  source="end_date"
                  choices={getFiscalYears()}
                  variant="outlined"
                  margin="none"
                  className={classes.filterInput}
                />
              </Box>
              <Typography variant="h5">Projects creation dates</Typography>
              <br />
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                gridGap={10}
                flexWrap="wrap"
              >
                <DateInput
                  source="created_on_start"
                  variant="outlined"
                  margin="none"
                />
                <DateInput
                  source="created_on_end"
                  variant="outlined"
                  margin="none"
                />
              </Box>
              <Typography variant="h5">Projects submissions dates</Typography>
              <br />
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                gridGap={10}
                flexWrap="wrap"
              >
                <DateInput
                  source="submission_date_start"
                  variant="outlined"
                  margin="none"
                />
                <DateInput
                  source="submission_date_end"
                  variant="outlined"
                  margin="none"
                />
              </Box>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                mr={2}
              >
                <Box component="span" mr={2} mb={1.5}>
                  <Button variant="contained" color="primary" type="submit">
                    Apply Filters
                  </Button>
                </Box>
                <Box component="span" mb={1.5}>
                  <Button variant="outlined" onClick={resetFilter}>
                    Clear Filters
                  </Button>
                </Box>
              </Box>
            </Box>
          </form>
        )}
      </Form>
    </Drawer>
  );
};

export default FiltersSidebar;
