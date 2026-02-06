import {
  REFRESH_TOKEN,
  TOKEN,
  USER,
  PERMISSIONS,
  PREFERRED_ROLE_KEY,
  REFRESH_TIME,
  CHART_VIEW,
  IS_AUTH,
  RESET_PASSWORD_PAGE,
  VALIDATION
} from "../../constants/auth";
import JWT from "jwt-decode";
import { API_URL } from "../../constants/config";
import { setUserInformation } from "../../actions/userRoles";
import { fetchUtils } from "ra-core";
import lodash from "lodash";
import moment from "moment";

const defaultHttpClient = (url) => {
  const token = localStorage.getItem(TOKEN);
  const options = {};

  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  if (token) {
    options.headers.set("Authorization", `Bearer ${token}`);
  }

  return fetchUtils.fetchJson(url, options);
};

export default {
  switchRole: ({ role_id, success }) => {
    const token = localStorage.getItem(TOKEN);
    const request = new Request(`${API_URL}/auth/switch`, {
      method: "POST",
      body: JSON.stringify({ role_id }),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }),
    });
    return fetch(request)
      .then((response) => {
        if (response.status === 401) {
          throw new Error("Incorrect role identity.");
        }
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(({ access_token, refresh_token }) => {
        if (access_token) {
          var decoded = JWT(access_token);
          localStorage.setItem(TOKEN, access_token);
          localStorage.setItem(REFRESH_TOKEN, refresh_token);

          return defaultHttpClient(`${API_URL}/users/me`).then((resp) => {
            if (resp.status === 200) {
              const data = resp.json;
              const { user_roles = [], organization } = data;
              const identity = decoded.identity || decoded.sub;
              const hasCurrentRole = identity && typeof identity === "object" && identity.current_role;
              const currentRole = hasCurrentRole
                ? lodash.find(user_roles, (r) => r.role_id === identity.current_role.role_id)
                : (user_roles && user_roles[0]) || null;
              const userInfo = {
                ...(typeof identity === "object" && identity !== null ? identity : { id: identity }),
                ...data,
                organization,
                current_role: currentRole
                  ? { role_id: currentRole.role_id, role: currentRole.role }
                  : (hasCurrentRole ? identity.current_role : null),
              };
              const perms = (currentRole && currentRole.role && currentRole.role.permissions) || [];
              localStorage.setItem(PERMISSIONS, JSON.stringify(perms));
              localStorage.setItem(USER, JSON.stringify(userInfo));
              if (userInfo.current_role && userInfo.current_role.role_id) {
                localStorage.setItem(PREFERRED_ROLE_KEY, String(userInfo.current_role.role_id));
              }
              success(setUserInformation(userInfo));
              window.location.href = "/";
            }
          });
        } else {
          throw new Error("Incorrect username and password.");
        }
      });
  },
  login: ({ username, password, success }) => {
    const request = new Request(`${API_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    return fetch(request)
      .then((response) => {
        if (response.status === 401) {
          throw new Error("Incorrect username and password.");
        }
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(({ access_token, refresh_token, password_expired }) => {
        if (password_expired) {
          success.reset(access_token);
          throw new Error("password_expired");
        } else {
          if (access_token) {
            var decoded = JWT(access_token);
            localStorage.setItem(TOKEN, access_token);
            localStorage.setItem(REFRESH_TOKEN, refresh_token);
            localStorage.removeItem(RESET_PASSWORD_PAGE);

            return defaultHttpClient(`${API_URL}/users/me`).then((resp) => {
              if (resp.status !== 200) return;
              const data = resp.json;
              const { user_roles = [], organization } = data;
              // Login JWT has identity in 'sub' as int; some backends use 'identity'
              const identity = decoded.identity || decoded.sub;
              const hasCurrentRole = identity && typeof identity === "object" && identity.current_role;
              let currentRole = hasCurrentRole
                ? lodash.find(user_roles, (r) => r.role_id === identity.current_role.role_id)
                : null;
              // Prefer saved role when JWT has no current_role (login uses int in sub, so no current_role)
              if (!currentRole && user_roles.length > 0) {
                const preferredId = localStorage.getItem(PREFERRED_ROLE_KEY);
                if (preferredId) {
                  const found = lodash.find(user_roles, (r) => r.role_id === parseInt(preferredId, 10));
                  if (found) currentRole = found;
                }
                if (!currentRole) currentRole = user_roles[0];
              }
              const userInfo = {
                ...(typeof identity === "object" && identity !== null ? identity : { id: identity }),
                ...data,
                organization,
                current_role: currentRole
                  ? { role_id: currentRole.role_id, role: currentRole.role }
                  : (hasCurrentRole && identity ? identity.current_role : null),
              };
              const perms = (currentRole && currentRole.role && currentRole.role.permissions) || [];
              localStorage.setItem(PERMISSIONS, JSON.stringify(perms));
              localStorage.setItem(USER, JSON.stringify(userInfo));
              success.dispatch(setUserInformation(userInfo));
              return true;
            });
          } else {
            throw new Error("Incorrect username and password.");
          }
        }
      });
  },
  logout: () => {
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(USER);
    localStorage.removeItem(PERMISSIONS);
    localStorage.removeItem(IS_AUTH);
    localStorage.removeItem(CHART_VIEW);
    localStorage.removeItem(REFRESH_TIME);
    localStorage.removeItem(RESET_PASSWORD_PAGE);
    localStorage.removeItem(VALIDATION);
    // PREFERRED_ROLE_KEY is intentionally NOT removed so the chosen role persists across sessions

    return Promise.resolve();
  },
  checkError: (error) => {
    const status = error.status;
    if (status === 401) {
      localStorage.removeItem(TOKEN);
      return Promise.reject();
    }
    // 403 = authenticated but forbidden; do not clear token (e.g. after role switch)
    if (status === 403) {
      return Promise.reject();
    }
    return Promise.resolve();
  },
  checkAuth: () => {
    return localStorage.getItem(TOKEN)
      ? Promise.resolve()
      : Promise.reject({ redirectTo: "/no-access" });
  },
  getPermissions: () => {
    const permissions = localStorage.getItem(PERMISSIONS);
    return permissions ? Promise.resolve(permissions) : Promise.resolve([]) // default 'guest'
  },
  refreshToken: () => {
    const request = new Request(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem(REFRESH_TOKEN)}`,
      }),
    });

    return fetch(request)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(({ access_token, refresh_token }) => {
        if (access_token) {
          localStorage.setItem(TOKEN, access_token);
          localStorage.setItem(REFRESH_TIME, moment().add("minutes", 2));
          return access_token;
        } else {
          throw new Error("Incorrect username and password.");
        }
      });
  },
};
