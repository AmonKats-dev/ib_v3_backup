import { find } from "lodash";
import { useEffect, useState } from "react";
import { useDataProvider } from "react-admin";

const useSystemParams = (paramName) => {
  const [param, setParam] = useState();

  const dataProvider = useDataProvider();

  useEffect(() => {
    dataProvider
      .getListOfAll("parameters", { sort_field: "id" })
      .then((response) => {
        if (response && response.data) {
          const data = find(response.data, (it) => it.param_key === paramName);
          if (data && data.param_value) {
            setParam(data);
          }
        }
      });
  }, [dataProvider, paramName]);

  return param;
};

export default useSystemParams;
