import React, { useEffect, useMemo, useState } from "react";
import {
  Show,
  ReferenceManyField,
  Pagination as RaPagination,
  PaginationActions as RaPaginationActions,
  TabbedShowLayout,
  Tab,
  useRedirect,
  useDataProvider,
} from "react-admin";
import { Container, useMediaQuery } from "@material-ui/core";
import { Filter, TextInput } from "react-admin";
import { useSelector } from "react-redux";
import lodash from "lodash";
import { makeStyles } from "@material-ui/core/styles";

import ProjectsFilters from "./Filters";
import ProjectsActions from "./Actions/Show";

import ProjectReport from "./Report";
import useSystemParams from "../../../hooks/useSystemParams";

export const ProjectShow = ({ permissions, ...props }) => {
  return (
    <Show
      {...props}
      actions={<ProjectsActions {...props} permissions={permissions} />}
    >
      <ReferenceManyField
        addLabel={false}
        reference="project-details"
        target="project_id"
        filter={{ project_id: props.id }}
      >
        <ProjectDetails {...props} />
      </ReferenceManyField>
    </Show>
  );
};

const ProjectDetails = ({ ids = [], data = [], basePath = "", ...props }) => {
  ids.sort();
  const userInfo = useSelector((state) => state.user.userInfo);
  const redirect = useRedirect();
  const [isLoaded, setIsLoaded] = useState(false);
  const sysParams = useSystemParams("validation");

  if (sysParams) {
    localStorage.setItem("validation", JSON.stringify(sysParams.param_value));
  }

  function getFilterForPhase() {
    if (userInfo) {
      return userInfo.current_role.role.phase_ids;
    }
    return [];
  }

  const filtered = lodash
    .keys(data)
    .filter((id) =>
      getFilterForPhase()
        ? getFilterForPhase().includes(Number(data[id].phase_id))
        : true
    );

  // Fallback: when no project_details exist yet (e.g. just created), show "Profile" tab
  // so the step template is visible instead of a blank page (project starts from Profile, not Project Concept)
  const showFallbackTab = filtered.length === 0 && props.id;

  useMemo(() => {
    //TODO maske more optimistic redirect
    if (!lodash.isEmpty(data)) {
      const maxId =
        filtered &&
        lodash.maxBy(
          filtered.map((id) => data[id]),
          (ite) => Number(ite.phase_id)
        );
      setIsLoaded(true);
      if (maxId) {
        if (
          props.history &&
          props.history.location.pathname !==
            "/projects/" + props.id + "/show/" + maxId.phase_id
        )
          if (!isLoaded) {
            redirect("/projects/" + props.id + "/show/" + maxId.phase_id);
          }
      }
    }
  }, [data]);

  if (isLoaded) {
    if (
      props.history.location.pathname ===
      "/projects/" + props.id + "/show/"
    ) {
      redirect("/projects");
    }
  }

  return (
    <TabbedShowLayout>
      {showFallbackTab && (
        <Tab
          key="project-detail-tab-fallback"
          label="Profile"
          path="1"
        >
          <ProjectReport
            customBasePath={basePath}
            customRecord={{
              project_id: props.id,
              phase_id: 1,
              phase: { name: "Profile" },
            }}
          />
        </Tab>
      )}
      {filtered &&
        filtered.map((id) => {
          const record = lodash.cloneDeep(data[id]);

          if (record) {
            const phaseName = record.phase?.name ?? `Phase ${record.phase_id ?? id}`;
            return (
              <Tab
                key={`project-detail-tab-${id}`}
                label={phaseName}
                path={`${record.phase_id}`}
              >
                <ProjectReport
                  customBasePath={basePath}
                  customRecord={record}
                />
              </Tab>
            );
          }

          return null;
        })}
    </TabbedShowLayout>
  );
};

export default ProjectShow;
