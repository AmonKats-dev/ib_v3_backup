import React, { useEffect, useState, useMemo, useCallback, memo } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  Typography,
  Button,
} from "@mui/material";

const NonContractual = ({ 
  data = [], 
  loading = false, 
  error = null, 
  projectData = {},
  onRefresh 
}) => {
  // Ensure data is always an array
  const safeData = Array.isArray(data) ? data : [];
  
  // Optimized data processing
  const [processedData, setProcessedData] = useState([]);
  
  // Optimized data processing function
  const processData = useCallback((rawData) => {
    if (!Array.isArray(rawData)) return [];
    
    // Pre-process data for faster rendering
    return rawData.map(item => ({
      ...item,
      // Pre-format numbers for display
      GoUFormatted: new Intl.NumberFormat().format(item.GoU || 0),
      GoUArrearsFormatted: new Intl.NumberFormat().format(item.GoUArrears || 0),
      ExtFinFormatted: new Intl.NumberFormat().format(item.ExtFin || 0),
      AIAFormatted: new Intl.NumberFormat().format(item.AIA || 0),
      // Create searchable text for faster filtering
      searchText: Object.values(item).join(' ').toLowerCase()
    }));
  }, []);

  // Process data when it changes
  useEffect(() => {
    if (safeData && safeData.length > 0) {
      const processed = processData(safeData);
      setProcessedData(processed);
    } else if (safeData && safeData.length === 0 && !loading) {
      // Handle empty data array only when not loading
      setProcessedData([]);
    }
  }, [safeData, processData, loading]);

  // Get current project data from PBS
  const currentProjectData = useMemo(() => {
    if (!Array.isArray(processedData) || !projectData.code) return null;
    
    // Find the project that matches the current project code
    return processedData.find((row) => 
      row.Project_Code === projectData.code
    );
  }, [processedData, projectData.code]);

  return (
    <div>
      {/* Project Details Section */}
      <Paper elevation={2} sx={{ marginBottom: 3, padding: 3 }}>
        <Typography variant="h5" sx={{ marginBottom: 2, color: '#3F51B5', fontWeight: 'bold' }}>
          Project Details - PBS System Information
        </Typography>
        
        {currentProjectData ? (
          <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', width: '30%', backgroundColor: '#f5f5f5' }}>
                    Vote Code
                  </TableCell>
                  <TableCell>{currentProjectData.Vote_Code || 'N/A'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                    Vote Name
                  </TableCell>
                  <TableCell>{currentProjectData.Vote_Name || 'N/A'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                    Project Code
                  </TableCell>
                  <TableCell>{currentProjectData.Project_Code || 'N/A'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                    Project Name
                  </TableCell>
                  <TableCell>{currentProjectData.Project_Name || 'N/A'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                    Programme Code
                  </TableCell>
                  <TableCell>{currentProjectData.Programme_Code || 'N/A'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                    Programme Name
                  </TableCell>
                  <TableCell>{currentProjectData.Programme_Name || 'N/A'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                    Sub-Programme Code
                  </TableCell>
                  <TableCell>{currentProjectData.SubProgramme_Code || 'N/A'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                    Sub-Programme Name
                  </TableCell>
                  <TableCell>{currentProjectData.SubProgramme_Name || 'N/A'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                    Sub-Sub-Programme Code
                  </TableCell>
                  <TableCell>{currentProjectData.Sub_SubProgramme_Code || 'N/A'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                    Sub-Sub-Programme Name
                  </TableCell>
                  <TableCell>{currentProjectData.Sub_SubProgramme_Name || 'N/A'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                    Budget Output Code
                  </TableCell>
                  <TableCell>{currentProjectData.Budget_Output_Code || 'N/A'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                    Budget Output Description
                  </TableCell>
                  <TableCell>{currentProjectData.Budget_Output_Description || 'N/A'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                    Item Code
                  </TableCell>
                  <TableCell>{currentProjectData.Item_Code || 'N/A'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                    Description
                  </TableCell>
                  <TableCell>{currentProjectData.Description || 'N/A'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                    Government of Uganda (GoU) Allocation
                  </TableCell>
                  <TableCell>
                    {currentProjectData.GoU ? new Intl.NumberFormat().format(currentProjectData.GoU) : 'N/A'} UGX
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                    External Financing (ExtFin) Allocation
                  </TableCell>
                  <TableCell>
                    {currentProjectData.ExtFin ? new Intl.NumberFormat().format(currentProjectData.ExtFin) : 'N/A'} UGX
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                    Additional International Assistance (AIA)
                  </TableCell>
                  <TableCell>
                    {currentProjectData.AIA ? new Intl.NumberFormat().format(currentProjectData.AIA) : 'N/A'} UGX
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                    GoU Arrears
                  </TableCell>
                  <TableCell>
                    {currentProjectData.GoUArrears ? new Intl.NumberFormat().format(currentProjectData.GoUArrears) : 'N/A'} UGX
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                    Budget Stage
                  </TableCell>
                  <TableCell>{currentProjectData.BudgetStage || 'N/A'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                    Fiscal Year
                  </TableCell>
                  <TableCell>{currentProjectData.Fiscal_Year || 'N/A'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                    Total Project Value
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const goU = currentProjectData.GoU || 0;
                      const extFin = currentProjectData.ExtFin || 0;
                      const aia = currentProjectData.AIA || 0;
                      const total = goU + extFin + aia;
                      return total > 0 ? new Intl.NumberFormat().format(total) : 'N/A';
                    })()} UGX
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ padding: 3, textAlign: 'center', backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <CircularProgress size={20} sx={{ color: '#3F51B5' }} />
                <Typography variant="body1" color="text.secondary">
                  Loading project details...
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  {error ? 'Error loading project details' : 'No PBS data found for this project'}
                </Typography>
                {onRefresh && (
                  <Button
                    variant="outlined"
                    onClick={onRefresh}
                    disabled={loading}
                    sx={{
                      color: '#3F51B5',
                      borderColor: '#3F51B5',
                      '&:hover': {
                        backgroundColor: '#3F51B5',
                        color: 'white',
                      },
                    }}
                  >
                    Refresh
                  </Button>
                )}
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </div>
  );
};

export default NonContractual;