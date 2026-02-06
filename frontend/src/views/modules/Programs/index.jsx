import React, { Fragment, useState, useEffect } from "react";
import {
  useTranslate,
  SelectInput,
  ReferenceInput,
  FormDataConsumer,
  required,
  useDataProvider,
} from "react-admin";
import { DEFAULT_SORTING } from "../../../constants/common";

import { useSelector } from "react-redux";
import { useFormState } from "react-final-form";

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { useInput } from "react-admin";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import CustomInput from "../../components/CustomInput";
import lodash from "lodash";
import { FormHelperText } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  tabContainer: {
    display: "flex",
    flexDirection: "column",
  },
  form: {
    "& .MuiCardContent-root": {
      padding: 0,
    },
  },
}));
function Programs(props) {
  const [programs, setPrograms] = useState([]);
  const [selected, setSelected] = useState({});
  const appConfig = useSelector((state) => state.app.appConfig);
  const dataProvider = useDataProvider();

  const { programs_config } = appConfig;
  const {
    input,
    meta: { touched, error },
  } = useInput(props);

  useEffect(() => {
    dataProvider
      .getListOfAll("programs", {})
      .then((response) => {
        setPrograms(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [dataProvider]);

  useEffect(() => {
    if (!lodash.isEmpty(selected)) {
      input.onChange(selected[lodash.max(lodash.keys(selected))]);
    }
  }, [selected, input]);

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

  if (!programs_config) return null;

  return lodash.keys(programs_config).map((level) => {
    return (
      <CustomInput tooltipText="tooltip" fullWidth>
        <InputLabel id={`label_${level}`}>
          {programs_config[level].name}
        </InputLabel>
        <Select
          {...input}
          label={programs_config[level].name}
          value={selected[level]}
          onChange={handleChange(level)}
          errorText={touched && error}
        >
          {programs
            .filter((item) => Number(item.level) === Number(level))
            .filter((item) =>
              item.parent_id && getParentFilter(item)
                ? Number(item.parent_id) === Number(getParentFilter(item))
                : true
            )
            .map((item) => (
              <MenuItem value={item.id}>{item.name}</MenuItem>
            ))}
        </Select>
        <FormHelperText>
          <span>&#8203;</span>
        </FormHelperText>
      </CustomInput>
    );
  });
}

export default Programs;
