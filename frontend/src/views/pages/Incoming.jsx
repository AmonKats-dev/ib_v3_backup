// in src/Incoming.jsx
import * as React from "react";

import {
  Datagrid,
  FunctionField,
  List,
  Pagination,
  TextField,
  useTranslate,
  useListContext,
  ListContextProvider,
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
} from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import InboxIcon from "@material-ui/icons/Inbox";
import { dateFormatter } from "../../helpers";
import { makeStyles } from "@material-ui/core";
import CustomShowButton from "../resources/Projects/Actions/Buttons/CustomShowButton";
import { checkFeature } from "../../helpers/checkPermission";
import { useSelector } from "react-redux";

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
}));

const EmptyIncoming = (props) => {
  const { loading, loaded, total } = props;
  if (total === 0 && !loading && loaded) {
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
          No incoming projects
        </Typography>
        <Typography
          variant="body1"
          style={{ color: "#757575", marginTop: "8px" }}
        >
          No projects are currently waiting for your action. This is like an empty incoming tray - projects will appear here when they are submitted and assigned to your role in the workflow. Once you act on a project (approve, reject, or take other actions), it will be removed from this list and move to the next role.
        </Typography>
      </Box>
    );
  }
  return <Pagination {...props} total={props.total ?? 0} />;
};

// Custom Datagrid that filters out DRAFT projects as a safeguard
const FilteredDatagrid = (props) => {
  const listContext = useListContext();
  const { data, ids } = listContext;
  
  // Log what we receive - ALWAYS log, even with 0 projects
  React.useEffect(() => {
    console.log(`[INCOMING FRONTEND] FilteredDatagrid component rendered`);
    console.log(`[INCOMING FRONTEND] FilteredDatagrid received: ${ids?.length || 0} project(s)`);
    console.log(`[INCOMING FRONTEND] Data object keys:`, data ? Object.keys(data).length : 0);
    if (ids && ids.length > 0) {
      ids.forEach((id, index) => {
        const project = data?.[id];
        if (project) {
          console.log(`[INCOMING FRONTEND] Project ${index + 1}: ID=${id}, Code=${project.code || 'N/A'}, Status=${project.project_status || 'N/A'}`);
        } else {
          console.warn(`[INCOMING FRONTEND] Project ID ${id} not found in data object`);
        }
      });
    } else {
      console.log(`[INCOMING FRONTEND] No project IDs received (empty list)`);
    }
  }, [data, ids]);

  // Filter out DRAFT projects on the frontend as a safeguard
  const filteredData = React.useMemo(() => {
    try {
      if (!data || !ids) {
        console.log(`[INCOMING FRONTEND] No data or ids: data=${!!data}, ids=${!!ids}`);
        return { data: {}, ids: [] };
      }
      
      console.log(`[INCOMING FRONTEND] Filtering ${ids.length} project(s)...`);
      
      const filteredIds = ids.filter((id) => {
        const project = data[id];
        if (!project) {
          console.warn(`[INCOMING FRONTEND] Project with id=${id} not found in data`);
          return false;
        }
        const status = project?.project_status;
        if (!status) {
          console.warn(`[INCOMING FRONTEND] Project ${project.code || id} has no project_status`);
          return false;
        }
        
        // Exclude DRAFT projects (case-insensitive)
        const statusUpper = String(status).toUpperCase();
        if (statusUpper === 'DRAFT') {
          console.warn(`[INCOMING FRONTEND] Filtered out DRAFT project: ${project.code || project.id} (status: ${status})`);
          return false;
        }
        // Only include SUBMITTED or ASSIGNED
        const isAllowed = statusUpper === 'SUBMITTED' || statusUpper === 'ASSIGNED';
        if (!isAllowed) {
          console.warn(`[INCOMING FRONTEND] Filtered out project with status ${status}: ${project.code || project.id}`);
        }
        return isAllowed;
      });
      
      const filteredDataObj = {};
      filteredIds.forEach((id) => {
        if (data[id]) {
          filteredDataObj[id] = data[id];
        }
      });
      
      if (filteredIds.length !== ids.length) {
        console.warn(`[INCOMING FRONTEND] Filtered out ${ids.length - filteredIds.length} project(s) on frontend (${filteredIds.length} remaining)`);
      } else {
        console.log(`[INCOMING FRONTEND] All ${filteredIds.length} projects passed frontend filter`);
      }
      
      return { data: filteredDataObj, ids: filteredIds };
    } catch (error) {
      console.error(`[INCOMING FRONTEND] ERROR in filteredData useMemo:`, error);
      return { data: {}, ids: [] };
    }
  }, [data, ids]);
  
  // Create a modified list context with filtered data
  const filteredContext = React.useMemo(() => {
    try {
      return {
        ...listContext,
        data: filteredData.data,
        ids: filteredData.ids,
        total: filteredData.ids.length,
      };
    } catch (error) {
      console.error(`[INCOMING FRONTEND] ERROR in filteredContext useMemo:`, error);
      return listContext;
    }
  }, [listContext, filteredData]);
  
  try {
    return (
      <ListContextProvider value={filteredContext}>
        <Datagrid {...props}>
          {props.children}
        </Datagrid>
      </ListContextProvider>
    );
  } catch (error) {
    console.error(`[INCOMING FRONTEND] ERROR rendering FilteredDatagrid:`, error);
    // Fallback to regular Datagrid if there's an error
    return <Datagrid {...props}>{props.children}</Datagrid>;
  }
};

