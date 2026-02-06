import React, { useState, useMemo } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  Card,
  CardContent,
  Grid,
  Alert
} from "@mui/material";
import ButtonMui from "../../../components/mui-component/ButtonMui";
import { Download, Share } from "@mui/icons-material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const MYCReport = ({ 
  contracts = [], 
  nonContractualEntries = [], 
  counterparts = [], 
  procurementEntries = [],
  projectData = {} 
}) => {
  const [selectedReportType, setSelectedReportType] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [generatedReport, setGeneratedReport] = useState(null);
  
  // State for flexible fiscal year management
  const [fiscalYearSettings, setFiscalYearSettings] = useState({
    contractual: { enabled: true, fiscalYears: [] },
    nonContractual: { enabled: true, fiscalYears: [] },
    counterpart: { enabled: true, fiscalYears: [] }
  });
  const [showFiscalYearSettings, setShowFiscalYearSettings] = useState(false);

  // Report types available
  const reportTypes = [
    { value: "contractual", label: "Contractual Report", description: "Detailed contractual information" },
    { value: "non_contractual", label: "Non-Contractual Report", description: "Non-contractual activities and funding" },
    { value: "counterpart", label: "Counterpart Report", description: "Counterpart funding details" },
    { value: "procurement", label: "Procurement Report", description: "Procurement activities and costs" },
    { value: "financial", label: "Financial Summary", description: "Complete financial overview" },
    { value: "comprehensive", label: "Comprehensive Report", description: "All data in one comprehensive report" }
  ];

  // Extract fiscal years for each tab separately
  const extractFiscalYearsByTab = useMemo(() => {
    const helper = (value) => {
      if (!value) return false;
      const numValue = Number(value.toString().replace(/,/g, ''));
      return !isNaN(numValue) && numValue > 0;
    };

    const getContractualFiscalYears = () => {
      const usedFiscalYears = new Set();
      contracts.forEach(contract => {
        if (contract.fyHeaders) {
          contract.fyHeaders.forEach(fy => usedFiscalYears.add(fy));
        }
        if (contract.pipelineExternal) {
          Object.entries(contract.pipelineExternal).forEach(([fy, value]) => {
            if (helper(value)) usedFiscalYears.add(fy);
          });
        }
        if (contract.pipelineGoU) {
          Object.entries(contract.pipelineGoU).forEach(([fy, value]) => {
            if (helper(value)) usedFiscalYears.add(fy);
          });
        }
      });
      return Array.from(usedFiscalYears).sort();
    };

    const getNonContractualFiscalYears = () => {
      const usedFiscalYears = new Set();
      nonContractualEntries.forEach(entry => {
        if (entry.fyHeaders) {
          entry.fyHeaders.forEach(fy => usedFiscalYears.add(fy));
        }
        if (entry.pipelineExternal) {
          Object.entries(entry.pipelineExternal).forEach(([fy, value]) => {
            if (helper(value)) usedFiscalYears.add(fy);
          });
        }
        if (entry.pipelineGoU) {
          Object.entries(entry.pipelineGoU).forEach(([fy, value]) => {
            if (helper(value)) usedFiscalYears.add(fy);
          });
        }
      });
      return Array.from(usedFiscalYears).sort();
    };

    const getCounterpartFiscalYears = () => {
      const usedFiscalYears = new Set();
      counterparts.forEach(counterpart => {
        if (counterpart.counterpartFyHeaders) {
          counterpart.counterpartFyHeaders.forEach(fy => usedFiscalYears.add(fy));
        }
        if (counterpart.counterpartPipelineExternal) {
          Object.entries(counterpart.counterpartPipelineExternal).forEach(([fy, value]) => {
            if (helper(value)) usedFiscalYears.add(fy);
          });
        }
        if (counterpart.counterpartPipelineGoU) {
          Object.entries(counterpart.counterpartPipelineGoU).forEach(([fy, value]) => {
            if (helper(value)) usedFiscalYears.add(fy);
          });
        }
      });
      return Array.from(usedFiscalYears).sort();
    };

    return {
      contractual: getContractualFiscalYears(),
      nonContractual: getNonContractualFiscalYears(),
      counterpart: getCounterpartFiscalYears()
    };
  }, [contracts, nonContractualEntries, counterparts, procurementEntries]);

  // Initialize fiscal year settings when data changes
  React.useEffect(() => {
    setFiscalYearSettings(prev => ({
      contractual: { ...prev.contractual, fiscalYears: extractFiscalYearsByTab.contractual },
      nonContractual: { ...prev.nonContractual, fiscalYears: extractFiscalYearsByTab.nonContractual },
      counterpart: { ...prev.counterpart, fiscalYears: extractFiscalYearsByTab.counterpart }
    }));
  }, [extractFiscalYearsByTab]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalContracts = contracts.length;
    const totalNonContractual = nonContractualEntries.length;
    const totalCounterparts = counterparts.length;
    const totalProcurement = procurementEntries.length;

    // Calculate total contract values
    const totalContractValue = contracts.reduce((sum, contract) => {
      const external = Number(contract.contract_value_external || 0);
      const gou = Number(contract.contract_value_gou || 0);
      return sum + external + gou;
    }, 0);

    // Calculate total counterpart values
    const totalCounterpartValue = counterparts.reduce((sum, counterpart) => {
      return sum + Number(counterpart.counterpartValue || 0);
    }, 0);

    // Calculate total non-contractual values
    const totalNonContractualValue = nonContractualEntries.reduce((sum, entry) => {
      const external = Number(entry.goUAmount || 0);
      const gou = Number(entry.externalAmount || 0);
      return sum + external + gou;
    }, 0);

    // Calculate total procurement values
    const totalProcurementValue = procurementEntries.reduce((sum, entry) => {
      return sum + Number(entry.data?.contractValue || 0);
    }, 0);

    return {
      totalContracts,
      totalNonContractual,
      totalCounterparts,
      totalProcurement,
      totalContractValue,
      totalNonContractualValue,
      totalCounterpartValue,
      totalProcurementValue,
      totalProjectValue: totalContractValue + totalNonContractualValue + totalCounterpartValue + totalProcurementValue
    };
  }, [contracts, nonContractualEntries, counterparts, procurementEntries]);

  // Check if all required data is available
  const dataAvailability = useMemo(() => {
    return {
      contracts: contracts.length > 0,
      nonContractual: nonContractualEntries.length > 0,
      counterparts: counterparts.length > 0,
      procurement: procurementEntries.length > 0,
      projectData: !!projectData.code
    };
  }, [contracts, nonContractualEntries, counterparts, procurementEntries, projectData]);

  const handleGenerateReport = () => {
    if (!selectedReportType) {
      alert("Please select a report type");
      return;
    }

    // Debug: Log project data structure
    console.log("Project Data:", projectData);

    // Generate report data based on selected type
    const reportData = generateReportData(selectedReportType);
    setGeneratedReport({
      type: selectedReportType,
      format: selectedFormat,
      data: reportData,
      generatedAt: new Date().toISOString(),
      projectCode: projectData.code || "N/A",
      projectName: projectData.title || "N/A"
    });
  };

  const generateReportData = (reportType) => {
    switch (reportType) {
      case "contractual":
        // Get fiscal years that were actually used in contracts
        const getContractualFiscalYears = () => {
          const usedFiscalYears = new Set();
          
          // Helper function to check if a value is meaningful (not zero, empty, or "0")
          const hasMeaningfulValue = (value) => {
            if (!value) return false;
            const numValue = Number(value.toString().replace(/,/g, ''));
            return !isNaN(numValue) && numValue > 0;
          };
          
          // Get fiscal years from contracts
          contracts.forEach(contract => {
            if (contract.fyHeaders) {
              contract.fyHeaders.forEach(fy => usedFiscalYears.add(fy));
            }
            if (contract.pipelineExternal) {
              Object.entries(contract.pipelineExternal).forEach(([fy, value]) => {
                if (hasMeaningfulValue(value)) {
                  usedFiscalYears.add(fy);
                }
              });
            }
            if (contract.pipelineGoU) {
              Object.entries(contract.pipelineGoU).forEach(([fy, value]) => {
                if (hasMeaningfulValue(value)) {
                  usedFiscalYears.add(fy);
                }
              });
            }
          });
          
          return Array.from(usedFiscalYears).sort();
        };
        
        const contractualFiscalYears = getContractualFiscalYears();
        
        return {
          projectInfo: projectData,
          contracts: contracts.map(contract => ({
            projectCode: projectData.code || 'N/A',
            reference: contract.contract_reference_number,
            name: contract.contract_name,
            contractor: contract.contractor_name,
            startDate: contract.contract_start_date,
            endDate: contract.contract_end_date,
            valueExternal: contract.contract_value_external,
            valueGoU: contract.contract_value_gou,
            totalValue: (Number(contract.contract_value_external || 0) + Number(contract.contract_value_gou || 0)),
            approvedPayments: contract.approved_payments || 0,
            balance: (Number(contract.contract_value_external || 0) + Number(contract.contract_value_gou || 0)) - (Number(contract.approved_payments || 0)),
            status: contract.contract_status,
            pipelineGoU: contract.pipelineGoU || {},
            pipelineExternal: contract.pipelineExternal || {},
            fyHeaders: contract.fyHeaders || []
          })),
          fiscalYears: contractualFiscalYears
        };
      
      case "non_contractual":
        // Get fiscal years that were actually used in non-contractual entries
        const getNonContractualFiscalYears = () => {
          const usedFiscalYears = new Set();
          
          // Helper function to check if a value is meaningful (not zero, empty, or "0")
          const hasMeaningfulValue = (value) => {
            if (!value) return false;
            const numValue = Number(value.toString().replace(/,/g, ''));
            return !isNaN(numValue) && numValue > 0;
          };
          
          // Get fiscal years from non-contractual entries
          nonContractualEntries.forEach(entry => {
            if (entry.fyHeaders) {
              entry.fyHeaders.forEach(fy => usedFiscalYears.add(fy));
            }
            if (entry.pipelineExternal) {
              Object.entries(entry.pipelineExternal).forEach(([fy, value]) => {
                if (hasMeaningfulValue(value)) {
                  usedFiscalYears.add(fy);
                }
              });
            }
            if (entry.pipelineGoU) {
              Object.entries(entry.pipelineGoU).forEach(([fy, value]) => {
                if (hasMeaningfulValue(value)) {
                  usedFiscalYears.add(fy);
                }
              });
            }
          });
          
          return Array.from(usedFiscalYears).sort();
        };
        
        const nonContractualFiscalYears = getNonContractualFiscalYears();
        
        return {
          projectInfo: projectData,
          entries: nonContractualEntries.map(entry => ({
            voteCode: (() => {
              // Try to get from contracts first
              const contractVoteCode = contracts.find(contract => 
                contract.vote_code && contract.vote_code.trim() !== ''
              )?.vote_code;
              if (contractVoteCode) return contractVoteCode;
              
              // Try to get from non-contractual entries
              const nonContractualVoteCode = nonContractualEntries.find(entry => 
                entry.voteCode && entry.voteCode.trim() !== ''
              )?.voteCode;
              if (nonContractualVoteCode) return nonContractualVoteCode;
              
              // Try to get from counterparts
              const counterpartVoteCode = counterparts.find(counterpart => 
                counterpart.voteCode && counterpart.voteCode.trim() !== ''
              )?.voteCode;
              if (counterpartVoteCode) return counterpartVoteCode;
              
              // Fallback to project data
              return projectData.voteCode || 'N/A';
            })(),
            projectCode: projectData.code || 'N/A',
            itemCode: entry.itemCode || 'N/A',
            description: entry.description || 'N/A',
            startDate: entry.startDate || 'N/A',
            endDate: entry.endDate || 'N/A',
            goUAmount: entry.goUAmount || 0,
            externalAmount: entry.externalAmount || 0,
            totalAmount: (Number(entry.goUAmount || 0) + Number(entry.externalAmount || 0)),
            pipelineGoU: entry.pipelineGoU || {},
            pipelineExternal: entry.pipelineExternal || {},
            fyHeaders: entry.fyHeaders || []
          })),
          fiscalYears: nonContractualFiscalYears
        };
      
      case "counterpart":
        // Get fiscal years that were actually used in counterpart entries
        const getCounterpartFiscalYears = () => {
          const usedFiscalYears = new Set();
          
          // Helper function to check if a value is meaningful (not zero, empty, or "0")
          const hasMeaningfulValue = (value) => {
            if (!value) return false;
            const numValue = Number(value.toString().replace(/,/g, ''));
            return !isNaN(numValue) && numValue > 0;
          };
          
          // Get fiscal years from counterpart entries
          counterparts.forEach(counterpart => {
            if (counterpart.counterpartFyHeaders) {
              counterpart.counterpartFyHeaders.forEach(fy => usedFiscalYears.add(fy));
            }
            if (counterpart.counterpartPipelineExternal) {
              Object.entries(counterpart.counterpartPipelineExternal).forEach(([fy, value]) => {
                if (hasMeaningfulValue(value)) {
                  usedFiscalYears.add(fy);
                }
              });
            }
            if (counterpart.counterpartPipelineGoU) {
              Object.entries(counterpart.counterpartPipelineGoU).forEach(([fy, value]) => {
                if (hasMeaningfulValue(value)) {
                  usedFiscalYears.add(fy);
                }
              });
            }
          });
          
          return Array.from(usedFiscalYears).sort();
        };
        
        const counterpartFiscalYears = getCounterpartFiscalYears();
        
        return {
          projectInfo: projectData,
          counterparts: counterparts.map(counterpart => ({
            projectCode: projectData.code || 'N/A',
            financingTitle: counterpart.counterpartFinancingTitle || 'N/A',
            requirementSpec: counterpart.counterpartRequirementSpec || 'N/A',
            startDate: counterpart.counterpartStartDate || 'N/A',
            endDate: counterpart.counterpartEndDate || 'N/A',
            counterpartValue: counterpart.counterpartValue || 0,
            counterpartDisbursed: counterpart.counterpartDisbursed || 0,
            balance: (Number(counterpart.counterpartValue || 0) - Number(counterpart.counterpartDisbursed || 0)),
            pipelineGoU: counterpart.counterpartPipelineGoU || {},
            pipelineExternal: counterpart.counterpartPipelineExternal || {},
            fyHeaders: counterpart.counterpartFyHeaders || []
          })),
          fiscalYears: counterpartFiscalYears
        };
      
      case "procurement":
        // Get fiscal years that were actually used in procurement entries
        const getProcurementFiscalYears = () => {
          const usedFiscalYears = new Set();
          
          // Helper function to check if a value is meaningful (not zero, empty, or "0")
          const hasMeaningfulValue = (value) => {
            if (!value) return false;
            const numValue = Number(value.toString().replace(/,/g, ''));
            return !isNaN(numValue) && numValue > 0;
          };
          
          // Get fiscal years from procurement entries
          procurementEntries.forEach(procurement => {
            // Check if procurement has pipeline data
            if (procurement.pipeline) {
              Object.entries(procurement.pipeline).forEach(([fy, value]) => {
                if (hasMeaningfulValue(value)) {
                  usedFiscalYears.add(fy);
                }
              });
            }
          });
          
          return Array.from(usedFiscalYears).sort();
        };
        
        const procurementFiscalYears = getProcurementFiscalYears();
        
        return {
          projectInfo: projectData,
          procurements: procurementEntries.map(entry => ({
            voteCode: (() => {
              // Try to get from contracts first
              const contractVoteCode = contracts.find(contract => 
                contract.vote_code && contract.vote_code.trim() !== ''
              )?.vote_code;
              if (contractVoteCode) return contractVoteCode;
              
              // Try to get from non-contractual entries
              const nonContractualVoteCode = nonContractualEntries.find(entry => 
                entry.voteCode && entry.voteCode.trim() !== ''
              )?.voteCode;
              if (nonContractualVoteCode) return nonContractualVoteCode;
              
              // Try to get from counterparts
              const counterpartVoteCode = counterparts.find(counterpart => 
                counterpart.voteCode && counterpart.voteCode.trim() !== ''
              )?.voteCode;
              if (counterpartVoteCode) return counterpartVoteCode;
              
              // Fallback to project data
              return projectData.voteCode || 'N/A';
            })(),
            projectCode: projectData.code || 'N/A',
            procurementRefNo: entry.data.procurementRef || 'N/A',
            projectName: projectData.title || 'N/A',
            description: entry.data.description || 'N/A',
            estimatedContractValue: entry.data.contractValue || 0,
            sourceOfFinancing: entry.data.sourceOfFinancing || 'N/A',
            commencementDate: entry.data.commencementDate || 'N/A',
            endDate: entry.data.endDate || 'N/A',
            pipelineGoU: (() => {
              // Distribute pipeline values based on source of financing
              const pipeline = entry.pipeline || {};
              const sourceOfFinancing = entry.data.sourceOfFinancing;
              const pipelineGoU = {};
              
              Object.entries(pipeline).forEach(([fy, value]) => {
                if (sourceOfFinancing === 'Government of Uganda') {
                  pipelineGoU[fy] = value || 0;
                } else {
                  pipelineGoU[fy] = 0;
                }
              });
              
              return pipelineGoU;
            })(),
            pipelineExternal: (() => {
              // Distribute pipeline values based on source of financing
              const pipeline = entry.pipeline || {};
              const sourceOfFinancing = entry.data.sourceOfFinancing;
              const pipelineExternal = {};
              
              Object.entries(pipeline).forEach(([fy, value]) => {
                if (sourceOfFinancing === 'External Financing') {
                  pipelineExternal[fy] = value || 0;
                } else {
                  pipelineExternal[fy] = 0;
                }
              });
              
              return pipelineExternal;
            })(),
            fyHeaders: Object.keys(entry.pipeline || {})
          })),
          fiscalYears: procurementFiscalYears
        };
      
      case "financial":
        return {
          projectInfo: projectData,
          financialSummary: {
            totalContractValue: summaryStats.totalContractValue,
            totalNonContractualValue: summaryStats.totalNonContractualValue,
            totalCounterpartValue: summaryStats.totalCounterpartValue,
            totalProcurementValue: summaryStats.totalProcurementValue,
            totalProjectValue: summaryStats.totalProjectValue
          },
          breakdown: {
            contracts: contracts.length,
            nonContractual: nonContractualEntries.length,
            counterparts: counterparts.length,
            procurements: procurementEntries.length
          }
        };
      
      case "comprehensive":
        // Get fiscal years that were actually used in previous tabs
        // Get all unique fiscal years from enabled tabs
        const getAllUsedFiscalYears = () => {
          const usedFiscalYears = new Set();
          
          // Helper function to check if a value is meaningful (not zero, empty, or "0")
          const hasMeaningfulValue = (value) => {
            if (!value) return false;
            const numValue = Number(value.toString().replace(/,/g, ''));
            return !isNaN(numValue) && numValue > 0;
          };
          
          // Get fiscal years from enabled tabs only
          if (fiscalYearSettings.contractual.enabled) {
            fiscalYearSettings.contractual.fiscalYears.forEach(fy => usedFiscalYears.add(fy));
          }
          
          if (fiscalYearSettings.nonContractual.enabled) {
            fiscalYearSettings.nonContractual.fiscalYears.forEach(fy => usedFiscalYears.add(fy));
          }
          
          if (fiscalYearSettings.counterpart.enabled) {
            fiscalYearSettings.counterpart.fiscalYears.forEach(fy => usedFiscalYears.add(fy));
          }
          
          // Convert to array and sort
          return Array.from(usedFiscalYears).sort();
        };
        
        const fiscalYears = getAllUsedFiscalYears();

        // Debug: Log available data
        console.log("Contracts:", contracts);
        console.log("Non-contractual entries:", nonContractualEntries);
        console.log("Project data:", projectData);
        console.log("Extracted fiscal years:", fiscalYears);
        
        // Debug: Check vote code sources
        console.log("Contract vote codes:", contracts.map(c => c.vote_code));
        console.log("Non-contractual vote codes:", nonContractualEntries.map(e => e.voteCode));
        console.log("Counterpart vote codes:", counterparts.map(c => c.voteCode));
        console.log("Project vote code:", projectData.voteCode);
        
        // Debug: Show fiscal year filtering details
        console.log("=== FISCAL YEAR FILTERING DEBUG ===");
        contracts.forEach((contract, index) => {
          console.log(`Contract ${index}:`, {
            fyHeaders: contract.fyHeaders,
            pipelineExternal: contract.pipelineExternal,
            pipelineGoU: contract.pipelineGoU
          });
        });
        nonContractualEntries.forEach((entry, index) => {
          console.log(`Non-contractual ${index}:`, {
            fyHeaders: entry.fyHeaders,
            pipelineExternal: entry.pipelineExternal,
            pipelineGoU: entry.pipelineGoU
          });
        });

        // Calculate comprehensive data
        const comprehensiveData = {
          // Basic project information
          programmeCode: projectData.programmeCode || projectData.code || 'N/A',
          programmeName: (() => {
            // Try to get from contracts first
            const contractProgrammeName = contracts.find(contract => contract.programme_name && contract.programme_name.trim() !== '')?.programme_name;
            if (contractProgrammeName) return contractProgrammeName;
            
            // Try to get from non-contractual entries
            const nonContractualProgrammeName = nonContractualEntries.find(entry => entry.programmeName && entry.programmeName.trim() !== '')?.programmeName;
            if (nonContractualProgrammeName) return nonContractualProgrammeName;
            
            // Try to get from counterparts
            const counterpartProgrammeName = counterparts.find(counterpart => counterpart.programmeName && counterpart.programmeName.trim() !== '')?.programmeName;
            if (counterpartProgrammeName) return counterpartProgrammeName;
            
            // Fallback
            return 'N/A';
          })(),
          
          // Get Vote Code from multiple sources
          voteCode: (() => {
            console.log("=== VOTE CODE EXTRACTION DEBUG ===");
            
            // Try to get from contracts first
            console.log("Checking contracts for vote_code...");
            const contractVoteCode = contracts.find(contract => {
              console.log("Contract:", contract);
              console.log("Contract vote_code:", contract.vote_code);
              return contract.vote_code && contract.vote_code.trim() !== '';
            })?.vote_code;
            console.log("Found contract vote code:", contractVoteCode);
            if (contractVoteCode) return contractVoteCode;
            
            // Try to get from non-contractual entries
            console.log("Checking non-contractual entries for voteCode...");
            const nonContractualVoteCode = nonContractualEntries.find(entry => {
              console.log("Non-contractual entry:", entry);
              console.log("Entry voteCode:", entry.voteCode);
              return entry.voteCode && entry.voteCode.trim() !== '';
            })?.voteCode;
            console.log("Found non-contractual vote code:", nonContractualVoteCode);
            if (nonContractualVoteCode) return nonContractualVoteCode;
            
            // Try to get from counterparts
            console.log("Checking counterparts for voteCode...");
            const counterpartVoteCode = counterparts.find(counterpart => {
              console.log("Counterpart:", counterpart);
              console.log("Counterpart voteCode:", counterpart.voteCode);
              return counterpart.voteCode && counterpart.voteCode.trim() !== '';
            })?.voteCode;
            console.log("Found counterpart vote code:", counterpartVoteCode);
            if (counterpartVoteCode) return counterpartVoteCode;
            
            // Fallback to project data
            console.log("Checking project data for voteCode...");
            console.log("Project voteCode:", projectData.voteCode);
            const projectVoteCode = projectData.voteCode || 'N/A';
            console.log("Final vote code:", projectVoteCode);
            return projectVoteCode;
          })(),
          voteName: (() => {
            // Try to get from contracts first
            const contractVoteName = contracts.find(contract => contract.vote_name && contract.vote_name.trim() !== '')?.vote_name;
            if (contractVoteName) return contractVoteName;
            
            // Try to get from non-contractual entries
            const nonContractualVoteName = nonContractualEntries.find(entry => entry.voteName && entry.voteName.trim() !== '')?.voteName;
            if (nonContractualVoteName) return nonContractualVoteName;
            
            // Try to get from counterparts
            const counterpartVoteName = counterparts.find(counterpart => counterpart.voteName && counterpart.voteName.trim() !== '')?.voteName;
            if (counterpartVoteName) return counterpartVoteName;
            
            // Fallback
            return 'N/A';
          })(),
          
          projectCode: projectData.code || 'N/A',
          projectName: projectData.title || 'N/A',
          projectClassification: (() => {
            // Try to get from contracts first (contractualProjectClassification)
            const contractClassification = contracts.find(contract => contract.contractualProjectClassification && contract.contractualProjectClassification.trim() !== '')?.contractualProjectClassification;
            if (contractClassification) return contractClassification;
            
            // Try to get from counterparts (counterpartProjectClassification)
            const counterpartClassification = counterparts.find(counterpart => counterpart.counterpartProjectClassification && counterpart.counterpartProjectClassification.trim() !== '')?.counterpartProjectClassification;
            if (counterpartClassification) return counterpartClassification;
            
            // Fallback
            return 'N/A';
          })(),
          
          // Get project dates from Project Period (hardcoded dates from contractual tab)
          projectStartDate: '01/07/2023',
          
          projectEndDate: '30/06/2027',
          
          projectValue: summaryStats.totalProjectValue || 0,
          sourceOfFunding: 'Mixed', // This could be derived from contracts data
          
          // Arrears information (from contracts) - include both External and GoU arrears
          cumulativeArrears: contracts.reduce((sum, contract) => {
            const externalArrears = Number(contract.arrears) || 0;
            const gouArrears = Number(contract.arrears_gou) || 0;
            return sum + externalArrears + gouArrears;
          }, 0),
          verifiedArrears: contracts.reduce((sum, contract) => {
            const externalVerified = Number(contract.verified_arrears) || 0;
            const gouVerified = Number(contract.verified_arrears_gou) || 0;
            return sum + externalVerified + gouVerified;
          }, 0),
          
          // Commitments by fiscal year - separated by funding source
          contractualCommitmentsGoU: {},
          contractualCommitmentsExternal: {},
          nonContractualCommitmentsGoU: {},
          nonContractualCommitmentsExternal: {},
          counterpartCommitmentsGoU: {},
          counterpartCommitmentsExternal: {},
          totalCommitmentsGoU: {},
          totalCommitmentsExternal: {},
          
          // Fiscal years for sub-columns
          fiscalYears: fiscalYears
        };

        // Calculate commitments by fiscal year - separated by funding source
        // Debug: Log counterpart data
        console.log('Counterparts data:', counterparts);
        counterparts.forEach((counterpart, index) => {
          console.log(`Counterpart ${index}:`, {
            title: counterpart.counterpartFinancingTitle,
            pipelineGoU: counterpart.counterpartPipelineGoU,
            pipelineExternal: counterpart.counterpartPipelineExternal,
            fyHeaders: counterpart.counterpartFyHeaders
          });
        });

        fiscalYears.forEach(fy => {
          // Contractual commitments - separated by funding source
          const contractualGoU = contracts.reduce((sum, contract) => {
            return sum + (Number(contract.pipelineGoU?.[fy]) || 0);
          }, 0);
          
          const contractualExternal = contracts.reduce((sum, contract) => {
            return sum + (Number(contract.pipelineExternal?.[fy]) || 0);
          }, 0);
          
          // Add procurement values to contractual commitments based on source of funding
          const procurementGoU = procurementEntries.reduce((sum, procurement) => {
            // Check if source of funding is "Government of Uganda" (GoU)
            if (procurement.data?.sourceOfFinancing === "Government of Uganda") {
              return sum + (Number(procurement.pipeline?.[fy]) || 0);
            }
            return sum;
          }, 0);
          
          const procurementExternal = procurementEntries.reduce((sum, procurement) => {
            // Check if source of funding is "External Financing" (External)
            if (procurement.data?.sourceOfFinancing === "External Financing") {
              return sum + (Number(procurement.pipeline?.[fy]) || 0);
            }
            return sum;
          }, 0);
          
          // Combine contractual and procurement values
          const totalContractualGoU = contractualGoU + procurementGoU;
          const totalContractualExternal = contractualExternal + procurementExternal;
          
          // Non-contractual commitments - separated by funding source
          const nonContractualGoU = nonContractualEntries.reduce((sum, entry) => {
            return sum + (Number(entry.pipelineGoU?.[fy]) || 0);
          }, 0);
          
          const nonContractualExternal = nonContractualEntries.reduce((sum, entry) => {
            return sum + (Number(entry.pipelineExternal?.[fy]) || 0);
          }, 0);
          
          // Counterpart commitments - separated by funding source
          const counterpartGoU = counterparts.reduce((sum, counterpart) => {
            const value = Number(counterpart.counterpartPipelineGoU?.[fy]) || 0;
            console.log(`Counterpart GoU for ${fy}:`, counterpart.counterpartFinancingTitle, value, counterpart.counterpartPipelineGoU);
            return sum + value;
          }, 0);
          
          const counterpartExternal = counterparts.reduce((sum, counterpart) => {
            const value = Number(counterpart.counterpartPipelineExternal?.[fy]) || 0;
            console.log(`Counterpart External for ${fy}:`, counterpart.counterpartFinancingTitle, value, counterpart.counterpartPipelineExternal);
            return sum + value;
          }, 0);
          
          // Total commitments by funding source
          const totalGoU = totalContractualGoU + nonContractualGoU + counterpartGoU;
          const totalExternal = totalContractualExternal + nonContractualExternal + counterpartExternal;
          
          // Store separated values
          comprehensiveData.contractualCommitmentsGoU[fy] = totalContractualGoU;
          comprehensiveData.contractualCommitmentsExternal[fy] = totalContractualExternal;
          comprehensiveData.nonContractualCommitmentsGoU[fy] = nonContractualGoU;
          comprehensiveData.nonContractualCommitmentsExternal[fy] = nonContractualExternal;
          comprehensiveData.counterpartCommitmentsGoU[fy] = counterpartGoU;
          comprehensiveData.counterpartCommitmentsExternal[fy] = counterpartExternal;
          comprehensiveData.totalCommitmentsGoU[fy] = totalGoU;
          comprehensiveData.totalCommitmentsExternal[fy] = totalExternal;
        });

        return {
          projectInfo: projectData,
          summary: summaryStats,
          comprehensive: comprehensiveData,
          contracts: contracts,
          nonContractualEntries: nonContractualEntries,
          counterparts: counterparts,
          procurementEntries: procurementEntries,
          dataAvailability
        };
      
      default:
        return {};
    }
  };

  const handleDownload = async () => {
    if (!generatedReport) return;
    
    const reportData = generatedReport.data;
    const reportType = generatedReport.type;
    const format = generatedReport.format;
    const timestamp = new Date().toISOString().split('T')[0];
    
    switch (format) {
      case "pdf":
        downloadPDF(reportData, reportType, timestamp);
        break;
      case "excel":
        downloadExcel(reportData, reportType, timestamp);
        break;
      default:
        downloadPDF(reportData, reportType, timestamp);
    }
  };

  const downloadPDF = (data, reportType, timestamp) => {
    const doc = new jsPDF('landscape'); // Use landscape orientation for better table display
    const reportTitle = reportTypes.find(t => t.value === reportType)?.label || "MYC Report";
    
    // Add title
    doc.setFontSize(16);
    doc.text(reportTitle, 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated On: ${timestamp}`, 14, 30);
    
    let yPosition = 38;
    
    if (reportType === "contractual") {
      // Contractual report with fiscal year columns
      const fiscalYears = data.fiscalYears || [];
      
      // Create hierarchical headers for PDF grouped by fiscal year
      const contractualHeaders = [
        // First row: Parent headers
        [
          "Project Code", "Contract Reference Number", "Contract Name", "Contractor",
          "Contract Value", "Approved Payments", "Balance on Contract Value",
          ...fiscalYears.flatMap((fy, index) => [
            ...(index > 0 ? ["", ""] : []), // Add separator columns
            fy, fy
          ])
        ],
        // Second row: Sub-column headers
        [
          "", "", "", "", "", "", "",
          ...fiscalYears.flatMap((fy, index) => [
            ...(index > 0 ? ["", ""] : []), // Add separator columns
            "GoU", "External"
          ])
        ]
      ];
      
      // Create contract data with fiscal year values
      const contractData = data.contracts?.map(contract => [
        contract.projectCode || 'N/A',
        contract.reference || 'N/A',
        contract.name || 'N/A',
        contract.contractor || 'N/A',
        formatNumber(contract.totalValue || 0),
        formatNumber(contract.approvedPayments || 0),
        formatNumber(contract.balance || 0),
        ...fiscalYears.flatMap((fy, index) => {
          const gouValue = contract.pipelineGoU?.[fy] || 0;
          const externalValue = contract.pipelineExternal?.[fy] || 0;
          return [
            ...(index > 0 ? ["", ""] : []), // Add separator columns
            formatNumber(gouValue), formatNumber(externalValue)
          ];
        })
      ]) || [];
      
      doc.autoTable({
        startY: yPosition,
        head: contractualHeaders,
        body: contractData,
        theme: 'grid',
        headStyles: { fillColor: [63, 81, 181] },
        styles: { fontSize: 8 },
        pageBreak: 'auto',
        margin: { top: 20, right: 10, bottom: 20, left: 10 },
        columnStyles: (() => {
          const styles = {
            0: { cellWidth: 20 }, // Project Code
            1: { cellWidth: 25 }, // Contract Reference Number
            2: { cellWidth: 30 }, // Contract Name
            3: { cellWidth: 25 }, // Contractor
            4: { cellWidth: 20 }, // Contract Value
            5: { cellWidth: 20 }, // Approved Payments
            6: { cellWidth: 25 } // Balance on Contract Value
          };
          
          // Add column styles for fiscal year columns
          const fiscalYears = data.fiscalYears || [];
          let colIndex = 7; // Start after the basic columns
          
          fiscalYears.forEach((fy, fyIndex) => {
            if (fyIndex > 0) {
              // Add separator columns
              styles[colIndex] = { cellWidth: 5 };
              colIndex++;
              styles[colIndex] = { cellWidth: 5 };
              colIndex++;
            }
            // GoU column
            styles[colIndex] = { cellWidth: 25 };
            colIndex++;
            // External column
            styles[colIndex] = { cellWidth: 25 };
            colIndex++;
          });
          
          return styles;
        })()
      });
    } else if (reportType === "financial") {
      // Financial report
      const financialData = [
        ["Financial Component", "Amount (UGX)"],
        ["Contract Amounts", formatCurrency(data.financialSummary?.totalContractValue || 0)],
        ["Non-Contractual Amounts", formatCurrency(data.financialSummary?.totalNonContractualValue || 0)],
        ["Counterpart Amounts", formatCurrency(data.financialSummary?.totalCounterpartValue || 0)],
        ["Procurement Amounts", formatCurrency(data.financialSummary?.totalProcurementValue || 0)],
        ["Total Project Amount", formatCurrency(data.financialSummary?.totalProjectValue || 0)]
      ];
      
      doc.autoTable({
        startY: yPosition,
        head: [financialData[0]],
        body: financialData.slice(1),
        theme: 'grid',
        headStyles: { fillColor: [63, 81, 181] },
        styles: { fontSize: 10 },
        pageBreak: 'auto',
        margin: { top: 20, right: 10, bottom: 20, left: 10 }
      });
    } else if (reportType === "non_contractual") {
      // Non-contractual report with fiscal year columns
      const fiscalYears = data.fiscalYears || [];
      
      // Create hierarchical headers for PDF grouped by fiscal year
      const nonContractualHeaders = [
        // First row: Parent headers
        [
          "Vote Code", "Project Code", "Item Code", "Description of Activity",
          "Start Date", "End Date", "Total Amount",
          ...fiscalYears.flatMap((fy, index) => [
            ...(index > 0 ? ["", ""] : []), // Add separator columns
            fy, fy
          ])
        ],
        // Second row: Sub-column headers
        [
          "", "", "", "", "", "", "",
          ...fiscalYears.flatMap((fy, index) => [
            ...(index > 0 ? ["", ""] : []), // Add separator columns
            "GoU", "External"
          ])
        ]
      ];
      
      // Create non-contractual data with fiscal year values
      const nonContractualData = data.entries?.map(entry => [
        entry.voteCode || 'N/A',
        entry.projectCode || 'N/A',
        entry.itemCode || 'N/A',
        entry.description || 'N/A',
        entry.startDate || 'N/A',
        entry.endDate || 'N/A',
        formatNumber(entry.totalAmount || 0),
        ...fiscalYears.flatMap((fy, index) => {
          const gouValue = entry.pipelineGoU?.[fy] || 0;
          const externalValue = entry.pipelineExternal?.[fy] || 0;
          return [
            ...(index > 0 ? ["", ""] : []), // Add separator columns
            formatNumber(gouValue), formatNumber(externalValue)
          ];
        })
      ]) || [];
      
      doc.autoTable({
        startY: yPosition,
        head: nonContractualHeaders,
        body: nonContractualData,
        theme: 'grid',
        headStyles: { fillColor: [63, 81, 181] },
        styles: { fontSize: 8 },
        pageBreak: 'auto',
        margin: { top: 20, right: 10, bottom: 20, left: 10 },
        columnStyles: (() => {
          const styles = {
            0: { cellWidth: 20 }, // Vote Code
            1: { cellWidth: 20 }, // Project Code
            2: { cellWidth: 20 }, // Item Code
            3: { cellWidth: 30 }, // Description of Activity
            4: { cellWidth: 18 }, // Start Date
            5: { cellWidth: 18 }, // End Date
            6: { cellWidth: 20 } // Total Amount
          };
          
          // Add column styles for fiscal year columns
          const fiscalYears = data.fiscalYears || [];
          let colIndex = 7; // Start after the basic columns
          
          fiscalYears.forEach((fy, fyIndex) => {
            if (fyIndex > 0) {
              // Add separator columns
              styles[colIndex] = { cellWidth: 5 };
              colIndex++;
              styles[colIndex] = { cellWidth: 5 };
              colIndex++;
            }
            // GoU column
            styles[colIndex] = { cellWidth: 25 };
            colIndex++;
            // External column
            styles[colIndex] = { cellWidth: 25 };
            colIndex++;
          });
          
          return styles;
        })()
      });
    } else if (reportType === "counterpart") {
      // Counterpart report with fiscal year columns
      const fiscalYears = data.fiscalYears || [];
      
      // Create hierarchical headers for PDF grouped by fiscal year
      const counterpartHeaders = [
        // First row: Parent headers
        [
          "Project Code", "Financing Agreement Title", "Counterpart Disbursed", "Balance on Counterpart",
          "Start Date", "End Date",
          ...fiscalYears.flatMap((fy, index) => [
            ...(index > 0 ? ["", ""] : []), // Add separator columns
            fy, fy
          ])
        ],
        // Second row: Sub-column headers
        [
          "", "", "", "", "", "",
          ...fiscalYears.flatMap((fy, index) => [
            ...(index > 0 ? ["", ""] : []), // Add separator columns
            "GoU", "External"
          ])
        ]
      ];
      
      // Create counterpart data with fiscal year values
      const counterpartData = data.counterparts?.map(counterpart => [
        counterpart.projectCode || 'N/A',
        counterpart.financingTitle || 'N/A',
        formatNumber(counterpart.counterpartDisbursed || 0),
        formatNumber(counterpart.balance || 0),
        counterpart.startDate || 'N/A',
        counterpart.endDate || 'N/A',
        ...fiscalYears.flatMap((fy, index) => {
          const gouValue = counterpart.pipelineGoU?.[fy] || 0;
          const externalValue = counterpart.pipelineExternal?.[fy] || 0;
          return [
            ...(index > 0 ? ["", ""] : []), // Add separator columns
            formatNumber(gouValue), formatNumber(externalValue)
          ];
        })
      ]) || [];
      
      doc.autoTable({
        startY: yPosition,
        head: counterpartHeaders,
        body: counterpartData,
        theme: 'grid',
        headStyles: { fillColor: [63, 81, 181] },
        styles: { fontSize: 8 },
        pageBreak: 'auto',
        margin: { top: 20, right: 10, bottom: 20, left: 10 },
        columnStyles: (() => {
          const styles = {
            0: { cellWidth: 20 }, // Project Code
            1: { cellWidth: 30 }, // Financing Agreement Title
            2: { cellWidth: 25 }, // Counterpart Disbursed
            3: { cellWidth: 25 }, // Balance on Counterpart
            4: { cellWidth: 18 }, // Start Date
            5: { cellWidth: 18 } // End Date
          };
          
          // Add column styles for fiscal year columns
          const fiscalYears = data.fiscalYears || [];
          let colIndex = 6; // Start after the basic columns
          
          fiscalYears.forEach((fy, fyIndex) => {
            if (fyIndex > 0) {
              // Add separator columns
              styles[colIndex] = { cellWidth: 5 };
              colIndex++;
              styles[colIndex] = { cellWidth: 5 };
              colIndex++;
            }
            // GoU column
            styles[colIndex] = { cellWidth: 25 };
            colIndex++;
            // External column
            styles[colIndex] = { cellWidth: 25 };
            colIndex++;
          });
          
          return styles;
        })()
      });
    } else if (reportType === "procurement") {
      // Procurement report with fiscal year columns
      const fiscalYears = data.fiscalYears || [];
      
      // Create hierarchical headers for PDF grouped by fiscal year
      const procurementHeaders = [
        // First row: Parent headers
        [
          "Vote Code", "Project Code", "Procurement Ref. No.", "Project Name", "Description of Procurement",
          "Estimated Contract Value", "Start Date", "End Date", "Source of Funding", "Source of Funding",
          ...fiscalYears.flatMap((fy, index) => [
            ...(index > 0 ? ["", ""] : []), // Add separator columns
            fy, fy
          ])
        ],
        // Second row: Sub-column headers
        [
          "", "", "", "", "", "", "", "", "GoU", "External",
          ...fiscalYears.flatMap((fy, index) => [
            ...(index > 0 ? ["", ""] : []), // Add separator columns
            "Government of Uganda", "External Financing"
          ])
        ]
      ];
      
      // Create procurement data with fiscal year values
      const procurementData = data.procurements?.map(procurement => [
        procurement.voteCode || 'N/A',
        procurement.projectCode || 'N/A',
        procurement.procurementRefNo || 'N/A',
        procurement.projectName || 'N/A',
        procurement.description || 'N/A',
        formatNumber(procurement.estimatedContractValue || 0),
        procurement.commencementDate || 'N/A',
        procurement.endDate || 'N/A',
        formatNumber(procurement.sourceOfFinancing === 'Government of Uganda' ? procurement.estimatedContractValue : 0),
        formatNumber(procurement.sourceOfFinancing === 'External Financing' ? procurement.estimatedContractValue : 0),
        ...fiscalYears.flatMap((fy, index) => {
          const gouValue = procurement.pipelineGoU?.[fy] || 0;
          const externalValue = procurement.pipelineExternal?.[fy] || 0;
          return [
            ...(index > 0 ? ["", ""] : []), // Add separator columns
            formatNumber(gouValue), formatNumber(externalValue)
          ];
        })
      ]) || [];
      
      doc.autoTable({
        startY: yPosition,
        head: procurementHeaders,
        body: procurementData,
        theme: 'grid',
        headStyles: { fillColor: [63, 81, 181] },
        styles: { fontSize: 8 },
        pageBreak: 'auto',
        margin: { top: 20, right: 10, bottom: 20, left: 10 },
        columnStyles: (() => {
          const styles = {
            0: { cellWidth: 20 }, // Vote Code
            1: { cellWidth: 20 }, // Project Code
            2: { cellWidth: 25 }, // Procurement Ref. No.
            3: { cellWidth: 30 }, // Project Name
            4: { cellWidth: 30 }, // Description of Procurement
            5: { cellWidth: 25 }, // Estimated Contract Value
            6: { cellWidth: 18 }, // Start Date
            7: { cellWidth: 18 }, // End Date
            8: { cellWidth: 20 }, // Source of Funding GoU
            9: { cellWidth: 20 } // Source of Funding External
          };
          
          // Add column styles for fiscal year columns
          const fiscalYears = data.fiscalYears || [];
          let colIndex = 10; // Start after the basic columns
          
          fiscalYears.forEach((fy, fyIndex) => {
            if (fyIndex > 0) {
              // Add separator columns
              styles[colIndex] = { cellWidth: 5 };
              colIndex++;
              styles[colIndex] = { cellWidth: 5 };
              colIndex++;
            }
            // Government of Uganda column
            styles[colIndex] = { cellWidth: 25 };
            colIndex++;
            // External Financing column
            styles[colIndex] = { cellWidth: 25 };
            colIndex++;
          });
          
          return styles;
        })()
      });
    } else if (reportType === "comprehensive") {
      // Comprehensive report with hierarchical fiscal year structure
      const comprehensive = data.comprehensive;
      const fiscalYears = comprehensive.fiscalYears || [];
      
      // Add Project Information section
      doc.setFontSize(12);
      doc.text("Project Information:", 14, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.text(`Programme Code: ${comprehensive.programmeCode || 'N/A'}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Programme Name: ${comprehensive.programmeName || 'N/A'}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Vote Code: ${comprehensive.voteCode || 'N/A'}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Vote Name: ${comprehensive.voteName || 'N/A'}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Project Code: ${comprehensive.projectCode || 'N/A'}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Project Name: ${comprehensive.projectName || 'N/A'}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Project Classification: ${comprehensive.projectClassification || 'N/A'}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Start Date: ${comprehensive.projectStartDate || 'N/A'}`, 20, yPosition);
      yPosition += 6;
      doc.text(`End Date: ${comprehensive.projectEndDate || 'N/A'}`, 20, yPosition);
      yPosition += 15;
      
      // Add Financial Summary section
      doc.setFontSize(12);
      doc.text("Arrears Summary:", 14, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.text(`Cumulative Arrears: ${formatNumber(comprehensive.cumulativeArrears || 0)}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Verified Arrears: ${formatNumber(comprehensive.verifiedArrears || 0)}`, 20, yPosition);
      yPosition += 15;
      
      // No section title needed - go directly to table
      
      // Create comprehensive table data with two rows (GoU and External)
      const comprehensiveTableData = [
        // GoU row (removed duplicate project info columns and arrears)
        [
          "GoU",
          ...fiscalYears.flatMap((fy, index) => {
            const contractualGoU = comprehensive.contractualCommitmentsGoU[fy] || 0;
            const nonContractualGoU = comprehensive.nonContractualCommitmentsGoU[fy] || 0;
            const counterpartGoU = comprehensive.counterpartCommitmentsGoU[fy] || 0;
            const totalGoU = contractualGoU + nonContractualGoU + counterpartGoU;
            return [
              ...(index > 0 ? ["", "", "", ""] : []), // Add separator columns
              formatNumber(contractualGoU),
              formatNumber(nonContractualGoU),
              formatNumber(counterpartGoU),
              formatNumber(totalGoU)
            ];
          })
        ],
        // External row (removed duplicate project info columns and arrears)
        [
          "External",
          ...fiscalYears.flatMap((fy, index) => {
            const contractualExternal = comprehensive.contractualCommitmentsExternal[fy] || 0;
            const nonContractualExternal = comprehensive.nonContractualCommitmentsExternal[fy] || 0;
            const counterpartExternal = comprehensive.counterpartCommitmentsExternal[fy] || 0;
            const totalExternal = contractualExternal + nonContractualExternal + counterpartExternal;
            return [
              ...(index > 0 ? ["", "", "", ""] : []), // Add separator columns
              formatNumber(contractualExternal),
              formatNumber(nonContractualExternal),
              formatNumber(counterpartExternal),
              formatNumber(totalExternal)
            ];
          })
        ]
      ];
      
      // Create hierarchical headers for PDF grouped by fiscal year with separators
      const comprehensiveHeaders = [
        // First row: Parent headers (removed duplicate project info columns and arrears)
        [
          "Funding",
          ...fiscalYears.flatMap((fy, index) => [
            ...(index > 0 ? ["", "", "", ""] : []), // Add separator columns
            fy, fy, fy, fy
          ])
        ],
        // Second row: Sub-column headers
        [
          "", // Empty cell for Funding column
          ...fiscalYears.flatMap((fy, index) => [
            ...(index > 0 ? ["", "", "", ""] : []), // Add separator columns
            "Contract", "Non-Contract", "Counterpart", "Total"
          ])
        ]
      ];
      
      // Add comprehensive table with two rows (GoU and External)
      doc.autoTable({
        head: comprehensiveHeaders,
        body: comprehensiveTableData,
        startY: yPosition,
        styles: { 
          fontSize: 5, // Much smaller font for maximum fit
          cellPadding: 1, // Minimal padding
          lineColor: [100, 100, 100], // Darker borders for better definition
          lineWidth: 0.15, // Thinner borders to save space
          halign: 'center',
          valign: 'middle',
          textColor: [0, 0, 0] // Ensure black text
        },
        headStyles: { 
          fillColor: [63, 81, 181], // Blue background for headers
          textColor: [255, 255, 255], // White text for contrast
          fontStyle: 'bold',
          halign: 'center',
          valign: 'middle',
          cellPadding: 1.5, // Minimal padding for headers
          fontSize: 6 // Smaller font for headers
        },
        alternateRowStyles: {
          fillColor: [248, 249, 250] // Light gray for alternating rows
        },
        pageBreak: 'auto',
        margin: { top: 20, right: 2, bottom: 20, left: 2 }, // Minimal side margins for maximum horizontal space
        tableWidth: 'auto',
        showHead: 'everyPage',
        didDrawPage: function (data) {
          // Add page numbers
          const pageCount = doc.internal.getNumberOfPages();
          const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
          doc.setFontSize(8);
          doc.text(`Page ${currentPage} of ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
        },
        columnStyles: (() => {
          const styles = {
            0: { cellWidth: 15, halign: 'center' } // Funding - slightly wider now
          };
          
          // Add column styles for fiscal year columns
          const fiscalYears = comprehensive.fiscalYears || [];
          let colIndex = 1; // Start after the Funding column
          
          fiscalYears.forEach((fy, fyIndex) => {
            if (fyIndex > 0) {
              // Add separator columns with visual separation - minimal width
              styles[colIndex] = { cellWidth: 2, fillColor: [240, 240, 240] };
              colIndex++;
              styles[colIndex] = { cellWidth: 2, fillColor: [240, 240, 240] };
              colIndex++;
              styles[colIndex] = { cellWidth: 2, fillColor: [240, 240, 240] };
              colIndex++;
              styles[colIndex] = { cellWidth: 2, fillColor: [240, 240, 240] };
              colIndex++;
            }
            // Contract column - slightly wider now
            styles[colIndex] = { cellWidth: 15, halign: 'right', fillColor: [227, 242, 253] };
            colIndex++;
            // Non-Contract column - slightly wider now
            styles[colIndex] = { cellWidth: 15, halign: 'right', fillColor: [232, 245, 233] };
            colIndex++;
            // Counterpart column - slightly wider now
            styles[colIndex] = { cellWidth: 15, halign: 'right', fillColor: [255, 243, 224] };
            colIndex++;
            // Total column - slightly wider now
            styles[colIndex] = { cellWidth: 15, halign: 'right', fillColor: [252, 228, 236] };
            colIndex++;
          });
          
          return styles;
        })()
      });
    }
    
    doc.save(`MYC_Report_${reportType}_${timestamp}.pdf`);
  };

  const downloadExcel = (data, reportType, timestamp) => {
    const reportTitle = reportTypes.find(t => t.value === reportType)?.label || "MYC Report";
    const workbook = XLSX.utils.book_new();
    
    if (reportType === "contractual") {
      // Contractual report with fiscal year columns
      const fiscalYears = data.fiscalYears || [];
      
      // Create hierarchical headers for Excel grouped by fiscal year
      const contractualHeaders = [
        // First row: Parent headers
        [
          "Project Code", "Contract Reference Number", "Contract Name", "Contractor",
          "Contract Value", "Approved Payments", "Balance on Contract Value",
          ...fiscalYears.flatMap((fy, index) => [
            ...(index > 0 ? ["", ""] : []), // Add separator columns
            fy, fy
          ])
        ],
        // Second row: Sub-column headers
        [
          "", "", "", "", "", "", "",
          ...fiscalYears.flatMap((fy, index) => [
            ...(index > 0 ? ["", ""] : []), // Add separator columns
            "GoU", "External"
          ])
        ]
      ];
      
      // Create contract data with fiscal year values
      const contractData = data.contracts?.map(contract => [
        contract.projectCode || 'N/A',
        contract.reference || 'N/A',
        contract.name || 'N/A',
        contract.contractor || 'N/A',
        contract.totalValue || 0,
        contract.approvedPayments || 0,
        contract.balance || 0,
        ...fiscalYears.flatMap((fy, index) => {
          const gouValue = contract.pipelineGoU?.[fy] || 0;
          const externalValue = contract.pipelineExternal?.[fy] || 0;
          return [
            ...(index > 0 ? ["", ""] : []), // Add separator columns
            gouValue, externalValue
          ];
        })
      ]) || [];
      
      const worksheet = XLSX.utils.aoa_to_sheet([
        ...contractualHeaders,
        ...contractData
      ]);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Contracts");
    } else if (reportType === "financial") {
      const financialData = [
        ["Financial Component", "Amount (UGX)"],
        ["Contract Amounts", data.financialSummary?.totalContractValue || 0],
        ["Non-Contractual Amounts", data.financialSummary?.totalNonContractualValue || 0],
        ["Counterpart Amounts", data.financialSummary?.totalCounterpartValue || 0],
        ["Procurement Amounts", data.financialSummary?.totalProcurementValue || 0],
        ["Total Project Amount", data.financialSummary?.totalProjectValue || 0]
      ];
      
      const worksheet = XLSX.utils.aoa_to_sheet(financialData);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Financial Summary");
    } else if (reportType === "non_contractual") {
      // Non-contractual report with fiscal year columns
      const fiscalYears = data.fiscalYears || [];
      
      // Create hierarchical headers for Excel grouped by fiscal year
      const nonContractualHeaders = [
        // First row: Parent headers
        [
          "Vote Code", "Project Code", "Item Code", "Description of Activity",
          "Start Date", "End Date", "Total Amount",
          ...fiscalYears.flatMap((fy, index) => [
            ...(index > 0 ? ["", ""] : []), // Add separator columns
            fy, fy
          ])
        ],
        // Second row: Sub-column headers
        [
          "", "", "", "", "", "", "",
          ...fiscalYears.flatMap((fy, index) => [
            ...(index > 0 ? ["", ""] : []), // Add separator columns
            "GoU", "External"
          ])
        ]
      ];
      
      // Create non-contractual data with fiscal year values
      const nonContractualData = data.entries?.map(entry => [
        entry.voteCode || 'N/A',
        entry.projectCode || 'N/A',
        entry.itemCode || 'N/A',
        entry.description || 'N/A',
        entry.startDate || 'N/A',
        entry.endDate || 'N/A',
        entry.totalAmount || 0,
        ...fiscalYears.flatMap((fy, index) => {
          const gouValue = entry.pipelineGoU?.[fy] || 0;
          const externalValue = entry.pipelineExternal?.[fy] || 0;
          return [
            ...(index > 0 ? ["", ""] : []), // Add separator columns
            gouValue, externalValue
          ];
        })
      ]) || [];
      
      const worksheet = XLSX.utils.aoa_to_sheet([
        ...nonContractualHeaders,
        ...nonContractualData
      ]);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Non-Contractual");
    } else if (reportType === "counterpart") {
      // Counterpart report with fiscal year columns
      const fiscalYears = data.fiscalYears || [];
      
      // Create hierarchical headers for Excel grouped by fiscal year
      const counterpartHeaders = [
        // First row: Parent headers
        [
          "Project Code", "Financing Agreement Title", "Counterpart Disbursed", "Balance on Counterpart",
          "Start Date", "End Date",
          ...fiscalYears.flatMap((fy, index) => [
            ...(index > 0 ? ["", ""] : []), // Add separator columns
            fy, fy
          ])
        ],
        // Second row: Sub-column headers
        [
          "", "", "", "", "", "",
          ...fiscalYears.flatMap((fy, index) => [
            ...(index > 0 ? ["", ""] : []), // Add separator columns
            "GoU", "External"
          ])
        ]
      ];
      
      // Create counterpart data with fiscal year values
      const counterpartData = data.counterparts?.map(counterpart => [
        counterpart.projectCode || 'N/A',
        counterpart.financingTitle || 'N/A',
        counterpart.counterpartDisbursed || 0,
        counterpart.balance || 0,
        counterpart.startDate || 'N/A',
        counterpart.endDate || 'N/A',
        ...fiscalYears.flatMap((fy, index) => {
          const gouValue = counterpart.pipelineGoU?.[fy] || 0;
          const externalValue = counterpart.pipelineExternal?.[fy] || 0;
          return [
            ...(index > 0 ? ["", ""] : []), // Add separator columns
            gouValue, externalValue
          ];
        })
      ]) || [];
      
      const worksheet = XLSX.utils.aoa_to_sheet([
        ...counterpartHeaders,
        ...counterpartData
      ]);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Counterparts");
    } else if (reportType === "procurement") {
      // Procurement report with fiscal year columns
      const fiscalYears = data.fiscalYears || [];
      
      // Create hierarchical headers for Excel grouped by fiscal year
      const procurementHeaders = [
        // First row: Parent headers
        [
          "Vote Code", "Project Code", "Procurement Ref. No.", "Project Name", "Description of Procurement",
          "Estimated Contract Value", "Start Date", "End Date", "Source of Funding", "Source of Funding",
          ...fiscalYears.flatMap((fy, index) => [
            ...(index > 0 ? ["", ""] : []), // Add separator columns
            fy, fy
          ])
        ],
        // Second row: Sub-column headers
        [
          "", "", "", "", "", "", "", "", "GoU", "External",
          ...fiscalYears.flatMap((fy, index) => [
            ...(index > 0 ? ["", ""] : []), // Add separator columns
            "Government of Uganda", "External Financing"
          ])
        ]
      ];
      
      // Create procurement data with fiscal year values
      const procurementData = data.procurements?.map(procurement => [
        procurement.voteCode || 'N/A',
        procurement.projectCode || 'N/A',
        procurement.procurementRefNo || 'N/A',
        procurement.projectName || 'N/A',
        procurement.description || 'N/A',
        procurement.estimatedContractValue || 0,
        procurement.commencementDate || 'N/A',
        procurement.endDate || 'N/A',
        procurement.sourceOfFinancing === 'Government of Uganda' ? procurement.estimatedContractValue : 0,
        procurement.sourceOfFinancing === 'External Financing' ? procurement.estimatedContractValue : 0,
        ...fiscalYears.flatMap((fy, index) => {
          const gouValue = procurement.pipelineGoU?.[fy] || 0;
          const externalValue = procurement.pipelineExternal?.[fy] || 0;
          return [
            ...(index > 0 ? ["", ""] : []), // Add separator columns
            gouValue, externalValue
          ];
        })
      ]) || [];
      
      const worksheet = XLSX.utils.aoa_to_sheet([
        ...procurementHeaders,
        ...procurementData
      ]);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Procurements");
    } else if (reportType === "comprehensive") {
      // Comprehensive report with hierarchical fiscal year structure
      const comprehensive = data.comprehensive;
      const fiscalYears = comprehensive.fiscalYears || [];
      
      // Create hierarchical headers for Excel grouped by fiscal year with separators
      const comprehensiveHeaders = [
        // First row: Parent headers
        [
        "Programme Code", "Vote Code", "Project Code", "Project Name", 
          "Project Start Date", "Project End Date",
        "Source of Funding",
        "Cumulative Arrears", "Verified Arrears",
          ...fiscalYears.flatMap((fy, index) => [
            ...(index > 0 ? ["", "", "", ""] : []), // Add separator columns
            fy, fy, fy, fy
          ])
        ],
        // Second row: Sub-column headers
        [
          "", "", "", "", "", "", "", "", "", "",
          ...fiscalYears.flatMap((fy, index) => [
            ...(index > 0 ? ["", "", "", ""] : []), // Add separator columns
            "Contractual Commitments",
            "Non-Contractual Commitments",
            "Counterpart Commitments",
            "Total Commitments"
          ])
        ]
      ];
      
      // Create two row data (GoU and External) grouped by fiscal year
      const comprehensiveData = [
        // GoU row
        [
          comprehensive.programmeCode,
          comprehensive.programmeName,
          comprehensive.voteCode,
          comprehensive.voteName,
          comprehensive.projectCode,
          comprehensive.projectName,
          comprehensive.projectClassification,
          comprehensive.projectStartDate,
          comprehensive.projectEndDate,
          "GoU (UGX)",
          comprehensive.cumulativeArrears,
          comprehensive.verifiedArrears,
          ...fiscalYears.flatMap((fy, index) => {
            const contractualGoU = comprehensive.contractualCommitmentsGoU[fy] || 0;
            const nonContractualGoU = comprehensive.nonContractualCommitmentsGoU[fy] || 0;
            const counterpartGoU = comprehensive.counterpartCommitmentsGoU[fy] || 0;
            const totalGoU = contractualGoU + nonContractualGoU + counterpartGoU;
            return [
              ...(index > 0 ? ["", "", "", ""] : []), // Add separator columns
              formatNumber(contractualGoU), formatNumber(nonContractualGoU), formatNumber(counterpartGoU), formatNumber(totalGoU)
            ];
          })
        ],
        // External row
        [
          "", "", "", "", "", "", "", "", "", "External", "", "",
          ...fiscalYears.flatMap((fy, index) => {
            const contractualExternal = comprehensive.contractualCommitmentsExternal[fy] || 0;
            const nonContractualExternal = comprehensive.nonContractualCommitmentsExternal[fy] || 0;
            const counterpartExternal = comprehensive.counterpartCommitmentsExternal[fy] || 0;
            const totalExternal = contractualExternal + nonContractualExternal + counterpartExternal;
            return [
              ...(index > 0 ? ["", "", "", ""] : []), // Add separator columns
              formatNumber(contractualExternal), formatNumber(nonContractualExternal), formatNumber(counterpartExternal), formatNumber(totalExternal)
            ];
          })
        ]
      ];
      
      const worksheet = XLSX.utils.aoa_to_sheet([
        ...comprehensiveHeaders,
        ...comprehensiveData
      ]);
      
      // Set column widths for better readability
      const colWidths = [
        { wch: 15 }, // Programme Code
        { wch: 12 }, // Vote Code
        { wch: 15 }, // Project Code
        { wch: 25 }, // Project Name
        { wch: 15 }, // Project Start Date
        { wch: 15 }, // Project End Date
        { wch: 15 }, // Project Value
        { wch: 12 }, // GoU
        { wch: 12 }, // External
        { wch: 18 }, // Cumulative Arrears
        { wch: 18 }, // Verified Arrears
        ...fiscalYears.flatMap(() => [
          { wch: 15 }, // Contractual
          { wch: 15 }, // Non-Contractual
          { wch: 12 }  // Total
        ])
      ];
      worksheet['!cols'] = colWidths;
      
      XLSX.utils.book_append_sheet(workbook, worksheet, "Comprehensive Report");
      
      // Non-contractual sheet
      if (data.nonContractualEntries && data.nonContractualEntries.length > 0) {
        const nonContractualData = data.nonContractualEntries.map(entry => [
          entry.itemCode || 'N/A',
          entry.description || 'N/A',
          entry.startDate || 'N/A',
          entry.endDate || 'N/A',
          entry.goUAmount || 0,
          entry.externalAmount || 0
        ]);
        
        const nonContractualWorksheet = XLSX.utils.aoa_to_sheet([
          ["Item Code", "Description", "Start Date", "End Date", "GoU Amount (UGX)", "External Amount (UGX)"],
          ...nonContractualData
        ]);
        XLSX.utils.book_append_sheet(workbook, nonContractualWorksheet, "Non-Contractual");
      }
      
      // Counterparts sheet
      if (data.counterparts && data.counterparts.length > 0) {
        const counterpartData = data.counterparts.map(counterpart => [
          counterpart.financingTitle || 'N/A',
          counterpart.requirementSpec || 'N/A',
          counterpart.startDate || 'N/A',
          counterpart.endDate || 'N/A',
          counterpart.value || 0,
          counterpart.disbursed || 0,
          counterpart.balance || 0
        ]);
        
        const counterpartWorksheet = XLSX.utils.aoa_to_sheet([
          ["Financing Title", "Requirement Spec", "Start Date", "End Date", "Value (UGX)", "Disbursed (UGX)", "Balance (UGX)"],
          ...counterpartData
        ]);
        XLSX.utils.book_append_sheet(workbook, counterpartWorksheet, "Counterparts");
      }
      
      // Procurements sheet
      if (data.procurementEntries && data.procurementEntries.length > 0) {
        const procurementData = data.procurementEntries.map(entry => [
          entry.data?.procurementRef || 'N/A',
          entry.data?.description || 'N/A',
          entry.data?.category || 'N/A',
          entry.data?.stage || 'N/A',
          entry.data?.contractValue || 0,
          entry.data?.sourceOfFinancing || 'N/A',
          entry.data?.commencementDate || 'N/A',
          entry.data?.endDate || 'N/A'
        ]);
        
        const procurementWorksheet = XLSX.utils.aoa_to_sheet([
          ["Reference", "Description", "Category", "Stage", "Contract Value (UGX)", "Source of Financing", "Start Date", "End Date"],
          ...procurementData
        ]);
        XLSX.utils.book_append_sheet(workbook, procurementWorksheet, "Procurements");
      }
    }
    
    XLSX.writeFile(workbook, `MYC_Report_${reportType}_${timestamp}.xlsx`);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(value || 0);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-UG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  return (
    <div style={{ padding: '24px', position: 'relative', maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
      <Typography variant="h4" sx={{ color: '#3F51B5', marginBottom: '24px', fontWeight: 'bold' }}>
        MYC Report Generator
      </Typography>

      {/* Data Availability Status */}
      <Card sx={{ marginBottom: '24px' }}>
        <CardContent>
          <Typography variant="h6" sx={{ marginBottom: '16px', fontWeight: 'bold' }}>
            Data Availability Status
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Chip 
                label={`Contracts: ${summaryStats.totalContracts}`}
                color={dataAvailability.contracts ? "success" : "default"}
                variant={dataAvailability.contracts ? "filled" : "outlined"}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Chip 
                label={`Non-Contractual: ${summaryStats.totalNonContractual}`}
                color={dataAvailability.nonContractual ? "success" : "default"}
                variant={dataAvailability.nonContractual ? "filled" : "outlined"}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Chip 
                label={`Counterparts: ${summaryStats.totalCounterparts}`}
                color={dataAvailability.counterparts ? "success" : "default"}
                variant={dataAvailability.counterparts ? "filled" : "outlined"}
              />
            </Grid>
            {/* <Grid item xs={12} sm={6} md={3}>
              <Chip 
                label={`Procurements: ${summaryStats.totalProcurement}`}
                color={dataAvailability.procurement ? "success" : "default"}
                variant={dataAvailability.procurement ? "filled" : "outlined"}
              />
            </Grid> */}
          </Grid>
        </CardContent>
      </Card>

      {/* Report Generation Controls */}
      <Card sx={{ marginBottom: '24px' }}>
        <CardContent>
          <Typography variant="h6" sx={{ marginBottom: '16px', fontWeight: 'bold' }}>
            Generate Report
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={selectedReportType}
                  onChange={(e) => setSelectedReportType(e.target.value)}
                  label="Report Type"
                >
                  {reportTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {type.label}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {type.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Output Format</InputLabel>
                <Select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  label="Output Format"
                >
                  <MenuItem value="pdf">PDF Document</MenuItem>
                  <MenuItem value="excel">Excel Spreadsheet</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          {/* Fiscal Year Settings - Only show for comprehensive reports */}
          {/* COMMENTED OUT FOR NOW
          {selectedReportType === "comprehensive" && (
            <Box sx={{ marginTop: '16px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Fiscal Year Settings
                </Typography>
                <ButtonMui
                  variant="contained"
                  onClick={() => setShowFiscalYearSettings(!showFiscalYearSettings)}
                  sx={{
                    backgroundColor: '#3F51B5',
                    color: 'white',
                    fontWeight: 'normal',
                    textTransform: 'uppercase',
                    '&:hover': {
                      backgroundColor: '#3F51B5'
                    }
                  }}
                >
                  {showFiscalYearSettings ? 'Hide Settings' : 'Configure Fiscal Years'}
                </ButtonMui>
              </Box>
              
              {showFiscalYearSettings && (
                <Grid container spacing={2}>
                  {Object.entries(fiscalYearSettings).map(([tabName, settings]) => (
                    <Grid item xs={12} sm={6} md={3} key={tabName}>
                      <Card sx={{ border: '1px solid #e0e0e0' }}>
                        <CardContent sx={{ padding: '16px' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                            <input
                              type="checkbox"
                              checked={settings.enabled}
                              onChange={(e) => {
                                setFiscalYearSettings(prev => ({
                                  ...prev,
                                  [tabName]: { ...prev[tabName], enabled: e.target.checked }
                                }));
                              }}
                              style={{ marginRight: '8px' }}
                            />
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                              {tabName.replace('_', ' ')} Tab
                            </Typography>
                          </Box>
                          
                          <Typography variant="body2" sx={{ color: '#666', marginBottom: '8px' }}>
                            Available Fiscal Years:
                          </Typography>
                          
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {extractFiscalYearsByTab[tabName].length > 0 ? (
                              extractFiscalYearsByTab[tabName].map(fy => (
                                <Chip
                                  key={fy}
                                  label={fy}
                                  size="small"
                                  color={settings.enabled ? "primary" : "default"}
                                  variant={settings.enabled ? "filled" : "outlined"}
                                />
                              ))
                            ) : (
                              <Typography variant="body2" sx={{ color: '#999', fontStyle: 'italic' }}>
                                No fiscal years found
                              </Typography>
                            )}
                          </Box>
                          
                          <Typography variant="caption" sx={{ color: '#666', display: 'block', marginTop: '8px' }}>
                            {settings.enabled ? 'Included in report' : 'Excluded from report'}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
              
              <Typography variant="body2" sx={{ color: '#666', marginTop: '16px', fontStyle: 'italic' }}>
                Configure which tabs and their fiscal years to include in the comprehensive report. 
                This allows flexibility when different tabs have different fiscal year ranges.
              </Typography>
            </Box>
          )}
          */}
          
          <Box sx={{ marginTop: '16px' }}>
            <ButtonMui
              variant="contained"
              onClick={handleGenerateReport}
              disabled={!selectedReportType}
              sx={{
                backgroundColor: '#3F51B5',
                color: 'white',
                fontWeight: 'normal',
                textTransform: 'uppercase',
                marginRight: '16px',
                '&:hover': {
                  backgroundColor: '#3F51B5'
                }
              }}
            >
              Generate Report
            </ButtonMui>
          </Box>
        </CardContent>
      </Card>

      {/* Generated Report Display */}
      {generatedReport && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Generated Report: {reportTypes.find(t => t.value === generatedReport.type)?.label}
              </Typography>
              <Box>
                <ButtonMui
                  variant="contained"
                  startIcon={<Download />}
                  onClick={handleDownload}
                  sx={{ 
                    backgroundColor: '#3F51B5',
                    color: 'white',
                    fontWeight: 'normal',
                    textTransform: 'uppercase',
                    '&:hover': {
                      backgroundColor: '#3F51B5'
                    }
                  }}
                >
                  Download
                </ButtonMui>
              </Box>
            </Box>
            
            <Divider sx={{ marginBottom: '16px' }} />
            
            {/* Report Content Preview */}
            <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
              {generatedReport.type === 'financial' && (
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Financial Component</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Amount (UGX)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Contract Amounts</TableCell>
                        <TableCell>{formatCurrency(summaryStats.totalContractValue)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Non-Contractual Amounts</TableCell>
                        <TableCell>{formatCurrency(summaryStats.totalNonContractualValue)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Counterpart Amounts</TableCell>
                        <TableCell>{formatCurrency(summaryStats.totalCounterpartValue)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Procurement Amounts</TableCell>
                        <TableCell>{formatCurrency(summaryStats.totalProcurementValue)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#e3f2fd' }}>Total Project Amount</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#e3f2fd' }}>
                          {formatCurrency(summaryStats.totalProjectValue)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              
              {generatedReport.type === 'contractual' && (
                <TableContainer component={Paper} sx={{ marginBottom: '16px' }}>
                  <Table size="small">
                    <TableHead>
                      {/* First row: Parent headers */}
                      <TableRow>
                        <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '120px' }}>Project Code</TableCell>
                        <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '150px' }}>Contract Reference Number</TableCell>
                        <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '200px' }}>Contract Name</TableCell>
                        <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '150px' }}>Contractor</TableCell>
                        <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '120px' }}>Contract Value</TableCell>
                        <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '120px' }}>Approved Payments</TableCell>
                        <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '120px' }}>Balance on Contract Value</TableCell>
                        {/* Fiscal year parent headers */}
                        {generatedReport.data.fiscalYears?.map((fy, index) => (
                          <TableCell 
                            key={`fy-parent-${fy}`} 
                            colSpan={2} 
                            sx={{ 
                              fontWeight: 'bold', 
                              backgroundColor: '#e3f2fd', 
                              minWidth: '300px',
                              borderLeft: index > 0 ? '2px solid #1976d2' : 'none',
                              borderRight: '1px solid #e0e0e0',
                              textAlign: 'center'
                            }}
                          >
                            {fy}
                          </TableCell>
                        ))}
                      </TableRow>
                      {/* Second row: Sub-column headers */}
                      <TableRow>
                        {generatedReport.data.fiscalYears?.map((fy, fyIndex) => (
                          <>
                            <TableCell 
                              key={`gou-sub-${fy}`} 
                              sx={{ 
                                fontWeight: 'bold', 
                                backgroundColor: '#e3f2fd', 
                                minWidth: '150px',
                                borderLeft: fyIndex > 0 ? '2px solid #1976d2' : 'none',
                                borderRight: '1px solid #e0e0e0'
                              }}
                            >
                              GoU
                            </TableCell>
                            <TableCell 
                              key={`external-sub-${fy}`} 
                              sx={{ 
                                fontWeight: 'bold', 
                                backgroundColor: '#e8f5e8', 
                                minWidth: '150px',
                                borderRight: '1px solid #e0e0e0'
                              }}
                            >
                              External
                            </TableCell>
                          </>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {generatedReport.data.contracts?.map((contract, index) => (
                        <TableRow key={index}>
                          <TableCell>{contract.projectCode}</TableCell>
                          <TableCell>{contract.reference || 'N/A'}</TableCell>
                          <TableCell>{contract.name || 'N/A'}</TableCell>
                          <TableCell>{contract.contractor || 'N/A'}</TableCell>
                          <TableCell>{formatNumber(contract.totalValue || 0)}</TableCell>
                          <TableCell>{formatNumber(contract.approvedPayments || 0)}</TableCell>
                          <TableCell>{formatNumber(contract.balance || 0)}</TableCell>
                          {/* Fiscal year data */}
                          {generatedReport.data.fiscalYears?.map((fy, fyIndex) => (
                            <>
                              <TableCell 
                                key={`gou-data-${fy}-${index}`}
                                sx={{
                                  borderLeft: fyIndex > 0 ? '2px solid #1976d2' : 'none',
                                  borderRight: '1px solid #e0e0e0',
                                  minWidth: '150px'
                                }}
                              >
                                {formatNumber(contract.pipelineGoU?.[fy] || 0)}
                          </TableCell>
                              <TableCell 
                                key={`external-data-${fy}-${index}`}
                                sx={{
                                  borderRight: '1px solid #e0e0e0',
                                  minWidth: '150px'
                                }}
                              >
                                {formatNumber(contract.pipelineExternal?.[fy] || 0)}
                              </TableCell>
                            </>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              
              {generatedReport.type === 'non_contractual' && (
                <TableContainer component={Paper} sx={{ marginBottom: '16px' }}>
                  <Table size="small">
                    <TableHead>
                      {/* First row: Parent headers */}
                      <TableRow>
                        <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '120px' }}>Vote Code</TableCell>
                        <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '120px' }}>Project Code</TableCell>
                        <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '120px' }}>Item Code</TableCell>
                        <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '200px' }}>Description of Activity</TableCell>
                        <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '120px' }}>Start Date</TableCell>
                        <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '120px' }}>End Date</TableCell>
                        <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '120px' }}>Total Amount</TableCell>
                        {/* Fiscal year parent headers */}
                        {generatedReport.data.fiscalYears?.map((fy, index) => (
                          <TableCell 
                            key={`fy-parent-${fy}`} 
                            colSpan={2} 
                            sx={{ 
                              fontWeight: 'bold', 
                              backgroundColor: '#e3f2fd', 
                              minWidth: '300px',
                              borderLeft: index > 0 ? '2px solid #1976d2' : 'none',
                              borderRight: '1px solid #e0e0e0',
                              textAlign: 'center'
                            }}
                          >
                            {fy}
                          </TableCell>
                        ))}
                      </TableRow>
                      {/* Second row: Sub-column headers */}
                      <TableRow>
                        {generatedReport.data.fiscalYears?.map((fy, fyIndex) => (
                          <>
                            <TableCell 
                              key={`gou-sub-${fy}`} 
                              sx={{ 
                                fontWeight: 'bold', 
                                backgroundColor: '#e3f2fd', 
                                minWidth: '150px',
                                borderLeft: fyIndex > 0 ? '2px solid #1976d2' : 'none',
                                borderRight: '1px solid #e0e0e0'
                              }}
                            >
                              GoU
                            </TableCell>
                            <TableCell 
                              key={`external-sub-${fy}`} 
                              sx={{ 
                                fontWeight: 'bold', 
                                backgroundColor: '#e8f5e8', 
                                minWidth: '150px',
                                borderRight: '1px solid #e0e0e0'
                              }}
                            >
                              External
                            </TableCell>
                          </>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {generatedReport.data.entries?.map((entry, index) => (
                        <TableRow key={index}>
                          <TableCell>{entry.voteCode}</TableCell>
                          <TableCell>{entry.projectCode}</TableCell>
                          <TableCell>{entry.itemCode}</TableCell>
                          <TableCell>{entry.description}</TableCell>
                          <TableCell>{entry.startDate}</TableCell>
                          <TableCell>{entry.endDate}</TableCell>
                          <TableCell>{formatNumber(entry.totalAmount || 0)}</TableCell>
                          {/* Fiscal year data */}
                          {generatedReport.data.fiscalYears?.map((fy, fyIndex) => (
                            <>
                              <TableCell 
                                key={`gou-data-${fy}-${index}`}
                                sx={{
                                  borderLeft: fyIndex > 0 ? '2px solid #1976d2' : 'none',
                                  borderRight: '1px solid #e0e0e0',
                                  minWidth: '150px'
                                }}
                              >
                                {formatNumber(entry.pipelineGoU?.[fy] || 0)}
                              </TableCell>
                              <TableCell 
                                key={`external-data-${fy}-${index}`}
                                sx={{
                                  borderRight: '1px solid #e0e0e0',
                                  minWidth: '150px'
                                }}
                              >
                                {formatNumber(entry.pipelineExternal?.[fy] || 0)}
                              </TableCell>
                            </>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              
              {generatedReport.type === 'counterpart' && (
                <TableContainer component={Paper} sx={{ marginBottom: '16px' }}>
                  <Table size="small">
                    <TableHead>
                      {/* First row: Parent headers */}
                      <TableRow>
                        <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '120px' }}>Project Code</TableCell>
                        <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '200px' }}>Financing Agreement Title</TableCell>
                        <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '120px' }}>Counterpart Disbursed</TableCell>
                        <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '120px' }}>Balance on Counterpart</TableCell>
                        <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '120px' }}>Start Date</TableCell>
                        <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '120px' }}>End Date</TableCell>
                        {/* Fiscal year parent headers */}
                        {generatedReport.data.fiscalYears?.map((fy, index) => (
                          <TableCell 
                            key={`fy-parent-${fy}`} 
                            colSpan={2} 
                            sx={{ 
                              fontWeight: 'bold', 
                              backgroundColor: '#e3f2fd', 
                              minWidth: '300px',
                              borderLeft: index > 0 ? '2px solid #1976d2' : 'none',
                              borderRight: '1px solid #e0e0e0',
                              textAlign: 'center'
                            }}
                          >
                            {fy}
                          </TableCell>
                        ))}
                      </TableRow>
                      {/* Second row: Sub-column headers */}
                      <TableRow>
                        {generatedReport.data.fiscalYears?.map((fy, fyIndex) => (
                          <>
                            <TableCell 
                              key={`gou-sub-${fy}`} 
                              sx={{ 
                                fontWeight: 'bold', 
                                backgroundColor: '#e3f2fd', 
                                minWidth: '150px',
                                borderLeft: fyIndex > 0 ? '2px solid #1976d2' : 'none',
                                borderRight: '1px solid #e0e0e0'
                              }}
                            >
                              GoU
                            </TableCell>
                            <TableCell 
                              key={`external-sub-${fy}`} 
                              sx={{ 
                                fontWeight: 'bold', 
                                backgroundColor: '#e8f5e8', 
                                minWidth: '150px',
                                borderRight: '1px solid #e0e0e0'
                              }}
                            >
                              External
                            </TableCell>
                          </>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {generatedReport.data.counterparts?.map((counterpart, index) => (
                        <TableRow key={index}>
                          <TableCell>{counterpart.projectCode}</TableCell>
                          <TableCell>{counterpart.financingTitle}</TableCell>
                          <TableCell>{formatNumber(counterpart.counterpartDisbursed || 0)}</TableCell>
                          <TableCell>{formatNumber(counterpart.balance || 0)}</TableCell>
                          <TableCell>{counterpart.startDate}</TableCell>
                          <TableCell>{counterpart.endDate}</TableCell>
                          {/* Fiscal year data */}
                          {generatedReport.data.fiscalYears?.map((fy, fyIndex) => (
                            <>
                              <TableCell 
                                key={`gou-data-${fy}-${index}`}
                                sx={{
                                  borderLeft: fyIndex > 0 ? '2px solid #1976d2' : 'none',
                                  borderRight: '1px solid #e0e0e0',
                                  minWidth: '150px'
                                }}
                              >
                                {formatNumber(counterpart.pipelineGoU?.[fy] || 0)}
                              </TableCell>
                              <TableCell 
                                key={`external-data-${fy}-${index}`}
                                sx={{
                                  borderRight: '1px solid #e0e0e0',
                                  minWidth: '150px'
                                }}
                              >
                                {formatNumber(counterpart.pipelineExternal?.[fy] || 0)}
                              </TableCell>
                            </>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              
              {generatedReport.type === 'procurement' && (
                <TableContainer component={Paper} sx={{ marginBottom: '16px' }}>
                  <Table size="small">
                    <TableHead>
                      {/* First row: Parent headers */}
                      <TableRow>
                        <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '120px' }}>Vote Code</TableCell>
                        <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '120px' }}>Project Code</TableCell>
                        <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '150px' }}>Procurement Ref. No.</TableCell>
                        <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '200px' }}>Project Name</TableCell>
                        <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '200px' }}>Description of Procurement</TableCell>
                        <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '120px' }}>Estimated Contract Value</TableCell>
                        <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '120px' }}>Start Date</TableCell>
                        <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '120px' }}>End Date</TableCell>
                        <TableCell colSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '300px', textAlign: 'center' }}>Source of Funding</TableCell>
                        {/* Fiscal year parent headers */}
                        {generatedReport.data.fiscalYears?.map((fy, index) => (
                          <TableCell 
                            key={`fy-parent-${fy}`} 
                            colSpan={2} 
                            sx={{ 
                              fontWeight: 'bold', 
                              backgroundColor: '#e3f2fd', 
                              minWidth: '300px',
                              borderLeft: index > 0 ? '2px solid #1976d2' : 'none',
                              borderRight: '1px solid #e0e0e0',
                              textAlign: 'center'
                            }}
                          >
                            {fy}
                          </TableCell>
                        ))}
                      </TableRow>
                      {/* Second row: Sub-column headers */}
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '150px' }}>GoU</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '150px' }}>External</TableCell>
                        {generatedReport.data.fiscalYears?.map((fy, fyIndex) => (
                          <>
                            <TableCell 
                              key={`gou-sub-${fy}`} 
                              sx={{ 
                                fontWeight: 'bold', 
                                backgroundColor: '#e3f2fd', 
                                minWidth: '150px',
                                borderLeft: fyIndex > 0 ? '2px solid #1976d2' : 'none',
                                borderRight: '1px solid #e0e0e0'
                              }}
                            >
                              Government of Uganda
                            </TableCell>
                            <TableCell 
                              key={`external-sub-${fy}`} 
                              sx={{ 
                                fontWeight: 'bold', 
                                backgroundColor: '#e8f5e8', 
                                minWidth: '150px',
                                borderRight: '1px solid #e0e0e0'
                              }}
                            >
                              External Financing
                            </TableCell>
                          </>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {generatedReport.data.procurements?.map((procurement, index) => (
                        <TableRow key={index}>
                          <TableCell>{procurement.voteCode}</TableCell>
                          <TableCell>{procurement.projectCode}</TableCell>
                          <TableCell>{procurement.procurementRefNo}</TableCell>
                          <TableCell>{procurement.projectName}</TableCell>
                          <TableCell>{procurement.description}</TableCell>
                          <TableCell>{formatNumber(procurement.estimatedContractValue || 0)}</TableCell>
                          <TableCell>{procurement.commencementDate}</TableCell>
                          <TableCell>{procurement.endDate}</TableCell>
                          {/* Source of Funding */}
                          <TableCell>{formatNumber(procurement.sourceOfFinancing === 'Government of Uganda' ? procurement.estimatedContractValue : 0)}</TableCell>
                          <TableCell>{formatNumber(procurement.sourceOfFinancing === 'External Financing' ? procurement.estimatedContractValue : 0)}</TableCell>
                          {/* Fiscal year data */}
                          {generatedReport.data.fiscalYears?.map((fy, fyIndex) => (
                            <>
                              <TableCell 
                                key={`gou-data-${fy}-${index}`}
                                sx={{
                                  borderLeft: fyIndex > 0 ? '2px solid #1976d2' : 'none',
                                  borderRight: '1px solid #e0e0e0',
                                  minWidth: '150px'
                                }}
                              >
                                {formatNumber(procurement.pipelineGoU?.[fy] || 0)}
                              </TableCell>
                              <TableCell 
                                key={`external-data-${fy}-${index}`}
                                sx={{
                                  borderRight: '1px solid #e0e0e0',
                                  minWidth: '150px'
                                }}
                              >
                                {formatNumber(procurement.pipelineExternal?.[fy] || 0)}
                              </TableCell>
                            </>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              
              {generatedReport.type === 'comprehensive' && (
                <div>
                  <Typography variant="h6" sx={{ marginBottom: '16px', fontWeight: 'bold', color: '#3F51B5' }}>
                    Comprehensive Report Preview
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: '16px', color: '#666' }}>
                    This comprehensive report includes all project data with fiscal year breakdowns. 
                    The report contains the following information:
                  </Typography>
                  
                  {/* Overview Information */}
                  <TableContainer component={Paper} sx={{ marginBottom: '16px' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', width: '30%' }}>Information Type</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', width: '70%' }}>Details</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Project Information</TableCell>
                          <TableCell>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <div><strong>Programme Code:</strong> {generatedReport.data.comprehensive?.programmeCode || 'N/A'}</div>
                              <div><strong>Vote Code:</strong> {generatedReport.data.comprehensive?.voteCode || 'N/A'}</div>
                              <div><strong>Project Code:</strong> {generatedReport.data.comprehensive?.projectCode || 'N/A'}</div>
                              <div><strong>Project Name:</strong> {generatedReport.data.comprehensive?.projectName || 'N/A'}</div>
                              <div><strong>Start Date:</strong> {generatedReport.data.comprehensive?.projectStartDate || 'N/A'}</div>
                              <div><strong>End Date:</strong> {generatedReport.data.comprehensive?.projectEndDate || 'N/A'}</div>
                              <div><strong>Project Value:</strong> {formatCurrency(generatedReport.data.comprehensive?.projectValue || 0)}</div>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Source of Funding Breakdown</TableCell>
                          <TableCell>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <div><strong>GoU (Government of Uganda):</strong> {formatCurrency((generatedReport.data.comprehensive?.projectValue || 0) * 0.6)}</div>
                              <div><strong>External Financing:</strong> {formatCurrency((generatedReport.data.comprehensive?.projectValue || 0) * 0.4)}</div>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Arrears Information</TableCell>
                          <TableCell>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <div><strong>Cumulative Arrears:</strong> {formatNumber(generatedReport.data.comprehensive?.cumulativeArrears || 0)}</div>
                              <div><strong>Verified Arrears:</strong> {formatNumber(generatedReport.data.comprehensive?.verifiedArrears || 0)}</div>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Fiscal Year Data</TableCell>
                          <TableCell>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <div><strong>Fiscal Years Covered:</strong> {generatedReport.data.comprehensive?.fiscalYears?.length || 0} years</div>
                              <div><strong>Years:</strong> {generatedReport.data.comprehensive?.fiscalYears?.join(', ') || 'N/A'}</div>
                              <div><strong>Data Includes:</strong> Contractual Commitments, Non-Contractual Commitments, Counterpart Commitments, and Total Commitments</div>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Comprehensive Data Table - Single Row */}
                  <Typography variant="subtitle2" sx={{ marginBottom: '8px', fontWeight: 'bold', color: '#3F51B5' }}>
                    Comprehensive Data (Single Row - Scrollable Horizontally)
                  </Typography>
                  <TableContainer component={Paper} sx={{ overflowX: 'auto', maxWidth: '100%' }}>
                    <Table size="small" sx={{ 
                      minWidth: `${1200 + (generatedReport.data.comprehensive?.fiscalYears?.length || 0) * 600}px` 
                    }}>
                      <TableHead>
                        {/* First row: Parent headers */}
                        <TableRow>
                          <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '120px' }}>Programme Code</TableCell>
                          <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '200px' }}>Programme Name</TableCell>
                          <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '100px' }}>Vote Code</TableCell>
                          <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '200px' }}>Vote Name</TableCell>
                          <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '120px' }}>Project Code</TableCell>
                          <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '200px' }}>Project Name</TableCell>
                          <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '150px' }}>Project Classification</TableCell>
                          <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '120px' }}>Start Date</TableCell>
                          <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '120px' }}>End Date</TableCell>
                          <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '150px' }}>Source of Funding</TableCell>
                          <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '140px' }}>Cumulative Arrears</TableCell>
                          <TableCell rowSpan={2} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: '140px' }}>Verified Arrears</TableCell>
                          {/* Fiscal year parent headers */}
                          {generatedReport.data.comprehensive?.fiscalYears?.map((fy, index) => (
                            <TableCell 
                              key={`fy-parent-${fy}`} 
                              colSpan={4} 
                              sx={{ 
                                fontWeight: 'bold', 
                                backgroundColor: '#e1f5fe', 
                                textAlign: 'center', 
                                minWidth: '480px',
                                borderLeft: index > 0 ? '2px solid #1976d2' : 'none',
                                borderRight: '1px solid #e0e0e0'
                              }}
                            >
                              {fy}
                            </TableCell>
                          ))}
                        </TableRow>
                        {/* Second row: Sub-column headers */}
                        <TableRow>
                          {/* Empty cells for the rowSpan columns */}
                          {generatedReport.data.comprehensive?.fiscalYears?.map((fy, fyIndex) => (
                            <>
                              <TableCell 
                                key={`contractual-sub-${fy}`} 
                                sx={{ 
                                  fontWeight: 'bold', 
                                  backgroundColor: '#e3f2fd', 
                                  minWidth: '150px',
                                  borderLeft: fyIndex > 0 ? '2px solid #1976d2' : 'none',
                                  borderRight: '1px solid #e0e0e0'
                                }}
                              >
                                Contractual Commitments
                              </TableCell>
                              <TableCell 
                                key={`non-contractual-sub-${fy}`} 
                                sx={{ 
                                  fontWeight: 'bold', 
                                  backgroundColor: '#e8f5e8', 
                                  minWidth: '150px',
                                  borderRight: '1px solid #e0e0e0'
                                }}
                              >
                                Non-Contractual Commitments
                              </TableCell>
                              <TableCell 
                                key={`counterpart-sub-${fy}`} 
                                sx={{ 
                                  fontWeight: 'bold', 
                                  backgroundColor: '#fff3e0', 
                                  minWidth: '150px',
                                  borderRight: '1px solid #e0e0e0'
                                }}
                              >
                                Counterpart Commitments
                              </TableCell>
                              <TableCell 
                                key={`total-sub-${fy}`} 
                                sx={{ 
                                  fontWeight: 'bold', 
                                  backgroundColor: '#fce4ec', 
                                  minWidth: '150px',
                                  borderRight: '1px solid #e0e0e0'
                                }}
                              >
                                Total Commitments
                              </TableCell>
                            </>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {/* GoU Row */}
                        <TableRow>
                          <TableCell>{generatedReport.data.comprehensive?.programmeCode || 'N/A'}</TableCell>
                          <TableCell>{generatedReport.data.comprehensive?.programmeName || 'N/A'}</TableCell>
                          <TableCell>{generatedReport.data.comprehensive?.voteCode || 'N/A'}</TableCell>
                          <TableCell>{generatedReport.data.comprehensive?.voteName || 'N/A'}</TableCell>
                          <TableCell>{generatedReport.data.comprehensive?.projectCode || 'N/A'}</TableCell>
                          <TableCell>{generatedReport.data.comprehensive?.projectName || 'N/A'}</TableCell>
                          <TableCell>{generatedReport.data.comprehensive?.projectClassification || 'N/A'}</TableCell>
                          <TableCell>{generatedReport.data.comprehensive?.projectStartDate || 'N/A'}</TableCell>
                          <TableCell>{generatedReport.data.comprehensive?.projectEndDate || 'N/A'}</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#e3f2fd' }}>
                            GoU <span style={{ fontSize: '0.75rem', fontWeight: 'normal' }}>(UGX)</span>
                          </TableCell>
                          <TableCell>{formatNumber(generatedReport.data.comprehensive?.cumulativeArrears || 0)}</TableCell>
                          <TableCell>{formatNumber(generatedReport.data.comprehensive?.verifiedArrears || 0)}</TableCell>
                          {/* Show all actual fiscal years that were used - grouped by fiscal year - GoU values */}
                          {generatedReport.data.comprehensive?.fiscalYears?.map((fy, fyIndex) => {
                            const contractualGoU = generatedReport.data.comprehensive?.contractualCommitmentsGoU?.[fy] || 0;
                            const nonContractualGoU = generatedReport.data.comprehensive?.nonContractualCommitmentsGoU?.[fy] || 0;
                            const counterpartGoU = generatedReport.data.comprehensive?.counterpartCommitmentsGoU?.[fy] || 0;
                            const totalGoU = contractualGoU + nonContractualGoU + counterpartGoU;
                            return (
                              <>
                                <TableCell 
                                  key={`contractual-data-gou-${fy}`}
                                  sx={{
                                    borderLeft: fyIndex > 0 ? '2px solid #1976d2' : 'none',
                                    borderRight: '1px solid #e0e0e0',
                                    minWidth: '150px'
                                  }}
                                >
                                  {formatNumber(contractualGoU)}
                                </TableCell>
                                <TableCell 
                                  key={`non-contractual-data-gou-${fy}`}
                                  sx={{
                                    borderRight: '1px solid #e0e0e0',
                                    minWidth: '150px'
                                  }}
                                >
                                  {formatNumber(nonContractualGoU)}
                                </TableCell>
                                <TableCell 
                                  key={`counterpart-data-gou-${fy}`}
                                  sx={{
                                    borderRight: '1px solid #e0e0e0',
                                    minWidth: '150px'
                                  }}
                                >
                                  {formatNumber(counterpartGoU)}
                                </TableCell>
                                <TableCell 
                                  key={`total-data-gou-${fy}`}
                                  sx={{
                                    borderRight: '1px solid #e0e0e0'
                                  }}
                                >
                                  {formatNumber(totalGoU)}
                                </TableCell>
                              </>
                            );
                          })}
                        </TableRow>
                        {/* External Row */}
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#e8f5e8' }}>
                            External <span style={{ fontSize: '0.75rem', fontWeight: 'normal' }}>(UGX)</span>
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          {/* Show all actual fiscal years that were used - grouped by fiscal year - External values */}
                          {generatedReport.data.comprehensive?.fiscalYears?.map((fy, fyIndex) => {
                            const contractualExternal = generatedReport.data.comprehensive?.contractualCommitmentsExternal?.[fy] || 0;
                            const nonContractualExternal = generatedReport.data.comprehensive?.nonContractualCommitmentsExternal?.[fy] || 0;
                            const counterpartExternal = generatedReport.data.comprehensive?.counterpartCommitmentsExternal?.[fy] || 0;
                            const totalExternal = contractualExternal + nonContractualExternal + counterpartExternal;
                            return (
                              <>
                                <TableCell 
                                  key={`contractual-data-external-${fy}`}
                                  sx={{
                                    borderLeft: fyIndex > 0 ? '2px solid #1976d2' : 'none',
                                    borderRight: '1px solid #e0e0e0',
                                    minWidth: '150px'
                                  }}
                                >
                                  {formatNumber(contractualExternal)}
                                </TableCell>
                                <TableCell 
                                  key={`non-contractual-data-external-${fy}`}
                                  sx={{
                                    borderRight: '1px solid #e0e0e0',
                                    minWidth: '150px'
                                  }}
                                >
                                  {formatNumber(nonContractualExternal)}
                                </TableCell>
                                <TableCell 
                                  key={`counterpart-data-external-${fy}`}
                                  sx={{
                                    borderRight: '1px solid #e0e0e0',
                                    minWidth: '150px'
                                  }}
                                >
                                  {formatNumber(counterpartExternal)}
                                </TableCell>
                                <TableCell 
                                  key={`total-data-external-${fy}`}
                                  sx={{
                                    borderRight: '1px solid #e0e0e0'
                                  }}
                                >
                                  {formatNumber(totalExternal)}
                                </TableCell>
                              </>
                            );
                          })}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  <Typography variant="body2" sx={{ marginTop: '16px', color: '#666', fontStyle: 'italic' }}>
                    Note: 
                    {generatedReport.data.comprehensive?.fiscalYears?.length > 0 && (
                      <span> Currently showing {generatedReport.data.comprehensive.fiscalYears.length} fiscal year(s): {generatedReport.data.comprehensive.fiscalYears.join(', ')}.</span>
                    )}
                  </Typography>
                </div>
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Data Requirements Alert */}
      {Object.values(dataAvailability).some(available => !available) && (
        <Alert severity="info" sx={{ marginTop: '24px' }}>
          <Typography variant="body2">
            <strong>Note:</strong> Some report types may have limited data. 
            Complete all sections (Contractual, Non-Contractual, Counterpart) 
            for comprehensive reports.
          </Typography>
        </Alert>
      )}
    </div>
  );
};

export default MYCReport;
