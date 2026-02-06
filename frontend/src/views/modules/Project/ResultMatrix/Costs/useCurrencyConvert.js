import { useState, useEffect, useMemo } from "react";
import { useDataProvider } from "react-admin";
import { lodash } from "lodash";

const rates = [
  {
    created_at: "2019-05-07 21:09:19",
    currency: { id: 1, name: "US Dollar", abbr: "USD", sign: "$" },
    currency_id: 1,
    id: 1,
    rate: "3769.60",
  },
];
function useCurrencyConvert(currencyId) {
  const [selected, setSelected] = useState([]);
  const dataProvider = useDataProvider();

  useEffect(() => {
    const resultItem = lodash.find(rates, (item) => item.id === currencyId);
    if (resultItem) {
        setSelected(resultItem.rate);
    }
  }, [dataProvider, currencyId]);

  return selected;
}

export default useCurrencyConvert;
