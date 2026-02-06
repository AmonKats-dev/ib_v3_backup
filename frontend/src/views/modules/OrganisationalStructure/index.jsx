import {
  FormDataConsumer,
  ReferenceInput,
  SelectInput,
  required,
  useDataProvider,
  useTranslate,
} from "react-admin";
import { FormHelperText, IconButton, Typography } from "@material-ui/core";
import React, { Fragment, useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import CustomInput from "../../components/CustomInput";
import { DEFAULT_SORTING } from "../../../constants/common";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import lodash, { cloneDeep, find, isArray } from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import { useFormState } from "react-final-form";
import { useInput } from "react-admin";
import { useSelector } from "react-redux";
import TextField from "@material-ui/core/TextField";
import { checkFeature } from "../../../helpers/checkPermission";
import Autocomplete from "@mui/material/Autocomplete";

function getArrayValues(value, formValues) {
  const field = value.split(".");

  const obj = field[1];
  const array = field[0].split("[")[0];
  const index = field[0].match(/[\d]/gm);

  if (obj.match(/[\d]/gm)) {
    return getArrayValues(
      obj + "." + field[field.length - 1],
      formValues[array][index]
    );
  }

  return formValues && formValues[array] && formValues[array][index]
    ? formValues[array][index][obj]
    : null;
}

function OrganisationalStructure(props) {
  const [structure, setStructure] = useState([]);
  const [selected, setSelected] = useState({});
  const appConfig = useSelector((state) => state.app.appConfig);
  const dataProvider = useDataProvider();
  const maxLevel = props.record ? props.record.level : null;
  const { values } = useFormState();
  const levelConfig = appConfig[props.config];
  const {
    input,
    meta: { touched, error },
  } = useInput(props);

  const pathsInputs = [
    "/organizations",
    "/programs",
    "/costings",
    "/funds",
    "/locations",
    "/functions",
  ];

  if (pathsInputs.includes(props.basePath) && !props.level) {
    props.history.push("/");
  }

  const fieldFormValue = props.field
    ? props.field.match(/[\d]/gm)
      ? getArrayValues(props.field, values)
      : lodash.get(values, props.field)
    : null;

  useEffect(() => {
    const levels = {};

    function findParents(item) {
      if (item && item.level) {
        levels[item.level] = item.id;
      }

      if (item && item.parent) {
        return findParents(item.parent);
      }
      return item;
    }

    if (props.current) {
      setSelected(findParents(props.current));
    } else {
      if (fieldFormValue) {
        findParents(fieldFormValue);
      }
      if (!lodash.isEmpty(levels)) {
        setSelected(levels);
      }
    }
  }, [fieldFormValue, props.current]);

  useEffect(() => {
    const orgFilters = {};

    if (
      props.reference === "organizations" &&
      checkFeature("has_pimis_fields")
    ) {
      orgFilters.is_hidden = false;
    }

    if (props) {
      dataProvider
        .getListOfAll(
          props.reference,
          props.filter ? { filter: props.filter, ...orgFilters } : {}
        )
        .then((response) => {
          if (response.data) {
            const notApplicable = response.data.filter(
              (item) => item.is_hidden
            );
            const allItems = response.data.filter((item) => !item.is_hidden);
            setStructure([...notApplicable, ...allItems]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [props.reference, dataProvider]);

  useEffect(() => {
    if (!lodash.isEmpty(selected)) {
      input.onChange(selected[lodash.max(lodash.keys(selected))]);
    }
  }, [selected]);

  function getParentFilter(item) {
    if (!lodash.isEmpty(selected)) {
      if (selected[item.level - 1]) {
        return selected[item.level - 1];
      }
    }

    return -1;
  }

  const handleChange = (level) => (event) => {
    if (level === lodash.min(lodash.keys(selected))) {
      setSelected({ [level]: event.target.value });
    } else {
      setSelected({ ...selected, [level]: event.target.value });
    }
  };

  if (lodash.isEmpty(levelConfig)) return null;

  function filterForLevel(level) {
    if (props.level) {
      return Number(level) < props.level;
    }
    if (maxLevel) {
      return Number(level) < maxLevel;
    }

    return true;
  }

  const validations = props.isRequired ? [required()] : [];

  function renderLabel(level) {
    if (props.labels) {
      return props.isRequired
        ? props.labels[level] + ""
        : props.labels[level];
    }

    return props.isRequired
      ? levelConfig[level].name + ""
      : levelConfig[level].name;
  }

  const excludeLevelNames = props.excludeLevelNames || [];

  return lodash
    .keys(levelConfig)
    .filter(filterForLevel)
    .filter((level) => !excludeLevelNames.includes(levelConfig[level].name))
    .map((level) => {
      const isNotApplicable =
        !selected[level] &&
        find(structure, (it) => it.id === selected[level - 1])?.code ===
          "0000000000";

      if (props.disablePermissions) {
        props.disablePermissions(isNotApplicable);
      }

      return (
        <CustomInput
          key={level}
          tooltipText={
            props.tooltips
              ? props.tooltips[level]
              : `tooltips.resources.${props.resource}.fields.${levelConfig[level].id}`
          }
          fullWidth
        >
          {(props.basePath === "/users" ||
            props.basePath === "/project-details" ||
            props.basePath === "/locations" ||
            props.basePath === "/projects" ||
            props.basePath === "/cost-reports" ||
            props.basePath === "/investments") && (
            <Fragment>
              {props.config === "programs_config" ? (
                <Autocomplete
                  options={structure
                    .filter((item) => Number(item.level) === Number(level))
                    .filter((item) =>
                      item.parent_id && getParentFilter(item)
                        ? Number(item.parent_id) === Number(getParentFilter(item))
                        : true
                    )
                    .map((item) => ({ id: item.id, name: item.name }))}
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option?.name ?? ""
                  }
                  isOptionEqualToValue={(opt, val) => opt?.id === val?.id}
                  value={(() => {
                    const opts = structure
                      .filter((item) => Number(item.level) === Number(level))
                      .filter((item) =>
                        item.parent_id && getParentFilter(item)
                          ? Number(item.parent_id) === Number(getParentFilter(item))
                          : true
                      );
                    const found = opts.find((i) => i.id === selected[level]);
                    return found ? { id: found.id, name: found.name } : null;
                  })()}
                  onChange={(e, newValue) => {
                    if (newValue == null) {
                      const levels = cloneDeep(selected);
                      for (
                        let index = level;
                        index < Object.keys(selected).length + 1;
                        index++
                      ) {
                        delete levels[index];
                      }
                      setSelected(levels);
                    } else {
                      handleChange(level)({ target: { value: newValue.id } });
                    }
                  }}
                  disableClearable={false}
                  disabled={props.disabled}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label={renderLabel(level) || levelConfig[level].name}
                      required={props.isRequired}
                      error={!!(touched && error) || isNotApplicable}
                      helperText={
                        (touched && error) || (isNotApplicable && "Required")
                      }
                    />
                  )}
                  filterOptions={(options, { inputValue }) =>
                    options.filter((opt) =>
                      (opt.name || "")
                        .toLowerCase()
                        .includes((inputValue || "").toLowerCase())
                    )
                  }
                />
              ) : (
                <>
                  <TextField
                    {...input}
                    select
                    variant="outlined"
                    label={renderLabel(level) || levelConfig[level].name}
                    value={
                      (selected && selected[level]) ||
                      (levelConfig && levelConfig[level].name)
                    }
                    onChange={handleChange(level)}
                    required={props.isRequired}
                    error={!!(touched && error) || isNotApplicable}
                    helperText={
                      (touched && error) || (isNotApplicable && "Required")
                    }
                    disabled={props.disabled}
                    InputProps={{
                      endAdornment: selected && selected[level] && (
                        <IconButton
                          onClick={() => {
                            const levels = cloneDeep(selected);

                            for (
                              let index = level;
                              index < Object.keys(selected).length + 1;
                              index++
                            ) {
                              delete levels[index];
                            }

                            setSelected(levels);
                          }}
                          style={{ position: "relative", right: "25px" }}
                        >
                          <ClearIcon />
                        </IconButton>
                      ),
                    }}
                  >
                    {structure
                      .filter((item) => Number(item.level) === Number(level))
                      .filter((item) =>
                        item.parent_id && getParentFilter(item)
                          ? Number(item.parent_id) === Number(getParentFilter(item))
                          : true
                      )
                      .map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                  </TextField>
                </>
              )}
            </Fragment>
          )}
          {(props.basePath === "/organizations" ||
            props.basePath === "/costings" ||
            props.basePath === "/funds" ||
            props.basePath === "/locations" ||
            props.basePath === "/programs" ||
            props.basePath === "/functions") &&
            (props.config === "programs_config" ? (
              <Autocomplete
                options={structure
                  .filter((item) => Number(item.level) === Number(level))
                  .filter((item) =>
                    item.parent_id && getParentFilter(item)
                      ? Number(item.parent_id) === Number(getParentFilter(item))
                      : true
                  )
                  .map((item) => ({ id: item.id, name: item.name }))}
                getOptionLabel={(option) =>
                  typeof option === "string" ? option : option?.name ?? ""
                }
                isOptionEqualToValue={(opt, val) => opt?.id === val?.id}
                value={(() => {
                  const opts = structure
                    .filter((item) => Number(item.level) === Number(level))
                    .filter((item) =>
                      item.parent_id && getParentFilter(item)
                        ? Number(item.parent_id) === Number(getParentFilter(item))
                        : true
                    );
                  const found = opts.find((i) => i.id === selected[level]);
                  return found ? { id: found.id, name: found.name } : null;
                })()}
                onChange={(e, newValue) => {
                  if (newValue == null) {
                    const levels = cloneDeep(selected);
                    for (
                      let index = level;
                      index < Object.keys(selected).length + 1;
                      index++
                    ) {
                      delete levels[index];
                    }
                    setSelected(levels);
                  } else {
                    handleChange(level)({ target: { value: newValue.id } });
                  }
                }}
                disableClearable={false}
                disabled={props.disabled}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    margin="none"
                    required={props.isRequired}
                    label={levelConfig[level].name + (props.isRequired ? "" : "")}
                    placeholder={
                      levelConfig[level].name + (props.isRequired ? "" : "")
                    }
                    error={!!(touched && error)}
                    helperText={touched && error}
                  />
                )}
                filterOptions={(options, { inputValue }) =>
                  options.filter((opt) =>
                    (opt.name || "")
                      .toLowerCase()
                      .includes((inputValue || "").toLowerCase())
                  )
                }
              />
            ) : (
              <SelectInput
                resettable
                disabled={props.disabled}
                onChange={handleChange(level)}
                validate={validations}
                value={selected[level] || levelConfig[level].name}
                variant="outlined"
                margin="none"
                label={levelConfig[level].name + props.isRequired ? "" : ""}
                placeholder={
                  levelConfig[level].name + props.isRequired ? "" : ""
                }
                source={props.source}
                choices={structure
                  .filter((item) => Number(item.level) === Number(level))
                  .filter((item) =>
                    item.parent_id && getParentFilter(item)
                      ? Number(item.parent_id) === Number(getParentFilter(item))
                      : true
                  )
                  .map((item) => ({ id: item.id, name: item.name }))}
              />
            ))}
        </CustomInput>
      );
    });
}

export default OrganisationalStructure;
