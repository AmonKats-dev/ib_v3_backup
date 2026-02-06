import React, { useState, useEffect, useMemo } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ButtonMui from "../../../components/mui-component/ButtonMui";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

const Procurement = ({ procurementEntries, setProcurementEntries }) => {
  // Combined fiscal years: FY2016/17 to FY2034/35 (19 years total)
  const fiscalYears = useMemo(() => Array.from({ length: 19 }, (_, i) => {
    const start = 2016 + i; // Start from 2016 and go forward to 2034
    const endShort = ((start + 1) % 100).toString().padStart(2, '0');
    return `FY${start}/${endShort}`;
  }), []);

  // State for multiple procurement entries
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProcurementDialog, setShowProcurementDialog] = useState({ open: false, entry: null });

  // State for current procurement form
  const [procurementData, setProcurementData] = useState({
    procurementRef: "",
    description: "",
    category: "",
    stage: "",
    contractValue: "",
    sourceOfFinancing: "",
    commencementDate: "",
    endDate: ""
  });

  // Dynamic FY headers for procurement pipeline table
  const [procurementFyHeaders, setProcurementFyHeaders] = useState([]);
  const [procurementPipeline, setProcurementPipeline] = useState({});

  // Validation state
  const [errors, setErrors] = useState({});

  // Filter procurement entries based on search term
  const filteredProcurementEntries = procurementEntries.filter(entry => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (entry.data.procurementRef && entry.data.procurementRef.toLowerCase().includes(searchLower)) ||
      (entry.data.description && entry.data.description.toLowerCase().includes(searchLower)) ||
      (entry.data.category && entry.data.category.toLowerCase().includes(searchLower)) ||
      (entry.data.stage && entry.data.stage.toLowerCase().includes(searchLower)) ||
      (entry.data.sourceOfFinancing && entry.data.sourceOfFinancing.toLowerCase().includes(searchLower)) ||
      (entry.data.commencementDate && entry.data.commencementDate.toLowerCase().includes(searchLower)) ||
      (entry.data.endDate && entry.data.endDate.toLowerCase().includes(searchLower))
    );
  });

  // Functions to handle multiple entries
  const handleAddNew = () => {
    setProcurementData({
      procurementRef: "",
      description: "",
      category: "",
      stage: "",
      contractValue: "",
      sourceOfFinancing: "",
      commencementDate: "",
      endDate: ""
    });
    setProcurementPipeline({});
    setErrors({});
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (entry) => {
    setProcurementData(entry.data);
    setProcurementPipeline(entry.pipeline || {});
    setErrors({});
    setEditingId(entry.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setProcurementEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const handleShow = (entry) => {
    setShowProcurementDialog({ open: true, entry });
  };

  const handleCloseShowDialog = () => {
    setShowProcurementDialog({ open: false, entry: null });
  };

  const handleSave = () => {
    if (validateProcurementForm()) {
      const entryData = {
        id: editingId || Date.now(),
        data: { ...procurementData },
        pipeline: { ...procurementPipeline },
        timestamp: new Date().toISOString()
      };

      if (editingId) {
        // Update existing entry
        setProcurementEntries(prev => 
          prev.map(entry => entry.id === editingId ? entryData : entry)
        );
      } else {
        // Add new entry
        setProcurementEntries(prev => [...prev, entryData]);
      }

      // Reset form
      setProcurementData({
        procurementRef: "",
        description: "",
        category: "",
        stage: "",
        contractValue: "",
        sourceOfFinancing: "",
        commencementDate: "",
        endDate: ""
      });
      setProcurementPipeline({});
      setErrors({});
      setEditingId(null);
      setShowForm(false);
    }
  };

  const handleCancel = () => {
    setProcurementData({
      procurementRef: "",
      description: "",
      category: "",
      stage: "",
      contractValue: "",
      sourceOfFinancing: "",
      commencementDate: "",
      endDate: ""
    });
    setProcurementPipeline({});
    setErrors({});
    setEditingId(null);
    setShowForm(false);
  };

  // Utility function to format numbers with commas (no decimals)
  const formatWithCommas = (value) => {
    // Handle the special case of 0 - it should display as "0"
    if (value === 0 || value === "0") {
      return "0";
    }
    
    // Convert to string and handle different data types
    const stringValue = String(value || "");
    if (!stringValue) return "";
    
    // Format with commas only (no decimal places)
    const digitsOnly = stringValue.replace(/\D/g, "");
    if (digitsOnly) {
      const withCommas = digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return withCommas;
    }
    
    return "";
  };

  // Utility function to validate zero values (only allow single "0")
  const validateZeroValue = (value) => {
    if (value === "0") return true;
    if (value === "00" || value === "000" || value.startsWith("0") && value !== "0") return false;
    return true;
  };

  // Handle currency field changes with validation
  const handleCurrencyChange = (field) => (e) => {
    const raw = e.target.value || "";
    
    // If any non-digit and non-comma char is typed, show error
    if (/[^0-9,]/.test(raw)) {
      setErrors(prev => ({ ...prev, [field]: "Must contain digits only" }));
      return;
    }
    
    const digitsOnly = raw.replace(/\D/g, "");
    
    // Validate zero values - only allow single "0", not "00" or "000"
    if (digitsOnly !== "" && !validateZeroValue(digitsOnly)) {
      setErrors(prev => ({ ...prev, [field]: "Invalid zero value" }));
      return;
    }
    
    setProcurementData(prev => {
      const updatedData = {
        ...prev,
        [field]: digitsOnly
      };
      
      // If contract value is being updated, validate pipeline totals
      if (field === 'contractValue') {
        validatePipelineTotal(procurementPipeline);
      }
      
      return updatedData;
    });
    
    // Clear error when valid input is provided
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Handle form field changes
  const handleProcurementChange = (field) => (event) => {
    const value = event.target.value;
    setProcurementData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    
    // Validate date relationship when either date changes
    if (field === 'commencementDate' || field === 'endDate') {
      validateDateRelationship(field, value);
    }
  };

  // Validate the relationship between commencement and end dates
  const validateDateRelationship = (changedField, changedValue) => {
    const startDate = changedField === 'commencementDate' ? changedValue : procurementData.commencementDate;
    const endDate = changedField === 'endDate' ? changedValue : procurementData.endDate;
    
    if (startDate && endDate) {
      const startIdx = fiscalYears.indexOf(startDate);
      const endIdx = fiscalYears.indexOf(endDate);
      
      if (startIdx !== -1 && endIdx !== -1) {
        if (startIdx >= endIdx) {
          // Auto clear the invalid field and set error
          if (changedField === 'commencementDate') {
            setProcurementData(prev => ({ ...prev, commencementDate: "" }));
            setErrors(prev => ({ ...prev, commencementDate: "Estimated Commencement Date must be earlier than Estimated Contract End Date" }));
          } else if (changedField === 'endDate') {
            setProcurementData(prev => ({ ...prev, endDate: "" }));
            setErrors(prev => ({ ...prev, endDate: "Estimated Contract End Date must be later than Estimated Commencement Date" }));
          }
        } else {
          // Clear any existing date relationship errors
          setErrors(prev => ({
            ...prev,
            commencementDate: prev.commencementDate === "Estimated Commencement Date must be earlier than Estimated Contract End Date" ? "" : prev.commencementDate,
            endDate: prev.endDate === "Estimated Contract End Date must be later than Estimated Commencement Date" ? "" : prev.endDate
          }));
        }
      }
    }
  };

  // Validate procurement form
  const validateProcurementForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!procurementData.procurementRef || procurementData.procurementRef.trim() === '') {
      newErrors.procurementRef = 'Procurement Reference Number is required';
    }
    
    if (!procurementData.description || procurementData.description.trim() === '') {
      newErrors.description = 'Description of Procurement is required';
    }
    
    if (!procurementData.category || procurementData.category === '') {
      newErrors.category = 'Category of Procurement is required';
    }
    
    if (!procurementData.stage || procurementData.stage === '') {
      newErrors.stage = 'Stage of Procurement is required';
    }
    
    if (!procurementData.contractValue || procurementData.contractValue.trim() === '') {
      newErrors.contractValue = 'Estimated Contract Value is required';
    }
    
    if (!procurementData.sourceOfFinancing || procurementData.sourceOfFinancing === '') {
      newErrors.sourceOfFinancing = 'Source of Financing is required';
    }
    
    if (!procurementData.commencementDate || procurementData.commencementDate === '') {
      newErrors.commencementDate = 'Estimated Commencement Date is required';
    }
    
    if (!procurementData.endDate || procurementData.endDate === '') {
      newErrors.endDate = 'Estimated Contract End Date is required';
    }
    
    // Validate fiscal year pipeline fields
    procurementFyHeaders.forEach(fy => {
      if (!procurementPipeline[fy] || procurementPipeline[fy].trim() === '') {
        newErrors[`pipeline_${fy}`] = `${fy} amount is required`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Dynamic fiscal year generation for procurement
  useEffect(() => {
    const startFy = procurementData.commencementDate;
    const endFy = procurementData.endDate;
    const startIdx = fiscalYears.indexOf(startFy);
    const endIdx = fiscalYears.indexOf(endFy);
    
    if (startIdx !== -1 && endIdx !== -1 && endIdx >= startIdx) {
      const hdrs = fiscalYears.slice(startIdx, endIdx + 1);
      setProcurementFyHeaders(hdrs);
      // Initialize missing keys
      setProcurementPipeline((prev) => {
        const next = { ...prev };
        hdrs.forEach((fy) => { if (next[fy] === undefined) next[fy] = ""; });
        return next;
      });
    } else {
      setProcurementFyHeaders([]);
    }
  }, [procurementData.commencementDate, procurementData.endDate, fiscalYears]);

  // Validate pipeline total against contract value
  const validatePipelineTotal = (pipeline) => {
    const contractValue = Number(procurementData.contractValue || 0);
    
    if (contractValue === 0) {
      // If contract value is 0, clear any pipeline total errors
      setErrors(prev => {
        const newErrors = { ...prev };
        Object.keys(pipeline).forEach(fy => {
          if (newErrors[`pipeline_total_${fy}`]) {
            delete newErrors[`pipeline_total_${fy}`];
          }
        });
        return newErrors;
      });
      return;
    }
    
    // Calculate total of all pipeline values
    const totalPipeline = Object.values(pipeline).reduce((sum, value) => {
      return sum + Number(value || 0);
    }, 0);
    
    // Check if total exceeds contract value
    if (totalPipeline > contractValue) {
      const excess = totalPipeline - contractValue;
      const formattedExcess = formatWithCommas(excess);
      const formattedContractValue = formatWithCommas(contractValue);
      const formattedTotal = formatWithCommas(totalPipeline);
      
      // Set error for all pipeline fields
      Object.keys(pipeline).forEach(fy => {
        if (pipeline[fy] && pipeline[fy] !== "0") {
          setErrors(prev => ({
            ...prev,
            [`pipeline_total_${fy}`]: `Total pipeline cost (${formattedTotal}) exceeds contract value (${formattedContractValue}) by ${formattedExcess}`
          }));
        }
      });
    } else {
      // Clear pipeline total errors if within limit
      setErrors(prev => {
        const newErrors = { ...prev };
        Object.keys(pipeline).forEach(fy => {
          if (newErrors[`pipeline_total_${fy}`]) {
            delete newErrors[`pipeline_total_${fy}`];
          }
        });
        return newErrors;
      });
    }
  };

  // Handle pipeline value changes
  const handlePipelineChange = (fy) => (event) => {
    const raw = event.target.value || "";
    
    // If any non-digit and non-comma char is typed, show error
    if (/[^0-9,]/.test(raw)) {
      setErrors(prev => ({ ...prev, [`pipeline_${fy}`]: "Must contain digits only" }));
      return;
    }
    
    const digitsOnly = raw.replace(/\D/g, "");
    
    // Validate zero values - only allow single "0", not "00" or "000"
    if (digitsOnly !== "" && !validateZeroValue(digitsOnly)) {
      setErrors(prev => ({ ...prev, [`pipeline_${fy}`]: "Invalid zero value" }));
      return;
    }
    
    setProcurementPipeline(prev => {
      const updatedPipeline = {
        ...prev,
        [fy]: digitsOnly
      };
      
      // Validate total pipeline values against contract value
      validatePipelineTotal(updatedPipeline);
      
      return updatedPipeline;
    });
    
    // Clear error when user starts typing
    if (errors[`pipeline_${fy}`]) {
      setErrors(prev => ({ ...prev, [`pipeline_${fy}`]: "" }));
    }
  };

  return (
    <div>
      {/* Header with Add New button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '20px' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
          sx={{ 
            backgroundColor: '#3F51B5',
            color: 'white',
            fontWeight: 'normal',
            textTransform: 'uppercase',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            '&:hover': {
              backgroundColor: '#303F9F',
            }
          }}
        >
          Add New Procurement
        </Button>
      </div>

      {/* Empty state message */}
      {procurementEntries.length === 0 && !showForm && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px dashed #dee2e6',
          marginBottom: '20px'
        }}>
          <p style={{ 
            fontSize: '16px', 
            color: '#6c757d', 
            margin: '0 0 10px 0' 
          }}>
            No procurement entries found
          </p>
          <p style={{ 
            fontSize: '14px', 
            color: '#868e96', 
            margin: '0' 
          }}>
            Click "Add New Procurement" to create your first entry
          </p>
        </div>
      )}

      {/* Search Filter */}
      {procurementEntries.length > 0 && !showForm && (
        <div style={{ marginBottom: '16px' }}>
          <TextField
            fullWidth
            placeholder="Search procurement entries by reference number, description, category, stage, source of financing, commencement date, end date..."
            value={searchTerm || ''}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#e0e0e0',
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
        </div>
      )}

      {/* Search results counter */}
      {procurementEntries.length > 0 && searchTerm && !showForm && (
        <div style={{ marginBottom: '8px', fontSize: '14px', color: '#666' }}>
          {filteredProcurementEntries.length} of {procurementEntries.length} entries found
        </div>
      )}

      {/* List of existing entries */}
      {procurementEntries.length > 0 && !showForm && (
        <TableContainer component={Paper} sx={{ marginBottom: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Procurement Ref. No.</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Stage</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Contract Value</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(filteredProcurementEntries || procurementEntries).map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.data.procurementRef}</TableCell>
                  <TableCell sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {entry.data.description}
                  </TableCell>
                  <TableCell>{entry.data.category}</TableCell>
                  <TableCell>{entry.data.stage}</TableCell>
                  <TableCell>{formatWithCommas(entry.data.contractValue)}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <ButtonMui 
                        size="small" 
                        variant="outlined" 
                        onClick={() => handleShow(entry)}
                        sx={{ 
                          borderColor: '#3F51B5', 
                          color: '#3F51B5',
                          backgroundColor: 'transparent',
                          fontWeight: 'normal',
                          textTransform: 'uppercase',
                          boxShadow: 'none',
                          '&:hover': {
                            backgroundColor: '#3F51B5',
                            color: 'white',
                            borderColor: '#3F51B5'
                          }
                        }}
                      >
                        Show
                      </ButtonMui>
                      <ButtonMui 
                        size="small" 
                        variant="outlined" 
                        onClick={() => handleEdit(entry)}
                        sx={{
                          borderColor: '#3F51B5', 
                          color: '#3F51B5',
                          backgroundColor: 'transparent',
                          fontWeight: 'normal',
                          textTransform: 'uppercase',
                          boxShadow: 'none',
                          '&:hover': {
                            backgroundColor: '#3F51B5',
                            color: 'white',
                            borderColor: '#3F51B5'
                          }
                        }}
                      >
                        Edit
                      </ButtonMui>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* No search results message */}
      {procurementEntries.length > 0 && filteredProcurementEntries.length === 0 && !showForm && (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px dashed #dee2e6',
          marginBottom: '20px'
        }}>
          <p style={{ 
            fontSize: '16px', 
            color: '#6c757d', 
            margin: '0' 
          }}>
            No procurement entries found matching "{searchTerm}"
          </p>
        </div>
      )}

      {/* Form for adding/editing */}
      {showForm && (
        <div>
          <h3 style={{ marginBottom: '20px', color: '#3F51B5', fontWeight: 'bold' }}>
            {editingId ? 'Edit Procurement Entry' : 'Add New Procurement Entry'}
          </h3>
      <TableContainer
        className="shadow-sm"
        component={Paper}
        sx={{ boxShadow: "none" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ padding: 1, width: "25%" }}>Procurement Ref. No.</TableCell>
              <TableCell sx={{ padding: 1, width: "35%" }}>
                Description of Procurement
              </TableCell>
              <TableCell sx={{ padding: 1, width: "20%" }}>
                Category of Procurement
              </TableCell>
              <TableCell sx={{ padding: 1, width: "20%" }}>Stage of Procurement</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ padding: 1 }}>
                <TextField 
                  fullWidth 
                  variant="outlined" 
                  size="small" 
                  placeholder="e.g MoFPED/WKS/2025-26/00058"
                  value={procurementData.procurementRef}
                  onChange={handleProcurementChange('procurementRef')}
                  error={Boolean(errors.procurementRef)}
                  helperText={errors.procurementRef || ""}
                  required
                  sx={{ '& input': { fontFamily: 'inherit' }, '& input::placeholder': { fontFamily: 'inherit', fontStyle: 'italic', opacity: 0.7, fontSize: '0.8rem' } }}
                />
              </TableCell>
              <TableCell sx={{ padding: 1 }}>
                <TextField 
                  fullWidth 
                  variant="outlined" 
                  size="small" 
                  multiline
                  rows={4}
                  minRows={4}
                  maxRows={6}
                  placeholder="Enter description of procurement..."
                  value={procurementData.description}
                  onChange={handleProcurementChange('description')}
                  error={Boolean(errors.description)}
                  helperText={errors.description || ""}
                  required
                  sx={{
                    '& .MuiInputBase-input': {
                      fontSize: '0.875rem',
                      lineHeight: 1.4,
                    }
                  }}
                />
              </TableCell>
              <TableCell sx={{ padding: 1 }}>
                <Select 
                  size="small" 
                  fullWidth 
                  variant="outlined" 
                  displayEmpty
                  value={procurementData.category}
                  onChange={handleProcurementChange('category')}
                  error={Boolean(errors.category)}
                  required
                  renderValue={(selected) => {
                    if (!selected) {
                      return <em style={{ color: '#999' }}>Select One...</em>;
                    }
                    return selected;
                  }}
                >
                  <MenuItem value="Works">Works</MenuItem>
                  <MenuItem value="Supplies">Supplies</MenuItem>
                    <MenuItem value="Consultancy Services">Consultancy Services</MenuItem>
                    <MenuItem value="Non-Consultancy Services">
                      Non-Consultancy Services
                  </MenuItem>
                </Select>
              </TableCell>
              <TableCell sx={{ padding: 1 }}>
                <Select 
                  size="small" 
                  fullWidth 
                  variant="outlined" 
                  displayEmpty
                  value={procurementData.stage}
                  onChange={handleProcurementChange('stage')}
                  error={Boolean(errors.stage)}
                  required
                  renderValue={(selected) => {
                    if (!selected) {
                      return <em style={{ color: '#999' }}>Select One...</em>;
                    }
                    return selected;
                  }}
                >
                  <MenuItem value="Initiations">Initiations</MenuItem>
                  <MenuItem value="Bidding">Bidding</MenuItem>
                  <MenuItem value="Evaluation">Evaluation</MenuItem>
                  <MenuItem value="Award and Contract Signing">
                    Award and Contract Signing
                  </MenuItem>
                </Select>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        
        {/* Second row with 4 fields */}
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ padding: 1, width: "25%" }}>
                Estimated Contract Value (UGX)
              </TableCell>
              <TableCell sx={{ padding: 1, width: "25%" }}>
                Source of Financing
              </TableCell>
              <TableCell sx={{ padding: 1, width: "25%" }}>
                Estimated Commencement Date
              </TableCell>
              <TableCell sx={{ padding: 1, width: "25%" }}>
                Estimated Contract End Date
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ padding: 1 }}>
                <TextField 
                  fullWidth 
                  variant="outlined" 
                  size="small" 
                  value={formatWithCommas(procurementData.contractValue)}
                  onChange={handleCurrencyChange('contractValue')}
                  error={Boolean(errors.contractValue)}
                  helperText={errors.contractValue || ""}
                  required
                  inputMode="numeric"
                />
              </TableCell>
              <TableCell sx={{ padding: 1 }}>
                <Select 
                  size="small" 
                  fullWidth 
                  variant="outlined" 
                  displayEmpty
                  value={procurementData.sourceOfFinancing}
                  onChange={handleProcurementChange('sourceOfFinancing')}
                  error={Boolean(errors.sourceOfFinancing)}
                  required
                  renderValue={(selected) => {
                    if (!selected) {
                      return <em style={{ color: '#999' }}>Select One...</em>;
                    }
                    return selected;
                  }}
                >
                  <MenuItem value="Government of Uganda">
                    Government of Uganda
                  </MenuItem>
                  <MenuItem value="External Financing">
                    External Financing
                  </MenuItem>
                </Select>
              </TableCell>
              <TableCell sx={{ padding: 1 }}>
                <Select 
                  size="small" 
                  fullWidth 
                  variant="outlined" 
                  displayEmpty
                  value={procurementData.commencementDate}
                  onChange={handleProcurementChange('commencementDate')}
                  error={Boolean(errors.commencementDate)}
                  required
                  renderValue={(selected) => {
                    if (!selected) {
                      return <span style={{ color: '#999' }}>Select One....</span>;
                    }
                    return selected;
                  }}
                >
                  {fiscalYears.map((fy) => (
                    <MenuItem key={fy} value={fy}>{fy}</MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell sx={{ padding: 1 }}>
                <Select 
                  size="small" 
                  fullWidth 
                  variant="outlined" 
                  displayEmpty
                  value={procurementData.endDate}
                  onChange={handleProcurementChange('endDate')}
                  error={Boolean(errors.endDate)}
                  required
                  renderValue={(selected) => {
                    if (!selected) {
                      return <span style={{ color: '#999' }}>Select One....</span>;
                    }
                    return selected;
                  }}
                >
                  {fiscalYears.map((fy) => (
                    <MenuItem key={fy} value={fy}>{fy}</MenuItem>
                  ))}
                </Select>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        {procurementFyHeaders.length > 0 && (
          <div>
            <h3 className="p-3" style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#3F51B5' }}>Annual Pipeline Procurement Cost</h3>
          <Table sx={{ minWidth: 650 }} aria-label="dynamic procurement pipeline table">
          <TableHead>
            <TableRow>
                <TableCell sx={{ padding: 1, width: "20%" }}>Estimated contract value (UGX)</TableCell>
                {procurementFyHeaders.map((fy) => (
                  <TableCell key={fy} sx={{ padding: 1 }}>{fy} (UGX)</TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ padding: 1 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  disabled
                  sx={{ backgroundColor: "#f4f4f4" }}
                    value={formatWithCommas(procurementData.contractValue || "")}
                />
              </TableCell>
                {procurementFyHeaders.map((fy) => (
                  <TableCell key={fy} sx={{ padding: 1 }}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      value={formatWithCommas(procurementPipeline[fy] || "")}
                      onChange={handlePipelineChange(fy)}
                      error={Boolean(errors[`pipeline_${fy}`] || errors[`pipeline_total_${fy}`])}
                      helperText={errors[`pipeline_${fy}`] || errors[`pipeline_total_${fy}`] || ""}
                      inputMode="numeric"
                      required
                    />
              </TableCell>
                ))}
            </TableRow>
          </TableBody>
        </Table>
          </div>
        )}
      </TableContainer>
          
        {/* Form buttons */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            {editingId ? 'Update' : 'Save'}
          </Button>
        </div>
      </div>
      )}

      {/* Procurement Show Dialog */}
      <Dialog open={showProcurementDialog.open} onClose={handleCloseShowDialog} fullWidth maxWidth="lg">
        <DialogTitle>Procurement Entry Overview</DialogTitle>
        <DialogContent>
          {showProcurementDialog.entry && (
            <div style={{ padding: '16px 0' }}>
              {/* Basic Procurement Information */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ color: '#3F51B5', marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>
                  Procurement Information
                </h3>
                <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '30%', backgroundColor: '#f5f5f5' }}>Procurement Reference Number</TableCell>
                        <TableCell>{showProcurementDialog.entry.data.procurementRef || 'N/A'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Procurement Description</TableCell>
                        <TableCell>{showProcurementDialog.entry.data.description || 'N/A'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Procurement Category</TableCell>
                        <TableCell>{showProcurementDialog.entry.data.category || 'N/A'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Procurement Stage</TableCell>
                        <TableCell>{showProcurementDialog.entry.data.stage || 'N/A'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Contract Value (UGX)</TableCell>
                        <TableCell>{formatWithCommas(showProcurementDialog.entry.data.contractValue) || 'N/A'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Source of Financing</TableCell>
                        <TableCell>{showProcurementDialog.entry.data.sourceOfFinancing || 'N/A'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Commencement Date</TableCell>
                        <TableCell>{showProcurementDialog.entry.data.commencementDate || 'N/A'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Contract End Date</TableCell>
                        <TableCell>{showProcurementDialog.entry.data.endDate || 'N/A'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              {/* Annual Pipeline Procurement Cost Section */}
              {showProcurementDialog.entry.pipeline && Object.keys(showProcurementDialog.entry.pipeline).length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3F51B5', marginBottom: '16px' }}>
                    Annual Pipeline Procurement Cost
                  </h3>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', textAlign: 'left' }}>Estimated Contract Value (UGX)</TableCell>
                          {Object.keys(showProcurementDialog.entry.pipeline).map((fy) => (
                            <TableCell key={fy} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', textAlign: 'left' }}>{fy} (UGX)</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', textAlign: 'left' }}>
                            {formatWithCommas(showProcurementDialog.entry.data.contractValue) || 'N/A'}
                          </TableCell>
                          {Object.keys(showProcurementDialog.entry.pipeline).map((fy) => (
                            <TableCell key={fy} sx={{ textAlign: 'left' }}>
                              {formatWithCommas(showProcurementDialog.entry.pipeline[fy]) || 'N/A'}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <ButtonMui onClick={handleCloseShowDialog} autoFocus sx={{ 
            backgroundColor: '#3F51B5',
            color: 'white',
            fontWeight: 'normal',
            textTransform: 'uppercase',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            '&:hover': {
              backgroundColor: '#303F9F',
            }
          }}>
            Close
          </ButtonMui>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Procurement;
