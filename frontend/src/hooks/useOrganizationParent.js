import { useState, useEffect, useMemo } from "react";
import { useDataProvider } from "react-admin";

function useOrganizationId(orgId) {
  const [selected, setSelected] = useState([]);
  const dataProvider = useDataProvider();

  useEffect(() => {
    dataProvider
      .getOne("organizations", { id: orgId })
      .then((response) => {
        setSelected(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [dataProvider, orgId]);

  return selected;
}

export default useOrganizationId;