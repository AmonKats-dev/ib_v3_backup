import { useState, useEffect, useMemo } from "react";
import { useDataProvider } from "react-admin";

function useAdditionalFileTypes(phase_id) {
  const dataProvider = useDataProvider();
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    dataProvider
      .getListOfAll("file-types", {})
      .then((response) => {
        if (response.data && response.data.length) {
          const result = response.data.filter(
            (item) =>
              !item.is_required &&
              item.phase_ids &&
              item.phase_ids.includes(phase_id)
          );

          setSelected(result);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [dataProvider, phase_id]);

  return selected;
}

export default useAdditionalFileTypes;
