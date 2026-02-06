import { TOKEN } from "../../constants/auth";
import { fetchUtils } from "ra-core";
import { stringify } from "query-string";
import lodash from "lodash";
import {
  changeFilterQuery,
  formatValuesToQuery,
  parseQueryToValues,
} from "../../helpers/dataHelpers";

const confertToMultiPart = (item) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(item instanceof File ? item : item.rawFile);

    reader.onload = () => resolve({ src: reader.result, title: item.name });
    reader.onerror = reject;
  });

const defaultHttpMediaClient = (url, options = {}) => {
  const token = localStorage.getItem(TOKEN);
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  if (token) {
    options.headers.set("Authorization", `Bearer ${token}`);
  }
  return fetch(url, options);
};

const defaultHttpClient = (url, options = {}) => {
  const token = localStorage.getItem(TOKEN);

  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  if (token) {
    options.headers.set("Authorization", `Bearer ${token}`);
  }
  return fetchUtils.fetchJson(url, options);
};

export default (apiUrl, httpClient = defaultHttpClient) => {
  return {
    getSubQuery: (resource, params) => {
      const url = `${apiUrl}/${resource}/${params.id}/${params.entryPoint}`;

      return httpClient(url).then(({ headers, json }) => {
        if (!headers.has("content-range")) {
          throw new Error(
            "The Content-Range header is missing in the HTTP Response. The simple REST data provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare Content-Range in the Access-Control-Expose-Headers header?"
          );
        }
        return {
          data: json,
          total: parseInt(headers.get("content-range").split("/").pop(), 10),
        };
      });
    },
    getListOfAll: (resource, params) => {
      const query = {
        page: 1,
        per_page: -1,
        sort_field: params.sort_field || "name",
        sort_order: params.sort_order || "ASC",
      };

      if (params.filter) {
        query.filter = JSON.stringify(params.filter);
      }

      const url = `${apiUrl}/${resource}?${stringify(query)}`;

      return httpClient(url).then(({ headers, json }) => {
        if (!headers.has("content-range")) {
          throw new Error(
            "The Content-Range header is missing in the HTTP Response. The simple REST data provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare Content-Range in the Access-Control-Expose-Headers header?"
          );
        }
        return {
          data: json,
          total: parseInt(headers.get("content-range").split("/").pop(), 10),
        };
      });
    },
    getList: (resource, params) => {
      const { page, perPage } = params.pagination;
      const { field, order } = params.sort;
      const query = {
        sort_field: field,
        sort_order: order,
        page: page,
        per_page: perPage,
        filter: JSON.stringify(changeFilterQuery(params.filter)), //JSON.stringify(params.filter),
      };
      const url = `${apiUrl}/${resource}?${stringify(query)}`;

      return httpClient(url).then(({ headers, json }) => {
        if (!headers.has("content-range")) {
          throw new Error(
            "The Content-Range header is missing in the HTTP Response. The simple REST data provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare Content-Range in the Access-Control-Expose-Headers header?"
          );
        }
        if (params.filter?.is_pm_enabled) {
          const result = json.filter(
            (item) => item?.workflow?.additional_data?.is_pm_enabled === true
          );
          return {
            data: result,
            total: parseInt(result.length),
          };
        }

        if (
          params.filter?.is_logical_framework_editable ||
          params.filter?.is_indicator_editable
        ) {
          const result = json.filter(
            (item) =>
              item?.workflow?.additional_data?.is_logical_framework_editable ===
                true ||
              item?.workflow?.additional_data?.is_indicator_editable === true
          );
          return {
            data: result,
            total: parseInt(result.length),
          };
        }

        return {
          data: json,
          total: parseInt(headers.get("content-range").split("/").pop(), 10),
        };
      });
    },
    getOne: (resource, params) =>
      httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
        // Skip parseQueryToValues for users so organization (User Department, User Vote)
        // and user_roles are preserved; parseQueryToValues is for project-like resources.
        data:
          resource === "users" ? json : parseQueryToValues(json),
      })),
    getMedia: (link) =>
      defaultHttpMediaClient(`${apiUrl}/${link}`)
        .then((res) => res.blob())
        .then((blob) => ({ data: URL.createObjectURL(blob) })),
    getMany: (resource, params) => {
      const query = {
        filter: JSON.stringify({ id: params.ids }),
      };
      const url = `${apiUrl}/${resource}?${stringify(query)}`;
      return httpClient(url).then(({ json }) => ({ data: json }));
    },
    getManyReference: (resource, params) => {
      const { page, perPage } = params.pagination;
      const { field, order } = params.sort;
      const query = {
        sort_field: field,
        sort_order: order,
        page: page,
        per_page: perPage,
        [params.target]: params.id,
        filter:
          params.filter && params.filter.q
            ? JSON.stringify(changeFilterQuery(params.filter))
            : JSON.stringify({
                ...params.filter,
              }),
      };
      const url = `${apiUrl}/${resource}?${stringify(query)}`;

      return httpClient(url).then(({ headers, json }) => {
        if (!headers.has("content-range")) {
          throw new Error(
            "The Content-Range header is missing in the HTTP Response. The simple REST data provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare Content-Range in the Access-Control-Expose-Headers header?"
          );
        }
        return {
          data: json.map((item) => parseQueryToValues(item)),
          total: parseInt(headers.get("content-range").split("/").pop(), 10),
        };
      });
    },
    update: (resource, params) => {
      const isProjectDetailsUpdate = resource === "project-details";

      if (params.id) {
        return httpClient(`${apiUrl}/${resource}/${params.id}`, {
          method: "PATCH",
          body: JSON.stringify(
            formatValuesToQuery(params.data, isProjectDetailsUpdate)
          ),
        }).then(({ json }) => ({
          data: parseQueryToValues(json),
        }));
      }

      return httpClient(`${apiUrl}/${resource}`, {
        method: "PATCH",
        body: JSON.stringify(
          formatValuesToQuery(params.data, isProjectDetailsUpdate)
        ),
      }).then(({ json }) => ({
        data: parseQueryToValues(json),
      }));
    },
    updateMany: (resource, params) =>
      Promise.all(
        params.ids.map((id) =>
          httpClient(`${apiUrl}/${resource}/${id}`, {
            method: "PUT",
            body: JSON.stringify(params.data),
          })
        )
      ).then((responses) => ({ data: responses.map(({ json }) => json.id) })),
    create: (resource, params) =>
      httpClient(`${apiUrl}/${resource}`, {
        method: "POST",
        body: JSON.stringify(formatValuesToQuery(params.data)),
      }).then(({ json }) => ({
        data: { ...params.data, id: json.id },
      })),
    delete: (resource, params) =>
      httpClient(`${apiUrl}/${resource}/${params.id}`, {
        method: "DELETE",
      }).then(({ json }) => ({ data: json })),
    deleteMany: (resource, params) =>
      Promise.all(
        params.ids.map((id) =>
          httpClient(`${apiUrl}/${resource}/${id}`, {
            method: "DELETE",
          })
        )
      ),
    uploadMedia: (resource, params) => {
      return confertToMultiPart(params.data && params.data.media).then(
        (convertedMedia) => {
          const options = {};
          params.data.media = convertedMedia.src;

          return defaultHttpClient(`${apiUrl}/${resource}`, {
            method: "POST",
            body: JSON.stringify(params.data),
            ...options,
          })
            .then(({ json }) => ({ data: json }))
            .catch((err) => {});
        }
      );
    },
    deleteMedia: (resource, params) => {
      return httpClient(`${apiUrl}/${resource}/${params.data.id}`, {
        method: "DELETE",
      })
        .then(({ json }) => ({ data: json }))
        .catch((err) => {});
    },
    export: (resource, params) => {
      return httpClient(`${apiUrl}/export`, {
        method: "POST",
        body: JSON.stringify(params.data),
      }).then(({ json }) => {
        if (json.extension === "doc") {
          const blob = new Blob([json.file_content], { type: "text/plain" });
          const linkSource = window.URL.createObjectURL(blob);
          const downloadLink = document.createElement("a");
          const fileName = `${params.export_name}.${json.extension}`;

          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        } else {
          const linkSource = `data:application/pdf;base64,${json.file_content}`;
          const downloadLink = document.createElement("a");
          const fileName = params.export_name;

          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        }

        return { data: json };
      });
    },
    downloadPIPReport: (params) => {
      return httpClient(`${apiUrl}/reports/pip-report`, {
        method: "GET",
      }).then(({ json }) => {
        if (json.extension === "doc") {
          const blob = new Blob([json.file_content], { type: "text/plain" });
          const linkSource = window.URL.createObjectURL(blob);
          const downloadLink = document.createElement("a");
          const fileName = `${params.export_name}.${json.extension}`;

          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        } else {
          const linkSource = `data:application/pdf;base64,${json.file_content}`;
          const downloadLink = document.createElement("a");
          const fileName = params.export_name;

          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        }

        return { data: json };
      });
    },
    custom: (resource, params) => {
      return httpClient(
        `${apiUrl}/${resource}${params.type ? `/${params.type}` : ""}`,
        {
          method: params.method || "POST",
          body: JSON.stringify(params.query),
        }
      ).then(({ json }) => {
        return { data: json };
      });
    },
    action: (resource, params) => {
      return httpClient(`${apiUrl}/${resource}/${params.id}/actions`, {
        method: "POST",
        body: JSON.stringify(formatValuesToQuery(params.data)),
      }).then(({ json }) => {
        return { data: json };
      });
    },
    ranking: (params) => {
      return httpClient(`${apiUrl}/projects/actions`, {
        method: "POST",
        body: JSON.stringify(params.data), // action = '' , project_ids = [1,2,3,4]
      }).then(({ json }) => {
        return { data: json };
      });
    },
    reset: (resource, params) => {
      return httpClient(`${apiUrl}/${resource}/${params.id}/reset`, {
        method: "GET",
      }).then(({ json }) => {
        return { data: json };
      });
    },
    getListOfAllProjects: (resource, params) => {
      const query = {
        page: 1,
        per_page: -1,
        sort_field: params.sort_field || "name",
        sort_order: params.sort_order || "ASC",
      };

      if (params.filter) {
        query.filter = JSON.stringify(params.filter);
      }

      const url = `${apiUrl}/${resource}?${stringify(query)}`;

      return httpClient(url).then(({ headers, json }) => {
        return {
          data: json,
        };
      });
    },
    integrations: (resource, params) => {
      const query = {
        page: 1,
        per_page: -1,
        sort_field: params.sort_field || "name",
        sort_order: params.sort_order || "ASC",
      };

      if (params.filter) {
        query.filter = JSON.stringify(params.filter);
      }

      return httpClient(
        `${apiUrl}/integrations/${resource}${
          params.additionalData ? `/${params.additionalData}` : ""
        }?${stringify(query)}`,
        {
          method: "GET",
        }
      ).then(({ json }) => {
        return { data: json };
      });
    },
    integrationsCreateLink: (resource, params) => {
      return defaultHttpClient(`${apiUrl}/integrations/${resource}/link`, {
        method: "POST",
        body: JSON.stringify(params.data),
      })
        .then(({ json }) => ({ data: json }))
        .catch((err) => {});
    },
    integrationsUpload: (resource, params) => {
      return confertToMultiPart(params.data && params.data.media).then(
        (convertedMedia) => {
          const options = {};
          params.data.content = convertedMedia.src;

          return defaultHttpClient(`${apiUrl}/integrations/${resource}`, {
            method: "POST",
            body: JSON.stringify(params.data),
            ...options,
          }).then(({ json }) => ({ data: json }));
        }
      );
    },
    achievedTargets: (params) => {
      const query = {
        page: 1,
        per_page: -1,
        sort_field: params.sort_field || "name",
        sort_order: params.sort_order || "ASC",
      };
      return defaultHttpClient(
        `${apiUrl}/achieved-targets?${stringify(query)}`,
        {
          method: "POST",
          body: JSON.stringify(params.data),
        }
      )
        .then(({ json }) => ({ data: json }))
        .catch((err) => {});
    },
    getIntegrationData: (resource, params) => {
      const query = {
        page: 1,
        per_page: -1,
        sort_field: params.sort_field || "name",
        sort_order: params.sort_order || "ASC",
      };

      if (params.filter) {
        query.filter = JSON.stringify(params.filter);
      }

      const url = `${apiUrl}/${resource}?${stringify(query)}`;

      return httpClient(url).then(({ json }) => ({ data: json }));
    },
    notificationsSet: (params) => {
      return defaultHttpClient(`${apiUrl}/notifications`, {
        method: "POST",
        body: JSON.stringify(params.data),
      })
        .then(({ json }) => ({ data: json }))
        .catch((err) => {});
    },
    archiveUpload: (params) => {
      return defaultHttpClient(`${apiUrl}/archiveupload`, {
        method: "POST",
        body: JSON.stringify(params.data),
      })
        .then(({ json }) => ({ data: json }))
        .catch((err) => {});
    },
    archiveDownload: (params) => {
      return httpClient(`${apiUrl}/archivedownload`, {
        method: "GET",
      }).then(({ json }) => {
        return { data: json };
      });
    },
    matrixDownload: (params) => {
      return httpClient(`${apiUrl}/matrixdownload`, {
        method: "POST",
        body: params.data,
      }).then(({ json }) => {
        return { data: json };
      });
    },
  };
};
