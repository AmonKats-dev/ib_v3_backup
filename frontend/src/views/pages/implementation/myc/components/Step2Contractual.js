import React, { useState, useEffect } from 'react';

// Procurement Categories (aligned with PPDA Uganda)
const procurementCategories = {
  works: {
    name: 'Works',
    description: 'Construction, rehabilitation, installation, and related activities',
    types: [
      'Civil Works - Buildings',
      'Civil Works - Roads and Bridges',
      'Civil Works - Water and Sanitation',
      'Electrical Works',
      'Mechanical Works',
      'Rehabilitation Works',
      'Installation Works'
    ]
  },
  goods: {
    name: 'Goods',
    description: 'Purchase or lease of equipment, materials, and supplies',
    types: [
      'ICT Equipment and Software',
      'Medical Equipment and Supplies',
      'Office Equipment and Furniture',
      'Vehicles and Transport Equipment',
      'Machinery and Tools',
      'Agricultural Equipment',
      'Security Equipment',
      'General Supplies'
    ]
  },
  services: {
    name: 'Services',
    description: 'Non-consulting and consulting services',
    types: [
      'Consultancy Services - Technical',
      'Consultancy Services - Financial',
      'Consultancy Services - Management',
      'Audit Services',
      'Legal Services',
      'Training Services',
      'Maintenance Services',
      'Security Services',
      'Transport Services',
      'Cleaning Services'
    ]
  },
  nonConsulting: {
    name: 'Non-Consulting Services',
    description: 'Services not requiring specialized expertise',
    types: [
      'Transportation Services',
      'Catering Services',
      'Security Services',
      'Cleaning and Janitorial Services',
      'Advertising and Media Services',
      'Printing and Publishing'
    ]
  }
};

// Project Classifications (aligned with Uganda's development framework)
const projectClassifications = [
  {
    value: 'institutional-development',
    label: 'Institutional Development',
    description: 'Projects focused on strengthening organizational capacity, governance systems, policy frameworks, and institutional capabilities'
  },
  {
    value: 'infrastructure',
    label: 'Infrastructure',
    description: 'Physical infrastructure projects including roads, buildings, energy, water, ICT, and other capital works'
  },
  {
    value: 'social-investments',
    label: 'Social Investments',
    description: 'Projects targeting social welfare, community development, health, education, and human capital development'
  },
  {
    value: 'studies',
    label: 'Studies',
    description: 'Feasibility studies, research, assessments, surveys, and other analytical or investigative activities'
  }
];

