import { useState, useEffect, useMemo } from "react";
import { useDataProvider } from "react-admin";
import { getFeatureValue } from "../helpers/checkPermission";

function useFileTypes(phase_id, hasRetoolingAttachments) {
  const dataProvider = useDataProvider();
  const [selected, setSelected] = useState([]);
  const retoolingFileType = getFeatureValue(
    "has_retooling_project_attachment",
    phase_id
  );

  useEffect(() => {
    dataProvider
      .getListOfAll("file-types", {
        sort_field: "id",
      })
      .then((response) => {
        if (response.data && response.data.length) {
          const result = response.data
            .filter(
              (item) =>
                item.is_required &&
                item.phase_ids &&
                item.phase_ids.includes(phase_id)
            )
            .filter((item) =>
              hasRetoolingAttachments
                ? item.id === retoolingFileType
                : item.id !== retoolingFileType
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

export default useFileTypes;
