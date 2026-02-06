import React, { useState } from 'react';
import ConfirmationDialog from './ConfirmationDialog';
import jsPDF from 'jspdf';
// Import autoTable as a function from jspdf-autotable
import autoTable from 'jspdf-autotable';
import logo from '../mofped-logo.png';

const Step4 = ({ 
  formData, 
  updateFormData, 
  budgetItems, 
  uploadedFiles, 
  setUploadedFiles, 
  errors, 
  selectedCommitmentType, 
  getTotalCommitmentValue, 
  nextStep, 
  prevStep, 
  submitForm,
  projectData,
  pbsData,
  isAllAtOnceMode,
  completedForms,
  allAtOnceBudgetItems
}) => {
  const [fileInputRef] = useState(React.createRef());
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  const handleSubmitClick = () => {
    setShowConfirmationDialog(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmationDialog(false);
    submitForm();
  };

  const handleCancelSubmit = () => {
    setShowConfirmationDialog(false);
  };

  const handleFileSelect = (event) => {
    const files = event.target.files;
    const newFiles = [];
    
    Array.from(files).forEach(file => {
      if (file.size <= 10 * 1024 * 1024) { // 10MB limit
        newFiles.push(file);
      } else {
        alert(`File ${file.name} exceeds 10MB limit`);
      }
    });

    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileName) => {
    setUploadedFiles(prev => prev.filter(f => f.name !== fileName));
  };

  const handleExport = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 30;
    let yPosition = 40; // Start below header space

    // Helper function to add text with specified styling
    const addText = (text, x, y, options = {}) => {
      doc.setFont(options.font || 'helvetica', options.style || 'normal');
      doc.setFontSize(options.size || 10);
      if (options.color && Array.isArray(options.color)) {
        doc.setTextColor(options.color[0], options.color[1], options.color[2]);
      } else {
        doc.setTextColor(44, 62, 80);
      }
      doc.text(text, x, y, options.align || {});
    };

    // Helper to add colored rectangle
    const addRect = (x, y, width, height, color) => {
      doc.setFillColor(...color);
      doc.rect(x, y, width, height, 'F');
    };

    // Helper to add table cell
    const addCell = (text, x, y, width, height, style = {}) => {
      doc.setDrawColor(style.borderColor || [189, 195, 199]);
      doc.setLineWidth(style.lineWidth || 0.5);
      doc.rect(x, y, width, height);
      
      doc.setFillColor(style.bgColor || [255, 255, 255]);
      doc.rect(x, y, width, height, 'FD');
      
      addText(text, x + (style.padding || 4), y + (height - 4), {
        size: style.fontSize || 9,
        color: style.textColor || [44, 62, 80],
        style: style.fontStyle || 'normal'
      });
    };

    // Headers will be drawn in footer loop, skip here
    // Start content below header space (accounting for header height)
    const headerHeight = 45; // Space for header + Uganda flag colors
    yPosition = headerHeight;

    // Calculate consolidated total for all-at-once mode
    let totalValue = 0;
    if (isAllAtOnceMode) {
      totalValue = (parseFloat(formData.totalContractValue) || 0) + 
                   (parseFloat(formData.estimatedTotalValue) || 0) + 
                   (parseFloat(formData.gouCounterpartValue) || 0);
    } else {
      totalValue = getTotalCommitmentValue();
    }
    
    const commitmentTypeText = isAllAtOnceMode ? 'All Commitment Types' :
                               selectedCommitmentType === 'contractual' ? 'Contractual Commitment' : 
                               selectedCommitmentType === 'non-contractual' ? 'Non-Contractual Commitment' : 
                               'Counterpart Funding';
    
    const commitmentTypeInfo = {
      'Contractual Commitment': {
        title: formData.contractProjectTitle,
        value: formData.totalContractValue,
        contractRef: formData.contractReference,
        supplier: formData.supplierName,
        startDate: formData.contractStartDate,
        endDate: formData.contractEndDate
      },
      'Non-Contractual Commitment': {
        title: formData.nonContractProjectTitle,
        value: formData.estimatedTotalValue,
        obligation: formData.obligationNature,
        startDate: formData.commitmentStartDate,
        endDate: formData.commitmentEndDate
      },
      'Counterpart Funding': {
        title: formData.counterpartProjectTitle,
        value: formData.gouCounterpartValue,
        donor: formData.donorName,
        startDate: formData.projectStartDate,
        endDate: formData.projectEndDate
      }
    };
    
    // Add Executive Summary section
    yPosition += 5;
    addRect(margin, yPosition, pageWidth - (2 * margin), 7, [52, 152, 219]);
    addText('EXECUTIVE SUMMARY', margin + 5, yPosition + 5, { size: 9, style: 'bold', color: [255, 255, 255] });
    yPosition += 9;
    
    const summaryData = [
      ['Total Commitment Value', `UGX ${totalValue.toLocaleString()}`],
      ['Commitment Type', commitmentTypeText],
      ['Number of Commitment Types', isAllAtOnceMode ? '3 (All Types)' : '1'],
      ...(pbsData ? [['Vote Name', pbsData.Vote_Name || 'N/A']] : []),
      ...(projectData ? [['Project Name', projectData.title || 'N/A']] : [])
    ];
    
    autoTable(doc, {
      startY: yPosition,
      head: false,
      body: summaryData,
      margin: { top: 45, bottom: 30, left: margin, right: margin },
      styles: { 
        fontSize: 7, 
        cellPadding: 4,
        fillColor: [236, 240, 241]
      },
      columnStyles: {
        0: { fillColor: [236, 240, 241], fontStyle: 'bold', textColor: [127, 140, 141] },
        1: { fillColor: [255, 255, 255], textColor: [44, 62, 80] }
      },
      didParseCell: function(data) {
        // Highlight total commitment value in green and larger font
        if (data.row.index === 0 && data.column.index === 1) {
          data.cell.styles.textColor = [39, 174, 96]; // Green color
          data.cell.styles.fontSize = 10;
          data.cell.styles.fontStyle = 'bold';
        }
      }
    });
    
    yPosition = doc.lastAutoTable.finalY + 8;
    
    // Add commitment details section header
    if (pbsData || projectData) {
      addRect(margin, yPosition, pageWidth - (2 * margin), 7, [52, 152, 219]);
      addText('ORGANIZATIONAL DETAILS', margin + 5, yPosition + 5, { size: 9, style: 'bold', color: [255, 255, 255] });
      yPosition += 9;
      
      const orgData = [];
      if (pbsData) orgData.push(['Vote Code', pbsData.Vote_Code || 'N/A']);
      if (pbsData) orgData.push(['Vote Name (MDA)', pbsData.Vote_Name || 'N/A']);
      if (projectData) orgData.push(['Project Code', projectData.code || 'N/A']);
      if (isAllAtOnceMode && formData.contractProjectTitle) {
        orgData.push(['Primary Project Title', formData.contractProjectTitle]);
      } else if (!isAllAtOnceMode) {
        const info = selectedCommitmentType === 'contractual' ? commitmentTypeInfo['Contractual Commitment'] :
                     selectedCommitmentType === 'non-contractual' ? commitmentTypeInfo['Non-Contractual Commitment'] :
                     commitmentTypeInfo['Counterpart Funding'];
        if (info && info.title) orgData.push(['Project Title', info.title]);
      }
      if (pbsData?.Programme_Name) orgData.push(['Programme', pbsData.Programme_Name]);
      if (pbsData?.SubProgramme_Name) orgData.push(['Sub-Programme', pbsData.SubProgramme_Name]);
      
      
      if (orgData.length > 0) {
        autoTable(doc, {
          startY: yPosition,
          head: false,
          body: orgData,
          margin: { top: 45, bottom: 30, left: margin, right: margin },
          styles: { 
            fontSize: 7, 
            cellPadding: 4,
            fillColor: [248, 249, 250]
          },
          columnStyles: {
            0: { fillColor: [248, 249, 250], fontStyle: 'bold', textColor: [127, 140, 141] },
            1: { fillColor: [255, 255, 255], textColor: [44, 62, 80] }
          }
        });
        
        yPosition = doc.lastAutoTable.finalY + 8;
      }
    }
    
    // Add COMMITMENT INFORMATION section  
    // Build commitment data based on mode
    const buildCommitmentData = () => {
      if (isAllAtOnceMode) {
        return {
          allTypes: true,
          contractual: {
            title: '1. Contractual Commitment',
            data: [
              ['Project Title', formData.contractProjectTitle || ''],
              ['Contract Reference', formData.contractReference || ''],
              ['Supplier Name', formData.supplierName || ''],
              ['Total Value', `UGX ${(parseFloat(formData.totalContractValue) || 0).toLocaleString()}`],
              ['Start Date', formData.contractStartDate || ''],
              ['End Date', formData.contractEndDate || '']
            ].filter(([_, value]) => value !== '')
          },
          nonContractual: {
            title: '2. Non-Contractual Commitment',
            data: [
              ['Project Title', formData.nonContractProjectTitle || ''],
              ['Nature of Obligation', formData.obligationNature || ''],
              ['Policy Reference', formData.policyReference || ''],
              ['Total Value', `UGX ${(parseFloat(formData.estimatedTotalValue) || 0).toLocaleString()}`],
              ['Start Date', formData.commitmentStartDate || ''],
              ['End Date', formData.commitmentEndDate || '']
            ].filter(([_, value]) => value !== '')
          },
          counterpart: {
            title: '3. Counterpart Funding',
            data: [
              ['Project Title', formData.counterpartProjectTitle || ''],
              ['Donor Name', formData.donorName || ''],
              ['Total Project Value', `UGX ${(parseFloat(formData.totalProjectValue) || 0).toLocaleString()}`],
              ['GoU Counterpart Value', `UGX ${(parseFloat(formData.gouCounterpartValue) || 0).toLocaleString()}`],
              ['Counterpart Percentage', formData.counterpartPercentage ? `${formData.counterpartPercentage}%` : ''],
              ['Start Date', formData.projectStartDate || ''],
              ['End Date', formData.projectEndDate || '']
            ].filter(([_, value]) => value !== '')
          }
        };
      } else {
        // Single commitment type
        const commitData = [];
        if (selectedCommitmentType === 'contractual') {
          if (formData.contractReference) commitData.push(['Contract Reference', formData.contractReference]);
          if (formData.supplierName) commitData.push(['Supplier Name', formData.supplierName]);
          if (formData.contractFundingSource) commitData.push(['Funding Source', formData.contractFundingSource]);
          if (formData.implementingAgency) commitData.push(['Implementing Agency', formData.implementingAgency]);
          if (formData.procurementCategory) commitData.push(['Procurement Category', formData.procurementCategory]);
          if (formData.procurementType) commitData.push(['Procurement Type', formData.procurementType]);
          if (formData.projectClassification) commitData.push(['Project Classification', formData.projectClassification]);
          if (formData.annualPenaltyRate) commitData.push(['Annual Penalty Interest Rate (%)', `${formData.annualPenaltyRate}%`]);
          
          if (formData.arrearsStartDate) commitData.push(['Arrears Start Date', formData.arrearsStartDate]);
          if (formData.verifiedArrears && parseFloat(formData.verifiedArrears) > 0) {
            commitData.push(['Verified Arrears', `UGX ${parseFloat(formData.verifiedArrears).toLocaleString()}`]);
          }
          if (formData.unverifiedArrears && parseFloat(formData.unverifiedArrears) > 0) {
            commitData.push(['Unverified Arrears', `UGX ${parseFloat(formData.unverifiedArrears).toLocaleString()}`]);
          }
          if (formData.cumulativeArrears && parseFloat(formData.cumulativeArrears) > 0) {
            commitData.push(['Cumulative Arrears', `UGX ${parseFloat(formData.cumulativeArrears).toLocaleString()}`]);
          }
          if (formData.cumulativePenaltyExposure) {
            commitData.push(['Penalty Exposure', `UGX ${parseFloat(formData.cumulativePenaltyExposure).toLocaleString()}`]);
          }
        } else if (selectedCommitmentType === 'counterpart') {
          if (formData.donorName) commitData.push(['Donor Name', formData.donorName]);
          if (formData.financingAgreementRef) commitData.push(['Financing Agreement', formData.financingAgreementRef]);
          if (formData.totalProjectValue) commitData.push(['Total Project Value', `UGX ${parseFloat(formData.totalProjectValue).toLocaleString()}`]);
          if (formData.counterpartPercentage) commitData.push(['Counterpart Percentage', `${formData.counterpartPercentage}%`]);
          if (formData.counterpartFundingType) commitData.push(['Funding Type', formData.counterpartFundingType]);
          if (formData.counterpartImplementingAgency) commitData.push(['Implementing Agency', formData.counterpartImplementingAgency]);
        } else if (selectedCommitmentType === 'non-contractual') {
          if (formData.obligationNature) commitData.push(['Nature of Obligation', formData.obligationNature]);
          if (formData.policyReference) commitData.push(['Policy Reference', formData.policyReference]);
          if (formData.responsibleVote) commitData.push(['Responsible Vote', formData.responsibleVote]);
          if (formData.nonContractFundingSource) commitData.push(['Funding Source', formData.nonContractFundingSource]);
        }
        
        const info = commitmentTypeInfo[selectedCommitmentType === 'contractual' ? 'Contractual Commitment' : 
                                          selectedCommitmentType === 'non-contractual' ? 'Non-Contractual Commitment' : 
                                          'Counterpart Funding'];
        if (info && info.startDate) commitData.push(['Start Date', info.startDate]);
        if (info && info.endDate) commitData.push(['End Date', info.endDate]);
        
        return { allTypes: false, data: commitData };
      }
    };

    const commitmentData = buildCommitmentData();
    
    if (isAllAtOnceMode && commitmentData.allTypes) {
      // Display all three commitment types
      addRect(margin, yPosition, pageWidth - (2 * margin), 7, [52, 152, 219]);
      addText('COMMITMENT INFORMATION', margin + 5, yPosition + 5, { size: 9, style: 'bold', color: [255, 255, 255] });
      yPosition += 15; // Increased spacing after main header
      
      // Contractual Commitment
      if (commitmentData.contractual.data.length > 0) {
        addText(commitmentData.contractual.title, margin, yPosition, { size: 10, style: 'bold', color: [52, 152, 219] });
        yPosition += 8; // Increased spacing after each type title
        
        autoTable(doc, {
          startY: yPosition,
          head: false,
          body: commitmentData.contractual.data,
          margin: { top: 45, bottom: 30, left: margin, right: margin },
          styles: { fontSize: 7, cellPadding: 3, fillColor: [255, 255, 255] },
          columnStyles: {
            0: { fillColor: [240, 248, 255], fontStyle: 'bold', textColor: [127, 140, 141] },
            1: { fillColor: [255, 255, 255], textColor: [44, 62, 80] }
          }
        });
        yPosition = doc.lastAutoTable.finalY + 10; // Increased spacing between sections
      }
      
      // Non-Contractual Commitment
      if (commitmentData.nonContractual.data.length > 0) {
        addText(commitmentData.nonContractual.title, margin, yPosition, { size: 10, style: 'bold', color: [52, 152, 219] });
        yPosition += 8; // Increased spacing after each type title
        
        autoTable(doc, {
          startY: yPosition,
          head: false,
          body: commitmentData.nonContractual.data,
          margin: { top: 45, bottom: 30, left: margin, right: margin },
          styles: { fontSize: 7, cellPadding: 3, fillColor: [255, 255, 255] },
          columnStyles: {
            0: { fillColor: [240, 248, 255], fontStyle: 'bold', textColor: [127, 140, 141] },
            1: { fillColor: [255, 255, 255], textColor: [44, 62, 80] }
          }
        });
        yPosition = doc.lastAutoTable.finalY + 10; // Increased spacing between sections
      }
      
      // Counterpart Funding
      if (commitmentData.counterpart.data.length > 0) {
        addText(commitmentData.counterpart.title, margin, yPosition, { size: 10, style: 'bold', color: [52, 152, 219] });
        yPosition += 8; // Increased spacing after each type title
        
        autoTable(doc, {
          startY: yPosition,
          head: false,
          body: commitmentData.counterpart.data,
          margin: { top: 45, bottom: 30, left: margin, right: margin },
          styles: { fontSize: 7, cellPadding: 3, fillColor: [255, 255, 255] },
          columnStyles: {
            0: { fillColor: [240, 248, 255], fontStyle: 'bold', textColor: [127, 140, 141] },
            1: { fillColor: [255, 255, 255], textColor: [44, 62, 80] }
          }
        });
        yPosition = doc.lastAutoTable.finalY + 8;
      }
    } else if (!commitmentData.allTypes && commitmentData.data.length > 0) {
      // Single commitment type
      addRect(margin, yPosition, pageWidth - (2 * margin), 7, [52, 152, 219]);
      addText('COMMITMENT INFORMATION', margin + 5, yPosition + 5, { size: 9, style: 'bold', color: [255, 255, 255] });
      yPosition += 9;
      
      autoTable(doc, {
        startY: yPosition,
        head: false,
        body: commitmentData.data,
        margin: { top: 45, bottom: 30, left: margin, right: margin },
        styles: { 
          fontSize: 7, 
          cellPadding: 4,
          fillColor: [248, 249, 250]
        },
        columnStyles: {
          0: { fillColor: [248, 249, 250], fontStyle: 'bold', textColor: [127, 140, 141] },
          1: { fillColor: [255, 255, 255], textColor: [44, 62, 80] }
        }
      });
      
      yPosition = doc.lastAutoTable.finalY + 8;
    }
    
    // Add BUDGET ALLOCATION DETAILS section
    const itemsToExport = isAllAtOnceMode ? getConsolidatedBudgetItems() : budgetItems;
    
    if (itemsToExport.length > 0) {
      addRect(margin, yPosition, pageWidth - (2 * margin), 7, [52, 152, 219]);
      addText('BUDGET ALLOCATION DETAILS', margin + 5, yPosition + 5, { size: 9, style: 'bold', color: [255, 255, 255] });
      yPosition += 9;
      
      const tableData = itemsToExport.map((item, index) => {
        // Format the total cost with consistent padding for alignment
        const totalCost = parseFloat(item.totalCost).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
        const description = isAllAtOnceMode && item.commitmentType 
          ? `${item.itemDescription.substring(0, 40)} (${item.commitmentType})` 
          : item.itemDescription.substring(0, 50);
        
        return [
          item.itemCode,
          description,
          `FY ${item.startFY}/${item.startFY + 1}`,
          `FY ${item.endFY}/${item.endFY + 1}`,
          totalCost
        ];
      });

      autoTable(doc, {
        startY: yPosition,
        head: [['Item Code', 'Description', 'Start FY', 'End FY', 'Total Cost\n(UGX)']],
        body: tableData,
        margin: { top: 45, bottom: 30, left: margin, right: margin },
        styles: { fontSize: 7, cellPadding: 4 },
        headStyles: { 
          fillColor: [52, 73, 94], 
          textColor: [255, 255, 255], 
          fontStyle: 'bold',
          minCellHeight: 14,
          lineWidth: 0.5,
          lineColor: [255, 255, 255]
        },
        columnStyles: {
          4: { halign: 'right', font: 'courier' }
        },
        alternateRowStyles: { fillColor: [236, 240, 241] }
      });

      yPosition = doc.lastAutoTable.finalY + 8;
    }

    // Add ANNUAL ALLOCATION SUMMARY with percentages
    const yearTotals = {};
    itemsToExport.forEach(item => {
      Object.entries(item.annualBreakdown || {}).forEach(([year, amount]) => {
        yearTotals[year] = (yearTotals[year] || 0) + amount;
      });
    });

    if (Object.keys(yearTotals).length > 0) {
      addRect(margin, yPosition, pageWidth - (2 * margin), 7, [52, 152, 219]);
      addText('ANNUAL ALLOCATION SUMMARY', margin + 5, yPosition + 5, { size: 9, style: 'bold', color: [255, 255, 255] });
      yPosition += 9;

      const sortedYears = Object.keys(yearTotals).sort();
      const annualSummaryData = sortedYears.map(year => {
        const amount = yearTotals[year];
        const percentage = ((amount / totalValue) * 100).toFixed(1);
        return [
          `FY ${year}/${parseInt(year) + 1}`,
          `UGX ${amount.toLocaleString()}`,
          `${percentage.padStart(5, ' ')}%`
        ];
      });
      
      // Add total row
      annualSummaryData.push(['TOTAL', `UGX ${totalValue.toLocaleString()}`, '  100%']);

      autoTable(doc, {
        startY: yPosition,
        head: [['Fiscal Year', 'Allocated Amount', '% of Total']],
        body: annualSummaryData,
        margin: { top: 45, bottom: 30, left: margin, right: margin },
        styles: { 
          fontSize: 7,
          cellPadding: 4
        },
        headStyles: { 
          fillColor: [52, 73, 94], 
          textColor: [255, 255, 255], 
          fontStyle: 'bold',
          minCellHeight: 14,
          lineWidth: 0.5,
          lineColor: [255, 255, 255]
        },
        columnStyles: { 
          0: { halign: 'left' },
          1: { halign: 'left' },
          2: { halign: 'left' }
        },
        alternateRowStyles: { fillColor: [236, 240, 241] },
        didDrawCell: (data) => {
          // Draw green background and redraw text in white for total row
          if (data.row.index === annualSummaryData.length - 1) {
            // Draw green background first
            doc.setFillColor(39, 174, 96);
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
            
            // Draw white text on top
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'bold');
            
            // Get text content
            const textStr = Array.isArray(data.cell.text) ? data.cell.text.join(' ') : (data.cell.text || '').toString();
            
            // Calculate text position if textPos is not available
            const padding = 4;
            const textX = data.cell.textPos ? data.cell.textPos.x : data.cell.x + padding;
            const textY = data.cell.textPos ? data.cell.textPos.y : data.cell.y + (data.cell.height / 2) + 2;
            
            // Draw text with proper alignment
            if (data.cell.styles && data.cell.styles.halign === 'right') {
              doc.text(textStr, textX, textY, { align: 'right' });
            } else {
              doc.text(textStr, textX, textY, { align: 'left' });
            }
          }
        }
      });

      yPosition = doc.lastAutoTable.finalY + 8;
    }
    
    // Add JUSTIFICATION section
    if (formData.justification) {
      addRect(margin, yPosition, pageWidth - (2 * margin), 7, [52, 152, 219]);
      addText('JUSTIFICATION AND STRATEGIC ALIGNMENT', margin + 5, yPosition + 5, { size: 9, style: 'bold', color: [255, 255, 255] });
      yPosition += 12;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(52, 73, 94);
      const splitJustification = doc.splitTextToSize(formData.justification, pageWidth - (2 * margin));
      doc.text(splitJustification, margin, yPosition);
      yPosition += splitJustification.length * 4 + 10;
    }
    
    // Add AUTHORIZATION section (orange/beige styling)
    // addRect(margin, yPosition, pageWidth - (2 * margin), 7, [52, 152, 219]);
    // addText('AUTHORIZATION AND VERIFICATION', margin + 5, yPosition + 5, { size: 9, style: 'bold', color: [255, 255, 255] });
    // yPosition += 9;
    
    // const authData = [
    //   ['Document Status', 'Officially Generated and Recorded'],
    //   ['Generated By', 'Ministry of Finance, Planning and Economic Development - Budget Monitoring System'],
    //   ['Generation Date', new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) + ' at ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })],
    //   ['Document Reference', `MYC-${pbsData?.Vote_Name?.substring(0, 4).toUpperCase() || 'GOU'}-${pbsData?.Vote_Code || '000'}-001-${new Date().getFullYear()}`],
    //   ['Verification QR Code', 'Available upon request from MoFPED Budget Monitoring Unit']
    // ];
    
    // doc.autoTable({
    //   startY: yPosition,
    //   head: false,
    //   body: authData,
    //   margin: { top: 45, bottom: 30, left: margin, right: margin },
    //   styles: { 
    //     fontSize: 9, 
    //     cellPadding: 6,
    //     fillColor: [255, 249, 230],
    //     lineColor: [243, 156, 18], // Orange border
    //     lineWidth: 0.5
    //   },
    //   theme: 'grid',
    //   columnStyles: {
    //     0: { fillColor: [255, 249, 230], fontStyle: 'bold', textColor: [127, 140, 141] },
    //     1: { fillColor: [255, 249, 230], textColor: [44, 62, 80] }
    //   }
    // });
    
    // yPosition = doc.lastAutoTable.finalY + 8;
    
    // Add footer to all pages
    const pageCount = doc.internal.pages.length - 1;
    const docRef = `MYC-${pbsData?.Vote_Name?.substring(0, 4).toUpperCase() || 'GOU'}-${pbsData?.Vote_Code || '000'}-001-${new Date().getFullYear()}`;
    
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Draw Uganda flag colors at top of page
      addRect(0, 0, pageWidth, 3, [0, 0, 0]); // Black
      addRect(0, 3, pageWidth, 3, [252, 220, 4]); // Yellow  
      addRect(0, 6, pageWidth, 3, [217, 0, 0]); // Red
      
      // Add logo to the header (positioned at 15mm from left, at 11mm from top)
      try {
        doc.addImage(logo, 'PNG', 15, 11, 20, 20);
      } catch (e) {
        console.error('Error loading logo:', e);
      }
      
      // Redraw header on each page with fixed positions (not using yPosition)
      // Shift text to the right to make room for logo
      const textStart = 38; // 15mm (logo) + 23mm (spacing)
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(44, 62, 80);
      doc.text('REPUBLIC OF UGANDA', textStart, 20);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Ministry of Finance, Planning and Economic Development', textStart, 26);
      
      doc.setFontSize(8);
      doc.setTextColor(52, 152, 219);
      doc.text('Project Analysis & Public Investment Department (PAP)', textStart, 32);
      
      // Right side headers
      doc.setTextColor(44, 62, 80);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('MULTI-YEAR COMMITMENT', pageWidth - margin, 20, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('Official Document', pageWidth - margin, 26, { align: 'right' });
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7);
      doc.setTextColor(127, 140, 141);
      doc.text('To be Verified by: PAP', pageWidth - margin, 32, { align: 'right' });
      
      // Border line to separate header from content
      doc.setDrawColor(127, 140, 141);
      doc.setLineWidth(0.5);
      doc.line(margin, 35, pageWidth - margin, 35);
      
      // Footer line
      doc.setDrawColor(189, 195, 199);
      doc.setLineWidth(0.5);
      doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
      
      // Footer text
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(127, 140, 141);
      
      // Left - generation info
      const genDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
      const genTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      doc.text(
        `Generated: ${genDate}, ${genTime}`,
        margin,
        pageHeight - 15
      );
      
      // Center - page number
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        pageHeight - 15,
        { align: 'center' }
      );
      
      // Right - reference
      doc.text(
        `Ref: ${docRef}`,
        pageWidth - margin,
        pageHeight - 15,
        { align: 'right' }
      );
      
      // Confidentiality notice
      doc.setFontSize(7);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(149, 165, 166);
      doc.text(
        'FOR OFFICIAL USE - Government of Uganda',
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    // Save PDF
    const fileName = `MYC-${pbsData?.Vote_Name?.substring(0, 4).toUpperCase() || 'GOU'}-${pbsData?.Vote_Code || '000'}-001-${new Date().getFullYear()}.pdf`;
    doc.save(fileName);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again or contact support if the problem persists.');
    }
  };

  const populateReviewSummary = () => {
    let html = '';

    if (isAllAtOnceMode) {
      // Display all three commitment types
      html = `
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #2196F3;">
          <h3 style="color: #1565C0; margin: 0 0 10px 0;">📋 All Commitment Types Summary</h3>
          <p style="margin: 0; color: #1565C0; font-size: 14px;">You are submitting three different commitment types for this project.</p>
        </div>
        <div style="border-top: 2px solid #dee2e6; margin: 20px 0; padding-top: 20px;">
          <h4 style="color: #007bff; margin-bottom: 15px;">1. Contractual Commitment</h4>
      `;
      
      // Contractual details
      html += `
        <div class="summary-row">
          <span class="summary-label">Project Title:</span>
          <span class="summary-value">${formData.contractProjectTitle}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Contract Reference:</span>
          <span class="summary-value">${formData.contractReference}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Total Contract Value:</span>
          <span class="summary-value">UGX ${parseFloat(formData.totalContractValue || 0).toLocaleString()}</span>
        </div>
      `;
      
      html += `
        </div>
        <div style="border-top: 2px solid #dee2e6; margin: 20px 0; padding-top: 20px;">
          <h4 style="color: #007bff; margin-bottom: 15px;">2. Non-Contractual Commitment</h4>
      `;
      
      // Non-contractual details
      html += `
        <div class="summary-row">
          <span class="summary-label">Project Title:</span>
          <span class="summary-value">${formData.nonContractProjectTitle}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Nature of Obligation:</span>
          <span class="summary-value">${formData.obligationNature}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Estimated Total Value:</span>
          <span class="summary-value">UGX ${parseFloat(formData.estimatedTotalValue || 0).toLocaleString()}</span>
        </div>
      `;
      
      html += `
        </div>
        <div style="border-top: 2px solid #dee2e6; margin: 20px 0; padding-top: 20px;">
          <h4 style="color: #007bff; margin-bottom: 15px;">3. Counterpart Funding</h4>
      `;
      
      // Counterpart details
      html += `
        <div class="summary-row">
          <span class="summary-label">Project Title:</span>
          <span class="summary-value">${formData.counterpartProjectTitle}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">GoU Counterpart Value:</span>
          <span class="summary-value">UGX ${parseFloat(formData.gouCounterpartValue || 0).toLocaleString()}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Counterpart Percentage:</span>
          <span class="summary-value">${formData.counterpartPercentage}%</span>
        </div>
      `;
      
      html += `</div>`;
      
      return html;
    }

    if (selectedCommitmentType === 'contractual') {
      html = `
        <div class="summary-row">
          <span class="summary-label">Commitment Type:</span>
          <span class="summary-value">Contractual Commitment</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Project Title:</span>
          <span class="summary-value">${formData.contractProjectTitle}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Contract Reference:</span>
          <span class="summary-value">${formData.contractReference}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Supplier Name:</span>
          <span class="summary-value">${formData.supplierName}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Total Contract Value:</span>
          <span class="summary-value">UGX ${parseFloat(formData.totalContractValue).toLocaleString()}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Contract Start Date:</span>
          <span class="summary-value">${formData.contractStartDate}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Contract End Date:</span>
          <span class="summary-value">${formData.contractEndDate}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Funding Source:</span>
          <span class="summary-value">${formData.contractFundingSource}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Implementing Agency:</span>
          <span class="summary-value">${formData.implementingAgency}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Contract Description:</span>
          <span class="summary-value">${formData.contractDescription}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Procurement Category:</span>
          <span class="summary-value">${formData.procurementCategory}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Procurement Type:</span>
          <span class="summary-value">${formData.procurementType}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Project Classification:</span>
          <span class="summary-value">${formData.projectClassification}</span>
        </div>
        ${formData.annualPenaltyRate ? `
        <div class="summary-row">
          <span class="summary-label">Annual Penalty Rate:</span>
          <span class="summary-value">${formData.annualPenaltyRate}%</span>
        </div>
        ` : ''}
        ${formData.arrearsStartDate ? `
        <div class="summary-row">
          <span class="summary-label">Arrears Start Date:</span>
          <span class="summary-value">${formData.arrearsStartDate}</span>
        </div>
        ` : ''}
        ${formData.verifiedArrears && parseFloat(formData.verifiedArrears) > 0 ? `
        <div class="summary-row">
          <span class="summary-label">Verified Arrears:</span>
          <span class="summary-value">UGX ${parseFloat(formData.verifiedArrears).toLocaleString()}</span>
        </div>
        ` : ''}
        ${formData.unverifiedArrears && parseFloat(formData.unverifiedArrears) > 0 ? `
        <div class="summary-row">
          <span class="summary-label">Unverified Arrears:</span>
          <span class="summary-value">UGX ${parseFloat(formData.unverifiedArrears).toLocaleString()}</span>
        </div>
        ` : ''}
        ${formData.cumulativeArrears && parseFloat(formData.cumulativeArrears) > 0 ? `
        <div class="summary-row">
          <span class="summary-label">Cumulative Arrears:</span>
          <span class="summary-value">UGX ${parseFloat(formData.cumulativeArrears).toLocaleString()}</span>
        </div>
        ` : ''}
        ${formData.cumulativePenaltyExposure && parseFloat(formData.cumulativePenaltyExposure) > 0 ? `
        <div class="summary-row">
          <span class="summary-label">Cumulative Penalty Exposure:</span>
          <span class="summary-value">UGX ${parseFloat(formData.cumulativePenaltyExposure).toLocaleString()}</span>
        </div>
        ` : ''}
      `;
    } else if (selectedCommitmentType === 'non-contractual') {
      html = `
        <div class="summary-row">
          <span class="summary-label">Commitment Type:</span>
          <span class="summary-value">Non-Contractual Commitment</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Project Title:</span>
          <span class="summary-value">${formData.nonContractProjectTitle}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Nature of Obligation:</span>
          <span class="summary-value">${formData.obligationNature}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Policy Reference:</span>
          <span class="summary-value">${formData.policyReference}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Responsible Vote:</span>
          <span class="summary-value">${formData.responsibleVote}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Estimated Total Value:</span>
          <span class="summary-value">UGX ${parseFloat(formData.estimatedTotalValue).toLocaleString()}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Commitment Start Date:</span>
          <span class="summary-value">${formData.commitmentStartDate}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Commitment End Date:</span>
          <span class="summary-value">${formData.commitmentEndDate}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Funding Source:</span>
          <span class="summary-value">${formData.nonContractFundingSource}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Obligation Description:</span>
          <span class="summary-value">${formData.obligationDescription}</span>
        </div>
      `;
    } else if (selectedCommitmentType === 'counterpart') {
      html = `
        <div class="summary-row">
          <span class="summary-label">Commitment Type:</span>
          <span class="summary-value">Counterpart Funding</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Project Title:</span>
          <span class="summary-value">${formData.counterpartProjectTitle}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Donor Name:</span>
          <span class="summary-value">${formData.donorName}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Financing Agreement Reference:</span>
          <span class="summary-value">${formData.financingAgreementRef}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Total Project Value:</span>
          <span class="summary-value">UGX ${parseFloat(formData.totalProjectValue).toLocaleString()}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">GoU Counterpart Value:</span>
          <span class="summary-value">UGX ${parseFloat(formData.gouCounterpartValue).toLocaleString()}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Counterpart Percentage:</span>
          <span class="summary-value">${formData.counterpartPercentage}%</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Counterpart Funding Type:</span>
          <span class="summary-value">${formData.counterpartFundingType}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Implementing Agency:</span>
          <span class="summary-value">${formData.counterpartImplementingAgency}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Project Start Date:</span>
          <span class="summary-value">${formData.projectStartDate}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Project End Date:</span>
          <span class="summary-value">${formData.projectEndDate}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Project Description:</span>
          <span class="summary-value">${formData.counterpartDescription}</span>
        </div>
      `;
    }

    return html;
  };

  const getConsolidatedBudgetItems = () => {
    if (!isAllAtOnceMode) {
      return budgetItems;
    }
    
    const consolidated = [];
    if (allAtOnceBudgetItems.contractual) {
      consolidated.push(...allAtOnceBudgetItems.contractual.map(item => ({ ...item, commitmentType: 'Contractual' })));
    }
    if (allAtOnceBudgetItems['non-contractual']) {
      consolidated.push(...allAtOnceBudgetItems['non-contractual'].map(item => ({ ...item, commitmentType: 'Non-Contractual' })));
    }
    if (allAtOnceBudgetItems.counterpart) {
      consolidated.push(...allAtOnceBudgetItems.counterpart.map(item => ({ ...item, commitmentType: 'Counterpart' })));
    }
    
    return consolidated;
  };

  const renderBudgetItemsSummary = () => {
    const itemsToRender = getConsolidatedBudgetItems();
    
    if (itemsToRender.length === 0) return null;

    return (
      <div>
        <div className="summary-row" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #dee2e6' }}>
          <span className="summary-label">
            <strong>Budget Items Breakdown ({itemsToRender.length} items):</strong>
          </span>
        </div>
        {itemsToRender.map((item, index) => (
          <div key={`${item.id}-${index}`} style={{ background: '#f8f9fa', padding: '15px', borderRadius: '6px', margin: '10px 0', borderLeft: isAllAtOnceMode ? '4px solid #007bff' : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div>
                <strong style={{ color: '#007bff', fontSize: '16px' }}>
                  {item.itemCode}
                </strong>
                {isAllAtOnceMode && item.commitmentType && (
                  <span style={{ 
                    marginLeft: '10px', 
                    fontSize: '11px', 
                    padding: '2px 8px', 
                    background: '#007bff', 
                    color: 'white', 
                    borderRadius: '4px',
                    fontWeight: 'normal' 
                  }}>
                    {item.commitmentType}
                  </span>
                )}
                <div style={{ fontSize: '14px', color: '#495057', marginTop: '5px', fontWeight: '500' }}>
                  {item.itemDescription}
                </div>
              </div>
              <div style={{ textAlign: 'right', fontWeight: 'bold', color: '#28a745' }}>
                UGX {item.totalCost.toLocaleString()}
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#495057' }}>
              <strong>Duration:</strong> FY {item.startFY}/{item.startFY + 1} - {item.endFY}/{item.endFY + 1}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderAnnualSummary = () => {
    // Aggregate annual totals
    const itemsToProcess = getConsolidatedBudgetItems();
    const yearTotals = {};
    itemsToProcess.forEach(item => {
      Object.entries(item.annualBreakdown || {}).forEach(([year, amount]) => {
        yearTotals[year] = (yearTotals[year] || 0) + amount;
      });
    });

    if (Object.keys(yearTotals).length === 0) return null;

    return (
      <div>
        <div className="summary-row" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #dee2e6' }}>
          <span className="summary-label">
            <strong>Annual Allocation Summary:</strong>
          </span>
        </div>
        {Object.entries(yearTotals).sort().map(([year, amount]) => (
          <div key={year} className="summary-row">
            <span className="summary-label">FY {year}/{parseInt(year) + 1}:</span>
            <span className="summary-value">UGX {amount.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderJustificationAndNotes = () => {
    return (
      <div>
        {formData.justification && (
          <div>
            <div className="summary-row" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #dee2e6' }}>
              <span className="summary-label">
                <strong>Justification:</strong>
              </span>
            </div>
            <div style={{ 
              background: '#f8f9fa', 
              padding: '15px', 
              borderRadius: '6px', 
              margin: '10px 0',
              fontSize: '14px',
              lineHeight: '1.5',
              color: '#495057'
            }}>
              {formData.justification}
            </div>
          </div>
        )}
        
        {formData.additionalNotes && (
          <div>
            <div className="summary-row" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #dee2e6' }}>
              <span className="summary-label">
                <strong>Additional Notes:</strong>
              </span>
            </div>
            <div style={{ 
              background: '#f8f9fa', 
              padding: '15px', 
              borderRadius: '6px', 
              margin: '10px 0',
              fontSize: '14px',
              lineHeight: '1.5',
              color: '#495057'
            }}>
              {formData.additionalNotes}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="form-section active">
      <div className="section-header">
        <div className="section-icon">✅</div>
        <div className="section-title">
          <h2>Review & Submit</h2>
          <p>Review your submission and upload supporting documents</p>
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button 
          className="btn btn-outline-success" 
          onClick={handleExport}
          style={{ padding: '10px 20px', fontSize: '14px' }}
        >
          📥 Export as PDF
        </button>
      </div>

      <div className="summary-section">
        <h3>Submission Summary</h3>
        <div id="reviewSummary" dangerouslySetInnerHTML={{ __html: populateReviewSummary() }} />
        {renderBudgetItemsSummary()}
        {renderAnnualSummary()}
        {renderJustificationAndNotes()}
      </div>

      <div className="form-group full-width">
        <label>
          Supporting Documents <span className="required">*</span>
          {isAllAtOnceMode && uploadedFiles.length < 3 && (
            <span style={{ marginLeft: '10px', fontSize: '0.85em', color: '#dc3545', fontWeight: 'bold' }}>
              (Minimum {3 - uploadedFiles.length} more required)
            </span>
          )}
        </label>
        <div className="file-upload" onClick={() => fileInputRef.current?.click()}>
          <div className="file-upload-icon">📎</div>
          <div className="file-upload-text">Click to upload supporting documents</div>
          <div className="file-upload-hint">
            PDF, DOCX, XLSX (Max 10MB per file)
            {isAllAtOnceMode && uploadedFiles.length < 3 && ` - Minimum 3 documents required (${uploadedFiles.length}/3 uploaded)`}
            {isAllAtOnceMode && uploadedFiles.length >= 3 && ` - ✓ All documents uploaded`}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.xlsx,.xls"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
        <div className="file-list">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="file-item">
              <div className="file-info">
                <span className="file-icon">📄</span>
                <span className="file-name">
                  {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </span>
              </div>
              <span className="remove-file" onClick={() => removeFile(file.name)}>
                ✕
              </span>
            </div>
          ))}
        </div>
        {isAllAtOnceMode && (
          <div style={{ 
            marginTop: '10px', 
            padding: '8px 12px', 
            backgroundColor: uploadedFiles.length >= 3 ? '#d4edda' : '#fff3cd',
            border: `1px solid ${uploadedFiles.length >= 3 ? '#c3e6cb' : '#ffc107'}`,
            borderRadius: '4px',
            fontSize: '0.9em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>
              <strong>Progress:</strong> {uploadedFiles.length} of 3 documents uploaded
            </span>
            {uploadedFiles.length >= 3 && (
              <span style={{ color: '#155724', fontWeight: 'bold', marginLeft: '10px' }}>✓ Requirement Met</span>
            )}
          </div>
        )}
        {errors.files && (
          <div className="validation-message show">{errors.files}</div>
        )}
      </div>

      <div className="info-box">
        <p><strong>Required Documents:</strong></p>
        {isAllAtOnceMode ? (
          <div style={{ marginLeft: '20px', marginTop: '10px' }}>
            <p style={{ color: '#dc3545', fontWeight: 'bold', marginBottom: '10px' }}>
              Minimum 3 documents required (one evidence document for each commitment type):
            </p>
            <ul style={{ marginLeft: '20px', marginTop: '5px' }}>
              <li><strong>Contractual Commitment:</strong> Contract/Agreement, Approved payments documentation</li>
              <li><strong>Non-Contractual Commitment:</strong> Budget provision confirmation, MTEF ceiling, Authorization letter</li>
              <li><strong>Counterpart Funding:</strong> Financing agreement, GoU contribution commitment, Budget allocation</li>
            </ul>
            <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#495057' }}>
              <strong>Note:</strong> Additional documents may be required based on your specific commitment types.
            </p>
          </div>
        ) : (
          <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
            <li>Contract/Agreement copy (if applicable)</li>
            <li>Approved project document</li>
            <li>MTEF budget ceiling confirmation</li>
            <li>Authorization letter from Accounting Officer</li>
          </ul>
        )}
      </div>

      <div className="form-group full-width">
        <label htmlFor="additionalNotes">Additional Notes</label>
        <textarea
          id="additionalNotes"
          value={formData.additionalNotes}
          onChange={(e) => updateFormData('additionalNotes', e.target.value)}
          placeholder="Any additional information or special considerations"
        />
      </div>

      <div className="button-group">
        <button className="btn btn-secondary" onClick={prevStep}>
          ← Previous
        </button>
        <button className="btn btn-success" onClick={handleSubmitClick}>
          Submit for MoFPED Review ✓
        </button>
      </div>

      {/* Professional Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmationDialog}
        onConfirm={handleConfirmSubmit}
        onCancel={handleCancelSubmit}
        title="Submit for MoFPED Review"
        message="Submit this Multi-Year Commitment for MoFPED Review? This action cannot be undone."
        confirmText="Submit for Review"
        cancelText="Cancel"
        />
    </div>
  );
};

export default Step4;
