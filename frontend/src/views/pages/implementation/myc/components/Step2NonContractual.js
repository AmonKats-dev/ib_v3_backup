import React from 'react';

const Step2NonContractual = ({ formData, updateFormData, errors, nextStep, prevStep, isAllAtOnceMode, currentFormType, completedForms }) => {
  // Format number with commas for display
  const formatWithCommas = (value) => {
    if (!value || value === '') return '';
    const numericValue = value.toString().replace(/[^0-9]/g, '');
    if (numericValue === '') return '';
    return Number(numericValue).toLocaleString('en-US');
  };

  // Handle estimated total value input
  const handleEstimatedValueInput = (value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    updateFormData('estimatedTotalValue', numericValue);
  };

  return (
    <div className="form-section active">
      <div className="section-header">
        <div className="section-icon">📝</div>
        <div className="section-title">
          <h2>Non-Contractual Commitment Details</h2>
          <p>Enter information about policy-driven obligations</p>
        </div>
      </div>

      <div className="warning-box">
        <p>
          <strong>Note:</strong> Non-contractual commitments include policy obligations, statutory requirements, and recurring government responsibilities that extend beyond a single fiscal year.
        </p>
      </div>

      <div className="form-grid">
        <div className="form-group full-width">
          <label htmlFor="nonContractProjectTitle">
            Project/Program Title <span className="required">*</span>
            {/* {formData.nonContractProjectTitle && (
              <span style={{ fontSize: '12px', color: '#28a745', marginLeft: '8px' }}>
                ✓ Auto-populated from PBS (Read-only)
              </span>
            )} */}
          </label>
          <input
            type="text"
            id="nonContractProjectTitle"
            value={formData.nonContractProjectTitle}
            onChange={(e) => updateFormData('nonContractProjectTitle', e.target.value)}
            placeholder="Enter project or program title"
            className={errors.nonContractProjectTitle ? 'error' : ''}
            style={formData.nonContractProjectTitle ? { 
              backgroundColor: '#f8f9fa', 
              borderColor: '#6c757d',
              cursor: 'not-allowed'
            } : {}}
            readOnly={!!formData.nonContractProjectTitle}
          />
          {errors.nonContractProjectTitle && (
            <div className="validation-message show">{errors.nonContractProjectTitle}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="obligationNature">
            Nature of Obligation <span className="required">*</span>
          </label>
          <select
            id="obligationNature"
            value={formData.obligationNature}
            onChange={(e) => updateFormData('obligationNature', e.target.value)}
            className={errors.obligationNature ? 'error' : ''}
          >
            <option value="">-- Select Nature --</option>
            <option value="policy">Policy Commitment</option>
            <option value="statutory">Statutory Requirement</option>
            <option value="recurring">Recurring Government Obligation</option>
            <option value="grants">Grants and Subsidies</option>
            <option value="other">Other</option>
          </select>
          {errors.obligationNature && (
            <div className="validation-message show">{errors.obligationNature}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="policyReference">
            Policy/Legal Reference <span className="required">*</span>
          </label>
          <input
            type="text"
            id="policyReference"
            value={formData.policyReference}
            onChange={(e) => updateFormData('policyReference', e.target.value)}
            placeholder="e.g., Act No. XX/2024"
            className={errors.policyReference ? 'error' : ''}
          />
          {errors.policyReference && (
            <div className="validation-message show">{errors.policyReference}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="responsibleVote">
            Responsible Vote/MDA <span className="required">*</span>
            {/* {formData.responsibleVote && (
              <span style={{ fontSize: '12px', color: '#28a745', marginLeft: '8px' }}>
                ✓ Auto-populated from PBS (Read-only)
              </span>
            )} */}
          </label>
          <input
            type="text"
            id="responsibleVote"
            value={formData.responsibleVote}
            onChange={(e) => updateFormData('responsibleVote', e.target.value)}
            placeholder="Enter vote number or MDA"
            className={errors.responsibleVote ? 'error' : ''}
            style={formData.responsibleVote ? { 
              backgroundColor: '#f8f9fa', 
              borderColor: '#6c757d',
              cursor: 'not-allowed'
            } : {}}
            readOnly={!!formData.responsibleVote}
          />
          {errors.responsibleVote && (
            <div className="validation-message show">{errors.responsibleVote}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="estimatedTotalValue">
            Estimated Total Value (UGX) <span className="required">*</span>
          </label>
          <input
            type="text"
            id="estimatedTotalValue"
            value={formatWithCommas(formData.estimatedTotalValue)}
            onChange={(e) => handleEstimatedValueInput(e.target.value)}
            placeholder="0"
            className={errors.estimatedTotalValue ? 'error' : ''}
          />
          {errors.estimatedTotalValue && (
            <div className="validation-message show">{errors.estimatedTotalValue}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="commitmentStartDate">
            Commitment Start Date <span className="required">*</span>
          </label>
          <input
            type="date"
            id="commitmentStartDate"
            value={formData.commitmentStartDate}
            onChange={(e) => updateFormData('commitmentStartDate', e.target.value)}
            className={errors.commitmentStartDate ? 'error' : ''}
          />
          {errors.commitmentStartDate && (
            <div className="validation-message show">{errors.commitmentStartDate}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="commitmentEndDate">
            Commitment End Date <span className="required">*</span>
          </label>
          <input
            type="date"
            id="commitmentEndDate"
            value={formData.commitmentEndDate}
            onChange={(e) => updateFormData('commitmentEndDate', e.target.value)}
            className={errors.commitmentEndDate ? 'error' : ''}
          />
          {errors.commitmentEndDate && (
            <div className="validation-message show">{errors.commitmentEndDate}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="nonContractFundingSource">
            Primary Funding Source <span className="required">*</span>
          </label>
          <select
            id="nonContractFundingSource"
            value={formData.nonContractFundingSource}
            onChange={(e) => updateFormData('nonContractFundingSource', e.target.value)}
            className={errors.nonContractFundingSource ? 'error' : ''}
          >
            <option value="">-- Select Funding Source --</option>
            <option value="consolidated">Consolidated Fund</option>
            <option value="sector">Sector Budget</option>
            <option value="development">Development Budget</option>
            <option value="other">Other Sources</option>
          </select>
          {errors.nonContractFundingSource && (
            <div className="validation-message show">{errors.nonContractFundingSource}</div>
          )}
        </div>

        <div className="form-group full-width">
          <label htmlFor="obligationDescription">
            Detailed Description <span className="required">*</span>
          </label>
          <textarea
            id="obligationDescription"
            value={formData.obligationDescription}
            onChange={(e) => updateFormData('obligationDescription', e.target.value)}
            placeholder="Provide comprehensive details about the obligation, its justification, and expected outcomes"
            className={errors.obligationDescription ? 'error' : ''}
          />
          {errors.obligationDescription && (
            <div className="validation-message show">{errors.obligationDescription}</div>
          )}
        </div>
      </div>

      <div className="button-group">
        <button className="btn btn-secondary" onClick={prevStep}>
          ← Previous
        </button>
        <button className="btn btn-primary" onClick={nextStep}>
          {isAllAtOnceMode && currentFormType === 'counterpart' ? 'Next Step →' : 
           isAllAtOnceMode ? 'Next Form →' : 'Next Step →'}
        </button>
      </div>
    </div>
  );
};

export default Step2NonContractual;
