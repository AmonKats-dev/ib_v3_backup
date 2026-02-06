// in src/PendingProjects.jsx
import * as React from "react";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";

import {
  List,
  Pagination,
  useTranslate,
  useListContext,
  useRedirect,
  useDataProvider,
} from "react-admin";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  IconButton,
  Tooltip,
  Divider,
  CircularProgress,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  makeStyles,
} from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import AssignmentIcon from "@material-ui/icons/Assignment";
import InboxIcon from "@material-ui/icons/Inbox";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import { dateFormatter } from "../../helpers";
import CustomShowButton from "../resources/Projects/Actions/Buttons/CustomShowButton";
import { checkFeature } from "../../helpers/checkPermission";
import { WorkflowStatusMessage } from "../modules/Reports/helpers";
import { mapPhaseName } from "../../helpers/phaseNameMapper";
import { useSelector } from "react-redux";

// Color palette - Professional blue/neutral (matching Dashboard)
const COLORS = {
  primary: "#2563eb",
  primaryLight: "#3b82f6",
  primaryDark: "#1e40af",
  secondary: "#64748b",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#06b6d4",
  neutral: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  },
};

const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: "left",
    fontSize: "18px",
    fontWeight: 600,
    paddingLeft: theme.spacing(2),
    marginBottom: theme.spacing(2),
    color: theme.palette.text.primary,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionCard: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    borderRadius: theme.shape.borderRadius * 2,
    transition: "box-shadow 0.3s ease",
    "&:hover": {
      boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
    },
  },
  listContainer: {
    padding: theme.spacing(1),
  },
  refreshButton: {
    marginLeft: theme.spacing(1),
  },
  pageTitle: {
    marginBottom: theme.spacing(3),
    fontWeight: 600,
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(6),
    textAlign: "center",
    minHeight: "400px",
  },
  emptyStateIcon: {
    fontSize: "80px",
    color: theme.palette.grey[400],
    marginBottom: theme.spacing(2),
  },
  emptyStateText: {
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1),
  },
  searchField: {
    marginBottom: theme.spacing(2),
  },
  statusChip: {
    fontWeight: 600,
    fontSize: "0.75rem",
  },
  tableContainer: {
    width: "100%",
    overflowX: "auto",
    "&::-webkit-scrollbar": {
      height: "8px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "#f1f5f9",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#94a3b8",
      borderRadius: "4px",
    },
  },
  actionsCell: {
    whiteSpace: "nowrap",
  },
}));

const EmptyDashboardAction = (props) => {
  const { loading, loaded, total } = props;
  // Ensure total is always a number (default to 0 if undefined)
  const safeTotal = total !== undefined ? total : 0;
  
  if (safeTotal === 0 && !loading && loaded) {
    return (
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
          textAlign: "center",
          minHeight: "400px",
        }}
      >
        <InboxIcon
          style={{
            fontSize: "80px",
            color: "#9E9E9E",
            marginBottom: "16px",
          }}
        />
        <Typography variant="h5" paragraph>
          No projects awaiting your action
        </Typography>
        <Typography
          variant="body1"
          style={{ color: "#757575", marginTop: "8px" }}
        >
          Your incoming tray is empty. All caught up!
        </Typography>
      </Box>
    );
  }
  // Ensure total is always passed to Pagination component
  return <Pagination {...props} total={safeTotal} />;
};

