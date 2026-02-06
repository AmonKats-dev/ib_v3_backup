import {
  Box,
  Card,
  Checkbox,
  Tab,
  TableCell,
  TableRow,
  Tabs,
} from "@material-ui/core";
import { find } from "lodash";
import React from "react";
import { useEffect } from "react";
import { useTranslate } from "react-admin";
import { RESOURCES } from "./constants";

const PHASES = {
  1: "Concept",
  2: "Proposal",
  // 3: "Initialization",
  // 4: "Implementation",
  // 5: "Ex-Post Evaluation",
};

const VALIDATIONS = {
  required: "required",
  minLen: "minLen",
  maxLen: "maxLen",
  string: "string",
  email: "email",
  number: "number",
};

const ValidationField = ({ item, onChange }) => {
  const t = useTranslate();
  const [isRequired, setIsRequired] = React.useState(
    item.validation.includes("required")
  );
  const [isRequiredPhases, setIsRequiredPhases] = React.useState({
    1: item.phases.includes(1) || item.phases.includes("1"),
    2: item.phases.includes(2) || item.phases.includes("2"),
  });
  const [isRequiredInner, setIsRequiredInner] = React.useState(
    item.innerFields
  );

  useEffect(() => {
    setIsRequired(item.validation.includes("required"));
    setIsRequiredPhases({
      1: item.phases.includes(1) || item.phases.includes("1"),
      2: item.phases.includes(2) || item.phases.includes("2"),
    });
    setIsRequiredInner(item.innerFields);
  }, [item.innerFields, item.phases, item.validation]);

  const updateParams = (
    req = isRequired,
    phases = isRequiredPhases,
    inner = isRequiredInner
  ) => {
    const required = req ? "required" : null;
    const params = {
      ...item,
      validation: [required].filter(Boolean),
      phases: Object.keys(phases)
        .filter((key) => Boolean(phases[key]))
        .map((it) => Number(it)),
    };

    if (item.innerFields) {
      params.innerFields = inner;
    }
    onChange(params);
  };

  const handleChangeRequired = (event) => {
    setIsRequired(event.target.checked);

    updateParams(event.target.checked, isRequiredPhases, isRequiredInner);
  };

  const handleChangePhases = (event) => {
    const phases = {
      ...isRequiredPhases,
      [event.target.name]: event.target.checked,
    };
    setIsRequiredPhases(phases);

    updateParams(isRequired, phases, isRequiredInner);
  };

  const handleChangeInnerFields = (event) => {
    const inner = isRequiredInner.map((item) => {
      const field = Object.keys(item)[0];

      if (field === event.target.name) {
        return { [field]: event.target.checked };
      }

      return item;
    });

    setIsRequiredInner(inner);

    updateParams(isRequired, isRequiredPhases, inner);
  };

  const innerFields = item?.innerFields?.map((it) => {
    const field = Object.keys(it)[0];
    const value = it[field];

    return (
      <TableRow key={field}>
        <TableCell style={{ paddingLeft: 45 }}>
          <b>{t(`validationFields.${item.field}_${field}`)}</b>
        </TableCell>
        <TableCell>
          <Checkbox
            onChange={handleChangeInnerFields}
            value={value}
            checked={value}
            name={field}
            disabled={!isRequired}
          />
        </TableCell>
        <TableCell></TableCell>
      </TableRow>
    );
  });

  return [
    <TableRow>
      <TableCell style={{ padding: 15 }}>
        <b>{t("validationFields." + item.field)}</b>
      </TableCell>

      <TableCell>
        <Checkbox
          onChange={handleChangeRequired}
          value={isRequired}
          checked={isRequired}
        />
      </TableCell>
      <TableCell style={{ display: "flex" }}>
        {Object.keys(PHASES).map((key) => {
          return (
            <div>
              <Checkbox
                onChange={handleChangePhases}
                value={isRequired}
                name={key}
                key={key}
                checked={isRequiredPhases[key]}
                disabled={!isRequired}
              />
              <span>{PHASES[key]}</span>
            </div>
          );
        })}
      </TableCell>
    </TableRow>,
    innerFields,
  ];
};

export default ValidationField;
