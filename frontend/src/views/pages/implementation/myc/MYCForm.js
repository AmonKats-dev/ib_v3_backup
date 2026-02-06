import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import { useRedirect } from 'react-admin';
import axios from 'axios';
import './MYCForm.css';
import Step1 from './components/Step1';
import Step2Contractual from './components/Step2Contractual';
import Step2NonContractual from './components/Step2NonContractual';
import Step2Counterpart from './components/Step2Counterpart';
import Step3 from './components/Step3';
import Step3_5 from './components/Step3_5';
import Step4 from './components/Step4';
import SuccessMessage from './components/SuccessMessage';
import AlertDialog from './components/AlertDialog';

const IMPLEMENTATION_SELECTED_PROJECT_KEY = 'implementation_module_selected_project';

const MYCForm = () => {
  const location = useLocation();
  const { id } = useParams();
  const history = useHistory();
  const redirect = useRedirect();
  const hasAutoPopulated = useRef(false);
  const lastPopulatedProjectCode = useRef(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCommitmentType, setSelectedCommitmentType] = useState('');
  const [isAllAtOnceMode, setIsAllAtOnceMode] = useState(false);
  const [currentFormType, setCurrentFormType] = useState(''); // Tracks which form type (contractual, non-contractual, counterpart) in all-at-once mode
  const [completedForms, setCompletedForms] = useState([]); // Array of completed forms in all-at-once mode
  const [allAtOnceBudgetItems, setAllAtOnceBudgetItems] = useState({}); // Budget items for each form type
  const [projectData, setProjectData] = useState(null);
  const [pbsData, setPbsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1
    commitmentType: '',
    
    // Step 2 - Contractual
    contractProjectTitle: '',
    contractReference: '',
    supplierName: '',
    totalContractValue: '',
    contractStartDate: '',
    contractEndDate: '',
    contractFundingSource: '',
    implementingAgency: '',
    contractDescription: '',
    // Procurement fields
    procurementCategory: '',
    procurementType: '',
    projectClassification: '',
    // Arrears tracking fields
    annualPenaltyRate: '',
    arrearsStartDate: '',
    verifiedArrears: '',
    unverifiedArrears: '',
    cumulativeArrears: '0',
    cumulativePenaltyExposure: '0',
    
    // Step 2 - Non-Contractual
    nonContractProjectTitle: '',
    obligationNature: '',
    policyReference: '',
    responsibleVote: '',
    estimatedTotalValue: '',
    commitmentStartDate: '',
    commitmentEndDate: '',
    nonContractFundingSource: '',
    obligationDescription: '',
    
    // Step 2 - Counterpart
    counterpartProjectTitle: '',
    donorName: '',
    financingAgreementRef: '',
    totalProjectValue: '',
    gouCounterpartValue: '',
    counterpartPercentage: '',
    counterpartFundingType: '',
    counterpartImplementingAgency: '',
    projectStartDate: '',
    projectEndDate: '',
    counterpartDescription: '',
    
    // Step 3.5
    justification: '',
    
    // Step 4
    additionalNotes: ''
  });
  
  const [budgetItems, setBudgetItems] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [alertDialog, setAlertDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    variant: 'info'
  });

  // Custom alert function
  const showAlert = (title, message, variant = 'warning') => {
    setAlertDialog({
      isOpen: true,
      title,
      message,
      variant
    });
  };

  const closeAlert = () => {
    setAlertDialog({
      isOpen: false,
      title: '',
      message: '',
      variant: 'info'
    });
  };

  // Function to fetch PBS data and extract Vote_Name
  const fetchPbsDataForProject = async (projectCode) => {
    try {
      setLoading(true);
      
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
                Sub_SubProgramme_Namef
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
      
      // Find the specific project data
      const projectPbsData = fetchedData.find(item => item.Project_Code === projectCode);
      
      if (projectPbsData) {
        setPbsData(projectPbsData);
        
        console.log('PBS data found:', {
          projectName: projectPbsData.Project_Name,
          voteName: projectPbsData.Vote_Name
        });
      } else {
        console.warn(`No PBS data found for project code: ${projectCode}`);
        setPbsData(null);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching PBS data:", error);
      setLoading(false);
    }
  };

  // Scope MYC form body styles to this page only so other pages can scroll
  useEffect(() => {
    document.body.classList.add('myc-form-page');
    return () => document.body.classList.remove('myc-form-page');
  }, []);

  // Reset auto-populate refs when navigating to a different project so title/vote re-populate
  useEffect(() => {
    if (id) {
      if (lastPopulatedProjectCode.current !== id) {
        hasAutoPopulated.current = false;
        lastPopulatedProjectCode.current = null;
      }
    }
  }, [id]);

  // Effect to handle project data: state, then sessionStorage, then localStorage cache
  useEffect(() => {
    const projectDataFromState = location.state?.projectData;
    if (projectDataFromState && projectDataFromState.code) {
      setProjectData(projectDataFromState);
      fetchPbsDataForProject(projectDataFromState.code);
      return;
    }
    if (!id) return;

    // Fallback: sessionStorage (set when user clicks Show on implementation-module or lands on costed-annualized-plan)
    try {
      const stored = sessionStorage.getItem(IMPLEMENTATION_SELECTED_PROJECT_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.code && String(parsed.code) === String(id)) {
          setProjectData(parsed);
          fetchPbsDataForProject(parsed.code);
          return;
        }
      }
    } catch (e) {
      // ignore
    }

    // Fallback: localStorage cache from implementation-module list (pbsProjectsData)
    const fetchProjectFromId = async () => {
      try {
        const cacheKey = 'pbsProjectsData';
        const cachedData = localStorage.getItem(cacheKey);
        const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);

        let pbsProjects = [];
        if (cachedData && cacheTimestamp) {
          const now = Date.now();
          const cacheAge = now - parseInt(cacheTimestamp);
          const fiveMinutes = 5 * 60 * 1000;
          if (cacheAge < fiveMinutes) {
            try {
              pbsProjects = JSON.parse(cachedData);
            } catch (error) {
              console.warn('Failed to parse cached PBS data:', error);
            }
          }
        }

        const projectPbsData = pbsProjects.find(item => item.Project_Code === id);
        if (projectPbsData) {
          const projectDataObj = {
            code: projectPbsData.Project_Code || id,
            title: projectPbsData.Project_Name || 'Project Title Not Available',
            voteName: projectPbsData.Vote_Name || '',
            start_date: '2024-01-15',
            status: 'Approved',
            phase: 'Implementation'
          };
          setProjectData(projectDataObj);
          fetchPbsDataForProject(projectDataObj.code);
        } else {
          const projectDataObj = {
            code: id,
            title: 'Project Title Not Available',
            voteName: '',
            start_date: 'N/A',
            status: 'N/A',
            phase: 'N/A'
          };
          setProjectData(projectDataObj);
          fetchPbsDataForProject(id);
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchProjectFromId();
  }, [location.state, id]);

  // Populate Project Title and Vote Name from implementation-module table as soon as projectData is available
  useEffect(() => {
    if (!projectData || !projectData.code) return;
    // Only run once per project so we don't overwrite user edits
    if (lastPopulatedProjectCode.current === projectData.code) return;
    lastPopulatedProjectCode.current = projectData.code;

    const projectTitle = projectData.title || '';
    const voteName = projectData.voteName || '';

    setFormData(prev => ({
      ...prev,
      // Project title for all commitment types
      contractProjectTitle: projectTitle || prev.contractProjectTitle,
      nonContractProjectTitle: projectTitle || prev.nonContractProjectTitle,
      counterpartProjectTitle: projectTitle || prev.counterpartProjectTitle,
      // Vote Name / MDA from implementation-module table: Contractual, Non-contractual, Counterpart
      implementingAgency: voteName || prev.implementingAgency,
      responsibleVote: voteName || prev.responsibleVote,
      counterpartImplementingAgency: voteName || prev.counterpartImplementingAgency
    }));
  }, [projectData]);

  // Effect to auto-populate Responsible Vote/MDA and Implementing Agency when PBS data is available
  // Contractual: Responsible Vote/MDA (implementingAgency); Non-contractual: Responsible Vote/MDA (responsibleVote); Counterpart: Implementing Agency (counterpartImplementingAgency)
  useEffect(() => {
    if (!pbsData || hasAutoPopulated.current) return;

    hasAutoPopulated.current = true;
    const voteName = pbsData.Vote_Name || '';
    const projectName = pbsData.Project_Name || (projectData && projectData.title) || '';

    setFormData(prev => ({
      ...prev,
      // Contractual: Responsible Vote/MDA + project title
      implementingAgency: voteName,
      contractProjectTitle: projectName || prev.contractProjectTitle,
      // Non-contractual: Responsible Vote/MDA + project title
      responsibleVote: voteName,
      nonContractProjectTitle: projectName || prev.nonContractProjectTitle,
      // Counterpart: Implementing Agency + project title
      counterpartImplementingAgency: voteName,
      counterpartProjectTitle: projectName || prev.counterpartProjectTitle
    }));
  }, [pbsData, projectData]);

  const updateFormData = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when field is updated - use functional update to avoid stale closure
    setErrors(prev => {
      if (prev[field]) {
        return {
          ...prev,
          [field]: null
        };
      }
      return prev;
    });
  }, []);

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.commitmentType) {
        newErrors.commitmentType = 'Please select a commitment type';
      }
    } else if (step === 2) {
      if (selectedCommitmentType === 'contractual') {
        const requiredFields = [
          'contractProjectTitle', 'contractReference', 'supplierName',
          'totalContractValue', 'contractStartDate', 'contractEndDate',
          'contractFundingSource', 'implementingAgency', 'contractDescription',
          'procurementCategory', 'procurementType', 'projectClassification'
        ];
        requiredFields.forEach(field => {
          if (!formData[field]) {
            newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
          }
        });
      } else if (selectedCommitmentType === 'non-contractual') {
        const requiredFields = [
          'nonContractProjectTitle', 'obligationNature', 'policyReference',
          'responsibleVote', 'estimatedTotalValue', 'commitmentStartDate',
          'commitmentEndDate', 'nonContractFundingSource', 'obligationDescription'
        ];
        requiredFields.forEach(field => {
          if (!formData[field]) {
            newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
          }
        });
      } else if (selectedCommitmentType === 'counterpart') {
        const requiredFields = [
          'counterpartProjectTitle', 'donorName', 'financingAgreementRef',
          'totalProjectValue', 'gouCounterpartValue', 'counterpartFundingType',
          'counterpartImplementingAgency', 'projectStartDate', 'projectEndDate',
          'counterpartDescription'
        ];
        requiredFields.forEach(field => {
          if (!formData[field]) {
            newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
          }
        });
      }
    } else if (step === 3) {
      // In all-at-once mode, check consolidated items from allAtOnceBudgetItems
      let itemsToCheck = budgetItems;
      if (isAllAtOnceMode) {
        const consolidated = [];
        if (allAtOnceBudgetItems.contractual) {
          consolidated.push(...allAtOnceBudgetItems.contractual);
        }
        if (allAtOnceBudgetItems['non-contractual']) {
          consolidated.push(...allAtOnceBudgetItems['non-contractual']);
        }
        if (allAtOnceBudgetItems.counterpart) {
          consolidated.push(...allAtOnceBudgetItems.counterpart);
        }
        itemsToCheck = consolidated;
      }
      
      if (itemsToCheck.length === 0) {
        showAlert(
          'Budget Items Required',
          'Please add at least one budget item before proceeding',
          'warning'
        );
        return false;
      }
      
      // In all-at-once mode, validate each commitment type separately
      if (isAllAtOnceMode) {
        const types = ['contractual', 'non-contractual', 'counterpart'];
        const partialAllocations = [];
        const overAllocations = [];
        
        for (const type of types) {
          const items = allAtOnceBudgetItems[type] || [];
          const commitmentValue = getCommitmentValueForType(type);
          const totalItems = items.reduce((sum, item) => sum + item.totalCost, 0);
          const typeLabel = type === 'contractual' ? 'Contractual' : 
                            type === 'non-contractual' ? 'Non-Contractual' : 'Counterpart';
          
          if (totalItems > commitmentValue) {
            // Over-budgeting is not allowed
            overAllocations.push({
              type: typeLabel,
              allocated: totalItems,
              commitment: commitmentValue
            });
          } else if (totalItems < commitmentValue && totalItems > 0) {
            // Under-budgeting - collect for consolidated warning
            const unallocated = commitmentValue - totalItems;
            const unallocatedPercent = ((unallocated / commitmentValue) * 100).toFixed(1);
            partialAllocations.push({
              type: typeLabel,
              allocated: totalItems,
              commitment: commitmentValue,
              unallocated: unallocated,
              percent: unallocatedPercent
            });
          }
        }
        
        // First check for over-allocations (blocking errors)
        if (overAllocations.length > 0) {
          const firstOverAllocation = overAllocations[0];
          showAlert(
            'Budget Allocation Exceeds Limit',
            `${firstOverAllocation.type} Commitment: Budget items total (UGX ${firstOverAllocation.allocated.toLocaleString()}) exceeds the total commitment value (UGX ${firstOverAllocation.commitment.toLocaleString()}). Please adjust your budget allocation.`,
            'error'
          );
          return false;
        }
        
        // Then show consolidated warning for partial allocations
        if (partialAllocations.length > 0) {
          let warningMessage = 'Partial budget allocations:\n\n';
          partialAllocations.forEach((allocation, index) => {
            warningMessage += `${index + 1}. ${allocation.type}: UGX ${allocation.allocated.toLocaleString()} allocated (${allocation.percent}%), UGX ${allocation.unallocated.toLocaleString()} unallocated\n\n`;
          });
          warningMessage += 'Note: These partial allocations are acceptable during initial MTEF stages and can be updated later.';
          
          showAlert(
            'Partial Budget Allocations',
            warningMessage,
            'warning'
          );
          // Allow to proceed with warning
        }
        
        // If no over-allocations and no partial allocations, it means all are exact matches
        // No dialog needed - validation passes silently (desired behavior)
      } else {
        // Single commitment type validation
        const totalCommitment = getTotalCommitmentValue();
        const totalItems = budgetItems.reduce((sum, item) => sum + item.totalCost, 0);
        
        if (totalItems > totalCommitment) {
          // Over-budgeting is not allowed
          showAlert(
            'Budget Allocation Exceeds Limit',
            `Budget items total (UGX ${totalItems.toLocaleString()}) exceeds the total commitment value (UGX ${totalCommitment.toLocaleString()}). Please adjust your budget allocation.`,
            'error'
          );
          return false;
        } else if (totalItems < totalCommitment && totalItems > 0) {
          // Under-budgeting is allowed with a warning
          const unallocated = totalCommitment - totalItems;
          const unallocatedPercent = ((unallocated / totalCommitment) * 100).toFixed(1);
          
          showAlert(
            'Partial Budget Allocation',
            `Only UGX ${totalItems.toLocaleString()} of UGX ${totalCommitment.toLocaleString()} (${unallocatedPercent}%) has been allocated. The remaining UGX ${unallocated.toLocaleString()} is not yet allocated in the MTEF. This is acceptable for initial submissions and can be updated later.`,
            'warning'
          );
          // Allow to proceed with warning
        }
      }
    } else if (step === 3.5) {
      // In all-at-once mode, check items from allAtOnceBudgetItems
      let itemsToValidate = budgetItems;
      if (isAllAtOnceMode) {
        const consolidated = [];
        if (allAtOnceBudgetItems.contractual) {
          consolidated.push(...allAtOnceBudgetItems.contractual);
        }
        if (allAtOnceBudgetItems['non-contractual']) {
          consolidated.push(...allAtOnceBudgetItems['non-contractual']);
        }
        if (allAtOnceBudgetItems.counterpart) {
          consolidated.push(...allAtOnceBudgetItems.counterpart);
        }
        itemsToValidate = consolidated;
      }
      
      let allItemsValid = true;
      itemsToValidate.forEach(item => {
        let itemTotal = 0;
        Object.values(item.annualBreakdown).forEach(amount => {
          itemTotal += amount;
        });
        
        if (Math.abs(itemTotal - item.totalCost) > 0.01) {
          showAlert(
            'Invalid Annual Breakdown',
            `Annual breakdown for "${item.description || item.itemDescription}" (UGX ${itemTotal.toLocaleString()}) must equal item total (UGX ${item.totalCost.toLocaleString()})`,
            'error'
          );
          allItemsValid = false;
        }
      });

      if (!allItemsValid) {
        return false;
      }

      if (!formData.justification) {
        newErrors.justification = 'Justification is required';
      }
    } else if (step === 4) {
      if (isAllAtOnceMode) {
        // For "All Commitment Types" mode, require at least 3 documents
        // (one for contractual, one for non-contractual, and one for counterpart)
        if (uploadedFiles.length < 3) {
          newErrors.files = 'At least three supporting documents are required (one evidence document for each commitment type: contractual, non-contractual, and counterpart)';
        }
      } else {
        // For single commitment mode, require at least 1 document
        if (uploadedFiles.length === 0) {
          newErrors.files = 'At least one supporting document is required';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getTotalCommitmentValue = () => {
    if (selectedCommitmentType === 'contractual') {
      return parseFloat(formData.totalContractValue) || 0;
    } else if (selectedCommitmentType === 'non-contractual') {
      return parseFloat(formData.estimatedTotalValue) || 0;
    } else if (selectedCommitmentType === 'counterpart') {
      return parseFloat(formData.gouCounterpartValue) || 0;
    }
    return 0;
  };

  // Get commitment value for a specific type (used in all-at-once mode)
  const getCommitmentValueForType = (type) => {
    if (type === 'contractual') {
      return parseFloat(formData.totalContractValue) || 0;
    } else if (type === 'non-contractual') {
      return parseFloat(formData.estimatedTotalValue) || 0;
    } else if (type === 'counterpart') {
      return parseFloat(formData.gouCounterpartValue) || 0;
    }
    return 0;
  };

  const nextStep = (step) => {
    if (!validateStep(step)) {
      return;
    }

    if (step === 1) {
      if (formData.commitmentType === 'all-at-once') {
        setIsAllAtOnceMode(true);
        setCurrentFormType('contractual');
        setSelectedCommitmentType('contractual');
      } else {
        setSelectedCommitmentType(formData.commitmentType);
      }
      setCurrentStep(2);
    } else if (step === 2) {
      if (isAllAtOnceMode) {
        // Save current form and move to next form type
        if (currentFormType === 'contractual') {
          setCompletedForms(prev => [...prev, 'contractual']);
          setAllAtOnceBudgetItems(prev => ({ ...prev, contractual: budgetItems }));
          setBudgetItems([]); // Clear budget items for next form
          setCurrentFormType('non-contractual');
          setSelectedCommitmentType('non-contractual');
        } else if (currentFormType === 'non-contractual') {
          setCompletedForms(prev => [...prev, 'non-contractual']);
          setAllAtOnceBudgetItems(prev => ({ ...prev, 'non-contractual': budgetItems }));
          setBudgetItems([]);
          setCurrentFormType('counterpart');
          setSelectedCommitmentType('counterpart');
        } else if (currentFormType === 'counterpart') {
          setCompletedForms(prev => [...prev, 'counterpart']);
          setAllAtOnceBudgetItems(prev => ({ ...prev, counterpart: budgetItems }));
          // Move to consolidated budget items view (Step 3)
          setCurrentFormType('review');
          setCurrentStep(3);
        }
      } else {
        setCurrentStep(3);
      }
    } else if (step === 3) {
      setCurrentStep(3.5);
    } else if (step === 3.5) {
      setCurrentStep(4);
    }
    
    window.scrollTo(0, 0);
  };

  const prevStep = (step) => {
    if (step === 2) {
      if (isAllAtOnceMode) {
        if (currentFormType === 'non-contractual') {
          // Go back to contractual form
          setCurrentFormType('contractual');
          setSelectedCommitmentType('contractual');
          setBudgetItems(allAtOnceBudgetItems.contractual || []);
        } else if (currentFormType === 'counterpart') {
          // Go back to non-contractual form
          setCurrentFormType('non-contractual');
          setSelectedCommitmentType('non-contractual');
          setBudgetItems(allAtOnceBudgetItems['non-contractual'] || []);
        } else {
          setCurrentStep(1);
        }
      } else {
        setCurrentStep(1);
      }
    } else if (step === 3) {
      if (isAllAtOnceMode && currentFormType === 'review') {
        // Go back to counterpart form
        setCurrentFormType('counterpart');
        setSelectedCommitmentType('counterpart');
        setCurrentStep(2);
      } else {
        setCurrentStep(2);
      }
    } else if (step === 3.5) {
      setCurrentStep(3);
    } else if (step === 4) {
      setCurrentStep(3.5);
    }
    
    window.scrollTo(0, 0);
  };

  const resetForm = () => {
    setFormData({
      commitmentType: '',
      contractProjectTitle: '',
      contractReference: '',
      supplierName: '',
      totalContractValue: '',
      contractStartDate: '',
      contractEndDate: '',
      contractFundingSource: '',
      implementingAgency: '',
      contractDescription: '',
      procurementCategory: '',
      procurementType: '',
      projectClassification: '',
      annualPenaltyRate: '',
      arrearsStartDate: '',
      verifiedArrears: '',
      unverifiedArrears: '',
      cumulativeArrears: '0',
      cumulativePenaltyExposure: '0',
      nonContractProjectTitle: '',
      obligationNature: '',
      policyReference: '',
      responsibleVote: '',
      estimatedTotalValue: '',
      commitmentStartDate: '',
      commitmentEndDate: '',
      nonContractFundingSource: '',
      obligationDescription: '',
      counterpartProjectTitle: '',
      donorName: '',
      financingAgreementRef: '',
      totalProjectValue: '',
      gouCounterpartValue: '',
      counterpartPercentage: '',
      counterpartFundingType: '',
      counterpartImplementingAgency: '',
      projectStartDate: '',
      projectEndDate: '',
      counterpartDescription: '',
      justification: '',
      additionalNotes: ''
    });
    setBudgetItems([]);
    setUploadedFiles([]);
    setErrors({});
    setCurrentStep(1);
    setSelectedCommitmentType('');
    setIsAllAtOnceMode(false);
    setCurrentFormType('');
    setCompletedForms([]);
    setAllAtOnceBudgetItems({});
    hasAutoPopulated.current = false; // Reset auto-population flag
    
    // Re-fetch PBS data to auto-populate fields for new commitment
    if (projectData) {
      fetchPbsDataForProject(projectData.code);
    }
    
    window.scrollTo(0, 0);
  };

  const submitForm = () => {
    if (!validateStep(4)) {
      return;
    }

    // Generate reference number
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const refNumber = `MYC-2025-${random.toString().padStart(5, '0')}`;
    
    setCurrentStep(5);
    window.scrollTo(0, 0);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
            nextStep={() => nextStep(1)}
            resetForm={resetForm}
          />
        );
      case 2:
        if (selectedCommitmentType === 'contractual') {
          return (
            <Step2Contractual
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
              nextStep={() => nextStep(2)}
              prevStep={() => prevStep(2)}
              isAllAtOnceMode={isAllAtOnceMode}
              currentFormType={currentFormType}
              completedForms={completedForms}
            />
          );
        } else if (selectedCommitmentType === 'non-contractual') {
          return (
            <Step2NonContractual
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
              nextStep={() => nextStep(2)}
              prevStep={() => prevStep(2)}
              isAllAtOnceMode={isAllAtOnceMode}
              currentFormType={currentFormType}
              completedForms={completedForms}
            />
          );
        } else if (selectedCommitmentType === 'counterpart') {
          return (
            <Step2Counterpart
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
              nextStep={() => nextStep(2)}
              prevStep={() => prevStep(2)}
              isAllAtOnceMode={isAllAtOnceMode}
              currentFormType={currentFormType}
              completedForms={completedForms}
            />
          );
        }
        break;
      case 3:
        return (
          <Step3
            budgetItems={budgetItems}
            setBudgetItems={setBudgetItems}
            getTotalCommitmentValue={getTotalCommitmentValue}
            getCommitmentValueForType={getCommitmentValueForType}
            nextStep={() => nextStep(3)}
            prevStep={() => prevStep(3)}
            projectData={projectData}
            pbsData={pbsData}
            isAllAtOnceMode={isAllAtOnceMode}
            allAtOnceBudgetItems={allAtOnceBudgetItems}
            setAllAtOnceBudgetItems={setAllAtOnceBudgetItems}
            formData={formData}
          />
        );
      case 3.5:
        return (
          <Step3_5
            budgetItems={budgetItems}
            setBudgetItems={setBudgetItems}
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
            nextStep={() => nextStep(3.5)}
            prevStep={() => prevStep(3.5)}
            isAllAtOnceMode={isAllAtOnceMode}
            allAtOnceBudgetItems={allAtOnceBudgetItems}
            setAllAtOnceBudgetItems={setAllAtOnceBudgetItems}
          />
        );
      case 4:
        return (
          <Step4
            formData={formData}
            updateFormData={updateFormData}
            budgetItems={budgetItems}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            errors={errors}
            selectedCommitmentType={selectedCommitmentType}
            getTotalCommitmentValue={getTotalCommitmentValue}
            nextStep={() => nextStep(4)}
            prevStep={() => prevStep(4)}
            submitForm={submitForm}
            projectData={projectData}
            pbsData={pbsData}
            isAllAtOnceMode={isAllAtOnceMode}
            completedForms={completedForms}
            allAtOnceBudgetItems={allAtOnceBudgetItems}
          />
        );
      case 5:
        return <SuccessMessage resetForm={resetForm} />;
      default:
        return null;
    }
  };

  return (
    <div className="container">
      {/* Back Button */}
      <div className="back-button-container">
        <button
          className="back-button"
          onClick={() => {
            redirect(
              `/implementation-module/${Number(id)}/costed-annualized-plan`
            );
          }}
        >
          <svg className="back-button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
      </div>

      {/* Header */}
      <div className="header">
        <div className="header-content">
          <div className="logo-section">
            <div className="header-title">
              <h1>Multi-Year Commitments Form Submission</h1>

              {/* Project Information Display - Hidden */}
              {/* {projectData && (
                <div style={{ 
                  marginTop: '15px', 
                  padding: '15px', 
                  backgroundColor: '#3F51B5', 
                  borderRadius: '8px',
                  border: '2px solid #ffd700',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ color: 'white' }}>
                      <strong style={{ color: '#ffd700' }}>Project:</strong> {projectData.title}
                    </div>
                    <div style={{ color: 'white' }}>
                      <strong style={{ color: '#ffd700' }}>Code:</strong> {projectData.code}
                    </div>
                    {pbsData && (
                      <div style={{ color: 'white' }}>
                        <strong style={{ color: '#ffd700' }}>MDA:</strong> {pbsData.Vote_Name}
                      </div>
                    )}
                    {loading && (
                      <div style={{ color: '#ffd700', fontSize: '14px' }}>
                        🔄 Loading project details...
                      </div>
                    )}
                  </div>
                  <div style={{ marginTop: '10px', fontSize: '13px', color: '#e3f2fd', fontStyle: 'italic' }}>
                    Project title and MDA name fields will be auto-populated based on PBS data
                  </div>
                </div>
              )} */}
              
              {/* Warning when no project data */}
              {!projectData && (
                <div style={{ 
                  marginTop: '15px', 
                  padding: '10px', 
                  backgroundColor: '#fff3cd', 
                  borderRadius: '6px',
                  border: '1px solid #ffeaa7'
                }}>
                  <div style={{ color: '#856404', fontSize: '14px' }}>
                    ⚠️ <strong>No project selected:</strong> Please navigate to this form from the Implementation Module to enable auto-population of project details.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Steps */}
      <div className="form-navigation">
        <div className="nav-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="step-circle">1</div>
            <div className="step-label">Commitment Type</div>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="step-circle">2</div>
            <div className="step-label">
              {isAllAtOnceMode ? (
                <>
                  Details
                  {currentFormType === 'contractual' && <span style={{fontSize: '11px', display: 'block', marginTop: '4px', fontWeight: 'normal', opacity: 0.8}}>(Contractual)</span>}
                  {currentFormType === 'non-contractual' && <span style={{fontSize: '11px', display: 'block', marginTop: '4px', fontWeight: 'normal', opacity: 0.8}}>(Non-Contractual)</span>}
                  {currentFormType === 'counterpart' && <span style={{fontSize: '11px', display: 'block', marginTop: '4px', fontWeight: 'normal', opacity: 0.8}}>(Counterpart)</span>}
                </>
              ) : 'Details'}
            </div>
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-circle">3</div>
            <div className="step-label">Financial Breakdown</div>
          </div>
          <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
            <div className="step-circle">4</div>
            <div className="step-label">Review & Submit</div>
          </div>
        </div>
      </div>

      {/* All-at-once Progress Indicator */}
      {isAllAtOnceMode && currentStep === 2 && (
        <div style={{
          margin: '20px auto',
          maxWidth: '800px',
          padding: '15px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          border: '2px solid #2196F3'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ color: '#1565C0', margin: 0 }}>
              <span style={{ marginRight: '10px' }}>📋</span>
              Submitting All Commitment Types
            </h3>
            <span style={{ 
              fontSize: '14px', 
              color: '#1565C0', 
              fontWeight: '600',
              backgroundColor: 'white',
              padding: '5px 15px',
              borderRadius: '20px'
            }}>
              {completedForms.length + 1}/3 Forms
            </span>
          </div>
          <div style={{ display: 'flex', gap: '5px', marginTop: '15px' }}>
            {['contractual', 'non-contractual', 'counterpart'].map((formType, idx) => {
              const isCompleted = completedForms.includes(formType);
              const isCurrent = currentFormType === formType;
              const status = isCurrent ? 'current' : isCompleted ? 'completed' : 'pending';
              
              return (
                <div 
                  key={formType}
                  style={{
                    flex: 1,
                    padding: '10px',
                    textAlign: 'center',
                    backgroundColor: 
                      status === 'completed' ? '#3F51B5' :
                      status === 'current' ? '#3F51B5' : '#e0e0e0',
                    color: status === 'pending' ? '#757575' : 'white',
                    borderRadius: '4px',
                    fontWeight: status === 'current' ? 'bold' : 'normal',
                    textTransform: 'capitalize',
                    fontSize: '13px'
                  }}
                >
                  {formType.replace('-', ' ')}
                  {status === 'completed' && <span style={{ color: '#4CAF50' }}> ✓</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="form-content">
        {renderCurrentStep()}
      </div>

      {/* Custom Alert Dialog */}
      <AlertDialog
        isOpen={alertDialog.isOpen}
        onClose={closeAlert}
        title={alertDialog.title}
        message={alertDialog.message}
        variant={alertDialog.variant}
      />
    </div>
  );
};

export default MYCForm;