// Custom Table Component matching ProjectsList style
const CustomProjectsTable = ({ searchQuery, setSearchQuery, allPendingProjects }) => {
  const classes = useStyles();
  const translate = useTranslate();
  const redirect = useRedirect();
  const { ids, data, total, page, perPage, setPage, setPerPage } = useListContext();
  const { userInfo } = useSelector((state) => state.user);
  const inputRef = useRef(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setPerPage(newRowsPerPage);
    setPage(1);
  };

  // Handle clear search
  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    if (inputRef.current) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  }, [setSearchQuery]);

  // Handle search input change
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, [setSearchQuery]);

  // Use allPendingProjects for searching (fetched from API) instead of just current page records
  const recordsToSearch = allPendingProjects.length > 0 ? allPendingProjects : (ids.map((id) => data[id]).filter(Boolean));

  // Filter records based on search query across all columns
  const filterRecords = (records, query) => {
    if (!query || query.trim() === "") {
      // If no search query, return current page records from react-admin
      return ids.map((id) => data[id]).filter(Boolean);
    }

    const searchTerm = query.toLowerCase().trim();
    
    return records.filter((record) => {
      // Search in code
      const code = checkFeature("has_pimis_fields") 
        ? (record.budget_code || record.code || "").toLowerCase()
        : (record.code || "").toLowerCase();
      
      // Search in project name
      const name = (record.name || "").toLowerCase();
      
      // Search in organization/agency
      const agency = (record.project_organization?.name || "").toLowerCase();
      
      // Search in submission date
      const date = dateFormatter(record.submission_date || record.created_on || "").toLowerCase();
      
      // Search in created by
      const createdBy = (record.user?.full_name || "").toLowerCase();
      
      // Search in project status
      const projectStatus = record.project_status 
        ? translate(`timeline.${String(record.project_status).toLowerCase()}`).toLowerCase()
        : "";
      
      // Search in phase
      const phase = (mapPhaseName(record.phase?.name || "") || "").toLowerCase();
      
      // Search in workflow status
      const workflowStatus = (record.workflow?.status_msg || "").toLowerCase();

      return (
        code.includes(searchTerm) ||
        name.includes(searchTerm) ||
        agency.includes(searchTerm) ||
        date.includes(searchTerm) ||
        createdBy.includes(searchTerm) ||
        projectStatus.includes(searchTerm) ||
        phase.includes(searchTerm) ||
        workflowStatus.includes(searchTerm)
      );
    });
  };

  // Memoize filtered records to prevent unnecessary re-renders
  const filteredRecords = useMemo(() => {
    return filterRecords(recordsToSearch, searchQuery);
  }, [recordsToSearch, searchQuery, translate, ids, data]);
  
  // Paginate filtered records
  const [localPage, setLocalPage] = useState(0);
  const [localRowsPerPage, setLocalRowsPerPage] = useState(perPage || 25);
  
  const handleLocalPageChange = (event, newPage) => {
    setLocalPage(newPage);
  };

  const handleLocalRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setLocalRowsPerPage(newRowsPerPage);
    setLocalPage(0);
  };

  const paginatedRecords = useMemo(() => {
    return filteredRecords.slice(
      localPage * localRowsPerPage,
      localPage * localRowsPerPage + localRowsPerPage
    );
  }, [filteredRecords, localPage, localRowsPerPage]);

  // Reset local page when search query changes
  useEffect(() => {
    setLocalPage(0);
  }, [searchQuery]);

  const records = paginatedRecords;

  // Calculate column widths based on feature flags
  const getColumnWidths = () => {
    if (checkFeature("has_pimis_fields")) {
      // 6 columns for PIMIS
      return {
        code: "12%",
        name: "23%",
        agency: "20%",
        date: "17%",
        phase: "13%",
        status: "15%",
      };
    } else {
      // 8 columns for non-PIMIS - adjusted to total 100%
      return {
        code: "8%",
        name: "20%",
        date: "11%",
        createdBy: "8%",
        projectStatus: "7%",
        phase: "10%",
        workflowStatus: "23%",
        actions: "13%",
      };
    }
  };

  const colWidths = getColumnWidths();

  const getStatusColor = (status) => {
    if (!status) return COLORS.secondary;
    const statusLower = String(status).toLowerCase();
    if (statusLower.includes("draft")) {
      return COLORS.secondary;
    }
    if (statusLower.includes("pending")) {
      return COLORS.warning;
    }
    if (statusLower.includes("approved") || statusLower.includes("active") || statusLower.includes("on track")) {
      return COLORS.success;
    }
    if (statusLower.includes("rejected") || statusLower.includes("cancelled")) {
      return COLORS.error;
    }
    if (statusLower.includes("completed")) {
      return COLORS.info;
    }
    return COLORS.secondary;
  };

  const getRowStyle = (record) => {
    if (
      checkFeature("has_pimis_fields") &&
      record?.workflow?.role_id === userInfo?.current_role?.role_id &&
      record.project_status !== "DRAFT" &&
      record.project_status !== "REJECTED"
    ) {
      return { backgroundColor: "#f4b5b5" };
    }

    if (record?.approved_appeals?.length > 0) {
      return { borderLeft: "5px solid orange" };
    }

    return null;
  };

  const handleRowClick = (record) => {
    redirect("show", "/projects", record.id);
  };

  return (
    <Box style={{ width: "100%", overflow: "visible" }}>
      <Box style={{ marginBottom: 16, width: "100%" }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search all projects..."
          value={searchQuery}
          onChange={handleSearchChange}
          inputRef={(ref) => {
            if (ref) {
              const inputElement = ref.querySelector('input') || ref;
              inputRef.current = inputElement;
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: COLORS.neutral[500] }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && searchQuery.trim() !== "" ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleClearSearch}
                  style={{ 
                    padding: "4px",
                    color: COLORS.neutral[500],
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                >
                  <ClearIcon style={{ fontSize: "18px" }} />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
          style={{
            backgroundColor: "white",
          }}
        />
      </Box>
      <TableContainer 
        component={Paper} 
        className={classes.tableContainer}
        style={{ 
          boxShadow: "none", 
          width: "100%", 
          maxWidth: "100%",
          overflowX: "auto"
        }}
      >
        <Table style={{ width: "100%", tableLayout: "fixed" }}>
          <TableHead>
            <TableRow style={{ backgroundColor: COLORS.neutral[50] }}>
              <TableCell style={{ fontWeight: 600, padding: "6px 8px", width: colWidths.code }}>Code</TableCell>
              <TableCell style={{ fontWeight: 600, padding: "6px 8px", width: colWidths.name }}>Project Name</TableCell>
              {checkFeature("has_pimis_fields") && (
                <TableCell style={{ fontWeight: 600, padding: "6px 8px", width: colWidths.agency }}>Primary Executing Agency</TableCell>
              )}
              <TableCell style={{ fontWeight: 600, padding: "6px 8px", width: colWidths.date }}>{translate(`resources.projects.fields.created_at`)}</TableCell>
              {!checkFeature("has_pimis_fields") && (
                <TableCell style={{ fontWeight: 600, padding: "6px 4px", width: colWidths.createdBy }}>{translate(`resources.projects.fields.created_by`)}</TableCell>
              )}
              {!checkFeature("has_pimis_fields") && (
                <TableCell style={{ fontWeight: 600, padding: "6px 4px", width: colWidths.projectStatus }}>{translate(`resources.projects.fields.status`)}</TableCell>
              )}
              <TableCell style={{ fontWeight: 600, padding: "6px 4px", width: colWidths.phase }}>Phase</TableCell>
              <TableCell style={{ fontWeight: 600, padding: "6px 8px", width: checkFeature("has_pimis_fields") ? colWidths.status : colWidths.workflowStatus }}>
                {checkFeature("has_pimis_fields") ? "Status" : "Workflow Status"}
              </TableCell>
              {!checkFeature("has_pimis_fields") && (
                <TableCell 
                  className={classes.actionsCell}
                  style={{ fontWeight: 600, padding: "6px 8px", width: colWidths.actions }} 
                  align="left"
                >
                  <Box style={{ display: "flex", alignItems: "center", paddingLeft: "8px" }}>Actions</Box>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={checkFeature("has_pimis_fields") ? 6 : 8} align="center" style={{ padding: 40 }}>
                  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <Typography variant="body1" color="textSecondary" style={{ marginBottom: 8 }}>
                      No projects found
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      No projects match the current filters. Try adjusting your selection criteria.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              records.map((record) => {
                const rowStyle = getRowStyle(record);
                return (
                <TableRow 
                  key={record.id} 
                  hover 
                  style={{ ...rowStyle, cursor: "pointer" }}
                  onClick={() => handleRowClick(record)}
                >
                  <TableCell style={{ padding: "6px 8px", width: colWidths.code }}>
                    <Typography variant="body2" style={{ fontWeight: 600, color: COLORS.primary }}>
                      {checkFeature("has_pimis_fields") 
                        ? (record.budget_code || record.code) 
                        : record.code}
                    </Typography>
                  </TableCell>
                  <TableCell style={{ padding: "6px 8px", width: colWidths.name }}>
                    <Typography 
                      variant="body2" 
                      style={{ 
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                        lineHeight: "1.3"
                      }}
                    >
                      {record.name}
                    </Typography>
                  </TableCell>
                  {checkFeature("has_pimis_fields") && (
                    <TableCell style={{ padding: "6px 8px", width: colWidths.agency }}>
                      <Typography 
                        variant="body2" 
                        style={{ 
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}
                        title={record.project_organization?.name || "-"}
                      >
                        {record.project_organization?.name || "-"}
                      </Typography>
                    </TableCell>
                  )}
                  <TableCell style={{ padding: "6px 8px", width: colWidths.date }}>
                    <Typography 
                      variant="body2" 
                      style={{ 
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "block",
                        lineHeight: "1.2"
                      }}
                      component="span"
                    >
                      {String(dateFormatter(record.submission_date || record.created_on)).replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ').trim()}
                    </Typography>
                  </TableCell>
                  {!checkFeature("has_pimis_fields") && (
                    <TableCell style={{ padding: "6px 4px", width: colWidths.createdBy }}>
                      <Typography 
                        variant="body2" 
                        style={{ 
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}
                        title={record.user?.full_name || "-"}
                      >
                        {record.user?.full_name || "-"}
                      </Typography>
                    </TableCell>
                  )}
                  {!checkFeature("has_pimis_fields") && (
                    <TableCell style={{ padding: "6px 4px", width: colWidths.projectStatus }}>
                      {record.project_status && (
                        <Chip
                          label={translate(`timeline.${String(record.project_status).toLowerCase()}`)}
                          size="small"
                          className={classes.statusChip}
                          style={{
                            backgroundColor: `${getStatusColor(record.project_status)}15`,
                            color: getStatusColor(record.project_status),
                            height: "18px",
                            padding: "0 4px",
                          }}
                        />
                      )}
                    </TableCell>
                  )}
                  <TableCell style={{ padding: "6px 4px", width: colWidths.phase }}>
                    <Typography 
                      variant="body2" 
                      style={{ 
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                        lineHeight: "1.3"
                      }}
                    >
                      {mapPhaseName(record.phase?.name) || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell style={{ padding: "6px 8px", width: checkFeature("has_pimis_fields") ? colWidths.status : colWidths.workflowStatus }}>
                    <Typography 
                      variant="body2" 
                      style={{ 
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                        lineHeight: "1.3"
                      }}
                    >
                      <WorkflowStatusMessage record={record} />
                    </Typography>
                  </TableCell>
                  {!checkFeature("has_pimis_fields") && (
                    <TableCell 
                      className={classes.actionsCell}
                      onClick={(e) => e.stopPropagation()}
                      align="left"
                      style={{ padding: "6px 8px", width: colWidths.actions }}
                    >
                      <Box style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                        <CustomShowButton 
                          basePath="/projects"
                          record={record} 
                          fromIncoming={true}
                          size="small"
                          style={{ fontSize: "0.65rem", minWidth: "auto", padding: "3px 6px", margin: 0 }}
                        />
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredRecords.length}
        page={localPage}
        onPageChange={handleLocalPageChange}
        rowsPerPage={localRowsPerPage}
        onRowsPerPageChange={handleLocalRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Projects per page:"
      />
    </Box>
  );
};

function PendingProjects(props) {
  const translate = useTranslate();
  const classes = useStyles();
  const dataProvider = useDataProvider();
  const [refreshing, setRefreshing] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [allPendingProjects, setAllPendingProjects] = React.useState([]);
  const [isLoadingAllPendingProjects, setIsLoadingAllPendingProjects] = React.useState(false);
  const userInfo = useSelector((state) => state.user.userInfo);
  
  // Filter out staticContext and other React Router props that shouldn't be passed to DOM elements
  const { staticContext, ...listProps} = props;

  // Generate unique key for List component that includes user and organization ID
  // This ensures different users get completely separate cached data
  const listKey = React.useMemo(() => {
    const userId = userInfo?.id || 'anonymous';
    const orgId = userInfo?.organization_id || 'no-org';
    const key = `pending-user${userId}-org${orgId}`;
    console.log(`[PENDING] Generated list key: ${key}`);
    return key;
  }, [userInfo?.id, userInfo?.organization_id]);

  // Log when component mounts/unmounts to verify cache clearing
  React.useEffect(() => {
    console.log(`[PENDING] Component mounted for User: ${userInfo?.id}, Org: ${userInfo?.organization_id}`);
    return () => {
      console.log(`[PENDING] Component unmounting for User: ${userInfo?.id}`);
    };
  }, [userInfo?.id, userInfo?.organization_id]);

  // Fetch all pending projects for searching across all paginations
  // Refetch when user changes to ensure correct data for new user
  useEffect(() => {
    if (!userInfo?.id) {
      console.log('[PENDING] No user info yet, skipping fetch');
      return;
    }
    
    console.log(`[PENDING] Fetching all pending projects for User: ${userInfo.id}, Org: ${userInfo.organization_id}`);
    setIsLoadingAllPendingProjects(true);
    dataProvider
      .getList("projects", {
        pagination: { page: 1, perPage: -1 },
        sort: { field: "id", order: "DESC" },
        filter: { action: "PENDING", is_deleted: false },
      })
      .then((response) => {
        const allPendingProjectsData = response.data || [];
        console.log(`[PENDING] Fetched ${allPendingProjectsData.length} pending project(s)`);
        setAllPendingProjects(allPendingProjectsData);
        setIsLoadingAllPendingProjects(false);
      })
      .catch((error) => {
        console.error("Error fetching all pending projects:", error);
        setIsLoadingAllPendingProjects(false);
      });
  }, [dataProvider, userInfo?.id, userInfo?.organization_id]);

  const handleRefresh = () => {
    setRefreshing(true);
    // Force a re-render by updating a key or triggering a refresh
    setTimeout(() => {
      setRefreshing(false);
      window.location.reload();
    }, 500);
  };

  return (
    <Box>
      <Typography variant="h4" className={classes.pageTitle}>
        Projects Waiting for Your Action
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card className={classes.sectionCard}>
            <CardContent>
              <Box className={classes.title}>
                <Box display="flex" alignItems="center">
                  <AssignmentIcon style={{ marginRight: 8 }} />
                  <Typography variant="h6" component="span">
                    Projects requiring your attention
                  </Typography>
                </Box>
                <Tooltip title="Refresh">
                  <IconButton
                    size="small"
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className={classes.refreshButton}
                  >
                    {refreshing ? (
                      <CircularProgress size={20} />
                    ) : (
                      <RefreshIcon />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
              <Divider style={{ marginBottom: 16 }} />
              <Box className={classes.listContainer}>
                <List
                  key={listKey} // Force re-render on user change or org change
                  {...listProps}
                  basePath="/projects"
                  resource="projects"
                  bulkActionButtons={false}
                  actions={false}
                  filter={{ action: "PENDING", is_deleted: false }}
                  perPage={checkFeature("has_pimis_fields") ? 5 : 20}
                  pagination={<EmptyDashboardAction />}
                >
                  <CustomProjectsTable searchQuery={searchQuery} setSearchQuery={setSearchQuery} allPendingProjects={allPendingProjects} />
                </List>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PendingProjects;