const Step2Contractual = ({ formData, updateFormData, errors, nextStep, prevStep, isAllAtOnceMode, currentFormType, completedForms }) => {
  const [selectedProcurementCategory, setSelectedProcurementCategory] = useState('');
  const [availableProcurementTypes, setAvailableProcurementTypes] = useState([]);

  // Calculate cumulative arrears and penalty exposure automatically
  const calculateArrearsMetrics = () => {
    const verified = parseFloat(formData.verifiedArrears) || 0;
    const unverified = parseFloat(formData.unverifiedArrears) || 0;
    const cumulative = verified + unverified;
    
    // Calculate penalty exposure if start date and rate are provided
    let penaltyExposure = 0;
    if (formData.arrearsStartDate && formData.annualPenaltyRate) {
      const startDate = new Date(formData.arrearsStartDate);
      const today = new Date();
      const monthsElapsed = (today.getFullYear() - startDate.getFullYear()) * 12 + 
                           (today.getMonth() - startDate.getMonth());
      const yearsElapsed = monthsElapsed / 12;
      const rate = parseFloat(formData.annualPenaltyRate) / 100;
      penaltyExposure = cumulative * rate * yearsElapsed;
    }

    updateFormData('cumulativeArrears', cumulative.toFixed(2));
    updateFormData('cumulativePenaltyExposure', penaltyExposure.toFixed(2));
  };

  const handleProcurementCategoryChange = (category) => {
    setSelectedProcurementCategory(category);
    setAvailableProcurementTypes(category ? procurementCategories[category].types : []);
    updateFormData('procurementCategory', category);
    updateFormData('procurementType', '');
  };

  // Format number with commas and handle input
  const handleArrearsInput = (fieldName, value) => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');
    // Store the numeric value
    updateFormData(fieldName, numericValue);
  };

  // Get formatted display value with commas
  const getFormattedValue = (value) => {
    if (!value || value === '') return '';
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue === '') return '';
    return Number(numericValue).toLocaleString('en-US');
  };

  // Handle annual penalty rate input - restrict to 3 digits
  const handlePenaltyRateInput = (value) => {
    // Remove all non-numeric characters
    let numericValue = value.replace(/[^0-9]/g, '');
    // Restrict to maximum 3 digits
    if (numericValue.length > 3) {
      numericValue = numericValue.substring(0, 3);
    }
    updateFormData('annualPenaltyRate', numericValue);
  };

  // Auto-populate arrears start date from contract start date
  // Only update if contractStartDate has a value and arrearsStartDate is empty or different
  useEffect(() => {
    if (formData.contractStartDate && formData.contractStartDate !== formData.arrearsStartDate) {
      updateFormData('arrearsStartDate', formData.contractStartDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.contractStartDate]); // updateFormData is memoized with useCallback, so it's stable

  return (
    <div className="form-section active">
      <div className="section-header">
        <div className="section-icon">📄</div>
        <div className="section-title">
          <h2>Contractual Commitment Details</h2>
          <p>Enter comprehensive information about the contract</p>
        </div>
      </div>

      {/* Basic Contract Information */}
      <div style={{marginBottom: '30px'}}>
        <h3 style={{fontSize: '18px', color: '#1a1a2e', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px'}}>
          📋 Basic Contract Information
        </h3>
        <div className="form-grid">
          <div className="form-group full-width">
            <label htmlFor="contractProjectTitle">
              Project Title <span className="required">*</span>
              {/* {formData.contractProjectTitle && (
                <span style={{ fontSize: '12px', color: '#28a745', marginLeft: '8px' }}>
                  ✓ Auto-populated from PBS (Read-only)
                </span>
              )} */}
            </label>
            <input
              type="text"
              id="contractProjectTitle"
              value={formData.contractProjectTitle}
              onChange={(e) => updateFormData('contractProjectTitle', e.target.value)}
              placeholder="Enter project title"
              className={errors.contractProjectTitle ? 'error' : ''}
              style={formData.contractProjectTitle ? { 
                backgroundColor: '#f8f9fa', 
                borderColor: '#6c757d',
                cursor: 'not-allowed'
              } : {}}
              readOnly={!!formData.contractProjectTitle}
            />
            {errors.contractProjectTitle && (
              <div className="validation-message show">{errors.contractProjectTitle}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="contractReference">
              Contract Reference Number <span className="required">*</span>
            </label>
            <input
              type="text"
              id="contractReference"
              value={formData.contractReference}
              onChange={(e) => updateFormData('contractReference', e.target.value)}
              placeholder="e.g., CON/2024/001"
              className={errors.contractReference ? 'error' : ''}
            />
            {errors.contractReference && (
              <div className="validation-message show">{errors.contractReference}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="supplierName">
              Supplier/Contractor Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="supplierName"
              value={formData.supplierName}
              onChange={(e) => updateFormData('supplierName', e.target.value)}
              placeholder="Enter supplier name"
              className={errors.supplierName ? 'error' : ''}
            />
            {errors.supplierName && (
              <div className="validation-message show">{errors.supplierName}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="totalContractValue">
              Total Contract Value (UGX) <span className="required">*</span>
            </label>
            <input
              type="text"
              id="totalContractValue"
              value={getFormattedValue(formData.totalContractValue)}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/[^0-9]/g, '');
                updateFormData('totalContractValue', numericValue);
              }}
              placeholder="0"
              className={errors.totalContractValue ? 'error' : ''}
            />
            {errors.totalContractValue && (
              <div className="validation-message show">{errors.totalContractValue}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="contractStartDate">
              Contract Start Date <span className="required">*</span>
            </label>
            <input
              type="date"
              id="contractStartDate"
              value={formData.contractStartDate}
              onChange={(e) => updateFormData('contractStartDate', e.target.value)}
              className={errors.contractStartDate ? 'error' : ''}
            />
            {errors.contractStartDate && (
              <div className="validation-message show">{errors.contractStartDate}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="contractEndDate">
              Contract End Date <span className="required">*</span>
            </label>
            <input
              type="date"
              id="contractEndDate"
              value={formData.contractEndDate}
              onChange={(e) => updateFormData('contractEndDate', e.target.value)}
              className={errors.contractEndDate ? 'error' : ''}
            />
            {errors.contractEndDate && (
              <div className="validation-message show">{errors.contractEndDate}</div>
            )}
          </div>
        </div>

        {/* Contract Description */}
        <div className="form-group">
          <label htmlFor="contractDescription">
            Detailed Contract Description <span className="required">*</span>
          </label>
          <textarea
            id="contractDescription"
            value={formData.contractDescription}
            onChange={(e) => updateFormData('contractDescription', e.target.value)}
            placeholder="Provide a comprehensive description including:&#10;- Scope of work/deliverables&#10;- Key milestones&#10;- Quality standards&#10;- Reporting requirements&#10;- Any special conditions"
            className={errors.contractDescription ? 'error' : ''}
            style={{minHeight: '120px', resize: 'vertical'}}
          />
          {errors.contractDescription && (
            <div className="validation-message show">{errors.contractDescription}</div>
          )}
        </div>
      </div>

      {/* Procurement Classification */}
      <div style={{marginBottom: '30px'}}>
        <h3 style={{fontSize: '18px', color: '#1a1a2e', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px'}}>
          🏷️ Procurement Classification
        </h3>
        <div className="info-box" style={{background: '#e8f5e9', borderLeftColor: '#4caf50', marginBottom: '20px'}}>
          <p><strong>PPDA Compliance:</strong> Classify the procurement according to PPDA Act 2003 and Regulations 2014.</p>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="procurementCategory">
              Category of Procurement <span className="required">*</span>
            </label>
            <select
              id="procurementCategory"
              value={formData.procurementCategory || ''}
              onChange={(e) => handleProcurementCategoryChange(e.target.value)}
              className={errors.procurementCategory ? 'error' : ''}
            >
              <option value="">-- Select Category --</option>
              <option value="works">Works</option>
              <option value="goods">Goods</option>
              <option value="services">Consulting Services</option>
              <option value="nonConsulting">Non-Consulting Services</option>
            </select>
            {errors.procurementCategory && (
              <div className="validation-message show">{errors.procurementCategory}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="procurementType">
              Type of Procurement <span className="required">*</span>
            </label>
            <select
              id="procurementType"
              value={formData.procurementType || ''}
              onChange={(e) => updateFormData('procurementType', e.target.value)}
              disabled={!selectedProcurementCategory}
              className={errors.procurementType ? 'error' : ''}
            >
              <option value="">-- Select Type --</option>
              {availableProcurementTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.procurementType && (
              <div className="validation-message show">{errors.procurementType}</div>
            )}
          </div>

          {selectedProcurementCategory && (
            <div className="form-group full-width">
              <div style={{background: '#f0f4ff', padding: '12px', borderRadius: '6px', borderLeft: '4px solid #667eea'}}>
                <strong style={{color: '#667eea'}}>Category Description:</strong>
                <p style={{margin: '5px 0 0 0', color: '#2c3e50', fontSize: '14px'}}>
                  {procurementCategories[selectedProcurementCategory].description}
                </p>
              </div>
            </div>
          )}

          <div className="form-group full-width">
            <label htmlFor="projectClassification">
              Project Classification <span className="required">*</span>
            </label>
            <select
              id="projectClassification"
              value={formData.projectClassification || ''}
              onChange={(e) => updateFormData('projectClassification', e.target.value)}
              className={errors.projectClassification ? 'error' : ''}
            >
              <option value="">-- Select Project Classification --</option>
              {projectClassifications.map(classification => (
                <option key={classification.value} value={classification.value}>
                  {classification.label}
                </option>
              ))}
            </select>
            {errors.projectClassification && (
              <div className="validation-message show">{errors.projectClassification}</div>
            )}
          </div>

          {formData.projectClassification && (
            <div className="form-group full-width">
              <div style={{background: '#fff3e0', padding: '12px', borderRadius: '6px', borderLeft: '4px solid #ff9800'}}>
                <strong style={{color: '#e65100'}}>Classification:</strong>
                <p style={{margin: '5px 0 0 0', color: '#2c3e50', fontSize: '14px'}}>
                  {projectClassifications.find(c => c.value === formData.projectClassification)?.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Funding & Implementation */}
      <div style={{marginBottom: '30px'}}>
        <h3 style={{fontSize: '18px', color: '#1a1a2e', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px'}}>
          💰 Funding & Implementation
        </h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="contractFundingSource">
              Primary Funding Source <span className="required">*</span>
            </label>
            <select
              id="contractFundingSource"
              value={formData.contractFundingSource}
              onChange={(e) => updateFormData('contractFundingSource', e.target.value)}
              className={errors.contractFundingSource ? 'error' : ''}
            >
              <option value="">-- Select Funding Source --</option>
              <option value="gou">Government of Uganda (GoU)</option>
              <option value="donor">Donor Funded</option>
              <option value="loan">Loan/Credit</option>
              <option value="ppp">Public-Private Partnership</option>
              <option value="mixed">Mixed Financing</option>
            </select>
            {errors.contractFundingSource && (
              <div className="validation-message show">{errors.contractFundingSource}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="implementingAgency">
              Responsible Vote/MDA <span className="required">*</span>
              {/* {formData.implementingAgency && (
                <span style={{ fontSize: '12px', color: '#28a745', marginLeft: '8px' }}>
                  ✓ Auto-populated from PBS (Read-only)
                </span>
              )} */}
            </label>
            <input
              type="text"
              id="implementingAgency"
              value={formData.implementingAgency}
              onChange={(e) => updateFormData('implementingAgency', e.target.value)}
              placeholder="Enter MDA name"
              className={errors.implementingAgency ? 'error' : ''}
              style={formData.implementingAgency ? { 
                backgroundColor: '#f8f9fa', 
                borderColor: '#6c757d',
                cursor: 'not-allowed'
              } : {}}
              readOnly={!!formData.implementingAgency}
            />
            {errors.implementingAgency && (
              <div className="validation-message show">{errors.implementingAgency}</div>
            )}
          </div>
        </div>
      </div>

      {/* Arrears Tracking & Penalty Management */}
      <div style={{marginBottom: '30px'}}>
        <h3 style={{fontSize: '18px', color: '#1a1a2e', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px'}}>
          ⚠️ Arrears Tracking & Penalty Management
        </h3>
        <div className="warning-box" style={{marginBottom: '20px'}}>
          <p><strong>Arrears Management:</strong> Track outstanding obligations and calculate penalty exposure as per contract terms. Leave fields at zero if no arrears exist.</p>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="annualPenaltyRate">
              Annual Penalty Interest Rate (%)
              <span style={{fontSize: '12px', color: '#6c757d', fontWeight: 'normal', marginLeft: '5px'}}>
                (as per contract)
              </span>
            </label>
            <input
              type="text"
              id="annualPenaltyRate"
              value={formData.annualPenaltyRate || ''}
              onChange={(e) => handlePenaltyRateInput(e.target.value)}
              placeholder="e.g 10%"
              maxLength={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="arrearsStartDate">
              Arrears Accumulation Start Date
              <span style={{fontSize: '12px', color: '#6c757d', fontWeight: 'normal', marginLeft: '5px'}}>
                {/* (auto-populated from contract start date) */}
              </span>
            </label>
            <input
              type="date"
              id="arrearsStartDate"
              value={formData.arrearsStartDate || ''}
              readOnly
              style={{background: '#f8f9fa', borderColor: '#6c757d', cursor: 'not-allowed'}}
            />
          </div>

          <div className="form-group">
            <label htmlFor="verifiedArrears">
              Verified Arrears (UGX)
              <span style={{fontSize: '12px', color: '#6c757d', fontWeight: 'normal', marginLeft: '5px'}}>
                (confirmed obligations)
              </span>
            </label>
            <input
              type="text"
              id="verifiedArrears"
              value={getFormattedValue(formData.verifiedArrears)}
              onChange={(e) => handleArrearsInput('verifiedArrears', e.target.value)}
              onBlur={calculateArrearsMetrics}
              placeholder="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="unverifiedArrears">
              Un-verified Arrears (UGX)
              <span style={{fontSize: '12px', color: '#6c757d', fontWeight: 'normal', marginLeft: '5px'}}>
                (disputed/pending)
              </span>
            </label>
            <input
              type="text"
              id="unverifiedArrears"
              value={getFormattedValue(formData.unverifiedArrears)}
              onChange={(e) => handleArrearsInput('unverifiedArrears', e.target.value)}
              onBlur={calculateArrearsMetrics}
              placeholder="0"
            />
          </div>

          {/* Auto-calculated fields */}
          <div className="form-group">
            <label htmlFor="cumulativeArrears">
              Cumulative Arrears (UGX)
              <span style={{fontSize: '12px', color: '#667eea', fontWeight: 'normal', marginLeft: '5px'}}>
                (auto-calculated)
              </span>
            </label>
            <input
              type="text"
              id="cumulativeArrears"
              value={parseFloat(formData.cumulativeArrears || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}
              readOnly
              style={{background: '#f8f9fa', fontWeight: '600', color: '#dc3545'}}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cumulativePenaltyExposure">
              Cumulative Penalty Exposure (UGX)
              <span style={{fontSize: '12px', color: '#667eea', fontWeight: 'normal', marginLeft: '5px'}}>
                (auto-calculated)
              </span>
            </label>
            <input
              type="text"
              id="cumulativePenaltyExposure"
              value={parseFloat(formData.cumulativePenaltyExposure || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}
              readOnly
              style={{background: '#f8f9fa', fontWeight: '600', color: '#dc3545'}}
            />
          </div>

          {/* Arrears Summary Card */}
          {(parseFloat(formData.cumulativeArrears || 0) > 0 || parseFloat(formData.cumulativePenaltyExposure || 0) > 0) && (
            <div className="form-group full-width">
              <div style={{
                background: 'linear-gradient(135deg, #fff5f5 0%, #ffe0e0 100%)',
                padding: '20px',
                borderRadius: '8px',
                border: '2px solid #dc3545'
              }}>
                <h4 style={{color: '#dc3545', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <span style={{fontSize: '24px'}}>⚠️</span>
                  Arrears Summary
                </h4>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px'}}>
                  <div>
                    <div style={{fontSize: '12px', color: '#721c24', marginBottom: '5px'}}>Total Outstanding</div>
                    <div style={{fontSize: '20px', fontWeight: 'bold', color: '#dc3545'}}>
                      UGX {parseFloat(formData.cumulativeArrears || 0).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div style={{fontSize: '12px', color: '#721c24', marginBottom: '5px'}}>Penalty Exposure</div>
                    <div style={{fontSize: '20px', fontWeight: 'bold', color: '#dc3545'}}>
                      UGX {parseFloat(formData.cumulativePenaltyExposure || 0).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div style={{fontSize: '12px', color: '#721c24', marginBottom: '5px'}}>Total Liability</div>
                    <div style={{fontSize: '20px', fontWeight: 'bold', color: '#dc3545'}}>
                      UGX {(parseFloat(formData.cumulativeArrears || 0) + parseFloat(formData.cumulativePenaltyExposure || 0)).toLocaleString()}
                    </div>
                  </div>
                </div>
                {formData.arrearsStartDate && (
                  <div style={{marginTop: '15px', fontSize: '13px', color: '#721c24'}}>
                    <strong>Arrears Period:</strong> {formData.arrearsStartDate} to {new Date().toISOString().split('T')[0]}
                    {formData.annualPenaltyRate && ` | Interest Rate: ${formData.annualPenaltyRate}% p.a.`}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="button-group">
        <button className="btn btn-secondary" onClick={prevStep}>
          ← Previous
        </button>
        <button className="btn btn-primary" onClick={nextStep}>
          {isAllAtOnceMode && currentFormType === 'contractual' ? 'Next Form →' : 
           isAllAtOnceMode ? 'Next Form →' : 'Next Step →'}
        </button>
      </div>
    </div>
  );
};

export default Step2Contractual;
