import mzb from "../mzb.json";
import ug from "../ug.json";
import jm from "../jm.json";

export const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";
export const ADMIN_API_URL =
  process.env.REACT_ADMIN_API_URL || "http://localhost:5000/api/admin";
export const STATIC_URL =
  process.env.REACT_APP_STATIC_URL || "http://localhost:3000";

// export const API_URL =
//   process.env.REACT_APP_API_URL || "https://ibp-api.finance.go.ug/api/v1";
// export const ADMIN_API_URL =
//   process.env.REACT_ADMIN_API_URL || "https://ibp-api.finance.go.ug/api/admin";
// export const STATIC_URL =
//   process.env.REACT_APP_STATIC_URL || "https://ibp.finance.go.ug";

// export const API_URL =
//   process.env.REACT_APP_API_URL || "http://ibpdemo-api.finance.go.ug/api/v1";
// export const ADMIN_API_URL =
//   process.env.REACT_ADMIN_API_URL ||
//   "http://ibpdemo-api.finance.go.ug/api/admin";
// export const STATIC_URL =
//   process.env.REACT_APP_STATIC_URL || "http://ibpdemo.finance.go.ug";

export const APP_CONFIG = process.env.REACT_APP_APP_CONFIG || "ug";
export const SESSION_TIMEOUT = 900000;

const appConfiguration = {
  ug,
  jm,
  mzb,
};

export function getApplicationConfig() {
  return appConfiguration[APP_CONFIG];
}

export const RELEASE_VERSION = "3.9.4";
