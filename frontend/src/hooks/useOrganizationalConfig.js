import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useDataProvider } from "react-admin";
import lodash from 'lodash';

function useOrganizationalConfig() {
    const appConfig = useSelector((state) => state.app.appConfig);
    const { organizational_config } = appConfig;

    return lodash.keys(organizational_config);
  }
  
  export default useOrganizationalConfig;