function Incoming(props) {
  const translate = useTranslate();
  const classes = useStyles();
  const [refreshing, setRefreshing] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const userInfo = useSelector((state) => state.user.userInfo);

  const handleRefresh = () => {
    setRefreshing(true);
    // Force List to refresh by changing key
    setRefreshKey(prev => prev + 1);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  // Generate unique key for List component that includes user and organization ID
  // This ensures different users get completely separate cached data
  const listKey = React.useMemo(() => {
    const userId = userInfo?.id || 'anonymous';
    const orgId = userInfo?.organization_id || 'no-org';
    const key = `incoming-user${userId}-org${orgId}-refresh${refreshKey}`;
    console.log(`[INCOMING] Generated list key: ${key}`);
    return key;
  }, [userInfo?.id, userInfo?.organization_id, refreshKey]);

  // Log when component mounts/unmounts to verify cache clearing
  React.useEffect(() => {
    console.log(`[INCOMING] Component mounted for User: ${userInfo?.id}, Org: ${userInfo?.organization_id}`);
    return () => {
      console.log(`[INCOMING] Component unmounting for User: ${userInfo?.id}`);
    };
  }, [userInfo?.id, userInfo?.organization_id]);

  return (
    <Box>
      <Typography variant="h4" className={classes.pageTitle}>
        Incoming
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card className={classes.sectionCard}>
            <CardContent>
              <Box className={classes.title}>
                <Box display="flex" alignItems="center">
                  <InboxIcon style={{ marginRight: 8 }} />
                  <Typography variant="h6" component="span">
                    Projects waiting for your action.
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
                  key={listKey} // Force re-render on user change, org change, or manual refresh
                  {...(() => {
                    // Filter out staticContext and other React Router props that shouldn't be passed to DOM elements
                    const { staticContext, ...restProps } = props;
                    return restProps;
                  })()}
                  basePath="/projects"
                  resource="projects"
                  bulkActionButtons={false}
                  actions={false}
                  filter={{
                    action: "INCOMING",
                    is_deleted: false,
                  }}
                  perPage={checkFeature("has_pimis_fields") ? 5 : 25}
                  pagination={<EmptyIncoming />}
                >
                  <FilteredDatagrid>
                    <TextField source="code" />
                    <TextField source="name" />
                    <FunctionField
                      source="created_on"
                      label={translate(`resources.projects.fields.created_at`)}
                      render={(record) =>
                        record ? dateFormatter(record.created_on) : null
                      }
                    />
                    <FunctionField
                      source="status"
                      label={translate(`resources.projects.fields.status`)}
                      render={(record) =>
                        record
                          ? translate(
                              `timeline.${record.project_status.toLowerCase()}`
                            )
                          : null
                      }
                    />
                    <CustomShowButton basePath="/projects" fromIncoming={true} />
                  </FilteredDatagrid>
                </List>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Incoming;

