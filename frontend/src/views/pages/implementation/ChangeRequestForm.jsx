import { useHistory, useParams, useLocation } from 'react-router-dom';
import { useDataProvider, useRedirect, useNotify } from 'react-admin';
import axios from 'axios';
import { API_URL } from '../../../constants/config';
import Tooltip from '@material-ui/core/Tooltip';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import './ChangeRequestForm.css';

import React, { useState, useEffect, useRef } from 'react';

const ChangeRequestForm = (props) =>  {
  const history = useHistory();
  const { id } = useParams();
  const location = useLocation();
  const redirect = useRedirect();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const [projectData, setProjectData] = useState(null);
  const [pbsProjectData, setPbsProjectData] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const isMountedRef = useRef(true);
  const [formData, setFormData] = useState({
    submissionDate: new Date().toISOString().split('T')[0],
    
    // Request Details (simplified)
    requestType: '',
    requestTitle: '',
    
    // Project Financial Performance (updated fields)
    financialYear: '',
    initialFinancialRequirement: '',
    q1Release: '',
    q2Release: '',
    q3Release: '',
    q4Release: '',
    totalReleases: '',
    budgetPerformance: '',
    absorptionPerformance: '',
    capitalRatio: '',
    recurrentRatio: '',
    financialPerformanceComments: '',
    
    // Project Physical Performance - Array of Outcomes
    outcomes: [
      {
        id: 1,
        outcomeOutputIndicator: '',
        originalBaseline: '',
        originalTarget: '',
        cumulativePhysicalPerformance: '',
        physicalPerformanceComments: ''
      }
    ],
    
    // Change Description
    changeDescription: '',
    currentSituation: '',
    proposedChange: '',
    reasonForChange: '',
    urgency: '',
    
    // Impact Analysis
    scopeImpact: '',
    scheduleImpact: '',
    scheduleDays: '',
    budgetImpact: '',
    budgetAmount: '',
    qualityImpact: '',
    resourceImpact: '',
    riskImpact: '',
    
    // Affected Areas
    affectedDeliverables: '',
    affectedStakeholders: '',
    affectedSystems: '',
    
    // Justification
    businessJustification: '',
    alternativesConsidered: '',
    consequencesIfNotApproved: '',
    
    // Financial Requirements for Extension - Array of Outputs
    extensionPeriod: '',
    extensionStartDate: '',
    extensionEndDate: '',
    outputs: [
      {
        id: 1,
        outputName: '',
        outputBudget: '',
        outputMilestones: '',
        outputDeliverables: '',
        outputTargets: ''
      }
    ],
    costBreakdown: '',
    fundingSource: '',
    financialJustification: '',
    
    // Implementation - Array of Outputs with dates
    implementationOutputs: [
      {
        id: 1,
        outputName: '',
        startDate: '',
        endDate: ''
      }
    ],
    implementationPlan: '',
    implementationPhases: '',
    resourcesRequired: '',
    implementationRisks: '',
    monitoringPlan: '',
    successCriteria: '',
    
    // Additional
    attachments: [],
    notes: ''
  });

  const [impactScore, setImpactScore] = useState({
    scope: 0,
    schedule: 0,
    budget: 0,
    quality: 0,
    overall: 0
  });

  const [performanceMetrics, setPerformanceMetrics] = useState({
    totalReleases: 0,
    capitalRecurrentTotal: 0
  });

  const [dragActive, setDragActive] = useState(false);

  // Helper function to get cached PBS data
  const getCachedPbsData = () => {
    const cacheKey = 'pbsProjectsData';
    const cachedData = localStorage.getItem(cacheKey);
    const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
    
    if (cachedData && cacheTimestamp) {
      const now = Date.now();
      const cacheAge = now - parseInt(cacheTimestamp);
      const fiveMinutes = 5 * 60 * 1000;
      
      if (cacheAge < fiveMinutes) {
        try {
          return JSON.parse(cachedData);
        } catch (error) {
          console.warn('Failed to parse cached PBS data:', error);
        }
      }
    }
    return null;
  };

  // Fetch PBS data
  const fetchPbsData = async () => {
    const cacheKey = 'pbsProjectsData';
    
    const cachedData = getCachedPbsData();
    if (cachedData) {
      return cachedData;
    }

    try {
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
      const seen = new Set();
      const uniqueData = fetchedData.filter((item) => {
        if (seen.has(item.Project_Code)) {
          return false;
        }
        seen.add(item.Project_Code);
        return true;
      });
      
      // Cache the data with timestamp
      localStorage.setItem(cacheKey, JSON.stringify(uniqueData));
      localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
      
      return uniqueData;
    } catch (error) {
      console.error("Error fetching PBS data:", error);
      return [];
    }
  };

  // Fetch project data
  useEffect(() => {
    isMountedRef.current = true;

    const fetchProjectData = async () => {
      const projectDetailId = props.match?.params?.id || id;
      
      if (projectDetailId) {
        // First, check if project data is in navigation state
        if (props.location?.state?.projectData || location?.state?.projectData) {
          if (isMountedRef.current) {
            const navData = props.location?.state?.projectData || location?.state?.projectData;
            if (!navData.vote_name) {
              try {
                const pbsProjects = await fetchPbsData();
                const projectCode = navData.code || projectDetailId;
                const projectPbsData = pbsProjects.find(item => item.Project_Code === projectCode);
                if (projectPbsData) {
                  navData.vote_name = projectPbsData.Vote_Name || '';
                }
              } catch (error) {
                console.warn("Error fetching vote name:", error);
              }
            }
            setPbsProjectData(navData);
          }
        } else {
          // Try to fetch from PBS API
          try {
            const pbsProjects = await fetchPbsData();
            const projectCode = projectDetailId;
            const projectPbsData = pbsProjects.find(item => item.Project_Code === projectCode);
            
            if (isMountedRef.current && projectPbsData) {
              const pbsData = {
                code: projectPbsData.Project_Code || projectCode,
                title: projectPbsData.Project_Name || 'Project Title Not Available',
                vote_name: projectPbsData.Vote_Name || '',
              };
              setPbsProjectData(pbsData);
            }
          } catch (error) {
            console.warn("Error fetching PBS project data:", error);
          }
        }

        // Try to fetch from backend API - project-details contains project_id
        try {
          const resp = await dataProvider.getOne("project-details", {
            id: projectDetailId,
          });
          
          if (isMountedRef.current && resp && resp.data) {
            setProjectData(resp.data);
            if (resp.data.project_id) {
              setProjectId(resp.data.project_id);
            }
          }
        } catch (error) {
          console.warn("Project details not found, may be a PBS project. Error:", error);
          // If project-details not found, try to use projectDetailId as project_id
          // This handles cases where the route param is already a project_id
          setProjectId(projectDetailId);
        }

        // Also try to fetch project directly in case projectDetailId is actually a project_id
        try {
          const res = await dataProvider.getOne("projects", {
            id: projectDetailId,
          });
          
          if (isMountedRef.current && res && res.data) {
            setProjectData(res.data);
            if (res.data.id) {
              setProjectId(res.data.id);
            }
          }
        } catch (error) {
          console.warn("Project not found. Error:", error);
        }
      }
    };
    
    fetchProjectData();
    
    return () => {
      isMountedRef.current = false;
    };
  }, [props.match?.params?.id, id, props.location?.state?.projectData, location?.state?.projectData, dataProvider]);

  useEffect(() => {
    calculateImpactScore();
  }, [formData.scopeImpact, formData.scheduleImpact, formData.budgetImpact, formData.qualityImpact]);

  useEffect(() => {
    calculatePerformanceMetrics();
  }, [formData.q1Release, formData.q2Release, formData.q3Release, formData.q4Release, formData.capitalRatio, formData.recurrentRatio]);

  const calculatePerformanceMetrics = () => {
    const q1 = parseFloat(formData.q1Release) || 0;
    const q2 = parseFloat(formData.q2Release) || 0;
    const q3 = parseFloat(formData.q3Release) || 0;
    const q4 = parseFloat(formData.q4Release) || 0;
    const capital = parseFloat(formData.capitalRatio) || 0;
    const recurrent = parseFloat(formData.recurrentRatio) || 0;

    const totalReleases = (q1 + q2 + q3 + q4).toFixed(2);
    const capitalRecurrentTotal = (capital + recurrent).toFixed(2);

    setPerformanceMetrics({
      totalReleases,
      capitalRecurrentTotal
    });

    // Update formData with calculated total
    setFormData(prev => ({
      ...prev,
      totalReleases: totalReleases
    }));
  };

  const calculateImpactScore = () => {
    const getScore = (impact) => {
      const scores = { 'none': 0, 'low': 1, 'medium': 2, 'high': 3, 'critical': 4 };
      return scores[impact] || 0;
    };

    const scope = getScore(formData.scopeImpact);
    const schedule = getScore(formData.scheduleImpact);
    const budget = getScore(formData.budgetImpact);
    const quality = getScore(formData.qualityImpact);
    const overall = Math.round((scope + schedule + budget + quality) / 4 * 10) / 10;

    setImpactScore({ scope, schedule, budget, quality, overall });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler for file uploads
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const fileData = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    }));
    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...fileData] }));
  };

  const removeAttachment = (index) => {
    const updatedAttachments = formData.attachments.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, attachments: updatedAttachments }));
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      const fileData = files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      }));
      setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...fileData] }));
    }
  };

  // Handler for outcome array changes
  const handleOutcomeChange = (index, field, value) => {
    const updatedOutcomes = [...formData.outcomes];
    updatedOutcomes[index][field] = value;
    setFormData(prev => ({ ...prev, outcomes: updatedOutcomes }));
  };

  const addOutcome = () => {
    const newOutcome = {
      id: formData.outcomes.length + 1,
      outcomeOutputIndicator: '',
      originalBaseline: '',
      originalTarget: '',
      cumulativePhysicalPerformance: '',
      physicalPerformanceComments: ''
    };
    setFormData(prev => ({ ...prev, outcomes: [...prev.outcomes, newOutcome] }));
  };

  const removeOutcome = (index) => {
    if (formData.outcomes.length > 1) {
      const updatedOutcomes = formData.outcomes.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, outcomes: updatedOutcomes }));
    }
  };

  // Handler for output array changes (Financial Requirements)
  const handleOutputChange = (index, field, value) => {
    const updatedOutputs = [...formData.outputs];
    updatedOutputs[index][field] = value;
    setFormData(prev => ({ ...prev, outputs: updatedOutputs }));
  };

  const addOutput = () => {
    const newOutput = {
      id: formData.outputs.length + 1,
      outputName: '',
      outputBudget: '',
      outputMilestones: '',
      outputDeliverables: '',
      outputTargets: ''
    };
    setFormData(prev => ({ ...prev, outputs: [...prev.outputs, newOutput] }));
  };

  const removeOutput = (index) => {
    if (formData.outputs.length > 1) {
      const updatedOutputs = formData.outputs.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, outputs: updatedOutputs }));
    }
  };

  // Handler for implementation output array changes
  const handleImplementationOutputChange = (index, field, value) => {
    const updatedImplementationOutputs = [...formData.implementationOutputs];
    updatedImplementationOutputs[index][field] = value;
    setFormData(prev => ({ ...prev, implementationOutputs: updatedImplementationOutputs }));
  };

  const addImplementationOutput = () => {
    const newImplementationOutput = {
      id: formData.implementationOutputs.length + 1,
      outputName: '',
      startDate: '',
      endDate: ''
    };
    setFormData(prev => ({ ...prev, implementationOutputs: [...prev.implementationOutputs, newImplementationOutput] }));
  };

  const removeImplementationOutput = (index) => {
    if (formData.implementationOutputs.length > 1) {
      const updatedImplementationOutputs = formData.implementationOutputs.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, implementationOutputs: updatedImplementationOutputs }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!projectId) {
      notify('Project ID is required. Please ensure you are accessing this form from a valid project.', 'error');
      return;
    }

    // Validate required fields
    if (!formData.requestType || !formData.requestTitle || !formData.financialYear) {
      notify('Please fill in all required fields before submitting.', 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare the data for submission
      const submitData = {
        project_id: projectId,
        appeal_status: 'SUBMITTED',
        submission_date: formData.submissionDate,
        request_type: formData.requestType,
        request_title: formData.requestTitle,
        financial_year: formData.financialYear,
        initial_financial_requirement: formData.initialFinancialRequirement || null,
        q1_release: formData.q1Release || null,
        q2_release: formData.q2Release || null,
        q3_release: formData.q3Release || null,
        q4_release: formData.q4Release || null,
        total_releases: performanceMetrics.totalReleases || null,
        budget_performance: formData.budgetPerformance || null,
        absorption_performance: formData.absorptionPerformance || null,
        capital_ratio: formData.capitalRatio || null,
        recurrent_ratio: formData.recurrentRatio || null,
        financial_performance_comments: formData.financialPerformanceComments || null,
        outcomes: JSON.stringify(formData.outcomes),
        current_situation: formData.currentSituation || null,
        proposed_change: formData.proposedChange || null,
        reason_for_change: formData.reasonForChange || null,
        urgency: formData.urgency || null,
        scope_impact: formData.scopeImpact || null,
        schedule_impact: formData.scheduleImpact || null,
        schedule_days: formData.scheduleDays || null,
        budget_impact: formData.budgetImpact || null,
        budget_amount: formData.budgetAmount || null,
        quality_impact: formData.qualityImpact || null,
        resource_impact: formData.resourceImpact || null,
        risk_impact: formData.riskImpact || null,
        affected_deliverables: formData.affectedDeliverables || null,
        affected_stakeholders: formData.affectedStakeholders || null,
        affected_systems: formData.affectedSystems || null,
        business_justification: formData.businessJustification || null,
        alternatives_considered: formData.alternativesConsidered || null,
        consequences_if_not_approved: formData.consequencesIfNotApproved || null,
        extension_period: formData.extensionPeriod || null,
        extension_start_date: formData.extensionStartDate || null,
        extension_end_date: formData.extensionEndDate || null,
        outputs: JSON.stringify(formData.outputs),
        cost_breakdown: formData.costBreakdown || null,
        funding_source: formData.fundingSource || null,
        financial_justification: formData.financialJustification || null,
        implementation_outputs: JSON.stringify(formData.implementationOutputs),
        implementation_plan: formData.implementationPlan || null,
        implementation_phases: formData.implementationPhases || null,
        resources_required: formData.resourcesRequired || null,
        implementation_risks: formData.implementationRisks || null,
        monitoring_plan: formData.monitoringPlan || null,
        success_criteria: formData.successCriteria || null,
        notes: formData.notes || null,
        impact_score: JSON.stringify(impactScore),
      };

      const response = await dataProvider.create('appeals', {
        data: submitData,
      });

      notify('Change Request submitted successfully!', 'success');
      
      // Redirect to appeals list or show page
      setTimeout(() => {
        redirect(`/appeals/${projectId}/list`);
      }, 1000);
    } catch (error) {
      console.error('Error submitting change request:', error);
      notify(error?.message || 'Failed to submit change request. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!projectId) {
      notify('Project ID is required. Please ensure you are accessing this form from a valid project.', 'error');
      return;
    }

    setIsSaving(true);
    
    try {
      // Prepare the data for draft save
      const draftData = {
        project_id: projectId,
        appeal_status: 'DRAFT',
        submission_date: formData.submissionDate,
        request_type: formData.requestType || null,
        request_title: formData.requestTitle || null,
        financial_year: formData.financialYear || null,
        initial_financial_requirement: formData.initialFinancialRequirement || null,
        q1_release: formData.q1Release || null,
        q2_release: formData.q2Release || null,
        q3_release: formData.q3Release || null,
        q4_release: formData.q4Release || null,
        total_releases: performanceMetrics.totalReleases || null,
        budget_performance: formData.budgetPerformance || null,
        absorption_performance: formData.absorptionPerformance || null,
        capital_ratio: formData.capitalRatio || null,
        recurrent_ratio: formData.recurrentRatio || null,
        financial_performance_comments: formData.financialPerformanceComments || null,
        outcomes: JSON.stringify(formData.outcomes),
        current_situation: formData.currentSituation || null,
        proposed_change: formData.proposedChange || null,
        reason_for_change: formData.reasonForChange || null,
        urgency: formData.urgency || null,
        scope_impact: formData.scopeImpact || null,
        schedule_impact: formData.scheduleImpact || null,
        schedule_days: formData.scheduleDays || null,
        budget_impact: formData.budgetImpact || null,
        budget_amount: formData.budgetAmount || null,
        quality_impact: formData.qualityImpact || null,
        resource_impact: formData.resourceImpact || null,
        risk_impact: formData.riskImpact || null,
        affected_deliverables: formData.affectedDeliverables || null,
        affected_stakeholders: formData.affectedStakeholders || null,
        affected_systems: formData.affectedSystems || null,
        business_justification: formData.businessJustification || null,
        alternatives_considered: formData.alternativesConsidered || null,
        consequences_if_not_approved: formData.consequencesIfNotApproved || null,
        extension_period: formData.extensionPeriod || null,
        extension_start_date: formData.extensionStartDate || null,
        extension_end_date: formData.extensionEndDate || null,
        outputs: JSON.stringify(formData.outputs),
        cost_breakdown: formData.costBreakdown || null,
        funding_source: formData.fundingSource || null,
        financial_justification: formData.financialJustification || null,
        implementation_outputs: JSON.stringify(formData.implementationOutputs),
        implementation_plan: formData.implementationPlan || null,
        implementation_phases: formData.implementationPhases || null,
        resources_required: formData.resourcesRequired || null,
        implementation_risks: formData.implementationRisks || null,
        monitoring_plan: formData.monitoringPlan || null,
        success_criteria: formData.successCriteria || null,
        notes: formData.notes || null,
        impact_score: JSON.stringify(impactScore),
      };

      const response = await dataProvider.create('appeals', {
        data: draftData,
      });

      notify('Draft saved successfully!', 'success');
      
      // Redirect to appeals list
      setTimeout(() => {
        redirect(`/appeals/${projectId}/list`);
      }, 1000);
    } catch (error) {
      console.error('Error saving draft:', error);
      notify(error?.message || 'Failed to save draft. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const getImpactColor = (level) => {
    const colors = {
      'none': '#10b981',
      'low': '#3b82f6',
      'medium': '#f59e0b',
      'high': '#f97316',
      'critical': '#ef4444'
    };
    return colors[level] || '#6b7280';
  };

  const getImpactLabel = (score) => {
    if (score === 0) return 'No Impact';
    if (score <= 1) return 'Low Impact';
    if (score <= 2) return 'Medium Impact';
    if (score <= 3) return 'High Impact';
    return 'Critical Impact';
  };

  // Generate financial years from FY2023/24 to FY2030/2031
  const getFinancialYears = () => {
    const years = [];
    for (let startYear = 2023; startYear <= 2030; startYear++) {
      const endYear = (startYear + 1).toString().slice(-2);
      years.push(`FY${startYear}/${endYear}`);
    }
    return years;
  };

  const financialYears = getFinancialYears();

  const getTitle = () => {
    try {
      const projectDataFromState = props.location?.state?.projectData || location?.state?.projectData || pbsProjectData;
      const projectFromDetails = projectData?.project;
      const projectFromState = projectData;
      
      const projectCode = projectDataFromState?.code || 
                         projectFromDetails?.code || 
                         projectFromState?.code || 
                         projectFromState?.budget_code ||
                         props.match?.params?.id || 
                         id || 
                         "N/A";
      
      const projectTitle = projectDataFromState?.title || 
                          projectDataFromState?.name ||
                          projectFromDetails?.title ||
                          projectFromDetails?.name ||
                          projectFromState?.title ||
                          projectFromState?.name ||
                          null;

      return (
        <div className="main-header">
          <span className="header-chip form-chip">
            Appeals / Change Request Form
          </span>
          <div className="header-chips-group">
            <span className="header-chip project-code-chip">
              <span className="chip-label">Project Code:</span> {projectCode}
            </span>
            {projectTitle && projectTitle !== 'Loading...' && projectTitle !== 'Project Title Not Available' && (
              <span className="header-chip project-name-chip">
                <span className="chip-label">Project Name:</span> {projectTitle}
              </span>
            )}
          </div>
        </div>
      );
    } catch (error) {
      console.error("Error in getTitle:", error);
      return (
        <div className="main-header">
          <span className="header-chip form-chip">
            Appeal / Change Request Form
          </span>
        </div>
      );
    }
  };

  return (
    <div className="change-request-form-wrapper">

      <div className="container">
        {/* Back Button */}
        <div className="back-button-container">
          <button
            className="back-button"
            onClick={() => {
              redirect(
                `/implementation-module/${Number(props.match?.params?.id || id)}/costed-annualized-plan`
              );
            }}
          >
            <svg className="back-button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
        </div>

        {getTitle()}
        <div className="form-content">
          <form onSubmit={handleSubmit}>
            {/* Request Details Section */}
            <div className="section">
              <h2 className="section-title">Request Details</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="requestType">Request Type <span className="required">*</span></label>
                  <select 
                    id="requestType" 
                    name="requestType"
                    value={formData.requestType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select request type</option>
                    <option value="scope-change">Scope Change</option>
                    <option value="schedule-change">Schedule Change</option>
                    <option value="budget-change">Budget Change</option>
                    <option value="resource-change">Resource Change</option>
                    <option value="quality-change">Quality Standards Change</option>
                    <option value="process-change">Process/Methodology Change</option>
                    <option value="requirement-change">Requirement Change</option>
                    <option value="design-change">Design Change</option>
                    <option value="appeal">Appeal/Escalation</option>
                    <option value="extension">Project Extension</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="submissionDate">Submission Date <span className="required">*</span></label>
                  <input 
                    type="date" 
                    id="submissionDate" 
                    name="submissionDate"
                    value={formData.submissionDate}
                    onChange={handleInputChange}
                    readOnly
                    required 
                    style={{background: '#f3f4f6', cursor: 'not-allowed'}}
                  />
                </div>
              </div>
              <div className="form-row single">
                <div className="form-group">
                  <label htmlFor="requestTitle">Request Title <span className="required">*</span></label>
                  <input 
                    type="text" 
                    id="requestTitle" 
                    name="requestTitle"
                    value={formData.requestTitle}
                    onChange={handleInputChange}
                    placeholder="Brief, descriptive title of the change request"
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Project Financial Performance Section */}
            <div className="section">
              <h2 className="section-title">Project Financial Performance</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="financialYear">Financial Year <span className="required">*</span></label>
                  <select 
                    id="financialYear" 
                    name="financialYear"
                    value={formData.financialYear}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select financial year</option>
                    {financialYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="initialFinancialRequirement">Initial Financial Requirement (Ugx) <span className="required">*</span></label>
                  <input 
                    type="number" 
                    id="initialFinancialRequirement" 
                    name="initialFinancialRequirement"
                    value={formData.initialFinancialRequirement}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="q1Release">Q1 Release (Ugx) <span className="required">*</span></label>
                  <input 
                    type="number" 
                    id="q1Release" 
                    name="q1Release"
                    value={formData.q1Release}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    required
                    disabled={!formData.financialYear}
                    style={!formData.financialYear ? {background: '#f3f4f6', cursor: 'not-allowed'} : {}}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="q2Release">Q2 Release (Ugx) <span className="required">*</span></label>
                  <input 
                    type="number" 
                    id="q2Release" 
                    name="q2Release"
                    value={formData.q2Release}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    required
                    disabled={!formData.financialYear}
                    style={!formData.financialYear ? {background: '#f3f4f6', cursor: 'not-allowed'} : {}}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="q3Release">Q3 Release (Ugx) <span className="required">*</span></label>
                  <input 
                    type="number" 
                    id="q3Release" 
                    name="q3Release"
                    value={formData.q3Release}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    required
                    disabled={!formData.financialYear}
                    style={!formData.financialYear ? {background: '#f3f4f6', cursor: 'not-allowed'} : {}}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="q4Release">Q4 Release (Ugx) <span className="required">*</span></label>
                  <input 
                    type="number" 
                    id="q4Release" 
                    name="q4Release"
                    value={formData.q4Release}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    required
                    disabled={!formData.financialYear}
                    style={!formData.financialYear ? {background: '#f3f4f6', cursor: 'not-allowed'} : {}}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="totalReleases">Total Releases (Ugx)</label>
                  <input 
                    type="number" 
                    id="totalReleases" 
                    name="totalReleases"
                    value={performanceMetrics.totalReleases}
                    readOnly
                    style={{background: '#f3f4f6', fontWeight: '600'}}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="budgetPerformance">Budget Performance (%) <span className="required">*</span></label>
                  <input 
                    type="number" 
                    id="budgetPerformance" 
                    name="budgetPerformance"
                    value={formData.budgetPerformance}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="0.0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="absorptionPerformance">Absorption Performance (%) <span className="required">*</span></label>
                  <input 
                    type="number" 
                    id="absorptionPerformance" 
                    name="absorptionPerformance"
                    value={formData.absorptionPerformance}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="0.0"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="capitalRatio">Capital Ratio (%) <span className="required">*</span></label>
                  <input 
                    type="number" 
                    id="capitalRatio" 
                    name="capitalRatio"
                    value={formData.capitalRatio}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="0.0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recurrentRatio">Recurrent Ratio (%) <span className="required">*</span></label>
                  <input 
                    type="number" 
                    id="recurrentRatio" 
                    name="recurrentRatio"
                    value={formData.recurrentRatio}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="0.0"
                    required
                  />
                </div>
              </div>

              <div className="form-row single">
                <div className="form-group">
                  <label htmlFor="financialPerformanceComments">Financial Performance Comments</label>
                  <textarea 
                    id="financialPerformanceComments" 
                    name="financialPerformanceComments"
                    value={formData.financialPerformanceComments}
                    onChange={handleInputChange}
                    placeholder="Explain budget performance, absorption rates, and capital/recurrent distribution..."
                    rows="3"
                  />
                </div>
              </div>

              <div className="performance-card">
                <div className="performance-title">💰 Financial Performance Summary</div>
                <div className="performance-grid">
                  <div className="performance-item">
                    <div className="performance-label">Total Quarterly Releases</div>
                    <div className="performance-value">Ugx {performanceMetrics.totalReleases}</div>
                    <div className="performance-subtitle">across all quarters</div>
                  </div>
                  <div className="performance-item">
                    <div className="performance-label">Budget Performance</div>
                    <div className="performance-value">{formData.budgetPerformance}%</div>
                    <div className="performance-subtitle">of planned budget</div>
                  </div>
                  <div className="performance-item">
                    <div className="performance-label">Absorption Rate</div>
                    <div className="performance-value">{formData.absorptionPerformance}%</div>
                    <div className="performance-subtitle">of released funds</div>
                  </div>
                  <div className="performance-item">
                    <div className="performance-label">Capital/Recurrent Split</div>
                    <div className="performance-value">{formData.capitalRatio}% / {formData.recurrentRatio}%</div>
                    <div className="performance-subtitle">
                      Total: {performanceMetrics.capitalRecurrentTotal}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Physical Performance Section */}
            <div className="section">
              <h2 className="section-title">Project Physical Performance</h2>

              {formData.outcomes.map((outcome, index) => (
                <div key={outcome.id} className="dynamic-section">
                  <div className="dynamic-section-header">
                    <div className="dynamic-section-title">Outcome #{index + 1}</div>
                    {formData.outcomes.length > 1 && (
                      <button 
                        type="button" 
                        className="btn-remove" 
                        onClick={() => removeOutcome(index)}
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>

                  <div className="form-row single">
                    <div className="form-group">
                      <label htmlFor={`outcomeOutputIndicator-${index}`}>
                        Outcome / Output / Indicator <span className="required">*</span>
                      </label>
                      <textarea 
                        id={`outcomeOutputIndicator-${index}`}
                        value={outcome.outcomeOutputIndicator}
                        onChange={(e) => handleOutcomeChange(index, 'outcomeOutputIndicator', e.target.value)}
                        placeholder="Describe the key outcomes, outputs, and performance indicators..."
                        rows="4"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row three-col">
                    <div className="form-group">
                      <label htmlFor={`originalBaseline-${index}`}>
                        Original Baseline <span className="required">*</span>
                      </label>
                      <input 
                        type="text" 
                        id={`originalBaseline-${index}`}
                        value={outcome.originalBaseline}
                        onChange={(e) => handleOutcomeChange(index, 'originalBaseline', e.target.value)}
                        placeholder="e.g., 0 units, 20% coverage"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`originalTarget-${index}`}>
                        Original Target <span className="required">*</span>
                      </label>
                      <input 
                        type="text" 
                        id={`originalTarget-${index}`}
                        value={outcome.originalTarget}
                        onChange={(e) => handleOutcomeChange(index, 'originalTarget', e.target.value)}
                        placeholder="e.g., 100 units, 80% coverage"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`cumulativePhysicalPerformance-${index}`}>
                        Cumulative Physical Performance <span className="required">*</span>
                      </label>
                      <input 
                        type="text" 
                        id={`cumulativePhysicalPerformance-${index}`}
                        value={outcome.cumulativePhysicalPerformance}
                        onChange={(e) => handleOutcomeChange(index, 'cumulativePhysicalPerformance', e.target.value)}
                        placeholder="e.g., 65 units, 55% coverage"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row single">
                    <div className="form-group">
                      <label htmlFor={`physicalPerformanceComments-${index}`}>
                        Assessment of Cumulative Physical Performance
                      </label>
                      <textarea 
                        id={`physicalPerformanceComments-${index}`}
                        value={outcome.physicalPerformanceComments}
                        onChange={(e) => handleOutcomeChange(index, 'physicalPerformanceComments', e.target.value)}
                        placeholder="Provide a detailed assessment of progress towards targets, including achievements, challenges, and variances..."
                        rows="4"
                      />
                    </div>
                  </div>

                  <div className="performance-card">
                    <div className="performance-title">📊 Performance Summary - Outcome #{index + 1}</div>
                    <div className="performance-grid">
                      <div className="performance-item">
                        <div className="performance-label">Baseline Position</div>
                        <div className="performance-value" style={{fontSize: '20px'}}>
                          {outcome.originalBaseline || 'Not Set'}
                        </div>
                        <div className="performance-subtitle">starting point</div>
                      </div>
                      <div className="performance-item">
                        <div className="performance-label">Target Achievement</div>
                        <div className="performance-value" style={{fontSize: '20px'}}>
                          {outcome.originalTarget || 'Not Set'}
                        </div>
                        <div className="performance-subtitle">planned target</div>
                      </div>
                      <div className="performance-item">
                        <div className="performance-label">Current Progress</div>
                        <div className="performance-value" style={{fontSize: '20px'}}>
                          {outcome.cumulativePhysicalPerformance || 'Not Set'}
                        </div>
                        <div className="performance-subtitle">cumulative achievement</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="section-actions">
                <button type="button" className="btn-add" onClick={addOutcome}>
                  + Add Another Outcome
                </button>
              </div>
            </div>

            {/* Financial Requirements for Extension Section */}
            <div className="section">
              <h2 className="section-title">Financial Requirements of Project Outputs During Proposed Extension</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="extensionPeriod">Extension Period Requested <span className="required">*</span></label>
                  <input 
                    type="text" 
                    id="extensionPeriod" 
                    name="extensionPeriod"
                    value={formData.extensionPeriod}
                    onChange={handleInputChange}
                    placeholder="e.g., 3 months, 6 weeks"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="extensionStartDate">Extension Start Date <span className="required">*</span></label>
                  <input 
                    type="date" 
                    id="extensionStartDate" 
                    name="extensionStartDate"
                    value={formData.extensionStartDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="extensionEndDate">Extension End Date <span className="required">*</span></label>
                  <input 
                    type="date" 
                    id="extensionEndDate" 
                    name="extensionEndDate"
                    value={formData.extensionEndDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {formData.outputs.map((output, index) => (
                <div key={output.id} className="dynamic-section">
                  <div className="dynamic-section-header">
                    <div className="dynamic-section-title">Output #{index + 1}</div>
                    {formData.outputs.length > 1 && (
                      <button 
                        type="button" 
                        className="btn-remove" 
                        onClick={() => removeOutput(index)}
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>

                  <div className="form-row single">
                    <div className="form-group">
                      <label htmlFor={`outputName-${index}`}>
                        Output Name <span className="required">*</span>
                      </label>
                      <input 
                        type="text" 
                        id={`outputName-${index}`}
                        value={output.outputName}
                        onChange={(e) => handleOutputChange(index, 'outputName', e.target.value)}
                        placeholder="Name of the output"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor={`outputBudget-${index}`}>
                        Budget Required for this Output (Ugx) <span className="required">*</span>
                      </label>
                      <input 
                        type="number" 
                        id={`outputBudget-${index}`}
                        value={output.outputBudget}
                        onChange={(e) => handleOutputChange(index, 'outputBudget', e.target.value)}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row single">
                    <div className="form-group">
                      <label htmlFor={`outputTargets-${index}`}>
                        Measurable Targets/KPIs <span className="required">*</span>
                      </label>
                      <textarea 
                        id={`outputTargets-${index}`}
                        value={output.outputTargets}
                        onChange={(e) => handleOutputChange(index, 'outputTargets', e.target.value)}
                        placeholder="List specific, measurable targets or KPIs for this output..."
                        rows="3"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row single">
                    <div className="form-group">
                      <label htmlFor={`outputMilestones-${index}`}>
                        Key Milestones <span className="required">*</span>
                      </label>
                      <textarea 
                        id={`outputMilestones-${index}`}
                        value={output.outputMilestones}
                        onChange={(e) => handleOutputChange(index, 'outputMilestones', e.target.value)}
                        placeholder="List major milestones with target dates for this output..."
                        rows="3"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row single">
                    <div className="form-group">
                      <label htmlFor={`outputDeliverables-${index}`}>
                        Specific Deliverables <span className="required">*</span>
                      </label>
                      <textarea 
                        id={`outputDeliverables-${index}`}
                        value={output.outputDeliverables}
                        onChange={(e) => handleOutputChange(index, 'outputDeliverables', e.target.value)}
                        placeholder="List each deliverable with description and delivery date for this output..."
                        rows="3"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="section-actions">
                <button type="button" className="btn-add" onClick={addOutput}>
                  + Add Another Output
                </button>
              </div>

              <div className="form-row single">
                <div className="form-group">
                  <label htmlFor="costBreakdown">Detailed Cost Breakdown (Overall) <span className="required">*</span></label>
                  <textarea 
                    id="costBreakdown" 
                    name="costBreakdown"
                    value={formData.costBreakdown}
                    onChange={handleInputChange}
                    placeholder="Provide itemized budget breakdown: Personnel costs, Equipment, Materials, Consultancy fees, Travel, Overhead, etc..."
                    rows="5"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fundingSource">Funding Source <span className="required">*</span></label>
                  <select 
                    id="fundingSource" 
                    name="fundingSource"
                    value={formData.fundingSource}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select funding source</option>
                    <option value="government">Government of Uganda</option>
                    <option value="donor-funds">Donor/Grant Funds</option>
                    <option value="original-budget">Original Project Budget</option>
                    <option value="contingency">Contingency Reserve</option>
                    <option value="additional-allocation">Additional Budget Allocation</option>
                    <option value="cost-savings">Cost Savings from Other Areas</option>
                    <option value="other">Other Source</option>
                  </select>
                </div>
              </div>

              <div className="form-row single">
                <div className="form-group">
                  <label htmlFor="financialJustification">Financial Justification <span className="required">*</span></label>
                  <textarea 
                    id="financialJustification" 
                    name="financialJustification"
                    value={formData.financialJustification}
                    onChange={handleInputChange}
                    placeholder="Justify the financial requirements and explain the return on investment or value for money..."
                    rows="4"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Change Description Section */}
            <div className="section">
              <h2 className="section-title">Change Description</h2>
              <div className="form-row single">
                <div className="form-group">
                  <label htmlFor="currentSituation">Current Situation <span className="required">*</span></label>
                  <textarea 
                    id="currentSituation" 
                    name="currentSituation"
                    value={formData.currentSituation}
                    onChange={handleInputChange}
                    placeholder="Describe the current state or situation..."
                    required
                  />
                </div>
              </div>
              <div className="form-row single">
                <div className="form-group">
                  <label htmlFor="proposedChange">Proposed Change <span className="required">*</span></label>
                  <textarea 
                    id="proposedChange" 
                    name="proposedChange"
                    value={formData.proposedChange}
                    onChange={handleInputChange}
                    placeholder="Clearly describe the requested change in detail..."
                    required
                  />
                </div>
              </div>
              <div className="form-row single">
                <div className="form-group">
                  <label htmlFor="reasonForChange">Reason for Change <span className="required">*</span></label>
                  <textarea 
                    id="reasonForChange" 
                    name="reasonForChange"
                    value={formData.reasonForChange}
                    onChange={handleInputChange}
                    placeholder="Explain why this change is necessary..."
                    required
                  />
                </div>
              </div>
            </div>

            {/* Impact Analysis Section */}
            <div className="section">
              <h2 className="section-title">Impact Analysis</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="scopeImpact">
                    Scope Impact <span className="required">*</span>
                    <Tooltip title="Assess how this change will affect the project scope, deliverables, and objectives" placement="right">
                      <HelpOutlineIcon className="tooltip-icon" />
                    </Tooltip>
                  </label>
                  <select 
                    id="scopeImpact" 
                    name="scopeImpact"
                    value={formData.scopeImpact}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select impact level</option>
                    <option value="none">None - No scope change</option>
                    <option value="low">Low - Minor scope adjustment</option>
                    <option value="medium">Medium - Moderate scope change</option>
                    <option value="high">High - Significant scope change</option>
                    <option value="critical">Critical - Major scope overhaul</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="scheduleImpact">
                    Schedule Impact <span className="required">*</span>
                    <Tooltip title="Evaluate the impact on project timeline, milestones, and delivery dates" placement="right">
                      <HelpOutlineIcon className="tooltip-icon" />
                    </Tooltip>
                  </label>
                  <select 
                    id="scheduleImpact" 
                    name="scheduleImpact"
                    value={formData.scheduleImpact}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select impact level</option>
                    <option value="none">None - No delay</option>
                    <option value="low">Low - 1-5 days delay</option>
                    <option value="medium">Medium - 1-2 weeks delay</option>
                    <option value="high">High - 2-4 weeks delay</option>
                    <option value="critical">Critical - Over 1 month delay</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="scheduleDays">
                    Estimated Schedule Delay (days)
                    <Tooltip title="Enter the specific number of days the project schedule will be delayed" placement="right">
                      <HelpOutlineIcon className="tooltip-icon" />
                    </Tooltip>
                  </label>
                  <input 
                    type="number" 
                    id="scheduleDays" 
                    name="scheduleDays"
                    value={formData.scheduleDays}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="budgetImpact">
                    Budget Impact <span className="required">*</span>
                    <Tooltip title="Assess the financial impact on project budget, costs, and funding requirements" placement="right">
                      <HelpOutlineIcon className="tooltip-icon" />
                    </Tooltip>
                  </label>
                  <select 
                    id="budgetImpact" 
                    name="budgetImpact"
                    value={formData.budgetImpact}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select impact level</option>
                    <option value="none">None - No cost increase</option>
                    <option value="low">Low - Under 5% increase</option>
                    <option value="medium">Medium - 5-15% increase</option>
                    <option value="high">High - 15-30% increase</option>
                    <option value="critical">Critical - Over 30% increase</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="budgetAmount">
                    Estimated Cost Impact (Ugx)
                    <Tooltip title="Enter the specific amount in Ugandan Shillings (Ugx) of additional cost or budget impact" placement="right">
                      <HelpOutlineIcon className="tooltip-icon" />
                    </Tooltip>
                  </label>
                  <input 
                    type="number" 
                    id="budgetAmount" 
                    name="budgetAmount"
                    value={formData.budgetAmount}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="qualityImpact">
                    Quality Impact <span className="required">*</span>
                    <Tooltip title="Evaluate how this change will affect product quality, standards, and deliverables" placement="right">
                      <HelpOutlineIcon className="tooltip-icon" />
                    </Tooltip>
                  </label>
                  <select 
                    id="qualityImpact" 
                    name="qualityImpact"
                    value={formData.qualityImpact}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select impact level</option>
                    <option value="none">None - No quality impact</option>
                    <option value="low">Low - Minor quality adjustment</option>
                    <option value="medium">Medium - Moderate quality change</option>
                    <option value="high">High - Significant quality impact</option>
                    <option value="critical">Critical - Major quality concern</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="resourceImpact">
                    Resource Impact
                    <Tooltip title="Assess the impact on human resources, equipment, and other project resources" placement="right">
                      <HelpOutlineIcon className="tooltip-icon" />
                    </Tooltip>
                  </label>
                  <select 
                    id="resourceImpact" 
                    name="resourceImpact"
                    value={formData.resourceImpact}
                    onChange={handleInputChange}
                  >
                    <option value="">Select impact level</option>
                    <option value="none">None - Current resources sufficient</option>
                    <option value="low">Low - Minor resource adjustment</option>
                    <option value="medium">Medium - Additional resources needed</option>
                    <option value="high">High - Significant resource changes</option>
                    <option value="critical">Critical - Major resource overhaul</option>
                  </select>
                </div>
              </div>
              <div className="form-row single">
                <div className="form-group">
                  <label htmlFor="riskImpact">
                    Risk Impact Assessment
                    <Tooltip title="Describe any new risks introduced or existing risks affected by this change, including mitigation strategies" placement="right">
                      <HelpOutlineIcon className="tooltip-icon" />
                    </Tooltip>
                  </label>
                  <textarea 
                    id="riskImpact" 
                    name="riskImpact"
                    value={formData.riskImpact}
                    onChange={handleInputChange}
                    placeholder="Describe any new risks introduced or existing risks affected by this change..."
                    rows="3"
                  />
                </div>
              </div>

              <div className="impact-analysis-card">
                <div className="impact-title">📊 Comprehensive Impact Assessment</div>
                <div className="impact-grid">
                  <div className="impact-item" style={{borderLeftColor: getImpactColor(formData.scopeImpact)}}>
                    <div className="impact-label">Scope Impact</div>
                    <div className="impact-value" style={{color: getImpactColor(formData.scopeImpact)}}>
                      {formData.scopeImpact ? formData.scopeImpact.charAt(0).toUpperCase() + formData.scopeImpact.slice(1) : 'Not Set'}
                    </div>
                    <div className="impact-bar">
                      <div className="impact-bar-fill" style={{
                        width: `${impactScore.scope * 25}%`,
                        background: getImpactColor(formData.scopeImpact)
                      }}></div>
                    </div>
                  </div>
                  <div className="impact-item" style={{borderLeftColor: getImpactColor(formData.scheduleImpact)}}>
                    <div className="impact-label">Schedule Impact</div>
                    <div className="impact-value" style={{color: getImpactColor(formData.scheduleImpact)}}>
                      {formData.scheduleImpact ? formData.scheduleImpact.charAt(0).toUpperCase() + formData.scheduleImpact.slice(1) : 'Not Set'}
                    </div>
                    <div className="impact-bar">
                      <div className="impact-bar-fill" style={{
                        width: `${impactScore.schedule * 25}%`,
                        background: getImpactColor(formData.scheduleImpact)
                      }}></div>
                    </div>
                  </div>
                  <div className="impact-item" style={{borderLeftColor: getImpactColor(formData.budgetImpact)}}>
                    <div className="impact-label">Budget Impact</div>
                    <div className="impact-value" style={{color: getImpactColor(formData.budgetImpact)}}>
                      {formData.budgetImpact ? formData.budgetImpact.charAt(0).toUpperCase() + formData.budgetImpact.slice(1) : 'Not Set'}
                    </div>
                    <div className="impact-bar">
                      <div className="impact-bar-fill" style={{
                        width: `${impactScore.budget * 25}%`,
                        background: getImpactColor(formData.budgetImpact)
                      }}></div>
                    </div>
                  </div>
                  <div className="impact-item" style={{borderLeftColor: getImpactColor(formData.qualityImpact)}}>
                    <div className="impact-label">Quality Impact</div>
                    <div className="impact-value" style={{color: getImpactColor(formData.qualityImpact)}}>
                      {formData.qualityImpact ? formData.qualityImpact.charAt(0).toUpperCase() + formData.qualityImpact.slice(1) : 'Not Set'}
                    </div>
                    <div className="impact-bar">
                      <div className="impact-bar-fill" style={{
                        width: `${impactScore.quality * 25}%`,
                        background: getImpactColor(formData.qualityImpact)
                      }}></div>
                    </div>
                  </div>
                </div>
                <div className="overall-impact">
                  <div className="overall-label">Overall Impact Score</div>
                  <div className="overall-score">{impactScore.overall.toFixed(1)}</div>
                  <div className="overall-description" style={{color: getImpactColor(
                    impactScore.overall <= 1 ? 'low' : 
                    impactScore.overall <= 2 ? 'medium' : 
                    impactScore.overall <= 3 ? 'high' : 'critical'
                  )}}>
                    {getImpactLabel(impactScore.overall)}
                  </div>
                </div>
              </div>
            </div>

            {/* Affected Areas Section */}
            <div className="section">
              <h2 className="section-title">Affected Areas</h2>
              <div className="form-row single">
                <div className="form-group">
                  <label htmlFor="affectedDeliverables">Affected Deliverables</label>
                  <textarea 
                    id="affectedDeliverables" 
                    name="affectedDeliverables"
                    value={formData.affectedDeliverables}
                    onChange={handleInputChange}
                    placeholder="List project deliverables that will be impacted..."
                    rows="3"
                  />
                </div>
              </div>
              <div className="form-row single">
                <div className="form-group">
                  <label htmlFor="affectedStakeholders">Affected Stakeholders</label>
                  <textarea 
                    id="affectedStakeholders" 
                    name="affectedStakeholders"
                    value={formData.affectedStakeholders}
                    onChange={handleInputChange}
                    placeholder="Identify stakeholders who will be affected by this change..."
                    rows="3"
                  />
                </div>
              </div>
              <div className="form-row single">
                <div className="form-group">
                  <label htmlFor="affectedSystems">Affected Systems/Processes</label>
                  <textarea 
                    id="affectedSystems" 
                    name="affectedSystems"
                    value={formData.affectedSystems}
                    onChange={handleInputChange}
                    placeholder="List systems, processes, or workflows that will be impacted..."
                    rows="3"
                  />
                </div>
              </div>
            </div>

            {/* Justification Section */}
            <div className="section">
              <h2 className="section-title">Justification & Alternatives</h2>
              <div className="form-row single">
                <div className="form-group">
                  <label htmlFor="businessJustification">Business Justification <span className="required">*</span></label>
                  <textarea 
                    id="businessJustification" 
                    name="businessJustification"
                    value={formData.businessJustification}
                    onChange={handleInputChange}
                    placeholder="Provide detailed business justification for this change..."
                    required
                  />
                </div>
              </div>
              <div className="form-row single">
                <div className="form-group">
                  <label htmlFor="alternativesConsidered">Alternatives Considered</label>
                  <textarea 
                    id="alternativesConsidered" 
                    name="alternativesConsidered"
                    value={formData.alternativesConsidered}
                    onChange={handleInputChange}
                    placeholder="Describe alternative solutions that were considered and why they were not chosen..."
                  />
                </div>
              </div>
              <div className="form-row single">
                <div className="form-group">
                  <label htmlFor="consequencesIfNotApproved">Consequences if Not Approved</label>
                  <textarea 
                    id="consequencesIfNotApproved" 
                    name="consequencesIfNotApproved"
                    value={formData.consequencesIfNotApproved}
                    onChange={handleInputChange}
                    placeholder="Explain what will happen if this change request is not approved..."
                  />
                </div>
              </div>
            </div>

            {/* Implementation Plan Section */}
            <div className="section">
              <h2 className="section-title">Detailed Implementation Plan</h2>

              {formData.implementationOutputs.map((implOutput, index) => (
                <div key={implOutput.id} className="dynamic-section">
                  <div className="dynamic-section-header">
                    <div className="dynamic-section-title">Output #{index + 1} - Implementation Timeline</div>
                    {formData.implementationOutputs.length > 1 && (
                      <button 
                        type="button" 
                        className="btn-remove" 
                        onClick={() => removeImplementationOutput(index)}
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>

                  <div className="form-row single">
                    <div className="form-group">
                      <label htmlFor={`implOutputName-${index}`}>
                        Output Name <span className="required">*</span>
                      </label>
                      <input 
                        type="text" 
                        id={`implOutputName-${index}`}
                        value={implOutput.outputName}
                        onChange={(e) => handleImplementationOutputChange(index, 'outputName', e.target.value)}
                        placeholder="Name of the output"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor={`implStartDate-${index}`}>
                        Start Date <span className="required">*</span>
                      </label>
                      <input 
                        type="date" 
                        id={`implStartDate-${index}`}
                        value={implOutput.startDate}
                        onChange={(e) => handleImplementationOutputChange(index, 'startDate', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`implEndDate-${index}`}>
                        End Date <span className="required">*</span>
                      </label>
                      <input 
                        type="date" 
                        id={`implEndDate-${index}`}
                        value={implOutput.endDate}
                        onChange={(e) => handleImplementationOutputChange(index, 'endDate', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="section-actions">
                <button type="button" className="btn-add" onClick={addImplementationOutput}>
                  + Add Another Output
                </button>
              </div>
              
              <div className="form-row single">
                <div className="form-group">
                  <label htmlFor="implementationPlan">Overall Implementation Strategy <span className="required">*</span></label>
                  <textarea 
                    id="implementationPlan" 
                    name="implementationPlan"
                    value={formData.implementationPlan}
                    onChange={handleInputChange}
                    placeholder="Describe the comprehensive approach for implementing this change, including methodology, timeline, and coordination requirements..."
                    rows="5"
                    required
                  />
                </div>
              </div>

              <div className="form-row single">
                <div className="form-group">
                  <label htmlFor="implementationPhases">Implementation Phases & Activities <span className="required">*</span></label>
                  <textarea 
                    id="implementationPhases" 
                    name="implementationPhases"
                    value={formData.implementationPhases}
                    onChange={handleInputChange}
                    placeholder="Break down implementation into phases with specific activities, responsible parties, and timelines for each phase..."
                    rows="6"
                    required
                  />
                </div>
              </div>

              <div className="form-row single">
                <div className="form-group">
                  <label htmlFor="resourcesRequired">Resources Required <span className="required">*</span></label>
                  <textarea 
                    id="resourcesRequired" 
                    name="resourcesRequired"
                    value={formData.resourcesRequired}
                    onChange={handleInputChange}
                    placeholder="Detail all resources needed: Human resources (roles, number, duration), Equipment, Materials, Technology/Software, Facilities, External services, etc..."
                    rows="5"
                    required
                  />
                </div>
              </div>

              <div className="form-row single">
                <div className="form-group">
                  <label htmlFor="implementationRisks">Implementation Risks & Mitigation <span className="required">*</span></label>
                  <textarea 
                    id="implementationRisks" 
                    name="implementationRisks"
                    value={formData.implementationRisks}
                    onChange={handleInputChange}
                    placeholder="Identify potential risks during implementation and corresponding mitigation strategies..."
                    rows="5"
                    required
                  />
                </div>
              </div>

              <div className="form-row single">
                <div className="form-group">
                  <label htmlFor="monitoringPlan">Monitoring & Control Plan <span className="required">*</span></label>
                  <textarea 
                    id="monitoringPlan" 
                    name="monitoringPlan"
                    value={formData.monitoringPlan}
                    onChange={handleInputChange}
                    placeholder="Describe how implementation progress will be monitored, tracked, and reported (frequency, methods, responsibilities, KPIs)..."
                    rows="5"
                    required
                  />
                </div>
              </div>

              <div className="form-row single">
                <div className="form-group">
                  <label htmlFor="successCriteria">Success Criteria & Evaluation <span className="required">*</span></label>
                  <textarea 
                    id="successCriteria" 
                    name="successCriteria"
                    value={formData.successCriteria}
                    onChange={handleInputChange}
                    placeholder="Define clear, measurable criteria to determine if the implementation was successful..."
                    rows="4"
                    required
                  />
                </div>
              </div>

              <div className="warning-card">
                <strong>⚠️ Implementation Planning Note:</strong>
                A detailed, realistic implementation plan is critical for approval. Ensure all phases are clearly defined with specific timelines, resources, and responsible parties identified.
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="section">
              <h2 className="section-title">Additional Information</h2>
              <div className="form-row single">
                <div className="form-group">
                  <label htmlFor="attachments">Attachments/Supporting Documents</label>
                  
                  <div 
                    className={`file-upload-area ${dragActive ? 'dragover' : ''}`}
                    onClick={() => document.getElementById('fileInput').click()}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="file-upload-icon">📎</div>
                    <div className="file-upload-text">
                      Click to upload or drag and drop files here
                    </div>
                    <div className="file-upload-hint">
                      PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 10MB each)
                    </div>
                  </div>
                  
                  <input 
                    type="file" 
                    id="fileInput"
                    className="file-upload-input"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />

                  {formData.attachments.length > 0 && (
                    <div className="attachments-list">
                      {formData.attachments.map((file, index) => (
                        <div key={index} className="attachment-item">
                          <div className="attachment-info">
                            <div className="attachment-icon">📄</div>
                            <div className="attachment-details">
                              <div className="attachment-name">{file.name}</div>
                              <div className="attachment-meta">
                                {(file.size / 1024).toFixed(2)} KB
                              </div>
                            </div>
                          </div>
                          <button 
                            type="button"
                            className="btn-remove-attachment"
                            onClick={() => removeAttachment(index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="form-row single">
                <div className="form-group">
                  <label htmlFor="notes">Additional Notes</label>
                  <textarea 
                    id="notes" 
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any other relevant information..."
                  />
                </div>
              </div>
            </div>

            {impactScore.overall >= 3 && (
              <div className="critical-card">
                <strong>⚠️ High/Critical Impact Alert:</strong>
                This change request has been flagged as high or critical impact. Additional stakeholder review and senior management approval may be required.
              </div>
            )}

            {/* Action Buttons */}
            <div className="action-buttons">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={handleSaveDraft}
                disabled={isSaving || isSubmitting}
              >
                {isSaving ? 'Saving...' : 'Save as Draft'}
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={isSaving || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangeRequestForm;

