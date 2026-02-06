import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  CircularProgress,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Divider,
  TextField,
  Alert,
  AlertTitle,
  Chip,
  Tooltip,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ButtonMui from "../../../components/mui-component/ButtonMui";

const ImplementationModule = () => {
  const history = useHistory();
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [apiOffline, setApiOffline] = useState(false);
  const [usingCachedData, setUsingCachedData] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Cache key for localStorage
  const CACHE_KEY = 'implementation_projects_cache';
  const CACHE_TIMESTAMP_KEY = 'implementation_projects_timestamp';

  // Cache utility functions
  const getCachedData = () => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      
      if (cachedData && timestamp) {
        const cacheAge = Date.now() - parseInt(timestamp);
        const maxAge = 5 * 60 * 1000; // 5 minutes cache validity
        
        if (cacheAge < maxAge) {
          return JSON.parse(cachedData);
        } else {
          // Cache expired, clear it
          localStorage.removeItem(CACHE_KEY);
          localStorage.removeItem(CACHE_TIMESTAMP_KEY);
        }
      }
    } catch (error) {
      console.error('Error reading from cache:', error);
    }
    return null;
  };

  const setCachedData = (data) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  };

  const clearCache = () => {
    try {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  // Filter projects based on search term
  const filteredProjects = allProjects.filter(project => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (project.code && project.code.toLowerCase().includes(searchLower)) ||
      (project.title && project.title.toLowerCase().includes(searchLower)) ||
      (project.start_date && project.start_date.toLowerCase().includes(searchLower)) ||
      (project.status && project.status.toLowerCase().includes(searchLower)) ||
      (project.phase && project.phase.toLowerCase().includes(searchLower))
    );
  });

  // Function to fetch PBS data with enhanced error handling
  const fetchPbsData = async (forceRefresh = false) => {
    const cacheKey = 'pbsProjectsData';
    
    // Check if we have cached data (unless forcing refresh)
    if (!forceRefresh) {
      const cachedData = localStorage.getItem(cacheKey);
      const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
      
      // If we have cached data and it's less than 5 minutes old, use it
      if (cachedData && cacheTimestamp) {
        const now = Date.now();
        const cacheAge = now - parseInt(cacheTimestamp);
        const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
        
        if (cacheAge < fiveMinutes) {
          try {
            const parsedData = JSON.parse(cachedData);
            return { data: parsedData, fromCache: true };
          } catch (error) {
            console.warn('Failed to parse cached PBS data:', error);
            // Continue to fetch fresh data
          }
        }
      }
    }

    try {
      setApiOffline(false);
      
      // First, get access token
      const loginResponse = await axios.post(
        "https://pbsopenapi.finance.go.ug/graphql",
        {
          query: `
            mutation {
              login(
                data: {
                  User_Name: "Nita",
                  Password: "Nita1290W",
                  ipAddress: "192.168.5.0"
                }
              ) {
                access_token
                refresh_token
              }
            }
          `,
        },
        {
          timeout: 60000,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          withCredentials: false,
        }
      );

      // Check if login response has errors
      if (loginResponse.data.errors) {
        throw new Error(loginResponse.data.errors[0]?.message || 'Authentication failed');
      }

      if (!loginResponse.data.data?.login?.access_token) {
        throw new Error('No access token received from PBS API');
      }

      const accessToken = loginResponse.data.data.login.access_token;

      // Then fetch the PBS data
      const dataResponse = await axios.post(
        "https://pbsopenapi.finance.go.ug/graphql",
        {
          query: `
            query {
              cgIbpProjectBudgetAllocations {
                Vote_Code
                Vote_Name
                Programme_Code
                Programme_Name
                SubProgramme_Code
                SubProgramme_Name
                Sub_SubProgramme_Code
                Sub_SubProgramme_Name
                Project_Code
                Project_Name
                Budget_Output_Code
                Budget_Output_Description
                Item_Code
                Description
                GoU
                ExtFin
                AIA
                GoUArrears
                BudgetStage
                Fiscal_Year
              }
            }
          `,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          timeout: 60000,
          withCredentials: false,
        }
      );

      // Check if query response has errors
      if (dataResponse.data.errors) {
        throw new Error(dataResponse.data.errors[0]?.message || 'Failed to fetch PBS data');
      }

      const fetchedData = dataResponse.data.data?.cgIbpProjectBudgetAllocations;
      
      if (!fetchedData) {
        throw new Error('No data received from PBS API');
      }
      
      // Remove duplicates based on Project_Code
      const uniqueData = removeDuplicates(fetchedData || []);
      
      // Cache the data with timestamp
      localStorage.setItem(cacheKey, JSON.stringify(uniqueData));
      localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
      
      return { data: uniqueData, fromCache: false };
    } catch (error) {
      console.error("Error fetching PBS data:", error);
      
      // Determine error type
      const isNetworkError = !error.response && (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK');
      const isTimeoutError = error.code === 'ECONNABORTED';
      const isServerError = error.response && error.response.status >= 500;
      
      // Try to get cached data as fallback
      const cachedData = localStorage.getItem(cacheKey);
      const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
      
      if (cachedData && cacheTimestamp) {
        try {
          const parsedData = JSON.parse(cachedData);
          const cacheAge = Date.now() - parseInt(cacheTimestamp);
          const cacheAgeMinutes = Math.floor(cacheAge / (60 * 1000));
          
          // Return cached data even if expired when API is down
          return { 
            data: parsedData, 
            fromCache: true, 
            apiOffline: true,
            cacheAgeMinutes 
          };
        } catch (parseError) {
          console.error('Failed to parse cached data:', parseError);
        }
      }
      
      // No cached data available, return empty with error info
      throw {
        message: isNetworkError || isTimeoutError 
          ? 'PBS API is currently unavailable. Please check your internet connection and try again.'
          : isServerError
          ? 'PBS API server error. The service may be temporarily down.'
          : 'Failed to fetch data from PBS API. Please try again later.',
        isNetworkError: isNetworkError || isTimeoutError,
        isServerError: isServerError
      };
    }
  };

  // Remove duplicates based on Project_Code
  const removeDuplicates = (arr) => {
    const seen = new Set();
    return arr.filter((item) => {
      if (seen.has(item.Project_Code)) {
        return false;
      }
      seen.add(item.Project_Code);
      return true;
    });
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        setApiOffline(false);
        setUsingCachedData(false);

        // Fetch PBS data (will check cache first)
        const result = await fetchPbsData(false);
        
        // Check if using cached data
        if (result.fromCache) {
          setUsingCachedData(true);
          if (result.apiOffline) {
            setApiOffline(true);
            setError(
              result.cacheAgeMinutes 
                ? `PBS API is unavailable. Showing cached data from ${result.cacheAgeMinutes} minute(s) ago. Some data may be outdated.`
                : 'PBS API is unavailable. Showing cached data. Some data may be outdated.'
            );
          }
        } else {
          setApiOffline(false);
          setUsingCachedData(false);
        }
        
        console.log("PBS Projects data:", result.data);
        
        // Transform PBS data to match our table structure (include Vote_Name for MYC form auto-population)
        const transformedProjects = result.data.map((project, index) => ({
          code: project.Project_Code || `PBS-${index + 1}`,
          title: project.Project_Name || 'Unnamed Project',
          voteName: project.Vote_Name || '',
          start_date: '2024-01-15', // Default date
          status: 'Approved',
          phase: 'Implementation'
        }));

        setAllProjects(transformedProjects);

        // Cache the transformed data (separate from raw PBS cache)
        setCachedData(transformedProjects);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);

        // Try to load from transformed cache as last resort
        const cachedData = getCachedData();
        if (cachedData && cachedData.length > 0) {
          setAllProjects(cachedData);
          setUsingCachedData(true);
          setApiOffline(true);
          setError(
            error.message || 
            'PBS API is unavailable. Showing last cached data. Please check your connection and refresh when the API is back online.'
          );
        } else {
          setError(
            error.message || 
            'PBS API is unavailable and no cached data found. Please check your internet connection and try again.'
          );
          setAllProjects([]);
        }
        setLoading(false);
        setApiOffline(true);
      }
    };

    fetchProjects();
  }, [retryCount]); // Retry when retryCount changes

  // SessionStorage key to keep track of exact project/code from table when navigating to costed-annualized-plan
  const IMPLEMENTATION_SELECTED_PROJECT_KEY = "implementation_module_selected_project";

  const handleShowClick = (project) => {
    const projectData = {
      code: project.code,
      title: project.title,
      voteName: project.voteName || '',
      start_date: project.start_date,
      end_date: project.end_date || "N/A",
      status: project.status,
      phase: project.phase,
    };
    // Persist exact project and code so costed-annualized-plan can use it (e.g. after refresh)
    try {
      sessionStorage.setItem(IMPLEMENTATION_SELECTED_PROJECT_KEY, JSON.stringify(projectData));
    } catch (e) {
      // ignore storage errors
    }
    history.push(`/implementation-module/${project.code}/costed-annualized-plan`, {
      projectData,
    });
  };

  const handleDownloadClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      setApiOffline(false);
      setUsingCachedData(false);
      
      // Force fresh data fetch (skip cache)
      const result = await fetchPbsData(true);
      
      // Check if using cached data (fallback)
      if (result.fromCache) {
        setUsingCachedData(true);
        if (result.apiOffline) {
          setApiOffline(true);
          setError(
            result.cacheAgeMinutes 
              ? `PBS API is still unavailable. Showing cached data from ${result.cacheAgeMinutes} minute(s) ago.`
              : 'PBS API is still unavailable. Showing cached data.'
          );
        }
      } else {
        setApiOffline(false);
        setUsingCachedData(false);
        setError(null); // Clear any previous errors
      }
      
      // Transform PBS data to match our table structure (include Vote_Name for MYC form)
      const transformedProjects = result.data.map((project, index) => ({
        code: project.Project_Code || `PBS-${index + 1}`,
        title: project.Project_Name || 'Unnamed Project',
        voteName: project.Vote_Name || '',
        start_date: '2024-01-15', // Default date
        status: 'Approved',
        phase: 'Implementation'
      }));

      setAllProjects(transformedProjects);

      // Update cache with fresh data
      setCachedData(transformedProjects);

      setLoading(false);
    } catch (error) {
      console.error("Error refreshing data:", error);
      
      // Try to preserve existing data if refresh fails
      if (allProjects.length === 0) {
        const cachedData = getCachedData();
        if (cachedData && cachedData.length > 0) {
          setAllProjects(cachedData);
          setUsingCachedData(true);
        }
      }
      
      setApiOffline(true);
      setError(
        error.message || 
        'Failed to refresh data from PBS API. The service may be temporarily unavailable. You are viewing cached data.'
      );
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1); // Trigger useEffect to retry
  };

  const tableHeaderStyle = {
    fontWeight: "bold",
    backgroundColor: "#6B7280",
    color: "white",
    padding: "8px 12px",
    fontSize: "0.875rem",
  };

  // Column widths (percent) so table fits without horizontal scroll
  const colWidths = {
    code: { width: "10%", minWidth: 80 },
    title: { width: "38%", minWidth: 0 },
    date: { width: "12%", minWidth: 90 },
    status: { width: "10%", minWidth: 70 },
    phase: { width: "12%", minWidth: 80 },
    action: { width: "18%", minWidth: 80 },
  };
  const cellWrap = {
    whiteSpace: "normal",
    wordBreak: "break-word",
    overflowWrap: "break-word",
  };

  // 🔹 Export to Excel Function
  const exportToExcel = () => {
    const exportData = allProjects.map(project => ({
      'Project Code': project.code,
      'Project Title': project.title,
      'Submission Date': project.start_date || '2024-01-15',
      'Status': 'Approved',
      'Phase': 'Implementation'
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PBS Projects");
    XLSX.writeFile(workbook, "PBS_Projects.xlsx");
  };

  // 🔹 Export to PDF Function
  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a3",
      compress: true,
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Implementation Module - PBS Project List", 14, 15);

    const tableColumn = [
      "Project Code",
      "Project Title",
      "Submission Date",
      "Status",
      "Phase",
    ];

    const tableRows = allProjects.map((project) => [
      project.code,
      project.title,
      project.start_date || '2024-01-15',
      'Approved',
      'Implementation',
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [52, 152, 219],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: "auto" },
        2: { cellWidth: "auto" },
        3: { cellWidth: "auto" },
        4: { cellWidth: "auto" },
        5: { cellWidth: "auto" },
        6: { cellWidth: "auto" },
      },
      margin: { top: 20, left: 10, right: 10, bottom: 10 },
      tableWidth: "auto",
      horizontalPageBreak: true,
    });

    doc.save("Implementation_Module_PBS_Projects.pdf");
  };

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, p: 2 }}>
        <h2 className="text-xl mb-0"><b>Projects Under Implementation</b></h2>
        {/* API Status Indicator */}
        {apiOffline && (
          <Chip
            label={usingCachedData ? "Offline - Using Cached Data" : "API Offline"}
            color="warning"
            size="small"
          />
        )}
        {!apiOffline && !loading && !error && (
          <Chip
            label="API Online"
            color="success"
            size="small"
          />
        )}
      </Box>
      
      {/* Error Alert with Retry */}
      {error && (
        <Alert 
          severity={apiOffline && usingCachedData ? "warning" : "error"}
          sx={{ mb: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={handleRetry}
              disabled={loading}
            >
              Retry
            </Button>
          }
        >
          <AlertTitle>
            {apiOffline && usingCachedData 
              ? "PBS API Unavailable" 
              : "Connection Error"}
          </AlertTitle>
          {error}
          {apiOffline && usingCachedData && (
            <Box sx={{ mt: 1, fontSize: '0.875rem' }}>
              You can continue working with cached data, but it may not be up to date. 
              Click "Retry" or the refresh button once the API is back online.
            </Box>
          )}
        </Alert>
      )}
      
      {/* Export Buttons */}

      <Box
        sx={{
          display: "flex",
          gap: 2,
          marginBottom: 1,
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <Tooltip title="Refresh PBS Data" arrow placement="bottom">
            <span>
              <IconButton
                onClick={handleRefresh}
                sx={{
                  background: "none",
                  borderRadius: 0,
                  padding: 0,
                }}
                disabled={loading}
              >
                <RefreshIcon
                  sx={{
                    color: loading ? "rgb(200, 200, 200)" : "rgb(132, 131, 131)",
                    border: "1px solid",
                    borderRadius: "2px",
                    marginRight: "2px",
                  }}
                />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Download as Excel or PDF" arrow placement="bottom">
            <span>
              <IconButton
                onClick={handleDownloadClick}
                sx={{
                  background: "none",
                  borderRadius: 0,
                  padding: 0,
                }}
                disabled={loading}
              >
                <DownloadIcon
                  sx={{
                    color: "rgb(132, 131, 131)",
                    border: "1px solid",
                    borderRadius: "2px",
                    marginRight: "2px",
                  }}
                />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          {/* Download As Header */}
          <MenuItem disabled>
            <Typography variant="body2" sx={{ color: "rgb(60, 60, 60)" }}>
              Download As
            </Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={exportToExcel}>Excel</MenuItem>
          <MenuItem onClick={exportToPDF}>PDF</MenuItem>
        </Menu>
      </Box>

      {/* Search Filter */}
      {allProjects.length > 0 && (
        <Box sx={{ mb: 1 }}>
          <TextField
            fullWidth
            placeholder="Search projects by code, title, date, status, or phase..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#d1d5db',
                },
                '&:hover fieldset': {
                  borderColor: '#3F51B5',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#3F51B5',
                },
              },
            }}
          />
        </Box>
      )}

      {/* Search results counter */}
      {allProjects.length > 0 && searchTerm && (
        <Box sx={{ mb: 0.5 }}>
          <Typography variant="body2" sx={{ color: '#666' }}>
            {filteredProjects.length} of {allProjects.length} projects found
          </Typography>
        </Box>
      )}

      <TableContainer
        component={Paper}
        elevation={0}
        variant="outlined"
        sx={{
          maxHeight: 500,
          overflow: "auto",
          overflowX: "hidden",
          position: "relative",
          width: "100%",
          minWidth: 0,
        }}
      >
        <Table
          stickyHeader
          aria-label="sticky table"
          sx={{ width: "100%", minWidth: 0, tableLayout: "fixed" }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...tableHeaderStyle, ...colWidths.code }}>Project Code</TableCell>
              <TableCell sx={{ ...tableHeaderStyle, ...colWidths.title, ...cellWrap }}>Project Title</TableCell>
              <TableCell sx={{ ...tableHeaderStyle, ...colWidths.date }}>Submission Date</TableCell>
              <TableCell sx={{ ...tableHeaderStyle, ...colWidths.status }}>Status</TableCell>
              <TableCell sx={{ ...tableHeaderStyle, ...colWidths.phase }}>Phase</TableCell>
              <TableCell sx={{ ...tableHeaderStyle, ...colWidths.action }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={cellWrap}>
                  <CircularProgress sx={{ color: "#772303" }} />
                  <Typography variant="body2" sx={{ mt: 1, color: "#772303" }}>
                    Loading projects...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map((project) => {
                return (
                  <TableRow key={project.code}>
                    <TableCell sx={{ ...colWidths.code, ...cellWrap }}>{project.code}</TableCell>
                    <TableCell sx={{ ...colWidths.title, ...cellWrap }}>{project.title}</TableCell>
                    <TableCell sx={{ ...colWidths.date, ...cellWrap }}>{project.start_date || "2024-01-15"}</TableCell>
                    <TableCell sx={{ ...colWidths.status, ...cellWrap }}>Approved</TableCell>
                    <TableCell sx={{ ...colWidths.phase, whiteSpace: "nowrap" }}>Implementation</TableCell>
                    <TableCell sx={{ ...colWidths.action }}>
                      <ButtonMui
                        size="small"
                        variant="outlined"
                        onClick={() => handleShowClick(project)}
                        sx={{
                          borderColor: "#3F51B5",
                          color: "#3F51B5",
                          backgroundColor: "transparent",
                          fontWeight: "normal",
                          textTransform: "uppercase",
                          boxShadow: "none",
                          "&:hover": {
                            backgroundColor: "#3F51B5",
                            color: "white",
                            borderColor: "#3F51B5",
                          },
                        }}
                      >
                        Show
                      </ButtonMui>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : allProjects.length > 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={cellWrap}>
                  No projects match your search criteria.
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={cellWrap}>
                  <Typography variant="body1" sx={{ mb: 2, color: "#666" }}>
                    No projects available.
                  </Typography>
                  {apiOffline && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleRetry}
                      disabled={loading}
                      sx={{ mt: 1 }}
                    >
                      {loading ? <CircularProgress size={20} /> : "Retry Connection"}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ImplementationModule;
