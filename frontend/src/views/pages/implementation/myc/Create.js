import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import ButtonMui from "../../../components/mui-component/ButtonMui";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import NonContractual from "./NonContractual";
import Procurement from "./Procurement";
import MYCReport from "./MYCReport";
import { useProject } from "../../../context/ProjectContext";

// Utility function to format numbers (preserves decimals)
const formatNumbers = (value) => {
  if (!value || value === "") return value;
  
  // Convert to string and remove any existing commas
  const stringValue = value.toString().replace(/,/g, '');
  
  // Check if the value has a decimal point
  if (stringValue.includes('.')) {
    // Split into integer and decimal parts
    const [integerPart, decimalPart] = stringValue.split('.');
    
    // Add commas only to the integer part
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    // Return formatted integer + decimal part
    return `${formattedInteger}.${decimalPart}`;
  } else {
    // No decimal point, format the whole number
    return stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
};

// Utility function to validate zero values (only allow single "0")
const validateZeroValue = (value) => {
  if (value === "0") return true;
  if (value === "00" || value === "000" || value.startsWith("0") && value !== "0") return false;
  return true;
};

export default function Create() {
  const location = useLocation();
  const navigate = useNavigate();
  const { updateProjectData, clearProjectData, activeTab, onTabChange, setTabChangeHandler, updateTabCompletionStatus } = useProject();
  
  // Get project data from navigation state
  const projectData = location.state?.projectData || {
    code: 'N/A',
    title: 'Project Title Not Available',
    start_date: 'N/A',
    end_date: 'N/A',
    status: 'N/A',
    phase: 'N/A'
  };

  // Update project data in context when component mounts
  useEffect(() => {
    if (projectData && projectData.title !== 'Project Title Not Available') {
      updateProjectData(projectData);
    }
    
    // Register the tab change handler
    setTabChangeHandler(handleTabChange);
    
    // Clean up when component unmounts
    return () => {
      clearProjectData();
    };
  }, [projectData, updateProjectData, clearProjectData]);

  const [nestedTab, setNestedTab] = useState("obligation");
  const [contracts, setContracts] = useState([]);
  const [currentContractIndex, setCurrentContractIndex] = useState(null);
  const [showContractForm, setShowContractForm] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [selectedFinancialYear, setSelectedFinancialYear] = useState("");
  const [contractEvidenceFile, setContractEvidenceFile] = useState(null);
  const [contractualProjectClassification, setContractualProjectClassification] = useState("");
  const [counterpartEvidenceFile, setCounterpartEvidenceFile] = useState(null);
  const [filePreviewDialog, setFilePreviewDialog] = useState({ open: false, fileUrl: '', fileName: '', fileType: '' });
  
  // Contractual Item Code and Description state
  const [contractualItemCode, setContractualItemCode] = useState("");
  const [contractualDescription, setContractualDescription] = useState("");
  const [contractualSelectedOption, setContractualSelectedOption] = useState(null);
  const [contractualSelectedFiscalYear, setContractualSelectedFiscalYear] = useState("");
  
  // Quarterly breakdown state
  const [contractualQ1, setContractualQ1] = useState("");
  const [contractualQ2, setContractualQ2] = useState("");
  const [contractualQ3, setContractualQ3] = useState("");
  const [contractualQ4, setContractualQ4] = useState("");
  
  // Separate GoU and External quarterly fields for "Both" funding source
  const [contractualGouQ1, setContractualGouQ1] = useState("");
  const [contractualGouQ2, setContractualGouQ2] = useState("");
  const [contractualGouQ3, setContractualGouQ3] = useState("");
  const [contractualGouQ4, setContractualGouQ4] = useState("");
  const [contractualExternalQ1, setContractualExternalQ1] = useState("");
  const [contractualExternalQ2, setContractualExternalQ2] = useState("");
  const [contractualExternalQ3, setContractualExternalQ3] = useState("");
  const [contractualExternalQ4, setContractualExternalQ4] = useState("");
  
  // Multiple quarterly entries state
  const [quarterlyEntries, setQuarterlyEntries] = useState([]);
  const [nextEntryId, setNextEntryId] = useState(1);
  
  // Counterpart Item Code and Description state
  const [counterpartItemCode, setCounterpartItemCode] = useState("");
  const [counterpartDescription, setCounterpartDescription] = useState("");
  const [counterpartQuantity, setCounterpartQuantity] = useState("");
  const [counterpartQuantityUnit, setCounterpartQuantityUnit] = useState("");
  const [counterpartFundingSource, setCounterpartFundingSource] = useState("");
  
  // Contractual Category and Stage state
  const [contractualCategory, setContractualCategory] = useState("");
  const [contractualStage, setContractualStage] = useState("");
  
  // Contractual Source of Funding state
  const [contractualSourceOfFunding, setContractualSourceOfFunding] = useState("");
  
  // Counterpart management state
  const [counterparts, setCounterparts] = useState([]);
  const [currentCounterpartIndex, setCurrentCounterpartIndex] = useState(null);
  const [showCounterpartForm, setShowCounterpartForm] = useState(false);
  const [hasUnsavedCounterpartChanges, setHasUnsavedCounterpartChanges] = useState(false);
  
  // Non-contractual management state
  const [nonContractualEntries, setNonContractualEntries] = useState([]);
  const [showNonContractualForm, setShowNonContractualForm] = useState(false);
  const [currentNonContractualIndex, setCurrentNonContractualIndex] = useState(null);
  const [hasUnsavedNonContractualChanges, setHasUnsavedNonContractualChanges] = useState(false);
  
  // Procurement management state
  const [procurementEntries, setProcurementEntries] = useState([]);
  const [counterpartSearchTerm, setCounterpartSearchTerm] = useState("");
  const [contractSearchTerm, setContractSearchTerm] = useState("");
  const [nonContractualSearchTerm, setNonContractualSearchTerm] = useState("");
  const [unsavedChangesDialog, setUnsavedChangesDialog] = useState({ open: false, targetTab: "" });
  const [contractValueValidationDialog, setContractValueValidationDialog] = useState({ open: false, message: "", fundingSource: "" });
  const [contractValueExceedDialog, setContractValueExceedDialog] = useState({ open: false, message: "", fundingSource: "" });
  const [counterpartBalanceExceedDialog, setCounterpartBalanceExceedDialog] = useState({ open: false, message: "", fundingSource: "" });
  const [fiscalYearValidationDialog, setFiscalYearValidationDialog] = useState({ open: false });
  const [showContractDialog, setShowContractDialog] = useState({ open: false, contract: null });
  const [showCounterpartDialog, setShowCounterpartDialog] = useState({ open: false, counterpart: null });
  const [showNonContractualDialog, setShowNonContractualDialog] = useState({ open: false, entry: null });
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, data: null });
  const [tooltipClickMode, setTooltipClickMode] = useState(false);
  const [itemCodesExpanded, setItemCodesExpanded] = useState(false);
  
  // Separate tooltip states for different sections
  const [mtefTooltip, setMtefTooltip] = useState({ visible: false, x: 0, y: 0, data: null });
  const [mtefTooltipClickMode, setMtefTooltipClickMode] = useState(false);
  const [mtefItemCodesExpanded, setMtefItemCodesExpanded] = useState(false);
  
  // File upload state for Additional MYC Information
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  
  // Export functionality state
  const [isExporting, setIsExporting] = useState(false);
  
  // Cache for Non-contractual tab data to prevent refetching when switching tabs
  const [nonContractualData, setNonContractualData] = useState([]);
  const [nonContractualLoading, setNonContractualLoading] = useState(false);
  const [nonContractualError, setNonContractualError] = useState(null);
  const [nonContractualDataFetched, setNonContractualDataFetched] = useState(false);
  
  // Cache for Contractual tab PBS data
  const [contractualData, setContractualData] = useState([]);
  const [contractualLoading, setContractualLoading] = useState(false);
  const [contractualError, setContractualError] = useState(null);
  
  // Project period selection state
  const [projectPeriodStart, setProjectPeriodStart] = useState('');
  const [projectPeriodEnd, setProjectPeriodEnd] = useState('');
  const [projectPeriodError, setProjectPeriodError] = useState('');
  
  // Generate fiscal year options from FY2022/23 to FY2030/31
  const fiscalYearOptions = useMemo(() => {
    const options = [];
    for (let year = 2022; year <= 2030; year++) {
      const endShort = ((year + 1) % 100).toString().padStart(2, '0');
      options.push(`FY${year}/${endShort}`);
    }
    return options;
  }, []);

  // Filtered options for end date dropdown (only shows years AFTER start date)
  const endDateOptions = useMemo(() => {
    // If no start date selected, show all options
    if (!projectPeriodStart || projectPeriodStart === '' || projectPeriodStart === 'Select...') {
      return fiscalYearOptions;
    }
    
    // Extract the start year from the selected start date
    const startMatch = projectPeriodStart.match(/FY(\d{4})/);
    if (!startMatch) {
      return fiscalYearOptions; // Fallback if regex fails
    }
    
    const startYear = parseInt(startMatch[1]);
    
    // Create a new array with only years AFTER the start date
    const filteredOptions = [];
    for (const fy of fiscalYearOptions) {
      const fyMatch = fy.match(/FY(\d{4})/);
      if (fyMatch) {
        const fyYear = parseInt(fyMatch[1]);
        if (fyYear > startYear) {
          filteredOptions.push(fy);
        }
      }
    }
    
    return filteredOptions;
  }, [fiscalYearOptions, projectPeriodStart]);
  
  // Validation function for project period
  const validateProjectPeriod = (start, end) => {
    // If no start date selected, end date should be disabled
    if (!start || start === '' || start === 'Select...') {
      return { isValid: true, message: '' };
    }
    
    // If start date is selected but no end date, that's valid (end date will be enabled)
    if (!end || end === '' || end === 'Select...') {
      return { isValid: true, message: '' };
    }
    
    const startYear = parseInt(start.match(/FY(\d{4})/)[1]);
    const endYear = parseInt(end.match(/FY(\d{4})/)[1]);
    
    if (startYear >= endYear) {
      return { isValid: false, message: 'Start period must be before end period' };
    }
    
    return { isValid: true, message: '' };
  };
  const [contractualDataFetched, setContractualDataFetched] = useState(false);
  
  // Function to format fiscal year from PBS API format to display format
  const formatFiscalYearForDisplay = (fiscalYear) => {
    if (!fiscalYear) return '';
    
    // Handle different formats from PBS API
    // Examples: "2023-2024", "2025-26", "2025-2026"
    const match = fiscalYear.match(/(\d{4})-(\d{2,4})/);
    if (match) {
      const startYear = parseInt(match[1]);
      const endPart = match[2];
      
      // Convert end part to full year if it's 2 digits
      let endYear;
      if (endPart.length === 2) {
        endYear = 2000 + parseInt(endPart);
      } else {
        endYear = parseInt(endPart);
      }
      
      // Format as FY2023/24
      const endShort = (endYear % 100).toString().padStart(2, '0');
      return `FY${startYear}/${endShort}`;
    }
    
    // If already in FY format, return as is
    if (fiscalYear.startsWith('FY')) {
      return fiscalYear;
    }
    
    return fiscalYear; // Return original if no pattern matches
  };

  // Function to get current Ugandan financial year (July 1 to June 30)
  const getCurrentUgandanFinancialYear = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11, so add 1
    
    // If current month is July (7) or later, we're in the financial year that started in current year
    // If current month is before July, we're in the financial year that started in previous year
    const financialYearStart = currentMonth >= 7 ? currentYear : currentYear - 1;
    const financialYearEnd = financialYearStart + 1;
    
    const endShort = (financialYearEnd % 100).toString().padStart(2, '0');
    return `FY${financialYearStart}/${endShort}`;
  };
  
  const [formData, setFormData] = useState({
    financing_agreement_title: "",
    annual_appropriations: "",
    approved_payments: "",
    approved_payments_gou: "",
    balance_on_contract_value: "",
    balance_on_contract_value_gou: "",
    arrears: "",
    verified_arrears: "",
    unverified_arrears: "",
    arrears_payment: "",
    arrears_6_months_plus: "",
    arrears_gou: "",
    verified_arrears_gou: "",
    unverified_arrears_gou: "",
    arrears_6_months_plus_gou: "",
    contract_reference_number: "",
    contract_expenditures: "",
    contract_implementation_plan: "",
    contract_name: "",
    description_of_procurement: "",
    contractor_name: "",
    contract_start_date: "",
    contract_end_date: "",
    contract_payment_plan: "",
    contract_status: "",
    contract_terms: "",
    contract_value: "",
    contract_value_gou: "",
    contract_value_external: "",
    contract_value_main: "",
    costing: "",
    annual_penalty_rate: "",
    counterpart_requirement_specification: "",
    counterpart_value: "",
    currency: "",
    counterpart_financing_plan: "",
    funding_source: "",
    fy_1_myc: "",
    fiscal_year_projections: "",
    non_contractual_commitments: "",
    programme_code: "",
    programme_name: "",
    project_classification: "",
    project_code: "",
    project_end_date: "",
    project_name: "",
    project_start_date: "",
    vote_code: "",
    vote_name: "",
  });
  // State to hold errors for each field.
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [validationDialog, setValidationDialog] = useState({ open: false, issues: [], field: "" });
  const [balanceExhaustedDialog, setBalanceExhaustedDialog] = useState({ open: false, message: "", fundingSource: "" });
  const [quarterlyEntryDialog, setQuarterlyEntryDialog] = useState({ open: false });
  // const [balanceExhausted, setBalanceExhausted] = useState({ external: false, gou: false });
  const [typedFlags, setTypedFlags] = useState({
    contract_reference_number: false,
    contract_value: false,
    contract_value_external: false,
    contract_value_main: false,
    costing: false,
    annual_penalty_rate: false,
  });
  const isTabSwitchingRef = useRef(false);
  const isValidationModeRef = useRef(false);

  // Debug: Log errors state changes
  useEffect(() => {
    console.log('Errors state updated:', errors);
    console.trace('setErrors called from:'); // This will show the call stack
  }, [errors]);

  // Update state on input change and clear errors for the field.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Remove error when the user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    
    // Mark that user has made changes
    if (showContractForm) {
      setHasUnsavedChanges(true);
    }
    
    // Validate date relationship when either contract date changes
    if (name === 'contract_start_date' || name === 'contract_end_date') {
      validateDateRelationship(name, value);
    }
  };

  const handleContractEvidenceUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setSnackbar({
          open: true,
          message: "Please upload only PDF or image files (JPEG, PNG, GIF)",
          severity: "error"
        });
        return;
      }
      
      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        setSnackbar({
          open: true,
          message: "File size must be less than 10MB",
          severity: "error"
        });
        return;
      }
      
      setContractEvidenceFile(file);
      // Clear validation error if file is uploaded
      if (errors.contractEvidenceFile) {
        setErrors(prev => ({ ...prev, contractEvidenceFile: "" }));
      }
      setSnackbar({
        open: true,
        message: "Contract evidence uploaded successfully",
        severity: "success"
      });
    }
  };

  const handleCounterpartEvidenceUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setSnackbar({
          open: true,
          message: "Please upload only PDF or image files (JPEG, PNG, GIF)",
          severity: "error"
        });
        return;
      }
      
      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        setSnackbar({
          open: true,
          message: "File size must be less than 10MB",
          severity: "error"
        });
        return;
      }
      
      setCounterpartEvidenceFile(file);
      // Clear validation error if file is uploaded
      if (counterpartValidationErrors.counterpartEvidenceFile) {
        setCounterpartValidationErrors(prev => ({ ...prev, counterpartEvidenceFile: "" }));
      }
      setSnackbar({
        open: true,
        message: "Counterpart evidence uploaded successfully",
        severity: "success"
      });
    }
  };

  // Validate the relationship between start and end dates
  const validateDateRelationship = (changedField, changedValue) => {
    const startDate = changedField === 'contract_start_date' ? changedValue : formData.contract_start_date;
    const endDate = changedField === 'contract_end_date' ? changedValue : formData.contract_end_date;
    
    if (startDate && endDate) {
      const startIndex = fiscalYears.indexOf(startDate);
      const endIndex = fiscalYears.indexOf(endDate);
      
      if (startIndex !== -1 && endIndex !== -1) {
        if (startIndex >= endIndex) {
          // Show validation popup dialog
          const errorMessage = startIndex === endIndex 
            ? "Contract Start Date and Contract End Date cannot be the same"
            : "Contract Start Date must be earlier than Contract End Date";
          
          openValidation("contract_dates", errorMessage);
          
          // Auto clear the invalid field and make it required
          if (changedField === 'contract_start_date') {
            setFormData((prev) => ({ ...prev, contract_start_date: "" }));
            setErrors((prev) => ({ ...prev, contract_start_date: "This field is required" }));
          } else if (changedField === 'contract_end_date') {
            setFormData((prev) => ({ ...prev, contract_end_date: "" }));
            setErrors((prev) => ({ ...prev, contract_end_date: "This field is required" }));
          }
        } else {
          // Clear any existing date relationship errors
          setErrors((prev) => ({
            ...prev,
            contract_start_date: prev.contract_start_date === "Contract Start Date must be earlier than Contract End Date" ? "" : prev.contract_start_date,
            contract_end_date: prev.contract_end_date === "Contract End Date must be later than Contract Start Date" ? "" : prev.contract_end_date
          }));
        }
      }
    }
  };

  // Validate the relationship between counterpart start and end dates
  const validateCounterpartDateRelationship = (changedField, changedValue) => {
    const startDate = changedField === 'counterpart_start_date' ? changedValue : counterpartStartDate;
    const endDate = changedField === 'counterpart_end_date' ? changedValue : counterpartEndDate;
    
    // Clear errors for the field that was just changed
    setCounterpartDateErrors((prev) => ({
      ...prev,
      [changedField]: ""
    }));
    
    if (startDate && endDate) {
      const startIndex = fiscalYears.indexOf(startDate);
      const endIndex = fiscalYears.indexOf(endDate);
      
      if (startIndex !== -1 && endIndex !== -1) {
        if (startIndex >= endIndex) {
          // Show validation popup dialog
          const errorMessage = startIndex === endIndex 
            ? "Project Start Date and Project End Date cannot be the same"
            : "Project Start Date must be earlier than Project End Date";
          
          openValidation("counterpart_dates", errorMessage);
          
          // Auto clear the invalid field and make it required
          if (changedField === 'counterpart_start_date') {
            setCounterpartStartDate("");
            setCounterpartDateErrors((prev) => ({ ...prev, counterpart_start_date: "This field is required" }));
          } else if (changedField === 'counterpart_end_date') {
            setCounterpartEndDate("");
            setCounterpartDateErrors((prev) => ({ ...prev, counterpart_end_date: "This field is required" }));
          }
        } else {
          // Clear any existing date relationship errors for both fields
          setCounterpartDateErrors((prev) => ({
            ...prev,
            counterpart_start_date: "",
            counterpart_end_date: ""
          }));
        }
      }
    }
  };

  // Validate that all fields are filled. Returns an object with errors.
  // const validate = () => {
  //   const newErrors = {};
  //   Object.keys(formData).forEach((field) => {
  //     if (!formData[field]) {
  //       newErrors[field] = "This field is required";
  //     }
  //   });


  //   return newErrors;
  // };

  // Submit form data via POST request.
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent automatic saving when switching tabs
    // Only allow saving when user explicitly clicks save/submit buttons
    if (showContractForm) {
      // Don't auto-save when form is submitted - let user click save button explicitly
      return;
    }
    
    // If no contracts to submit
    if (contracts.length === 0) {
      setSnackbar({ open: true, message: "Please add at least one contract before submitting.", severity: "warning" });
      return;
    }

    // Validate all fields from contractual, contractual obligation, and arrears tabs
    const requiredFields = [
      // Contractual tab fields
      'contract_reference_number',
      'contract_name', 
      'contractor_name',
      'contract_start_date',
      'contract_end_date',
      'contract_value',
      'contract_value_gou',
      'contract_value_external',
      'annual_penalty_rate',
      'contract_status',
      // Contractual obligation tab fields
      'approved_payments',
      'approved_payments_gou',
      // Arrears tab fields
      'arrears',
      'verified_arrears',
      'unverified_arrears',
      'arrears_6_months_plus',
      'arrears_gou',
      'verified_arrears_gou',
      'unverified_arrears_gou',
      'arrears_6_months_plus_gou'
    ];

    const invalidContracts = [];
    contracts.forEach((contract, index) => {
      const missingFields = requiredFields.filter(field => {
        const value = contract[field];
        return !value || 
               value === "" || 
               value === "Select One...." || 
               (typeof value === 'string' && value.trim() === "");
      });

      // Check fiscal year fields if they exist in the contract
      const fiscalYearErrors = [];
      if (contract.fyHeaders && contract.fyHeaders.length > 0) {
        // Check External fiscal year fields
        contract.fyHeaders.forEach(fy => {
          const externalValue = contract.pipelineExternal?.[fy];
          if (!externalValue || externalValue === "" || (typeof externalValue === 'string' && externalValue.trim() === "")) {
            fiscalYearErrors.push(`External ${fy} amount`);
          }
        });

        // Check GoU fiscal year fields
        contract.fyHeaders.forEach(fy => {
          const gouValue = contract.pipelineGoU?.[fy];
          if (!gouValue || gouValue === "" || (typeof gouValue === 'string' && gouValue.trim() === "")) {
            fiscalYearErrors.push(`GoU ${fy} amount`);
          }
        });
      }

      const allMissingFields = [...missingFields.map(field => field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())), ...fiscalYearErrors];
      
      if (allMissingFields.length > 0) {
        invalidContracts.push({
          index: index + 1,
          contractName: contract.contract_name || `Contract ${index + 1}`,
          missingFields: allMissingFields
        });
      }
    });

    if (invalidContracts.length > 0) {
      const errorMessage = `Please fill in all required fields for the following contracts:\n\n${invalidContracts.map(contract => 
        `${contract.contractName}: Missing ${contract.missingFields.join(', ')}`
      ).join('\n')}`;
      
      setSnackbar({ 
        open: true, 
        message: errorMessage, 
        severity: "error" 
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Submit all contracts
      const response = await axios.post(
        "/add_myc/multi_year_commitment",
        {
          contracts: contracts.map(contract => ({
            ...contract,
            annual_appropriations: Number(contract.annual_appropriations),
            approved_payments: Number(contract.approved_payments),
            approved_payments_gou: Number(contract.approved_payments_gou),
            balance_on_contract_value: Number(contract.balance_on_contract_value),
            balance_on_contract_value_gou: Number(contract.balance_on_contract_value_gou),
            arrears: Number(contract.arrears),
            verified_arrears: Number(contract.verified_arrears),
            unverified_arrears: Number(contract.unverified_arrears),
            arrears_payment: Number(contract.arrears_payment),
            arrears_6_months_plus: Number(contract.arrears_6_months_plus),
            arrears_gou: Number(contract.arrears_gou),
            verified_arrears_gou: Number(contract.verified_arrears_gou),
            unverified_arrears_gou: Number(contract.unverified_arrears_gou),
            arrears_6_months_plus_gou: Number(contract.arrears_6_months_plus_gou),
            contract_expenditures: Number(contract.contract_expenditures),
            contract_value: Number(contract.contract_value),
            contract_value_gou: Number(contract.contract_value_gou),
            counterpart_value: Number(contract.counterpart_value),
            fy_1_myc: Number(contract.fy_1_myc),
            fiscal_year_projections: Number(contract.fiscal_year_projections),
          }))
        }
      );
      console.log("Response:", response.data);
      setSnackbar({ open: true, message: `${contracts.length} contract(s) submitted successfully!`, severity: "success" });
      
      // Reset contracts and form after successful submission
      setContracts([]);
      setFormData({
        financing_agreement_title: "",
        annual_appropriations: "",
        approved_payments: "",
        approved_payments_gou: "",
        balance_on_contract_value: "",
        balance_on_contract_value_gou: "",
        arrears: "",
        verified_arrears: "",
        unverified_arrears: "",
        arrears_payment: "",
        arrears_6_months_plus: "",
        arrears_gou: "",
        verified_arrears_gou: "",
        unverified_arrears_gou: "",
        arrears_6_months_plus_gou: "",
        contract_reference_number: "",
        contract_expenditures: "",
        contract_implementation_plan: "",
        contract_name: "",
        contractor_name: "",
        contract_start_date: "",
        contract_end_date: "",
        contract_payment_plan: "",
        contract_status: "",
        contract_terms: "",
        contract_value: "",
        contract_value_gou: "",
        contract_value_main: "",
        counterpart_requirement_specification: "",
        counterpart_value: "",
        currency: "",
        counterpart_financing_plan: "",
        funding_source: "",
        fy_1_myc: "",
        fiscal_year_projections: "",
        non_contractual_commitments: "",
        programme_code: "",
        programme_name: "",
        project_classification: "",
        project_code: "",
        project_end_date: "",
        project_name: "",
        project_start_date: "",
        vote_code: "",
        vote_name: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Error submitting contracts:", error);
      setSnackbar({ open: true, message: "Error submitting contracts. Please try again.", severity: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => setSnackbar((s) => ({ ...s, open: false }));
  const handleCloseValidationDialog = () => setValidationDialog({ open: false, issues: [], field: "" });
  const handleCloseBalanceExhaustedDialog = () => setBalanceExhaustedDialog({ open: false, message: "", fundingSource: "" });
  const handleCloseContractValueValidationDialog = () => setContractValueValidationDialog({ open: false, message: "", fundingSource: "" });
  const handleCloseContractValueExceedDialog = () => setContractValueExceedDialog({ open: false, message: "", fundingSource: "" });
  const handleCloseCounterpartBalanceExceedDialog = () => setCounterpartBalanceExceedDialog({ open: false, message: "", fundingSource: "" });
  const handleCloseFiscalYearValidationDialog = () => setFiscalYearValidationDialog({ open: false });
  
  const handleProceedWithSave = () => {
    setFiscalYearValidationDialog({ open: false });
    // Proceed with the actual save logic
    const counterpartData = {
      counterpartStartDate,
      counterpartEndDate,
      counterpartFinancingTitle,
      counterpartRequirementSpec,
      counterpartValue,
      counterpartDisbursed,
      counterpartBalance,
      counterpartPipelineExternal,
      counterpartPipelineGoU,
      counterpartFyHeaders: [...counterpartFyHeaders],
      counterpartEvidenceFile,
      counterpartItemCode,
      counterpartDescription,
      counterpartQuantity,
      counterpartQuantityUnit,
      counterpartFundingSource
    };

    if (currentCounterpartIndex !== null) {
      // Update existing counterpart
      const updatedCounterparts = [...counterparts];
      updatedCounterparts[currentCounterpartIndex] = counterpartData;
      setCounterparts(updatedCounterparts);
    } else {
      // Add new counterpart
      setCounterparts([...counterparts, counterpartData]);
    }

    // Reset form and return to list view
    setShowCounterpartForm(false);
    setCurrentCounterpartIndex(null);
    setHasUnsavedCounterpartChanges(false);
    setCounterpartValidationErrors({}); // Clear validation errors on successful save
    setSnackbar({ 
      open: true, 
      message: currentCounterpartIndex !== null ? "Counterpart updated successfully!" : "Counterpart added successfully!", 
      severity: "success" 
    });
  };

  // Counterpart date change handlers
  const handleCounterpartStartDateChange = (e) => {
    const value = e.target.value;
    setCounterpartStartDate(value);
    validateCounterpartDateRelationship('counterpart_start_date', value);
    // Clear validation error if field is now filled
    if (value && counterpartValidationErrors.counterpartStartDate) {
      setCounterpartValidationErrors(prev => ({
        ...prev,
        counterpartStartDate: ""
      }));
    }
  };

  const handleCounterpartEndDateChange = (e) => {
    const value = e.target.value;
    setCounterpartEndDate(value);
    validateCounterpartDateRelationship('counterpart_end_date', value);
    // Clear validation error if field is now filled
    if (value && counterpartValidationErrors.counterpartEndDate) {
      setCounterpartValidationErrors(prev => ({
        ...prev,
        counterpartEndDate: ""
      }));
    }
  };

  // Check if fiscal year fields have default values (0's) for the selected funding source
  const checkFiscalYearDefaults = () => {
    if (counterpartFyHeaders.length === 0) return false;
    
    // Only check the funding source that was selected
    const hasDefaultValues = counterpartFyHeaders.some(fy => {
      if (counterpartFundingSource === "External") {
        const externalValue = counterpartPipelineExternal[fy] || "";
        return externalValue === "0" || externalValue === "";
      } else if (counterpartFundingSource === "GoU") {
        const gouValue = counterpartPipelineGoU[fy] || "";
        return gouValue === "0" || gouValue === "";
      }
      // If no funding source selected, check both (fallback behavior)
      const externalValue = counterpartPipelineExternal[fy] || "";
      const gouValue = counterpartPipelineGoU[fy] || "";
      return externalValue === "0" || externalValue === "" || gouValue === "0" || gouValue === "";
    });
    
    return hasDefaultValues;
  };

  // Counterpart form handlers
  const handleSaveCounterpart = () => {
    // Validate required fields
    const errors = {};
    
    if (!counterpartStartDate) {
      errors.counterpartStartDate = "Project Start Date is required";
    }
    if (!counterpartEndDate) {
      errors.counterpartEndDate = "Project End Date is required";
    }
    if (!counterpartFinancingTitle) {
      errors.counterpartFinancingTitle = "Financing Agreement Title is required";
    }
    if (!counterpartRequirementSpec) {
      errors.counterpartRequirementSpec = "Counterpart Requirement Specification is required";
    }
    if (!counterpartValue) {
      errors.counterpartValue = "Counterpart Value is required";
    }
    if (!counterpartDisbursed) {
      errors.counterpartDisbursed = "Counterpart Disbursed is required";
    }
    if (!counterpartItemCode) {
      errors.counterpartItemCode = "Item Code is required";
    }
    if (!counterpartDescription) {
      errors.counterpartDescription = "Description of Activity is required";
    }
    if (!counterpartQuantity) {
      errors.counterpartQuantity = "Quantity is required";
    }
    if (!counterpartQuantityUnit) {
      errors.counterpartQuantityUnit = "Unit is required";
    }
    if (!counterpartFundingSource) {
      errors.counterpartFundingSource = "Funding Source is required";
    }
    if (!counterpartEvidenceFile) {
      errors.counterpartEvidenceFile = "Counterpart Evidence upload is required";
    }

    // Set validation errors
    setCounterpartValidationErrors(errors);

    // If there are validation errors, don't save
    if (Object.keys(errors).length > 0) {
      setSnackbar({ 
        open: true, 
        message: "Please fill in all required fields before saving", 
        severity: "error" 
      });
      return;
    }

    // Check if fiscal year fields have default values
    if (checkFiscalYearDefaults()) {
      setFiscalYearValidationDialog({ open: true });
      return;
    }

    // If no default values, proceed with save directly
    handleProceedWithSave();
  };

  const handleCancelCounterpart = () => {
    // Reset all counterpart form fields
    setCounterpartStartDate("");
    setCounterpartEndDate("");
    setCounterpartFinancingTitle("");
    setCounterpartRequirementSpec("");
    setCounterpartValue("");
    setCounterpartDisbursed("");
    setCounterpartBalance("");
    setCounterpartPipelineExternal({});
    setCounterpartPipelineGoU({});
    setCounterpartFyHeaders([]);
    setCounterpartEvidenceFile(null);
    setCounterpartItemCode("");
    setCounterpartDescription("");
    setCounterpartQuantity("");
    setCounterpartQuantityUnit("");
    setCounterpartFundingSource("");
    setCounterpartDateErrors({});
    setCounterpartValidationErrors({}); // Clear validation errors
    setCurrentCounterpartIndex(null);
    setShowCounterpartForm(false);
    setHasUnsavedCounterpartChanges(false);
    setSnackbar({ open: true, message: "Counterpart form cancelled", severity: "info" });
  };

  // Handle item code selection and auto-fill description
  const handleItemCodeChange = (selectedCode) => {
    setNonContractualItemCode(selectedCode);
    
    // Auto-fill description based on selected item code
    const selectedItem = itemCodes.find(item => item.code === selectedCode);
    if (selectedItem) {
      setNonContractualDescription(selectedItem.description);
    } else {
      setNonContractualDescription("");
    }
  };

  // Handle contractual fiscal year selection
  const handleContractualFiscalYearChange = (selectedFiscalYear) => {
    console.log('🔄 handleContractualFiscalYearChange called with:', selectedFiscalYear);
    
    setContractualSelectedFiscalYear(selectedFiscalYear);
    
    // If Financial Year is cleared, clear all dependent fields
    if (!selectedFiscalYear || selectedFiscalYear === "") {
      console.log('🧹 Financial Year cleared, clearing all dependent fields');
      setContractualItemCode("");
      setContractualDescription("");
      setContractualSelectedOption(null);
      setContractualSourceOfFunding("");
      
      // Clear quarterly fields
      setContractualQ1("");
      setContractualQ2("");
      setContractualQ3("");
      setContractualQ4("");
      
      // Clear GoU quarterly fields
      setContractualGouQ1("");
      setContractualGouQ2("");
      setContractualGouQ3("");
      setContractualGouQ4("");
      
      // Clear External quarterly fields
      setContractualExternalQ1("");
      setContractualExternalQ2("");
      setContractualExternalQ3("");
      setContractualExternalQ4("");
      
      // Note: Quarterly entries are preserved when Financial Year is cleared
      
      // Clear quarterly errors
      setErrors(prev => ({
        ...prev,
        contractualQ1: "",
        contractualQ2: "",
        contractualQ3: "",
        contractualQ4: "",
        quarterlyTotal: "",
        contractualGouQ1: "",
        contractualGouQ2: "",
        contractualGouQ3: "",
        contractualGouQ4: "",
        contractualExternalQ1: "",
        contractualExternalQ2: "",
        contractualExternalQ3: "",
        contractualExternalQ4: "",
        gouQuarterlyTotal: "",
        extQuarterlyTotal: ""
      }));
      
      // Clear form data
      setFormData(prev => ({
        ...prev,
        contract_value: "",
        contract_value_external: "",
        costing: ""
      }));
      
      return;
    }
    
    // Debug available data for selected fiscal year
    if (selectedFiscalYear && fiscalYearItemCodes[selectedFiscalYear]) {
      console.log('📋 Available item codes for fiscal year', selectedFiscalYear, ':', fiscalYearItemCodes[selectedFiscalYear].length, 'items');
      console.log('📋 Sample items:', fiscalYearItemCodes[selectedFiscalYear].slice(0, 3).map(item => ({
        code: item.code,
        description: item.description,
        gouValue: item.gouValue,
        extFinValue: item.extFinValue
      })));
    }
    
    // Clear item code and related fields when fiscal year changes (but not cleared)
    if (contractualItemCode) {
      console.log('🧹 Clearing item code due to fiscal year change');
      setContractualItemCode("");
      setContractualDescription("");
      setContractualSelectedOption(null);
      // Clear quarterly fields
      setContractualQ1("");
      setContractualQ2("");
      setContractualQ3("");
      setContractualQ4("");
      // Clear quarterly entries
      setQuarterlyEntries([]);
      setNextEntryId(1);
      // Clear quarterly errors
      setErrors(prev => ({
        ...prev,
        contractualQ1: "",
        contractualQ2: "",
        contractualQ3: "",
        contractualQ4: "",
        quarterlyTotal: ""
      }));
      setFormData(prev => ({
        ...prev,
        contract_value: "",
        contract_value_external: ""
      }));
    }
  };

  // Handle contractual item code selection and auto-fill description
  const handleContractualItemCodeChange = (selectedCode, selectedOption = null) => {
    console.log('🔄 handleContractualItemCodeChange called with:', selectedCode, selectedOption);
    
    setContractualItemCode(selectedCode);
    setContractualSelectedOption(selectedOption);
    
    // If Item_Code is cleared, clear all dependent fields
    if (!selectedCode) {
      console.log('🧹 Item_Code cleared, clearing dependent fields');
      setContractualDescription("");
      setContractualSourceOfFunding("");
      setContractualSelectedOption(null);
      setFormData(prev => ({
        ...prev,
        contract_value: "",
        contract_value_external: ""
      }));
      return;
    }
    
    // Use the selected option if provided (fiscal year-specific), otherwise fallback to itemCodes
    let selectedItem = selectedOption;
    if (!selectedItem) {
      selectedItem = itemCodes.find(item => item.code === selectedCode);
    }
    
    if (selectedItem) {
      console.log('📝 Found item for description:', selectedItem.description);
      console.log('💰 Selected item PBS values (fiscal year-specific):', {
        fiscalYear: selectedItem.fiscalYear,
        gouValue: selectedItem.gouValue,
        extFinValue: selectedItem.extFinValue
      });
      setContractualDescription(selectedItem.description);
    } else {
      console.log('❌ No item found for code:', selectedCode);
      setContractualDescription("");
    }
  };

  // Handle counterpart item code selection and auto-fill description
  const handleCounterpartItemCodeChange = (selectedCode) => {
    setCounterpartItemCode(selectedCode);
    
    // Auto-fill description based on selected item code
    const selectedItem = itemCodes.find(item => item.code === selectedCode);
    if (selectedItem) {
      setCounterpartDescription(selectedItem.description);
    } else {
      setCounterpartDescription("");
    }
  };

  // Validate quarterly breakdown total against costing limit
  const validateQuarterlyTotal = (q1Value = null, q2Value = null, q3Value = null, q4Value = null) => {
    const q1 = parseFloat((q1Value || contractualQ1).replace(/,/g, '')) || 0;
    const q2 = parseFloat((q2Value || contractualQ2).replace(/,/g, '')) || 0;
    const q3 = parseFloat((q3Value || contractualQ3).replace(/,/g, '')) || 0;
    const q4 = parseFloat((q4Value || contractualQ4).replace(/,/g, '')) || 0;
    const quarterlyTotal = q1 + q2 + q3 + q4;
    
    // Get the costing limit based on funding source
    const costingLimit = contractualSourceOfFunding === "GoU" ? 
      (parseFloat(formData.costing?.replace(/,/g, '')) || 0) :
      contractualSourceOfFunding === "External" ? 
      (parseFloat(formData.contract_value_external?.replace(/,/g, '')) || 0) :
      (parseFloat(formData.costing?.replace(/,/g, '')) || 0);
    
    // Clear previous quarterly errors
    setErrors(prev => ({
      ...prev,
      contractualQ1: "",
      contractualQ2: "",
      contractualQ3: "",
      contractualQ4: "",
      quarterlyTotal: ""
    }));
    
    // Check if any quarterly field exactly equals the costing limit
    const quarterlyValues = [q1, q2, q3, q4];
    const matchingQuarter = quarterlyValues.findIndex(value => value === costingLimit && value > 0);
    
    if (matchingQuarter !== -1 && costingLimit > 0) {
      const quarterNames = ['Q1', 'Q2', 'Q3', 'Q4'];
      const matchingQuarterName = quarterNames[matchingQuarter];
      
      // Show dialog notification for exact match
      setSnackbar({
        open: true,
        message: `ℹ️ ${matchingQuarterName} amount (${costingLimit.toLocaleString()}) exactly matches the costing limit!`,
        severity: "info"
      });
    }
    
    // Check if quarterly total exceeds costing limit (normal validation)
    if (quarterlyTotal > costingLimit && costingLimit > 0) {
      console.log(`🚨 Quarterly total ${quarterlyTotal} exceeds costing limit ${costingLimit}`);
      const errorMessage = `Quarterly total (${quarterlyTotal.toLocaleString()}) exceeds costing limit (${costingLimit.toLocaleString()})`;
      
      setErrors(prev => ({
        ...prev,
        contractualQ1: errorMessage,
        contractualQ2: errorMessage,
        contractualQ3: errorMessage,
        contractualQ4: errorMessage,
        quarterlyTotal: errorMessage
      }));
      
      // Show snackbar notification for exceeding limit
      setSnackbar({
        open: true,
        message: `⚠️ Quarterly breakdown total exceeds the costing limit! Total: ${quarterlyTotal.toLocaleString()}, Limit: ${costingLimit.toLocaleString()}`,
        severity: "warning"
      });
    } else {
      console.log(`✅ Quarterly total ${quarterlyTotal} is within costing limit ${costingLimit}`);
    }
  };

  // Validate quarterly totals for both GoU and External funding sources
  const validateBothQuarterlyTotal = (
    gouQ1Value = null, gouQ2Value = null, gouQ3Value = null, gouQ4Value = null,
    extQ1Value = null, extQ2Value = null, extQ3Value = null, extQ4Value = null
  ) => {
    // Parse GoU quarterly values
    const gouQ1 = parseFloat((gouQ1Value || contractualGouQ1).replace(/,/g, '')) || 0;
    const gouQ2 = parseFloat((gouQ2Value || contractualGouQ2).replace(/,/g, '')) || 0;
    const gouQ3 = parseFloat((gouQ3Value || contractualGouQ3).replace(/,/g, '')) || 0;
    const gouQ4 = parseFloat((gouQ4Value || contractualGouQ4).replace(/,/g, '')) || 0;
    const gouTotal = gouQ1 + gouQ2 + gouQ3 + gouQ4;
    
    // Parse External quarterly values
    const extQ1 = parseFloat((extQ1Value || contractualExternalQ1).replace(/,/g, '')) || 0;
    const extQ2 = parseFloat((extQ2Value || contractualExternalQ2).replace(/,/g, '')) || 0;
    const extQ3 = parseFloat((extQ3Value || contractualExternalQ3).replace(/,/g, '')) || 0;
    const extQ4 = parseFloat((extQ4Value || contractualExternalQ4).replace(/,/g, '')) || 0;
    const extTotal = extQ1 + extQ2 + extQ3 + extQ4;
    
    // Get the costing limits
    const gouLimit = parseFloat(formData.costing?.replace(/,/g, '')) || 0;
    const extLimit = parseFloat(formData.contract_value_external?.replace(/,/g, '')) || 0;
    
    // Clear previous quarterly errors
    setErrors(prev => ({
      ...prev,
      contractualGouQ1: "",
      contractualGouQ2: "",
      contractualGouQ3: "",
      contractualGouQ4: "",
      contractualExternalQ1: "",
      contractualExternalQ2: "",
      contractualExternalQ3: "",
      contractualExternalQ4: "",
      gouQuarterlyTotal: "",
      extQuarterlyTotal: ""
    }));
    
    // Check GoU quarterly validation
    if (gouTotal > gouLimit && gouLimit > 0) {
      const errorMessage = `GoU quarterly total (${gouTotal.toLocaleString()}) exceeds GoU limit (${gouLimit.toLocaleString()})`;
      setErrors(prev => ({
        ...prev,
        contractualGouQ1: errorMessage,
        contractualGouQ2: errorMessage,
        contractualGouQ3: errorMessage,
        contractualGouQ4: errorMessage,
        gouQuarterlyTotal: errorMessage
      }));
      
      setSnackbar({
        open: true,
        message: `⚠️ GoU quarterly breakdown exceeds the GoU limit! Total: ${gouTotal.toLocaleString()}, Limit: ${gouLimit.toLocaleString()}`,
        severity: "warning"
      });
    }
    
    // Check External quarterly validation
    if (extTotal > extLimit && extLimit > 0) {
      const errorMessage = `External quarterly total (${extTotal.toLocaleString()}) exceeds External limit (${extLimit.toLocaleString()})`;
      setErrors(prev => ({
        ...prev,
        contractualExternalQ1: errorMessage,
        contractualExternalQ2: errorMessage,
        contractualExternalQ3: errorMessage,
        contractualExternalQ4: errorMessage,
        extQuarterlyTotal: errorMessage
      }));
      
      setSnackbar({
        open: true,
        message: `⚠️ External quarterly breakdown exceeds the External limit! Total: ${extTotal.toLocaleString()}, Limit: ${extLimit.toLocaleString()}`,
        severity: "warning"
      });
    }
    
    // Check for exact matches
    const gouValues = [gouQ1, gouQ2, gouQ3, gouQ4];
    const extValues = [extQ1, extQ2, extQ3, extQ4];
    
    const gouMatchingQuarter = gouValues.findIndex(value => value === gouLimit && value > 0);
    const extMatchingQuarter = extValues.findIndex(value => value === extLimit && value > 0);
    
    if (gouMatchingQuarter !== -1 && gouLimit > 0) {
      const quarterNames = ['Q1', 'Q2', 'Q3', 'Q4'];
      const matchingQuarterName = quarterNames[gouMatchingQuarter];
      setSnackbar({
        open: true,
        message: `ℹ️ GoU ${matchingQuarterName} amount (${gouLimit.toLocaleString()}) exactly matches the GoU limit!`,
        severity: "info"
      });
    }
    
    if (extMatchingQuarter !== -1 && extLimit > 0) {
      const quarterNames = ['Q1', 'Q2', 'Q3', 'Q4'];
      const matchingQuarterName = quarterNames[extMatchingQuarter];
      setSnackbar({
        open: true,
        message: `ℹ️ External ${matchingQuarterName} amount (${extLimit.toLocaleString()}) exactly matches the External limit!`,
        severity: "info"
      });
    }
    
    console.log(`✅ GoU total ${gouTotal} (limit: ${gouLimit}), External total ${extTotal} (limit: ${extLimit})`);
  };

  // Add new quarterly entry
  const addQuarterlyEntry = () => {
    if (!contractualSelectedFiscalYear || !contractualItemCode) {
      setSnackbar({
        open: true,
        message: "Please select Financial Year and Item Code first!",
        severity: "warning"
      });
      return;
    }

    const newEntry = {
      id: nextEntryId,
      fiscalYear: contractualSelectedFiscalYear,
      itemCode: contractualItemCode,
      description: contractualDescription,
      category: contractualCategory,
      stage: contractualStage,
      sourceOfFunding: contractualSourceOfFunding,
      q1: contractualQ1,
      q2: contractualQ2,
      q3: contractualQ3,
      q4: contractualQ4,
      // GoU quarterly fields
      gouQ1: contractualGouQ1,
      gouQ2: contractualGouQ2,
      gouQ3: contractualGouQ3,
      gouQ4: contractualGouQ4,
      // External quarterly fields
      externalQ1: contractualExternalQ1,
      externalQ2: contractualExternalQ2,
      externalQ3: contractualExternalQ3,
      externalQ4: contractualExternalQ4,
      total: (() => {
        if (contractualSourceOfFunding === "Both") {
          const gouQ1 = parseFloat(contractualGouQ1.replace(/,/g, '')) || 0;
          const gouQ2 = parseFloat(contractualGouQ2.replace(/,/g, '')) || 0;
          const gouQ3 = parseFloat(contractualGouQ3.replace(/,/g, '')) || 0;
          const gouQ4 = parseFloat(contractualGouQ4.replace(/,/g, '')) || 0;
          const extQ1 = parseFloat(contractualExternalQ1.replace(/,/g, '')) || 0;
          const extQ2 = parseFloat(contractualExternalQ2.replace(/,/g, '')) || 0;
          const extQ3 = parseFloat(contractualExternalQ3.replace(/,/g, '')) || 0;
          const extQ4 = parseFloat(contractualExternalQ4.replace(/,/g, '')) || 0;
          return (gouQ1 + gouQ2 + gouQ3 + gouQ4) + (extQ1 + extQ2 + extQ3 + extQ4);
        } else {
          const q1 = parseFloat(contractualQ1.replace(/,/g, '')) || 0;
          const q2 = parseFloat(contractualQ2.replace(/,/g, '')) || 0;
          const q3 = parseFloat(contractualQ3.replace(/,/g, '')) || 0;
          const q4 = parseFloat(contractualQ4.replace(/,/g, '')) || 0;
          return q1 + q2 + q3 + q4;
        }
      })()
    };

    setQuarterlyEntries(prev => [...prev, newEntry]);
    setNextEntryId(prev => prev + 1);

    // Clear current form
    setContractualSelectedFiscalYear("");
    setContractualItemCode("");
    setContractualDescription("");
    // Keep Category and Stage fields for reuse
    // setContractualCategory("");
    // setContractualStage("");
    setContractualSourceOfFunding("");
    setContractualQ1("");
    setContractualQ2("");
    setContractualQ3("");
    setContractualQ4("");
    // Clear GoU quarterly fields
    setContractualGouQ1("");
    setContractualGouQ2("");
    setContractualGouQ3("");
    setContractualGouQ4("");
    // Clear External quarterly fields
    setContractualExternalQ1("");
    setContractualExternalQ2("");
    setContractualExternalQ3("");
    setContractualExternalQ4("");

    setSnackbar({
      open: true,
      message: "Quarterly entry added successfully!",
      severity: "success"
    });
  };

  // Delete quarterly entry
  const deleteQuarterlyEntry = (entryId) => {
    setQuarterlyEntries(prev => prev.filter(entry => entry.id !== entryId));
    setSnackbar({
      open: true,
      message: "Quarterly entry deleted successfully!",
      severity: "info"
    });
  };

  // Non-contractual validation function
  const validateNonContractualForm = () => {
    const errors = {};
    
    // Required fields validation
    if (!nonContractualItemCode || nonContractualItemCode.trim() === '') {
      errors.itemCode = 'Item Code is required';
    }
    
    if (!nonContractualStartDate || nonContractualStartDate.trim() === '') {
      errors.startDate = 'Project Start Date is required';
    }
    
    if (!nonContractualEndDate || nonContractualEndDate.trim() === '') {
      errors.endDate = 'Project End Date is required';
    }
    
    // Check if at least one funding source has values
    const hasGoUValues = Object.values(nonContractualPipelineGoU).some(value => value && value.trim() !== '');
    const hasExternalValues = Object.values(nonContractualPipelineExternal).some(value => value && value.trim() !== '');
    
    if (!hasGoUValues && !hasExternalValues) {
      errors.fundingSource = 'At least one funding source (GoU or External) must have values';
    }
    
    // Date validation - end date should be after start date
    if (nonContractualStartDate && nonContractualEndDate) {
      const startIdx = fiscalYears.indexOf(nonContractualStartDate);
      const endIdx = fiscalYears.indexOf(nonContractualEndDate);
      
      if (startIdx !== -1 && endIdx !== -1 && endIdx < startIdx) {
        errors.dateRange = 'End date must be after or equal to start date';
      }
    }
    
    setNonContractualValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Non-contractual form handlers
  const handleSaveNonContractual = () => {
    // Validate form before saving
    if (!validateNonContractualForm()) {
      setSnackbar({ 
        open: true, 
        message: "Please fill in all required fields", 
        severity: "error" 
      });
      return;
    }
    
    // Get PBS data for vote codes and project info
    const pbsData = nonContractualData.find(pbs => pbs.Project_Code === projectData.code) || {};
    
    const nonContractualEntry = {
      voteCode: pbsData.Vote_Code || "",
      voteName: pbsData.Vote_Name || "",
      programmeCode: pbsData.Programme_Code || "",
      programmeName: pbsData.Programme_Name || "",
      projectCode: pbsData.Project_Code || projectData.code || "",
      projectName: pbsData.Project_Name || projectData.title || "",
      itemCode: nonContractualItemCode,
      description: nonContractualDescription,
      startDate: nonContractualStartDate,
      endDate: nonContractualEndDate,
      goUAmount: nonContractualGoUAmount,
      externalAmount: nonContractualExternalAmount,
      fundingSource: nonContractualFundingSource,
      counterpartValue: nonContractualCounterpartValue,
      counterpartReleased: nonContractualCounterpartReleased,
      counterpartBalance: nonContractualCounterpartBalance,
      fyHeaders: [...nonContractualFyHeaders],
      pipelineGoU: Object.fromEntries(
        nonContractualFyHeaders.map(fy => [fy, nonContractualPipelineGoU[fy] || "0"])
      ),
      pipelineExternal: Object.fromEntries(
        nonContractualFyHeaders.map(fy => [fy, nonContractualPipelineExternal[fy] || "0"])
      )
    };

    if (currentNonContractualIndex !== null) {
      // Update existing entry
      const updatedData = [...nonContractualEntries];
      updatedData[currentNonContractualIndex] = nonContractualEntry;
      setNonContractualEntries(updatedData);
    } else {
      // Add new entry
      setNonContractualEntries([...nonContractualEntries, nonContractualEntry]);
    }

    // Reset form and return to list view
    setShowNonContractualForm(false);
    setCurrentNonContractualIndex(null);
    setHasUnsavedNonContractualChanges(false);
    
    // Reset all non-contractual form fields
    setNonContractualItemCode("");
    setNonContractualDescription("");
    setNonContractualStartDate("");
    setNonContractualEndDate("");
    setNonContractualGoUAmount("");
    setNonContractualExternalAmount("");
    setNonContractualFundingSource("");
    setNonContractualCounterpartValue("");
    setNonContractualCounterpartReleased("");
    setNonContractualCounterpartBalance("");
    setNonContractualFyHeaders([]);
    setNonContractualPipelineGoU({});
    setNonContractualPipelineExternal({});
    setNonContractualValidationErrors({});

    setSnackbar({ 
      open: true, 
      message: "Non-contractual entry saved successfully!", 
      severity: "success" 
    });
  };

  const handleCancelNonContractual = () => {
    // Reset form and return to list view
    setShowNonContractualForm(false);
    setCurrentNonContractualIndex(null);
    setHasUnsavedNonContractualChanges(false);
    
    // Reset all non-contractual form fields
    setNonContractualItemCode("");
    setNonContractualDescription("");
    setNonContractualStartDate("");
    setNonContractualEndDate("");
    setNonContractualGoUAmount("");
    setNonContractualExternalAmount("");
    setNonContractualFundingSource("");
    setNonContractualCounterpartValue("");
    setNonContractualCounterpartReleased("");
    setNonContractualCounterpartBalance("");
    setNonContractualFyHeaders([]);
    setNonContractualPipelineGoU({});
    setNonContractualPipelineExternal({});
    setNonContractualValidationErrors({});
    
    // setSnackbar({ open: true, message: "Non-contractual form cancelled", severity: "info" });
  };
  
  // File upload handlers for Additional MYC Information
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/pdf' // .pdf
    ];
    
    const validFiles = files.filter(file => {
      const isValidType = allowedTypes.includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isValidType) {
        setSnackbar({
          open: true,
          message: `File ${file.name} is not a supported format. Please upload Excel, Word, or PDF files only.`,
          severity: 'error'
        });
      }
      
      if (!isValidSize) {
        setSnackbar({
          open: true,
          message: `File ${file.name} is too large. Maximum file size is 10MB.`,
          severity: 'error'
        });
      }
      
      return isValidType && isValidSize;
    });
    
    if (validFiles.length > 0) {
      validFiles.forEach(file => {
        const fileId = Date.now() + Math.random();
        setUploadedFiles(prev => [...prev, {
          id: fileId,
          name: file.name,
          size: file.size,
          type: file.type,
          file: file,
          uploadDate: new Date().toISOString()
        }]);
        
        // Simulate upload progress
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
        
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const currentProgress = prev[fileId] || 0;
            if (currentProgress >= 100) {
              clearInterval(progressInterval);
              return prev;
            }
            return { ...prev, [fileId]: currentProgress + 10 };
          });
        }, 200);
      });
      
      setSnackbar({
        open: true,
        message: `${validFiles.length} file(s) uploaded successfully`,
        severity: 'success'
      });
    }
    
    // Reset the input
    event.target.value = '';
  };
  
  const handleFileRemove = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  };
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const getFileIcon = (fileType) => {
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
      return '📊';
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return '📄';
    } else if (fileType.includes('pdf')) {
      return '📕';
    }
    return '📁';
  };
  
  // Export MYC Report functionality
  const exportMYCReport = async (contract) => {
    setIsExporting(true);
    
    try {
      let currentNonContractualData = nonContractualData;
      
      // Ensure PBS data is fetched before export
      if (currentNonContractualData.length === 0) {
        console.log('PBS data not available, fetching...');
        setNonContractualLoading(true);
        
        try {
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

          const accessToken = loginResponse.data.data.login.access_token;

          // Then fetch the data
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
                "Accept": "application/json"
              },
              timeout: 60000,
              withCredentials: false,
            }
          );

          currentNonContractualData = dataResponse.data.data.cgIbpProjectBudgetAllocations || [];
          console.log('PBS data fetched successfully:', currentNonContractualData.length, 'records');
          
        } catch (error) {
          console.error('Error fetching PBS data:', error);
          currentNonContractualData = [];
        } finally {
          setNonContractualLoading(false);
        }
      }
      
      // Get project data from PBS system (Non-contractual tab)
      const pbsData = currentNonContractualData.find(item => item.Project_Code === projectData.code) || {};
      
      // Debug logging to help identify data issues
      console.log('PBS Data found:', pbsData);
      console.log('Non-contractual data:', currentNonContractualData);
      console.log('Project data:', projectData);
      console.log('Contract data:', contract);
      
      const projectInfo = {
        programmeCode: pbsData.Programme_Code || projectData.code || 'N/A',
        programmeName: pbsData.Programme_Name || projectData.title || 'N/A',
        voteCode: pbsData.Vote_Code || 'N/A',
        voteName: pbsData.Vote_Name || 'N/A',
        projectCode: pbsData.Project_Code || projectData.code || 'N/A',
        projectName: pbsData.Project_Name || projectData.title || 'N/A',
        startDate: contract.contract_start_date || 'N/A',
        endDate: contract.contract_end_date || 'N/A'
      };
      
      // Prepare fiscal year data
      const fyHeaders = contract.fyHeaders || [];
      const fiscalYearData = fyHeaders.map(fy => ({
        fiscalYear: fy,
        externalValue: Number(contract.pipelineExternal?.[fy]) || 0,
        gouValue: Number(contract.pipelineGoU?.[fy]) || 0,
        totalValue: (Number(contract.pipelineExternal?.[fy]) || 0) + (Number(contract.pipelineGoU?.[fy]) || 0)
      }));
      
      // Calculate totals
      const totalExternal = fiscalYearData.reduce((sum, fy) => sum + fy.externalValue, 0);
      const totalGoU = fiscalYearData.reduce((sum, fy) => sum + fy.gouValue, 0);
      const grandTotal = totalExternal + totalGoU;
      
      // Create hierarchical header structure for Excel
      const basicColumns = [
        'Programme Code',
        'Programme Name', 
        'Vote Code',
        'Vote Name',
        'Project Code',
        'Project Name',
        'Contract Start Date',
        'Contract End Date',
        'Total GoU',
        'Total External',
        'Grand Total'
      ];
      
      // Create sub-column headers for fiscal years
      const fiscalYearSubColumns = fyHeaders.flatMap(fy => ['GoU', 'External', 'Total']);
      
      // Create parent headers for fiscal years (empty strings for basic columns)
      const fiscalYearParentHeaders = fyHeaders.flatMap(fy => [fy, '', '']);
      
      // Create Excel data structure with hierarchical headers
      const excelData = [
        // First header row: Parent fiscal year headers
        [
          ...basicColumns.map(() => ''), // Empty for basic columns
          ...fiscalYearParentHeaders
        ],
        // Second header row: Sub-column headers
        [
          ...basicColumns,
          ...fiscalYearSubColumns
        ],
        // Data row with project info and fiscal year values
        [
          projectInfo.programmeCode,
          projectInfo.programmeName,
          projectInfo.voteCode,
          projectInfo.voteName,
          projectInfo.projectCode,
          projectInfo.projectName,
          projectInfo.startDate,
          projectInfo.endDate,
          totalGoU,
          totalExternal,
          grandTotal,
          // Fiscal year values in GoU/External/Total triplets
          ...fyHeaders.flatMap(fy => {
            const fyData = fiscalYearData.find(f => f.fiscalYear === fy);
            const gouValue = fyData ? fyData.gouValue : 0;
            const externalValue = fyData ? fyData.externalValue : 0;
            const fyTotal = gouValue + externalValue;
            return [gouValue, externalValue, fyTotal];
          })
        ]
      ];
      
      // Create Excel file with automatic formatting using HTML table structure
      const createFormattedExcel = () => {
        const htmlContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="utf-8">
          <meta name="ExcelFormat" content="text/html">
          <style>
            table { 
              border-collapse: collapse; 
              width: 100%; 
              border: 2px solid #000;
            }
            .parent-header { 
              background-color: #4CAF50; 
              color: white; 
              font-weight: bold; 
              text-align: center; 
              font-size: 9pt;
              padding: 10px;
              border: 2px solid #000;
              border-top: 2px solid #000;
              border-bottom: 2px solid #000;
              border-left: 2px solid #000;
              border-right: 2px solid #000;
            }
            .sub-header { 
              background-color: #E8F5E8; 
              font-weight: bold; 
              text-align: center; 
              font-size: 9pt;
              padding: 8px;
              border: 2px solid #000;
              border-top: 2px solid #000;
              border-bottom: 2px solid #000;
              border-left: 2px solid #000;
              border-right: 2px solid #000;
            }
            .basic-header { 
              background-color: #2196F3; 
              color: white; 
              font-weight: bold; 
              text-align: center; 
              font-size: 9pt;
              padding: 8px;
              border: 2px solid #000;
              border-top: 2px solid #000;
              border-bottom: 2px solid #000;
              border-left: 2px solid #000;
              border-right: 2px solid #000;
            }
            .data-cell { 
              padding: 6px; 
              border: 2px solid #000;
              border-top: 2px solid #000;
              border-bottom: 2px solid #000;
              border-left: 2px solid #000;
              border-right: 2px solid #000;
              font-size: 9pt;
            }
            .number-cell { 
              text-align: right; 
              padding: 6px; 
              border: 2px solid #000;
              border-top: 2px solid #000;
              border-bottom: 2px solid #000;
              border-left: 2px solid #000;
              border-right: 2px solid #000;
              font-size: 9pt;
            }
            td {
              border: 2px solid #000 !important;
            }
            tr {
              border: 2px solid #000;
            }
          </style>
        </head>
        <body>
          <table border="1" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border: 2px solid #000;">
            <tr>
              ${basicColumns.map(() => '<td class="basic-header" style="border: 2px solid #000;"></td>').join('')}
              ${fyHeaders.map(fy => `<td class="parent-header" colspan="3" style="border: 2px solid #000;">${fy}</td>`).join('')}
            </tr>
            <tr>
              ${basicColumns.map(col => `<td class="sub-header" style="border: 2px solid #000;">${col}</td>`).join('')}
              ${fyHeaders.map(() => '<td class="sub-header" style="border: 2px solid #000;">GoU</td><td class="sub-header" style="border: 2px solid #000;">External</td><td class="sub-header" style="border: 2px solid #000;">Total</td>').join('')}
            </tr>
            <tr>
              ${projectInfo.programmeCode ? `<td class="data-cell" style="border: 2px solid #000;">${projectInfo.programmeCode}</td>` : '<td class="data-cell" style="border: 2px solid #000;">N/A</td>'}
              ${projectInfo.programmeName ? `<td class="data-cell" style="border: 2px solid #000;">${projectInfo.programmeName}</td>` : '<td class="data-cell" style="border: 2px solid #000;">N/A</td>'}
              ${projectInfo.voteCode ? `<td class="data-cell" style="border: 2px solid #000;">${projectInfo.voteCode}</td>` : '<td class="data-cell" style="border: 2px solid #000;">N/A</td>'}
              ${projectInfo.voteName ? `<td class="data-cell" style="border: 2px solid #000;">${projectInfo.voteName}</td>` : '<td class="data-cell" style="border: 2px solid #000;">N/A</td>'}
              ${projectInfo.projectCode ? `<td class="data-cell" style="border: 2px solid #000;">${projectInfo.projectCode}</td>` : '<td class="data-cell" style="border: 2px solid #000;">N/A</td>'}
              ${projectInfo.projectName ? `<td class="data-cell" style="border: 2px solid #000;">${projectInfo.projectName}</td>` : '<td class="data-cell" style="border: 2px solid #000;">N/A</td>'}
              ${projectInfo.startDate ? `<td class="data-cell" style="border: 2px solid #000;">${projectInfo.startDate}</td>` : '<td class="data-cell" style="border: 2px solid #000;">N/A</td>'}
              ${projectInfo.endDate ? `<td class="data-cell" style="border: 2px solid #000;">${projectInfo.endDate}</td>` : '<td class="data-cell" style="border: 2px solid #000;">N/A</td>'}
              <td class="number-cell" style="border: 2px solid #000;">${totalGoU.toLocaleString()}</td>
              <td class="number-cell" style="border: 2px solid #000;">${totalExternal.toLocaleString()}</td>
              <td class="number-cell" style="border: 2px solid #000;">${grandTotal.toLocaleString()}</td>
              ${fyHeaders.map(fy => {
                const fyData = fiscalYearData.find(f => f.fiscalYear === fy);
                const gouValue = fyData ? fyData.gouValue : 0;
                const externalValue = fyData ? fyData.externalValue : 0;
                const fyTotal = gouValue + externalValue;
                return `<td class="number-cell" style="border: 2px solid #000;">${gouValue.toLocaleString()}</td><td class="number-cell" style="border: 2px solid #000;">${externalValue.toLocaleString()}</td><td class="number-cell" style="border: 2px solid #000;">${fyTotal.toLocaleString()}</td>`;
              }).join('')}
            </tr>
          </table>
        </body>
        </html>`;
        
        return htmlContent;
      };
      
      const excelContent = createFormattedExcel();
      
      // Create and download file
      const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `MYC_Comprehensive_Report_${contract.contract_reference_number || 'Contract'}_${new Date().toISOString().split('T')[0]}.xls`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSnackbar({
        open: true,
        message: 'MYC Report exported successfully',
        severity: 'success'
      });
      
    } catch (error) {
      console.error('Export error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to export MYC Report',
        severity: 'error'
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleCloseUnsavedChangesDialog = () => setUnsavedChangesDialog({ open: false, targetTab: "" });
  
  const handleDiscardChanges = () => {
    setHasUnsavedChanges(false);
    setUnsavedChangesDialog({ open: false, targetTab: "" });
    // Switch to the target tab
    const targetTab = unsavedChangesDialog.targetTab;
    if (targetTab) {
      onTabChange(targetTab);
    }
  };
  
  const handleSaveAndSwitch = () => {
    handleSaveContract();
    setUnsavedChangesDialog({ open: false, targetTab: "" });
    // Switch to the target tab
    const targetTab = unsavedChangesDialog.targetTab;
    if (targetTab) {
      onTabChange(targetTab);
    }
  };

  // Contract management functions
  const handleAddContract = () => {
    // Reset form data for new contract
    setFormData({
      financing_agreement_title: "",
      annual_appropriations: "",
      approved_payments: "",
      approved_payments_gou: "",
      balance_on_contract_value: "",
      balance_on_contract_value_gou: "",
      arrears: "",
      verified_arrears: "",
      unverified_arrears: "",
      arrears_payment: "",
      arrears_6_months_plus: "",
      arrears_gou: "",
      verified_arrears_gou: "",
      unverified_arrears_gou: "",
      arrears_6_months_plus_gou: "",
      contract_reference_number: "",
      contract_expenditures: "",
      contract_implementation_plan: "",
      contract_name: "",
      contractor_name: "",
      contract_start_date: "",
      contract_end_date: "",
      contract_payment_plan: "",
      contract_status: "",
      contract_terms: "",
      contract_value: "",
      contract_value_gou: "",
      contract_value_external: "",
      contract_value_main: "",
      costing: "",
      annual_penalty_rate: "",
      counterpart_requirement_specification: "",
      counterpart_value: "",
      currency: "",
      counterpart_financing_plan: "",
      funding_source: "",
      fy_1_myc: "",
      fiscal_year_projections: "",
      non_contractual_commitments: "",
      programme_code: "",
      programme_name: "",
      project_classification: "",
      project_code: "",
      project_end_date: "",
      project_name: "",
      project_start_date: "",
      vote_code: "",
      vote_name: "",
    });
    
    // Set current financial year
    setSelectedFinancialYear(getCurrentUgandanFinancialYear());
    
    // Reset all related states for a fresh form
    setCurrentContractIndex(null);
    setShowContractForm(true);
    setErrors({});
    setHasUnsavedChanges(false);
    setPipelineExternal({});
    setPipelineGoU({});
    setContractValueExternal("");
    setAnnualPenaltyRate("");
    
    // Reset procurement fields
    setContractualItemCode("");
    setContractualDescription("");
    setContractualCategory("");
    setContractualStage("");
    // Reset quarterly fields
    setContractualQ1("");
    setContractualQ2("");
    setContractualQ3("");
    setContractualQ4("");
    // Reset GoU quarterly fields
    setContractualGouQ1("");
    setContractualGouQ2("");
    setContractualGouQ3("");
    setContractualGouQ4("");
    // Reset External quarterly fields
    setContractualExternalQ1("");
    setContractualExternalQ2("");
    setContractualExternalQ3("");
    setContractualExternalQ4("");
    // Reset quarterly entries
    setQuarterlyEntries([]);
    setNextEntryId(1);
    // Clear quarterly errors
    setErrors(prev => ({
      ...prev,
      contractualQ1: "",
      contractualQ2: "",
      contractualQ3: "",
      contractualQ4: "",
      contractualGouQ1: "",
      contractualGouQ2: "",
      contractualGouQ3: "",
      contractualGouQ4: "",
      contractualExternalQ1: "",
      contractualExternalQ2: "",
      contractualExternalQ3: "",
      contractualExternalQ4: "",
      quarterlyTotal: "",
      gouQuarterlyTotal: "",
      extQuarterlyTotal: ""
    }));
    
    // Reset source of funding
    setContractualSourceOfFunding("");
    
    // Reset project classification
    setContractualProjectClassification("");
    
    // Reset contract evidence file
    setContractEvidenceFile(null);
    
    // Switch to contractual obligation tab by default
    setNestedTab("obligation");
    // setBalanceExhausted({ external: false, gou: false });
    setBalanceExhaustedDialog({ open: false, message: "", fundingSource: "" });
    setContractValueValidationDialog({ open: false, message: "", fundingSource: "" });
    setContractValueExceedDialog({ open: false, message: "", fundingSource: "" });
  };

  const handleEditContract = (index) => {
    const contract = contracts[index];
    
    // Preserve main contract information
    const mainContractData = {
      contract_reference_number: contract.contract_reference_number,
      contract_name: contract.contract_name,
      contract_description: contract.contract_description,
      contractor_name: contract.contractor_name,
      contract_start_date: contract.contract_start_date,
      contract_end_date: contract.contract_end_date,
      contract_value: contract.contract_value,
      contract_status: contract.contract_status,
      annual_penalty_rate: contract.annual_penalty_rate,
      // Preserve procurement fields
      contractualItemCode: contract.contractualItemCode,
      contractualDescription: contract.contractualDescription,
      contractualCategory: contract.contractualCategory,
      contractualStage: contract.contractualStage,
      // Preserve quarterly fields
      contractualQ1: contract.contractualQ1,
      contractualQ2: contract.contractualQ2,
      contractualQ3: contract.contractualQ3,
      contractualQ4: contract.contractualQ4,
      // Preserve source of funding
      contractualSourceOfFunding: contract.contractualSourceOfFunding
    };
    
    // Reset contractual obligation and arrears fields
    const resetFinancialData = {
      // Contractual obligation fields
      approved_payments: "",
      approved_payments_gou: "",
      contract_value_external: "",
      contract_value_gou: "",
      balance_on_contract_value: "",
      balance_on_contract_value_gou: "",
      
      // Arrears fields
      arrears: "",
      verified_arrears: "",
      unverified_arrears: "",
      arrears_payment: "",
      arrears_6_months_plus: "",
      arrears_gou: "",
      verified_arrears_gou: "",
      unverified_arrears_gou: "",
      arrears_6_months_plus_gou: "",
      
      // Other financial fields
      financing_agreement_title: "",
      annual_appropriations: ""
    };
    
    // Combine preserved main data with reset financial data
    setFormData({ ...mainContractData, ...resetFinancialData });
    setCurrentContractIndex(index);
    setShowContractForm(true);
    setErrors({});
    setHasUnsavedChanges(false);
    
    // Reset contract value external state
    setContractValueExternal("");
    
    // Reset fiscal year data
    setPipelineExternal({});
    setPipelineGoU({});
    
    // Reset procurement and funding state variables
    setContractualItemCode(contract.contractualItemCode || "");
    setContractualDescription(contract.contractualDescription || "");
    setContractualCategory(contract.contractualCategory || "");
    setContractualStage(contract.contractualStage || "");
    setContractualSourceOfFunding(contract.contractualSourceOfFunding || "");
    setContractualProjectClassification(contract.contractualProjectClassification || "");
    // Load quarterly fields
    setContractualQ1(contract.contractualQ1 || "");
    setContractualQ2(contract.contractualQ2 || "");
    setContractualQ3(contract.contractualQ3 || "");
    setContractualQ4(contract.contractualQ4 || "");
    setAnnualPenaltyRate(contract.annualPenaltyRate || "");
    
    // Set evidence files from contract data
    setContractEvidenceFile(contract.contractEvidenceFile || null);
    setCounterpartEvidenceFile(contract.counterpartEvidenceFile || null);
  };

  const handleShowContract = (index) => {
    const contract = contracts[index];
    console.log('Showing contract:', contract);
    console.log('Balance values:', {
      balance_on_contract_value: contract.balance_on_contract_value,
      balance_on_contract_value_gou: contract.balance_on_contract_value_gou
    });
    console.log('Funding source:', contract.contractualSourceOfFunding);
    console.log('Pipeline data:', {
      pipelineExternal: contract.pipelineExternal,
      pipelineGoU: contract.pipelineGoU,
      fyHeaders: contract.fyHeaders
    });
    setShowContractDialog({ open: true, contract });
  };

  // Counterpart management functions
  const handleAddCounterpart = () => {
    // Reset form data for new counterpart
    setCounterpartStartDate("");
    setCounterpartEndDate("");
    setCounterpartFinancingTitle("");
    setCounterpartRequirementSpec("");
    setCounterpartValue("");
    setCounterpartDisbursed("");
    setCounterpartBalance("");
    setCounterpartPipelineExternal({});
    setCounterpartPipelineGoU({});
    setCounterpartFyHeaders([]);
    setCounterpartDateErrors({});
    setCounterpartValidationErrors({}); // Clear validation errors
    setCurrentCounterpartIndex(null);
    setShowCounterpartForm(true);
    setHasUnsavedCounterpartChanges(false);
  };

  const handleEditCounterpart = (index) => {
    const counterpart = counterparts[index];
    setCounterpartStartDate(counterpart.counterpartStartDate || "");
    setCounterpartEndDate(counterpart.counterpartEndDate || "");
    setCounterpartFinancingTitle(counterpart.counterpartFinancingTitle || "");
    setCounterpartRequirementSpec(counterpart.counterpartRequirementSpec || "");
    setCounterpartValue(counterpart.counterpartValue || "");
    setCounterpartDisbursed(counterpart.counterpartDisbursed || "");
    setCounterpartBalance(counterpart.counterpartBalance || "");
    setCounterpartPipelineExternal(counterpart.counterpartPipelineExternal || {});
    setCounterpartPipelineGoU(counterpart.counterpartPipelineGoU || {});
    setCounterpartFyHeaders(counterpart.counterpartFyHeaders || []);
    setCounterpartEvidenceFile(counterpart.counterpartEvidenceFile || null);
    setCounterpartItemCode(counterpart.counterpartItemCode || "");
    setCounterpartDescription(counterpart.counterpartDescription || "");
    setCounterpartQuantity(counterpart.counterpartQuantity || "");
    setCounterpartQuantityUnit(counterpart.counterpartQuantityUnit || "");
    setCounterpartFundingSource(counterpart.counterpartFundingSource || "");
    setCounterpartDateErrors({});
    setCounterpartValidationErrors({}); // Clear validation errors
    setCurrentCounterpartIndex(index);
    setShowCounterpartForm(true);
    setHasUnsavedCounterpartChanges(false);
  };

  const handleShowCounterpart = (index) => {
    const counterpart = counterparts[index];
    console.log('Showing counterpart:', counterpart);
    setShowCounterpartDialog({ open: true, counterpart });
  };

  const handleCloseShowContractDialog = () => {
    setShowContractDialog({ open: false, contract: null });
  };

  const handleCloseShowCounterpartDialog = () => {
    setShowCounterpartDialog({ open: false, counterpart: null });
  };

  const handleShowNonContractual = (index) => {
    const entry = nonContractualEntries[index];
    console.log('Showing non-contractual entry:', entry);
    setShowNonContractualDialog({ open: true, entry });
  };

  const handleEditNonContractual = (index) => {
    const entry = nonContractualEntries[index];
    setNonContractualItemCode(entry.itemCode || '');
    setNonContractualDescription(entry.description || '');
    setNonContractualStartDate(entry.startDate || '');
    setNonContractualEndDate(entry.endDate || '');
    
    // Calculate totals from pipeline data
    const pipelineGoU = entry.pipelineGoU || {};
    const pipelineExternal = entry.pipelineExternal || {};
    const gouTotal = Object.values(pipelineGoU).reduce((sum, val) => sum + Number(val || 0), 0);
    const externalTotal = Object.values(pipelineExternal).reduce((sum, val) => sum + Number(val || 0), 0);
    
    setNonContractualGoUAmount(gouTotal.toString());
    setNonContractualExternalAmount(externalTotal.toString());
    setNonContractualFundingSource(entry.fundingSource || "");
    setNonContractualCounterpartValue(entry.counterpartValue || "");
    setNonContractualCounterpartReleased(entry.counterpartReleased || "");
    setNonContractualCounterpartBalance(entry.counterpartBalance || "");
    setNonContractualPipelineExternal(pipelineExternal);
    setNonContractualPipelineGoU(pipelineGoU);
    setNonContractualFyHeaders(entry.fyHeaders || []);
    setCurrentNonContractualIndex(index);
    setShowNonContractualForm(true);
    setHasUnsavedNonContractualChanges(false);
  };

  const handleCloseShowNonContractualDialog = () => {
    setShowNonContractualDialog({ open: false, entry: null });
  };

  // Helper function to check if a field has meaningful data (not empty, null, undefined, or N/A)
  const hasMeaningfulData = (value) => {
    if (value === null || value === undefined || value === '') return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    if (value === 'N/A') return false;
    if (typeof value === 'number' && value === 0) return false;
    return true;
  };

  // Helper function to display numeric values properly (handles 0 values)
  const displayNumericValue = (value) => {
    console.log('🔍 displayNumericValue called with:', { value, type: typeof value });
    
    if (value === null || value === undefined) {
      return 'N/A';
    }
    
    if (value === '') {
      return 'N/A';
    }
    
    if (value === 'NaN' || (typeof value === 'string' && value.toLowerCase() === 'nan')) {
      return 'N/A';
    }
    
    // Remove commas from string values before converting to number
    let cleanValue = value;
    if (typeof value === 'string') {
      cleanValue = value.replace(/,/g, '');
    }
    
    const numValue = Number(cleanValue);
    if (isNaN(numValue)) {
      console.log('🔍 Value is NaN after conversion:', { original: value, cleaned: cleanValue });
      return 'N/A';
    }
    
    const result = numValue.toLocaleString();
    console.log('🔍 displayNumericValue result:', result);
    return result;
  };

  const displayFiscalYearValue = (value) => {
    return value !== undefined && value !== null && value !== '' ? Number(value).toLocaleString() : '0';
  };

  // Function to determine which tab contains missing fields
  const getTabForMissingFields = (missingFields) => {
    // Define field-to-tab mapping
    const fieldToTabMap = {
      // Contractual tab fields
      'contract_reference_number': 'contractual',
      'contractualProjectClassification': 'contractual',
      'contractEvidenceFile': 'contractual',
      'contractualSelectedFiscalYear': 'contractual',
      'quarterlyEntries': 'contractual',
      'contract_name': 'contractual',
      'contractor_name': 'contractual',
      'contract_start_date': 'contractual',
      'contract_end_date': 'contractual',
      'contract_value': 'contractual',
      'contract_value_gou': 'contractual',
      'contract_value_external': 'contractual',
      'contract_value_main': 'contractual',
      'costing': 'contractual',
      'annual_penalty_rate': 'contractual',
      'contract_status': 'contractual',
      'contract_terms': 'contractual',
      'counterpart_requirement_specification': 'contractual',
      'counterpart_value': 'contractual',
      'currency': 'contractual',
      'financing_agreement_title': 'contractual',
      'annual_appropriations': 'contractual',
      
      // Contractual Obligation tab fields
      'approved_payments': 'obligation',
      'approved_payments_gou': 'obligation',
      
      // Arrears tab fields
      'arrears': 'arrears',
      'verified_arrears': 'arrears',
      'unverified_arrears': 'arrears',
      'arrears_6_months_plus': 'arrears',
      'arrears_gou': 'arrears',
      'verified_arrears_gou': 'arrears',
      'unverified_arrears_gou': 'arrears',
      'arrears_6_months_plus_gou': 'arrears',
      'balance_on_contract_value': 'arrears',
      'balance_on_contract_value_gou': 'arrears'
    };
    
    // Check for fiscal year fields (these are in obligation tab)
    const hasFiscalYearErrors = missingFields.some(field => 
      field.startsWith('external_') || field.startsWith('gou_') || 
      field === 'external_total' || field === 'gou_total'
    );
    
    if (hasFiscalYearErrors) {
      return 'obligation';
    }
    
    // Find the first missing field and return its tab
    for (const field of missingFields) {
      if (fieldToTabMap[field]) {
        return fieldToTabMap[field];
      }
    }
    
    // Default to contractual tab if no mapping found
    return 'contractual';
  };

  const handleSaveContract = () => {
    // Add a small delay to ensure state updates are complete
    setTimeout(() => {
      validateAndSaveContract();
    }, 100);
  };

  const validateAndSaveContract = () => {
    // Validate ALL tabs: Contractual, Contractual Obligation, and Arrears
    const newErrors = {};
    
    // Validate Project Period selection first
    if (!isProjectPeriodSelected()) {
      newErrors.projectPeriod = 'Please select a valid Project Duration';
    }
    
    // Debug: Log form data to see what values we have
    console.log('Form Data:', formData);
    console.log('Contractual Source of Funding:', contractualSourceOfFunding);
    console.log('Annual Penalty Rate:', annualPenaltyRate);
    console.log('Procurement Fields:', {
      contractualItemCode,
      contractualDescription,
      contractualCategory,
      contractualStage
    });
    
    // Debug specific fields that are causing issues
    console.log('Debugging problematic fields:', {
      approved_payments: formData.approved_payments,
      balance_on_contract_value: formData.balance_on_contract_value,
      arrears: formData.arrears,
      verified_arrears: formData.verified_arrears,
      unverified_arrears: formData.unverified_arrears
    });
    
    // Validate Contractual tab fields
    const contractualRequiredFields = [
      'contract_reference_number',
      'contract_name',
      'description_of_procurement',
      'contractor_name',
      // 'contract_start_date',
      // 'contract_end_date',
      'contract_status',
      'contract_value_main',
      // 'costing', // Removed as it's automated
      'annual_penalty_rate'
    ];

    // Check each required field in Contractual tab
    contractualRequiredFields.forEach(field => {
      if (!formData[field] || formData[field].toString().trim() === "") {
        const fieldLabel = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        newErrors[field] = `${fieldLabel} is required`;
      }
    });

    // Validate Contractual Obligation tab fields based on funding source
    // Only require financial fields if no quarterly entries exist
    const hasQuarterlyEntries = quarterlyEntries && quarterlyEntries.length > 0;
    
    if (!hasQuarterlyEntries) {
      if (contractualSourceOfFunding === "External" || contractualSourceOfFunding === "Both") {
        // Check External approved payments
        const externalValue = formData.approved_payments;
        console.log(`Checking approved_payments (External):`, { value: externalValue, type: typeof externalValue, isEmpty: externalValue === "" || externalValue === null || externalValue === undefined || (typeof externalValue === 'string' && externalValue.trim() === "") });
        if (externalValue === "" || externalValue === null || externalValue === undefined || (typeof externalValue === 'string' && externalValue.trim() === "")) {
          newErrors['approved_payments'] = 'Approved Payments (External) is required';
        }
      }

      if (contractualSourceOfFunding === "GoU" || contractualSourceOfFunding === "Both") {
        // Check GoU approved payments
        const gouValue = formData.approved_payments_gou;
        console.log(`Checking approved_payments_gou (GoU):`, { value: gouValue, type: typeof gouValue, isEmpty: gouValue === "" || gouValue === null || gouValue === undefined || (typeof gouValue === 'string' && gouValue.trim() === "") });
        if (gouValue === "" || gouValue === null || gouValue === undefined || (typeof gouValue === 'string' && gouValue.trim() === "")) {
          newErrors['approved_payments_gou'] = 'Approved Payments (GoU) is required';
        }
      }
    }

    // Validate Arrears tab fields based on funding source
    // NOTE: Arrears fields have been moved to Contractual tab, so this validation is now handled above

    // Validate Source of Funding selection - removed from required fields
    // if (!hasQuarterlyEntries && (!contractualSourceOfFunding || contractualSourceOfFunding === "")) {
    //   newErrors['contractualSourceOfFunding'] = 'Source of Funding is required';
    // }

    // Validate Contract Value External if External or Both is selected
    // Only require if no quarterly entries exist
    if (!hasQuarterlyEntries && (contractualSourceOfFunding === "External" || contractualSourceOfFunding === "Both")) {
      if (!formData.contract_value_external || formData.contract_value_external === "") {
        newErrors['contract_value_external'] = 'Contract Value External is required when External funding is selected';
      }
    }

    // Validate Contract Value GoU if GoU or Both is selected
    // Only require if no quarterly entries exist
    if (!hasQuarterlyEntries && (contractualSourceOfFunding === "GoU" || contractualSourceOfFunding === "Both")) {
      if (!formData.contract_value_gou || formData.contract_value_gou === "") {
        newErrors['contract_value_gou'] = 'Contract Value GoU is required when GoU funding is selected';
      }
    }

    // Validate procurement fields (these are required fields in the form)
    // Item Code - removed from required fields as it's automated
    // if (!hasQuarterlyEntries && (!contractualItemCode || contractualItemCode === "")) {
    //   newErrors['contractualItemCode'] = 'Item Code is required';
    // }

    // Description of Activity - removed from required fields
    // if (!hasQuarterlyEntries && (!contractualDescription || contractualDescription === "")) {
    //   newErrors['contractualDescription'] = 'Description of Activity is required';
    // }

    if (!contractualCategory || contractualCategory === "") {
      newErrors['contractualCategory'] = 'Category of Procurement is required';
    }

    if (!contractualStage || contractualStage === "") {
      newErrors['contractualStage'] = 'Type of Procurement is required';
    }

    // Validate Contract Evidence upload
    if (!contractEvidenceFile) {
      newErrors['contractEvidenceFile'] = 'Contract Evidence upload is required';
    }

    // Validate Project Classification
    if (!contractualProjectClassification || contractualProjectClassification === "") {
      newErrors['contractualProjectClassification'] = 'Project Classification is required';
    }

    // Validate Arrears fields (moved from Arrears tab to Contractual tab)
    // Only require if no quarterly entries exist
    if (!hasQuarterlyEntries) {
      if (!formData.arrears || formData.arrears === "" || formData.arrears === "0") {
        newErrors['arrears'] = 'Cumulative Arrears starting is required';
      }

      if (!formData.verified_arrears || formData.verified_arrears === "" || formData.verified_arrears === "0") {
        newErrors['verified_arrears'] = 'Verified Arrears is required';
      }

      if (!formData.unverified_arrears || formData.unverified_arrears === "" || formData.unverified_arrears === "0") {
        newErrors['unverified_arrears'] = 'Un-verified Arrears is required';
      }
    }

    // Validate Financial Year selection - removed from required fields
    // if (!hasQuarterlyEntries && (!contractualSelectedFiscalYear || contractualSelectedFiscalYear === "")) {
    //   newErrors['contractualSelectedFiscalYear'] = 'Financial Year selection is required';
    // }

    // Validate Quarterly Entries - at least one entry is required OR financial fields must be filled
    if (!hasQuarterlyEntries) {
      // If no quarterly entries, then financial fields are required (already validated above)
      // This means the form can be saved if either quarterly entries exist OR financial fields are filled
    } else {
      // If quarterly entries exist, financial fields are optional (already handled above)
      // No additional validation needed here
    }

    console.log('Validation errors:', newErrors);
    console.log('Detailed field validation:', {
      contract_reference_number: {
        value: formData.contract_reference_number,
        isEmpty: !formData.contract_reference_number || formData.contract_reference_number.trim() === "",
        error: newErrors['contract_reference_number']
      },
      contract_name: {
        value: formData.contract_name,
        isEmpty: !formData.contract_name || formData.contract_name.trim() === "",
        error: newErrors['contract_name']
      },
      contractor_name: {
        value: formData.contractor_name,
        isEmpty: !formData.contractor_name || formData.contractor_name.trim() === "",
        error: newErrors['contractor_name']
      },
      contract_start_date: {
        value: formData.contract_start_date,
        isEmpty: !formData.contract_start_date || formData.contract_start_date === "",
        error: newErrors['contract_start_date']
      },
      contract_end_date: {
        value: formData.contract_end_date,
        isEmpty: !formData.contract_end_date || formData.contract_end_date === "",
        error: newErrors['contract_end_date']
      },
      contract_value: {
        value: formData.contract_value,
        isEmpty: !formData.contract_value || formData.contract_value === "",
        error: newErrors['contract_value']
      },
      annual_penalty_rate: {
        value: formData.annual_penalty_rate,
        isEmpty: !formData.annual_penalty_rate || formData.annual_penalty_rate === "",
        error: newErrors['annual_penalty_rate']
      },
      contract_status: {
        value: formData.contract_status,
        isEmpty: !formData.contract_status || formData.contract_status === "",
        error: newErrors['contract_status']
      },
      contractualSourceOfFunding: {
        value: contractualSourceOfFunding,
        isEmpty: !contractualSourceOfFunding || contractualSourceOfFunding === "",
        error: newErrors['contractualSourceOfFunding']
      }
    });

    // Validate fiscal year table fields if they exist
    console.log('Fiscal year validation check:', {
      fyHeadersLength: fyHeaders.length,
      fyHeaders: fyHeaders,
      pipelineExternal: pipelineExternal,
      pipelineGoU: pipelineGoU
    });
    
    if (fyHeaders.length > 0) {
      // Only validate fiscal year fields based on the selected source of funding
      if (contractualSourceOfFunding === "External" || contractualSourceOfFunding === "Both") {
        // Check External fiscal year fields only if External or Both is selected
      fyHeaders.forEach(fy => {
        const externalValue = pipelineExternal[fy];
          console.log(`Checking External ${fy}:`, { value: externalValue, isEmpty: !externalValue || externalValue === "" || (typeof externalValue === 'string' && externalValue.trim() === "") });
        if (!externalValue || externalValue === "" || (typeof externalValue === 'string' && externalValue.trim() === "")) {
          newErrors[`external_${fy}`] = `External ${fy} amount is required`;
        }
      });
      }

      if (contractualSourceOfFunding === "GoU" || contractualSourceOfFunding === "Both") {
        // Check GoU fiscal year fields only if GoU or Both is selected
      fyHeaders.forEach(fy => {
        const gouValue = pipelineGoU[fy];
          console.log(`Checking GoU ${fy}:`, { value: gouValue, isEmpty: !gouValue || gouValue === "" || (typeof gouValue === 'string' && gouValue.trim() === "") });
        if (!gouValue || gouValue === "" || (typeof gouValue === 'string' && gouValue.trim() === "")) {
          newErrors[`gou_${fy}`] = `GoU ${fy} amount is required`;
        }
      });
      }

      // Validate cumulative totals against Balance on Contract Value
      const fiscalYearErrors = validateFiscalYearTotals();
      console.log('Fiscal year total validation errors:', fiscalYearErrors);
      Object.assign(newErrors, fiscalYearErrors);
    }

    console.log('Final validation errors count:', Object.keys(newErrors).length);
    console.log('Final validation errors:', newErrors);
    console.log('Detailed validation errors:', Object.keys(newErrors).map(key => `${key}: ${newErrors[key]}`));

    // Check for quarterly entries - show dialog if key fields are filled but no quarterly entries exist
    const hasKeyFieldsFilled = (contractualSourceOfFunding && contractualSourceOfFunding !== "") ||
                               (contractualDescription && contractualDescription !== "") ||
                               (contractualSelectedFiscalYear && contractualSelectedFiscalYear !== "");
    
    if (hasKeyFieldsFilled && (!quarterlyEntries || quarterlyEntries.length === 0)) {
      console.log('✅ Key fields filled but no quarterly entries, showing dialog');
      console.log('Key fields status:', {
        contractualSourceOfFunding,
        contractualDescription,
        contractualSelectedFiscalYear,
        quarterlyEntries: quarterlyEntries ? quarterlyEntries.length : 'undefined'
      });
      setQuarterlyEntryDialog({ open: true });
      return; // Stop validation and show dialog
    }

    // Check for quarterly entries only if all other validations pass
    if (Object.keys(newErrors).length === 0) {
      console.log('✅ All validations passed, checking quarterly entries...');
      console.log('Quarterly entries:', quarterlyEntries);
      console.log('Quarterly entries length:', quarterlyEntries ? quarterlyEntries.length : 'undefined');
      
      // All other validations passed, now check for quarterly entries
      if (!quarterlyEntries || quarterlyEntries.length === 0) {
        console.log('❌ No quarterly entries found, showing dialog');
        setQuarterlyEntryDialog({ open: true });
        return; // Stop validation and show dialog
      } else {
        console.log('✅ Quarterly entries exist, proceeding with save');
      }
    } else {
      console.log('❌ Validation errors exist, not checking quarterly entries');
      console.log('Errors preventing quarterly dialog:', Object.keys(newErrors));
    }

    if (Object.keys(newErrors).length > 0) {
      console.log('Setting errors:', newErrors);
      setErrors(newErrors);
      
      // Set validation mode flag to prevent error clearing during tab switch
      console.log('Setting validation mode flag to true');
      isValidationModeRef.current = true;
      
      // Determine which tab contains the missing fields and switch to it
      const missingFields = Object.keys(newErrors);
      const targetTab = getTabForMissingFields(missingFields);
      
      // Switch to the appropriate tab
      if (targetTab === 'obligation' || targetTab === 'arrears') {
        setNestedTab(targetTab);
      } else {
        onTabChange(targetTab);
      }
      
      // Reset validation mode flag after tab switch
      setTimeout(() => {
        console.log('Resetting validation mode flag to false');
        isValidationModeRef.current = false;
      }, 100);
      
      // Show a simple error message without listing all fields
      setSnackbar({ 
        open: true, 
        message: "Please fill in all required fields. Fields with errors are highlighted in red.",
        severity: "error" 
      });
      return;
    }

    // Calculate balance values
    const externalBalance = calculateExternalBalance();
    const gouBalance = calculateGoUBalance();
    
    // Debug logging
    console.log('Calculated balances:', {
      externalBalance,
      gouBalance,
      contractValueExternal: formData.contract_value_external,
      contractValueGou: formData.contract_value_gou,
      pipelineExternal,
      pipelineGoU
    });
    
    // Update formData with calculated balance values and all form data
    const updatedFormData = {
      ...formData,
      balance_on_contract_value: externalBalance,
      balance_on_contract_value_gou: gouBalance,
      // Ensure all contractual obligation and arrears data is included
      approved_payments: formData.approved_payments,
      approved_payments_gou: formData.approved_payments_gou,
      contract_value_gou: formData.contract_value_gou,
      contract_value_external: formData.contract_value_external,
      contract_value_main: formData.contract_value_main,
      costing: formData.costing,
      // Include all arrears data
      arrears: formData.arrears,
      verified_arrears: formData.verified_arrears,
      unverified_arrears: formData.unverified_arrears,
      arrears_payment: formData.arrears_payment,
      arrears_6_months_plus: formData.arrears_6_months_plus,
      arrears_gou: formData.arrears_gou,
      verified_arrears_gou: formData.verified_arrears_gou,
      unverified_arrears_gou: formData.unverified_arrears_gou,
      arrears_6_months_plus_gou: formData.arrears_6_months_plus_gou
    };

    console.log('Saving contract with data:', {
      basicContractData: {
        contract_reference_number: updatedFormData.contract_reference_number,
        contract_name: updatedFormData.contract_name,
        contractor_name: updatedFormData.contractor_name,
        contract_start_date: updatedFormData.contract_start_date,
        contract_end_date: updatedFormData.contract_end_date,
        contract_value: updatedFormData.contract_value,
        contract_value_main: updatedFormData.contract_value_main,
        costing: updatedFormData.costing,
        contract_status: updatedFormData.contract_status,
        annual_penalty_rate: updatedFormData.annual_penalty_rate
      },
      procurementData: {
        contractualItemCode: contractualItemCode,
        contractualDescription: contractualDescription,
        contractualCategory: contractualCategory,
        contractualStage: contractualStage,
        // Quarterly breakdown
        contractualQ1: contractualQ1,
        contractualQ2: contractualQ2,
        contractualQ3: contractualQ3,
        contractualQ4: contractualQ4,
        // Multiple quarterly entries
        quarterlyEntries: quarterlyEntries
      },
      contractualObligationData: {
        approved_payments: updatedFormData.approved_payments,
        approved_payments_gou: updatedFormData.approved_payments_gou,
        contract_value_gou: updatedFormData.contract_value_gou,
        contract_value_external: updatedFormData.contract_value_external,
        balance_on_contract_value: updatedFormData.balance_on_contract_value,
        balance_on_contract_value_gou: updatedFormData.balance_on_contract_value_gou
      },
      arrearsData: {
        arrears: updatedFormData.arrears,
        verified_arrears: updatedFormData.verified_arrears,
        unverified_arrears: updatedFormData.unverified_arrears,
        arrears_payment: updatedFormData.arrears_payment,
        arrears_6_months_plus: updatedFormData.arrears_6_months_plus,
        arrears_gou: updatedFormData.arrears_gou,
        verified_arrears_gou: updatedFormData.verified_arrears_gou,
        unverified_arrears_gou: updatedFormData.unverified_arrears_gou,
        arrears_6_months_plus_gou: updatedFormData.arrears_6_months_plus_gou
      },
      fiscalYearData: {
        fyHeaders: fyHeaders,
        pipelineExternal: pipelineExternal,
        pipelineGoU: pipelineGoU
      }
    });

    if (currentContractIndex !== null) {
      // Update existing contract
      const updatedContracts = [...contracts];
      // Calculate balance values for the contract
      const balanceExternal = calculateExternalCostingBalance();
      const balanceGoU = calculateGoUCostingBalance();
      const balanceTotal = calculateCostingBalance();
      
      updatedContracts[currentContractIndex] = { 
        ...updatedFormData, 
        fyHeaders: [...fyHeaders],
        pipelineExternal: { ...pipelineExternal },
        pipelineGoU: { ...pipelineGoU },
        // Include procurement fields
        contractualItemCode: contractualItemCode,
        contractualDescription: contractualDescription,
        contractualCategory: contractualCategory,
        contractualStage: contractualStage,
        // Include quarterly breakdown
        contractualQ1: contractualQ1,
        contractualQ2: contractualQ2,
        contractualQ3: contractualQ3,
        contractualQ4: contractualQ4,
        // Include multiple quarterly entries
        quarterlyEntries: quarterlyEntries,
        // Include source of funding and annual penalty rate
        contractualSourceOfFunding: contractualSourceOfFunding,
        contractualProjectClassification: contractualProjectClassification,
        annualPenaltyRate: annualPenaltyRate,
        // Include calculated balance values
        balance_on_contract_value: balanceExternal,
        balance_on_contract_value_gou: balanceGoU,
        balance_on_contract_value_total: balanceTotal,
        // Include evidence files
        contractEvidenceFile: contractEvidenceFile,
        counterpartEvidenceFile: counterpartEvidenceFile
      };
      setContracts(updatedContracts);
    } else {
      // Calculate balance values for the contract
      const balanceExternal = calculateExternalCostingBalance();
      const balanceGoU = calculateGoUCostingBalance();
      const balanceTotal = calculateCostingBalance();
      
      // Add new contract
      setContracts([...contracts, { 
        ...updatedFormData, 
        fyHeaders: [...fyHeaders],
        pipelineExternal: { ...pipelineExternal },
        pipelineGoU: { ...pipelineGoU },
        // Include procurement fields
        contractualItemCode: contractualItemCode,
        contractualDescription: contractualDescription,
        contractualCategory: contractualCategory,
        contractualStage: contractualStage,
        // Include quarterly breakdown
        contractualQ1: contractualQ1,
        contractualQ2: contractualQ2,
        contractualQ3: contractualQ3,
        contractualQ4: contractualQ4,
        // Include multiple quarterly entries
        quarterlyEntries: quarterlyEntries,
        // Include source of funding and annual penalty rate
        contractualSourceOfFunding: contractualSourceOfFunding,
        contractualProjectClassification: contractualProjectClassification,
        annualPenaltyRate: annualPenaltyRate,
        // Include calculated balance values
        balance_on_contract_value: balanceExternal,
        balance_on_contract_value_gou: balanceGoU,
        balance_on_contract_value_total: balanceTotal,
        // Include evidence files
        contractEvidenceFile: contractEvidenceFile,
        counterpartEvidenceFile: counterpartEvidenceFile
      }]);
    }
    
    setShowContractForm(false);
    setCurrentContractIndex(null);
    setErrors({});
    setHasUnsavedChanges(false);
    
    setSnackbar({ 
      open: true, 
      message: `Contract saved successfully! All data including contractual obligation and arrears information has been saved.`, 
      severity: "success" 
    });
    
    // Navigate to Contract Management table after saving
    setTimeout(() => {
      const contractManagementElement = document.querySelector('[data-testid="contract-management-table"]');
      if (contractManagementElement) {
        contractManagementElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 500);
  };

  const handleCancelContract = () => {
    setShowContractForm(false);
    setCurrentContractIndex(null);
    setErrors({});
    setHasUnsavedChanges(false);
  };

  // const handleDeleteContract = (index) => {
  //   const updatedContracts = contracts.filter((_, i) => i !== index);
  //   setContracts(updatedContracts);
  // };

  // Filter contracts based on search term
  const filteredContracts = contracts.filter(contract => {
    if (!contractSearchTerm) return true;
    
    const searchLower = contractSearchTerm.toLowerCase();
    return (
      (contract.contract_reference_number && contract.contract_reference_number.toLowerCase().includes(searchLower)) ||
      (contract.contract_name && contract.contract_name.toLowerCase().includes(searchLower)) ||
      (contract.contractor_name && contract.contractor_name.toLowerCase().includes(searchLower)) ||
      (contract.contract_start_date && contract.contract_start_date.toLowerCase().includes(searchLower)) ||
      (contract.contract_end_date && contract.contract_end_date.toLowerCase().includes(searchLower)) ||
      (contract.contract_status && contract.contract_status.toLowerCase().includes(searchLower))
    );
  });

  // Filter counterparts based on search term
  const filteredCounterparts = counterparts.filter(counterpart => {
    if (!counterpartSearchTerm) return true;
    
    const searchLower = counterpartSearchTerm.toLowerCase();
    return (
      (counterpart.counterpartStartDate && counterpart.counterpartStartDate.toLowerCase().includes(searchLower)) ||
      (counterpart.counterpartEndDate && counterpart.counterpartEndDate.toLowerCase().includes(searchLower)) ||
      (counterpart.counterpartFinancingTitle && counterpart.counterpartFinancingTitle.toLowerCase().includes(searchLower)) ||
      (counterpart.counterpartRequirementSpec && counterpart.counterpartRequirementSpec.toLowerCase().includes(searchLower)) ||
      (counterpart.counterpartValue && counterpart.counterpartValue.toLowerCase().includes(searchLower)) ||
      (counterpart.counterpartDisbursed && counterpart.counterpartDisbursed.toLowerCase().includes(searchLower))
    );
  });

  // Filter non-contractual entries based on search term
  const filteredNonContractualData = nonContractualEntries.filter(entry => {
    if (!nonContractualSearchTerm) return true;
    
    const searchLower = nonContractualSearchTerm.toLowerCase();
    // Get PBS data for search
    const pbsData = nonContractualData.find(pbs => pbs.Project_Code === projectData.code) || {};
    
    return (
      (pbsData.Vote_Code && pbsData.Vote_Code.toLowerCase().includes(searchLower)) ||
      (entry.itemCode && entry.itemCode.toLowerCase().includes(searchLower)) ||
      (entry.description && entry.description.toLowerCase().includes(searchLower)) ||
      (entry.startDate && entry.startDate.toLowerCase().includes(searchLower)) ||
      (entry.endDate && entry.endDate.toLowerCase().includes(searchLower))
    );
  });

  // Data fetching functions for Non-contractual tab
  const fetchNonContractualData = useCallback(async (forceRefresh = false) => {
    const cacheKey = `nonContractualData_${projectData.code}`;
    
    // Check if we have cached data and not forcing refresh
    if (!forceRefresh) {
      const cachedData = localStorage.getItem(cacheKey);
      const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
      
      // If we have cached data and it's less than 30 minutes old, use it
      if (cachedData && cacheTimestamp) {
        const now = Date.now();
        const cacheAge = now - parseInt(cacheTimestamp);
        const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds
        
        if (cacheAge < thirtyMinutes) {
          try {
            const parsedData = JSON.parse(cachedData);
            setNonContractualData(parsedData);
            setNonContractualDataFetched(true);
            setNonContractualLoading(false);
            return;
          } catch (error) {
            console.warn('Failed to parse cached data:', error);
            // Continue to fetch fresh data
          }
        }
      }
      
      // If already fetched and not forcing refresh, return
      if (nonContractualDataFetched || nonContractualLoading) {
        return;
      }
    }

    setNonContractualLoading(true);
    setNonContractualError(null);

    try {
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

      const accessToken = loginResponse.data.data.login.access_token;

      // Then fetch the data
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

      const fetchedData = dataResponse.data.data.cgIbpProjectBudgetAllocations;
      
      // Remove duplicates based on Project_Code
      const uniqueData = removeDuplicates(fetchedData || []);
      
      // Cache the data to localStorage
      try {
        localStorage.setItem(cacheKey, JSON.stringify(uniqueData));
        localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
        console.log(`✅ Cached ${uniqueData.length} PBS records for project ${projectData.code}`);
      } catch (cacheError) {
        console.warn('Failed to cache PBS data:', cacheError);
      }
      
      setNonContractualData(uniqueData);
      setNonContractualDataFetched(true);
    } catch (error) {
      console.error("Error fetching non-contractual data:", error);
      setNonContractualError(error.message || "Failed to fetch data");
    } finally {
      setNonContractualLoading(false);
    }
  }, [nonContractualDataFetched, nonContractualLoading, projectData.code]);

  // Data fetching functions for Contractual tab
  const fetchContractualData = useCallback(async (forceRefresh = false) => {
    const cacheKey = `contractualData_${projectData.code}`;
    
    // Check if we have cached data and not forcing refresh
    if (!forceRefresh) {
      const cachedData = localStorage.getItem(cacheKey);
      const cachedTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
      
      if (cachedData && cachedTimestamp) {
        const age = Date.now() - parseInt(cachedTimestamp);
        const maxAge = 5 * 60 * 1000; // 5 minutes
        
        if (age < maxAge) {
          try {
            const parsedData = JSON.parse(cachedData);
            setContractualData(parsedData);
            setContractualDataFetched(true);
            console.log(`✅ Using cached contractual PBS data for project ${projectData.code}`);
            return;
          } catch (parseError) {
            console.warn('Failed to parse cached contractual data:', parseError);
          }
        } else {
          console.log('🔄 Cached contractual data expired, fetching fresh data');
        }
      }
    }

    setContractualLoading(true);
    setContractualError(null);

    try {
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

      const accessToken = loginResponse.data.data.login.access_token;

      // Then fetch the data
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

      const fetchedData = dataResponse.data.data.cgIbpProjectBudgetAllocations;
      
      // Remove duplicates based on Project_Code
      const uniqueData = removeDuplicates(fetchedData || []);
      
      // Cache the data to localStorage
      try {
        localStorage.setItem(cacheKey, JSON.stringify(uniqueData));
        localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
        console.log(`✅ Cached ${uniqueData.length} contractual PBS records for project ${projectData.code}`);
      } catch (cacheError) {
        console.warn('Failed to cache contractual PBS data:', cacheError);
      }
      
      setContractualData(uniqueData);
      setContractualDataFetched(true);
      console.log('✅ Contractual PBS data fetched and cached:', {
        totalRecords: uniqueData.length,
        projectCode: projectData.code,
        sampleRecord: uniqueData[0] ? {
          Project_Code: uniqueData[0].Project_Code,
          GoU: uniqueData[0].GoU,
          ExtFin: uniqueData[0].ExtFin
        } : null
      });
    } catch (error) {
      console.error("Error fetching contractual data:", error);
      setContractualError(error.message || "Failed to fetch data");
    } finally {
      setContractualLoading(false);
    }
  }, [contractualDataFetched, contractualLoading, projectData.code]);

  // Remove duplicates based on Project_Code
  const removeDuplicates = (arr) => {
    const seen = new Set();
    return arr.filter((item) => {
      const identifier = item.Project_Code;
      if (seen.has(identifier)) {
        return false;
      }
      seen.add(identifier);
      return true;
    });
  };

  // Tab switching functions that close validation dialogs
  const handleTabChange = useCallback((tab) => {
    // Disabled: Check for unsaved changes when switching away from contractual tab
    // if (activeTab === "contractual" && hasUnsavedChanges && showContractForm) {
    //   setUnsavedChangesDialog({ open: true, targetTab: tab });
    //   return;
    // }
    
    // Fetch data for non-contractual tab if not already fetched
    if (tab === "non_contractual" && !nonContractualDataFetched) {
      fetchNonContractualData(); // This will set loading to true internally
    }
    
    // Fetch data for contractual tab if not already fetched
    if (tab === "contractual" && !contractualDataFetched) {
      fetchContractualData(); // This will set loading to true internally
    }
    
    isTabSwitchingRef.current = true;
    onTabChange(tab);
    setValidationDialog({ open: false, issues: [], field: "" });
    // Don't clear errors during validation
    console.log('handleTabChange called:', { tab, isValidationMode: isValidationModeRef.current });
    if (!isValidationModeRef.current) {
      console.log('Clearing errors in handleTabChange');
      setErrors({});
    } else {
      console.log('Skipping error clearing in handleTabChange due to validation mode');
    }
    setTypedFlags({
      contract_reference_number: false,
      contract_value: false,
      contract_value_external: false,
      annual_penalty_rate: false,
    });
    // Reset the flag after a longer delay to ensure all async operations complete
    setTimeout(() => {
      isTabSwitchingRef.current = false;
    }, 500);
  }, [activeTab, hasUnsavedChanges, showContractForm, nonContractualDataFetched, fetchNonContractualData, contractualDataFetched, fetchContractualData, onTabChange]);

  const handleNestedTabChange = (tab) => {
    isTabSwitchingRef.current = true;
    setNestedTab(tab);
    setValidationDialog({ open: false, issues: [], field: "" });
    // Don't clear errors during validation
    console.log('handleNestedTabChange called:', { tab, isValidationMode: isValidationModeRef.current });
    if (!isValidationModeRef.current) {
      console.log('Clearing errors in handleNestedTabChange');
      setErrors({});
    } else {
      console.log('Skipping error clearing in handleNestedTabChange due to validation mode');
    }
    setTypedFlags({
      contract_reference_number: false,
      contract_value: false,
      contract_value_external: false,
      annual_penalty_rate: false,
    });
    // Reset the flag after a longer delay to ensure all async operations complete
    setTimeout(() => {
      isTabSwitchingRef.current = false;
    }, 500);
  };

  const openValidation = (field, msg) => {
    // Don't show validation popups when switching tabs
    if (isTabSwitchingRef.current) return;
    
    // Prevent duplicate popups for the same field while one is open
    setValidationDialog((prev) => {
      if (prev.open && prev.field === field) return prev;
      return { open: true, issues: [msg], field };
    });
  };

  const handleGouBlur = () => {
    if (isTabSwitchingRef.current) return;
    const raw = (formData.contract_value || "").toString();
    const digits = raw.replace(/\D/g, "");
    if (typedFlags.contract_value && !digits) {
      openValidation("contract_value", "Contract Value GOU (UGX) must be a number");
    }
  };

  const handleExternalBlur = () => {
    if (isTabSwitchingRef.current) return;
    const digits = (contractValueExternal || "").replace(/\D/g, "");
    if (typedFlags.contract_value_external && !digits) {
      openValidation("contract_value_external", "Contract Value External (UGX) must be a number");
    }
  };

  const handleRateBlur = () => {
    if (isTabSwitchingRef.current) return;
    const digits = (annualPenaltyRate || "").replace(/\D/g, "");
    if (typedFlags.annual_penalty_rate && !digits) {
      openValidation("annual_penalty_rate", "Annual Penalty Interest Rate (%) must be a number");
    }
  };

  // Helpers for numeric-only inputs and formatting
  const formatWithCommas = (value) => {
    // Handle the special case of 0 - it should display as "0"
    if (value === 0 || value === "0") {
      return "0";
    }
    
    // Convert to string and handle different data types
    const stringValue = String(value || "");
    if (!stringValue) return "";
    
    // Remove any existing commas
    const cleanValue = stringValue.replace(/,/g, '');
    
    // Check if the value has a decimal point
    if (cleanValue.includes('.')) {
      // Split into integer and decimal parts
      const [integerPart, decimalPart] = cleanValue.split('.');
      
      // Add commas only to the integer part
      const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      
      // Return formatted integer + decimal part
      return `${formattedInteger}.${decimalPart}`;
    } else {
      // No decimal point, format the whole number
      return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  };

  // Contract reference number format: Flexible pattern to accommodate various formats
  // Examples: PPDA/CONS/2023-2024/00004, MD/SUPLS/WKS/SVCS/2025-26/00058, MoFPED/SUPLS/SVCS/2025-26/00065, UCAA/NCONS/25-26/00042, POU/NCONS/2025-2026/00176
  const CONTRACT_REF_REGEX = /^[A-Z]{2,6}(\/[A-Z]{2,6}){1,3}\/\d{2,4}-\d{2,4}\/\d{5}$/;
  const handleContractRefChange = (e) => {
    // Allow only letters, digits, slash and hyphen; force uppercase
    const raw = (e.target.value || "").toUpperCase();
    const sanitized = raw.replace(/[^A-Z0-9/-]/g, "");
    setFormData((prev) => ({ ...prev, contract_reference_number: sanitized }));
    setTypedFlags((prev) => ({ ...prev, contract_reference_number: true }));
    if (errors.contract_reference_number) {
      setErrors((prev) => ({ ...prev, contract_reference_number: "" }));
    }
  };
  const handleContractRefBlur = () => {
    if (isTabSwitchingRef.current) return;
    const value = formData.contract_reference_number || "";
    if (typedFlags.contract_reference_number && value && !CONTRACT_REF_REGEX.test(value)) {
      setErrors((prev) => ({ ...prev, contract_reference_number: "invalid" }));
        openValidation("contract_reference_number", "Procurement Reference Number must match one of these formats:\n1. PPDA/CONS/2023-2024/00004\n2. POU/NCONS/2025-2026/00176\n3. UCAA/NCONS/25-26/00042");
    }
  };

  // Handle currency input changes for contract values in obligation tab
  const handleContractValueChange = (field) => (e) => {
    const raw = e.target.value || "";
    setTypedFlags((prev) => ({ ...prev, [field]: true }));
    
    // If any non-digit and non-comma char is typed, alert immediately
    if (/[^0-9,]/.test(raw)) {
      openValidation(field, `${field === 'contract_value_external' ? 'External' : 'GoU'} Contract Value must contain digits only`);
      return;
    }
    
    const digitsOnly = raw.replace(/\D/g, "");
    
    // Validate zero values - only allow single "0", not "00" or "000"
    if (digitsOnly !== "" && !validateZeroValue(digitsOnly)) {
      openValidation(field, 'Zero values must be entered as "0" only, not "00" or "000"');
      return;
    }
    
    // Check if the value exceeds the main contract value
    const mainContractValue = Number(formData.contract_value || 0);
    const newValue = Number(digitsOnly || 0);
    
    if (newValue > mainContractValue) {
      openValidation(field, `${field === 'contract_value_external' ? 'External' : 'GoU'} Contract Value cannot exceed the main Contract Value (${mainContractValue.toLocaleString()} UGX)`);
      return;
    }
    
    // Clear any existing error
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    
    // Update the field value
    setFormData(prev => ({
      ...prev,
      [field]: digitsOnly
    }));
  };

  const handleCurrencyChange = (name) => (e) => {
    const raw = e.target.value || "";
    setTypedFlags((prev) => ({ ...prev, [name]: true }));
    // If any non-digit and non-comma char is typed, alert immediately
    if (/[^0-9,]/.test(raw)) {
      if (name === "contract_value") {
        openValidation("contract_value", "Contract Value GOU (UGX) must contain digits only");
      } else if (name === "contract_value_external") {
        openValidation("contract_value_external", "Contract Value External (UGX) must contain digits only");
      } else if (name === "contract_value_main") {
        openValidation("contract_value_main", "Contract Value (UGX) must contain digits only");
      }
    }
    const digitsOnly = raw.replace(/\D/g, "");
    
    // Validate zero values - only allow single "0", not "00" or "000"
    if (digitsOnly !== "" && !validateZeroValue(digitsOnly)) {
      if (name === "contract_value") {
        openValidation("contract_value", 'Zero values must be entered as "0" only, not "00" or "000"');
      } else if (name === "contract_value_external") {
        openValidation("contract_value_external", 'Zero values must be entered as "0" only, not "00" or "000"');
      } else if (name === "contract_value_main") {
        openValidation("contract_value_main", 'Zero values must be entered as "0" only, not "00" or "000"');
      }
      return;
    }
    
    if (name === "contract_value") {
      // Contract Value GOU field - only updates the contract_value field
      const formattedValue = digitsOnly === "" ? "" : formatNumbers(digitsOnly);
      setFormData((prev) => ({ ...prev, contract_value: formattedValue }));
      if (errors.contract_value) setErrors((prev) => ({ ...prev, contract_value: "" }));
    } else if (name === "contract_value_external") {
      // Contract Value External field - only updates External row
      const formattedValue = digitsOnly === "" ? "" : formatNumbers(digitsOnly);
      setContractValueExternal(formattedValue);
      setFormData((prev) => ({ ...prev, contract_value_external: formattedValue }));
      if (errors.contract_value_external) setErrors((prev) => ({ ...prev, contract_value_external: "" }));
    } else if (name === "contract_value_main") {
      // Contract Value Main field - updates the main contract value field
      const formattedValue = digitsOnly === "" ? "" : formatWithCommas(digitsOnly);
      setFormData((prev) => ({ ...prev, contract_value_main: formattedValue }));
      if (errors.contract_value_main) setErrors((prev) => ({ ...prev, contract_value_main: "" }));
    } else if (name === "costing") {
      // Costing field - updates the costing field
      const formattedValue = digitsOnly === "" ? "" : formatWithCommas(digitsOnly);
      setFormData((prev) => ({ ...prev, costing: formattedValue }));
      if (errors.costing) setErrors((prev) => ({ ...prev, costing: "" }));
    }
  };

  const handlePercentChange = (e) => {
    const raw = e.target.value || "";
    setTypedFlags((prev) => ({ ...prev, annual_penalty_rate: true }));
    
    // Extract only digits from the input
    const digitsOnly = raw.replace(/[^0-9]/g, "");
    
    // Validate zero values - only allow single "0", not "00" or "000"
    if (digitsOnly !== "" && !validateZeroValue(digitsOnly)) {
      openValidation("annual_penalty_rate", 'Zero values must be entered as "0" only, not "00" or "000"');
      return;
    }
    
    // Limit to maximum 3 digits
    if (digitsOnly.length > 3) {
      openValidation("annual_penalty_rate", "Annual Penalty Interest Rate (%) must be at most 3 digits");
      return;
    }
    
    const finalValue = digitsOnly.slice(0, 3);
    
    // Display value with % sign appended (only if there are digits), but store numeric value for calculations
    const displayValue = finalValue === "" ? "" : finalValue + "%";
    setAnnualPenaltyRate(displayValue);
    
    setFormData((prev) => {
      const newFormData = { ...prev, annual_penalty_rate: finalValue }; // Store numeric value for calculations
      
      // Recalculate Cumulative Arrears Penalty Exposure when penalty rate changes
      const penaltyRate = parseFloat(finalValue) || 0;
      
      // Recalculate for External funding source
      const arrearsValue = parseFloat(formData.arrears) || 0;
      const penaltyExposure = Math.round(arrearsValue * (penaltyRate / 100));
      newFormData.arrears_6_months_plus = penaltyExposure.toString();
      
      // Recalculate for GoU funding source
      const arrearsGouValue = parseFloat(formData.arrears_gou) || 0;
      const penaltyExposureGou = Math.round(arrearsGouValue * (penaltyRate / 100));
      newFormData.arrears_6_months_plus_gou = penaltyExposureGou.toString();
      
      return newFormData;
    });
    
    if (errors.annual_penalty_rate) setErrors((prev) => ({ ...prev, annual_penalty_rate: "" }));
  };

  // Handler for numeric-only inputs in arrears fields
  const handleArrearsChange = (name) => (e) => {
    const raw = e.target.value || "";
    setTypedFlags((prev) => ({ ...prev, [name]: true }));
    // If any non-digit and non-comma char is typed, alert immediately
    if (/[^0-9,]/.test(raw)) {
      openValidation(name, `${name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} must contain digits only`);
      return;
    }
    const digitsOnly = raw.replace(/\D/g, "");
    
    // Validate zero values - only allow single "0", not "00" or "000"
    if (digitsOnly !== "" && !validateZeroValue(digitsOnly)) {
      openValidation(name, 'Zero values must be entered as "0" only, not "00" or "000"');
      return;
    }
    
    if (name === 'approved_payments') {
      // Clean the contract value by removing commas before converting to number
      const cleanContractValueExternal = typeof formData.contract_value_external === 'string' 
        ? formData.contract_value_external.replace(/,/g, '') 
        : formData.contract_value_external || '0';
      const contractValueExternalNum = Number(cleanContractValueExternal) || 0;
      const approvedPaymentsValue = Number(digitsOnly) || 0;
      
      // Check against Contract Value External
      if (contractValueExternalNum > 0 && approvedPaymentsValue > contractValueExternalNum) {
        // Show dialog and explicitly clear the field
        setContractValueExceedDialog({
          open: true,
          message: `Approved Payments External (${approvedPaymentsValue.toLocaleString()}) cannot exceed Contract Value External (${contractValueExternalNum.toLocaleString()}). Please enter a value within the contract limit.`,
          fundingSource: "External"
        });
        // Explicitly clear the field by setting it to empty string
        setFormData((prev) => ({ ...prev, approved_payments: "" }));
        return;
      }
      
      // Check against Balance on Costing External
      if (contractValueExternalNum > 0 && approvedPaymentsValue > 0) {
        // Calculate current fiscal year total for External
        const fiscalYearTotalExternal = Object.values(pipelineExternal).reduce((sum, val) => {
          const cleanVal = typeof val === 'string' ? val.replace(/,/g, '') : val;
          const numVal = Number(cleanVal) || 0;
          return sum + Math.min(numVal, 1000000000);
        }, 0);
        
        // Calculate Balance on Costing External
        const balanceExternal = contractValueExternalNum - fiscalYearTotalExternal;
        
        if (approvedPaymentsValue > balanceExternal) {
          // Show dialog and explicitly clear the field
          setContractValueExceedDialog({
            open: true,
            message: `Approved Payments External (${approvedPaymentsValue.toLocaleString()}) exceeds available Balance on Costing External (${balanceExternal.toLocaleString()}). Please enter a value within the available balance.`,
            fundingSource: "External"
          });
          // Explicitly clear the field by setting it to empty string
          setFormData((prev) => ({ ...prev, approved_payments: "" }));
          return;
        }
      }
    }
    
    if (name === 'approved_payments_gou') {
      // Clean the contract value by removing commas before converting to number
      const cleanContractValueGoU = typeof formData.contract_value_gou === 'string' 
        ? formData.contract_value_gou.replace(/,/g, '') 
        : formData.contract_value_gou || '0';
      const contractValueGoUNum = Number(cleanContractValueGoU) || 0;
      const approvedPaymentsGouValue = Number(digitsOnly) || 0;
      
      // Check against Contract Value GoU
      if (contractValueGoUNum > 0 && approvedPaymentsGouValue > contractValueGoUNum) {
        // Show dialog and explicitly clear the field
        setContractValueExceedDialog({
          open: true,
          message: `Approved Payments GoU (${approvedPaymentsGouValue.toLocaleString()}) cannot exceed Contract Value GoU (${contractValueGoUNum.toLocaleString()}). Please enter a value within the contract limit.`,
          fundingSource: "GoU"
        });
        // Explicitly clear the field by setting it to empty string
        setFormData((prev) => ({ ...prev, approved_payments_gou: "" }));
        return;
      }
      
      // Check against Balance on Costing GoU
      if (contractValueGoUNum > 0 && approvedPaymentsGouValue > 0) {
        // Calculate current fiscal year total for GoU
        const fiscalYearTotalGoU = Object.values(pipelineGoU).reduce((sum, val) => {
          const cleanVal = typeof val === 'string' ? val.replace(/,/g, '') : val;
          const numVal = Number(cleanVal) || 0;
          return sum + Math.min(numVal, 1000000000);
        }, 0);
        
        // Calculate Balance on Costing GoU
        const balanceGoU = contractValueGoUNum - fiscalYearTotalGoU;
        
        if (approvedPaymentsGouValue > balanceGoU) {
          // Show dialog and explicitly clear the field
          setContractValueExceedDialog({
            open: true,
            message: `Approved Payments GoU (${approvedPaymentsGouValue.toLocaleString()}) exceeds available Balance on Costing GoU (${balanceGoU.toLocaleString()}). Please enter a value within the available balance.`,
            fundingSource: "GoU"
          });
          // Explicitly clear the field by setting it to empty string
          setFormData((prev) => ({ ...prev, approved_payments_gou: "" }));
          return;
        }
      }
    }
    
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: digitsOnly };
      
      // Automatically calculate Cumulative Arrears Penalty Exposure
      const penaltyRate = parseFloat((annualPenaltyRate || "").replace(/\D/g, "")) || 0;
      
      // Calculate for External funding source
      if (name === 'arrears') {
        const arrearsValue = parseFloat(digitsOnly) || 0;
        const penaltyExposure = Math.round(arrearsValue * (penaltyRate / 100));
        newFormData.arrears_6_months_plus = penaltyExposure.toString();
      }
      
      // Calculate for GoU funding source
      if (name === 'arrears_gou') {
        const arrearsGouValue = parseFloat(digitsOnly) || 0;
        const penaltyExposureGou = Math.round(arrearsGouValue * (penaltyRate / 100));
        newFormData.arrears_6_months_plus_gou = penaltyExposureGou.toString();
      }
      
      return newFormData;
    });
    
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Local UI state for fields not part of payload
  const [contractValueExternal, setContractValueExternal] = useState("0");
  const [annualPenaltyRate, setAnnualPenaltyRate] = useState("");

  // Dynamic FY headers and values for External/GoU pipeline table
  const [fyHeaders, setFyHeaders] = useState([]);
  const [pipelineExternal, setPipelineExternal] = useState({});
  const [pipelineGoU, setPipelineGoU] = useState({});

  // Counterpart form state variables
  const [counterpartStartDate, setCounterpartStartDate] = useState("");
  const [counterpartEndDate, setCounterpartEndDate] = useState("");
  const [counterpartFyHeaders, setCounterpartFyHeaders] = useState([]);
  const [counterpartFinancingTitle, setCounterpartFinancingTitle] = useState("");
  const [counterpartRequirementSpec, setCounterpartRequirementSpec] = useState("");
  const [counterpartValue, setCounterpartValue] = useState("");
  const [counterpartDisbursed, setCounterpartDisbursed] = useState("");
  const [counterpartBalance, setCounterpartBalance] = useState("");
  const [counterpartPipelineExternal, setCounterpartPipelineExternal] = useState({});
  const [counterpartPipelineGoU, setCounterpartPipelineGoU] = useState({});
  const [counterpartDateErrors, setCounterpartDateErrors] = useState({});
  const [counterpartValidationErrors, setCounterpartValidationErrors] = useState({});

  // Non-contractual form state variables
  const [nonContractualItemCode, setNonContractualItemCode] = useState("");
  const [nonContractualDescription, setNonContractualDescription] = useState("");
  const [nonContractualStartDate, setNonContractualStartDate] = useState("");
  const [nonContractualEndDate, setNonContractualEndDate] = useState("");
  const [nonContractualGoUAmount, setNonContractualGoUAmount] = useState("");
  const [nonContractualExternalAmount, setNonContractualExternalAmount] = useState("");
  const [nonContractualFundingSource, setNonContractualFundingSource] = useState("");
  const [nonContractualCounterpartValue, setNonContractualCounterpartValue] = useState("");
  const [nonContractualCounterpartReleased, setNonContractualCounterpartReleased] = useState("");
  const [nonContractualCounterpartBalance, setNonContractualCounterpartBalance] = useState("");
  const [nonContractualFyHeaders, setNonContractualFyHeaders] = useState([]);
  const [nonContractualPipelineGoU, setNonContractualPipelineGoU] = useState({});
  const [nonContractualPipelineExternal, setNonContractualPipelineExternal] = useState({});
  
  // Non-contractual validation state
  const [nonContractualValidationErrors, setNonContractualValidationErrors] = useState({});
  
  // Item codes from PBS API
  const [itemCodes, setItemCodes] = useState([]);
  const [fiscalYearItemCodes, setFiscalYearItemCodes] = useState({});
  const [itemCodesLoading, setItemCodesLoading] = useState(false);
  const [fetchedProjectCode, setFetchedProjectCode] = useState(null);

  // Fetch item codes from PBS API with authentication
  const fetchItemCodes = useCallback(async () => {
    if (!projectData.code || itemCodesLoading || fetchedProjectCode === projectData.code) {
      return;
    }
    
    console.log('Fetching item codes for project:', projectData.code);
    setItemCodesLoading(true);
    setFetchedProjectCode(projectData.code);
    
    try {
      // Step 1: Authenticate with PBS API (same as ImplementationModule)
      console.log('Authenticating with PBS API...');
      const loginResponse = await fetch('https://pbsopenapi.finance.go.ug/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation {
              login(
                data: {
                  User_Name: "Nita"
                  Password: "Nita1290W"
                  ipAddress: "192.168.5.0"
                }
              ) {
                access_token
                refresh_token
              }
            }
          `
        })
      });

      if (!loginResponse.ok) {
        throw new Error(`Login failed: HTTP ${loginResponse.status}`);
      }

      const loginResult = await loginResponse.json();
      
      if (loginResult.errors) {
        throw new Error(`Login GraphQL errors: ${JSON.stringify(loginResult.errors)}`);
      }

      if (!loginResult.data?.login?.access_token) {
        throw new Error('No access token received from PBS API');
      }

      const accessToken = loginResult.data.login.access_token;
      console.log('Successfully authenticated with PBS API');

      // Step 2: Fetch item codes with authentication
      console.log('Fetching item codes with authentication...');
      const dataResponse = await fetch('https://pbsopenapi.finance.go.ug/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
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
          `
        })
      });

      if (!dataResponse.ok) {
        throw new Error(`Data fetch failed: HTTP ${dataResponse.status}`);
      }

      const dataResult = await dataResponse.json();
      
      if (dataResult.errors) {
        throw new Error(`Data GraphQL errors: ${JSON.stringify(dataResult.errors)}`);
      }

      const data = dataResult.data.cgIbpProjectBudgetAllocations;
      
      // Filter data for the current project and transform to item codes
      const projectData_filtered = data.filter(item => item.Project_Code === projectData.code);
      
      console.log('🔍 Project filtering debug:', {
        projectCode: projectData.code,
        totalRecords: data.length,
        filteredRecords: projectData_filtered.length,
        sampleRecord: projectData_filtered[0],
        voteNames: [...new Set(projectData_filtered.map(item => item.Vote_Name))],
        projectNames: [...new Set(projectData_filtered.map(item => item.Project_Name))],
        fiscalYears: [...new Set(projectData_filtered.map(item => item.Fiscal_Year))],
        allFiscalYears: [...new Set(data.map(item => item.Fiscal_Year))]
      });
      
      // Show the actual vote codes and project codes
      console.log('🔍 Actual vote codes:', [...new Set(projectData_filtered.map(item => item.Vote_Code))]);
      console.log('🔍 Actual project codes:', [...new Set(projectData_filtered.map(item => item.Project_Code))]);
      console.log('🔍 Actual vote names:', [...new Set(projectData_filtered.map(item => item.Vote_Name))]);
      console.log('🔍 Actual project names:', [...new Set(projectData_filtered.map(item => item.Project_Name))]);
      
      // Debug all records for project 1870
      console.log('🔍 All records for project 1870:', projectData_filtered.map(item => ({
        itemCode: item.Item_Code,
        fiscalYear: item.Fiscal_Year,
        voteCode: item.Vote_Code,
        projectCode: item.Project_Code,
        voteName: item.Vote_Name,
        projectName: item.Project_Name,
        gouValue: item.GoU,
        extFinValue: item.ExtFin,
        description: item.Description
      })));
      
      // Debug specific fiscal year formats
      const fy2025Variants = projectData_filtered.filter(item => 
        item.Fiscal_Year && item.Fiscal_Year.includes('2025')
      );
      console.log('🔍 2025 fiscal year variants:', {
        count: fy2025Variants.length,
        variants: [...new Set(fy2025Variants.map(item => item.Fiscal_Year))],
        sampleRecords: fy2025Variants.slice(0, 3).map(item => ({
          fiscalYear: item.Fiscal_Year,
          voteCode: item.Vote_Code,
          projectCode: item.Project_Code,
          voteName: item.Vote_Name,
          projectName: item.Project_Name,
          itemCode: item.Item_Code,
          gouValue: item.GoU
        }))
      });
      
      // Debug all fiscal years in the data
      const allFiscalYearsInData = [...new Set(projectData_filtered.map(item => item.Fiscal_Year))];
      console.log('🔍 All fiscal years in project data:', allFiscalYearsInData);
      
      // Check specifically for 2025-26 vs other 2025 variants
      const fy2025_26 = projectData_filtered.filter(item => item.Fiscal_Year === '2025-26');
      const fy2025_2026 = projectData_filtered.filter(item => item.Fiscal_Year === '2025-2026');
      const fy2025Other = projectData_filtered.filter(item => 
        item.Fiscal_Year && item.Fiscal_Year.includes('2025') && 
        item.Fiscal_Year !== '2025-26' && item.Fiscal_Year !== '2025-2026'
      );
      
      console.log('🔍 Fiscal year breakdown:', {
        '2025-26': fy2025_26.length,
        '2025-2026': fy2025_2026.length,
        'Other 2025 variants': fy2025Other.length,
        fy2025_26Records: fy2025_26.map(item => ({
          fiscalYear: item.Fiscal_Year,
          itemCode: item.Item_Code,
          gouValue: item.GoU,
          extFinValue: item.ExtFin
        })),
        fy2025_2026Records: fy2025_2026.map(item => ({
          fiscalYear: item.Fiscal_Year,
          itemCode: item.Item_Code,
          gouValue: item.GoU,
          extFinValue: item.ExtFin
        })),
        fy2025OtherRecords: fy2025Other.map(item => ({
          fiscalYear: item.Fiscal_Year,
          itemCode: item.Item_Code,
          gouValue: item.GoU,
          extFinValue: item.ExtFin
        }))
      });
      
      
      // Get unique item codes with their descriptions and PBS values, grouped by fiscal year
      const itemCodesByFiscalYear = {};
      const processedRecords = new Set(); // Track processed records to avoid true duplicates
      
      projectData_filtered.forEach(item => {
        const itemCode = item.Item_Code;
        const fiscalYear = item.Fiscal_Year;
        const voteCode = item.Vote_Code;
        const projectCode = item.Project_Code;
        
        // Debug specific records for 2025
        if (fiscalYear && fiscalYear.includes('2025')) {
          console.log('🔍 Processing 2025 record:', {
            itemCode,
            fiscalYear,
            voteCode,
            projectCode,
            gouValue: item.GoU,
            extFinValue: item.ExtFin,
            description: item.Description,
            originalFiscalYear: item.Fiscal_Year
          });
        }
        
        if (itemCode && fiscalYear) {
          if (!itemCodesByFiscalYear[fiscalYear]) {
            itemCodesByFiscalYear[fiscalYear] = {};
          }
          
          // Handle values for the same unique key in the same fiscal year
          const gouToAdd = parseFloat(item.GoU) || 0;
          const extFinToAdd = parseFloat(item.ExtFin) || 0;
          
          // Create a record identifier that includes values to detect true duplicates
          const recordId = `${itemCode}_${voteCode}_${projectCode}_${fiscalYear}_${gouToAdd}_${extFinToAdd}_${item.Description || ''}`;
          
          // Check if this exact record (with same values) already exists
          if (processedRecords.has(recordId)) {
            console.log('⚠️ True duplicate record detected, skipping:', {
              recordId,
              itemCode,
              gouValue: gouToAdd,
              extFinValue: extFinToAdd
            });
            return; // Skip this true duplicate record
          }
          
          // Create a unique key for this record (including values to separate different budget lines)
          const uniqueKey = `${itemCode}_${voteCode}_${projectCode}_${fiscalYear}_${gouToAdd}_${extFinToAdd}`;
          
          if (!itemCodesByFiscalYear[fiscalYear][uniqueKey]) {
            itemCodesByFiscalYear[fiscalYear][uniqueKey] = {
              code: itemCode,
              description: item.Description || '',
              id: uniqueKey,
              voteCode: item.Vote_Code,
              voteName: item.Vote_Name,
              programmeCode: item.Programme_Code,
              programmeName: item.Programme_Name,
              projectCode: item.Project_Code,
              projectName: item.Project_Name,
              gouValue: gouToAdd,
              extFinValue: extFinToAdd,
              fiscalYear: fiscalYear
            };
          }
          
          // Mark this record as processed
          processedRecords.add(recordId);
          
          // Debug record processing
          if (fiscalYear && fiscalYear.includes('2025')) {
            console.log('✅ Processed record:', JSON.stringify({
              uniqueKey,
              itemCode,
              gouValue: gouToAdd,
              extFinValue: extFinToAdd,
              description: item.Description
            }));
          }
        }
      });
      
      // Keep the fiscal year structure intact for proper MTEF ceiling calculation
      const fiscalYearItemCodes = {};
      Object.keys(itemCodesByFiscalYear).forEach(fiscalYear => {
        fiscalYearItemCodes[fiscalYear] = Object.values(itemCodesByFiscalYear[fiscalYear]);
      });
      
      // Also create a flattened version for backward compatibility
      const uniqueItemCodes = [];
      const seenKeys = new Set();
      Object.keys(itemCodesByFiscalYear).forEach(fiscalYear => {
        Object.values(itemCodesByFiscalYear[fiscalYear]).forEach(item => {
          // Check for duplicate keys
          if (seenKeys.has(item.id)) {
            console.warn('⚠️ Duplicate key detected:', item.id, 'for item:', item.code);
          }
          seenKeys.add(item.id);
          uniqueItemCodes.push(item);
        });
      });
      
      console.log('🔍 Key generation summary:', {
        totalUniqueKeys: seenKeys.size,
        totalItems: uniqueItemCodes.length,
        duplicateKeysDetected: uniqueItemCodes.length - seenKeys.size
      });
      
      // Debug final values that will be displayed to user
      console.log('📊 Final item codes for user display:', JSON.stringify(Object.keys(fiscalYearItemCodes).map(fy => ({
        fiscalYear: fy,
        items: Object.values(fiscalYearItemCodes[fy]).map(item => ({
          code: item.code,
          description: item.description,
          gouValue: item.gouValue,
          extFinValue: item.extFinValue
        }))
      })), null, 2));
      console.log('✅ Project filtered data:', projectData_filtered.length, 'records for project', projectData.code);
      console.log('✅ Fiscal year structure:', Object.keys(fiscalYearItemCodes).map(fy => ({
        fiscalYear: fy,
        itemCodesCount: fiscalYearItemCodes[fy].length,
        totalGoU: fiscalYearItemCodes[fy].reduce((sum, item) => sum + item.gouValue, 0),
        totalExtFin: fiscalYearItemCodes[fy].reduce((sum, item) => sum + item.extFinValue, 0)
      })));
      
      // Debug final fiscal years vs API fiscal years
      const finalFiscalYears = Object.keys(fiscalYearItemCodes);
      console.log('🔍 Final fiscal years in UI:', finalFiscalYears);
      console.log('🔍 Comparison - API vs Final:', {
        apiFiscalYears: allFiscalYearsInData,
        finalFiscalYears: finalFiscalYears,
        has2025_26: finalFiscalYears.includes('2025-26'),
        has2025_2026: finalFiscalYears.includes('2025-2026'),
        apiHas2025_26: allFiscalYearsInData.includes('2025-26'),
        apiHas2025_2026: allFiscalYearsInData.includes('2025-2026')
      });
      
      // Check for fiscal years in UI that don't exist in API data
      const missingFiscalYears = finalFiscalYears.filter(fy => !allFiscalYearsInData.includes(fy));
      if (missingFiscalYears.length > 0) {
        console.warn('⚠️ Fiscal years displayed in UI but not in API data:', missingFiscalYears);
        setSnackbar({
          open: true,
          message: `Warning: Fiscal year(s) ${missingFiscalYears.join(', ')} are displayed but not found in API data. Please verify the data source.`,
          severity: 'warning'
        });
      }
      
      // Check if no fiscal year data was found at all
      if (Object.keys(fiscalYearItemCodes).length === 0) {
        console.error('❌ No fiscal year data found for project:', projectData.code);
        setSnackbar({
          open: true,
          message: `No budget data found for project ${projectData.code}. Please verify the project code or contact the administrator.`,
          severity: 'error'
        });
        setItemCodes([]);
        setFiscalYearItemCodes({});
        return;
      }
      
      // Check for empty fiscal years and notify user
      const emptyFiscalYears = Object.keys(fiscalYearItemCodes).filter(fy => 
        fiscalYearItemCodes[fy].length === 0
      );
      
      if (emptyFiscalYears.length > 0) {
        console.warn('⚠️ Empty fiscal years detected:', emptyFiscalYears);
        setSnackbar({
          open: true,
          message: `No budget data available for fiscal year(s): ${emptyFiscalYears.join(', ')}. Please contact the administrator.`,
          severity: 'warning'
        });
      }
      
      // Check if any fiscal year has no meaningful data (all values are 0)
      const fiscalYearsWithNoData = Object.keys(fiscalYearItemCodes).filter(fy => {
        const items = fiscalYearItemCodes[fy];
        return items.length > 0 && items.every(item => 
          (item.gouValue === 0 || !item.gouValue) && 
          (item.extFinValue === 0 || !item.extFinValue)
        );
      });
      
      if (fiscalYearsWithNoData.length > 0) {
        console.warn('⚠️ Fiscal years with no budget values detected:', fiscalYearsWithNoData);
        setSnackbar({
          open: true,
          message: `Fiscal year(s) ${fiscalYearsWithNoData.join(', ')} have no budget allocations (all values are zero). Please verify the data.`,
          severity: 'info'
        });
      }
      
      
      
      setItemCodes(uniqueItemCodes);
      setFiscalYearItemCodes(fiscalYearItemCodes);
      
      // Show success message
      // setSnackbar({
      //   open: true,
      //   message: `✅ Successfully loaded ${uniqueItemCodes.length} item codes for project code ${projectData.code}`,
      //   severity: 'success'
      // });
      
    } catch (error) {
      console.error('Error fetching item codes:', error);
      
      // Fallback to mock data when API fails
      const projectCode = projectData.code || '1486';
      const mockItemCodes = [
        { 
          code: `${projectCode}01`, 
          description: 'Training and capacity building for project staff', 
          id: `${projectCode}01`,
          voteCode: '148',
          voteName: 'Ministry of Works and Transport',
          programmeCode: '1486',
          programmeName: projectData.name || 'Road Infrastructure Development',
          projectCode: projectCode,
          projectName: projectData.name || 'Road Infrastructure Development'
        },
        { 
          code: `${projectCode}02`, 
          description: 'Equipment procurement and installation', 
          id: `${projectCode}02`,
          voteCode: '148',
          voteName: 'Ministry of Works and Transport',
          programmeCode: '1486',
          programmeName: projectData.name || 'Road Infrastructure Development',
          projectCode: projectCode,
          projectName: projectData.name || 'Road Infrastructure Development'
        },
        { 
          code: `${projectCode}03`, 
          description: 'Infrastructure development and construction', 
          id: `${projectCode}03`,
          voteCode: '148',
          voteName: 'Ministry of Works and Transport',
          programmeCode: '1486',
          programmeName: projectData.name || 'Road Infrastructure Development',
          projectCode: projectCode,
          projectName: projectData.name || 'Road Infrastructure Development'
        },
        { 
          code: `${projectCode}04`, 
          description: 'Consultancy services and technical support', 
          id: `${projectCode}04`,
          voteCode: '148',
          voteName: 'Ministry of Works and Transport',
          programmeCode: '1486',
          programmeName: projectData.name || 'Road Infrastructure Development',
          projectCode: projectCode,
          projectName: projectData.name || 'Road Infrastructure Development'
        },
        { 
          code: `${projectCode}05`, 
          description: 'Monitoring and evaluation activities', 
          id: `${projectCode}05`,
          voteCode: '148',
          voteName: 'Ministry of Works and Transport',
          programmeCode: '1486',
          programmeName: projectData.name || 'Road Infrastructure Development',
          projectCode: projectCode,
          projectName: projectData.name || 'Road Infrastructure Development'
        }
      ];
      
      setItemCodes(mockItemCodes);
      
      console.log('Using fallback mock data for project:', projectCode);
      console.log('Mock item codes:', mockItemCodes);
      
      setSnackbar({
        open: true,
        message: `⚠️ Using sample item codes for project ${projectCode} (PBS API error: ${error.message})`,
        severity: 'warning'
      });
    } finally {
      setItemCodesLoading(false);
    }
  }, [projectData.code, itemCodesLoading]);

  // Visual widening for Contract Name on focus
  // const contractNameFocusSx = {
  //   '& .MuiOutlinedInput-root': {
  //     transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  //     transformOrigin: 'left center',
  //     '&.Mui-focused': {
  //       transform: 'scaleX(1.8)',
  //       zIndex: 6,
  //       boxShadow: 3,
  //       backgroundColor: '#fff'
  //     }
  //   },
  //   '& .MuiOutlinedInput-input': { fontFamily: 'inherit', fontWeight: 'normal' }
  // };

  // Custom button styles with the blue color from the image
  const buttonStyles = {
    backgroundColor: '#3F51B5',
    color: 'white',
    fontWeight: 'normal',
    textTransform: 'uppercase',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    '&:hover': {
      backgroundColor: '#303F9F',
      boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
    },
    '&:disabled': {
      backgroundColor: '#BDBDBD',
      color: 'white',
    }
  };

  // Combined fiscal years: FY2016/17 to FY2034/35 (19 years total)
  // Function to convert date to fiscal year format
  const convertDateToFiscalYear = (dateString) => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // getMonth() returns 0-11
      
      // If we're in July-December, we're in the financial year that started in July
      // If we're in January-June, we're in the financial year that started in July of the previous year
      const financialYearStart = month >= 7 ? year : year - 1;
      const financialYearEnd = financialYearStart + 1;
      
      const endShort = (financialYearEnd % 100).toString().padStart(2, '0');
      return `FY${financialYearStart}/${endShort}`;
    } catch (error) {
      console.error('Error converting date to fiscal year:', error);
      return 'N/A';
    }
  };

  // Function to generate fiscal years based on project start and end dates
  const generateProjectFiscalYears = () => {
    // Return empty array if project period is not selected
    if (!projectPeriodStart || !projectPeriodEnd || 
        projectPeriodStart === '' || projectPeriodEnd === '' ||
        projectPeriodStart === 'Select...' || projectPeriodEnd === 'Select...') {
      return [];
    }
    
    const startFy = projectPeriodStart;
    const endFy = projectPeriodEnd;
    
    if (startFy === 'N/A' || endFy === 'N/A') {
      return ['FY2023/24', 'FY2024/25', 'FY2025/26', 'FY2026/27']; // Fallback
    }
    
    // Extract years from fiscal year strings safely
    const startMatch = startFy.match(/FY(\d{4})/);
    const endMatch = endFy.match(/FY(\d{4})/);
    
    if (!startMatch || !endMatch) {
      return ['FY2023/24', 'FY2024/25', 'FY2025/26', 'FY2026/27']; // Fallback if regex fails
    }
    
    const startYear = parseInt(startMatch[1]);
    const endYear = parseInt(endMatch[1]);
    
    const fiscalYears = [];
    for (let year = startYear; year <= endYear; year++) {
      const endShort = ((year + 1) % 100).toString().padStart(2, '0');
      fiscalYears.push(`FY${year}/${endShort}`);
    }
    
    return fiscalYears;
  };

  // Validate project period on mount and when values change
  useEffect(() => {
    const validation = validateProjectPeriod(projectPeriodStart, projectPeriodEnd);
    if (!validation.isValid) {
      setProjectPeriodError(validation.message);
    } else {
      setProjectPeriodError('');
    }
  }, [projectPeriodStart, projectPeriodEnd]);
  
  // Ensure Current Reporting Financial Year is always set to current year
  useEffect(() => {
    setSelectedFinancialYear(getCurrentUgandanFinancialYear());
  }, []);

  // Check if project period is selected
  const isProjectPeriodSelected = () => {
    return projectPeriodStart && projectPeriodEnd && 
           projectPeriodStart !== '' && projectPeriodEnd !== '' &&
           projectPeriodStart !== 'Select...' && projectPeriodEnd !== 'Select...' &&
           validateProjectPeriod(projectPeriodStart, projectPeriodEnd).isValid;
  };

  // Function to detect missing PBS API data for Project Duration fiscal years
  const getMissingFiscalYears = () => {
    if (!isProjectPeriodSelected()) {
      return [];
    }
    
    const projectFiscalYears = generateProjectFiscalYears();
    const pbsFiscalYears = Object.keys(fiscalYearItemCodes);
    
    // Find fiscal years in project duration that don't have PBS API data
    const missingFiscalYears = projectFiscalYears.filter(projectFy => {
      // Check if any PBS fiscal year matches this project fiscal year when formatted
      return !pbsFiscalYears.some(pbsFy => {
        const formattedPbsFy = formatFiscalYearForDisplay(pbsFy);
        return formattedPbsFy === projectFy;
      });
    });
    
    return missingFiscalYears;
  };

  // Track missing fiscal years for notification
  const missingFiscalYears = useMemo(() => getMissingFiscalYears(), [projectPeriodStart, projectPeriodEnd, fiscalYearItemCodes]);

  // Generate formatted fiscal years for display from PBS API data, filtered by Project Duration
  const formattedFiscalYears = useMemo(() => {
    const pbsFiscalYears = Object.keys(fiscalYearItemCodes);
    
    // If no project period is selected, return empty array
    if (!isProjectPeriodSelected()) {
      return [];
    }
    
    // Filter PBS fiscal years to only include those within the selected project duration range
    const filteredFiscalYears = pbsFiscalYears.filter(pbsFy => {
      const formattedPbsFy = formatFiscalYearForDisplay(pbsFy);
      
      // Check if this PBS fiscal year falls within the project duration range
      const projectFiscalYears = generateProjectFiscalYears();
      return projectFiscalYears.includes(formattedPbsFy);
    });
    
    return filteredFiscalYears.map(fy => ({
      original: fy,
      formatted: formatFiscalYearForDisplay(fy)
    }));
  }, [fiscalYearItemCodes, projectPeriodStart, projectPeriodEnd]);

  // Generate fiscal years based on project period
  const fiscalYears = useMemo(() => generateProjectFiscalYears(), [projectPeriodStart, projectPeriodEnd]);
  
  // Update fyHeaders when fiscal years change (for PBS API financial fields)
  useEffect(() => {
    setFyHeaders(fiscalYears);
  }, [fiscalYears]);

  // Reset Financial Year field when Project Duration changes
  useEffect(() => {
    setContractualSelectedFiscalYear("");
  }, [projectPeriodStart, projectPeriodEnd]);

  // Update contract start date when project period changes
  useEffect(() => {
    if (projectPeriodStart && projectPeriodStart !== '' && projectPeriodStart !== 'Select...') {
      // Convert fiscal year to actual date (use July 1st of the fiscal year)
      const startMatch = projectPeriodStart.match(/FY(\d{4})/);
      if (startMatch) {
        const fiscalYear = parseInt(startMatch[1]);
        const contractStartDate = `${fiscalYear}-07-01`; // July 1st of the fiscal year
        setFormData((prev) => ({ ...prev, contract_start_date: contractStartDate }));
      }
    }
  }, [projectPeriodStart]);

  // Reset end date when start date changes
  useEffect(() => {
    if (projectPeriodStart && projectPeriodStart !== '' && projectPeriodStart !== 'Select...') {
      // Only reset if the current end date is the same as the new start date
      if (projectPeriodEnd === projectPeriodStart) {
        setProjectPeriodEnd('');
      }
    }
  }, [projectPeriodStart]);
  
  // Current reporting financial year options - always includes current year regardless of project period
  const currentReportingFinancialYearOptions = useMemo(() => {
    const currentYear = getCurrentUgandanFinancialYear();
    return [currentYear]; // Only show the current financial year
  }, []);

  // State for project details with hardcoded fiscal years
  const [projectDetails, setProjectDetails] = useState({
    start_date: null,
    end_date: null,
    fiscal_years: []
  });

  // Initialize project details with hardcoded fiscal years
  useEffect(() => {
    setProjectDetails({
      start_date: projectData.start_date,
      end_date: projectData.end_date,
      fiscal_years: [],
      start_fiscal_year: '2023-2024',
      end_fiscal_year: '2024-2025'
    });
  }, [projectData.start_date, projectData.end_date]);

  // Function to get the fiscal year (use the contract start date instead of previous year)
  const getFiscalYear = (currentFy) => {
    if (!currentFy) return "";
    return currentFy;
  };

  // Function to format contract start date as FY2023/24
  const formatFiscalYear = (startDate) => {
    if (!startDate) return "";
    
    try {
      const date = new Date(startDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // getMonth() returns 0-11
      
      // Fiscal year starts in July (month 7), so if month >= 7, it's the current fiscal year
      // If month < 7, it's the previous fiscal year
      const fiscalYear = month >= 7 ? year : year - 1;
      const nextFiscalYear = fiscalYear + 1;
      
      return `FY${fiscalYear}/${nextFiscalYear.toString().slice(-2)}`;
    } catch (error) {
      console.error('Error formatting fiscal year:', error);
      return "";
    }
  };

  // Get the fiscal year for the header (use contract start date)
  const currentFy = getFiscalYear(formData.contract_start_date);

  // Calculate balance for Costing: Costing Main - Cumulative Contract Payments
  const calculateCostingBalance = () => {
    // Helper function to clean numeric values (remove commas and convert to number)
    const cleanNumericValue = (value) => {
      if (!value) return 0;
      const cleaned = String(value).replace(/,/g, '');
      return Number(cleaned) || 0;
    };

    console.log('🔍 calculateCostingBalance called:', {
      contractualSourceOfFunding,
      costing: formData.costing,
      contract_value_external: formData.contract_value_external,
      contract_value_gou: formData.contract_value_gou,
      approved_payments: formData.approved_payments,
      approved_payments_gou: formData.approved_payments_gou,
      pipelineExternal: pipelineExternal,
      pipelineGoU: pipelineGoU
    });

    // Add simple debugging
    console.log('🔍 Simple debug values:', {
      sourceOfFunding: contractualSourceOfFunding,
      gouValue: formData.contract_value_gou,
      gouType: typeof formData.contract_value_gou,
      gouPayments: formData.approved_payments_gou,
      gouPaymentsType: typeof formData.approved_payments_gou
    });

    if (contractualSourceOfFunding === "Both") {
      // For "Both", calculate balance based on respective contract values
      const contractValueExternalNum = cleanNumericValue(formData.contract_value_external);
      const contractValueGoUNum = cleanNumericValue(formData.contract_value_gou);
      const approvedPaymentsExternal = cleanNumericValue(formData.approved_payments);
      const approvedPaymentsGoU = cleanNumericValue(formData.approved_payments_gou);
      
      // Calculate fiscal year distributions
      const externalFiscalYearTotal = Object.values(pipelineExternal).reduce((sum, val) => {
        const cleanVal = typeof val === 'string' ? val.replace(/,/g, '') : val;
        const numVal = Number(cleanVal) || 0;
        // Cap individual values at 1 billion to prevent extreme calculations
        return sum + Math.min(numVal, 1000000000);
      }, 0);
      const gouFiscalYearTotal = Object.values(pipelineGoU).reduce((sum, val) => {
        const cleanVal = typeof val === 'string' ? val.replace(/,/g, '') : val;
        const numVal = Number(cleanVal) || 0;
        // Cap individual values at 1 billion to prevent extreme calculations
        return sum + Math.min(numVal, 1000000000);
      }, 0);
      
      // Calculate balance for each funding source separately (including fiscal year distributions)
      const externalBalance = contractValueExternalNum - approvedPaymentsExternal - externalFiscalYearTotal;
      const gouBalance = contractValueGoUNum - approvedPaymentsGoU - gouFiscalYearTotal;
      
      // Return the total balance
      const totalBalance = externalBalance + gouBalance;
      console.log('💰 Both calculation:', { contractValueExternalNum, contractValueGoUNum, approvedPaymentsExternal, approvedPaymentsGoU, externalFiscalYearTotal, gouFiscalYearTotal, externalBalance, gouBalance, totalBalance });
      return totalBalance <= 0 ? 0 : totalBalance;
    } else if (contractualSourceOfFunding === "GoU") {
      // For "GoU", use contract_value_gou and subtract GoU payments and fiscal year distributions
      const contractValueGoUNum = cleanNumericValue(formData.contract_value_gou);
      const approvedPaymentsGoU = cleanNumericValue(formData.approved_payments_gou);
      
      // Calculate fiscal year distributions for GoU
      const gouFiscalYearTotal = Object.values(pipelineGoU).reduce((sum, val) => {
        const cleanVal = typeof val === 'string' ? val.replace(/,/g, '') : val;
        const numVal = Number(cleanVal) || 0;
        // Cap individual values at 1 billion to prevent extreme calculations
        return sum + Math.min(numVal, 1000000000);
      }, 0);
      
      // Calculate remaining balance: Contract Value GoU - GoU Payments - GoU Fiscal Year Distributions
      const balance = contractValueGoUNum - approvedPaymentsGoU - gouFiscalYearTotal;
      
      // Add simple debugging for GoU calculation
      console.log('🔍 GoU calculation debug:', {
        contractValueGoUNum,
        approvedPaymentsGoU,
        gouFiscalYearTotal,
        balance,
        rawGouValue: formData.contract_value_gou,
        rawGouPayments: formData.approved_payments_gou
      });
      
      console.log('💰 GoU calculation:', { 
        contractValueGoUNum, 
        approvedPaymentsGoU, 
        gouFiscalYearTotal, 
        balance,
        formDataContractValueGou: formData.contract_value_gou,
        formDataApprovedPaymentsGou: formData.approved_payments_gou,
        pipelineGoUValues: Object.values(pipelineGoU)
      });
      return balance <= 0 ? 0 : balance;
    } else if (contractualSourceOfFunding === "External") {
      // For "External", use contract_value_external and subtract External payments and fiscal year distributions
      const contractValueExternalNum = cleanNumericValue(formData.contract_value_external);
      const approvedPaymentsExternal = cleanNumericValue(formData.approved_payments);
      
      // Calculate fiscal year distributions for External
      const externalFiscalYearTotal = Object.values(pipelineExternal).reduce((sum, val) => {
        const cleanVal = typeof val === 'string' ? val.replace(/,/g, '') : val;
        return sum + (Number(cleanVal) || 0);
      }, 0);
      
      // Calculate remaining balance: Contract Value External - External Payments - External Fiscal Year Distributions
      const balance = contractValueExternalNum - approvedPaymentsExternal - externalFiscalYearTotal;
      console.log('💰 External calculation:', { 
        contractValueExternalNum, 
        approvedPaymentsExternal, 
        externalFiscalYearTotal, 
        balance,
        formDataContractValueExternal: formData.contract_value_external,
        formDataApprovedPayments: formData.approved_payments,
        pipelineExternalValues: Object.values(pipelineExternal)
      });
      return balance <= 0 ? 0 : balance;
    } else {
      // Default case: use costing and subtract all payments and fiscal year distributions
      const costingNum = cleanNumericValue(formData.costing);
      const cumulativePayments = cleanNumericValue(formData.approved_payments) + cleanNumericValue(formData.approved_payments_gou);
      
      // Calculate total fiscal year distributions
      const externalFiscalYearTotal = Object.values(pipelineExternal).reduce((sum, val) => {
        const cleanVal = typeof val === 'string' ? val.replace(/,/g, '') : val;
        return sum + (Number(cleanVal) || 0);
      }, 0);
      const gouFiscalYearTotal = Object.values(pipelineGoU).reduce((sum, val) => {
        const cleanVal = typeof val === 'string' ? val.replace(/,/g, '') : val;
        return sum + (Number(cleanVal) || 0);
      }, 0);
      const totalFiscalYearDistributions = externalFiscalYearTotal + gouFiscalYearTotal;
      
      // Calculate remaining balance: Costing - All Payments - All Fiscal Year Distributions
      const balance = costingNum - cumulativePayments - totalFiscalYearDistributions;
      console.log('💰 Default calculation:', { costingNum, cumulativePayments, totalFiscalYearDistributions, balance });
      return balance <= 0 ? 0 : balance;
    }
  };

  // Calculate balance for External row when Both is selected
  const calculateExternalCostingBalance = () => {
    const cleanNumericValue = (value) => {
      if (!value) return 0;
      const cleaned = String(value).replace(/,/g, '');
      return Number(cleaned) || 0;
    };

    const contractValueExternalNum = cleanNumericValue(formData.contract_value_external);
    const approvedPaymentsExternal = cleanNumericValue(formData.approved_payments);
    
    // Calculate fiscal year distributions for External
    const externalFiscalYearTotal = Object.values(pipelineExternal).reduce((sum, val) => {
      const cleanVal = typeof val === 'string' ? val.replace(/,/g, '') : val;
      return sum + (Number(cleanVal) || 0);
    }, 0);
    
    const balance = contractValueExternalNum - approvedPaymentsExternal - externalFiscalYearTotal;
    console.log('💰 External costing balance:', { 
      contractValueExternalNum, 
      approvedPaymentsExternal, 
      externalFiscalYearTotal, 
      balance,
      formDataContractValueExternal: formData.contract_value_external,
      formDataApprovedPayments: formData.approved_payments,
      pipelineExternalValues: Object.values(pipelineExternal)
    });
    return balance <= 0 ? 0 : balance;
  };

  // Calculate balance for GoU row when Both is selected
  const calculateGoUCostingBalance = () => {
    const cleanNumericValue = (value) => {
      if (!value) return 0;
      const cleaned = String(value).replace(/,/g, '');
      return Number(cleaned) || 0;
    };

    const contractValueGoUNum = cleanNumericValue(formData.contract_value_gou);
    const approvedPaymentsGoU = cleanNumericValue(formData.approved_payments_gou);
    
    // Calculate fiscal year distributions for GoU
    const gouFiscalYearTotal = Object.values(pipelineGoU).reduce((sum, val) => {
      const cleanVal = typeof val === 'string' ? val.replace(/,/g, '') : val;
      const numVal = Number(cleanVal) || 0;
      // Cap individual values at 1 billion to prevent extreme calculations
      return sum + Math.min(numVal, 1000000000);
    }, 0);
    
    const balance = contractValueGoUNum - approvedPaymentsGoU - gouFiscalYearTotal;
    
    // Add simple debugging for GoU costing balance
    console.log('🔍 GoU costing balance debug:', {
      contractValueGoUNum,
      approvedPaymentsGoU,
      gouFiscalYearTotal,
      balance,
      rawGouValue: formData.contract_value_gou,
      rawGouPayments: formData.approved_payments_gou
    });
    
    console.log('💰 GoU costing balance:', { 
      contractValueGoUNum, 
      approvedPaymentsGoU, 
      gouFiscalYearTotal, 
      balance,
      formDataContractValueGou: formData.contract_value_gou,
      formDataApprovedPaymentsGou: formData.approved_payments_gou,
      pipelineGoUValues: Object.values(pipelineGoU)
    });
    return balance <= 0 ? 0 : balance;
  };

  // Calculate balance for External row: Contract Value External - Approved Payments External - Fiscal Year Distributions
  const calculateExternalBalance = () => {
    const contractValueExternalNum = Number(formData.contract_value_external || 0);
    const approvedPaymentsExternal = Number(formData.approved_payments || 0);
    
    // Calculate fiscal year distributions for External
    const fiscalYearTotal = Object.values(pipelineExternal).reduce((sum, val) => sum + Number(val || 0), 0);
    
    // Calculate remaining balance: Contract Value - Approved Payments - Fiscal Year Distributions
    const balance = contractValueExternalNum - approvedPaymentsExternal - fiscalYearTotal;
    
    // Display 0 if balance is negative, otherwise show the actual balance
    return balance <= 0 ? 0 : balance;
  };

  // Calculate balance for GoU row: Contract Value GoU - Approved Payments GoU - Fiscal Year Distributions
  const calculateGoUBalance = () => {
    const contractValueGoUNum = Number(formData.contract_value_gou || 0);
    const approvedPaymentsGoU = Number(formData.approved_payments_gou || 0);
    
    // Calculate fiscal year distributions for GoU
    const fiscalYearTotal = Object.values(pipelineGoU).reduce((sum, val) => sum + Number(val || 0), 0);
    
    // Calculate remaining balance: Contract Value GoU - Approved Payments GoU - Fiscal Year Distributions
    const balance = contractValueGoUNum - approvedPaymentsGoU - fiscalYearTotal;
    
    // Display 0 if balance is negative, otherwise show the actual balance
    return balance <= 0 ? 0 : balance;
  };

  // Validate fiscal year totals against individual Balance on Contract Values
  const validateFiscalYearTotals = () => {
    const contractValueExternalNum = Number(formData.contract_value_external || 0);
    const contractValueGoUNum = Number(formData.contract_value_gou || 0);
    const approvedPaymentsExternal = Number(formData.approved_payments || 0);
    const approvedPaymentsGoU = Number(formData.approved_payments_gou || 0);
    
    const newErrors = {};
    
    // Calculate individual Balance on Contract Values
    const balanceExternal = contractValueExternalNum - approvedPaymentsExternal;
    const balanceGoU = contractValueGoUNum - approvedPaymentsGoU;
    
    // Calculate fiscal year distributions for each row
    const externalTotal = Object.values(pipelineExternal).reduce((sum, val) => sum + Number(val || 0), 0);
    const gouTotal = Object.values(pipelineGoU).reduce((sum, val) => sum + Number(val || 0), 0);
    
    // Check if External fiscal year values exceed Balance on Contract Value External
    if (balanceExternal > 0 && externalTotal > balanceExternal) {
      newErrors['external_total'] = `External fiscal year values (${externalTotal.toLocaleString()}) cannot exceed Balance on Contract Value External (${balanceExternal.toLocaleString()} UGX)`;
    }
    
    // Check if GoU fiscal year values exceed Balance on Contract Value GoU
    if (balanceGoU > 0 && gouTotal > balanceGoU) {
      newErrors['gou_total'] = `GoU fiscal year values (${gouTotal.toLocaleString()}) cannot exceed Balance on Contract Value GoU (${balanceGoU.toLocaleString()} UGX)`;
    }
    
    return newErrors;
  };

  // Clear validation when tabs change (but not during validation)
  useEffect(() => {
    console.log('Tab change useEffect triggered:', { activeTab, nestedTab, isValidationMode: isValidationModeRef.current });
    setValidationDialog({ open: false, issues: [], field: "" });
    // Don't clear errors during validation - let them persist until user fixes them
    if (!isValidationModeRef.current) {
      console.log('Clearing errors due to tab change');
      setErrors({});
    } else {
      console.log('Skipping error clearing due to validation mode');
    }
  }, [activeTab, nestedTab]);

  // Update tab completion status whenever data changes
  useEffect(() => {
    const completionStatus = {
      contractual: contracts.length > 0,
      nonContractual: nonContractualEntries.length > 0,
      counterpart: counterparts.length > 0,
      mycReport: contracts.length > 0 || counterparts.length > 0 || nonContractualEntries.length > 0 || procurementEntries.length > 0,
      addMycInfo: true // This tab is always accessible
    };
    updateTabCompletionStatus(completionStatus);
  }, [contracts.length, nonContractualEntries.length, counterparts.length, procurementEntries.length, updateTabCompletionStatus]);

  // Update Balance on Costing fields in real-time as fiscal year payments change
  useEffect(() => {
    if (showContractForm) {
      // Calculate balance values using the same functions as the UI
      const externalBalance = calculateExternalCostingBalance();
      const gouBalance = calculateGoUCostingBalance();
      const totalBalance = calculateCostingBalance();
      
      // Ensure balance values are properly set (convert empty strings to 0)
      const currentExternalBalance = formData.balance_on_contract_value === "" ? 0 : formData.balance_on_contract_value;
      const currentGouBalance = formData.balance_on_contract_value_gou === "" ? 0 : formData.balance_on_contract_value_gou;
      
      // Only update if values have changed to avoid unnecessary re-renders
      if (currentExternalBalance !== externalBalance || currentGouBalance !== gouBalance) {
        setFormData(prev => ({
          ...prev,
          balance_on_contract_value: externalBalance,
          balance_on_contract_value_gou: gouBalance,
          balance_on_contract_value_total: totalBalance
        }));
      }
    }
  }, [formData.contract_value_external, formData.contract_value_gou, formData.approved_payments, formData.approved_payments_gou, pipelineExternal, pipelineGoU, contractualSourceOfFunding, showContractForm]);

  // Initialize balance values when component mounts or when form data changes
  useEffect(() => {
    if (showContractForm && (formData.balance_on_contract_value === "" || formData.balance_on_contract_value_gou === "")) {
      console.log('🔄 Initializing balance values on mount/change');
      const externalBalance = calculateExternalCostingBalance();
      const gouBalance = calculateGoUCostingBalance();
      const totalBalance = calculateCostingBalance();
      
      setFormData(prev => ({
        ...prev,
        balance_on_contract_value: externalBalance,
        balance_on_contract_value_gou: gouBalance,
        balance_on_contract_value_total: totalBalance
      }));
    }
  }, [showContractForm]);

  // Force re-render when values change to update balance calculations
  // Removed empty useEffect that was causing infinite loops

  // Check for balance exhaustion and show dialog
  useEffect(() => {
    // Check External balance exhaustion
    const contractValueExternalNum = Number(contractValueExternal || 0);
    const totalExternalDistributions = Object.values(pipelineExternal).reduce((sum, val) => sum + Number(val || 0), 0);
    const externalBalance = contractValueExternalNum - totalExternalDistributions;
    
    // Only show popup when distributions actually exceed contract value (negative balance)
    if (contractValueExternalNum > 0 && externalBalance < 0) {
      // Mark as exhausted and show dialog
      // setBalanceExhausted(prev => ({ ...prev, external: true }));
      const message = `Balance for External funding source has been exhausted. Total contract value: ${contractValueExternalNum.toLocaleString()} UGX, Total distributions: ${totalExternalDistributions.toLocaleString()} UGX.`;
      setBalanceExhaustedDialog({ 
        open: true, 
        message, 
        fundingSource: "External" 
      });
    } else {
      // Reset exhausted state if balance is positive or zero
      // setBalanceExhausted(prev => ({ ...prev, external: false }));
    }
    
    // Check GoU balance exhaustion
    const contractValueGoUNum = Number(formData.contract_value_gou || 0);
    const totalGoUDistributions = Object.values(pipelineGoU).reduce((sum, val) => sum + Number(val || 0), 0);
    const gouBalance = contractValueGoUNum - totalGoUDistributions;
    
    // Only show popup when distributions actually exceed contract value (negative balance)
    if (contractValueGoUNum > 0 && gouBalance < 0) {
      // Mark as exhausted and show dialog
      // setBalanceExhausted(prev => ({ ...prev, gou: true }));
      const message = `Balance for GoU funding source has been exhausted. Total contract value: ${contractValueGoUNum.toLocaleString()} UGX, Total distributions: ${totalGoUDistributions.toLocaleString()} UGX.`;
      setBalanceExhaustedDialog({ 
        open: true, 
        message, 
        fundingSource: "GoU" 
      });
    } else {
      // Reset exhausted state if balance is positive or zero
      // setBalanceExhausted(prev => ({ ...prev, gou: false }));
    }
  }, [contractValueExternal, formData.contract_value_gou, pipelineExternal, pipelineGoU]);

  // Auto-populate contract_value_gou when GoU is selected and contract_value is entered
  useEffect(() => {
    if (contractualSourceOfFunding === "GoU" && formData.contract_value) {
      setFormData(prev => ({
        ...prev,
        contract_value_gou: formData.contract_value
      }));
    }
  }, [contractualSourceOfFunding, formData.contract_value]);

  // Auto-populate contract_value_external when External is selected and contract_value is entered
  useEffect(() => {
    if (contractualSourceOfFunding === "External" && formData.contract_value) {
      setFormData(prev => ({
        ...prev,
        contract_value_external: formData.contract_value
      }));
    }
  }, [contractualSourceOfFunding, formData.contract_value]);

  // Reset contract_value when funding source changes to avoid confusion
  useEffect(() => {
    // Reset contract_value when funding source changes (but not on initial load)
    // Don't reset when "Both" is selected to allow editing both fields
    if (contractualSourceOfFunding && contractualSourceOfFunding !== "" && contractualSourceOfFunding !== "Both") {
      setFormData(prev => ({
        ...prev,
        contract_value: "",
        contract_value_external: "",
        contract_value_gou: ""
      }));
    }
  }, [contractualSourceOfFunding]);

  // Auto-fill fiscal year values with zeros ONLY when contract values are specifically set to "0"
  // For all other values (empty, other numbers), fiscal year fields remain empty
  useEffect(() => {
    // Only auto-fill if contract value is specifically "0" (not empty or undefined)
    if (contractValueExternal === "0" && fyHeaders.length > 0) {
      const zeroFilledExternal = {};
      fyHeaders.forEach(fy => {
        zeroFilledExternal[fy] = "0"; // Keep as "0" for zero values, not "0.00"
      });
      setPipelineExternal(zeroFilledExternal);
    }
    
    // Only auto-fill if contract value is specifically "0" (not empty or undefined)
    // Commented out auto-fill for GoU to prevent auto-population
    // if (formData.contract_value_gou === "0" && fyHeaders.length > 0) {
    //   const zeroFilledGoU = {};
    //   fyHeaders.forEach(fy => {
    //     zeroFilledGoU[fy] = "0"; // Keep as "0" for zero values, not "0.00"
    //   });
    //   setPipelineGoU(zeroFilledGoU);
    // }
  }, [contractValueExternal, formData.contract_value_gou, fyHeaders]);


  // Distribute contract values across fiscal years
  // const distributeContractValues = () => {
  //   if (fyHeaders.length === 0) return;

  //   const contractValueExternalNum = Number(contractValueExternal || 0);
  //   const contractValueGoUNum = Number(formData.contract_value_gou || 0);
    
  //   // Distribute External value equally across fiscal years
  //   const externalPerYear = Math.floor(contractValueExternalNum / fyHeaders.length);
  //   const externalRemainder = contractValueExternalNum % fyHeaders.length;
    
  //   const newPipelineExternal = {};
  //   fyHeaders.forEach((fy, index) => {
  //     newPipelineExternal[fy] = (externalPerYear + (index < externalRemainder ? 1 : 0)).toString();
  //   });
  //   setPipelineExternal(newPipelineExternal);
    
  //   // Distribute GoU value equally across fiscal years
  //   const gouPerYear = Math.floor(contractValueGoUNum / fyHeaders.length);
  //   const gouRemainder = contractValueGoUNum % fyHeaders.length;
    
  //   const newPipelineGoU = {};
  //   fyHeaders.forEach((fy, index) => {
  //     newPipelineGoU[fy] = (gouPerYear + (index < gouRemainder ? 1 : 0)).toString();
  //   });
  //   setPipelineGoU(newPipelineGoU);
  // };

  // Distribute contract values when they change or fiscal years change
  // Disabled auto-refilling for fiscal year fields as per user requirement
  // useEffect(() => {
  //   if (fyHeaders.length > 0 && (contractValueExternal || formData.contract_value_gou)) {
  //     distributeContractValues();
  //   }
  // }, [contractValueExternal, formData.contract_value_gou, fyHeaders]);

  React.useEffect(() => {
    const startFy = formData.contract_start_date;
    const endFy = formData.contract_end_date;
    const startIdx = fiscalYears.indexOf(startFy);
    const endIdx = fiscalYears.indexOf(endFy);
    if (startIdx !== -1 && endIdx !== -1 && endIdx >= startIdx) {
      const hdrs = fiscalYears.slice(startIdx, endIdx + 1);
      setFyHeaders(hdrs);
      // Initialize missing keys
      setPipelineExternal((prev) => {
        const next = { ...prev };
        hdrs.forEach((fy) => { if (next[fy] === undefined) next[fy] = ""; });
        return next;
      });
      setPipelineGoU((prev) => {
        const next = { ...prev };
        hdrs.forEach((fy) => { if (next[fy] === undefined) next[fy] = ""; });
        return next;
      });
    } else {
      setFyHeaders([]);
    }
  }, [formData.contract_start_date, formData.contract_end_date, fiscalYears]);

  // Fiscal year generation for counterpart form
  React.useEffect(() => {
    const startFy = counterpartStartDate;
    const endFy = counterpartEndDate;
    const startIdx = fiscalYears.indexOf(startFy);
    const endIdx = fiscalYears.indexOf(endFy);
    if (startIdx !== -1 && endIdx !== -1 && endIdx >= startIdx) {
      const hdrs = fiscalYears.slice(startIdx, endIdx + 1);
      setCounterpartFyHeaders(hdrs);
      // Initialize missing keys for counterpart pipeline
      setCounterpartPipelineExternal((prev) => {
        const next = { ...prev };
        hdrs.forEach((fy) => { if (next[fy] === undefined) next[fy] = ""; });
        return next;
      });
      setCounterpartPipelineGoU((prev) => {
        const next = { ...prev };
        hdrs.forEach((fy) => { if (next[fy] === undefined) next[fy] = ""; });
        return next;
      });
    } else {
      setCounterpartFyHeaders([]);
    }
  }, [counterpartStartDate, counterpartEndDate, fiscalYears]);

  // Auto-calculate counterpart balance
  React.useEffect(() => {
    const value = Number(counterpartValue || 0);
    const disbursed = Number(counterpartDisbursed || 0);
    
    // Calculate total fiscal year pipeline values
    const externalTotal = Object.values(counterpartPipelineExternal).reduce((sum, val) => sum + Number(val || 0), 0);
    const gouTotal = Object.values(counterpartPipelineGoU).reduce((sum, val) => sum + Number(val || 0), 0);
    const pipelineTotal = externalTotal + gouTotal;
    
    // Balance = Counterpart Value - Counterpart Disbursed - Total Pipeline Values
    const balance = value - disbursed - pipelineTotal;
    setCounterpartBalance(balance.toString());
  }, [counterpartValue, counterpartDisbursed, counterpartPipelineExternal, counterpartPipelineGoU]);

  // Auto-calculate non-contractual counterpart balance
  React.useEffect(() => {
    const value = Number(nonContractualCounterpartValue || 0);
    const released = Number(nonContractualCounterpartReleased || 0);
    
    // Calculate total fiscal year pipeline values
    const externalTotal = Object.values(nonContractualPipelineExternal).reduce((sum, val) => sum + Number(val || 0), 0);
    const gouTotal = Object.values(nonContractualPipelineGoU).reduce((sum, val) => sum + Number(val || 0), 0);
    const pipelineTotal = externalTotal + gouTotal;
    
    // Balance = Counterpart Value - Counterpart Released - Total Pipeline Values
    const balance = value - released - pipelineTotal;
    setNonContractualCounterpartBalance(balance.toString());
  }, [nonContractualCounterpartValue, nonContractualCounterpartReleased, nonContractualPipelineExternal, nonContractualPipelineGoU]);

  // Fiscal year generation for non-contractual form
  React.useEffect(() => {
    const startFy = nonContractualStartDate;
    const endFy = nonContractualEndDate;
    const startIdx = fiscalYears.indexOf(startFy);
    const endIdx = fiscalYears.indexOf(endFy);
    if (startIdx !== -1 && endIdx !== -1 && endIdx >= startIdx) {
      const hdrs = fiscalYears.slice(startIdx, endIdx + 1);
      setNonContractualFyHeaders(hdrs);
      // Initialize missing keys for non-contractual pipeline
      setNonContractualPipelineGoU((prev) => {
        const next = { ...prev };
        hdrs.forEach((fy) => { if (next[fy] === undefined) next[fy] = ""; });
        return next;
      });
      setNonContractualPipelineExternal((prev) => {
        const next = { ...prev };
        hdrs.forEach((fy) => { if (next[fy] === undefined) next[fy] = ""; });
        return next;
      });
    } else {
      setNonContractualFyHeaders([]);
    }
  }, [nonContractualStartDate, nonContractualEndDate, fiscalYears]);

  // Fetch item codes when component mounts or project data changes
  React.useEffect(() => {
    if (projectData.code) {
      fetchItemCodes();
    }
  }, [projectData.code, fetchItemCodes]);

  // Initialize PBS data when component mounts or project changes
  React.useEffect(() => {
    if (projectData.code && !nonContractualDataFetched && !nonContractualLoading) {
      fetchNonContractualData();
    }
  }, [projectData.code, nonContractualDataFetched, nonContractualLoading, fetchNonContractualData]);

  // Initialize Contractual PBS data when component mounts or project changes
  React.useEffect(() => {
    if (projectData.code && !contractualDataFetched && !contractualLoading) {
      fetchContractualData();
    }
  }, [projectData.code, contractualDataFetched, contractualLoading, fetchContractualData]);

  // Function to determine funding source based on PBS data for specific Item_Code
  const determineFundingSourceFromPBS = useCallback(() => {
    if (!contractualItemCode) {
      console.log('❌ No item code available:', { contractualItemCode });
      return null;
    }
    
    // Use the fiscal year-specific selected option if available, otherwise fallback to itemCodes
    let selectedItem = contractualSelectedOption;
    if (!selectedItem) {
      selectedItem = itemCodes.find(item => item.code === contractualItemCode);
    }
    
    console.log('🔍 Using PBS values for source of funding:', { 
      itemCode: contractualItemCode,
      selectedItemFound: !!selectedItem,
      fiscalYearSpecific: !!contractualSelectedOption,
      selectedItem: selectedItem ? {
        code: selectedItem.code,
        description: selectedItem.description,
        fiscalYear: selectedItem.fiscalYear,
        gouValue: selectedItem.gouValue,
        extFinValue: selectedItem.extFinValue
      } : null
    });
    
    if (!selectedItem) {
      console.log('❌ Item not found:', contractualItemCode);
      return null;
    }
    
    const gouValue = selectedItem.gouValue || 0;
    const extFinValue = selectedItem.extFinValue || 0;
    
    console.log('💰 PBS Values for source of funding:', { gouValue, extFinValue });
    
    if (gouValue > 0 && extFinValue > 0) {
      console.log('✅ Selected Both funding source for Item_Code:', contractualItemCode);
      return "Both";
    } else if (gouValue > 0) {
      console.log('✅ Selected GoU funding source for Item_Code:', contractualItemCode);
      return "GoU";
    } else if (extFinValue > 0) {
      console.log('✅ Selected External funding source for Item_Code:', contractualItemCode);
      return "External";
    }
    
    console.log('❌ No non-zero values found for Item_Code:', contractualItemCode);
    return null;
  }, [contractualItemCode, contractualSelectedOption, itemCodes]);

  // Function to get PBS values for contract value fields based on Item_Code
  const getPBSContractValues = useCallback(() => {
    if (!contractualItemCode) {
      return { gouValue: 0, extFinValue: 0 };
    }
    
    // Use the fiscal year-specific selected option if available, otherwise fallback to itemCodes
    let selectedItem = contractualSelectedOption;
    if (!selectedItem) {
      selectedItem = itemCodes.find(item => item.code === contractualItemCode);
    }
    
    if (!selectedItem) {
      return { gouValue: 0, extFinValue: 0 };
    }
    
    const gouValue = selectedItem.gouValue || 0;
    const extFinValue = selectedItem.extFinValue || 0;
    
    return { gouValue, extFinValue };
  }, [contractualItemCode, contractualSelectedOption, itemCodes]);

  // Auto-populate funding source and contract values when PBS data is available
  React.useEffect(() => {
    console.log('🔄 Auto-population useEffect triggered:', {
      contractualSourceOfFunding,
      itemCodesLength: itemCodes.length,
      projectCode: projectData.code,
      contractualItemCode
    });
    
    if (itemCodes.length > 0 && contractualItemCode) {
      const fundingSource = determineFundingSourceFromPBS();
      console.log('🔍 Auto-population Debug:', {
        contractualSourceOfFunding,
        fundingSource,
        itemCodesLength: itemCodes.length,
        projectCode: projectData.code,
        contractualItemCode
      });
      
      if (fundingSource && !contractualSourceOfFunding) {
        console.log('⏰ Auto-selecting funding source:', fundingSource);
        setContractualSourceOfFunding(fundingSource);
      }
    }
  }, [contractualSourceOfFunding, determineFundingSourceFromPBS, getPBSContractValues, itemCodes.length, projectData.code, contractualItemCode]);

  // Separate useEffect to auto-populate contract values when funding source changes
  React.useEffect(() => {
    if (contractualSourceOfFunding && itemCodes.length > 0 && contractualItemCode) {
      console.log('🔄 Funding source changed, auto-populating contract values:', contractualSourceOfFunding);
      
      const { gouValue, extFinValue } = getPBSContractValues();
      console.log('💰 PBS Values for contract population:', { gouValue, extFinValue, fundingSource: contractualSourceOfFunding });
      
      if (contractualSourceOfFunding === "GoU" && gouValue > 0) {
        console.log('📝 Auto-populating GoU contract value:', gouValue.toString());
        const formattedValue = formatNumbers(gouValue.toString());
        setFormData(prev => {
          console.log('📝 Before setting GoU value:', prev.contract_value);
            const updated = { ...prev, contract_value: formattedValue, costing: formattedValue };
          console.log('📝 After setting GoU value:', updated.contract_value);
          return updated;
        });
      } else if (contractualSourceOfFunding === "External" && extFinValue > 0) {
        console.log('📝 Auto-populating External contract value:', extFinValue.toString());
        const formattedValue = formatNumbers(extFinValue.toString());
        setFormData(prev => {
          console.log('📝 Before setting External value:', prev.contract_value_external);
            const updated = { ...prev, contract_value_external: formattedValue, costing: formattedValue };
          console.log('📝 After setting External value:', updated.contract_value_external);
          return updated;
        });
      } else if (contractualSourceOfFunding === "Both") {
        // For "Both", don't auto-populate costing in contractual tab
        // Values will be populated in contractual obligation tab
        if (gouValue > 0) {
          console.log('📝 Auto-populating Both GoU contract value:', gouValue.toString());
          const formattedValue = formatNumbers(gouValue.toString());
          setFormData(prev => {
            console.log('📝 Before setting Both GoU value:', prev.contract_value_gou);
            const updated = { ...prev, contract_value_gou: formattedValue };
            console.log('📝 After setting Both GoU value:', updated.contract_value_gou);
            return updated;
          });
        }
        if (extFinValue > 0) {
          console.log('📝 Auto-populating Both External contract value:', extFinValue.toString());
          const formattedValue = formatNumbers(extFinValue.toString());
          setFormData(prev => {
            console.log('📝 Before setting Both External value:', prev.contract_value_external);
            const updated = { ...prev, contract_value_external: formattedValue };
            console.log('📝 After setting Both External value:', updated.contract_value_external);
            return updated;
          });
        }
      }
    }
  }, [contractualSourceOfFunding, getPBSContractValues, itemCodes.length, contractualItemCode]);

  // Reset and repopulate fields when Item_Code changes
  React.useEffect(() => {
    console.log('🔄 Item_Code useEffect triggered:', {
      contractualItemCode,
      itemCodesLength: itemCodes.length,
      projectCode: projectData.code
    });
    
    if (contractualItemCode && itemCodes.length > 0) {
      console.log('🔄 Item_Code changed, resetting and repopulating fields:', contractualItemCode);
      
      // Reset the funding source and contract values
      setContractualSourceOfFunding("");
      setFormData(prev => ({ 
        ...prev, 
        contract_value: "",
        contract_value_external: ""
      }));
      
      // Small delay to ensure reset is complete, then auto-populate
      setTimeout(() => {
        console.log('⏰ Starting auto-population after reset...');
        const fundingSource = determineFundingSourceFromPBS();
        console.log('🔍 Determined funding source:', fundingSource);
        
        if (fundingSource) {
          console.log('⏰ Auto-selecting funding source for Item_Code:', fundingSource);
          setContractualSourceOfFunding(fundingSource);
          
          // Auto-populate contract values based on PBS data
          const { gouValue, extFinValue } = getPBSContractValues();
          console.log('💰 PBS Values for Item_Code:', { gouValue, extFinValue, fundingSource });
          
          if (fundingSource === "GoU" && gouValue > 0) {
            console.log('📝 Setting GoU contract value for Item_Code:', gouValue.toString());
            const formattedValue = formatNumbers(gouValue.toString());
            setFormData(prev => ({ 
              ...prev, 
              contract_value: formattedValue,
              costing: formattedValue // Also set costing field for GoU Budget
            }));
          } else if (fundingSource === "External" && extFinValue > 0) {
            console.log('📝 Setting External contract value for Item_Code:', extFinValue.toString());
            const formattedValue = formatNumbers(extFinValue.toString());
            setFormData(prev => ({ ...prev, contract_value_external: formattedValue }));
          } else if (fundingSource === "Both") {
            if (gouValue > 0) {
              console.log('📝 Setting Both GoU contract value for Item_Code:', gouValue.toString());
              const formattedValue = formatNumbers(gouValue.toString());
              setFormData(prev => ({ 
                ...prev, 
                contract_value: formattedValue,
                costing: formattedValue // Also set costing field for GoU Budget
              }));
            }
            if (extFinValue > 0) {
              console.log('📝 Setting Both External contract value for Item_Code:', extFinValue.toString());
              const formattedValue = formatNumbers(extFinValue.toString());
              setFormData(prev => ({ ...prev, contract_value_external: formattedValue }));
            }
          }
        } else {
          console.log('❌ No funding source determined for Item_Code:', contractualItemCode);
        }
      }, 100);
    } else {
      console.log('❌ Item_Code useEffect conditions not met:', {
        hasItemCode: !!contractualItemCode,
        hasItemCodes: itemCodes.length > 0
      });
    }
  }, [contractualItemCode, itemCodes.length, determineFundingSourceFromPBS, getPBSContractValues]);

  const handlePipelineChange = (source, fy) => (e) => {
    const raw = e.target.value || "";
    if (/[^0-9,]/.test(raw)) {
      openValidation(source === 'external' ? 'pipeline_external' : 'pipeline_gou', 'Amounts must contain digits only');
      return;
    }
    
    const digits = raw.replace(/\D/g, "");
    
    // Validate zero values - only allow single "0", not "00" or "000"
    if (digits !== "" && !validateZeroValue(digits)) {
      openValidation(source === 'external' ? 'pipeline_external' : 'pipeline_gou', 'Zero values must be entered as "0" only, not "00" or "000"');
      return;
    }
    
    if (source === 'external') {
      // Clean the contract value by removing commas before converting to number
      const cleanContractValueExternal = typeof formData.contract_value_external === 'string' 
        ? formData.contract_value_external.replace(/,/g, '') 
        : formData.contract_value_external || '0';
      const contractValueExternalNum = Number(cleanContractValueExternal) || 0;
      
      // If contract value is 0, only allow empty string or "0"
      if (contractValueExternalNum === 0) {
        if (digits !== "" && digits !== "0") {
          // Clear the field and show validation dialog
          setPipelineExternal((prev) => ({ ...prev, [fy]: "" }));
          setContractValueValidationDialog({
            open: true,
            message: "Cannot enter fiscal year values greater than 0 when Contract Value External (UGX) is 0. Please enter a contract value first or enter 0.",
            fundingSource: "External"
          });
          return;
        }
        // Allow empty string or "0" when contract value is 0
        setPipelineExternal((prev) => ({ ...prev, [fy]: digits }));
        if (errors[`external_${fy}`]) {
          setErrors((prev) => ({ ...prev, [`external_${fy}`]: "" }));
        }
        return;
      }
      
      // Calculate Balance on Contract Value External for validation (same as calculateExternalBalance)
      const cleanApprovedPaymentsExternal = typeof formData.approved_payments === 'string' 
        ? formData.approved_payments.replace(/,/g, '') 
        : formData.approved_payments || '0';
      const approvedPaymentsExternal = Number(cleanApprovedPaymentsExternal) || 0;
      const fiscalYearTotal = Object.values(pipelineExternal).reduce((sum, val) => {
        const cleanVal = typeof val === 'string' ? val.replace(/,/g, '') : val;
        const numVal = Number(cleanVal) || 0;
        // Cap individual values at 1 billion to prevent extreme calculations (same as balance calculation)
        return sum + Math.min(numVal, 1000000000);
      }, 0);
      const balanceExternal = contractValueExternalNum - approvedPaymentsExternal - fiscalYearTotal;
      
      // If balance > 0, check individual and cumulative limits against Balance on Contract Value
      if (balanceExternal > 0 && digits !== "" && digits !== "0") {
        const enteredValue = Number(digits);
        if (enteredValue > balanceExternal) {
          // Clear the field and show exceed dialog
          setPipelineExternal((prev) => ({ ...prev, [fy]: "" }));
          setContractValueExceedDialog({
            open: true,
            message: `❌ External ${fy} fiscal year value (${enteredValue.toLocaleString()}) exceeds available Balance on Costing External (${balanceExternal.toLocaleString()}). Field has been cleared. Please enter a value within the available balance.`,
            fundingSource: "External"
          });
          return;
        }
        
        // Check cumulative total against Balance on Contract Value
        const currentTotal = Object.values(pipelineExternal).reduce((sum, val) => {
          const cleanVal = typeof val === 'string' ? val.replace(/,/g, '') : val;
          const numVal = Number(cleanVal) || 0;
          // Cap individual values at 1 billion to prevent extreme calculations (same as balance calculation)
          return sum + Math.min(numVal, 1000000000);
        }, 0);
        const newTotal = currentTotal - (typeof pipelineExternal[fy] === 'string' ? Number(pipelineExternal[fy].replace(/,/g, '')) || 0 : Number(pipelineExternal[fy]) || 0) + enteredValue;
        const newBalanceExternal = contractValueExternalNum - approvedPaymentsExternal - newTotal;
        
        if (newBalanceExternal < 0) {
          // Clear the field and show exceed dialog
          setPipelineExternal((prev) => ({ ...prev, [fy]: "" }));
          setContractValueExceedDialog({
            open: true,
            message: `❌ External ${fy} fiscal year value causes total to exceed Balance on Costing External. Total would be ${newTotal.toLocaleString()}, but only ${balanceExternal.toLocaleString()} is available. Field has been cleared. Please reduce the amount.`,
            fundingSource: "External"
          });
          return;
        }
      }
      
      // Allow the value to be set (including "0" when contract value > 0)
      const formattedValue = digits === "" ? "" : formatNumbers(digits);
      setPipelineExternal((prev) => ({ ...prev, [fy]: formattedValue }));
      
      // Check if balance is exhausted after this update
      const updatedPipelineExternal = { ...pipelineExternal, [fy]: formattedValue };
      const updatedFiscalYearTotal = Object.values(updatedPipelineExternal).reduce((sum, val) => {
        const cleanVal = typeof val === 'string' ? val.replace(/,/g, '') : val;
        const numVal = Number(cleanVal) || 0;
        // Cap individual values at 1 billion to prevent extreme calculations (same as balance calculation)
        return sum + Math.min(numVal, 1000000000);
      }, 0);
      const contractValueExtNum = Number(formData.contract_value_external || 0);
      const approvedPaymentExt = Number(formData.approved_payments || 0);
      const remainingBalance = contractValueExtNum - approvedPaymentExt - updatedFiscalYearTotal;
      
      // Enhanced notification when balance limit is reached
      if (remainingBalance <= 0 && updatedFiscalYearTotal > 0) {
        // Notify user that balance is exhausted
        setContractValueExceedDialog({
          open: true,
          message: `⚠️ External Balance on Costing limit reached! Remaining balance: ${remainingBalance.toLocaleString()} UGX. You have reached the maximum available balance for External funding.`,
          fundingSource: "External"
        });
      } else if (remainingBalance > 0 && remainingBalance < (contractValueExtNum * 0.1)) {
        // Notify when balance is getting low (less than 10% remaining)
        setContractValueExceedDialog({
          open: true,
          message: `⚠️ External Balance on Costing is running low! Remaining balance: ${remainingBalance.toLocaleString()} UGX (${((remainingBalance / contractValueExtNum) * 100).toFixed(1)}% of total).`,
          fundingSource: "External"
        });
      }
      
      // Clear error when user starts typing
      if (errors[`external_${fy}`]) {
        setErrors((prev) => ({ ...prev, [`external_${fy}`]: "" }));
      }
    } else {
      // Clean the contract value by removing commas before converting to number
      const cleanContractValueGoU = typeof formData.contract_value_gou === 'string' 
        ? formData.contract_value_gou.replace(/,/g, '') 
        : formData.contract_value_gou || '0';
      const contractValueGoUNum = Number(cleanContractValueGoU) || 0;
      
      // If contract value is 0, only allow empty string or "0"
      if (contractValueGoUNum === 0) {
        if (digits !== "" && digits !== "0") {
          // Clear the field and show validation dialog
          setPipelineGoU((prev) => ({ ...prev, [fy]: "" }));
          setContractValueValidationDialog({
            open: true,
            message: "Cannot enter fiscal year values greater than 0 when Contract Value GOU (UGX) is 0. Please enter a contract value first or enter 0.",
            fundingSource: "GoU"
          });
          return;
        }
        // Allow empty string or "0" when contract value is 0
        setPipelineGoU((prev) => ({ ...prev, [fy]: digits }));
        if (errors[`gou_${fy}`]) {
          setErrors((prev) => ({ ...prev, [`gou_${fy}`]: "" }));
        }
        return;
      }
      
      // Calculate Balance on Contract Value GoU for validation (same as calculateGoUBalance)
      const cleanApprovedPaymentsGoU = typeof formData.approved_payments_gou === 'string' 
        ? formData.approved_payments_gou.replace(/,/g, '') 
        : formData.approved_payments_gou || '0';
      const approvedPaymentsGoU = Number(cleanApprovedPaymentsGoU) || 0;
      const fiscalYearTotalGoU = Object.values(pipelineGoU).reduce((sum, val) => {
        const cleanVal = typeof val === 'string' ? val.replace(/,/g, '') : val;
        const numVal = Number(cleanVal) || 0;
        // Cap individual values at 1 billion to prevent extreme calculations (same as balance calculation)
        return sum + Math.min(numVal, 1000000000);
      }, 0);
      const balanceGoU = contractValueGoUNum - approvedPaymentsGoU - fiscalYearTotalGoU;
      
      // If balance > 0, check individual and cumulative limits against Balance on Contract Value
      console.log('🔍 GoU validation check:', { balanceGoU, digits, fy, enteredValue: Number(digits) });
      if (balanceGoU > 0 && digits !== "" && digits !== "0") {
        const enteredValue = Number(digits);
        console.log('🔍 GoU individual validation:', { enteredValue, balanceGoU, exceeds: enteredValue > balanceGoU });
        if (enteredValue > balanceGoU) {
          console.log('🚨 GoU limit exceeded, showing dialog');
          // Clear the field and show exceed dialog
          setPipelineGoU((prev) => ({ ...prev, [fy]: "" }));
          setContractValueExceedDialog({
            open: true,
            message: `❌ GoU ${fy} fiscal year value (${enteredValue.toLocaleString()}) exceeds available Balance on Costing GoU (${balanceGoU.toLocaleString()}). Field has been cleared. Please enter a value within the available balance.`,
            fundingSource: "GoU"
          });
          return;
        }
        
        // Check cumulative total against Balance on Contract Value
        const currentTotal = Object.values(pipelineGoU).reduce((sum, val) => {
          const cleanVal = typeof val === 'string' ? val.replace(/,/g, '') : val;
          const numVal = Number(cleanVal) || 0;
          // Cap individual values at 1 billion to prevent extreme calculations (same as balance calculation)
          return sum + Math.min(numVal, 1000000000);
        }, 0);
        const newTotal = currentTotal - (typeof pipelineGoU[fy] === 'string' ? Number(pipelineGoU[fy].replace(/,/g, '')) || 0 : Number(pipelineGoU[fy]) || 0) + enteredValue;
        const newBalanceGoU = contractValueGoUNum - approvedPaymentsGoU - newTotal;
        
        console.log('🔍 GoU cumulative validation:', { currentTotal, newTotal, newBalanceGoU, balanceGoU, exceeds: newBalanceGoU < 0 });
        if (newBalanceGoU < 0) {
          console.log('🚨 GoU cumulative limit exceeded, showing dialog');
          // Clear the field and show exceed dialog
          setPipelineGoU((prev) => ({ ...prev, [fy]: "" }));
          setContractValueExceedDialog({
            open: true,
            message: `❌ GoU ${fy} fiscal year value causes total to exceed Balance on Costing GoU. Total would be ${newTotal.toLocaleString()}, but only ${balanceGoU.toLocaleString()} is available. Field has been cleared. Please reduce the amount.`,
            fundingSource: "GoU"
          });
          return;
        }
      }
      
      // Allow the value to be set (including "0" when contract value > 0)
      const formattedValue = digits === "" ? "" : formatNumbers(digits);
      setPipelineGoU((prev) => ({ ...prev, [fy]: formattedValue }));
      
      // Check if balance is exhausted after this update
      const updatedPipelineGoU = { ...pipelineGoU, [fy]: formattedValue };
      const updatedFiscalYearTotalGoU = Object.values(updatedPipelineGoU).reduce((sum, val) => {
        const cleanVal = typeof val === 'string' ? val.replace(/,/g, '') : val;
        const numVal = Number(cleanVal) || 0;
        // Cap individual values at 1 billion to prevent extreme calculations (same as balance calculation)
        return sum + Math.min(numVal, 1000000000);
      }, 0);
      const contractValueGoUNumBal = Number(formData.contract_value_gou || 0);
      const approvedPaymentsGoUBal = Number(formData.approved_payments_gou || 0);
      const remainingBalanceGoU = contractValueGoUNumBal - approvedPaymentsGoUBal - updatedFiscalYearTotalGoU;
      
      // Enhanced notification when balance limit is reached
      console.log('🔍 GoU post-update balance check:', { remainingBalanceGoU, updatedFiscalYearTotalGoU, contractValueGoUNumBal });
      if (remainingBalanceGoU <= 0 && updatedFiscalYearTotalGoU > 0) {
        console.log('🚨 GoU balance exhausted, showing dialog');
        // Notify user that balance is exhausted
        setContractValueExceedDialog({
          open: true,
          message: `⚠️ GoU Balance on Costing limit reached! Remaining balance: ${remainingBalanceGoU.toLocaleString()} UGX. You have reached the maximum available balance for GoU funding.`,
          fundingSource: "GoU"
        });
      } else if (remainingBalanceGoU > 0 && remainingBalanceGoU < (contractValueGoUNumBal * 0.1)) {
        console.log('⚠️ GoU balance running low, showing dialog');
        // Notify when balance is getting low (less than 10% remaining)
        setContractValueExceedDialog({
          open: true,
          message: `⚠️ GoU Balance on Costing is running low! Remaining balance: ${remainingBalanceGoU.toLocaleString()} UGX (${((remainingBalanceGoU / contractValueGoUNumBal) * 100).toFixed(1)}% of total).`,
          fundingSource: "GoU"
        });
      }
      
      // Clear error when user starts typing
      if (errors[`gou_${fy}`]) {
        setErrors((prev) => ({ ...prev, [`gou_${fy}`]: "" }));
      }
    }
  };

  const handleCounterpartPipelineChange = (source, fy) => (e) => {
    const raw = e.target.value || "";
    if (/[^0-9,]/.test(raw)) {
      openValidation(source === 'external' ? 'counterpart_pipeline_external' : 'counterpart_pipeline_gou', 'Amounts must contain digits only');
      return;
    }
    
    const digits = raw.replace(/\D/g, "");
    
    // Validate zero values - only allow single "0", not "00" or "000"
    if (digits !== "" && !validateZeroValue(digits)) {
      openValidation(source === 'external' ? 'counterpart_pipeline_external' : 'counterpart_pipeline_gou', 'Zero values must be entered as "0" only, not "00" or "000"');
      return;
    }
    
    // Calculate current counterpart balance (Value - Disbursed - Other Pipeline Values)
    const value = Number(counterpartValue || 0);
    const disbursed = Number(counterpartDisbursed || 0);
    const externalTotal = Object.values(counterpartPipelineExternal).reduce((sum, val) => sum + Number(val || 0), 0);
    const gouTotal = Object.values(counterpartPipelineGoU).reduce((sum, val) => sum + Number(val || 0), 0);
    const otherPipelineTotal = externalTotal + gouTotal - Number((source === 'external' ? counterpartPipelineExternal[fy] : counterpartPipelineGoU[fy]) || 0);
    const availableBalance = value - disbursed - otherPipelineTotal;
    
    // If user is entering a value, check if it exceeds available balance
    if (digits !== "" && digits !== "0") {
      const enteredValue = Number(digits);
      
      // Check if the new total would exceed the total counterpart balance
      const newTotal = otherPipelineTotal + enteredValue;
      const totalCounterpartBalance = value - disbursed;
      
      if (newTotal > totalCounterpartBalance) {
        // Clear the field and show exceed dialog
        if (source === 'external') {
          setCounterpartPipelineExternal((prev) => ({ ...prev, [fy]: "" }));
        } else {
          setCounterpartPipelineGoU((prev) => ({ ...prev, [fy]: "" }));
        }
        setCounterpartBalanceExceedDialog({
          open: true,
          message: `Total fiscal year values (${newTotal.toLocaleString()}) cannot exceed Counter-part Balance (${totalCounterpartBalance.toLocaleString()}). Please reduce the total amount.`,
          fundingSource: source === 'external' ? 'External' : 'GoU'
        });
        return;
      }
      
      // Check if this single field entry exactly matches the remaining balance
      if (enteredValue === availableBalance) {
        // Allow the value but show notification that funds are exhausted
        const formattedValue = formatNumbers(digits);
        if (source === 'external') {
          setCounterpartPipelineExternal((prev) => ({ ...prev, [fy]: formattedValue }));
        } else {
          setCounterpartPipelineGoU((prev) => ({ ...prev, [fy]: formattedValue }));
        }
        
        // Show notification that funds are exhausted
        setTimeout(() => {
          setCounterpartBalanceExceedDialog({
            open: true,
            message: `Funds exhausted! This fiscal year entry (${enteredValue.toLocaleString()}) exactly matches the remaining balance (${availableBalance.toLocaleString()}). No funds remaining.`,
            fundingSource: source === 'external' ? 'External' : 'GoU'
          });
        }, 100);
        return;
      }
      
      // Check if this would make the balance reach exactly 0
      if (newTotal === totalCounterpartBalance) {
        // Allow the value but show notification that balance is fully utilized
        const formattedValue = formatNumbers(digits);
        if (source === 'external') {
          setCounterpartPipelineExternal((prev) => ({ ...prev, [fy]: formattedValue }));
        } else {
          setCounterpartPipelineGoU((prev) => ({ ...prev, [fy]: formattedValue }));
        }
        
        // Show notification that balance is fully utilized
        setTimeout(() => {
          setCounterpartBalanceExceedDialog({
            open: true,
            message: `Counter-part Balance has been fully utilized (${totalCounterpartBalance.toLocaleString()}). No remaining balance available.`,
            fundingSource: source === 'external' ? 'External' : 'GoU'
          });
        }, 100);
        return;
      }
    }
    
    // Allow the value to be set (including "0" when balance > 0)
    const formattedValue = digits === "" ? "" : formatNumbers(digits);
    if (source === 'external') {
      setCounterpartPipelineExternal((prev) => ({ ...prev, [fy]: formattedValue }));
    } else {
      setCounterpartPipelineGoU((prev) => ({ ...prev, [fy]: formattedValue }));
    }
  };

  return (
    <div>
      <div style={{ paddingTop: '80px' }}>
        {activeTab === "contractual" ? (
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Contract Management</h3>
              {!showContractForm && (
                <ButtonMui onClick={handleAddContract} variant="contained" startIcon={<AddIcon />} sx={buttonStyles}>
                  Add Contract
                </ButtonMui>
              )}
            </div>
            {showContractForm ? (
            <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>
            <div className="text-sm" style={{ position: 'relative', maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
              {/* Financial Year Selection Dropdown */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 min-w-fit">
                    Current Reporting Financial Year:
                  </label>
                  <Select
                    value={selectedFinancialYear}
                    onChange={(e) => setSelectedFinancialYear(e.target.value)}
                    size="small"
                    disabled={true}
                    sx={{ 
                      minWidth: 150,
                      backgroundColor: '#f9fafb',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#d1d5db',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#d1d5db',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#d1d5db',
                      },
                      '& .MuiSelect-select': {
                        color: '#374151',
                        fontWeight: '500'
                      }
                    }}
                  >
                    {currentReportingFinancialYearOptions.map((fy) => (
                      <MenuItem key={fy} value={fy}>{fy}</MenuItem>
                    ))}
                  </Select>
                  <div className="flex items-center gap-2 ml-8">
                    <label className="text-sm font-medium text-gray-700 min-w-fit">
                      Project Duration:
                    </label>
                    <div className="flex items-center gap-2">
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={projectPeriodStart}
                          onChange={(e) => {
                            const newStart = e.target.value;
                            setProjectPeriodStart(newStart);
                            // Validate the selection but don't auto-populate
                            const validation = validateProjectPeriod(newStart, projectPeriodEnd);
                            if (!validation.isValid) {
                              setProjectPeriodError(validation.message);
                            } else {
                              setProjectPeriodError('');
                              // Only clear the projectPeriod error if BOTH start and end are selected
                              if (errors.projectPeriod && newStart && projectPeriodEnd && 
                                  newStart !== '' && projectPeriodEnd !== '' &&
                                  newStart !== 'Select...' && projectPeriodEnd !== 'Select...') {
                                setErrors((prev) => ({ ...prev, projectPeriod: "" }));
                              }
                            }
                          }}
                          displayEmpty
                          renderValue={(selected) => {
                            if (!selected) {
                              return <span style={{ color: '#999' }}>Select...</span>;
                            }
                            return selected;
                          }}
                          sx={{
                            fontSize: '0.875rem',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#d1d5db',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#d1d5db',
                            },
                            '& .MuiSelect-select': {
                              color: '#374151',
                              fontWeight: '500'
                            }
                          }}
                        >
                          {fiscalYearOptions.map((fy) => (
                            <MenuItem key={fy} value={fy}>{fy}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <span className="text-sm font-medium text-gray-700">To</span>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={projectPeriodEnd}
                          onChange={(e) => {
                            const newEnd = e.target.value;
                            setProjectPeriodEnd(newEnd);
                            // Validate the selection but don't auto-populate
                            const validation = validateProjectPeriod(projectPeriodStart, newEnd);
                            if (!validation.isValid) {
                              setProjectPeriodError(validation.message);
                            } else {
                              setProjectPeriodError('');
                              // Only clear the projectPeriod error if BOTH start and end are selected
                              if (errors.projectPeriod && projectPeriodStart && newEnd && 
                                  projectPeriodStart !== '' && newEnd !== '' &&
                                  projectPeriodStart !== 'Select...' && newEnd !== 'Select...') {
                                setErrors((prev) => ({ ...prev, projectPeriod: "" }));
                              }
                            }
                          }}
                          disabled={!projectPeriodStart || projectPeriodStart === '' || projectPeriodStart === 'Select...'}
                          displayEmpty
                          renderValue={(selected) => {
                            if (!selected) {
                              return <span style={{ color: '#999' }}>Select...</span>;
                            }
                            return selected;
                          }}
                          sx={{
                            fontSize: '0.875rem',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#d1d5db',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#d1d5db',
                            },
                            '& .MuiSelect-select': {
                              color: '#374151',
                              fontWeight: '500'
                            }
                          }}
                        >
                          {endDateOptions.map((fy) => (
                            <MenuItem key={fy} value={fy}>{fy}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      </div>
                    {projectPeriodError && (
                      <div className="text-red-500 text-xs mt-1 ml-2">
                        {projectPeriodError}
                  </div>
                    )}
                    {errors.projectPeriod && (
                      <div className="text-red-500 text-xs mt-1 ml-2">
                        {errors.projectPeriod}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4">
                <TableContainer
                  className="shadow-sm"
                  component={Paper}
                  sx={{ boxShadow: "none" }}
                >
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ 
                          padding: 2, 
                          width: "25%", 
                          fontWeight: 'bold', 
                          fontSize: '0.875rem',
                          color: 'black',
                          backgroundColor: '#f8f9fa',
                          borderBottom: '2px solid #e0e0e0'
                        }}>Procurement Reference Number</TableCell>
                        <TableCell sx={{ 
                          padding: 2, 
                          width: "25%", 
                          fontWeight: 'bold', 
                          fontSize: '0.875rem',
                          color: 'black',
                          backgroundColor: '#f8f9fa',
                          borderBottom: '2px solid #e0e0e0'
                        }}>Contract Name</TableCell>
                        <TableCell sx={{ 
                          padding: 2, 
                          width: "30%", 
                          fontWeight: 'bold', 
                          fontSize: '0.875rem',
                          color: 'black',
                          backgroundColor: '#f8f9fa',
                          borderBottom: '2px solid #e0e0e0'
                        }}>Description of Contract</TableCell>
                        <TableCell sx={{ 
                          padding: 2, 
                          width: "20%", 
                          fontWeight: 'bold', 
                          fontSize: '0.875rem',
                          color: 'black',
                          backgroundColor: '#f8f9fa',
                          borderBottom: '2px solid #e0e0e0'
                        }}>Name of Contractor</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        {/* Contract Reference Number */}
                        <TableCell sx={{ padding: 1, width: "25%" }}>
                          <TextField
                            name="contract_reference_number"
                            value={formData.contract_reference_number}
                            onChange={handleContractRefChange}
                            onBlur={handleContractRefBlur}
                            error={Boolean(errors.contract_reference_number)}
                            helperText={errors.contract_reference_number || ""}
                            placeholder="e.g. PPDA/CONS/2023-2024/00004"
                            required
                            sx={{ 
                              '& input': { fontFamily: 'inherit' }, 
                              '& input::placeholder': { fontFamily: 'inherit', fontStyle: 'italic', opacity: 0.7, fontSize: '0.1rem' },
                              '& .MuiOutlinedInput-root.Mui-error': {
                                '& fieldset': {
                                  borderColor: 'red !important',
                                },
                              }
                            }}
                            size="small"
                            fullWidth
                            multiline
                            rows={3}
                            disabled={isSubmitting}
                          />
                        </TableCell>
                        {/* Contract Name */}
                        <TableCell sx={{ padding: 1, width: "25%", overflow: 'visible' }}>
                          <TextField
                            name="contract_name"
                            value={formData.contract_name}
                            onChange={handleChange}
                            error={Boolean(errors.contract_name)}
                            helperText={errors.contract_name || ""}
                            placeholder="e.g Civil Works for upgrading of Kigumba – Bulima Road"
                            required
                            size="small"
                            fullWidth
                            multiline
                            rows={3}
                            disabled={isSubmitting}
                            sx={{ 
                              '& input': { fontFamily: 'inherit' }, 
                              '& input::placeholder': { fontFamily: 'inherit', fontStyle: 'italic', opacity: 0.7, fontSize: '0.8rem' },
                              '& .MuiOutlinedInput-root.Mui-error': {
                                '& fieldset': {
                                  borderColor: 'red !important',
                                },
                              }
                            }}
                          />
                        </TableCell>
                        {/* Description of Contract */}
                        <TableCell sx={{ padding: 1, width: "30%" }}>
                          <TextField
                            name="description_of_procurement"
                            value={formData.description_of_procurement || ""}
                            onChange={handleChange}
                            error={Boolean(errors.description_of_procurement)}
                            helperText={errors.description_of_procurement || ""}
                            placeholder="e.g Consultancy Services for Design Review and Supervision of the upgrading of Bulima - Kabwoya Road"
                            required
                            fullWidth
                            variant="outlined"
                            size="small"
                            multiline
                            rows={4}
                            disabled={isSubmitting}
                            sx={{
                              '& .MuiInputBase-input': {
                                fontSize: '0.875rem',
                                lineHeight: 1.4,
                              },
                              '& .MuiOutlinedInput-root.Mui-error': {
                                '& fieldset': {
                                  borderColor: 'red !important',
                                },
                              }
                            }}
                          />
                        </TableCell>
                        {/* Name of Contractor */}
                        <TableCell sx={{ padding: 1, width: "20%" }}>
                          <TextField
                            name="contractor_name"
                            value={formData.contractor_name}
                            onChange={handleChange}
                            error={Boolean(errors.contractor_name)}
                            helperText={errors.contractor_name || ""}
                            placeholder="e.g China Railway Engineering Group Co. Ltd"
                            required
                            fullWidth
                            variant="outlined"
                            size="small"
                            multiline
                            rows={3}
                            disabled={isSubmitting}
                            sx={{ 
                              '& .MuiOutlinedInput-input': { fontFamily: 'inherit' }, 
                              '& .MuiOutlinedInput-input::placeholder': { fontFamily: 'inherit', fontStyle: 'italic', opacity: 0.7, fontSize: '0.8rem' },
                              '& .MuiOutlinedInput-root.Mui-error': {
                                '& fieldset': {
                                  borderColor: 'red !important',
                                },
                              }
                            }}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        {/* Contract Value - Always visible */}
                        <TableCell sx={{ padding: 1, width: "20%" }}>
                          <label style={{ 
                            fontSize: '0.875rem', 
                            fontWeight: 'bold', 
                            color: 'black', 
                            marginBottom: '4px', 
                            display: 'block',
                            backgroundColor: '#f8f9fa',
                            padding: '8px',
                            borderRadius: '4px',
                            borderBottom: '2px solid #e0e0e0'
                          }}>
                            Contract Value
                          </label>
                          <TextField
                            name="contract_value_main"
                            inputMode="numeric"
                            value={formatWithCommas(formData.contract_value_main)}
                            onChange={handleCurrencyChange("contract_value_main")}
                            error={Boolean(errors.contract_value_main)}
                            helperText={errors.contract_value_main || ""}
                            placeholder="Enter contract value"
                            size="small"
                            fullWidth
                            disabled={isSubmitting}
                            sx={{
                              '& .MuiOutlinedInput-root.Mui-error': {
                                '& fieldset': {
                                  borderColor: 'red !important',
                                },
                              }
                            }}
                          />
                        </TableCell>
                        {/* Category of Procurement */}
                        <TableCell sx={{ padding: 1, width: contractualSourceOfFunding === "Both" ? "25%" : "20%" }}>
                          <label style={{ 
                            fontSize: '0.875rem', 
                            fontWeight: 'bold', 
                            color: 'black', 
                            marginBottom: '4px', 
                            display: 'block',
                            backgroundColor: '#f8f9fa',
                            padding: '8px',
                            borderRadius: '4px',
                            borderBottom: '2px solid #e0e0e0'
                          }}>
                            Category of Procurement
                          </label>
                          <Select
                            size="small"
                            fullWidth
                            variant="outlined"
                            displayEmpty
                            value={contractualCategory}
                            onChange={(e) => {
                              setContractualCategory(e.target.value);
                              if (e.target.value && errors.contractualCategory) {
                                setErrors(prev => ({
                                  ...prev,
                                  contractualCategory: ""
                                }));
                              }
                            }}
                            error={Boolean(errors.contractualCategory)}
                            required
                            renderValue={(selected) => {
                              if (!selected) {
                                return <em style={{ color: '#999' }}>Select One...</em>;
                              }
                              return selected;
                            }}
                            disabled={isSubmitting}
                            sx={{
                              '& .MuiOutlinedInput-root.Mui-error': {
                                '& fieldset': {
                                  borderColor: 'red !important',
                                },
                              }
                            }}
                          >
                            <MenuItem value="Works">Works</MenuItem>
                            <MenuItem value="Supplies">Supplies</MenuItem>
                            <MenuItem value="Consultancy Services">Consultancy Services</MenuItem>
                            <MenuItem value="Non-Consultancy Services">Non-Consultancy Services</MenuItem>
                          </Select>
                        </TableCell>
                        {/* Type of Procurement */}
                        <TableCell sx={{ padding: 1, width: contractualSourceOfFunding === "Both" ? "25%" : "20%" }}>
                          <label style={{ 
                            fontSize: '0.875rem', 
                            fontWeight: 'bold', 
                            color: 'black', 
                            marginBottom: '4px', 
                            display: 'block',
                            backgroundColor: '#f8f9fa',
                            padding: '8px',
                            borderRadius: '4px',
                            borderBottom: '2px solid #e0e0e0'
                          }}>
                            Type of Procurement
                          </label>
                          <Select
                            size="small"
                            fullWidth
                            variant="outlined"
                            displayEmpty
                            value={contractualStage}
                            onChange={(e) => {
                              setContractualStage(e.target.value);
                              if (e.target.value && errors.contractualStage) {
                                setErrors(prev => ({
                                  ...prev,
                                  contractualStage: ""
                                }));
                              }
                            }}
                            error={Boolean(errors.contractualStage)}
                            required
                            renderValue={(selected) => {
                              if (!selected) {
                                return <em style={{ color: '#999' }}>Select One...</em>;
                              }
                              return selected;
                            }}
                            disabled={isSubmitting}
                            sx={{
                              '& .MuiOutlinedInput-root.Mui-error': {
                                '& fieldset': {
                                  borderColor: 'red !important',
                                },
                              }
                            }}
                          >
                            <MenuItem value="Direct">Direct</MenuItem>
                            <MenuItem value="Indirect">Indirect</MenuItem>
                          </Select>
                        </TableCell>
                        {/* Contract Status */}
                        <TableCell sx={{ padding: 1, width: contractualSourceOfFunding === "Both" ? "25%" : "20%" }}>
                          <label style={{ 
                            fontSize: '0.875rem', 
                            fontWeight: 'bold', 
                            color: 'black', 
                            marginBottom: '4px', 
                            display: 'block',
                            backgroundColor: '#f8f9fa',
                            padding: '8px',
                            borderRadius: '4px',
                            borderBottom: '2px solid #e0e0e0'
                          }}>
                            Contract Status
                          </label>
                          <Select
                            name="contract_status"
                            size="small"
                            fullWidth
                            variant="outlined"
                            displayEmpty
                            value={formData.contract_status}
                            onChange={handleChange}
                            error={Boolean(errors.contract_status)}
                            required
                            renderValue={(selected) => {
                              if (!selected) {
                                return <em style={{ color: '#999' }}>Select One...</em>;
                              }
                              return selected;
                            }}
                            disabled={isSubmitting}
                            sx={{
                              '& .MuiOutlinedInput-root.Mui-error': {
                                '& fieldset': {
                                  borderColor: 'red !important',
                                },
                              }
                            }}
                          >
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Completed">Completed</MenuItem>
                            <MenuItem value="Suspended">Suspended</MenuItem>
                            <MenuItem value="Terminated">Terminated</MenuItem>
                          </Select>
                        </TableCell>
                        {/* Empty cell for spacing */}
                        <TableCell sx={{ padding: 1, width: contractualSourceOfFunding === "Both" ? "25%" : "20%" }}>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              
              {/* Contract Dates row */}
              <div className="p-4 pt-0">
                <TableContainer className="shadow-sm" component={Paper} sx={{ boxShadow: "none" }}>
                  <Table size="small" sx={{ minWidth: 650, width: '100%', tableLayout: 'fixed' }} aria-label="contract dates table">
                    <TableHead>
                      <TableRow>
                        {/* CONTRACT START DATE AND END DATE HEADERS - COMMENTED OUT */}
                        {/* <TableCell sx={{ 
                          padding: 2, 
                          width: "20%", 
                          fontWeight: 'bold', 
                          fontSize: '0.875rem',
                          color: 'black',
                          backgroundColor: '#f8f9fa',
                          borderBottom: '2px solid #e0e0e0'
                        }}>Contract Start Date (FY)</TableCell>
                        <TableCell sx={{ 
                          padding: 2, 
                          width: "20%", 
                          fontWeight: 'bold', 
                          fontSize: '0.875rem',
                          color: 'black',
                          backgroundColor: '#f8f9fa',
                          borderBottom: '2px solid #e0e0e0'
                        }}>Contract End Date (FY)</TableCell> */}
                        <TableCell sx={{ 
                          padding: 2, 
                          width: "20%", 
                          minWidth: "20%",
                          maxWidth: "20%",
                          fontWeight: 'bold', 
                          fontSize: '0.875rem',
                          color: 'black',
                          backgroundColor: '#f8f9fa',
                          borderBottom: '2px solid #e0e0e0'
                        }}>Project Classification</TableCell>
                        <TableCell sx={{ 
                          padding: 2, 
                          width: "20%", 
                          minWidth: "20%",
                          maxWidth: "20%",
                          fontWeight: 'bold', 
                          fontSize: '0.875rem',
                          color: 'black',
                          backgroundColor: '#f8f9fa',
                          borderBottom: '2px solid #e0e0e0'
                        }}>Annual Penalty Interest Rate (%)</TableCell>
                        {/* Cumulative Arrears starting */}
                        <TableCell sx={{ 
                          padding: 2, 
                          width: "20%", 
                          minWidth: "20%",
                          maxWidth: "20%",
                          fontWeight: 'bold', 
                          fontSize: '0.875rem',
                          color: 'black',
                          backgroundColor: '#f8f9fa',
                          borderBottom: '2px solid #e0e0e0'
                        }}>
                          Cumulative Arrears starting {formatFiscalYear(formData.contract_start_date)}
                        </TableCell>
                        {/* Verified Arrears */}
                        <TableCell sx={{ 
                          padding: 2, 
                          width: "20%", 
                          minWidth: "20%",
                          maxWidth: "20%",
                          fontWeight: 'bold', 
                          fontSize: '0.875rem',
                          color: 'black',
                          backgroundColor: '#f8f9fa',
                          borderBottom: '2px solid #e0e0e0'
                        }}>
                          Verified Arrears
                        </TableCell>
                        {/* Un-verified Arrears */}
                        <TableCell sx={{ 
                          padding: 2, 
                          width: "20%", 
                          minWidth: "20%",
                          maxWidth: "20%",
                          fontWeight: 'bold', 
                          fontSize: '0.875rem',
                          color: 'black',
                          backgroundColor: '#f8f9fa',
                          borderBottom: '2px solid #e0e0e0'
                        }}>
                          Un-verified Arrears
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        {/* CONTRACT START DATE AND END DATE INPUT FIELDS - COMMENTED OUT */}
                        {/* <TableCell sx={{ padding: 1, width: "20%" }}>
                          <Select
                            name="contract_start_date"
                            type="date"
                            value={formData.contract_start_date || ""}
                            onChange={handleChange}
                            error={Boolean(errors.contract_start_date)}
                            slotProps={{ inputLabel: { shrink: true } }}
                            size="small"
                            fullWidth
                            displayEmpty
                            renderValue={(selected) => {
                              if (!selected) {
                                return <span style={{ color: '#999' }}>Select One....</span>;
                              }
                              return selected;
                            }}
                            disabled={isSubmitting}
                          >
                            {fiscalYears.map((fy) => (
                              <MenuItem key={fy} value={fy}>{fy}</MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell sx={{ padding: 1, width: "20%" }}>
                          <Select
                            name="contract_end_date"
                            type="date"
                            value={formData.contract_end_date || ""}
                            onChange={handleChange}
                            error={Boolean(errors.contract_end_date)}
                            slotProps={{ inputLabel: { shrink: true } }}
                            size="small"
                            fullWidth
                            displayEmpty
                            renderValue={(selected) => {
                              if (!selected) {
                                return <span style={{ color: '#999' }}>Select One....</span>;
                              }
                              return selected;
                            }}
                            disabled={isSubmitting}
                          >
                            {fiscalYears.map((fy) => (
                              <MenuItem key={fy} value={fy}>{fy}</MenuItem>
                            ))}
                          </Select>
                        </TableCell> */}
                        {/* Project Classification */}
                        <TableCell sx={{ padding: 1, width: "20%", minWidth: "20%", maxWidth: "20%" }}>
                          <Select
                            value={contractualProjectClassification}
                            onChange={(e) => {
                              setContractualProjectClassification(e.target.value);
                              if (e.target.value && errors.contractualProjectClassification) {
                                setErrors(prev => ({
                                  ...prev,
                                  contractualProjectClassification: ""
                                }));
                              }
                            }}
                            size="small"
                            fullWidth
                            displayEmpty
                            error={Boolean(errors.contractualProjectClassification)}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <span style={{ color: '#999' }}>Select Classification....</span>;
                              }
                              return selected;
                            }}
                            disabled={isSubmitting}
                            sx={{
                              '& .MuiOutlinedInput-root.Mui-error': {
                                '& fieldset': {
                                  borderColor: 'red !important',
                                },
                              }
                            }}
                          >
                            <MenuItem value="Institutional Development">Institutional Development</MenuItem>
                            <MenuItem value="Infrastructure">Infrastructure</MenuItem>
                            <MenuItem value="Social Investments">Social Investments</MenuItem>
                            <MenuItem value="Studies">Studies</MenuItem>
                          </Select>
                        </TableCell>
                        {/* Annual Penalty Interest Rate (%) */}
                        <TableCell sx={{ padding: 1, width: "20%", minWidth: "20%", maxWidth: "20%" }}>
                          <TextField
                            name="annual_penalty_rate"
                            inputMode="numeric"
                            value={annualPenaltyRate}
                            onChange={handlePercentChange}
                            onBlur={handleRateBlur}
                            inputProps={{ maxLength: 4 }}
                            error={Boolean(errors.annual_penalty_rate)}
                            helperText={errors.annual_penalty_rate || ""}
                            size="small"
                            fullWidth
                            disabled={isSubmitting}
                            sx={{
                              '& .MuiOutlinedInput-root.Mui-error': {
                                '& fieldset': {
                                  borderColor: 'red !important',
                                },
                              }
                            }}
                          />
                        </TableCell>
                        {/* Cumulative Arrears starting input */}
                        <TableCell sx={{ padding: 1, width: "20%", minWidth: "20%", maxWidth: "20%" }}>
                          <TextField
                            name="arrears"
                            inputMode="numeric"
                            value={formatWithCommas(formData.arrears)}
                            onChange={handleArrearsChange("arrears")}
                            error={Boolean(errors.arrears)}
                            helperText={errors.arrears || ""}
                            size="small"
                            fullWidth
                            disabled={isSubmitting}
                            sx={{
                              '& .MuiOutlinedInput-root.Mui-error': {
                                '& fieldset': {
                                  borderColor: 'red !important',
                                },
                              }
                            }}
                          />
                        </TableCell>
                        {/* Verified Arrears input */}
                        <TableCell sx={{ padding: 1, width: "20%", minWidth: "20%", maxWidth: "20%" }}>
                          <TextField
                            name="verified_arrears"
                            inputMode="numeric"
                            value={formatWithCommas(formData.verified_arrears)}
                            onChange={handleArrearsChange("verified_arrears")}
                            error={Boolean(errors.verified_arrears)}
                            helperText={errors.verified_arrears || ""}
                            size="small"
                            fullWidth
                            disabled={isSubmitting}
                            sx={{
                              '& .MuiOutlinedInput-root.Mui-error': {
                                '& fieldset': {
                                  borderColor: 'red !important',
                                },
                              }
                            }}
                          />
                        </TableCell>
                        {/* Un-verified Arrears input */}
                        <TableCell sx={{ padding: 1, width: "20%", minWidth: "20%", maxWidth: "20%" }}>
                          <TextField
                            name="unverified_arrears"
                            inputMode="numeric"
                            value={formatWithCommas(formData.unverified_arrears)}
                            onChange={handleArrearsChange("unverified_arrears")}
                            error={Boolean(errors.unverified_arrears)}
                            helperText={errors.unverified_arrears || ""}
                            size="small"
                            fullWidth
                            disabled={isSubmitting}
                            sx={{
                              '& .MuiOutlinedInput-root.Mui-error': {
                                '& fieldset': {
                                  borderColor: 'red !important',
                                },
                              }
                            }}
                          />
                        </TableCell>
                      </TableRow>
                      {/* New Row - Penalty Exposure and Contract Evidence */}
                      <TableRow>
                        {/* Cumulative Arrears Penalty Exposure */}
                        <TableCell sx={{ 
                          padding: 2, 
                          width: "25%", 
                          fontWeight: 'bold', 
                          fontSize: '0.875rem',
                          color: 'black',
                          backgroundColor: '#f8f9fa',
                          borderBottom: '2px solid #e0e0e0'
                        }}>
                          Cumulative Arrears Penalty Exposure
                        </TableCell>
                        <TableCell sx={{ padding: 1, width: "25%" }}>
                          <TextField
                            name="arrears_6_months_plus"
                            inputMode="numeric"
                            value={formatWithCommas(formData.arrears_6_months_plus)}
                            sx={{ backgroundColor: "#f4f4f4" }}
                            InputProps={{ readOnly: true }}
                            size="small"
                            fullWidth
                            disabled={isSubmitting}
                          />
                        </TableCell>
                        {/* Contract Evidence */}
                        <TableCell sx={{ 
                          padding: 2, 
                          width: "25%", 
                          fontWeight: 'bold', 
                          fontSize: '0.875rem',
                          color: 'black',
                          backgroundColor: '#f8f9fa',
                          borderBottom: '2px solid #e0e0e0'
                        }}>
                          Contract Evidence
                        </TableCell>
                        <TableCell sx={{ padding: 1, width: "25%" }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'flex-start' }}>
                            <input
                              accept=".pdf,.jpg,.jpeg,.png,.gif"
                              style={{ display: 'none' }}
                              id="contract-evidence-upload"
                              type="file"
                              onChange={handleContractEvidenceUpload}
                              disabled={isSubmitting}
                            />
                            <label htmlFor="contract-evidence-upload">
                              <Button
                                variant="outlined"
                                component="span"
                                size="small"
                                disabled={isSubmitting}
                                sx={{ 
                                  width: '120px',
                                  height: '32px',
                                  fontSize: '0.7rem',
                                  borderStyle: 'dashed',
                                  borderColor: contractEvidenceFile ? 'success.main' : (errors.contractEvidenceFile ? 'error.main' : 'primary.main'),
                                  color: contractEvidenceFile ? 'success.main' : (errors.contractEvidenceFile ? 'error.main' : 'primary.main'),
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  '&:hover': {
                                    borderStyle: 'dashed',
                                    borderColor: contractEvidenceFile ? 'success.dark' : (errors.contractEvidenceFile ? 'error.dark' : 'primary.dark'),
                                  }
                                }}
                              >
                                Upload Evidence
                              </Button>
                            </label>
                            {contractEvidenceFile && (
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  fontSize: '0.7rem',
                                  color: 'success.main',
                                  fontWeight: 'bold',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  maxWidth: '150px',
                                  display: 'block',
                                  textAlign: 'left'
                                }}
                              >
                                {contractEvidenceFile.name}
                              </Typography>
                            )}
                          </Box>
                          {errors.contractEvidenceFile && (
                            <Typography variant="caption" color="error" sx={{ fontSize: '0.75rem', mt: 0.5 }}>
                              {errors.contractEvidenceFile}
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              
              {/* Contract Value and Status row */}
              <div className="p-4 pt-0">
                <TableContainer className="shadow-sm" component={Paper} sx={{ boxShadow: "none" }}>
                  <Table size="small" sx={{ minWidth: 650 }} aria-label="contract value table">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ 
                          padding: 2, 
                          width: "20%", 
                          fontWeight: 'bold', 
                          fontSize: '0.875rem',
                          color: 'black',
                          backgroundColor: '#f8f9fa',
                          borderBottom: '2px solid #e0e0e0'
                        }}>Financial Year</TableCell>
                        <TableCell sx={{ 
                          padding: 2, 
                          width: "20%", 
                          fontWeight: 'bold', 
                          fontSize: '0.875rem',
                          color: 'black',
                          backgroundColor: '#f8f9fa',
                          borderBottom: '2px solid #e0e0e0'
                        }}>Item Code</TableCell>
                        <TableCell sx={{ 
                          padding: 2, 
                          width: "20%", 
                          fontWeight: 'bold', 
                          fontSize: '0.875rem',
                          color: 'black',
                          backgroundColor: '#f8f9fa',
                          borderBottom: '2px solid #e0e0e0'
                        }}>Description of Activity</TableCell>
                        <TableCell sx={{ 
                          padding: 2, 
                          width: "20%", 
                          fontWeight: 'bold', 
                          fontSize: '0.875rem',
                          color: 'black',
                          backgroundColor: '#f8f9fa',
                          borderBottom: '2px solid #e0e0e0'
                        }}>Source of Funding</TableCell>
                        <TableCell sx={{ 
                          padding: 2, 
                          width: "20%", 
                          fontWeight: 'bold', 
                          fontSize: '0.875rem',
                          color: 'black',
                          backgroundColor: '#f8f9fa',
                          borderBottom: '2px solid #e0e0e0'
                        }}>
                          Budgeted cost
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    {/* Missing PBS API Data Notification */}
                    {isProjectPeriodSelected() && missingFiscalYears.length > 0 && (
                      <div style={{ padding: '8px 16px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '4px', margin: '8px 0' }}>
                        <span style={{ color: '#856404', fontSize: '14px' }}>
                          ⚠️ <strong>No data yet from PBS for the fiscal year(s):</strong> {missingFiscalYears.join(', ')}
                        </span>
                      </div>
                    )}
                    <TableBody>
                      <TableRow>
                        {/* Financial Year */}
                        <TableCell sx={{ padding: 1 }}>
                          <Tooltip 
                            title={!isProjectPeriodSelected() ? "Please select Project Duration First from up" : ""}
                            placement="top"
                            arrow
                          >
                            <span>
                          <Autocomplete
                            value={(() => {
                              if (!contractualSelectedFiscalYear) return "";
                              // Find the formatted version of the selected fiscal year
                              const formatted = formattedFiscalYears.find(fy => fy.original === contractualSelectedFiscalYear)?.formatted;
                              return formatted || contractualSelectedFiscalYear;
                            })()}
                            onChange={(event, newValue) => {
                              // Find the original fiscal year format for the selected formatted value
                              const selectedFormatted = newValue || "";
                              const selectedOriginal = formattedFiscalYears.find(fy => fy.formatted === selectedFormatted)?.original || selectedFormatted;
                              handleContractualFiscalYearChange(selectedOriginal);
                            }}
                            options={formattedFiscalYears.map(fy => fy.formatted)}
                            getOptionLabel={(option) => option}
                            isOptionEqualToValue={(option, value) => option === value}
                            size="small"
                            fullWidth
                            disabled={!isProjectPeriodSelected() || itemCodesLoading || formattedFiscalYears.length === 0}
                            loading={itemCodesLoading}
                            loadingText="Loading fiscal years..."
                            noOptionsText={(() => {
                              if (!isProjectPeriodSelected()) return "Please select Project Duration first";
                              if (itemCodesLoading) return "Loading fiscal years...";
                              if (formattedFiscalYears.length === 0) {
                                if (missingFiscalYears.length > 0) {
                                  return `No data yet from PBS for the fiscal year(s): ${missingFiscalYears.join(', ')}`;
                                }
                                return "No fiscal years available from PBS API";
                              }
                              return "No fiscal years found";
                            })()}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Financial Year"
                                placeholder={!isProjectPeriodSelected() ? 'Select Project Duration first...' : (itemCodesLoading ? 'Loading fiscal years...' : 'Select fiscal year...')}
                                variant="outlined"
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      {itemCodesLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                      {params.InputProps.endAdornment}
                                    </>
                                  ),
                                }}
                              />
                            )}
                          />
                            </span>
                          </Tooltip>
                        </TableCell>
                        {/* Item Code */}
                        <TableCell sx={{ padding: 1 }}>
                          {/* Item Code Selection */}
                          <Autocomplete
                            value={(() => {
                              // Find the selected item by code instead of ID to be more robust
                              if (contractualSelectedFiscalYear && fiscalYearItemCodes[contractualSelectedFiscalYear] && contractualItemCode) {
                                const found = fiscalYearItemCodes[contractualSelectedFiscalYear].find(item => item.code === contractualItemCode);
                                return found || null;
                              }
                              return null;
                            })()}
                            onChange={(event, newValue) => {
                              if (newValue) {
                                // Pass the entire selected option to get fiscal year-specific values
                                handleContractualItemCodeChange(newValue.code, newValue);
                              } else {
                                handleContractualItemCodeChange("");
                              }
                            }}
                            options={(() => {
                              // Only show items from the selected fiscal year
                              if (contractualSelectedFiscalYear && fiscalYearItemCodes[contractualSelectedFiscalYear]) {
                                const options = fiscalYearItemCodes[contractualSelectedFiscalYear].map((item, index) => ({
                                  ...item,
                                  id: `${contractualSelectedFiscalYear}-${item.code}-${index}`, // Create unique ID
                                  fiscalYear: contractualSelectedFiscalYear,
                                  gouValue: item.gouValue,
                                  extFinValue: item.extFinValue
                                }));
                                
                                return options;
                              }
                              return [];
                            })()}
                            getOptionLabel={(option) => option.code}
                            isOptionEqualToValue={(option, value) => option.code === value?.code}
                            error={Boolean(errors.contractualItemCode) ? true : undefined}
                            filterOptions={(options, { inputValue }) => {
                              const filtered = options.filter((option) => {
                                const codeMatch = option.code.toLowerCase().includes(inputValue.toLowerCase());
                                const descriptionMatch = option.description.toLowerCase().includes(inputValue.toLowerCase());
                                return codeMatch || descriptionMatch;
                              });
                              return filtered;
                            }}
                            size="small"
                            fullWidth
                            disabled={itemCodesLoading || !contractualSelectedFiscalYear}
                            loading={itemCodesLoading}
                            loadingText="Loading item codes..."
                            noOptionsText={(() => {
                              if (itemCodesLoading) return "Loading item codes...";
                              if (!contractualSelectedFiscalYear) {
                                return "Please select a fiscal year first";
                              }
                              if (Object.keys(fiscalYearItemCodes).length === 0) {
                                return "No budget data available for this project";
                              }
                              if (!fiscalYearItemCodes[contractualSelectedFiscalYear] || fiscalYearItemCodes[contractualSelectedFiscalYear].length === 0) {
                                return `No item codes found for fiscal year ${contractualSelectedFiscalYear}`;
                              }
                              return "No item codes found for the selected criteria";
                            })()}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder={itemCodesLoading ? 'Loading item codes...' : (!contractualSelectedFiscalYear ? 'Select fiscal year first...' : 'Search by item code or description...')}
                                variant="outlined"
                                error={Boolean(errors.contractualItemCode) ? true : undefined}
                                helperText={errors.contractualItemCode || ""}
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      {itemCodesLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                      {params.InputProps.endAdornment}
                                    </>
                                  ),
                                }}
                              />
                            )}
                            renderOption={(props, option) => {
                              const { key, ...otherProps } = props;
                              return (
                                <li key={key} {...otherProps}>
                                  <div style={{ padding: '8px 16px' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{option.code}</div>
                                    <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>{option.description}</div>
                                    <div style={{
                                      fontSize: '11px',
                                      color: '#888',
                                      marginTop: '4px',
                                      display: 'flex',
                                      gap: '12px'
                                    }}>
                                      <span style={{ color: '#2e7d32' }}>
                                        GoU: {option.gouValue?.toLocaleString() || '0'}
                                      </span>
                                      <span style={{ color: '#1976d2' }}>
                                        ExtFin: {option.extFinValue?.toLocaleString() || '0'}
                                      </span>
                                    </div>
                                  </div>
                                </li>
                              );
                            }}
                          />
                        </TableCell>
                        {/* Description of Activity */}
                        <TableCell sx={{ padding: 1 }}>
                          <TextField
                            value={contractualDescription || ""}
                            size="small"
                            fullWidth
                            placeholder="Auto-filled"
                            InputProps={{ readOnly: true }}
                            sx={{
                              '& .MuiInputBase-input': {
                                color: '#333',
                                fontWeight: '500'
                              }
                            }}
                          />
                        </TableCell>
                        {/* Source of Funding - Show both GoU and External fields when Both is selected */}
                        <TableCell sx={{ padding: 1 }}>
                          {contractualSourceOfFunding === "Both" ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              <TextField
                                label="GoU"
                                size="small"
                                fullWidth
                                value="GoU"
                                InputProps={{ readOnly: true }}
                                sx={{
                                  backgroundColor: '#e3f2fd',
                                  '& .MuiInputBase-input': {
                                    color: '#333',
                                    fontWeight: '500'
                                  }
                                }}
                              />
                              <TextField
                                label="External"
                                size="small"
                                fullWidth
                                value="External"
                                InputProps={{ readOnly: true }}
                                sx={{
                                  backgroundColor: '#fff3e0',
                                  '& .MuiInputBase-input': {
                                    color: '#333',
                                    fontWeight: '500'
                                  }
                                }}
                              />
                            </Box>
                          ) : (
                            <Select
                              size="small"
                              fullWidth
                              variant="outlined"
                              displayEmpty
                              value={contractualSourceOfFunding}
                              onChange={(e) => setContractualSourceOfFunding(e.target.value)}
                              error={Boolean(errors.contractualSourceOfFunding)}
                              required
                              renderValue={(selected) => {
                                if (!selected) {
                                  if (contractualLoading) {
                                    return <em style={{ color: '#999' }}>Loading PBS data...</em>;
                                  }
                                  return <em style={{ color: '#999' }}>auto selected</em>;
                                }
                                return selected;
                              }}
                              disabled={true}
                              sx={{
                                backgroundColor: '#f4f4f4',
                                '& .MuiSelect-select': {
                                  color: '#333',
                                  fontWeight: '500'
                                }
                              }}
                            >
                              <MenuItem value="GoU">GoU</MenuItem>
                              <MenuItem value="External">External</MenuItem>
                              <MenuItem value="Both">Both</MenuItem>
                            </Select>
                          )}
                        </TableCell>
                        {/* Budgeted cost - Show both GoU and External fields when Both is selected */}
                        <TableCell sx={{ padding: 1 }}>
                          {contractualSourceOfFunding === "Both" ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              <TextField
                                label="GoU Budget"
                                inputMode="numeric"
                                value={formatWithCommas(formData.costing)}
                                onChange={handleCurrencyChange("costing")}
                                onBlur={handleGouBlur}
                                error={Boolean(errors.costing)}
                                helperText={errors.costing || ""}
                                size="small"
                                fullWidth
                                disabled={true}
                                InputProps={{ readOnly: true }}
                                sx={{
                                  backgroundColor: '#e3f2fd',
                                  '& .MuiInputBase-input': {
                                    color: '#333',
                                    fontWeight: '500'
                                  },
                                  '& .MuiOutlinedInput-root.Mui-error': {
                                    '& fieldset': {
                                      borderColor: 'red !important',
                                    },
                                  }
                                }}
                              />
                              <TextField
                                label="External Budget"
                                inputMode="numeric"
                                value={formatWithCommas(formData.contract_value_external)}
                                onChange={handleCurrencyChange("contract_value_external")}
                                onBlur={handleExternalBlur}
                                error={Boolean(errors.contract_value_external)}
                                helperText={errors.contract_value_external || ""}
                                size="small"
                                fullWidth
                                disabled={true}
                                InputProps={{ readOnly: true }}
                                sx={{
                                  backgroundColor: '#fff3e0',
                                  '& .MuiInputBase-input': {
                                    color: '#333',
                                    fontWeight: '500'
                                  },
                                  '& .MuiOutlinedInput-root.Mui-error': {
                                    '& fieldset': {
                                      borderColor: 'red !important',
                                    },
                                  }
                                }}
                              />
                            </Box>
                          ) : (
                            <TextField
                              name="costing"
                              inputMode="numeric"
                              value={formatWithCommas(
                                contractualSourceOfFunding === "GoU" ? formData.costing :
                                contractualSourceOfFunding === "External" ? formData.contract_value_external :
                                formData.costing
                              )}
                              onChange={handleCurrencyChange("costing")}
                              onBlur={handleGouBlur}
                              error={Boolean(errors.costing)}
                              helperText={errors.costing || ""}
                              size="small"
                              fullWidth
                              disabled={true}
                              InputProps={{ readOnly: true }}
                              sx={{
                                backgroundColor: '#f4f4f4',
                                '& .MuiInputBase-input': {
                                  color: '#333',
                                  fontWeight: '500'
                                },
                                '& .MuiOutlinedInput-root.Mui-error': {
                                  '& fieldset': {
                                    borderColor: 'red !important',
                                  },
                                }
                              }}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                      
                      {/* Quarterly Breakdown Row - Only show when item code is selected */}
                      {contractualItemCode && (
                        <>
                          {/* GoU Quarterly Breakdown Row */}
                          {contractualSourceOfFunding === "Both" && (
                            <>
                              {/* GoU Q1-Q4 Row */}
                            <TableRow>
                              <TableCell sx={{ 
                                padding: '8px 4px', 
                                fontWeight: 'bold', 
                                backgroundColor: '#e3f2fd',
                                width: '20%',
                                textAlign: 'left'
                              }}>
                                GoU Quarterly Releases
                              </TableCell>
                              <TableCell sx={{ 
                                padding: '8px 4px',
                                width: '20%'
                              }}>
                                  <TextField
                                    label="Q1"
                                    size="small"
                                    fullWidth
                                    value={contractualGouQ1}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const numericValue = value.replace(/[^0-9]/g, '');
                                      const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                      setContractualGouQ1(formattedValue);
                                      validateBothQuarterlyTotal(formattedValue, null, null, null, null, null, null, null);
                                    }}
                                    placeholder="0"
                                    error={Boolean(errors.contractualGouQ1)}
                                    helperText={errors.contractualGouQ1 || ""}
                                  />
                                </TableCell>
                                <TableCell sx={{ 
                                  padding: '8px 4px',
                                  width: '20%'
                                }}>
                                  <TextField
                                    label="Q2"
                                    size="small"
                                    fullWidth
                                    value={contractualGouQ2}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const numericValue = value.replace(/[^0-9]/g, '');
                                      const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                      setContractualGouQ2(formattedValue);
                                      validateBothQuarterlyTotal(null, formattedValue, null, null, null, null, null, null);
                                    }}
                                    placeholder="0"
                                    error={Boolean(errors.contractualGouQ2)}
                                    helperText={errors.contractualGouQ2 || ""}
                                  />
                              </TableCell>
                              <TableCell sx={{ 
                                padding: '8px 4px',
                                width: '20%'
                              }}>
                                  <TextField
                                    label="Q3"
                                    size="small"
                                    fullWidth
                                    value={contractualGouQ3}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const numericValue = value.replace(/[^0-9]/g, '');
                                      const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                      setContractualGouQ3(formattedValue);
                                      validateBothQuarterlyTotal(null, null, formattedValue, null, null, null, null, null);
                                    }}
                                    placeholder="0"
                                    error={Boolean(errors.contractualGouQ3)}
                                    helperText={errors.contractualGouQ3 || ""}
                                  />
                                </TableCell>
                                <TableCell sx={{ 
                                  padding: '8px 4px',
                                  width: '20%'
                                }}>
                                  <TextField
                                    label="Q4"
                                    size="small"
                                    fullWidth
                                    value={contractualGouQ4}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const numericValue = value.replace(/[^0-9]/g, '');
                                      const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                      setContractualGouQ4(formattedValue);
                                      validateBothQuarterlyTotal(null, null, null, formattedValue, null, null, null, null);
                                    }}
                                    placeholder="0"
                                    error={Boolean(errors.contractualGouQ4)}
                                    helperText={errors.contractualGouQ4 || ""}
                                  />
                                </TableCell>
                              </TableRow>
                              {/* GoU Total Row */}
                              <TableRow>
                                <TableCell sx={{ 
                                  padding: '8px 4px', 
                                  fontWeight: 'bold', 
                                  backgroundColor: '#e3f2fd',
                                  width: '20%',
                                  textAlign: 'left'
                                }}>
                                  GoU Total Released
                              </TableCell>
                              <TableCell sx={{ 
                                padding: '8px 4px',
                                width: '20%'
                              }}>
                                <TextField
                                  label="GoU Total Released"
                                  size="small"
                                  fullWidth
                                  value={(() => {
                                    const q1 = parseFloat(contractualGouQ1.replace(/,/g, '')) || 0;
                                    const q2 = parseFloat(contractualGouQ2.replace(/,/g, '')) || 0;
                                    const q3 = parseFloat(contractualGouQ3.replace(/,/g, '')) || 0;
                                    const q4 = parseFloat(contractualGouQ4.replace(/,/g, '')) || 0;
                                    const total = q1 + q2 + q3 + q4;
                                    return total > 0 ? total.toLocaleString() : '0';
                                  })()}
                                  InputProps={{ readOnly: true }}
                                  error={Boolean(errors.gouQuarterlyTotal)}
                                  helperText={errors.gouQuarterlyTotal || ""}
                                  sx={{
                                    backgroundColor: errors.gouQuarterlyTotal ? '#ffebee' : '#e3f2fd',
                                    '& .MuiInputBase-input': {
                                      color: errors.gouQuarterlyTotal ? '#d32f2f' : '#333',
                                      fontWeight: '500'
                                    }
                                  }}
                                />
                              </TableCell>
                              <TableCell sx={{ padding: '8px 4px' }}></TableCell>
                                <TableCell sx={{ padding: '8px 4px' }}></TableCell>
                              <TableCell sx={{ padding: '8px 4px' }}></TableCell>
                            </TableRow>
                            </>
                          )}
                          
                          {/* External Quarterly Breakdown Row */}
                          {contractualSourceOfFunding === "Both" && (
                            <>
                              {/* External Q1-Q4 Row */}
                            <TableRow>
                              <TableCell sx={{ 
                                padding: '8px 4px', 
                                fontWeight: 'bold', 
                                backgroundColor: '#fff3e0',
                                width: '20%',
                                textAlign: 'left'
                              }}>
                                External Quarterly Releases
                              </TableCell>
                              <TableCell sx={{ 
                                padding: '8px 4px',
                                width: '20%'
                              }}>
                                  <TextField
                                    label="Q1"
                                    size="small"
                                    fullWidth
                                    value={contractualExternalQ1}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const numericValue = value.replace(/[^0-9]/g, '');
                                      const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                      setContractualExternalQ1(formattedValue);
                                      validateBothQuarterlyTotal(null, null, null, null, formattedValue, null, null, null);
                                    }}
                                    placeholder="0"
                                    error={Boolean(errors.contractualExternalQ1)}
                                    helperText={errors.contractualExternalQ1 || ""}
                                  />
                                </TableCell>
                                <TableCell sx={{ 
                                  padding: '8px 4px',
                                  width: '20%'
                                }}>
                                  <TextField
                                    label="Q2"
                                    size="small"
                                    fullWidth
                                    value={contractualExternalQ2}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const numericValue = value.replace(/[^0-9]/g, '');
                                      const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                      setContractualExternalQ2(formattedValue);
                                      validateBothQuarterlyTotal(null, null, null, null, null, formattedValue, null, null);
                                    }}
                                    placeholder="0"
                                    error={Boolean(errors.contractualExternalQ2)}
                                    helperText={errors.contractualExternalQ2 || ""}
                                  />
                              </TableCell>
                              <TableCell sx={{ 
                                padding: '8px 4px',
                                width: '20%'
                              }}>
                                  <TextField
                                    label="Q3"
                                    size="small"
                                    fullWidth
                                    value={contractualExternalQ3}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const numericValue = value.replace(/[^0-9]/g, '');
                                      const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                      setContractualExternalQ3(formattedValue);
                                      validateBothQuarterlyTotal(null, null, null, null, null, null, formattedValue, null);
                                    }}
                                    placeholder="0"
                                    error={Boolean(errors.contractualExternalQ3)}
                                    helperText={errors.contractualExternalQ3 || ""}
                                  />
                                </TableCell>
                                <TableCell sx={{ 
                                  padding: '8px 4px',
                                  width: '20%'
                                }}>
                                  <TextField
                                    label="Q4"
                                    size="small"
                                    fullWidth
                                    value={contractualExternalQ4}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const numericValue = value.replace(/[^0-9]/g, '');
                                      const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                      setContractualExternalQ4(formattedValue);
                                      validateBothQuarterlyTotal(null, null, null, null, null, null, null, formattedValue);
                                    }}
                                    placeholder="0"
                                    error={Boolean(errors.contractualExternalQ4)}
                                    helperText={errors.contractualExternalQ4 || ""}
                                  />
                                </TableCell>
                              </TableRow>
                              {/* External Total Row */}
                              <TableRow>
                                <TableCell sx={{ 
                                  padding: '8px 4px', 
                                  fontWeight: 'bold', 
                                  backgroundColor: '#fff3e0',
                                  width: '20%',
                                  textAlign: 'left'
                                }}>
                                  External Total Released
                              </TableCell>
                              <TableCell sx={{ 
                                padding: '8px 4px',
                                width: '20%'
                              }}>
                                <TextField
                                  label="External Total Released"
                                  size="small"
                                  fullWidth
                                  value={(() => {
                                    const q1 = parseFloat(contractualExternalQ1.replace(/,/g, '')) || 0;
                                    const q2 = parseFloat(contractualExternalQ2.replace(/,/g, '')) || 0;
                                    const q3 = parseFloat(contractualExternalQ3.replace(/,/g, '')) || 0;
                                    const q4 = parseFloat(contractualExternalQ4.replace(/,/g, '')) || 0;
                                    const total = q1 + q2 + q3 + q4;
                                    return total > 0 ? total.toLocaleString() : '0';
                                  })()}
                                  InputProps={{ readOnly: true }}
                                  error={Boolean(errors.extQuarterlyTotal)}
                                  helperText={errors.extQuarterlyTotal || ""}
                                  sx={{
                                    backgroundColor: errors.extQuarterlyTotal ? '#ffebee' : '#fff3e0',
                                    '& .MuiInputBase-input': {
                                      color: errors.extQuarterlyTotal ? '#d32f2f' : '#333',
                                      fontWeight: '500'
                                    }
                                  }}
                                />
                              </TableCell>
                              <TableCell sx={{ padding: '8px 4px' }}></TableCell>
                                <TableCell sx={{ padding: '8px 4px' }}></TableCell>
                              <TableCell sx={{ padding: '8px 4px' }}></TableCell>
                            </TableRow>
                            </>
                          )}
                          
                          {/* Single Quarterly Breakdown Row for GoU or External only */}
                          {contractualSourceOfFunding !== "Both" && (
                            <TableRow>
                              <TableCell sx={{ 
                                padding: '8px 4px', 
                                fontWeight: 'bold', 
                                backgroundColor: '#f5f5f5',
                                width: '20%',
                                textAlign: 'left'
                              }}>
                                Quarterly Releases
                              </TableCell>
                              <TableCell sx={{ 
                                padding: '8px 4px',
                                width: '20%'
                              }}>
                                <TextField
                                  label="Q1"
                                  size="small"
                                  fullWidth
                                  value={contractualQ1}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    const numericValue = value.replace(/[^0-9]/g, '');
                                    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                    setContractualQ1(formattedValue);
                                    validateQuarterlyTotal(formattedValue, null, null, null);
                                  }}
                                  placeholder="0"
                                  error={Boolean(errors.contractualQ1)}
                                  helperText={errors.contractualQ1 || ""}
                                  sx={{ marginBottom: 1 }}
                                />
                              </TableCell>
                              <TableCell sx={{ 
                                padding: '8px 4px',
                                width: '20%'
                              }}>
                                <TextField
                                  label="Q2"
                                  size="small"
                                  fullWidth
                                  value={contractualQ2}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    const numericValue = value.replace(/[^0-9]/g, '');
                                    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                    setContractualQ2(formattedValue);
                                    validateQuarterlyTotal(null, formattedValue, null, null);
                                  }}
                                  placeholder="0"
                                  error={Boolean(errors.contractualQ2)}
                                  helperText={errors.contractualQ2 || ""}
                                  sx={{ marginBottom: 1 }}
                                />
                              </TableCell>
                              <TableCell sx={{ 
                                padding: '8px 4px',
                                width: '20%'
                              }}>
                                <TextField
                                  label="Q3"
                                  size="small"
                                  fullWidth
                                  value={contractualQ3}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    const numericValue = value.replace(/[^0-9]/g, '');
                                    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                    setContractualQ3(formattedValue);
                                    validateQuarterlyTotal(null, null, formattedValue, null);
                                  }}
                                  placeholder="0"
                                  error={Boolean(errors.contractualQ3)}
                                  helperText={errors.contractualQ3 || ""}
                                  sx={{ marginBottom: 1 }}
                                />
                              </TableCell>
                              <TableCell sx={{ 
                                padding: '8px 4px',
                                width: '20%'
                              }}>
                                <TextField
                                  label="Q4"
                                  size="small"
                                  fullWidth
                                  value={contractualQ4}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    const numericValue = value.replace(/[^0-9]/g, '');
                                    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                    setContractualQ4(formattedValue);
                                    validateQuarterlyTotal(null, null, null, formattedValue);
                                  }}
                                  placeholder="0"
                                  error={Boolean(errors.contractualQ4)}
                                  helperText={errors.contractualQ4 || ""}
                                  sx={{ marginBottom: 1 }}
                                />
                              </TableCell>
                              <TableCell sx={{ padding: '8px 4px' }}></TableCell>
                            </TableRow>
                          )}
                        </>
                      )}
                      
                      {/* Total Row - Only show when item code is selected */}
                      {contractualItemCode && (
                        <>
                          {/* Single Total Row for GoU or External only */}
                          {contractualSourceOfFunding !== "Both" && (
                            <TableRow>
                              <TableCell sx={{ 
                                padding: '8px 4px', 
                                fontWeight: 'bold', 
                                backgroundColor: '#f5f5f5',
                                width: '20%',
                                textAlign: 'left'
                              }}>
                                Total Amount Released
                              </TableCell>
                              <TableCell sx={{ 
                                padding: '8px 4px',
                                width: '20%'
                              }}>
                                <TextField
                                  label="Total"
                                  size="small"
                                  fullWidth
                                  value={(() => {
                                    const q1 = parseFloat(contractualQ1.replace(/,/g, '')) || 0;
                                    const q2 = parseFloat(contractualQ2.replace(/,/g, '')) || 0;
                                    const q3 = parseFloat(contractualQ3.replace(/,/g, '')) || 0;
                                    const q4 = parseFloat(contractualQ4.replace(/,/g, '')) || 0;
                                    const total = q1 + q2 + q3 + q4;
                                    return total > 0 ? total.toLocaleString() : '0';
                                  })()}
                                  InputProps={{ readOnly: true }}
                                  error={Boolean(errors.quarterlyTotal)}
                                  helperText={errors.quarterlyTotal || ""}
                                  sx={{
                                    backgroundColor: errors.quarterlyTotal ? '#ffebee' : '#f4f4f4',
                                    '& .MuiInputBase-input': {
                                      color: errors.quarterlyTotal ? '#d32f2f' : '#333',
                                      fontWeight: '500'
                                    }
                                  }}
                                />
                              </TableCell>
                              <TableCell sx={{ padding: '8px 4px' }}></TableCell>
                              <TableCell sx={{ padding: '8px 4px' }}></TableCell>
                              <TableCell sx={{ padding: '8px 4px' }}></TableCell>
                              <TableCell sx={{ padding: '8px 4px' }}></TableCell>
                            </TableRow>
                          )}
                        </>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {/* Add Button */}
                <div style={{ 
                  padding: '20px 16px', 
                  textAlign: 'center',
                  backgroundColor: '#f8f9fa',
                  borderTop: '1px solid #e0e0e0',
                  borderRadius: '0 0 8px 8px'
                }}>
                  <ButtonMui
                    onClick={addQuarterlyEntry}
                    variant="contained"
                    size="medium"
                    startIcon={
                      <span style={{ 
                        fontSize: '18px', 
                        fontWeight: 'bold',
                        marginRight: '4px'
                      }}>+</span>
                    }
                    sx={{
                      backgroundColor: '#3F51B5',
                      color: 'white',
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      textTransform: 'none',
                      borderRadius: '6px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      minWidth: '200px',
                      '&:hover': {
                        backgroundColor: '#303F9F',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                        transform: 'translateY(-1px)'
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    Add Quarterly Entry
                  </ButtonMui>
                </div>
                
                {/* Added Quarterly Entries */}
                {quarterlyEntries.length > 0 && (
                  <div className="p-4 pt-0">
                    <h4 style={{ marginBottom: '16px', color: '#333' }}>Added Quarterly Entries</h4>
                    <TableContainer className="shadow-sm" component={Paper} sx={{ boxShadow: "none" }}>
                      <Table size="small" sx={{ minWidth: 650 }} aria-label="added quarterly entries">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>Financial Year</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>Item Code</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>Description</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>Source</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>Q1</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>Q2</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>Q3</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>Q4</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>Total</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {quarterlyEntries.map((entry) => {
                            // If funding source is "Both", show separate rows for GoU and External
                            if (entry.sourceOfFunding === "Both") {
                              const gouTotal = (parseFloat(entry.gouQ1?.replace(/,/g, '') || '0') || 0) +
                                              (parseFloat(entry.gouQ2?.replace(/,/g, '') || '0') || 0) +
                                              (parseFloat(entry.gouQ3?.replace(/,/g, '') || '0') || 0) +
                                              (parseFloat(entry.gouQ4?.replace(/,/g, '') || '0') || 0);
                              
                              const extTotal = (parseFloat(entry.externalQ1?.replace(/,/g, '') || '0') || 0) +
                                              (parseFloat(entry.externalQ2?.replace(/,/g, '') || '0') || 0) +
                                              (parseFloat(entry.externalQ3?.replace(/,/g, '') || '0') || 0) +
                                              (parseFloat(entry.externalQ4?.replace(/,/g, '') || '0') || 0);
                              
                              return (
                                <React.Fragment key={entry.id}>
                                  {/* GoU Row */}
                                  <TableRow sx={{ borderBottom: 'none', borderTop: '1px solid #e0e0e0' }}>
                                    <TableCell sx={{ borderBottom: 'none' }}>{entry.fiscalYear}</TableCell>
                                    <TableCell sx={{ borderBottom: 'none' }}>{entry.itemCode}</TableCell>
                                    <TableCell sx={{ borderBottom: 'none' }}>{entry.description}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', borderBottom: 'none' }}>GoU</TableCell>
                                    <TableCell sx={{ borderBottom: 'none' }}>{entry.gouQ1 || '0'}</TableCell>
                                    <TableCell sx={{ borderBottom: 'none' }}>{entry.gouQ2 || '0'}</TableCell>
                                    <TableCell sx={{ borderBottom: 'none' }}>{entry.gouQ3 || '0'}</TableCell>
                                    <TableCell sx={{ borderBottom: 'none' }}>{entry.gouQ4 || '0'}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none' }}>
                                      {gouTotal.toLocaleString()}
                                    </TableCell>
                                    <TableCell rowSpan={2} sx={{ verticalAlign: 'middle', textAlign: 'center' }}>
                                      <ButtonMui
                                        onClick={() => deleteQuarterlyEntry(entry.id)}
                                        variant="outlined"
                                        size="small"
                                        sx={{ 
                                          minWidth: 'auto', 
                                          padding: '4px 8px',
                                          color: '#d32f2f',
                                          borderColor: 'transparent',
                                          backgroundColor: 'transparent',
                                          '&:hover': {
                                            backgroundColor: 'transparent',
                                            borderColor: '#d32f2f'
                                          }
                                        }}
                                      >
                                        Remove
                                      </ButtonMui>
                                    </TableCell>
                                  </TableRow>
                                  {/* External Row */}
                                  <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#f57c00' }}>External</TableCell>
                                    <TableCell>{entry.externalQ1 || '0'}</TableCell>
                                    <TableCell>{entry.externalQ2 || '0'}</TableCell>
                                    <TableCell>{entry.externalQ3 || '0'}</TableCell>
                                    <TableCell>{entry.externalQ4 || '0'}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>
                                      {extTotal.toLocaleString()}
                                    </TableCell>
                                  </TableRow>
                                </React.Fragment>
                              );
                            } else {
                              // Single row for GoU or External only
                              return (
                            <TableRow key={entry.id}>
                              <TableCell>{entry.fiscalYear}</TableCell>
                              <TableCell>{entry.itemCode}</TableCell>
                              <TableCell>{entry.description}</TableCell>
                                  <TableCell sx={{ fontWeight: 'bold', color: entry.sourceOfFunding === 'GoU' ? '#1976d2' : '#f57c00' }}>
                                    {entry.sourceOfFunding}
                                  </TableCell>
                              <TableCell>{entry.q1 || '0'}</TableCell>
                              <TableCell>{entry.q2 || '0'}</TableCell>
                              <TableCell>{entry.q3 || '0'}</TableCell>
                              <TableCell>{entry.q4 || '0'}</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }}>
                                {entry.total.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <ButtonMui
                                  onClick={() => deleteQuarterlyEntry(entry.id)}
                                  variant="outlined"
                                  size="small"
                                  sx={{ 
                                    minWidth: 'auto', 
                                    padding: '4px 8px',
                                    color: '#d32f2f',
                                        borderColor: 'transparent',
                                        backgroundColor: 'transparent',
                                    '&:hover': {
                                          backgroundColor: 'transparent',
                                      borderColor: '#d32f2f'
                                    }
                                  }}
                                >
                                  Remove
                                </ButtonMui>
                              </TableCell>
                            </TableRow>
                              );
                            }
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                )}
              </div>
              
              {/* Dynamic FY pipeline table based on selected dates */}
              {false && (
                <div className="p-4 pt-0">
                  <TableContainer className="shadow-sm" component={Paper} sx={{ boxShadow: "none" }}>
                    <Table size="small" sx={{ minWidth: 650 }} aria-label="dynamic pipeline table">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ padding: 1, width: "15%" }}>Funding Source</TableCell>
                          {fyHeaders.map((fy) => (
                            <TableCell key={fy} sx={{ padding: 1 }}>{fy}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {/* External row */}
                        <TableRow>
                          <TableCell sx={{ padding: 1 }}>
                            <TextField fullWidth size="small" value="External" InputProps={{ readOnly: true }} sx={{ backgroundColor: '#f4f4f4' }} />
                          </TableCell>
                          {fyHeaders.map((fy) => (
                            <TableCell key={`ext-${fy}`} sx={{ padding: 1 }}>
                              <TextField
                                size="small"
                                fullWidth
                                inputMode="numeric"
                                value={formatWithCommas(pipelineExternal[fy] || "")}
                                onChange={handlePipelineChange('external', fy)}
                                error={Boolean(errors[`external_${fy}`])}
                                helperText=""
                                disabled={contractValueExternal === "0"}
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                        {/* GoU row */}
                        <TableRow>
                          <TableCell sx={{ padding: 1 }}>
                            <TextField fullWidth size="small" value="GoU" InputProps={{ readOnly: true }} sx={{ backgroundColor: '#f4f4f4' }} />
                          </TableCell>
                          {fyHeaders.map((fy) => (
                            <TableCell key={`gou-${fy}`} sx={{ padding: 1 }}>
                              <TextField
                                size="small"
                                fullWidth
                                inputMode="numeric"
                                value={formatWithCommas(pipelineGoU[fy] || "")}
                                onChange={handlePipelineChange('gou', fy)}
                                error={Boolean(errors[`gou_${fy}`])}
                                helperText=""
                                disabled={formData.contract_value_gou === "0"}
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              )}
              <div className="mt-2">
                {false && nestedTab === "obligation" && (
                  <div className="px-4 pb-4">
                    {/* Show message if no source of funding is selected */}
                    {(!contractualSourceOfFunding || contractualSourceOfFunding === "") ? (
                      <div style={{ textAlign: 'center', color: '#666', fontStyle: 'italic', padding: '40px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                        Please select Item code above to view Contractual Obligation information
                      </div>
                    ) : (
                    <TableContainer
                      className="shadow-sm"
                      component={Paper}
                      sx={{ boxShadow: "none" }}
                    >
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                              <TableCell sx={{ 
                                padding: 2, 
                                width: "20%", 
                                fontWeight: 'bold', 
                                fontSize: '0.875rem',
                                color: 'black',
                                backgroundColor: '#f8f9fa',
                                borderBottom: '2px solid #e0e0e0'
                              }}>Procurement Reference Number</TableCell>
                              <TableCell sx={{ 
                                padding: 2, 
                                width: "20%", 
                                fontWeight: 'bold', 
                                fontSize: '0.875rem',
                                color: 'black',
                                backgroundColor: '#f8f9fa',
                                borderBottom: '2px solid #e0e0e0'
                              }}>
                              Funding Source
                            </TableCell>
                              <TableCell sx={{ 
                                padding: 2, 
                                width: "20%", 
                                fontWeight: 'bold', 
                                fontSize: '0.875rem',
                                color: 'black',
                                backgroundColor: '#f8f9fa',
                                borderBottom: '2px solid #e0e0e0'
                              }}>
                              Costing
                            </TableCell>
                              <TableCell sx={{ 
                                padding: 2, 
                                width: "20%", 
                                fontWeight: 'bold', 
                                fontSize: '0.875rem',
                                color: 'black',
                                backgroundColor: '#f8f9fa',
                                borderBottom: '2px solid #e0e0e0'
                              }}>
                                Cumulative contract payments starting {currentFy ? ` ${currentFy}` : ""}
                            </TableCell>
                              <TableCell sx={{ 
                                padding: 2, 
                                width: "20%", 
                                fontWeight: 'bold', 
                                fontSize: '0.875rem',
                                color: 'black',
                                backgroundColor: '#f8f9fa',
                                borderBottom: '2px solid #e0e0e0'
                              }}>
                              Balance on Costing
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {/* External row - show only if Source of Funding is "External" or "Both" */}
                          {(contractualSourceOfFunding === "External" || contractualSourceOfFunding === "Both") && (
                          <TableRow>
                            <TableCell sx={{ padding: 1, width: "20%", borderBottom: 0 }}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                value={formData.contract_reference_number}
                                sx={{ backgroundColor: "#f4f4f4" }}
                                size="small"
                                disabled
                                aria-readonly
                                InputProps={{ readOnly: true }}
                              />
                            </TableCell>
                            <TableCell sx={{ padding: 1, width: "20%", borderBottom: 0 }}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={"External"}
                                disabled
                                aria-readonly
                                sx={{ backgroundColor: "#f4f4f4" }}
                                InputProps={{ readOnly: true }}
                              />
                            </TableCell>
                            <TableCell sx={{ padding: 1, width: "20%", borderBottom: 0 }}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                name="contract_value_external"
                                inputMode="numeric"
                                value={contractualSourceOfFunding === "Both" ? formatWithCommas(formData.contract_value_external) : formatWithCommas(formData.costing)}
                                onChange={contractualSourceOfFunding === "Both" ? handleContractValueChange("contract_value_external") : undefined}
                                disabled={true}
                                sx={{ backgroundColor: "#f4f4f4" }}
                                InputProps={{ readOnly: true }}
                                error={Boolean(errors.contract_value_external)}
                                helperText=""
                              />
                              {/* {contractualDataFetched && (contractualSourceOfFunding === "External" || contractualSourceOfFunding === "Both") && formData.contract_value_external && (
                                <div style={{ fontSize: '0.75rem', color: '#4CAF50', marginTop: '4px', fontStyle: 'italic' }}>
                                  ✓ Auto-populated from PBS ExtFin value
                                </div>
                              )} */}
                            </TableCell>
                            <TableCell sx={{ padding: 1, width: "20%", borderBottom: 0 }}>
                              <TextField
                                name="approved_payments"
                                inputMode="numeric"
                                value={formatWithCommas(formData.approved_payments)}
                                onChange={handleArrearsChange("approved_payments")}
                                error={Boolean(errors.approved_payments)}
                                helperText={errors.approved_payments || ""}
                                size="small"
                                fullWidth
                                disabled={isSubmitting}
                                sx={{
                                  '& .MuiOutlinedInput-root.Mui-error': {
                                    '& fieldset': {
                                      borderColor: 'red !important',
                                    },
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ padding: 1, width: "20%", borderBottom: 0 }}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={contractualSourceOfFunding === "Both" ? formatWithCommas(formData.balance_on_contract_value) : formatWithCommas(formData.balance_on_contract_value)}
                                sx={{ backgroundColor: "#f4f4f4" }}
                                InputProps={{ readOnly: true }}
                                disabled
                              />
                            </TableCell>
                          </TableRow>
                          )}
                          {/* GoU row - show only if Source of Funding is "GoU" or "Both" */}
                          {(contractualSourceOfFunding === "GoU" || contractualSourceOfFunding === "Both") && (
                          <TableRow>
                            <TableCell sx={{ padding: 1, width: "20%" }}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                aria-readonly
                                disabled
                                value={formData.contract_reference_number}
                                sx={{ backgroundColor: "#f4f4f4" }}
                                InputProps={{ readOnly: true }}
                              />
                            </TableCell>
                            <TableCell sx={{ padding: 1, width: "20%" }}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                aria-readonly
                                disabled
                                value={"GoU"}
                                sx={{ backgroundColor: "#f4f4f4" }}
                                InputProps={{ readOnly: true }}
                              />
                            </TableCell>
                            <TableCell sx={{ padding: 1, width: "20%" }}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                name="contract_value_gou"
                                inputMode="numeric"
                                value={contractualSourceOfFunding === "Both" ? formatWithCommas(formData.contract_value_gou) : formatWithCommas(formData.costing)}
                                onChange={contractualSourceOfFunding === "Both" ? handleContractValueChange("contract_value_gou") : undefined}
                                disabled={true}
                                sx={{ backgroundColor: "#f4f4f4" }}
                                InputProps={{ readOnly: true }}
                                error={Boolean(errors.contract_value_gou)}
                                helperText=""
                              />
                            </TableCell>
                            <TableCell sx={{ padding: 1, width: "20%" }}>
                              <TextField
                                name="approved_payments_gou"
                                inputMode="numeric"
                                value={formatWithCommas(formData.approved_payments_gou)}
                                onChange={handleArrearsChange("approved_payments_gou")}
                                error={Boolean(errors.approved_payments_gou)}
                                helperText=""
                                size="small"
                                fullWidth
                                disabled={isSubmitting}
                              />
                            </TableCell>
                            <TableCell sx={{ padding: 1, width: "20%" }}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={contractualSourceOfFunding === "Both" ? formatWithCommas(formData.balance_on_contract_value_gou) : formatWithCommas(formData.balance_on_contract_value_gou)}
                                sx={{ backgroundColor: "#f4f4f4" }}
                                InputProps={{ readOnly: true }}
                                disabled
                              />
                            </TableCell>
                          </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    )}
                  </div>
                )}
                {false && nestedTab === "arrears" && (
                  <div className="px-4 pb-4">
                    {/* Show message if no source of funding is selected */}
                    {(!contractualSourceOfFunding || contractualSourceOfFunding === "") ? (
                      <div style={{ textAlign: 'center', color: '#666', fontStyle: 'italic', padding: '40px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                        Please select Item Code above to view arrears information
                      </div>
                    ) : (
                    <TableContainer
                      className="shadow-sm"
                      component={Paper}
                      sx={{ boxShadow: "none" }}
                    >
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                              <TableCell sx={{ 
                                padding: 2, 
                                width: "20%", 
                                fontWeight: 'bold', 
                                fontSize: '0.875rem',
                                color: 'black',
                                backgroundColor: '#f8f9fa',
                                borderBottom: '2px solid #e0e0e0'
                              }}>Procurement Reference Number</TableCell>
                              <TableCell sx={{ 
                                padding: 2, 
                                width: "20%", 
                                fontWeight: 'bold', 
                                fontSize: '0.875rem',
                                color: 'black',
                                backgroundColor: '#f8f9fa',
                                borderBottom: '2px solid #e0e0e0'
                              }}>
                              Funding Source
                            </TableCell>
                              <TableCell sx={{ 
                                padding: 2, 
                                width: "20%", 
                                fontWeight: 'bold', 
                                fontSize: '0.875rem',
                                color: 'black',
                                backgroundColor: '#f8f9fa',
                                borderBottom: '2px solid #e0e0e0'
                              }}>
                                {/* MOVED TO CONTRACTUAL TAB */}
                            </TableCell>
                              <TableCell sx={{ 
                                padding: 2, 
                                width: "13.333%", 
                                fontWeight: 'bold', 
                                fontSize: '0.875rem',
                                color: 'black',
                                backgroundColor: '#f8f9fa',
                                borderBottom: '2px solid #e0e0e0'
                              }}>
                              {/* MOVED TO CONTRACTUAL TAB */}
                            </TableCell>
                              <TableCell sx={{ 
                                padding: 2, 
                                width: "13.333%", 
                                fontWeight: 'bold', 
                                fontSize: '0.875rem',
                                color: 'black',
                                backgroundColor: '#f8f9fa',
                                borderBottom: '2px solid #e0e0e0'
                              }}>
                              {/* MOVED TO CONTRACTUAL TAB */}
                            </TableCell>
                              <TableCell sx={{ 
                                padding: 2, 
                                width: "13.333%", 
                                fontWeight: 'bold', 
                                fontSize: '0.875rem',
                                color: 'black',
                                backgroundColor: '#f8f9fa',
                                borderBottom: '2px solid #e0e0e0'
                              }}>
                              {/* MOVED TO CONTRACTUAL TAB */}
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {/* External row - show only if Source of Funding is "External" or "Both" */}
                          {(contractualSourceOfFunding === "External" || contractualSourceOfFunding === "Both") && (
                          <TableRow>
                            <TableCell sx={{ padding: 1, width: "20%", borderBottom: 0 }}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={formData.contract_reference_number}
                                sx={{ backgroundColor: "#f4f4f4" }}
                                InputProps={{ readOnly: true }}
                              />
                            </TableCell>
                            <TableCell sx={{ padding: 1, width: "20%", borderBottom: 0 }}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={"External"}
                                disabled
                                sx={{ backgroundColor: "#f4f4f4" }}
                                InputProps={{ readOnly: true }}
                              />
                            </TableCell>
                            {/* MOVED TO CONTRACTUAL TAB */}
                            <TableCell sx={{ padding: 1, width: "20%", borderBottom: 0 }}>
                              {/* MOVED TO CONTRACTUAL TAB */}
                            </TableCell>
                            <TableCell sx={{ padding: 1, width: "13.333%", borderBottom: 0 }}>
                              {/* MOVED TO CONTRACTUAL TAB */}
                            </TableCell>
                            <TableCell sx={{ padding: 1, width: "13.333%", borderBottom: 0 }}>
                              {/* MOVED TO CONTRACTUAL TAB */}
                            </TableCell>
                            <TableCell sx={{ padding: 1, width: "13.333%" }}>
                              {/* MOVED TO CONTRACTUAL TAB */}
                            </TableCell>
                          </TableRow>
                          )}
                          {/* GoU row - show only if Source of Funding is "GoU" or "Both" */}
                          {(contractualSourceOfFunding === "GoU" || contractualSourceOfFunding === "Both") && (
                          <TableRow>
                            <TableCell sx={{ padding: 1, width: "20%" }}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={formData.contract_reference_number}
                                sx={{ backgroundColor: "#f4f4f4" }}
                                InputProps={{ readOnly: true }}
                              />
                            </TableCell>
                            <TableCell sx={{ padding: 1, width: "20%" }}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                aria-readonly
                                disabled
                                value={"GoU"}
                                sx={{ backgroundColor: "#f4f4f4" }}
                                InputProps={{ readOnly: true }}
                              />
                            </TableCell>
                            <TableCell sx={{ padding: 1, width: "20%" }}>
                              <TextField
                                name="arrears_gou"
                                inputMode="numeric"
                                value={formatWithCommas(formData.arrears_gou)}
                                onChange={handleArrearsChange("arrears_gou")}
                                error={Boolean(errors.arrears_gou)}
                                helperText={errors.arrears_gou || ""}
                                size="small"
                                fullWidth
                                disabled={isSubmitting}
                                sx={{
                                  '& .MuiOutlinedInput-root.Mui-error': {
                                    '& fieldset': {
                                      borderColor: 'red !important',
                                    },
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ padding: 1, width: "13.333%" }}>
                              <TextField
                                name="verified_arrears_gou"
                                inputMode="numeric"
                                value={formatWithCommas(formData.verified_arrears_gou)}
                                onChange={handleArrearsChange("verified_arrears_gou")}
                                error={Boolean(errors.verified_arrears_gou)}
                                helperText={errors.verified_arrears_gou || ""}
                                size="small"
                                fullWidth
                                disabled={isSubmitting}
                                sx={{
                                  '& .MuiOutlinedInput-root.Mui-error': {
                                    '& fieldset': {
                                      borderColor: 'red !important',
                                    },
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ padding: 1, width: "13.333%" }}>
                              <TextField
                                name="unverified_arrears_gou"
                                inputMode="numeric"
                                value={formatWithCommas(formData.unverified_arrears_gou)}
                                onChange={handleArrearsChange("unverified_arrears_gou")}
                                error={Boolean(errors.unverified_arrears_gou)}
                                helperText={errors.unverified_arrears_gou || ""}
                                size="small"
                                fullWidth
                                disabled={isSubmitting}
                                sx={{
                                  '& .MuiOutlinedInput-root.Mui-error': {
                                    '& fieldset': {
                                      borderColor: 'red !important',
                                    },
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ padding: 1, width: "13.333%" }}>
                              <TextField
                                name="arrears_6_months_plus_gou"
                                inputMode="numeric"
                                value={formatWithCommas(formData.arrears_6_months_plus_gou)}
                                sx={{ backgroundColor: "#f4f4f4" }}
                                InputProps={{ readOnly: true }}
                                // helperText="Auto-calculated"
                                size="small"
                                fullWidth
                                disabled={isSubmitting}
                              />
                            </TableCell>
                          </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    )}
                  </div>
                )}
                {/* Procurement tab form */}
                {/* {nestedTab === "procurement" && (
                  <div className="px-4 pb-4">
                    <Procurement 
                      procurementEntries={procurementEntries}
                      setProcurementEntries={setProcurementEntries}
                    />
                  </div>
                )} */}
              </div>
              {/* Dynamic FY pipeline table - only show in contractual obligation tab */}
              {nestedTab === "obligation" && fyHeaders.length > 0 && (
                <div className="px-4 pb-4">
                  {!isProjectPeriodSelected() && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center">
                        <span className="text-yellow-600 text-sm font-medium">
                          ⚠️ Please select Project Duration above to enable fiscal year fields
                        </span>
                      </div>
                    </div>
                  )}
                  <TableContainer className="shadow-sm" component={Paper} sx={{ boxShadow: "none" }}>
                    <Table size="small" sx={{ minWidth: 650 }} aria-label="dynamic pipeline table">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ 
                            padding: 2, 
                            width: "15%", 
                            fontWeight: 'bold', 
                            backgroundColor: '#f8f9fa',
                            fontSize: '0.875rem',
                            color: 'black',
                            borderBottom: '2px solid #e0e0e0'
                          }}>Funding Source</TableCell>
                          {fyHeaders.map((fy) => (
                            <TableCell key={fy} sx={{ 
                              padding: 2, 
                              fontWeight: 'bold', 
                              backgroundColor: '#f8f9fa',
                              fontSize: '0.875rem',
                              color: 'black',
                              borderBottom: '2px solid #e0e0e0',
                              textAlign: 'center'
                            }}>{fy}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {/* Show message if no source of funding is selected */}
                        {(!contractualSourceOfFunding || contractualSourceOfFunding === "") && (
                          <TableRow>
                            <TableCell colSpan={fyHeaders.length + 1} sx={{ textAlign: 'center', color: '#666', fontStyle: 'italic', padding: '20px' }}>
                              Please select a Source of Funding to view fiscal year pipeline information
                            </TableCell>
                          </TableRow>
                        )}
                        {/* External row - show only if Source of Funding is "External" or "Both" */}
                        {(contractualSourceOfFunding === "External" || contractualSourceOfFunding === "Both") && (
                        <TableRow>
                          <TableCell sx={{ padding: 1 }}>
                            <TextField fullWidth size="small" value="External" InputProps={{ readOnly: true }} sx={{ backgroundColor: '#f4f4f4' }} />
                          </TableCell>
                          {fyHeaders.map((fy) => (
                            <TableCell key={`ext-${fy}`} sx={{ padding: 1 }}>
                              <TextField
                                size="small"
                                fullWidth
                                inputMode="numeric"
                                value={formatWithCommas(pipelineExternal[fy] || "")}
                                onChange={handlePipelineChange('external', fy)}
                                error={Boolean(errors[`external_${fy}`])}
                                helperText=""
                                disabled={contractValueExternal === "0" || !isProjectPeriodSelected()}
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                        )}
                        {/* GoU row - show only if Source of Funding is "GoU" or "Both" */}
                        {(contractualSourceOfFunding === "GoU" || contractualSourceOfFunding === "Both") && (
                        <TableRow>
                          <TableCell sx={{ padding: 1 }}>
                            <TextField fullWidth size="small" value="GoU" InputProps={{ readOnly: true }} sx={{ backgroundColor: '#f4f4f4' }} />
                          </TableCell>
                          {fyHeaders.map((fy) => (
                            <TableCell key={`gou-${fy}`} sx={{ padding: 1 }}>
                              <TextField
                                size="small"
                                fullWidth
                                inputMode="numeric"
                                value={formatWithCommas(pipelineGoU[fy] || "")}
                                onChange={handlePipelineChange('gou', fy)}
                                error={Boolean(errors[`gou_${fy}`])}
                                helperText=""
                                disabled={formData.contract_value_gou === "0" || !isProjectPeriodSelected()}
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              )}
              <div className="p-4">
                <div className="flex gap-3">
                  <ButtonMui 
                    type="button" 
                    variant="contained" 
                    onClick={handleSaveContract}
                    disabled={isSubmitting}
                    sx={buttonStyles}
                  >
                    {currentContractIndex !== null ? "Update Contract" : "Save Contract"}
                  </ButtonMui>
                  <ButtonMui 
                    type="button" 
                    variant="contained" 
                    onClick={handleCancelContract}
                    disabled={isSubmitting}
                    sx={buttonStyles}
                  >
                    Cancel
                  </ButtonMui>
                  {/* <ButtonMui type="submit" loading={isSubmitting} disabled={isSubmitting} sx={buttonStyles}>
                    {isSubmitting ? "Submitting..." : "Submit All Contracts"}
                  </ButtonMui> */}
                </div>
              </div>
            </div>
          </form>
          ) : (
            // Contract List View
            <div>
              {/* Search Filter */}
              {contracts.length > 0 && (
                <div className="mb-4">
                  <TextField
                    fullWidth
                    placeholder="Search contracts by reference number, name, contractor, status, or dates..."
                    value={contractSearchTerm}
                    onChange={(e) => setContractSearchTerm(e.target.value)}
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
                </div>
              )}
              
              {/* Search results counter */}
              {contracts.length > 0 && contractSearchTerm && (
                <div className="mb-2 text-sm text-gray-600">
                  {filteredContracts.length} of {contracts.length} contracts found
                </div>
              )}
              
              {contracts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No contracts added yet. Click "+ Add Contract" to get started.</p>
                </div>
              ) : (
                <TableContainer component={Paper} className="shadow-sm" data-testid="contract-management-table">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ 
                          fontWeight: 'bold', 
                          backgroundColor: '#f8f9fa', 
                          fontSize: '0.875rem',
                          color: '#1976d2',
                          padding: 2,
                          borderBottom: '2px solid #e0e0e0'
                        }}>Procurement Reference Number</TableCell>
                        <TableCell sx={{ 
                          fontWeight: 'bold', 
                          backgroundColor: '#f8f9fa', 
                          fontSize: '0.875rem',
                          color: '#1976d2',
                          padding: 2,
                          borderBottom: '2px solid #e0e0e0'
                        }}>Contract Name</TableCell>
                        <TableCell sx={{ 
                          fontWeight: 'bold', 
                          backgroundColor: '#f8f9fa', 
                          fontSize: '0.875rem',
                          color: '#1976d2',
                          padding: 2,
                          borderBottom: '2px solid #e0e0e0'
                        }}>Name of Contractor</TableCell>
                        <TableCell sx={{ 
                          fontWeight: 'bold', 
                          backgroundColor: '#f8f9fa', 
                          fontSize: '0.875rem',
                          color: '#1976d2',
                          padding: 2,
                          borderBottom: '2px solid #e0e0e0'
                        }}>Contract Status</TableCell>
                        <TableCell sx={{ 
                          fontWeight: 'bold', 
                          backgroundColor: '#f8f9fa', 
                          fontSize: '0.875rem',
                          color: '#1976d2',
                          padding: 2,
                          borderBottom: '2px solid #e0e0e0'
                        }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredContracts.map((contract, filteredIndex) => {
                        // Find the original index in the contracts array
                        const originalIndex = contracts.findIndex(c => c === contract);
                        return (
                          <TableRow key={originalIndex}>
                            <TableCell>{contract.contract_reference_number || 'N/A'}</TableCell>
                            <TableCell>{contract.contract_name || 'N/A'}</TableCell>
                            <TableCell>{contract.contractor_name || 'N/A'}</TableCell>
                            <TableCell>{contract.contract_status || 'N/A'}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <ButtonMui 
                                  size="small" 
                                  variant="outlined" 
                                  onClick={() => handleShowContract(originalIndex)}
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
                                  onClick={() => handleEditContract(originalIndex)}
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
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              
              {/* No search results message */}
              {contracts.length > 0 && filteredContracts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No contracts found matching your search criteria.</p>
                  <p className="text-sm mt-2">Try searching with different keywords or clear the search to see all contracts.</p>
                </div>
              )}
            </div>
          )}
          </div>
        ) : activeTab === "counterpart" ? (
          showCounterpartForm ? (
            <div style={{ paddingTop: '0px', position: 'relative', maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
              <div className="p-4">
                <h3 style={{ color: '#3F51B5', marginBottom: '24px', fontSize: '18px', fontWeight: 'bold' }}>
                  {currentCounterpartIndex !== null ? 'Edit Counterpart Funding Information' : 'Add Counterpart Funding Information'}
                </h3>
              
              {/* Main form fields */}
              <div className="mb-4">
                <TableContainer component={Paper} sx={{ boxShadow: "none", border: '1px solid #e0e0e0' }}>
                  <Table size="small" sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ 
                          padding: 2, 
                          width: "25%", 
                          fontWeight: 'bold', 
                          fontSize: '0.875rem',
                          color: 'black',
                          backgroundColor: '#f8f9fa',
                          borderBottom: '2px solid #e0e0e0'
                        }}>
                          Start Date (FY)
                        </TableCell>
                        <TableCell sx={{ 
                          padding: 2, 
                          width: "25%", 
                          fontWeight: 'bold', 
                          fontSize: '0.875rem',
                          color: 'black',
                          backgroundColor: '#f8f9fa',
                          borderBottom: '2px solid #e0e0e0'
                        }}>
                          End Date (FY)
                        </TableCell>
                        <TableCell sx={{ 
                          padding: 2, 
                          width: "25%", 
                          fontWeight: 'bold', 
                          fontSize: '0.875rem',
                          color: 'black',
                          backgroundColor: '#f8f9fa',
                          borderBottom: '2px solid #e0e0e0'
                        }}>
                          Financing Agreement Title
                        </TableCell>
                        <TableCell sx={{ 
                          padding: 2, 
                          width: "25%", 
                          fontWeight: 'bold', 
                          fontSize: '0.875rem',
                          color: 'black',
                          backgroundColor: '#f8f9fa',
                          borderBottom: '2px solid #e0e0e0'
                        }}>
                          Counterpart Requirement Specification
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ padding: 1 }}>
                          <Select
                            value={counterpartStartDate || ""}
                            onChange={handleCounterpartStartDateChange}
                            error={Boolean(counterpartDateErrors.counterpart_start_date || counterpartValidationErrors.counterpartStartDate)}
                            size="small"
                            fullWidth
                            displayEmpty
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
                            value={counterpartEndDate || ""}
                            onChange={handleCounterpartEndDateChange}
                            error={Boolean(counterpartDateErrors.counterpart_end_date || counterpartValidationErrors.counterpartEndDate)}
                            size="small"
                            fullWidth
                            displayEmpty
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
                            value={counterpartFinancingTitle || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              setCounterpartFinancingTitle(value);
                              // Clear validation error if field is now filled
                              if (value && counterpartValidationErrors.counterpartFinancingTitle) {
                                setCounterpartValidationErrors(prev => ({
                                  ...prev,
                                  counterpartFinancingTitle: ""
                                }));
                              }
                            }}
                            error={Boolean(counterpartValidationErrors.counterpartFinancingTitle)}
                            size="small"
                            fullWidth
                            displayEmpty
                            renderValue={(selected) => {
                              if (!selected) {
                                return <span style={{ color: '#999' }}>Select One....</span>;
                              }
                              return selected;
                            }}
                          >
                            <MenuItem value="Road Sector Support Project">Road Sector Support Project</MenuItem>
                            <MenuItem value="Education Development Project">Education Development Project</MenuItem>
                            <MenuItem value="Health Infrastructure Project">Health Infrastructure Project</MenuItem>
                            <MenuItem value="Water and Sanitation Project">Water and Sanitation Project</MenuItem>
                            <MenuItem value="Agriculture Modernization Project">Agriculture Modernization Project</MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell sx={{ padding: 1 }}>
                          <Select
                            value={counterpartRequirementSpec || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              setCounterpartRequirementSpec(value);
                              // Clear validation error if field is now filled
                              if (value && counterpartValidationErrors.counterpartRequirementSpec) {
                                setCounterpartValidationErrors(prev => ({
                                  ...prev,
                                  counterpartRequirementSpec: ""
                                }));
                              }
                            }}
                            error={Boolean(counterpartValidationErrors.counterpartRequirementSpec)}
                            size="small"
                            fullWidth
                            displayEmpty
                            renderValue={(selected) => {
                              if (!selected) {
                                return <span style={{ color: '#999' }}>Select One....</span>;
                              }
                              return selected;
                            }}
                          >
                            <MenuItem value="Land acquisition">Land acquisition</MenuItem>
                            <MenuItem value="Resettlement compensation">Resettlement compensation</MenuItem>
                            <MenuItem value="Local materials supply">Local materials supply</MenuItem>
                            <MenuItem value="Project management costs">Project management costs</MenuItem>
                            <MenuItem value="Environmental mitigation">Environmental mitigation</MenuItem>
                          </Select>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              {/* Counterpart Evidence, Item Code and Description of Activity Row */}
              <div className="mb-4">
                <TableContainer component={Paper} sx={{ boxShadow: "none", border: '1px solid #e0e0e0' }}>
                  <Table size="small" sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ 
                          padding: 2, 
                          width: "20%", 
                          fontWeight: 'bold', 
                          fontSize: '0.875rem',
                          color: 'black',
                          backgroundColor: '#f8f9fa',
                          borderBottom: '2px solid #e0e0e0'
                        }}>Item Code</TableCell>
                        <TableCell sx={{ 
                          padding: 2, 
                          width: "16.67%", 
                          fontWeight: 'bold', 
                          fontSize: '0.875rem',
                          color: 'black',
                          backgroundColor: '#f8f9fa',
                          borderBottom: '2px solid #e0e0e0',
                          whiteSpace: 'nowrap'
                        }}>Description of Activity</TableCell>
                        <TableCell sx={{ 
                          padding: 2, 
                          width: "20%", 
                          fontWeight: 'bold', 
                          fontSize: '0.875rem',
                          color: 'black',
                          backgroundColor: '#f8f9fa',
                          borderBottom: '2px solid #e0e0e0',
                          textAlign: 'center'
                        }}>Quantity</TableCell>
                        <TableCell sx={{ 
                          padding: 2, 
                          width: "16.67%", 
                          fontWeight: 'bold', 
                          fontSize: '0.875rem',
                          color: 'black',
                          backgroundColor: '#f8f9fa',
                          borderBottom: '2px solid #e0e0e0'
                        }}>Funding Source</TableCell>
                        <TableCell sx={{ 
                          padding: 2, 
                          width: "16.67%", 
                          fontWeight: 'bold', 
                          fontSize: '0.875rem',
                          color: 'black',
                          backgroundColor: '#f8f9fa',
                          borderBottom: '2px solid #e0e0e0'
                        }}>Counterpart Evidence</TableCell>
                        <TableCell sx={{ padding: 1, width: "5%" }}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        {/* Item Code */}
                        <TableCell sx={{ padding: 1, width: "20%" }}>
                          <Autocomplete
                            value={itemCodes.find(item => item.code === counterpartItemCode) || null}
                            onChange={(event, newValue) => {
                              if (newValue) {
                                handleCounterpartItemCodeChange(newValue.code);
                              } else {
                                handleCounterpartItemCodeChange("");
                              }
                            }}
                            options={itemCodes}
                            getOptionLabel={(option) => option.code}
                            isOptionEqualToValue={(option, value) => option.code === value?.code}
                            error={Boolean(counterpartValidationErrors.counterpartItemCode)}
                            filterOptions={(options, { inputValue }) => {
                              const filtered = options.filter((option) => {
                                const codeMatch = option.code.toLowerCase().includes(inputValue.toLowerCase());
                                const descriptionMatch = option.description.toLowerCase().includes(inputValue.toLowerCase());
                                return codeMatch || descriptionMatch;
                              });
                              return filtered;
                            }}
                            size="small"
                            fullWidth
                            disabled={itemCodesLoading}
                            loading={itemCodesLoading}
                            loadingText="Loading item codes..."
                            noOptionsText="No item codes found"
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder={itemCodesLoading ? 'Loading item codes...' : 'Search by item code or description...'}
                                variant="outlined"
                                error={Boolean(counterpartValidationErrors.counterpartItemCode)}
                                helperText={counterpartValidationErrors.counterpartItemCode || ""}
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      {itemCodesLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                      {params.InputProps.endAdornment}
                                    </>
                                  ),
                                }}
                              />
                            )}
                            renderOption={(props, option) => {
                              const { key, ...otherProps } = props;
                              return (
                                <li key={key} {...otherProps}>
                                  <div>
                                    <div style={{ fontWeight: 'bold' }}>{option.code}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{option.description}</div>
                                  </div>
                                </li>
                              );
                            }}
                          />
                        </TableCell>
                        {/* Description of Activity */}
                        <TableCell sx={{ padding: 1, width: "16.67%" }}>
                          <TextField
                            value={counterpartDescription || ""}
                            size="small"
                            fullWidth
                            placeholder="Auto-filled"
                            InputProps={{ readOnly: true }}
                            sx={{
                              '& .MuiInputBase-input': {
                                color: '#333',
                                fontWeight: '500'
                              }
                            }}
                          />
                        </TableCell>
                        {/* Quantity */}
                        <TableCell sx={{ padding: 1, width: "20%" }}>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <TextField
                              value={counterpartQuantity || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                // Only allow numbers and decimal point for the numeric part
                                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                  setCounterpartQuantity(value);
                                  // Clear validation error if field is now filled
                                  if (value && counterpartValidationErrors.counterpartQuantity) {
                                    setCounterpartValidationErrors(prev => ({
                                      ...prev,
                                      counterpartQuantity: ""
                                    }));
                                  }
                                }
                              }}
                              size="small"
                              placeholder="30"
                              type="number"
                              inputProps={{ min: 0, step: 0.01 }}
                              error={Boolean(counterpartValidationErrors.counterpartQuantity)}
                              sx={{ flex: 2, minWidth: 80 }}
                            />
                            <Select
                              value={counterpartQuantityUnit || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                setCounterpartQuantityUnit(value);
                                // Clear validation error if field is now filled
                                if (value && counterpartValidationErrors.counterpartQuantityUnit) {
                                  setCounterpartValidationErrors(prev => ({
                                    ...prev,
                                    counterpartQuantityUnit: ""
                                  }));
                                }
                              }}
                              size="small"
                              displayEmpty
                              error={Boolean(counterpartValidationErrors.counterpartQuantityUnit)}
                              renderValue={(selected) => {
                                if (!selected) {
                                  return <span style={{ color: '#999', fontSize: '0.75rem' }}>Unit</span>;
                                }
                                return selected;
                              }}
                              sx={{ flex: 1.5, minWidth: 120 }}
                            >
                              <MenuItem value="square meters">Square meters</MenuItem>
                              <MenuItem value="cubic meters">Cubic meters</MenuItem>
                              <MenuItem value="pieces">Pieces</MenuItem>
                              <MenuItem value="kg">Kilograms (kg)</MenuItem>
                              <MenuItem value="litres">Liters</MenuItem>
                              <MenuItem value="hectares">Hectares</MenuItem>
                              <MenuItem value="square feet">Square feet</MenuItem>
                              <MenuItem value="cubic feet">Cubic feet</MenuItem>
                              <MenuItem value="tons">Tons</MenuItem>
                              <MenuItem value="gallons">Gallons</MenuItem>
                              <MenuItem value="units">Units</MenuItem>
                              <MenuItem value="hours">Hours</MenuItem>
                              <MenuItem value="days">Days</MenuItem>
                              <MenuItem value="meters">Meters</MenuItem>
                              <MenuItem value="feet">Feet</MenuItem>
                              <MenuItem value="other">Other</MenuItem>
                            </Select>
                          </Box>
                          {(counterpartValidationErrors.counterpartQuantity || counterpartValidationErrors.counterpartQuantityUnit) && (
                            <Typography variant="caption" color="error" sx={{ fontSize: '0.75rem', mt: 0.5 }}>
                              {counterpartValidationErrors.counterpartQuantity || counterpartValidationErrors.counterpartQuantityUnit}
                            </Typography>
                          )}
                        </TableCell>
                        {/* Funding Source */}
                        <TableCell sx={{ padding: 1, width: "16.67%" }}>
                          <Select
                            value={counterpartFundingSource || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              setCounterpartFundingSource(value);
                              
                              // Clear pipeline data for the other funding source when switching
                              if (value === "External") {
                                setCounterpartPipelineGoU({});
                              } else if (value === "GoU") {
                                setCounterpartPipelineExternal({});
                              }
                              
                              // Clear validation error if field is now filled
                              if (value && counterpartValidationErrors.counterpartFundingSource) {
                                setCounterpartValidationErrors(prev => ({
                                  ...prev,
                                  counterpartFundingSource: ""
                                }));
                              }
                            }}
                            size="small"
                            fullWidth
                            displayEmpty
                            error={Boolean(counterpartValidationErrors.counterpartFundingSource)}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <span style={{ color: '#999' }}>Select One....</span>;
                              }
                              return selected;
                            }}
                          >
                            <MenuItem value="GoU">GoU</MenuItem>
                            <MenuItem value="External">External</MenuItem>
                          </Select>
                        </TableCell>
                        {/* Counterpart Evidence Upload */}
                        <TableCell sx={{ padding: 1, width: "16.67%" }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'flex-start' }}>
                            <input
                              accept=".pdf,.jpg,.jpeg,.png,.gif"
                              style={{ display: 'none' }}
                              id="counterpart-evidence-upload"
                              type="file"
                              onChange={handleCounterpartEvidenceUpload}
                              disabled={isSubmitting}
                            />
                            <label htmlFor="counterpart-evidence-upload">
                              <Button
                                variant="outlined"
                                component="span"
                                size="small"
                                disabled={isSubmitting}
                                sx={{ 
                                  width: '120px',
                                  height: '32px',
                                  fontSize: '0.7rem',
                                  borderStyle: 'dashed',
                                  borderColor: counterpartEvidenceFile ? 'success.main' : (counterpartValidationErrors.counterpartEvidenceFile ? 'error.main' : 'primary.main'),
                                  color: counterpartEvidenceFile ? 'success.main' : (counterpartValidationErrors.counterpartEvidenceFile ? 'error.main' : 'primary.main'),
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  '&:hover': {
                                    borderStyle: 'dashed',
                                    borderColor: counterpartEvidenceFile ? 'success.dark' : (counterpartValidationErrors.counterpartEvidenceFile ? 'error.dark' : 'primary.dark'),
                                  }
                                }}
                              >
                                Upload Evidence
                              </Button>
                            </label>
                            {counterpartEvidenceFile && (
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  fontSize: '0.7rem',
                                  color: 'success.main',
                                  fontWeight: 'bold',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  maxWidth: '150px',
                                  display: 'block',
                                  textAlign: 'left'
                                }}
                              >
                                {counterpartEvidenceFile.name}
                              </Typography>
                            )}
                            {/* <Typography variant="caption" sx={{ 
                              color: '#666', 
                              fontSize: '0.7rem',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: '150px'
                            }}>
                              PDF or Image files only (max 10MB).
                            </Typography> */}
                          </Box>
                          {counterpartValidationErrors.counterpartEvidenceFile && (
                            <Typography variant="caption" color="error" sx={{ fontSize: '0.75rem', mt: 0.5 }}>
                              {counterpartValidationErrors.counterpartEvidenceFile}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ padding: 1, width: "5%" }}></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              {/* Second row: Value, Disbursed and Balance fields */}
              <div className="mb-4">
                <TableContainer component={Paper} sx={{ boxShadow: "none", border: '1px solid #e0e0e0' }}>
                  <Table size="small" sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ 
                          padding: 2, 
                          width: "25%", 
                          fontWeight: 'bold', 
                          fontSize: '0.875rem',
                          color: 'black',
                          backgroundColor: '#f8f9fa',
                          borderBottom: '2px solid #e0e0e0'
                        }}>
                          Counterpart Value
                        </TableCell>
                        <TableCell sx={{ 
                          padding: 2, 
                          width: "25%", 
                          fontWeight: 'bold', 
                          fontSize: '0.875rem',
                          color: 'black',
                          backgroundColor: '#f8f9fa',
                          borderBottom: '2px solid #e0e0e0'
                        }}>
                          {counterpartFundingSource === "External" ? "Counterpart Disbursed" : "Counterpart Released"}
                        </TableCell>
                        <TableCell sx={{ 
                          padding: 2, 
                          width: "25%", 
                          fontWeight: 'bold', 
                          fontSize: '0.875rem',
                          color: 'black',
                          backgroundColor: '#f8f9fa',
                          borderBottom: '2px solid #e0e0e0'
                        }}>
                          Balance on Counterpart
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        {/* Counterpart Value */}
                        <TableCell sx={{ padding: 1 }}>
                          <TextField
                            value={formatWithCommas(counterpartValue)}
                            onChange={(e) => {
                              const raw = e.target.value || "";
                              const cleaned = raw.replace(/,/g, "");
                              if (/^\d*$/.test(cleaned)) {
                                setCounterpartValue(cleaned);
                                // Clear validation error if field is now filled
                                if (cleaned && counterpartValidationErrors.counterpartValue) {
                                  setCounterpartValidationErrors(prev => ({
                                    ...prev,
                                    counterpartValue: ""
                                  }));
                                }
                              }
                            }}
                            error={Boolean(counterpartValidationErrors.counterpartValue)}
                            size="small"
                            fullWidth
                            placeholder="e.g. 2,000,000,000"
                            inputMode="numeric"
                          />
                        </TableCell>
                        <TableCell sx={{ padding: 1 }}>
                          <TextField
                            value={formatWithCommas(counterpartDisbursed)}
                            onChange={(e) => {
                              const raw = e.target.value || "";
                              const cleaned = raw.replace(/,/g, "");
                              if (/^\d*$/.test(cleaned)) {
                                setCounterpartDisbursed(cleaned);
                                // Clear validation error if field is now filled
                                if (cleaned && counterpartValidationErrors.counterpartDisbursed) {
                                  setCounterpartValidationErrors(prev => ({
                                    ...prev,
                                    counterpartDisbursed: ""
                                  }));
                                }
                              }
                            }}
                            error={Boolean(counterpartValidationErrors.counterpartDisbursed)}
                            size="small"
                            fullWidth
                            placeholder="e.g. 1,000,000,000"
                            inputMode="numeric"
                          />
                        </TableCell>
                        <TableCell sx={{ padding: 1 }}>
                          <TextField
                            value={formatWithCommas(counterpartBalance)}
                            size="small"
                            fullWidth
                            placeholder="Auto-calculated"
                            disabled
                            sx={{
                              '& .MuiInputBase-input': {
                                backgroundColor: '#f5f5f5',
                                color: '#333',
                                fontWeight: '500'
                              }
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              {/* Fiscal Years Display with External and GoU inputs */}
              {counterpartFyHeaders.length > 0 && (
                <div className="mb-4">
                  <h4 style={{ color: '#3F51B5', marginBottom: '16px', fontSize: '16px', fontWeight: 'bold' }}>
                    Fiscal Years in Project Duration
                  </h4>
                  <TableContainer component={Paper} sx={{ boxShadow: "none", border: '1px solid #e0e0e0' }}>
                    <Table size="small" sx={{ minWidth: 650 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ 
                            padding: 2, 
                            width: "15%", 
                            fontWeight: 'bold', 
                            fontSize: '0.875rem',
                            color: 'black',
                            backgroundColor: '#f8f9fa',
                            borderBottom: '2px solid #e0e0e0'
                          }}>
                            Funding Source
                          </TableCell>
                          {counterpartFyHeaders.map((fy) => (
                            <TableCell key={fy} sx={{ 
                              padding: 2, 
                              fontWeight: 'bold', 
                              fontSize: '0.875rem',
                              color: 'black',
                              backgroundColor: '#f8f9fa',
                              borderBottom: '2px solid #e0e0e0',
                              textAlign: 'center' 
                            }}>
                              {fy}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {/* External row - only show if External is selected */}
                        {counterpartFundingSource === "External" && (
                        <TableRow>
                          <TableCell sx={{ padding: 1, fontWeight: 'bold', backgroundColor: '#f8f9ff' }}>
                            External
                          </TableCell>
                          {counterpartFyHeaders.map((fy) => (
                            <TableCell key={`external-${fy}`} sx={{ padding: 1 }}>
                              <TextField
                                value={formatWithCommas(counterpartPipelineExternal[fy] || "")}
                                onChange={handleCounterpartPipelineChange('external', fy)}
                                size="small"
                                fullWidth
                                placeholder="0"
                                inputMode="numeric"
                                sx={{ '& input': { textAlign: 'center' } }}
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                        )}
                        {/* GoU row - only show if GoU is selected */}
                        {counterpartFundingSource === "GoU" && (
                        <TableRow>
                          <TableCell sx={{ padding: 1, fontWeight: 'bold', backgroundColor: '#f8f9ff' }}>
                            GoU
                          </TableCell>
                          {counterpartFyHeaders.map((fy) => (
                            <TableCell key={`gou-${fy}`} sx={{ padding: 1 }}>
                              <TextField
                                value={formatWithCommas(counterpartPipelineGoU[fy] || "")}
                                onChange={handleCounterpartPipelineChange('gou', fy)}
                                size="small"
                                fullWidth
                                placeholder="0"
                                inputMode="numeric"
                                sx={{ '& input': { textAlign: 'center' } }}
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              )}
              
              {/* Save and Cancel buttons */}
              <div className="p-4">
                <div className="flex gap-3">
                  <ButtonMui 
                    type="button" 
                    variant="contained" 
                    onClick={handleSaveCounterpart}
                    disabled={isSubmitting}
                    sx={buttonStyles}
                  >
                    Save counterpart data
                  </ButtonMui>
                  <ButtonMui 
                    type="button" 
                    variant="contained" 
                    onClick={handleCancelCounterpart}
                    disabled={isSubmitting}
                    sx={buttonStyles}
                  >
                    Cancel
                  </ButtonMui>
                </div>
              </div>
            </div>
          </div>
          ) : (
            // Counterpart List View
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Counterpart Management</h3>
                <ButtonMui onClick={handleAddCounterpart} variant="contained" startIcon={<AddIcon />} sx={buttonStyles}>
                  Add Counterpart
                </ButtonMui>
              </div>
              
              {/* Search Filter */}
              {counterparts.length > 0 && (
                <div className="mb-4">
                  <TextField
                    fullWidth
                    placeholder="Search counterparts by start date, end date, financing title, requirement spec, or values..."
                    value={counterpartSearchTerm}
                    onChange={(e) => setCounterpartSearchTerm(e.target.value)}
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
              {counterparts.length > 0 && counterpartSearchTerm && (
                <div className="mb-2 text-sm text-gray-600">
                  {filteredCounterparts.length} of {counterparts.length} counterparts found
                </div>
              )}
              
              {/* Counterpart List */}
              {counterparts.length > 0 ? (
                <TableContainer component={Paper} sx={{ boxShadow: "none", border: '1px solid #e0e0e0' }}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ 
                          fontWeight: 'bold', 
                          backgroundColor: '#f8f9fa', 
                          fontSize: '0.875rem',
                          color: '#1976d2',
                          padding: 2,
                          borderBottom: '2px solid #e0e0e0'
                        }}>Project Start Date</TableCell>
                        <TableCell sx={{ 
                          fontWeight: 'bold', 
                          backgroundColor: '#f8f9fa', 
                          fontSize: '0.875rem',
                          color: '#1976d2',
                          padding: 2,
                          borderBottom: '2px solid #e0e0e0'
                        }}>Project End Date</TableCell>
                        <TableCell sx={{ 
                          fontWeight: 'bold', 
                          backgroundColor: '#f8f9fa', 
                          fontSize: '0.875rem',
                          color: '#1976d2',
                          padding: 2,
                          borderBottom: '2px solid #e0e0e0'
                        }}>Financing Agreement Title</TableCell>
                        <TableCell sx={{ 
                          fontWeight: 'bold', 
                          backgroundColor: '#f8f9fa', 
                          fontSize: '0.875rem',
                          color: '#1976d2',
                          padding: 2,
                          borderBottom: '2px solid #e0e0e0'
                        }}>Counterpart Value</TableCell>
                        <TableCell sx={{ 
                          fontWeight: 'bold', 
                          backgroundColor: '#f8f9fa', 
                          fontSize: '0.875rem',
                          color: '#1976d2',
                          padding: 2,
                          borderBottom: '2px solid #e0e0e0'
                        }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredCounterparts.map((counterpart, filteredIndex) => {
                        // Find the original index in the counterparts array
                        const originalIndex = counterparts.findIndex(c => c === counterpart);
                        return (
                          <TableRow key={originalIndex}>
                            <TableCell>{counterpart.counterpartStartDate || 'N/A'}</TableCell>
                            <TableCell>{counterpart.counterpartEndDate || 'N/A'}</TableCell>
                            <TableCell>{counterpart.counterpartFinancingTitle || 'N/A'}</TableCell>
                            <TableCell>{formatWithCommas(counterpart.counterpartValue) || 'N/A'}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <ButtonMui 
                                  size="small" 
                                  variant="outlined" 
                                  onClick={() => handleShowCounterpart(originalIndex)}
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
                                  onClick={() => handleEditCounterpart(originalIndex)}
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
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No counterpart entries found.</p>
                  <p className="text-sm mt-2">Click "Add Counterpart" to create your first counterpart funding entry.</p>
                </div>
              )}
              
              {/* No search results message */}
              {counterparts.length > 0 && filteredCounterparts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No counterparts found matching your search criteria.</p>
                  <p className="text-sm mt-2">Try searching with different keywords or clear the search to see all counterparts.</p>
                </div>
              )}
            </div>
          )
        ) : activeTab === "myc_report" ? (
          <MYCReport
            contracts={contracts}
            nonContractualEntries={nonContractualEntries}
            counterparts={counterparts}
            procurementEntries={procurementEntries}
            projectData={projectData}
          />
        ) : activeTab === "add_myc_info" ? (
          <div className="p-4" style={{ position: 'relative', maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
            <h3 style={{ color: '#3F51B5', marginBottom: '24px', fontSize: '18px', fontWeight: 'bold' }}>
              Additional MYC Information
            </h3>
            
            {/* File Upload Section */}
            <Paper sx={{ boxShadow: 'none', border: '1px solid #e0e0e0', padding: '24px', marginBottom: '24px' }}>
              <h4 style={{ color: '#333', marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
                Upload Documents
              </h4>
              <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
                Upload Excel (.xlsx, .xls), Word (.docx, .doc), or PDF files. Maximum file size: 10MB per file.
              </p>
              
              {/* Upload Area */}
              <div style={{
                border: '2px dashed #3F51B5',
                borderRadius: '8px',
                padding: '32px',
                textAlign: 'center',
                backgroundColor: '#f8f9ff',
                marginBottom: '24px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => document.getElementById('file-upload').click()}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f0f2ff';
                e.target.style.borderColor = '#283593';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#f8f9ff';
                e.target.style.borderColor = '#3F51B5';
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
                <h5 style={{ color: '#3F51B5', marginBottom: '8px', fontSize: '16px', fontWeight: '600' }}>
                  Click to Upload Files
                </h5>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                  Drag and drop files here or click to browse
                </p>
                <p style={{ color: '#999', fontSize: '12px', margin: '8px 0 0 0' }}>
                  Supported formats: Excel (.xlsx, .xls), Word (.docx, .doc), PDF (.pdf)
                </p>
              </div>
              
              <input
                id="file-upload"
                type="file"
                multiple
                accept=".xlsx,.xls,.docx,.doc,.pdf"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              
              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div>
                  <h5 style={{ color: '#333', marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
                    Uploaded Files ({uploadedFiles.length})
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {uploadedFiles.map((file) => (
                      <div key={file.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '6px',
                        border: '1px solid #e0e0e0'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '24px' }}>{getFileIcon(file.type)}</span>
                          <div>
                            <div style={{ fontWeight: '600', color: '#333', fontSize: '14px' }}>
                              {file.name}
                            </div>
                            <div style={{ color: '#666', fontSize: '12px' }}>
                              {formatFileSize(file.size)} • {new Date(file.uploadDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {/* Upload Progress */}
                          {uploadProgress[file.id] !== undefined && uploadProgress[file.id] < 100 && (
                            <div style={{ width: '100px', height: '4px', backgroundColor: '#e0e0e0', borderRadius: '2px', overflow: 'hidden' }}>
                              <div style={{
                                width: `${uploadProgress[file.id]}%`,
                                height: '100%',
                                backgroundColor: '#3F51B5',
                                transition: 'width 0.3s ease'
                              }} />
                            </div>
                          )}
                          
                          {/* Remove Button */}
                          <Button
                            size="small"
                            onClick={() => handleFileRemove(file.id)}
                            sx={{
                              minWidth: 'auto',
                              padding: '4px 8px',
                              color: '#d32f2f',
                              '&:hover': {
                                backgroundColor: '#ffebee'
                              }
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Paper>
            
            {/* Additional Information Section */}
            <Paper sx={{ boxShadow: 'none', border: '1px solid #e0e0e0', padding: '24px' }}>
              <h4 style={{ color: '#333', marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
                Additional Information
              </h4>
              <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
                Use this section to upload any additional documents, reports, or supplementary materials 
                related to your MYC information. This may include:
              </p>
              <ul style={{ color: '#666', fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px' }}>
                <li>Contract amendments or modifications</li>
                <li>Performance reports and evaluations</li>
                <li>Financial statements and budget documents</li>
                <li>Technical specifications and requirements</li>
                <li>Compliance documentation</li>
                <li>Any other relevant supporting materials</li>
              </ul>
            </Paper>
          </div>
        ) : (
          <div className="p-4">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-semibold">Non-Contractual Management</h3>
               <ButtonMui
                 variant="contained"
                 startIcon={<AddIcon />}
                 onClick={() => setShowNonContractualForm(true)}
                 sx={buttonStyles}
               >
                 Add Non-Contractual
               </ButtonMui>
             </div>
              
              {/* Search Filter */}
              {nonContractualEntries.length > 0 && !showNonContractualForm && (
                <div className="mb-4">
                  <TextField
                    fullWidth
                    placeholder="Search non-contractual entries by vote code, item code, description of activity, start date, end date..."
                    value={nonContractualSearchTerm || ''}
                    onChange={(e) => setNonContractualSearchTerm(e.target.value)}
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
              {nonContractualEntries.length > 0 && nonContractualSearchTerm && !showNonContractualForm && (
                <div className="mb-2 text-sm text-gray-600">
                  {filteredNonContractualData.length} of {nonContractualEntries.length} entries found
                </div>
              )}
              
              {/* Non-Contractual List */}
              {nonContractualEntries.length > 0 && !showNonContractualForm ? (
                <TableContainer component={Paper} sx={{ boxShadow: "none", border: '1px solid #e0e0e0' }}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ 
                          fontWeight: 'bold', 
                          backgroundColor: '#f8f9fa', 
                          fontSize: '0.875rem',
                          color: '#1976d2',
                          padding: 2,
                          borderBottom: '2px solid #e0e0e0'
                        }}>Vote Code</TableCell>
                        <TableCell sx={{ 
                          fontWeight: 'bold', 
                          backgroundColor: '#f8f9fa', 
                          fontSize: '0.875rem',
                          color: '#1976d2',
                          padding: 2,
                          borderBottom: '2px solid #e0e0e0'
                        }}>Item Code</TableCell>
                        <TableCell sx={{ 
                          fontWeight: 'bold', 
                          backgroundColor: '#f8f9fa', 
                          fontSize: '0.875rem',
                          color: '#1976d2',
                          padding: 2,
                          borderBottom: '2px solid #e0e0e0'
                        }}>Description of Activity</TableCell>
                        <TableCell sx={{ 
                          fontWeight: 'bold', 
                          backgroundColor: '#f8f9fa', 
                          fontSize: '0.875rem',
                          color: '#1976d2',
                          padding: 2,
                          borderBottom: '2px solid #e0e0e0'
                        }}>Start Date</TableCell>
                        <TableCell sx={{ 
                          fontWeight: 'bold', 
                          backgroundColor: '#f8f9fa', 
                          fontSize: '0.875rem',
                          color: '#1976d2',
                          padding: 2,
                          borderBottom: '2px solid #e0e0e0'
                        }}>End Date</TableCell>
                        <TableCell sx={{ 
                          fontWeight: 'bold', 
                          backgroundColor: '#f8f9fa', 
                          fontSize: '0.875rem',
                          color: '#1976d2',
                          padding: 2,
                          borderBottom: '2px solid #e0e0e0',
                          textAlign: 'center'
                        }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(filteredNonContractualData || nonContractualEntries).map((entry, filteredIndex) => {
                        // Find the original index in the nonContractualEntries array
                        const originalIndex = nonContractualEntries.findIndex(e => e === entry);
                        // Get PBS data for this project code
                        const pbsData = nonContractualData.find(pbs => pbs.Project_Code === projectData.code) || {};
                        
                        // Debug logging (remove in production)
                        if (!pbsData.Vote_Code && nonContractualData.length > 0) {
                          console.log('🔍 PBS Data Debug:', {
                            projectCode: projectData.code,
                            pbsDataFound: !!pbsData.Vote_Code,
                            totalPbsRecords: nonContractualData.length,
                            samplePbsRecord: nonContractualData[0],
                            matchingRecord: nonContractualData.find(pbs => pbs.Project_Code === projectData.code)
                          });
                        }
                        return (
                          <TableRow key={originalIndex}>
                            <TableCell sx={{ fontSize: '0.875rem' }}>
                              {nonContractualLoading ? (
                                <span style={{ color: '#666', fontStyle: 'italic' }}>Loading...</span>
                              ) : pbsData.Vote_Code ? (
                                pbsData.Vote_Code
                              ) : (
                                <span style={{ color: '#999', fontStyle: 'italic' }}>Not available</span>
                              )}
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.875rem' }}>{entry.itemCode || 'N/A'}</TableCell>
                            <TableCell sx={{ fontSize: '0.875rem', wordWrap: 'break-word', whiteSpace: 'normal', maxWidth: '300px' }}>{entry.description}</TableCell>
                            <TableCell sx={{ fontSize: '0.875rem' }}>{entry.startDate || 'N/A'}</TableCell>
                            <TableCell sx={{ fontSize: '0.875rem' }}>{entry.endDate || 'N/A'}</TableCell>
                            <TableCell sx={{ fontSize: '0.875rem', textAlign: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <ButtonMui 
                                  size="small" 
                                  variant="outlined" 
                                  onClick={() => handleShowNonContractual(originalIndex)}
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
                                  onClick={() => handleEditNonContractual(originalIndex)}
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
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : !showNonContractualForm ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No non-contractual entries found.</p>
                  <p className="text-sm mt-2">Click "Add Non-Contractual" to create your first non-contractual entry.</p>
                </div>
              ) : null}
              
              {/* No search results message */}
              {nonContractualEntries.length > 0 && filteredNonContractualData.length === 0 && !showNonContractualForm && (
                <div className="text-center py-8 text-gray-500">
                  <p>No non-contractual entries found matching your search criteria.</p>
                  <p className="text-sm mt-2">Try searching with different keywords or clear the search to see all entries.</p>
                </div>
              )}

            {showNonContractualForm ? (
              <div style={{ position: 'relative', maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
                <h4 style={{ color: '#3F51B5', marginBottom: '16px', fontSize: '16px', fontWeight: 'bold' }}>
                  {currentNonContractualIndex !== null ? 'Edit Non-Contractual Entry' : 'Add Non-Contractual Entry'}
                </h4>
            
            {/* Hidden fields for Vote Code and Project Code */}
            <div style={{ display: 'none' }}>
              <input type="hidden" value={projectData.vote_code || ''} />
              <input type="hidden" value={projectData.code || ''} />
            </div>

            {/* Main form fields */}
            <div className="mb-4">
              <TableContainer component={Paper} sx={{ boxShadow: "none", border: '1px solid #e0e0e0' }}>
                <Table size="small" sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ 
                        padding: 2, 
                        width: "20%", 
                        fontWeight: 'bold', 
                        backgroundColor: '#f8f9fa',
                        fontSize: '0.875rem',
                        color: 'black',
                        borderBottom: '2px solid #e0e0e0'
                      }}>
                        Item Code
                      </TableCell>
                      <TableCell sx={{ 
                        padding: 2, 
                        width: "40%", 
                        fontWeight: 'bold', 
                        backgroundColor: '#f8f9fa',
                        fontSize: '0.875rem',
                        color: 'black',
                        borderBottom: '2px solid #e0e0e0'
                      }}>
                        Description of Activity
                      </TableCell>
                      <TableCell sx={{ 
                        padding: 2, 
                        width: "20%", 
                        fontWeight: 'bold', 
                        backgroundColor: '#f8f9fa',
                        fontSize: '0.875rem',
                        color: 'black',
                        borderBottom: '2px solid #e0e0e0'
                      }}>
                        Start Date (FY)
                      </TableCell>
                      <TableCell sx={{ 
                        padding: 2, 
                        width: "20%", 
                        fontWeight: 'bold', 
                        backgroundColor: '#f8f9fa',
                        fontSize: '0.875rem',
                        color: 'black',
                        borderBottom: '2px solid #e0e0e0'
                      }}>
                        End Date (FY)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ padding: 1 }}>
                        <Autocomplete
                          value={itemCodes.find(item => item.code === nonContractualItemCode) || null}
                          onChange={(event, newValue) => {
                            if (newValue) {
                              handleItemCodeChange(newValue.code);
                            } else {
                              handleItemCodeChange("");
                            }
                            // Clear validation error when user makes a selection
                            if (nonContractualValidationErrors.itemCode) {
                              setNonContractualValidationErrors(prev => ({
                                ...prev,
                                itemCode: undefined
                              }));
                            }
                          }}
                          options={itemCodes}
                          getOptionLabel={(option) => option.code}
                          isOptionEqualToValue={(option, value) => option.code === value?.code}
                          filterOptions={(options, { inputValue }) => {
                            const filtered = options.filter((option) => {
                              const codeMatch = option.code.toLowerCase().includes(inputValue.toLowerCase());
                              const descriptionMatch = option.description.toLowerCase().includes(inputValue.toLowerCase());
                              return codeMatch || descriptionMatch;
                            });
                            return filtered;
                          }}
                          size="small"
                          fullWidth
                          disabled={itemCodesLoading}
                          loading={itemCodesLoading}
                          loadingText="Loading item codes..."
                          noOptionsText="No item codes found"
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={itemCodesLoading ? 'Loading item codes...' : 'Search by item code or description...'}
                              variant="outlined"
                              error={!!nonContractualValidationErrors.itemCode}
                              helperText={nonContractualValidationErrors.itemCode}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {itemCodesLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                  </>
                                ),
                              }}
                            />
                          )}
                            renderOption={(props, option) => {
                              const { key, ...otherProps } = props;
                              return (
                                <li key={key} {...otherProps}>
                                  <div>
                                    <div style={{ fontWeight: 'bold' }}>{option.code}</div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>{option.description}</div>
                                  </div>
                                </li>
                              );
                            }}
                        />
                      </TableCell>
                      <TableCell sx={{ padding: 1 }}>
                        <TextField
                          value={nonContractualDescription || ""}
                          size="small"
                          fullWidth
                          placeholder="Auto-filled"
                          InputProps={{ readOnly: true }}
                          sx={{
                            '& .MuiInputBase-input': {
                              color: '#333',
                              fontWeight: '500'
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ padding: 1 }}>
                        <FormControl 
                          size="small" 
                          fullWidth 
                          error={!!nonContractualValidationErrors.startDate}
                        >
                          <Select
                            value={nonContractualStartDate || ""}
                            onChange={(e) => {
                              setNonContractualStartDate(e.target.value);
                              // Clear validation error when user makes a selection
                              if (nonContractualValidationErrors.startDate) {
                                setNonContractualValidationErrors(prev => ({
                                  ...prev,
                                  startDate: undefined
                                }));
                              }
                            }}
                            displayEmpty
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
                          {nonContractualValidationErrors.startDate && (
                            <FormHelperText>{nonContractualValidationErrors.startDate}</FormHelperText>
                          )}
                        </FormControl>
                      </TableCell>
                      <TableCell sx={{ padding: 1 }}>
                        <FormControl 
                          size="small" 
                          fullWidth 
                          error={!!nonContractualValidationErrors.endDate}
                        >
                          <Select
                            value={nonContractualEndDate || ""}
                            onChange={(e) => {
                              setNonContractualEndDate(e.target.value);
                              // Clear validation error when user makes a selection
                              if (nonContractualValidationErrors.endDate) {
                                setNonContractualValidationErrors(prev => ({
                                  ...prev,
                                  endDate: undefined
                                }));
                              }
                            }}
                            displayEmpty
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
                          {nonContractualValidationErrors.endDate && (
                            <FormHelperText>{nonContractualValidationErrors.endDate}</FormHelperText>
                          )}
                        </FormControl>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            {/* Counterpart fields: Funding Source, Project Value, Funds Released, Balance */}
            <div className="mb-4">
              <TableContainer component={Paper} sx={{ boxShadow: "none", border: '1px solid #e0e0e0' }}>
                <Table size="small" sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ 
                        padding: 2, 
                        width: "25%", 
                        fontWeight: 'bold', 
                        fontSize: '0.875rem',
                        color: 'black',
                        backgroundColor: '#f8f9fa',
                        borderBottom: '2px solid #e0e0e0'
                      }}>
                        Funding Source
                      </TableCell>
                      <TableCell sx={{ 
                        padding: 2, 
                        width: "25%", 
                        fontWeight: 'bold', 
                        fontSize: '0.875rem',
                        color: 'black',
                        backgroundColor: '#f8f9fa',
                        borderBottom: '2px solid #e0e0e0'
                      }}>
                        Project Value
                      </TableCell>
                      <TableCell sx={{ 
                        padding: 2, 
                        width: "25%", 
                        fontWeight: 'bold', 
                        fontSize: '0.875rem',
                        color: 'black',
                        backgroundColor: '#f8f9fa',
                        borderBottom: '2px solid #e0e0e0'
                      }}>
                        Funds Released
                      </TableCell>
                      <TableCell sx={{ 
                        padding: 2, 
                        width: "25%", 
                        fontWeight: 'bold', 
                        fontSize: '0.875rem',
                        color: 'black',
                        backgroundColor: '#f8f9fa',
                        borderBottom: '2px solid #e0e0e0'
                      }}>
                        Balance
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      {/* Funding Source */}
                      <TableCell sx={{ padding: 1 }}>
                        <Select
                          value={nonContractualFundingSource}
                          onChange={(e) => {
                            const value = e.target.value;
                            setNonContractualFundingSource(value);
                            
                            // Clear pipeline data for the other funding source when switching
                            if (value === "External") {
                              setNonContractualPipelineGoU({});
                              setNonContractualGoUAmount(""); // Reset GoU amount
                            } else if (value === "GoU") {
                              setNonContractualPipelineExternal({});
                              setNonContractualExternalAmount(""); // Reset External amount
                            }
                          }}
                          size="small"
                          fullWidth
                          displayEmpty
                          renderValue={(selected) => {
                            if (!selected) {
                              return <span style={{ color: '#999' }}>Select One....</span>;
                            }
                            return selected;
                          }}
                        >
                          <MenuItem value="GoU">GoU</MenuItem>
                          <MenuItem value="External">External</MenuItem>
                        </Select>
                      </TableCell>
                      {/* Project Value */}
                      <TableCell sx={{ padding: 1 }}>
                        <TextField
                          value={formatWithCommas(nonContractualCounterpartValue)}
                          onChange={(e) => {
                            const raw = e.target.value || "";
                            const cleaned = raw.replace(/,/g, "");
                            if (/^\d*$/.test(cleaned)) {
                              setNonContractualCounterpartValue(cleaned);
                            }
                          }}
                          size="small"
                          fullWidth
                          placeholder="e.g. 2,000,000,000"
                          inputMode="numeric"
                        />
                      </TableCell>
                      {/* Funds Released */}
                      <TableCell sx={{ padding: 1 }}>
                        <TextField
                          value={formatWithCommas(nonContractualCounterpartReleased)}
                          onChange={(e) => {
                            const raw = e.target.value || "";
                            const cleaned = raw.replace(/,/g, "");
                            if (/^\d*$/.test(cleaned)) {
                              setNonContractualCounterpartReleased(cleaned);
                            }
                          }}
                          size="small"
                          fullWidth
                          placeholder="e.g. 1,000,000,000"
                          inputMode="numeric"
                        />
                      </TableCell>
                      {/* Balance */}
                      <TableCell sx={{ padding: 1 }}>
                        <TextField
                          value={formatWithCommas(nonContractualCounterpartBalance)}
                          size="small"
                          fullWidth
                          placeholder="Auto-calculated"
                          disabled
                          sx={{
                            '& .MuiInputBase-input': {
                              backgroundColor: '#f5f5f5',
                              color: '#333',
                              fontWeight: '500'
                            }
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            {/* Fiscal Years Display */}
            {nonContractualFyHeaders.length > 0 && (
              <div className="mb-4">
                <h4 style={{ color: '#3F51B5', marginBottom: '16px', fontSize: '16px', fontWeight: 'bold' }}>
                  Fiscal Years in Project Duration
                </h4>
                <TableContainer component={Paper} sx={{ boxShadow: "none", border: '1px solid #e0e0e0' }}>
                  <Table size="small" sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ 
                          padding: 2, 
                          width: "15%", 
                          fontWeight: 'bold', 
                          backgroundColor: '#f8f9fa',
                          fontSize: '0.875rem',
                          color: 'black',
                          borderBottom: '2px solid #e0e0e0'
                        }}>
                          Funding Source
                        </TableCell>
                        {nonContractualFyHeaders.map((fy) => (
                          <TableCell key={fy} sx={{ 
                            padding: 2, 
                            fontWeight: 'bold', 
                            backgroundColor: '#f8f9fa',
                            fontSize: '0.875rem',
                            color: 'black',
                            borderBottom: '2px solid #e0e0e0',
                            textAlign: 'center' 
                          }}>
                            {fy}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* GoU row - only show if GoU is selected */}
                      {nonContractualFundingSource === "GoU" && (
                      <TableRow>
                        <TableCell sx={{ padding: 1, fontWeight: 'bold', backgroundColor: '#f8f9ff' }}>
                          GoU
                        </TableCell>
                        {nonContractualFyHeaders.map((fy) => (
                          <TableCell key={`gou-${fy}`} sx={{ padding: 1 }}>
                            <TextField
                              value={formatWithCommas(nonContractualPipelineGoU[fy] || "")}
                              onChange={(e) => {
                                const raw = e.target.value || "";
                                const cleaned = raw.replace(/,/g, "");
                                if (/^\d*$/.test(cleaned)) {
                                  setNonContractualPipelineGoU(prev => {
                                    const updated = { ...prev, [fy]: cleaned };
                                    // Calculate total GoU amount
                                    const total = Object.values(updated).reduce((sum, val) => sum + Number(val || 0), 0);
                                    setNonContractualGoUAmount(total.toString());
                                    return updated;
                                  });
                                }
                              }}
                              size="small"
                              fullWidth
                              placeholder="0"
                              inputMode="numeric"
                              sx={{ '& input': { textAlign: 'center' } }}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                      )}
                      {/* External row - only show if External is selected */}
                      {nonContractualFundingSource === "External" && (
                      <TableRow>
                        <TableCell sx={{ padding: 1, fontWeight: 'bold', backgroundColor: '#f8f9ff' }}>
                          External
                        </TableCell>
                        {nonContractualFyHeaders.map((fy) => (
                          <TableCell key={`external-${fy}`} sx={{ padding: 1 }}>
                            <TextField
                              value={formatWithCommas(nonContractualPipelineExternal[fy] || "")}
                              onChange={(e) => {
                                const raw = e.target.value || "";
                                const cleaned = raw.replace(/,/g, "");
                                if (/^\d*$/.test(cleaned)) {
                                  setNonContractualPipelineExternal(prev => {
                                    const updated = { ...prev, [fy]: cleaned };
                                    // Calculate total External amount
                                    const total = Object.values(updated).reduce((sum, val) => sum + Number(val || 0), 0);
                                    setNonContractualExternalAmount(total.toString());
                                    return updated;
                                  });
                                }
                              }}
                              size="small"
                              fullWidth
                              placeholder="0"
                              inputMode="numeric"
                              sx={{ '& input': { textAlign: 'center' } }}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {/* Funding source validation error */}
                {nonContractualValidationErrors.fundingSource && (
                  <div style={{ marginTop: '8px', color: '#d32f2f', fontSize: '0.75rem' }}>
                    {nonContractualValidationErrors.fundingSource}
                  </div>
                )}
              </div>
            )}

            {/* Date range validation error */}
            {nonContractualValidationErrors.dateRange && (
              <div style={{ marginBottom: '16px', color: '#d32f2f', fontSize: '0.75rem' }}>
                {nonContractualValidationErrors.dateRange}
              </div>
            )}

            {/* Save and Cancel buttons */}
            <div className="p-4">
              <div className="flex gap-3">
                <ButtonMui 
                  type="button" 
                  variant="contained" 
                  onClick={handleSaveNonContractual}
                  sx={buttonStyles}
                >
                  Save non-contractual data
                </ButtonMui>
                <ButtonMui 
                  type="button" 
                  variant="contained" 
                  onClick={handleCancelNonContractual}
                  sx={buttonStyles}
                >
                  Cancel
                </ButtonMui>
              </div>
            </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Dialog open={validationDialog.open} onClose={handleCloseValidationDialog} fullWidth maxWidth="sm">
        <DialogTitle>Validation issues</DialogTitle>
        <DialogContent>
          {validationDialog.issues.length === 0 ? (
            <div>Please correct the highlighted fields.</div>
          ) : (
            <ul style={{ paddingLeft: 16, marginTop: 8 }}>
              {validationDialog.issues.map((msg, idx) => (
                <li key={idx} style={{ whiteSpace: 'pre-line' }}>{msg}</li>
              ))}
            </ul>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseValidationDialog} autoFocus sx={buttonStyles}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={balanceExhaustedDialog.open} onClose={handleCloseBalanceExhaustedDialog} fullWidth maxWidth="md">
        <DialogTitle>Balance Exhausted - {balanceExhaustedDialog.fundingSource} Funding Source</DialogTitle>
        <DialogContent>
          <div style={{ padding: '16px 0' }}>
            <Alert severity="warning" sx={{ marginBottom: 2 }}>
              The balance for the {balanceExhaustedDialog.fundingSource} funding source has been fully utilized.
            </Alert>
            <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
              {balanceExhaustedDialog.message}
            </div>
            <div style={{ marginTop: '16px', fontSize: '14px', fontWeight: 'bold', color: '#d32f2f' }}>
              Balance on Contract Value: 0 UGX
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBalanceExhaustedDialog} autoFocus sx={buttonStyles}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Unsaved Changes Dialog */}
      <Dialog open={unsavedChangesDialog.open} onClose={handleCloseUnsavedChangesDialog} fullWidth maxWidth="sm">
        <DialogTitle>Unsaved Changes</DialogTitle>
        <DialogContent>
          <div style={{ padding: '16px 0' }}>
            <Alert severity="warning" sx={{ marginBottom: 2 }}>
              You have unsaved changes in the current contract form.
            </Alert>
            <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
              Do you want to save your changes before switching tabs, or discard them?
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUnsavedChangesDialog} sx={buttonStyles}>
            Cancel
          </Button>
          <Button onClick={handleDiscardChanges} color="error">
            Discard Changes
          </Button>
          <Button onClick={handleSaveAndSwitch} variant="contained" autoFocus sx={buttonStyles}>
            Save & Switch
          </Button>
        </DialogActions>
      </Dialog>

      {/* Contract Value Validation Dialog */}
      <Dialog open={contractValueValidationDialog.open} onClose={handleCloseContractValueValidationDialog} fullWidth maxWidth="sm">
        <DialogTitle>Invalid Entry - {contractValueValidationDialog.fundingSource} Funding Source</DialogTitle>
        <DialogContent>
          <div style={{ padding: '16px 0' }}>
            <Alert severity="warning" sx={{ marginBottom: 2 }}>
              Cannot enter fiscal year values greater than 0 when the corresponding contract value is 0.
            </Alert>
            <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
              {contractValueValidationDialog.message}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseContractValueValidationDialog} autoFocus sx={buttonStyles}>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Contract Value Exceed Dialog */}
      <Dialog open={contractValueExceedDialog.open} onClose={handleCloseContractValueExceedDialog} fullWidth maxWidth="sm">
        <DialogTitle>Value Exceeds Contract Limit - {contractValueExceedDialog.fundingSource} Funding Source</DialogTitle>
        <DialogContent>
          <div style={{ padding: '16px 0' }}>
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              Fiscal year value cannot exceed the corresponding contract value.
            </Alert>
            <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
              {contractValueExceedDialog.message}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseContractValueExceedDialog} autoFocus sx={buttonStyles}>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Quarterly Entry Required Dialog */}
      <Dialog open={quarterlyEntryDialog.open} onClose={() => setQuarterlyEntryDialog({ open: false })} fullWidth maxWidth="sm">
        <DialogTitle>Quarterly Entry Required</DialogTitle>
        <DialogContent>
          <div style={{ padding: '16px 0' }}>
            <Alert severity="info" sx={{ marginBottom: 2 }}>
              You need to at least add one quarterly entry before saving the contract.
            </Alert>
            <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
              Please go to the Financial Year section and add quarterly entries for your contract. 
              This is required to complete the contract submission process.
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQuarterlyEntryDialog({ open: false })} autoFocus sx={buttonStyles}>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Counterpart Balance Exceed Dialog */}
      <Dialog open={counterpartBalanceExceedDialog.open} onClose={handleCloseCounterpartBalanceExceedDialog} fullWidth maxWidth="sm">
        <DialogTitle>Value Exceeds Counter-part Balance - {counterpartBalanceExceedDialog.fundingSource} Funding Source</DialogTitle>
        <DialogContent>
          <div style={{ padding: '16px 0' }}>
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              Fiscal year value cannot exceed the Counter-part Balance.
            </Alert>
            <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
              {counterpartBalanceExceedDialog.message}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCounterpartBalanceExceedDialog} autoFocus sx={buttonStyles}>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Fiscal Year Validation Dialog */}
      <Dialog open={fiscalYearValidationDialog.open} onClose={handleCloseFiscalYearValidationDialog} fullWidth maxWidth="sm">
        <DialogTitle>Fiscal Year Values Not Updated</DialogTitle>
        <DialogContent>
          <div style={{ padding: '16px 0' }}>
            <Alert severity="warning" sx={{ marginBottom: 2 }}>
              Some fiscal year fields still contain default values (0's or empty).
            </Alert>
            <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
              The fiscal year pipeline fields for {counterpartFundingSource || 'the selected'} funding source appear to have default values. 
              Would you like to update them with specific values before saving, or proceed with the current values?
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFiscalYearValidationDialog} sx={buttonStyles}>
            Cancel
          </Button>
          <Button onClick={handleProceedWithSave} autoFocus sx={buttonStyles}>
            Proceed with Current Values
          </Button>
        </DialogActions>
      </Dialog>

      {/* Show Contract Overview Dialog */}
      <Dialog open={showContractDialog.open} onClose={handleCloseShowContractDialog} fullWidth maxWidth="lg">
        <DialogTitle>Contract Overview</DialogTitle>
        <DialogContent>
          {showContractDialog.contract && (
            <div style={{ padding: '16px 0' }}>
              {/* Basic Contract Information */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ color: '#3F51B5', marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>
                  Basic Contract Information
                </h3>
                <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                  <Table size="small">
                    <TableBody>
                      {hasMeaningfulData(showContractDialog.contract.contract_reference_number) && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '30%', backgroundColor: '#f5f5f5' }}>Procurement Reference Number</TableCell>
                          <TableCell>{showContractDialog.contract.contract_reference_number}</TableCell>
                      </TableRow>
                      )}
                      {hasMeaningfulData(showContractDialog.contract.contract_name) && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Contract Name</TableCell>
                          <TableCell>{showContractDialog.contract.contract_name}</TableCell>
                      </TableRow>
                      )}
                      {hasMeaningfulData(showContractDialog.contract.description_of_procurement) && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Description of Contract</TableCell>
                          <TableCell>{showContractDialog.contract.description_of_procurement}</TableCell>
                      </TableRow>
                      )}
                      {hasMeaningfulData(showContractDialog.contract.contractor_name) && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Contractor Name</TableCell>
                          <TableCell>{showContractDialog.contract.contractor_name}</TableCell>
                      </TableRow>
                      )}
                      {hasMeaningfulData(showContractDialog.contract.contractualItemCode) && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Item Code</TableCell>
                          <TableCell>{showContractDialog.contract.contractualItemCode}</TableCell>
                      </TableRow>
                      )}
                      {hasMeaningfulData(showContractDialog.contract.contractualDescription) && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Description of Activity</TableCell>
                          <TableCell>{showContractDialog.contract.contractualDescription}</TableCell>
                      </TableRow>
                      )}
                      {hasMeaningfulData(showContractDialog.contract.contractualCategory) && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Category of Procurement</TableCell>
                          <TableCell>{showContractDialog.contract.contractualCategory}</TableCell>
                      </TableRow>
                      )}
                      {hasMeaningfulData(showContractDialog.contract.contractualStage) && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Type of Procurement</TableCell>
                          <TableCell>{showContractDialog.contract.contractualStage}</TableCell>
                      </TableRow>
                      )}
                      {hasMeaningfulData(showContractDialog.contract.contractualProjectClassification) && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Project Classification</TableCell>
                          <TableCell>{showContractDialog.contract.contractualProjectClassification}</TableCell>
                      </TableRow>
                      )}
                      {hasMeaningfulData(showContractDialog.contract.contract_start_date) && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Contract Start Date</TableCell>
                          <TableCell>{showContractDialog.contract.contract_start_date}</TableCell>
                      </TableRow>
                      )}
                      {hasMeaningfulData(showContractDialog.contract.contract_end_date) && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Contract End Date</TableCell>
                          <TableCell>{showContractDialog.contract.contract_end_date}</TableCell>
                      </TableRow>
                      )}
                      {hasMeaningfulData(showContractDialog.contract.contract_status) && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Contract Status</TableCell>
                          <TableCell>{showContractDialog.contract.contract_status}</TableCell>
                      </TableRow>
                      )}
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Contract Value</TableCell>
                          <TableCell>{displayNumericValue(showContractDialog.contract.contract_value_main)}</TableCell>
                      </TableRow>
                      {hasMeaningfulData(showContractDialog.contract.currency) && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Currency</TableCell>
                          <TableCell>{showContractDialog.contract.currency}</TableCell>
                      </TableRow>
                      )}
                      {/* Always show Currency as UGX */}
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '30%', backgroundColor: '#f5f5f5' }}>Currency</TableCell>
                        <TableCell>UGX</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              {/* Financial Information */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ color: '#3F51B5', marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>
                  Financial Information
                </h3>
                <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                  <Table size="small">
                    <TableBody>
                      {(showContractDialog.contract.contractualSourceOfFunding === "GoU" || showContractDialog.contract.contractualSourceOfFunding === "Both") && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '30%', backgroundColor: '#f5f5f5' }}>Costing GoU</TableCell>
                        <TableCell>{displayNumericValue(showContractDialog.contract.contract_value_gou)}</TableCell>
                      </TableRow>
                      )}
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '30%', backgroundColor: '#f5f5f5' }}>Costing External</TableCell>
                        <TableCell>{displayNumericValue(showContractDialog.contract.contract_value_external)}</TableCell>
                      </TableRow>
                      {hasMeaningfulData(showContractDialog.contract.annual_penalty_rate) && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '30%', backgroundColor: '#f5f5f5' }}>Annual Penalty Rate (%)</TableCell>
                          <TableCell>{showContractDialog.contract.annual_penalty_rate}</TableCell>
                      </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              {/* Contractual Obligation Information */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ color: '#3F51B5', marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>
                  Contractual Obligation Information
                </h3>
                <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                  <Table size="small">
                    <TableBody>
                      {hasMeaningfulData(showContractDialog.contract.approved_payments) && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '30%', backgroundColor: '#f5f5f5' }}>Cumulative Contract Payments External</TableCell>
                        <TableCell>{displayNumericValue(showContractDialog.contract.approved_payments)}</TableCell>
                      </TableRow>
                      )}
                      {hasMeaningfulData(showContractDialog.contract.approved_payments_gou) && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '30%', backgroundColor: '#f5f5f5' }}>Cumulative Contract Payments GoU</TableCell>
                        <TableCell>{displayNumericValue(showContractDialog.contract.approved_payments_gou)}</TableCell>
                      </TableRow>
                      )}
                      {hasMeaningfulData(showContractDialog.contract.balance_on_contract_value) && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '30%', backgroundColor: '#f5f5f5' }}>Balance on Costing External</TableCell>
                        <TableCell>{displayNumericValue(showContractDialog.contract.balance_on_contract_value)}</TableCell>
                      </TableRow>
                      )}
                      {hasMeaningfulData(showContractDialog.contract.balance_on_contract_value_gou) && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '30%', backgroundColor: '#f5f5f5' }}>Balance on Costing GoU</TableCell>
                        <TableCell>{displayNumericValue(showContractDialog.contract.balance_on_contract_value_gou)}</TableCell>
                      </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              {/* Arrears Information */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ color: '#3F51B5', marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>
                  Arrears Information
                </h3>
                <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                  <Table size="small">
                    <TableBody>
                      {/* Show External arrears fields only if External or Both is selected */}
                      {(() => {
                        const isExternalSelected = showContractDialog.contract.contractualSourceOfFunding === "External" || showContractDialog.contract.contractualSourceOfFunding === "Both";
                        const hasNoFundingSource = !showContractDialog.contract.contractualSourceOfFunding || showContractDialog.contract.contractualSourceOfFunding === "";
                        const hasExternalData = hasMeaningfulData(showContractDialog.contract.arrears) || hasMeaningfulData(showContractDialog.contract.verified_arrears) || 
                          hasMeaningfulData(showContractDialog.contract.unverified_arrears) || hasMeaningfulData(showContractDialog.contract.arrears_6_months_plus);
                        return isExternalSelected || (hasNoFundingSource && hasExternalData);
                      })() && (
                        <>
                          {hasMeaningfulData(showContractDialog.contract.arrears) && (
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', width: '30%', backgroundColor: '#f5f5f5' }}>Cumulative Arrears External</TableCell>
                            <TableCell>{displayNumericValue(showContractDialog.contract.arrears)}</TableCell>
                          </TableRow>
                          )}
                          {hasMeaningfulData(showContractDialog.contract.verified_arrears) && (
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', width: '30%', backgroundColor: '#f5f5f5' }}>Verified Arrears External</TableCell>
                            <TableCell>{displayNumericValue(showContractDialog.contract.verified_arrears)}</TableCell>
                          </TableRow>
                          )}
                          {hasMeaningfulData(showContractDialog.contract.unverified_arrears) && (
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', width: '30%', backgroundColor: '#f5f5f5' }}>Unverified Arrears External</TableCell>
                            <TableCell>{displayNumericValue(showContractDialog.contract.unverified_arrears)}</TableCell>
                          </TableRow>
                          )}
                          {hasMeaningfulData(showContractDialog.contract.arrears_6_months_plus) && (
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', width: '30%', backgroundColor: '#f5f5f5' }}>Arrears 6 Months Plus External</TableCell>
                            <TableCell>{displayNumericValue(showContractDialog.contract.arrears_6_months_plus)}</TableCell>
                          </TableRow>
                          )}
                        </>
                      )}

                      {/* Show GoU arrears fields only if GoU or Both is selected */}
                      {(() => {
                        const isGoUSelected = showContractDialog.contract.contractualSourceOfFunding === "GoU" || showContractDialog.contract.contractualSourceOfFunding === "Both";
                        const hasNoFundingSource = !showContractDialog.contract.contractualSourceOfFunding || showContractDialog.contract.contractualSourceOfFunding === "";
                        const hasGoUData = hasMeaningfulData(showContractDialog.contract.arrears_gou) || hasMeaningfulData(showContractDialog.contract.verified_arrears_gou) || 
                          hasMeaningfulData(showContractDialog.contract.unverified_arrears_gou) || hasMeaningfulData(showContractDialog.contract.arrears_6_months_plus_gou);
                        return isGoUSelected || (hasNoFundingSource && hasGoUData);
                      })() && (
                        <>
                          {hasMeaningfulData(showContractDialog.contract.arrears_gou) && (
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', width: '30%', backgroundColor: '#f5f5f5' }}>Cumulative Arrears GoU</TableCell>
                            <TableCell>{displayNumericValue(showContractDialog.contract.arrears_gou)}</TableCell>
                          </TableRow>
                          )}
                          {hasMeaningfulData(showContractDialog.contract.verified_arrears_gou) && (
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', width: '30%', backgroundColor: '#f5f5f5' }}>Verified Arrears GoU</TableCell>
                            <TableCell>{displayNumericValue(showContractDialog.contract.verified_arrears_gou)}</TableCell>
                          </TableRow>
                          )}
                          {hasMeaningfulData(showContractDialog.contract.unverified_arrears_gou) && (
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', width: '30%', backgroundColor: '#f5f5f5' }}>Unverified Arrears GoU</TableCell>
                            <TableCell>{displayNumericValue(showContractDialog.contract.unverified_arrears_gou)}</TableCell>
                          </TableRow>
                          )}
                          {hasMeaningfulData(showContractDialog.contract.arrears_6_months_plus_gou) && (
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', width: '30%', backgroundColor: '#f5f5f5' }}>Arrears 6 Months Plus GoU</TableCell>
                            <TableCell>{displayNumericValue(showContractDialog.contract.arrears_6_months_plus_gou)}</TableCell>
                          </TableRow>
                          )}
                        </>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              {/* Fiscal Year Pipeline Information */}
              {showContractDialog.contract.fyHeaders && showContractDialog.contract.fyHeaders.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ color: '#3F51B5', marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>
                    Fiscal Year Pipeline Information
                  </h3>
                  <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Funding Source</TableCell>
                          {showContractDialog.contract.fyHeaders.map((fy) => (
                            <TableCell key={fy} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>{fy}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {/* Show External row only if External or Both is selected */}
                        {(() => {
                          const isExternalSelected = showContractDialog.contract.contractualSourceOfFunding === "External" || showContractDialog.contract.contractualSourceOfFunding === "Both";
                          // Check if External pipeline has meaningful data (not just N/A or empty values)
                          const hasExternalData = showContractDialog.contract.pipelineExternal && showContractDialog.contract.fyHeaders && 
                            showContractDialog.contract.fyHeaders.some(fy => {
                              const value = showContractDialog.contract.pipelineExternal[fy];
                              return value && value !== '' && value !== 'N/A' && value !== 0;
                            });
                          return (isExternalSelected || hasExternalData) && (
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>External</TableCell>
                          {showContractDialog.contract.fyHeaders.map((fy) => (
                            <TableCell key={`ext-${fy}`}>
                              {displayNumericValue(showContractDialog.contract.pipelineExternal?.[fy])}
                            </TableCell>
                          ))}
                        </TableRow>
                          );
                        })()}
                        
                        {/* Show GoU row only if GoU or Both is selected */}
                        {(() => {
                          const isGoUSelected = showContractDialog.contract.contractualSourceOfFunding === "GoU" || showContractDialog.contract.contractualSourceOfFunding === "Both";
                          // Check if GoU pipeline has meaningful data (not just N/A or empty values)
                          const hasGoUData = showContractDialog.contract.pipelineGoU && showContractDialog.contract.fyHeaders && 
                            showContractDialog.contract.fyHeaders.some(fy => {
                              const value = showContractDialog.contract.pipelineGoU[fy];
                              return value && value !== '' && value !== 'N/A' && value !== 0;
                            });
                          return (isGoUSelected || hasGoUData) && (
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>GoU</TableCell>
                          {showContractDialog.contract.fyHeaders.map((fy) => (
                            <TableCell key={`gou-${fy}`}>
                              {displayNumericValue(showContractDialog.contract.pipelineGoU?.[fy])}
                            </TableCell>
                          ))}
                        </TableRow>
                          );
                        })()}
                        
                        {/* Show Total row only if Both is selected */}
                        {(() => {
                          const isBothSelected = showContractDialog.contract.contractualSourceOfFunding === "Both";
                          // Check if both pipelines have meaningful data (not just N/A or empty values)
                          const hasExternalData = showContractDialog.contract.pipelineExternal && showContractDialog.contract.fyHeaders && 
                            showContractDialog.contract.fyHeaders.some(fy => {
                              const value = showContractDialog.contract.pipelineExternal[fy];
                              return value && value !== '' && value !== 'N/A' && value !== 0;
                            });
                          const hasGoUData = showContractDialog.contract.pipelineGoU && showContractDialog.contract.fyHeaders && 
                            showContractDialog.contract.fyHeaders.some(fy => {
                              const value = showContractDialog.contract.pipelineGoU[fy];
                              return value && value !== '' && value !== 'N/A' && value !== 0;
                            });
                          return (isBothSelected || (hasExternalData && hasGoUData)) && (
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>Total</TableCell>
                          {showContractDialog.contract.fyHeaders.map((fy) => {
                            const externalValue = showContractDialog.contract.pipelineExternal?.[fy] || 0;
                            const gouValue = showContractDialog.contract.pipelineGoU?.[fy] || 0;
                            
                            // Clean comma-formatted values before calculation
                            const cleanExternalValue = typeof externalValue === 'string' ? externalValue.replace(/,/g, '') : externalValue;
                            const cleanGoUValue = typeof gouValue === 'string' ? gouValue.replace(/,/g, '') : gouValue;
                            
                            const total = Number(cleanExternalValue) + Number(cleanGoUValue);
                            return (
                              <TableCell key={`total-${fy}`} sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                                {displayNumericValue(total)}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                          );
                        })()}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              )}

              {/* MTEF Projections */}
              {showContractDialog.contract.fyHeaders && showContractDialog.contract.fyHeaders.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ color: '#3F51B5', marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>
                    Fiscal Year Projections
                  </h3>
                  <Paper sx={{ boxShadow: 'none', border: '1px solid #e0e0e0', padding: '20px' }}>
                     <div style={{ height: '400px', position: 'relative', padding: '20px', overflowX: 'auto' }}>
                       <svg width="100%" height="100%" style={{ overflow: 'visible', minWidth: '100%' }}>
                         {/* Chart area */}
                         {(() => {
                           const fyHeaders = showContractDialog.contract.fyHeaders;
                           
                           // Dynamic chart dimensions based on number of fiscal years - even more space
                           const baseWidth = 1000;
                           const minWidthPerFiscalYear = 180; // Further increased minimum width per fiscal year
                           const chartWidth = Math.max(baseWidth, fyHeaders.length * minWidthPerFiscalYear);
                           const chartHeight = 320;
                           const margin = { top: 20, right: 30, left: 60, bottom: 5 };
                           const plotWidth = chartWidth - margin.left - margin.right;
                           const plotHeight = chartHeight - margin.top - margin.bottom;
                           
                           // Calculate max values for scaling
                           const allValues = fyHeaders.flatMap(fy => {
                             const externalValue = showContractDialog.contract.pipelineExternal?.[fy] || 0;
                             const gouValue = showContractDialog.contract.pipelineGoU?.[fy] || 0;
                             
                             // Clean comma-formatted values before calculation
                             const cleanExternalValue = typeof externalValue === 'string' ? externalValue.replace(/,/g, '') : externalValue;
                             const cleanGoUValue = typeof gouValue === 'string' ? gouValue.replace(/,/g, '') : gouValue;
                             
                             return [Number(cleanExternalValue) || 0, Number(cleanGoUValue) || 0];
                           });
                           const maxValue = Math.max(...allValues);
                           const minValue = 0;
                           const valueRange = maxValue - minValue;
                           
                           // Helper function to format currency values (like 60K UGX)
                           const formatCurrency = (value) => {
                             return `${(value / 1000).toFixed(0)}K UGX`;
                           };
                           
                           // Helper function to convert value to y coordinate
                           const valueToY = (value) => {
                             if (valueRange === 0) return margin.top + plotHeight / 2;
                             return margin.top + plotHeight - ((value - minValue) / valueRange) * plotHeight;
                           };
                           
                           // Helper function to convert index to x coordinate with very generous spacing
                           const indexToX = (index) => {
                             const sideSpacing = Math.min(150, plotWidth * 0.18); // Further increased side spacing
                             const groupSpacing = Math.min(180, plotWidth / fyHeaders.length * 0.5); // Further increased group spacing
                             const availableWidth = plotWidth - (sideSpacing * 2);
                             
                             // For many fiscal years, use simpler distribution with more space
                             if (fyHeaders.length > 5) {
                               return margin.left + sideSpacing + (index / (fyHeaders.length - 1)) * availableWidth;
                             }
                             
                             // For fewer fiscal years, use very generous grouped spacing
                             const groupWidth = (availableWidth - (groupSpacing * (fyHeaders.length - 1))) / fyHeaders.length;
                             return margin.left + sideSpacing + (index * (groupWidth + groupSpacing)) + (groupWidth / 2);
                           };
                           
                           // Adaptive bar calculations based on number of fiscal years - optimized bar width
                           const baseBarWidth = 45; // Reduced bar width for better proportion
                           const adaptiveBarWidth = fyHeaders.length > 12 ? Math.max(35, baseBarWidth * 0.8) : baseBarWidth;
                           const barWidth = adaptiveBarWidth;
                           const barSpacing = fyHeaders.length > 12 ? Math.max(15, 22 * 0.8) : 22; // Further increased spacing
                           
                           // Pre-calculate tooltip data for instant response
                           const tooltipDataMap = fyHeaders.reduce((acc, fy) => {
                             const externalValue = showContractDialog.contract.pipelineExternal?.[fy] || 0;
                             const gouValue = showContractDialog.contract.pipelineGoU?.[fy] || 0;
                             
                             // Clean comma-formatted values before calculation
                             const cleanExternalValue = typeof externalValue === 'string' ? externalValue.replace(/,/g, '') : externalValue;
                             const cleanGoUValue = typeof gouValue === 'string' ? gouValue.replace(/,/g, '') : gouValue;
                             
                             const externalNum = Number(cleanExternalValue) || 0;
                             const gouNum = Number(cleanGoUValue) || 0;
                             
                             acc[fy] = {
                               fiscalYear: fy,
                               external: externalNum,
                               gou: gouNum,
                               total: externalNum + gouNum
                             };
                             return acc;
                           }, {});
                           
                           return (
                             <g transform={`translate(0, 0)`}>
                               {/* Y-axis grid lines and labels */}
                               {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                                 const value = minValue + (valueRange * ratio);
                                 const y = valueToY(value);
                                 return (
                                   <g key={`y-grid-${index}`}>
                                     <line
                                       x1={margin.left}
                                       y1={y}
                                       x2={margin.left + plotWidth}
                                       y2={y}
                                       stroke="#e0e0e0"
                                       strokeWidth="1"
                                       strokeDasharray="3 3"
                                     />
                                     <text
                                       x={margin.left - 15}
                                       y={y + 4}
                                       textAnchor="end"
                                       fontSize="12"
                                       fill="#666"
                                     >
                                       {formatCurrency(value)}
                                     </text>
                                   </g>
                                 );
                               })}
                               
                               {/* Grouped bars for each fiscal year */}
                               {fyHeaders.map((fy, fyIndex) => {
                                 const groupCenterX = indexToX(fyIndex);
                                 const externalValue = showContractDialog.contract.pipelineExternal?.[fy] || 0;
                                 const gouValue = showContractDialog.contract.pipelineGoU?.[fy] || 0;
                                 
                                 // Clean comma-formatted values before calculation
                                 const cleanExternalValue = typeof externalValue === 'string' ? externalValue.replace(/,/g, '') : externalValue;
                                 const cleanGoUValue = typeof gouValue === 'string' ? gouValue.replace(/,/g, '') : gouValue;
                                 
                                 const externalNum = Number(cleanExternalValue) || 0;
                                 const gouNum = Number(cleanGoUValue) || 0;
                                 
                                 // Centered bar positioning
                                 const totalBarWidth = (barWidth * 2) + barSpacing;
                                 const extX = groupCenterX - totalBarWidth / 2;
                                 const gouX = groupCenterX - totalBarWidth / 2 + barWidth + barSpacing;
                                 
                                 // Calculate bar heights
                                 const extHeight = valueRange > 0 ? ((externalNum / maxValue) * plotHeight) : 0;
                                 const gouHeight = valueRange > 0 ? ((gouNum / maxValue) * plotHeight) : 0;
                                 
                                 // Calculate bar Y positions
                                 const extY = valueToY(externalNum);
                                 const gouY = valueToY(gouNum);
                                 
                                 const isHovered = tooltip.visible && tooltip.data && tooltip.data.fiscalYear === fy;
                                 
                                 return (
                                   <g key={`fy-group-${fy}`}>
                                     {/* Hover highlight background */}
                                     {isHovered && (
                                       <rect
                                         x={extX - 8}
                                         y={margin.top - 5}
                                         width={totalBarWidth + 16}
                                         height={plotHeight + 10}
                                         fill="rgba(59, 130, 246, 0.1)"
                                         stroke="rgba(59, 130, 246, 0.3)"
                                         strokeWidth="2"
                                         strokeDasharray="4 4"
                                         rx="4"
                                         ry="4"
                                       />
                                     )}
                                     
                                     {/* Invisible hover area covering both bars - optimized for instant response */}
                                     <rect
                                       x={extX}
                                       y={margin.top}
                                       width={totalBarWidth}
                                       height={plotHeight}
                                       fill="transparent"
                                       onMouseEnter={(e) => {
                                         setTooltip({
                                           visible: true,
                                           x: e.clientX,
                                           y: e.clientY,
                                           data: tooltipDataMap[fy]
                                         });
                                       }}
                                       onMouseMove={(e) => {
                                         if (tooltip.visible) {
                                           setTooltip(prev => ({
                                             ...prev,
                                             x: e.clientX,
                                             y: e.clientY
                                           }));
                                         }
                                       }}
                                       onMouseLeave={() => {
                                         setTooltip(prev => ({ ...prev, visible: false }));
                                       }}
                                       style={{ cursor: 'pointer' }}
                                     />
                                     
                                     {/* External bar */}
                                     <rect
                                       x={extX}
                                       y={extY}
                                       width={barWidth}
                                       height={extHeight}
                                       fill={isHovered ? "#2563eb" : "#3b82f6"}
                                       stroke={isHovered ? "#1d4ed8" : "none"}
                                       strokeWidth={isHovered ? "2" : "0"}
                                       style={{ cursor: 'pointer' }}
                                     />
                                     
                                     {/* GoU bar */}
                                     <rect
                                       x={gouX}
                                       y={gouY}
                                       width={barWidth}
                                       height={gouHeight}
                                       fill={isHovered ? "#7c3aed" : "#8b5cf6"}
                                       stroke={isHovered ? "#6d28d9" : "none"}
                                       strokeWidth={isHovered ? "2" : "0"}
                                       style={{ cursor: 'pointer' }}
                                     />
                                   </g>
                                 );
                               })}
                               
                               {/* X-axis labels - aligned with bar groups */}
                               {fyHeaders.map((fy, index) => {
                                 const groupCenterX = indexToX(index);
                                 const isLabelHovered = tooltip.visible && tooltip.data && tooltip.data.fiscalYear === fy;
                                 return (
                                   <text
                                     key={`x-label-${index}`}
                                     x={groupCenterX}
                                     y={margin.top + plotHeight + 20}
                                     textAnchor="middle"
                                     fontSize="14"
                                     fill={isLabelHovered ? "#2563eb" : "#333"}
                                     fontWeight={isLabelHovered ? "700" : "600"}
                                   >
                                     {fy}
                                   </text>
                                 );
                               })}
                             </g>
                           );
                         })()}
                       </svg>
                       
                       
                       {/* Top Right Legend */}
                       <div style={{ 
                         position: 'absolute', 
                         top: '-12px', 
                         right: '0px',
                         display: 'flex',
                         gap: '30px',
                         alignItems: 'center',
                         backgroundColor: 'white',
                         padding: '12px 16px',
                         borderRadius: '0 0 0 6px',
                         boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                         border: '1px solid #e5e7eb',
                         fontSize: '14px',
                         fontWeight: '600'
                       }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                           <div style={{ 
                             width: '14px', 
                             height: '14px', 
                             backgroundColor: '#3b82f6', 
                             borderRadius: '2px'
                           }}></div>
                           <span style={{ fontSize: '14px', color: '#333', fontWeight: '600' }}>External</span>
                         </div>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                           <div style={{ 
                             width: '14px', 
                             height: '14px', 
                             backgroundColor: '#8b5cf6', 
                             borderRadius: '2px'
                           }}></div>
                           <span style={{ fontSize: '14px', color: '#333', fontWeight: '600' }}>GoU</span>
                         </div>
                       </div>
                     </div>
                  </Paper>
                </div>
              )}

              {/* MTEF Ceiling - Medium Term Expenditure Framework ceiling data from PBS API */}
              {/* Uses PBS API gouValue and extFinValue for the specific project's Item_Code */}
              {showContractDialog.contract && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ color: '#3F51B5', marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>
                    MTEF Ceiling
                  </h3>
                  <Paper sx={{ boxShadow: 'none', border: '1px solid #e0e0e0', padding: '20px' }}>
                     <div 
                       style={{ height: '400px', position: 'relative', padding: '20px', overflowX: 'auto' }}
                       onClick={() => {
                         if (mtefTooltipClickMode) {
                           setMtefTooltipClickMode(false);
                           setMtefTooltip(prev => ({ ...prev, visible: false }));
                         }
                       }}
                     >
                       <svg width="100%" height="100%" style={{ overflow: 'visible', minWidth: '100%' }}>
                         {/* Chart area */}
                         {(() => {
                           // Get MTEF ceiling data from PBS API - use proper fiscal year structure
                           let mtefGoUTotal = 0;
                           let mtefExtFinTotal = 0;
                           const fiscalYearData = {};
                           
                           // Process fiscal year specific data directly
                           if (Object.keys(fiscalYearItemCodes).length > 0) {
                             // Get contract-specific information for filtering
                             const contractVoteName = showContractDialog.contract?.voteName || '';
                             const contractProjectName = showContractDialog.contract?.projectName || '';
                             
                             console.log('🔍 Filtering MTEF data for contract:', {
                               voteName: contractVoteName,
                               projectName: contractProjectName,
                               contractCode: showContractDialog.contract?.contract_reference_number
                             });
                             
                             Object.keys(fiscalYearItemCodes).forEach(fiscalYear => {
                               const items = fiscalYearItemCodes[fiscalYear];
                               
                               // Filter items by contract's vote name and project name
                               const filteredItems = items.filter(item => {
                                 const voteMatch = !contractVoteName || 
                                   item.voteName?.toLowerCase().includes(contractVoteName.toLowerCase()) ||
                                   contractVoteName.toLowerCase().includes(item.voteName?.toLowerCase());
                                 
                                 const projectMatch = !contractProjectName || 
                                   item.projectName?.toLowerCase().includes(contractProjectName.toLowerCase()) ||
                                   contractProjectName.toLowerCase().includes(item.projectName?.toLowerCase());
                                 
                                 return voteMatch && projectMatch;
                               });
                               
                               console.log(`🔍 FY${fiscalYear} filtering results:`, {
                                 totalItems: items.length,
                                 filteredItems: filteredItems.length,
                                 voteName: contractVoteName,
                                 projectName: contractProjectName,
                                 filteredItemsDetails: filteredItems.map(item => ({
                                   code: item.code,
                                   voteName: item.voteName,
                                   projectName: item.projectName,
                                   gouValue: item.gouValue,
                                   extFinValue: item.extFinValue
                                 }))
                               });
                               
                               let fyGoUTotal = 0;
                               let fyExtFinTotal = 0;
                               
                               filteredItems.forEach(item => {
                                 fyGoUTotal += Number(item.gouValue) || 0;
                                 fyExtFinTotal += Number(item.extFinValue) || 0;
                               });
                               
                               // Add to overall totals
                               mtefGoUTotal += fyGoUTotal;
                               mtefExtFinTotal += fyExtFinTotal;
                               
                               // Store fiscal year specific data
                               fiscalYearData[fiscalYear] = {
                                 gouValue: fyGoUTotal,
                                 extFinValue: fyExtFinTotal,
                                 itemCodes: filteredItems.map(item => ({
                                   code: item.code,
                                   description: item.description,
                                   voteName: item.voteName,
                                   projectName: item.projectName,
                                   gouValue: Number(item.gouValue) || 0,
                                   extFinValue: Number(item.extFinValue) || 0
                                 }))
                               };
                             });
                             
                           console.log('📊 MTEF Ceiling data from PBS API (fiscal year specific):', {
                             totalFiscalYears: Object.keys(fiscalYearItemCodes).length,
                             totalGoUValue: mtefGoUTotal,
                             totalExtFinValue: mtefExtFinTotal,
                             availableFiscalYears: Object.keys(fiscalYearItemCodes),
                             contractFiscalYears: showContractDialog.contract?.fyHeaders || [],
                             fiscalYearMatching: Object.keys(fiscalYearItemCodes).map(pbsFy => {
                               const contractFy = showContractDialog.contract?.fyHeaders?.find(cfy => {
                                 const pbsStart = pbsFy.match(/\d{4}/)?.[0];
                                 const contractStart = cfy.match(/\d{4}/)?.[0];
                                 return pbsStart === contractStart;
                               });
                               return {
                                 pbsFiscalYear: pbsFy,
                                 matchingContractFy: contractFy || 'No match',
                                 hasData: !!fiscalYearData[pbsFy]
                               };
                             }),
                             fiscalYearBreakdown: Object.keys(fiscalYearData).map(fy => ({
                               fiscalYear: fy,
                               gouValue: fiscalYearData[fy].gouValue,
                               extFinValue: fiscalYearData[fy].extFinValue,
                               itemCodesCount: fiscalYearData[fy].itemCodes.length,
                               itemCodes: fiscalYearData[fy].itemCodes.map(item => ({
                                 code: item.code,
                                 voteName: item.voteName,
                                 projectName: item.projectName,
                                 gouValue: item.gouValue,
                                 extFinValue: item.extFinValue
                               }))
                             }))
                           });
                           }
                           
                           // Fallback to contract values if PBS data is not available
                           if (mtefGoUTotal === 0 && mtefExtFinTotal === 0) {
                             mtefGoUTotal = showContractDialog.contract.contract_value_gou || showContractDialog.contract.contract_value || 0;
                             mtefExtFinTotal = showContractDialog.contract.contract_value_external || 0;
                             console.log('📊 MTEF Ceiling fallback to contract values:', {
                               gouValue: mtefGoUTotal,
                               extFinValue: mtefExtFinTotal
                             });
                           }
                           
                           // Clean comma-formatted values before calculation
                           const cleanMtefGoUTotal = typeof mtefGoUTotal === 'string' ? mtefGoUTotal.replace(/,/g, '') : mtefGoUTotal || 0;
                           const cleanMtefExtFinTotal = typeof mtefExtFinTotal === 'string' ? mtefExtFinTotal.replace(/,/g, '') : mtefExtFinTotal || 0;
                           
                           const mtefGoUNum = Number(cleanMtefGoUTotal) || 0;
                           const mtefExtFinNum = Number(cleanMtefExtFinTotal) || 0;
                           
                           // Use actual fiscal year data from PBS API instead of equal distribution
                           const selectedFiscalYears = showContractDialog.contract?.fyHeaders || []; // Get fiscal years from contract data
                           const fiscalYearCount = selectedFiscalYears.length;
                           
                           // Create fiscal year distribution using actual PBS data
                           const fiscalYearDistribution = {};
                           selectedFiscalYears.forEach(fy => {
                             console.log(`🔍 Processing fiscal year: ${fy}`, {
                               hasPBSData: !!fiscalYearData[fy],
                               pbsData: fiscalYearData[fy],
                               fiscalYearCount: fiscalYearCount,
                               mtefGoUNum: mtefGoUNum,
                               mtefExtFinNum: mtefExtFinNum
                             });
                             
                             // Try to find matching fiscal year data with different format variations
                             let matchingFiscalYearData = fiscalYearData[fy];
                             if (!matchingFiscalYearData) {
                               // Try different fiscal year format variations
                               const fyVariations = [
                                 fy, // Original format (e.g., "FY2022/23")
                                 fy.replace('FY', '').replace('-', '/'), // Remove FY, change - to /
                                 fy.replace('FY', ''), // Remove FY prefix
                                 `FY${fy}`, // Add FY prefix
                                 fy.replace('/', '-'), // Change / to -
                                 fy.replace('-', '/'), // Change - to /
                                 // Handle PBS API format (2022-2023) to contract format (FY2022/23)
                                 fy.replace(/^(\d{4})-(\d{4})$/, 'FY$1/$2'), // 2022-2023 -> FY2022/23
                                 fy.replace(/^FY(\d{4})\/(\d{4})$/, '$1-$2'), // FY2022/23 -> 2022-2023
                                 // Handle short year format
                                 fy.replace(/^(\d{4})-(\d{4})$/, 'FY$1/$2'.substring(2)), // 2022-2023 -> FY22/23
                                 fy.replace(/^FY(\d{2})\/(\d{2})$/, '20$1-20$2'), // FY22/23 -> 2022-2023
                               ];
                               
                               console.log(`🔍 Trying fiscal year variations for ${fy}:`, fyVariations);
                               
                               for (const variation of fyVariations) {
                                 if (fiscalYearData[variation]) {
                                   matchingFiscalYearData = fiscalYearData[variation];
                                   console.log(`🔄 Found matching fiscal year data for ${fy} using variation: ${variation}`);
                                   break;
                                 }
                               }
                               
                               // If still no match, try to find any fiscal year that overlaps with the contract fiscal year
                               if (!matchingFiscalYearData) {
                                 const contractFyStart = fy.match(/\d{4}/)?.[0];
                                 if (contractFyStart) {
                                   const overlappingFy = Object.keys(fiscalYearData).find(pbsFy => {
                                     const pbsFyStart = pbsFy.match(/\d{4}/)?.[0];
                                     return pbsFyStart === contractFyStart;
                                   });
                                   if (overlappingFy) {
                                     matchingFiscalYearData = fiscalYearData[overlappingFy];
                                     console.log(`🔄 Found overlapping fiscal year data for ${fy} using: ${overlappingFy}`);
                                   }
                                 }
                               }
                             }
                             
                             if (matchingFiscalYearData) {
                               // Use actual PBS data for this fiscal year
                               fiscalYearDistribution[fy] = {
                                 gouValue: matchingFiscalYearData.gouValue,
                                 extFinValue: matchingFiscalYearData.extFinValue,
                                 itemCodes: matchingFiscalYearData.itemCodes
                               };
                               console.log(`✅ Using PBS data for ${fy}:`, fiscalYearDistribution[fy]);
                             } else {
                               // Fallback to equal distribution if no PBS data for this fiscal year
                               const gouPerFY = fiscalYearCount > 0 ? mtefGoUNum / fiscalYearCount : 0;
                               const extFinPerFY = fiscalYearCount > 0 ? mtefExtFinNum / fiscalYearCount : 0;
                               fiscalYearDistribution[fy] = {
                                 gouValue: gouPerFY,
                                 extFinValue: extFinPerFY,
                                 itemCodes: []
                               };
                               console.log(`⚠️ Using fallback equal distribution for ${fy}:`, {
                                 gouPerFY: gouPerFY,
                                 extFinPerFY: extFinPerFY
                               });
                             }
                           });
                           
                           console.log('📊 MTEF Ceiling fiscal year distribution (PBS data):', {
                             totalGoU: mtefGoUNum,
                             totalExtFin: mtefExtFinNum,
                             fiscalYearCount: fiscalYearCount,
                             selectedFiscalYears: selectedFiscalYears,
                             contractFyHeaders: showContractDialog.contract?.fyHeaders,
                             fiscalYearDistribution: Object.keys(fiscalYearDistribution).map(fy => ({
                               fiscalYear: fy,
                               gouValue: fiscalYearDistribution[fy].gouValue,
                               extFinValue: fiscalYearDistribution[fy].extFinValue,
                               itemCodesCount: fiscalYearDistribution[fy].itemCodes.length
                             })),
                             fyHeadersLength: selectedFiscalYears.length,
                             fyHeaders: selectedFiscalYears
                           });
                           
                           // Check if we have any data to display
                           if (mtefGoUNum === 0 && mtefExtFinNum === 0) {
                             return (
                               <g transform={`translate(0, 0)`}>
                                 <text
                                   x="400"
                                   y="150"
                                   textAnchor="middle"
                                   fontSize="16"
                                   fill="#666"
                                   fontStyle="italic"
                                 >
                                   No MTEF ceiling data available
                                 </text>
                                 <text
                                   x="400"
                                   y="175"
                                   textAnchor="middle"
                                   fontSize="12"
                                   fill="#999"
                                 >
                                   MTEF ceiling data will be displayed when available from PBS API
                                 </text>
                               </g>
                             );
                           }
                           
                           // Check if we have fiscal years selected
                           if (fiscalYearCount === 0) {
                             return (
                               <g transform={`translate(0, 0)`}>
                                 <text
                                   x="400"
                                   y="150"
                                   textAnchor="middle"
                                   fontSize="16"
                                   fill="#666"
                                   fontStyle="italic"
                                 >
                                   Please select fiscal years to view MTEF ceiling distribution
                                 </text>
                                 <text
                                   x="400"
                                   y="175"
                                   textAnchor="middle"
                                   fontSize="12"
                                   fill="#999"
                                 >
                                   MTEF ceiling will be distributed across selected fiscal years
                                 </text>
                               </g>
                             );
                           }
                           
                           // Chart dimensions for fiscal year distribution display - match Fiscal Year Projections spacing and height
                           const baseWidth = 1000;
                           const minWidthPerFiscalYear = 180;
                           const chartWidth = Math.max(baseWidth, fiscalYearCount * minWidthPerFiscalYear);
                           const chartHeight = 320; // Match Fiscal Year Projections height
                           const margin = { top: 20, right: 30, left: 60, bottom: 5 }; // Match Fiscal Year Projections margins
                           const plotWidth = chartWidth - margin.left - margin.right;
                           const plotHeight = chartHeight - margin.top - margin.bottom;
                           
                           // Calculate max value for scaling across all fiscal years
                           const allGouValues = Object.values(fiscalYearDistribution).map(fy => fy.gouValue);
                           const allExtFinValues = Object.values(fiscalYearDistribution).map(fy => fy.extFinValue);
                           const maxValue = Math.max(...allGouValues, ...allExtFinValues);
                           const minValue = 0;
                           const valueRange = maxValue - minValue;
                           
                           // Helper function to format currency values
                           const formatCurrency = (value) => {
                             if (value >= 1000000000) {
                               return `${(value / 1000000000).toFixed(1)}B UGX`;
                             } else if (value >= 1000000) {
                               return `${(value / 1000000).toFixed(1)}M UGX`;
                             } else if (value >= 1000) {
                               return `${(value / 1000).toFixed(0)}K UGX`;
                             }
                             return `${value} UGX`;
                           };
                           
                           // Helper function to convert value to y coordinate
                           const valueToY = (value) => {
                             if (valueRange === 0) return margin.top + plotHeight / 2;
                             return margin.top + plotHeight - ((value - minValue) / valueRange) * plotHeight;
                           };
                           
                           // Render bars for fiscal year distribution - slightly larger bars
                           const barWidth = Math.max(25, Math.min(40, (plotWidth - (fiscalYearCount - 1) * 15) / (fiscalYearCount * 2)));
                           const barSpacing = 15;
                           const groupSpacing = 30;
                           
                           // Calculate positions for each fiscal year using actual PBS data
                           const chartFiscalYearData = selectedFiscalYears.map((fy, index) => {
                             const sideSpacing = Math.min(40, plotWidth * 0.06); // Even more reduced side spacing
                             const groupSpacing = Math.min(120, plotWidth / fiscalYearCount * 0.3); // Reduced group spacing
                             const availableWidth = plotWidth - (sideSpacing * 2);
                             const groupX = margin.left + sideSpacing + index * (availableWidth / fiscalYearCount) + (availableWidth / fiscalYearCount - barWidth * 2 - barSpacing) / 2;
                             const gouBarX = groupX;
                             const extFinBarX = groupX + barWidth + barSpacing;
                             
                             // Use actual PBS data for this fiscal year
                             const fyData = fiscalYearDistribution[fy];
                             const gouValue = fyData ? fyData.gouValue : 0;
                             const extFinValue = fyData ? fyData.extFinValue : 0;
                             
                             const gouBarHeight = maxValue > 0 ? (gouValue / maxValue) * plotHeight : 0;
                             const extFinBarHeight = maxValue > 0 ? (extFinValue / maxValue) * plotHeight : 0;
                             
                             // Check if this fiscal year has PBS data
                             const hasPBSData = fyData && fyData.itemCodes && fyData.itemCodes.length > 0;
                             
                             return {
                               fiscalYear: fy, // fy is already a string like "FY2024/25"
                               gouBar: {
                                 x: gouBarX,
                                 y: plotHeight - gouBarHeight,
                                 width: barWidth,
                                 height: gouBarHeight,
                                 value: gouValue
                               },
                               extFinBar: {
                                 x: extFinBarX,
                                 y: plotHeight - extFinBarHeight,
                                 width: barWidth,
                                 height: extFinBarHeight,
                                 value: extFinValue
                               },
                               itemCodes: fyData ? fyData.itemCodes : [],
                               hasPBSData: hasPBSData
                             };
                           });
                           
                           return (
                             <g transform={`translate(0, 0)`}>
                               {/* Y-axis grid lines and labels */}
                               {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                                 const value = minValue + (valueRange * ratio);
                                 const y = valueToY(value);
                                 return (
                                   <g key={`y-grid-${index}`}>
                                     <line
                                       x1={margin.left}
                                       y1={y}
                                       x2={margin.left + plotWidth}
                                       y2={y}
                                       stroke="#e0e0e0"
                                       strokeWidth="1"
                                       strokeDasharray="3 3"
                                     />
                                     <text
                                       x={margin.left - 15}
                                       y={y + 4}
                                       textAnchor="end"
                                       fontSize="12"
                                       fill="#666"
                                     >
                                       {formatCurrency(value)}
                                     </text>
                                   </g>
                                 );
                               })}
                               
                               {/* Render fiscal year bars */}
                               {chartFiscalYearData.map((fyData, index) => (
                                 <g key={`fiscal-year-${index}`}>
                                   {/* ExtFin bar for this fiscal year */}
                                   <rect
                                     x={fyData.extFinBar.x}
                                     y={margin.top + fyData.extFinBar.y}
                                     width={fyData.extFinBar.width}
                                     height={fyData.extFinBar.height}
                                     fill={fyData.hasPBSData ? "#22c55e" : "#d1d5db"}
                                     stroke={fyData.hasPBSData ? "#16a34a" : "#9ca3af"}
                                     strokeWidth="2"
                                     strokeDasharray={fyData.hasPBSData ? "none" : "5 5"}
                                     style={{ cursor: 'pointer' }}
                                     onMouseEnter={(e) => {
                                       if (fyData.hasPBSData) {
                                         setMtefTooltip({
                                           visible: true,
                                           x: e.clientX,
                                           y: e.clientY,
                                           data: {
                                             type: 'ExtFin',
                                             fiscalYear: fyData.fiscalYear,
                                             value: fyData.extFinBar.value,
                                             formatted: displayNumericValue(fyData.extFinBar.value),
                                             itemCodes: fyData.itemCodes,
                                             voteNames: [...new Set(fyData.itemCodes.map(item => item.voteName))],
                                             projectNames: [...new Set(fyData.itemCodes.map(item => item.projectName))]
                                           }
                                         });
                                       } else {
                                         setMtefTooltip({
                                           visible: true,
                                           x: e.clientX,
                                           y: e.clientY,
                                           data: {
                                             type: 'ExtFin',
                                             fiscalYear: fyData.fiscalYear,
                                             value: fyData.extFinBar.value,
                                             formatted: displayNumericValue(fyData.extFinBar.value),
                                             noData: true,
                                             message: 'No PBS data available for this fiscal year'
                                           }
                                         });
                                       }
                                     }}
                                     onMouseMove={(e) => {
                                       if (mtefTooltip.visible) {
                                         setMtefTooltip(prev => ({
                                           ...prev,
                                           x: e.clientX,
                                           y: e.clientY
                                         }));
                                       }
                                     }}
                                     onMouseLeave={() => {
                                       if (!mtefTooltipClickMode) {
                                         setMtefTooltip(prev => ({ ...prev, visible: false }));
                                       }
                                     }}
                                     onClick={(e) => {
                                       e.stopPropagation();
                                       setMtefTooltipClickMode(true);
                                       setMtefItemCodesExpanded(false); // Reset expansion state
                                       if (fyData.hasPBSData) {
                                         setMtefTooltip({
                                           visible: true,
                                           x: e.clientX,
                                           y: e.clientY,
                                           data: {
                                             type: 'ExtFin',
                                             fiscalYear: fyData.fiscalYear,
                                             value: fyData.extFinBar.value,
                                             formatted: displayNumericValue(fyData.extFinBar.value),
                                             itemCodes: fyData.itemCodes,
                                             voteNames: [...new Set(fyData.itemCodes.map(item => item.voteName))],
                                             projectNames: [...new Set(fyData.itemCodes.map(item => item.projectName))],
                                             clicked: true
                                           }
                                         });
                                       } else {
                                         setMtefTooltip({
                                           visible: true,
                                           x: e.clientX,
                                           y: e.clientY,
                                           data: {
                                             type: 'ExtFin',
                                             fiscalYear: fyData.fiscalYear,
                                             value: fyData.extFinBar.value,
                                             formatted: displayNumericValue(fyData.extFinBar.value),
                                             noData: true,
                                             message: 'No PBS data available for this fiscal year',
                                             clicked: true
                                           }
                                         });
                                       }
                                     }}
                                   />
                                   
                                   {/* GoU bar for this fiscal year */}
                                   <rect
                                     x={fyData.gouBar.x}
                                     y={margin.top + fyData.gouBar.y}
                                     width={fyData.gouBar.width}
                                     height={fyData.gouBar.height}
                                     fill={fyData.hasPBSData ? "#eab308" : "#d1d5db"}
                                     stroke={fyData.hasPBSData ? "#ca8a04" : "#9ca3af"}
                                     strokeWidth="2"
                                     strokeDasharray={fyData.hasPBSData ? "none" : "5 5"}
                                     style={{ cursor: 'pointer' }}
                                     onMouseEnter={(e) => {
                                       if (fyData.hasPBSData) {
                                         setMtefTooltip({
                                           visible: true,
                                           x: e.clientX,
                                           y: e.clientY,
                                           data: {
                                             type: 'GoU',
                                             fiscalYear: fyData.fiscalYear,
                                             value: fyData.gouBar.value,
                                             formatted: displayNumericValue(fyData.gouBar.value),
                                             itemCodes: fyData.itemCodes,
                                             voteNames: [...new Set(fyData.itemCodes.map(item => item.voteName))],
                                             projectNames: [...new Set(fyData.itemCodes.map(item => item.projectName))]
                                           }
                                         });
                                       } else {
                                         setMtefTooltip({
                                           visible: true,
                                           x: e.clientX,
                                           y: e.clientY,
                                           data: {
                                             type: 'GoU',
                                             fiscalYear: fyData.fiscalYear,
                                             value: fyData.gouBar.value,
                                             formatted: displayNumericValue(fyData.gouBar.value),
                                             noData: true,
                                             message: 'No PBS data available for this fiscal year'
                                           }
                                         });
                                       }
                                     }}
                                     onMouseMove={(e) => {
                                       if (mtefTooltip.visible) {
                                         setMtefTooltip(prev => ({
                                           ...prev,
                                           x: e.clientX,
                                           y: e.clientY
                                         }));
                                       }
                                     }}
                                     onMouseLeave={() => {
                                       if (!mtefTooltipClickMode) {
                                         setMtefTooltip(prev => ({ ...prev, visible: false }));
                                       }
                                     }}
                                     onClick={(e) => {
                                       e.stopPropagation();
                                       setMtefTooltipClickMode(true);
                                       setMtefItemCodesExpanded(false); // Reset expansion state
                                       if (fyData.hasPBSData) {
                                         setMtefTooltip({
                                           visible: true,
                                           x: e.clientX,
                                           y: e.clientY,
                                           data: {
                                             type: 'GoU',
                                             fiscalYear: fyData.fiscalYear,
                                             value: fyData.gouBar.value,
                                             formatted: displayNumericValue(fyData.gouBar.value),
                                             itemCodes: fyData.itemCodes,
                                             voteNames: [...new Set(fyData.itemCodes.map(item => item.voteName))],
                                             projectNames: [...new Set(fyData.itemCodes.map(item => item.projectName))],
                                             clicked: true
                                           }
                                         });
                                       } else {
                                         setMtefTooltip({
                                           visible: true,
                                           x: e.clientX,
                                           y: e.clientY,
                                           data: {
                                             type: 'GoU',
                                             fiscalYear: fyData.fiscalYear,
                                             value: fyData.gouBar.value,
                                             formatted: displayNumericValue(fyData.gouBar.value),
                                             noData: true,
                                             message: 'No PBS data available for this fiscal year',
                                             clicked: true
                                           }
                                         });
                                       }
                                     }}
                                   />
                                   
                                   {/* Fiscal year label */}
                                   <text
                                     x={fyData.gouBar.x + barWidth + barSpacing / 2}
                                     y={margin.top + plotHeight + 20}
                                     textAnchor="middle"
                                     fontSize="12"
                                     fill="#333"
                                     fontWeight="600"
                                   >
                                     {fyData.fiscalYear}
                                   </text>
                                 </g>
                               ))}
                               
                               {/* Funding source labels */}
                               <text
                                 x={margin.left - 10}
                                 y={margin.top + plotHeight / 2 - 20}
                                 textAnchor="end"
                                 fontSize="12"
                                 fill="#22c55e"
                                 fontWeight="600"
                                 transform={`rotate(-90, ${margin.left - 10}, ${margin.top + plotHeight / 2 - 20})`}
                               >
                                 ExtFin
                               </text>
                               <text
                                 x={margin.left - 10}
                                 y={margin.top + plotHeight / 2 + 20}
                                 textAnchor="end"
                                 fontSize="12"
                                 fill="#eab308"
                                 fontWeight="600"
                                 transform={`rotate(-90, ${margin.left - 10}, ${margin.top + plotHeight / 2 + 20})`}
                               >
                                 GoU
                               </text>
                               
                               {/* Fiscal Year Summary
                               {Object.keys(fiscalYearData).length > 0 && (
                                 <foreignObject x={chartWidth - 300} y={chartHeight - 100} width="300" height="100">
                                   <div style={{ 
                                     fontSize: '11px',
                                     color: '#666',
                                     backgroundColor: 'rgba(255,255,255,0.9)',
                                     padding: '8px',
                                     borderRadius: '4px',
                                     border: '1px solid #e5e7eb',
                                     maxWidth: '300px'
                                   }}>
                                     <div style={{ fontWeight: '600', marginBottom: '4px', color: '#333' }}>
                                       Fiscal Year Totals:
                                     </div>
                                     {Object.keys(fiscalYearData).map(fy => (
                                       <div key={fy} style={{ marginBottom: '2px', fontSize: '10px' }}>
                                         <span style={{ fontWeight: '500' }}>{fy}:</span>
                                         <span style={{ marginLeft: '8px' }}>
                                           GoU: {displayNumericValue(fiscalYearData[fy].gouValue)} | 
                                           ExtFin: {displayNumericValue(fiscalYearData[fy].extFinValue)}
                                         </span>
                                       </div>
                                     ))}
                                   </div>
                                 </foreignObject>
                               )} */}
                               
                             </g>
                           );
                         })()}
                       </svg>
                       
                       
                       {/* Top Right Legend */}
                       <div style={{ 
                         position: 'absolute', 
                         top: '-12px', 
                         right: '0px',
                         display: 'flex',
                         gap: '30px',
                         alignItems: 'center',
                         backgroundColor: 'white',
                         padding: '12px 16px',
                         borderRadius: '0 0 0 6px',
                         boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                         border: '1px solid #e5e7eb',
                         fontSize: '14px',
                         fontWeight: '600'
                       }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                           <div style={{ 
                             width: '14px', 
                             height: '14px', 
                             backgroundColor: '#22c55e', 
                             borderRadius: '2px'
                           }}></div>
                           <span style={{ fontSize: '14px', color: '#333', fontWeight: '600' }}>ExtFin</span>
                         </div>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                           <div style={{ 
                             width: '14px', 
                             height: '14px', 
                             backgroundColor: '#eab308', 
                             borderRadius: '2px'
                           }}></div>
                           <span style={{ fontSize: '14px', color: '#333', fontWeight: '600' }}>GoU</span>
                         </div>
                       </div>
                       
                       {/* MTEF Ceiling Tooltip */}
                       {mtefTooltip.visible && mtefTooltip.data && (
                         <div
                           style={{
                             position: 'fixed',
                             left: mtefTooltip.x + 10,
                             top: mtefTooltip.y - 10,
                             backgroundColor: 'white',
                             color: '#333',
                             padding: '10px 14px',
                             borderRadius: '6px',
                             fontSize: '13px',
                             fontWeight: '600',
                             boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                             zIndex: 9999,
                             pointerEvents: 'auto',
                             minWidth: '250px',
                             textAlign: 'center',
                             opacity: 1,
                             transition: 'all 0.1s ease-in-out',
                             border: '1px solid #e5e7eb',
                             maxWidth: '300px'
                           }}
                         >
                           <div style={{ marginBottom: '8px', fontSize: '16px', fontWeight: '700' }}>
                             MTEF Ceiling - {mtefTooltip.data.type}
                           </div>
                           {mtefTooltip.data.fiscalYear && (
                             <div style={{ marginBottom: '6px', fontSize: '14px', color: '#666' }}>
                               {mtefTooltip.data.fiscalYear}
                             </div>
                           )}
                           {mtefTooltip.data.noData ? (
                             <div style={{ 
                               fontSize: '12px', 
                               color: '#dc2626', 
                               marginTop: '6px', 
                               marginBottom: '4px',
                               fontWeight: '600',
                               backgroundColor: '#fef2f2',
                               padding: '8px',
                               borderRadius: '4px',
                               border: '1px solid #fecaca'
                             }}>
                               <div style={{ marginBottom: '4px' }}>⚠️ {mtefTooltip.data.message}</div>
                               <div style={{ fontSize: '11px', color: '#666' }}>
                                 This fiscal year shows estimated values based on equal distribution
                               </div>
                             </div>
                           ) : (
                             <>
                               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                 <span style={{ fontWeight: '700' }}>Budget:</span>
                                 <span style={{ fontWeight: '700' }}>{mtefTooltip.data.formatted}</span>
                               </div>
                               {mtefTooltip.data.clicked && mtefTooltip.data.itemCodes && mtefTooltip.data.itemCodes.length > 0 && (
                                 <div style={{ 
                                   marginTop: '8px', 
                                   padding: '8px', 
                                   backgroundColor: '#f8f9fa', 
                                   borderRadius: '4px',
                                   fontSize: '11px',
                                   textAlign: 'left',
                                   cursor: 'pointer'
                                 }}
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   setMtefItemCodesExpanded(!mtefItemCodesExpanded);
                                 }}
                                 >
                                   <div style={{ fontWeight: '600', marginBottom: '4px', color: '#495057' }}>
                                     Item Codes ({mtefTooltip.data.itemCodes.length}):
                                   </div>
                                   <div style={{ maxHeight: mtefItemCodesExpanded ? 'none' : '100px', overflowY: mtefItemCodesExpanded ? 'visible' : 'auto' }}>
                                     {(mtefItemCodesExpanded ? mtefTooltip.data.itemCodes : mtefTooltip.data.itemCodes.slice(0, 5)).map((item, index) => (
                                       <div key={index} style={{ marginBottom: '2px', fontSize: '10px' }}>
                                         <span style={{ fontWeight: '600' }}>{item.code}</span> - {item.description}
                                       </div>
                                     ))}
                                     {!mtefItemCodesExpanded && mtefTooltip.data.itemCodes.length > 5 && (
                                       <div style={{ fontSize: '10px', color: '#666', fontStyle: 'italic' }}>
                                         ... and {mtefTooltip.data.itemCodes.length - 5} more
                                       </div>
                                     )}
                                   </div>
                                   {mtefTooltip.data.itemCodes.length > 5 && (
                                     <div style={{ 
                                       fontSize: '10px', 
                                       color: '#3b82f6', 
                                       fontWeight: '600',
                                       marginTop: '4px',
                                       textAlign: 'center'
                                     }}>
                                       {mtefItemCodesExpanded ? 'Click to collapse' : 'Click to expand all'}
                                     </div>
                                   )}
                                 </div>
                               )}
                             </>
                           )}
                         </div>
                       )}
                       
                       {/* Project Period Info */}
                       <div style={{ 
                         position: 'absolute', 
                         bottom: '10px', 
                         left: '20px',
                         fontSize: '12px',
                         color: '#666',
                         fontStyle: 'italic'
                       }}>
                         MTEF ceiling distributed across selected fiscal years
                       </div>
                     </div>
                  </Paper>
                </div>
              )}

              {/* Contract Evidence Section */}
              {showContractDialog.contract?.contractEvidenceFile && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ color: '#3F51B5', marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>
                    Contract Evidence
                  </h3>
                  <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', width: '30%', backgroundColor: '#f5f5f5' }}>Uploaded File</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Typography variant="body2" sx={{ flex: 1 }}>
                                {showContractDialog.contract.contractEvidenceFile.name}
                              </Typography>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                  const url = URL.createObjectURL(showContractDialog.contract.contractEvidenceFile);
                                  setFilePreviewDialog({
                                    open: true,
                                    fileUrl: url,
                                    fileName: showContractDialog.contract.contractEvidenceFile.name,
                                    fileType: showContractDialog.contract.contractEvidenceFile.type
                                  });
                                }}
                                sx={{ 
                                  minWidth: '100px',
                                  fontSize: '0.75rem'
                                }}
                              >
                                Preview File
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>File Type</TableCell>
                          <TableCell>
                            {showContractDialog.contract.contractEvidenceFile.type === 'application/pdf' ? 'PDF Document' : 
                             showContractDialog.contract.contractEvidenceFile.type.startsWith('image/') ? 'Image File' : 
                             'Unknown'}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>File Size</TableCell>
                          <TableCell>
                            {(showContractDialog.contract.contractEvidenceFile.size / 1024 / 1024).toFixed(2)} MB
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              )}

              {/* Counterpart Evidence Section */}
              {showContractDialog.contract?.counterpartEvidenceFile && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ color: '#3F51B5', marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>
                    Counterpart Evidence
                  </h3>
                  <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', width: '30%', backgroundColor: '#f5f5f5' }}>Uploaded File</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Typography variant="body2" sx={{ flex: 1 }}>
                                {showContractDialog.contract.counterpartEvidenceFile.name}
                              </Typography>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                  const url = URL.createObjectURL(showContractDialog.contract.counterpartEvidenceFile);
                                  setFilePreviewDialog({
                                    open: true,
                                    fileUrl: url,
                                    fileName: showContractDialog.contract.counterpartEvidenceFile.name,
                                    fileType: showContractDialog.contract.counterpartEvidenceFile.type
                                  });
                                }}
                                sx={{ 
                                  minWidth: '100px',
                                  fontSize: '0.75rem'
                                }}
                              >
                                Preview File
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>File Type</TableCell>
                          <TableCell>
                            {showContractDialog.contract.counterpartEvidenceFile.type === 'application/pdf' ? 'PDF Document' : 
                             showContractDialog.contract.counterpartEvidenceFile.type.startsWith('image/') ? 'Image File' : 
                             'Unknown'}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>File Size</TableCell>
                          <TableCell>
                            {(showContractDialog.contract.counterpartEvidenceFile.size / 1024 / 1024).toFixed(2)} MB
                          </TableCell>
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
          <Button onClick={handleCloseShowContractDialog} autoFocus sx={buttonStyles}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Show Counterpart Overview Dialog */}
      <Dialog open={showCounterpartDialog.open} onClose={handleCloseShowCounterpartDialog} fullWidth maxWidth="lg">
        <DialogTitle>Counterpart Overview</DialogTitle>
        <DialogContent>
          {showCounterpartDialog.counterpart && (
            <div style={{ padding: '16px 0' }}>
              {/* Basic Counterpart Information */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ color: '#3F51B5', marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>
                  Counterpart Funding Information
                </h3>
                <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '30%', backgroundColor: '#f5f5f5' }}>Start Date (FY)</TableCell>
                        <TableCell>{showCounterpartDialog.counterpart.counterpartStartDate || 'N/A'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>End Date (FY)</TableCell>
                        <TableCell>{showCounterpartDialog.counterpart.counterpartEndDate || 'N/A'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Financing Agreement Title</TableCell>
                        <TableCell>{showCounterpartDialog.counterpart.counterpartFinancingTitle || 'N/A'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Counterpart Requirement Specification</TableCell>
                        <TableCell>{showCounterpartDialog.counterpart.counterpartRequirementSpec || 'N/A'}</TableCell>
                      </TableRow>
                      {hasMeaningfulData(showCounterpartDialog.counterpart.counterpartItemCode) && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Item Code</TableCell>
                        <TableCell>{showCounterpartDialog.counterpart.counterpartItemCode}</TableCell>
                      </TableRow>
                      )}
                      {hasMeaningfulData(showCounterpartDialog.counterpart.counterpartDescription) && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Description of Activity</TableCell>
                        <TableCell>{showCounterpartDialog.counterpart.counterpartDescription}</TableCell>
                      </TableRow>
                      )}
                      {hasMeaningfulData(showCounterpartDialog.counterpart.counterpartQuantity) && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Quantity</TableCell>
                        <TableCell>
                          {showCounterpartDialog.counterpart.counterpartQuantity}
                          {showCounterpartDialog.counterpart.counterpartQuantityUnit && 
                            ` ${showCounterpartDialog.counterpart.counterpartQuantityUnit}`
                          }
                        </TableCell>
                      </TableRow>
                      )}
                      {hasMeaningfulData(showCounterpartDialog.counterpart.counterpartFundingSource) && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Funding Source</TableCell>
                        <TableCell>{showCounterpartDialog.counterpart.counterpartFundingSource}</TableCell>
                      </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              {/* Financial Information */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ color: '#3F51B5', marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>
                  Financial Information
                </h3>
                <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '30%', backgroundColor: '#f5f5f5' }}>Counterpart Value</TableCell>
                        <TableCell>{displayFiscalYearValue(showCounterpartDialog.counterpart.counterpartValue)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                          {showCounterpartDialog.counterpart.counterpartFundingSource === "External" ? "Counterpart Disbursed" : "Counterpart Released"}
                        </TableCell>
                        <TableCell>{displayFiscalYearValue(showCounterpartDialog.counterpart.counterpartDisbursed)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Balance on Counterpart</TableCell>
                        <TableCell>{displayFiscalYearValue(showCounterpartDialog.counterpart.counterpartBalance)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              {/* Fiscal Year Pipeline Information */}
              {showCounterpartDialog.counterpart.counterpartFyHeaders && showCounterpartDialog.counterpart.counterpartFyHeaders.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ color: '#3F51B5', marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>
                    Fiscal Year Pipeline Information
                  </h3>
                  <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Funding Source</TableCell>
                          {showCounterpartDialog.counterpart.counterpartFyHeaders.map((fy) => (
                            <TableCell key={fy} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', textAlign: 'center' }}>
                              {fy}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {/* External row - only show if External is selected */}
                        {showCounterpartDialog.counterpart.counterpartFundingSource === "External" && (
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9ff' }}>External</TableCell>
                          {showCounterpartDialog.counterpart.counterpartFyHeaders.map((fy) => (
                            <TableCell key={`external-${fy}`} sx={{ textAlign: 'center' }}>
                              {displayFiscalYearValue(showCounterpartDialog.counterpart.counterpartPipelineExternal?.[fy])}
                            </TableCell>
                          ))}
                        </TableRow>
                        )}
                        {/* GoU row - only show if GoU is selected */}
                        {showCounterpartDialog.counterpart.counterpartFundingSource === "GoU" && (
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9ff' }}>GoU</TableCell>
                          {showCounterpartDialog.counterpart.counterpartFyHeaders.map((fy) => (
                            <TableCell key={`gou-${fy}`} sx={{ textAlign: 'center' }}>
                              {displayFiscalYearValue(showCounterpartDialog.counterpart.counterpartPipelineGoU?.[fy])}
                            </TableCell>
                          ))}
                        </TableRow>
                        )}
                        {/* Total row - only show if funding source is selected */}
                        {showCounterpartDialog.counterpart.counterpartFundingSource && (
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#fff2cc', fontSize: '0.875rem' }}>Total</TableCell>
                          {showCounterpartDialog.counterpart.counterpartFyHeaders.map((fy) => {
                            const gouValue = Number(showCounterpartDialog.counterpart.counterpartPipelineGoU?.[fy] || 0);
                            const extValue = Number(showCounterpartDialog.counterpart.counterpartPipelineExternal?.[fy] || 0);
                            const totalValue = gouValue + extValue;
                            return (
                              <TableCell key={`total-${fy}`} sx={{ textAlign: 'center', fontWeight: 'bold', backgroundColor: '#fff2cc', fontSize: '0.875rem' }}>
                                {displayFiscalYearValue(totalValue)}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              )}

              {/* Counterpart Evidence Section */}
              {showCounterpartDialog.counterpart.counterpartEvidenceFile && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ color: '#3F51B5', marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>
                    Counterpart Evidence
                  </h3>
                  <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', width: '30%', backgroundColor: '#f5f5f5' }}>Uploaded File</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Typography variant="body2" sx={{ flex: 1 }}>
                                {showCounterpartDialog.counterpart.counterpartEvidenceFile.name}
                              </Typography>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                  const url = URL.createObjectURL(showCounterpartDialog.counterpart.counterpartEvidenceFile);
                                  setFilePreviewDialog({
                                    open: true,
                                    fileUrl: url,
                                    fileName: showCounterpartDialog.counterpart.counterpartEvidenceFile.name,
                                    fileType: showCounterpartDialog.counterpart.counterpartEvidenceFile.type
                                  });
                                }}
                                sx={{ 
                                  minWidth: '100px',
                                  fontSize: '0.75rem'
                                }}
                              >
                                Preview File
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>File Type</TableCell>
                          <TableCell>
                            {showCounterpartDialog.counterpart.counterpartEvidenceFile.type === 'application/pdf' ? 'PDF Document' : 
                             showCounterpartDialog.counterpart.counterpartEvidenceFile.type.startsWith('image/') ? 'Image File' : 
                             'Unknown'}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>File Size</TableCell>
                          <TableCell>
                            {(showCounterpartDialog.counterpart.counterpartEvidenceFile.size / 1024 / 1024).toFixed(2)} MB
                          </TableCell>
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
          <Button onClick={handleCloseShowCounterpartDialog} autoFocus sx={buttonStyles}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Non-Contractual Show Dialog */}
      <Dialog open={showNonContractualDialog.open} onClose={handleCloseShowNonContractualDialog} fullWidth maxWidth="lg">
        <DialogTitle>Non-Contractual Entry Overview</DialogTitle>
        <DialogContent>
          {showNonContractualDialog.entry && (
            <div style={{ padding: '16px 0' }}>
              {/* Get PBS data as fallback if not saved in entry */}
              {(() => {
                const pbsData = nonContractualData.find(pbs => pbs.Project_Code === projectData.code) || {};
                const entry = showNonContractualDialog.entry;
                
                // Use saved data if available, otherwise use PBS data
                const displayData = {
                  voteCode: entry.voteCode || pbsData.Vote_Code || 'N/A',
                  voteName: entry.voteName || pbsData.Vote_Name || 'N/A',
                  programmeCode: entry.programmeCode || pbsData.Programme_Code || 'N/A',
                  programmeName: entry.programmeName || pbsData.Programme_Name || 'N/A'
                };
                
                return (
                  <div>
                    {/* Basic Non-Contractual Information */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ color: '#3F51B5', marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>
                  Non-Contractual Information
                </h3>
                <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '30%', backgroundColor: '#f5f5f5' }}>Vote Code</TableCell>
                        <TableCell>{displayData.voteCode}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Vote Name</TableCell>
                        <TableCell>{displayData.voteName}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Programme Code</TableCell>
                        <TableCell>{displayData.programmeCode}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Programme Name</TableCell>
                        <TableCell>{displayData.programmeName}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ 
                          fontWeight: 'bold', 
                          backgroundColor: '#f8f9fa',
                          color: '#1976d2',
                          fontSize: '0.875rem',
                          padding: 2,
                          borderBottom: '2px solid #e0e0e0'
                        }}>Item Code</TableCell>
                        <TableCell>{showNonContractualDialog.entry.itemCode || 'N/A'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ 
                          fontWeight: 'bold', 
                          backgroundColor: '#f8f9fa',
                          color: '#1976d2',
                          fontSize: '0.875rem',
                          padding: 2,
                          borderBottom: '2px solid #e0e0e0'
                        }}>Description of Activity</TableCell>
                        <TableCell>{showNonContractualDialog.entry.description || 'N/A'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Project Start Date (FY)</TableCell>
                        <TableCell>{showNonContractualDialog.entry.startDate || 'N/A'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Project End Date (FY)</TableCell>
                        <TableCell>{showNonContractualDialog.entry.endDate || 'N/A'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>GoU Amount</TableCell>
                        <TableCell>{displayFiscalYearValue(showNonContractualDialog.entry.goUAmount)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>External Amount</TableCell>
                        <TableCell>{displayFiscalYearValue(showNonContractualDialog.entry.externalAmount)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
    </div>

              {/* Fiscal Year Pipeline Information */}
              {showNonContractualDialog.entry.fyHeaders && showNonContractualDialog.entry.fyHeaders.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ color: '#3F51B5', marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>
                    Fiscal Year Pipeline Information
                  </h3>
                  <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Funding Source</TableCell>
                          {showNonContractualDialog.entry.fyHeaders.map((fy) => (
                            <TableCell key={fy} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', textAlign: 'center' }}>
                              {fy}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9ff' }}>GoU</TableCell>
                          {showNonContractualDialog.entry.fyHeaders.map((fy) => (
                            <TableCell key={`gou-${fy}`} sx={{ textAlign: 'center' }}>
                              {displayFiscalYearValue(showNonContractualDialog.entry.pipelineGoU?.[fy])}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9ff' }}>External</TableCell>
                          {showNonContractualDialog.entry.fyHeaders.map((fy) => (
                            <TableCell key={`ext-${fy}`} sx={{ textAlign: 'center' }}>
                              {displayFiscalYearValue(showNonContractualDialog.entry.pipelineExternal?.[fy])}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#fff2cc', fontSize: '0.875rem' }}>Total</TableCell>
                          {showNonContractualDialog.entry.fyHeaders.map((fy) => {
                            const gouValue = Number(showNonContractualDialog.entry.pipelineGoU?.[fy] || 0);
                            const extValue = Number(showNonContractualDialog.entry.pipelineExternal?.[fy] || 0);
                            const totalValue = gouValue + extValue;
                            return (
                              <TableCell key={`total-${fy}`} sx={{ textAlign: 'center', fontWeight: 'bold', backgroundColor: '#fff2cc', fontSize: '0.875rem' }}>
                                {displayFiscalYearValue(totalValue)}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              )}

              {/* MTEF Ceilings */}
              {showNonContractualDialog.entry.fyHeaders && showNonContractualDialog.entry.fyHeaders.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ color: '#3F51B5', marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>
                    Fiscal Year Projections
                  </h3>
                  <Paper sx={{ boxShadow: 'none', border: '1px solid #e0e0e0', padding: '20px' }}>
                     <div style={{ height: '400px', position: 'relative', padding: '20px', overflowX: 'auto' }}>
                       <svg width="100%" height="100%" style={{ overflow: 'visible', minWidth: '100%' }}>
                         {/* Chart area */}
                         {(() => {
                           const fyHeaders = showNonContractualDialog.entry.fyHeaders;
                           
                           // Dynamic chart dimensions based on number of fiscal years - even more space
                           const baseWidth = 1000;
                           const minWidthPerFiscalYear = 180; // Further increased minimum width per fiscal year
                           const chartWidth = Math.max(baseWidth, fyHeaders.length * minWidthPerFiscalYear);
                           const chartHeight = 320;
                           const margin = { top: 20, right: 30, left: 60, bottom: 5 };
                           const plotWidth = chartWidth - margin.left - margin.right;
                           const plotHeight = chartHeight - margin.top - margin.bottom;
                           
                           // Calculate max values for scaling
                           const allValues = fyHeaders.flatMap(fy => [
                             Number(showNonContractualDialog.entry.pipelineExternal?.[fy]) || 0,
                             Number(showNonContractualDialog.entry.pipelineGoU?.[fy]) || 0
                           ]);
                           const maxValue = Math.max(...allValues);
                           const minValue = 0;
                           const valueRange = maxValue - minValue;
                           
                           // Helper function to format currency values (like 60K UGX)
                           const formatCurrency = (value) => {
                             return `${(value / 1000).toFixed(0)}K UGX`;
                           };
                           
                           // Helper function to convert value to y coordinate
                           const valueToY = (value) => {
                             if (valueRange === 0) return margin.top + plotHeight / 2;
                             return margin.top + plotHeight - ((value - minValue) / valueRange) * plotHeight;
                           };
                           
                           // Calculate bar dimensions
                           const sideSpacing = Math.min(150, plotWidth * 0.18); // Further increased side spacing
                           const groupSpacing = Math.min(180, plotWidth / fyHeaders.length * 0.5); // Further increased group spacing
                           const availableWidth = plotWidth - (sideSpacing * 2);
                           const baseBarWidth = Math.min(60, availableWidth / fyHeaders.length * 0.4); // Further increased bar width
                           const adaptiveBarWidth = fyHeaders.length > 12 ? Math.max(35, baseBarWidth * 0.8) : baseBarWidth;
                           const barWidth = adaptiveBarWidth;
                           const barSpacing = fyHeaders.length > 12 ? Math.max(15, 22 * 0.8) : 22; // Further increased spacing
                           const totalBarWidth = (barWidth * 2) + barSpacing;
                           
                           // Helper function to convert index to x coordinate with very generous spacing
                           const indexToX = (index) => {
                             const startX = margin.left + sideSpacing + (index * (totalBarWidth + groupSpacing));
                             return startX;
                           };
                           
                           // Pre-calculate tooltip data for instant response
                           const tooltipDataMap = fyHeaders.reduce((acc, fy, index) => {
                             const externalValue = Number(showNonContractualDialog.entry.pipelineExternal?.[fy]) || 0;
                             const gouValue = Number(showNonContractualDialog.entry.pipelineGoU?.[fy]) || 0;
                             acc[fy] = {
                               fiscalYear: fy,
                               external: externalValue,
                               gou: gouValue,
                               total: externalValue + gouValue
                             };
                             return acc;
                           }, {});
                           
                           return (
                             <g transform={`translate(0, 0)`}>
                               {/* Y-axis grid lines and labels */}
                               {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                                 const value = minValue + (valueRange * ratio);
                                 const y = valueToY(value);
                                 return (
                                   <g key={`y-grid-${index}`}>
                                     <line
                                       x1={margin.left}
                                       y1={y}
                                       x2={margin.left + plotWidth}
                                       y2={y}
                                       stroke="#e0e0e0"
                                       strokeWidth="1"
                                       strokeDasharray="3 3"
                                     />
                                     <text
                                       x={margin.left - 15}
                                       y={y + 4}
                                       textAnchor="end"
                                       fontSize="12"
                                       fill="#666"
                                     >
                                       {formatCurrency(value)}
                                     </text>
                                   </g>
                                 );
                               })}
                               
                               {/* Bars for each fiscal year */}
                               {fyHeaders.map((fy, index) => {
                                 const externalValue = Number(showNonContractualDialog.entry.pipelineExternal?.[fy]) || 0;
                                 const gouValue = Number(showNonContractualDialog.entry.pipelineGoU?.[fy]) || 0;
                                 const groupCenterX = indexToX(index);
                                 const totalBarWidth = (barWidth * 2) + barSpacing;
                                 const extX = groupCenterX - totalBarWidth / 2;
                                 const gouX = groupCenterX - totalBarWidth / 2 + barWidth + barSpacing;
                                 
                                 // Calculate bar heights
                                 const extHeight = valueRange > 0 ? ((externalValue / maxValue) * plotHeight) : 0;
                                 const gouHeight = valueRange > 0 ? ((gouValue / maxValue) * plotHeight) : 0;
                                 
                                 // Calculate bar Y positions
                                 const extY = valueToY(externalValue);
                                 const gouY = valueToY(gouValue);
                                 
                                 const isHovered = tooltip.visible && tooltip.data && tooltip.data.fiscalYear === fy;
                                 
                                 return (
                                   <g key={`fy-group-${fy}`}>
                                     {/* Hover highlight background */}
                                     {isHovered && (
                                       <rect
                                         x={extX - 8}
                                         y={margin.top - 5}
                                         width={totalBarWidth + 16}
                                         height={plotHeight + 10}
                                         fill="#f5f5f5"
                                         opacity="1"
                                         rx="4"
                                       />
                                     )}
                                     
                                     {/* Invisible hover area */}
                                     <rect
                                       x={extX}
                                       y={margin.top}
                                       width={totalBarWidth}
                                       height={plotHeight}
                                       fill="transparent"
                                       onMouseEnter={(e) => {
                                         setTooltip({
                                           visible: true,
                                           x: e.clientX,
                                           y: e.clientY,
                                           data: tooltipDataMap[fy]
                                         });
                                       }}
                                       onMouseMove={(e) => {
                                         if (tooltip.visible) {
                                           setTooltip(prev => ({
                                             ...prev,
                                             x: e.clientX,
                                             y: e.clientY
                                           }));
                                         }
                                       }}
                                       onMouseLeave={() => {
                                         setTooltip(prev => ({ ...prev, visible: false }));
                                       }}
                                       style={{ cursor: 'pointer' }}
                                     />
                                     
                                     {/* External bar */}
                                     <rect
                                       x={extX}
                                       y={extY}
                                       width={barWidth}
                                       height={extHeight}
                                       fill={isHovered ? "#2563eb" : "#3b82f6"}
                                       stroke={isHovered ? "#1d4ed8" : "none"}
                                       strokeWidth={isHovered ? "2" : "0"}
                                       style={{ cursor: 'pointer' }}
                                     />
                                     
                                     {/* GoU bar */}
                                     <rect
                                       x={gouX}
                                       y={gouY}
                                       width={barWidth}
                                       height={gouHeight}
                                       fill={isHovered ? "#7c3aed" : "#8b5cf6"}
                                       stroke={isHovered ? "#6d28d9" : "none"}
                                       strokeWidth={isHovered ? "2" : "0"}
                                       style={{ cursor: 'pointer' }}
                                     />
                                     
                                   </g>
                                 );
                               })}
                               
                               {/* X-axis labels - aligned with bar groups */}
                               {fyHeaders.map((fy, index) => {
                                 const groupCenterX = indexToX(index);
                                 const isLabelHovered = tooltip.visible && tooltip.data && tooltip.data.fiscalYear === fy;
                                 return (
                                   <text
                                     key={`x-label-${index}`}
                                     x={groupCenterX}
                                     y={margin.top + plotHeight + 20}
                                     textAnchor="middle"
                                     fontSize="14"
                                     fill={isLabelHovered ? "#2563eb" : "#333"}
                                     fontWeight={isLabelHovered ? "700" : "600"}
                                   >
                                     {fy}
                                   </text>
                                 );
                               })}
                               
                               {/* Legend */}
                               <g transform={`translate(${margin.left + plotWidth - 80}, ${margin.top - 35})`}>
                                 <rect x="0" y="0" width="12" height="12" fill="#3b82f6" opacity="0.8" />
                                 <text x="20" y="10" fontSize="12" fill="#333">External</text>
                                 <rect x="80" y="0" width="12" height="12" fill="#8b5cf6" opacity="0.8" />
                                 <text x="100" y="10" fontSize="12" fill="#333">GoU</text>
                               </g>
                             </g>
                           );
                         })()}
                       </svg>
                       
                     </div>
                  </Paper>
                </div>
              )}
                  </div>
                );
              })()}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseShowNonContractualDialog} autoFocus sx={buttonStyles}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* File Preview Dialog */}
      <Dialog 
        open={filePreviewDialog.open} 
        onClose={() => setFilePreviewDialog({ open: false, fileUrl: '', fileName: '', fileType: '' })}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {filePreviewDialog.fileType === 'application/pdf' ? 'PDF Preview' : 'Image Preview'} - {filePreviewDialog.fileName}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '500px' }}>
            {filePreviewDialog.fileType === 'application/pdf' ? (
              <iframe
                src={filePreviewDialog.fileUrl}
                width="100%"
                height="600px"
                style={{
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
                title={filePreviewDialog.fileName}
              />
            ) : (
              <img 
                src={filePreviewDialog.fileUrl} 
                alt={filePreviewDialog.fileName}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '600px', 
                  objectFit: 'contain',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setFilePreviewDialog({ open: false, fileUrl: '', fileName: '', fileType: '' })}
            autoFocus 
            sx={buttonStyles}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      
    </div>
  );
}


