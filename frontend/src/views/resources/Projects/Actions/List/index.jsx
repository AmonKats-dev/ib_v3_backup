import * as React from "react";

import {
  CreateButton,
  ExportButton,
  TopToolbar,
  sanitizeListRestProps,
  useListContext,
  usePermissions,
} from "react-admin";
import { cloneElement } from "react";

import {
  checkFeature,
  checkPermission,
} from "../../../../../helpers/checkPermission";
import FiltersSidebar from "../../FIltersSidebar";
import { Box } from "@material-ui/core";
import FilterButton from "../../FIltersSidebar/FilterButton";

const ListActions = (props) => {
  const {
    className,
    exporter,
    filters,
    maxResults,
    hasList,
    hasEdit,
    hasShow,
    syncWithLocation,
    disablePhaseFilter,
    disableCreate,
    ...rest
  } = props;
  const { permissions } = usePermissions();
  const { resource, displayedFilters, filterValues, basePath, showFilter } =
    useListContext();

  function hasCreateButton() {
    return (
      checkPermission(permissions, "create_project") && !disableCreate
    );
  }

  return (
    <Box width="100%">
      <TopToolbar
        className={className}
        {...sanitizeListRestProps(rest)}
        style={{
          display: "flex",
          alignItems: "end",
          paddingTop: "15px !important",
        }}
      >
        {hasCreateButton() && <CreateButton basePath={basePath} />}
        {filters &&
          cloneElement(filters, {
            resource,
            showFilter,
            displayedFilters,
            filterValues,
            context: "button",
          })}
        <ExportButton />
        {checkFeature("has_filter_panel") && <FilterButton />}
      </TopToolbar>
      {checkFeature("has_filter_panel") && <FiltersSidebar {...props} />}
    </Box>
  );
};

export default ListActions;
