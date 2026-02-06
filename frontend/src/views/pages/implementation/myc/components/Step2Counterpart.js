import React, { useEffect } from 'react';

const Step2Counterpart = ({ formData, updateFormData, errors, nextStep, prevStep, isAllAtOnceMode, currentFormType, completedForms }) => {
  // Format number with commas for display
  const formatWithCommas = (value) => {
    if (!value || value === '') return '';
    const numericValue = value.toString().replace(/[^0-9]/g, '');
    if (numericValue === '') return '';
    return Number(numericValue).toLocaleString('en-US');
  };

  // Handle project value input
  const handleProjectValueInput = (value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    updateFormData('totalProjectValue', numericValue);
  };

  // Handle GoU counterpart value input
  const handleCounterpartValueInput = (value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    updateFormData('gouCounterpartValue', numericValue);
  };

  const calculateCounterpartPercentage = () => {
    const total = parseFloat(formData.totalProjectValue) || 0;
    const counterpart = parseFloat(formData.gouCounterpartValue) || 0;
    
    if (total > 0) {
      const percentage = (counterpart / total * 100).toFixed(2);
      updateFormData('counterpartPercentage', percentage);
    }
  };

  useEffect(() => {
    calculateCounterpartPercentage();
  }, [formData.totalProjectValue, formData.gouCounterpartValue]);

  return (
    <div className="form-section active">
      <div className="section-header">
        <div className="section-icon">🤝</div>
        <div className="section-title">
          <h2>Counterpart Funding Details</h2>
          <p>Enter donor project and GoU contribution information</p>
        </div>
      </div>

      <div className="info-box">
        <p>
          <strong>Guidance:</strong> Counterpart funding represents the Government of Uganda's financial contribution to donor-funded projects as specified in financing agreements.
        </p>
      </div>

      <div className="form-grid">
        <div className="form-group full-width">
          <label htmlFor="counterpartProjectTitle">
            Project Title <span className="required">*</span>
            {/* {formData.counterpartProjectTitle && (
              <span style={{ fontSize: '12px', color: '#28a745', marginLeft: '8px' }}>
                ✓ Auto-populated from PBS (Read-only)
              </span>
            )} */}
          </label>
          <input
            type="text"
            id="counterpartProjectTitle"
            value={formData.counterpartProjectTitle}
            onChange={(e) => updateFormData('counterpartProjectTitle', e.target.value)}
            placeholder="Enter donor project title"
            className={errors.counterpartProjectTitle ? 'error' : ''}
            style={formData.counterpartProjectTitle ? { 
              backgroundColor: '#f8f9fa', 
              borderColor: '#6c757d',
              cursor: 'not-allowed'
            } : {}}
            readOnly={!!formData.counterpartProjectTitle}
          />
          {errors.counterpartProjectTitle && (
            <div className="validation-message show">{errors.counterpartProjectTitle}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="donorName">
            Donor/Development Partner <span className="required">*</span>
          </label>
          <select
            id="donorName"
            value={formData.donorName}
            onChange={(e) => updateFormData('donorName', e.target.value)}
            className={errors.donorName ? 'error' : ''}
          >
            <option value="">-- Select Donor --</option>
            <option value="world-bank">World Bank</option>
            <option value="adb">African Development Bank</option>
            <option value="eu">European Union</option>
            <option value="dfid">FCDO (UK)</option>
            <option value="usaid">USAID</option>
            <option value="jica">JICA (Japan)</option>
            <option value="kfw">KfW (Germany)</option>
            <option value="un">UN Agency</option>
            <option value="other">Other</option>
          </select>
          {errors.donorName && (
            <div className="validation-message show">{errors.donorName}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="financingAgreementRef">
            Financing Agreement Reference <span className="required">*</span>
          </label>
          <input
            type="text"
            id="financingAgreementRef"
            value={formData.financingAgreementRef}
            onChange={(e) => updateFormData('financingAgreementRef', e.target.value)}
            placeholder="e.g., IDA-12345-UG"
            className={errors.financingAgreementRef ? 'error' : ''}
          />
          {errors.financingAgreementRef && (
            <div className="validation-message show">{errors.financingAgreementRef}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="totalProjectValue">
            Total Project Value (UGX) <span className="required">*</span>
          </label>
          <input
            type="text"
            id="totalProjectValue"
            value={formatWithCommas(formData.totalProjectValue)}
            onChange={(e) => handleProjectValueInput(e.target.value)}
            placeholder="0"
            className={errors.totalProjectValue ? 'error' : ''}
          />
          {errors.totalProjectValue && (
            <div className="validation-message show">{errors.totalProjectValue}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="gouCounterpartValue">
            GoU Counterpart Value (UGX) <span className="required">*</span>
          </label>
          <input
            type="text"
            id="gouCounterpartValue"
            value={formatWithCommas(formData.gouCounterpartValue)}
            onChange={(e) => handleCounterpartValueInput(e.target.value)}
            placeholder="0"
            className={errors.gouCounterpartValue ? 'error' : ''}
          />
          {errors.gouCounterpartValue && (
            <div className="validation-message show">{errors.gouCounterpartValue}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="counterpartPercentage">
            Counterpart Percentage (%)
          </label>
          <input
            type="number"
            id="counterpartPercentage"
            value={formData.counterpartPercentage}
            placeholder="0.00"
            step="0.01"
            readOnly
          />
        </div>

        <div className="form-group">
          <label htmlFor="counterpartFundingType">
            Counterpart Funding Type <span className="required">*</span>
          </label>
          <select
            id="counterpartFundingType"
            value={formData.counterpartFundingType}
            onChange={(e) => updateFormData('counterpartFundingType', e.target.value)}
            className={errors.counterpartFundingType ? 'error' : ''}
          >
            <option value="">-- Select Type --</option>
            <option value="cash">Cash Contribution</option>
            <option value="in-kind">In-Kind Contribution</option>
            <option value="mixed">Mixed (Cash + In-Kind)</option>
          </select>
          {errors.counterpartFundingType && (
            <div className="validation-message show">{errors.counterpartFundingType}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="counterpartImplementingAgency">
            Implementation Agency <span className="required">*</span>
            {/* {formData.counterpartImplementingAgency && (
              <span style={{ fontSize: '12px', color: '#28a745', marginLeft: '8px' }}>
                ✓ Auto-populated from PBS (Read-only)
              </span>
            )} */}
          </label>
          <input
            type="text"
            id="counterpartImplementingAgency"
            value={formData.counterpartImplementingAgency}
            onChange={(e) => updateFormData('counterpartImplementingAgency', e.target.value)}
            placeholder="Enter implementing MDA"
            className={errors.counterpartImplementingAgency ? 'error' : ''}
            style={formData.counterpartImplementingAgency ? { 
              backgroundColor: '#f8f9fa', 
              borderColor: '#6c757d',
              cursor: 'not-allowed'
            } : {}}
            readOnly={!!formData.counterpartImplementingAgency}
          />
          {errors.counterpartImplementingAgency && (
            <div className="validation-message show">{errors.counterpartImplementingAgency}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="projectStartDate">
            Project Start Date <span className="required">*</span>
          </label>
          <input
            type="date"
            id="projectStartDate"
            value={formData.projectStartDate}
            onChange={(e) => updateFormData('projectStartDate', e.target.value)}
            className={errors.projectStartDate ? 'error' : ''}
          />
          {errors.projectStartDate && (
            <div className="validation-message show">{errors.projectStartDate}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="projectEndDate">
            Project End Date <span className="required">*</span>
          </label>
          <input
            type="date"
            id="projectEndDate"
            value={formData.projectEndDate}
            onChange={(e) => updateFormData('projectEndDate', e.target.value)}
            className={errors.projectEndDate ? 'error' : ''}
          />
          {errors.projectEndDate && (
            <div className="validation-message show">{errors.projectEndDate}</div>
          )}
        </div>

        <div className="form-group full-width">
          <label htmlFor="counterpartDescription">
            Project Description & Counterpart Justification <span className="required">*</span>
          </label>
          <textarea
            id="counterpartDescription"
            value={formData.counterpartDescription}
            onChange={(e) => updateFormData('counterpartDescription', e.target.value)}
            placeholder="Describe the project and justify the GoU counterpart contribution"
            className={errors.counterpartDescription ? 'error' : ''}
          />
          {errors.counterpartDescription && (
            <div className="validation-message show">{errors.counterpartDescription}</div>
          )}
        </div>
      </div>

      <div className="button-group">
        <button className="btn btn-secondary" onClick={prevStep}>
          ← Previous
        </button>
        <button className="btn btn-primary" onClick={nextStep}>
          {isAllAtOnceMode ? 'Next Step →' : 'Next Step →'}
        </button>
      </div>
    </div>
  );
};

export default Step2Counterpart;
