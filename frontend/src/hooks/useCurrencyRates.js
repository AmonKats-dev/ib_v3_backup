import { useState, useEffect, useMemo } from "react";
import { useDataProvider } from "react-admin";

function useCurrencyRates() {
  const dataProvider = useDataProvider();
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    dataProvider
      .getListOfAll("currency-rates", {})
      .then((response) => {
        if (response.data && response.data.length) {
          setSelected(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [dataProvider]);

  return selected;
}

export default useCurrencyRates;
