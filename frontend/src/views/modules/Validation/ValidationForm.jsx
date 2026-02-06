import {
  Box,
  Button,
  Card,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
} from "@material-ui/core";
import { cloneDeep, find, groupBy } from "lodash";
import React from "react";
import { useEffect } from "react";
import { useDataProvider, useNotify, useTranslate } from "react-admin";
import { RESOURCES, VALIDATION_FIELDS } from "./constants";
import ValidationField from "./ValidationField";

const ValidationForm = () => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const t = useTranslate();

  const [validationsFields, setValidationsFields] =
    React.useState(VALIDATION_FIELDS);
  const [resource, setResource] = React.useState(0);
  const [step, setStep] = React.useState(0);

  const [paramId, setParamId] = React.useState(null);
  const [paramValue, setParamValue] = React.useState(null);

  useEffect(() => {
    dataProvider
      .getListOfAll("parameters", { sort_field: "id" })
      .then((response) => {
        if (response && response.data) {
          const data = find(
            response.data,
            (it) => it.param_key === "validation"
          );
          if (data && data.param_value) {
            setParamId(data.id);
            if (data.param_value && data.param_value.length > 0)
              setValidationsFields(
                formatStateValuesFromParams(data.param_value)
              );
          }
        }
      });
  }, []);

  const formatStateValues = (values) => {
    const grPr = groupBy(values, "resource");
    const grPrSec = Object.keys(grPr).map((resKey) => {
      const grSec = groupBy(grPr[resKey], "step");

      return {
        [resKey]: grSec,
      };
    })[0];

    return grPrSec;
  };

  const formatStateValuesFromParams = (values) => {
    const requiredFields = values.filter((item) =>
      item.validation.includes("required")
    );
    const res = VALIDATION_FIELDS.map((item) => {
      const selItem = find(values, (it) => it.field === item.field);

      item.validation = find(requiredFields, (it) => it.field === item.field)
        ? ["required"]
        : [];
      if (item.innerFields) {
        item.innerFields = item.innerFields.map((it) => {
          const field = Object.keys(it)[0];
          return {
            [field]: selItem ? selItem.innerFields.includes(field) : false,
          };
        });
      }

      item.phases = selItem ? selItem.phases : item.phases;

      return item;
    });

    return res;
  };

  const formattedStateValues = formatStateValues(validationsFields);

  const res = Object.keys(formattedStateValues);
  const sec = Object.keys(formattedStateValues[res[resource]]);
  const fields = formattedStateValues[res[resource]][sec[step]];

  const handleChangeStep = (event, newValue) => {
    setStep(newValue);
  };

  const handleSave = () => {
    const result = validationsFields
      .filter((item) => item.validation.includes("required"))
      .map((item) => {
        if (item.innerFields) {
          item.innerFields = item.innerFields
            .filter((it) => {
              return it[Object.keys(it)[0]] === true;
            })
            .map((it) => {
              return Object.keys(it)[0];
            });
        }
        return item;
      });

    if (paramId) {
      const requestParams = {
        id: paramId,
        is_hidden: true,
        param_key: "validation",
        param_value: result,
      };

      dataProvider
        .update("parameters", { id: paramId, data: { ...requestParams } })
        .then((res) => {
          if (res) notify("validation updated");
        })
        .catch((err) => notify("validation saving error"));
    }
  };

  const handleChangeValidation = (fieldData) => {
    const newFields = fields.map((item) => {
      if (item.id === fieldData.id) {
        return fieldData;
      }
      return item;
    });

    const newState = cloneDeep(formattedStateValues);

    const res = Object.keys(newState);
    const sec = Object.keys(newState[res[resource]]);

    newState[res[resource]][sec[step]] = newFields;

    setValidationsFields((prev) =>
      prev.map((it) => {
        if (it.id === fieldData.id) return fieldData;
        return it;
      })
    );
  };

  return (
    <Card>
      <Tabs
        variant="scrollable"
        value={step}
        onChange={handleChangeStep}
        style={{ overflowX: "auto" }}
        scrollButtons="on"
      >
        {sec.map((item) => (
          <Tab label={t(`projectSteps.${item}`)} key={item} />
        ))}
      </Tabs>

      {fields && (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Field</TableCell>
                <TableCell>Is Required</TableCell>
                <TableCell>Phases</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fields.map((item) => {
                return (
                  <ValidationField
                    item={item}
                    key={item.id}
                    onChange={handleChangeValidation}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <div
        style={{
          padding: 10,
          display: "flex",
          justifyContent: "flex-end",
          gap: 15,
        }}
      >
        <Button>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </div>
    </Card>
  );
};

export default ValidationForm;
