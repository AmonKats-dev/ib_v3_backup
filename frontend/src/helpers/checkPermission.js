import { useInput, usePermissions } from "react-admin";
import lodash from "lodash";
import { getApplicationConfig } from "../constants/config";
import { useCallback, useEffect, useState } from "react";

const config = getApplicationConfig();

export function checkPermission(permissions, permission_key) {
  if (permissions) {
    if (JSON.parse(permissions).includes("full_access")) return true;
    return JSON.parse(permissions).includes(permission_key);
  }

  return false;
}

export function useCheckPermissions() {
  const { isLoading, permissions } = usePermissions();

  return useCallback((permission_key) => {
    if (!permission_key) return true;

    if (!isLoading && permissions) {
      if (JSON.parse(permissions).includes("full_access")) return true;

      if (Array.isArray(permission_key)) {
        const hasOneOf = lodash.intersection(JSON.parse(permissions), permission_key)

        return hasOneOf?.length > 0
      }

      return JSON.parse(permissions).includes(permission_key);
    }

    return false;
  }, [isLoading, permissions])
}

export function checkFeature(featureId, phaseId) {
  if (config && config.features_config && config.features_config[featureId]) {
    if (config.features_config[featureId].is_global) {
      return true;
    } else {
      if (lodash.isArray(config.features_config[featureId].step)) {
        return config.features_config[featureId].step.includes(phaseId);
      } else {
        if (
          Number(config.features_config[featureId].step) === Number(phaseId)
        ) {
          return true;
        }
      }
    }
  }

  return false;
}

export const useChangeField = (fieldName) => {
  const {
    input: { name, onChange, ...rest },
  } = useInput(fieldName);

  return onChange;
};

export function getFeatureValue(featureId, phaseId) {
  if (
    checkFeature(featureId, phaseId) &&
    config.features_config[featureId].value
  ) {
    return config.features_config[featureId].value;
  }

  return false;
}
