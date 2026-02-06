import React, { useEffect, useState } from "react";
import lodash from "lodash";
import {
  Checkbox,
  Divider,
  FormControlLabel,
  Tab,
  Tabs,
} from "@material-ui/core";
import { useInput, usePermissions } from "react-admin";

function PermissionConfig(props) {
  const [loading, setLoading] = useState();
  const [checked, setChecked] = useState([]);
  const [activeTab, setActiveTab] = useState("project");
  const [permissions, setPermissions] = useState(getListPermissions);

  function getListPermissions() {
    let permissionsConfig = [];
    if (props.permissionsConfig) {
      lodash.keys(props.permissionsConfig.permissions).forEach((group) => {
        permissionsConfig = [
          ...permissionsConfig,
          ...props.permissionsConfig.permissions[group].map((item) => item.key),
        ];
      });
    }

    return permissionsConfig;
  }

  const {
    input: { onChange },
    meta: { touched, error },
  } = useInput(props);

  useEffect(() => {
    if (props.record) {
      if (props.record.includes("all")) {
        setChecked([...permissions]);
      } else {
        setChecked(props.record);
      }
    }
  }, [props.record]);

  const handleChange = (itemSelected) => (event) => {
    if (itemSelected === "all") {
      let newState = [...permissions];
      if (event.target.checked) {
        setChecked(newState);
      } else {
        newState = [];
        setChecked([]);
      }
      onChange(["all"]);
    } else {
      let newState = [...checked];
      if (lodash.find(checked, (item) => item === itemSelected.key)) {
        newState = newState.filter((item) => item !== itemSelected.key);
        setChecked(newState);
      } else {
        newState.push(itemSelected.key);
        setChecked(newState);
      }
      onChange(newState);
    }
  };

  function handleChangeTab(event, newValue) {
    setActiveTab(newValue);
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h2 style={{ marginRight: "20px" }}>Permissions</h2>
        {/* <FormControlLabel
          control={
            <Checkbox
              checked={
                checked.length &&
                lodash.keys(permissions).length &&
                checked.length === lodash.keys(permissions).length
              }
              onChange={handleChange("all")}
            />
          }
          label="Select All"
        /> */}
      </div>

      <Divider />
      {loading && <h4>loading...</h4>}
      <div>
        <Tabs
          value={activeTab}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChangeTab}
          variant="scrollable"
          scrollButtons="auto"
        >
          {props.permissionsConfig &&
            lodash.keys(props.permissionsConfig.permissions).map((res) => {
              return <Tab value={res} label={<span>{res}</span>}></Tab>;
            })}
        </Tabs>
        {props.permissionsConfig &&
          props.permissionsConfig.permissions[activeTab].map((item) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={
                    !lodash.isEmpty(
                      lodash.find(checked, (it) => it === item.key)
                    )
                  }
                  onChange={handleChange(item)}
                />
              }
              label={item.name}
            />
          ))}
      </div>
    </div>
  );
}

export default PermissionConfig;
