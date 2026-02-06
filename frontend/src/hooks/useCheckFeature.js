import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import lodash from "lodash";

function useCheckFeature(featureId, phaseId) {
  const { features_config } = useSelector((state) => state.app.appConfig);
  const [hasFeature, setHasFeature] = useState(false);

  useMemo(() => {
    if (features_config && features_config[featureId]) {
      if (features_config[featureId].is_global) {
        return setHasFeature(true);
      } else {
        if (phaseId) {
          if (lodash.isArray(features_config[featureId].step)) {
            setHasFeature(features_config[featureId].step.includes(phaseId));
          } else {
            setHasFeature(
              Number(features_config[featureId].step) === Number(phaseId)
            );
          }
        }
      }
    }
  }, [featureId, phaseId, features_config]);

  return hasFeature;
}

export default useCheckFeature;
