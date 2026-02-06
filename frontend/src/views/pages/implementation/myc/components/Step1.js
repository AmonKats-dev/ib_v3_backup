import React from 'react';

const Step1 = ({ formData, updateFormData, errors, nextStep, resetForm }) => {
  const typeDescriptions = {
    contractual: {
      title: 'Contractual Commitment',
      description: 'A legally binding agreement with a supplier or contractor for delivery of goods, works, or services over multiple fiscal years. This includes construction contracts, procurement agreements, and service contracts with defined terms and payment schedules.',
      examples: 'Road construction contracts, IT system development agreements, equipment supply contracts'
    },
    'non-contractual': {
      title: 'Non-Contractual Commitment',
      description: 'Government obligations arising from policy decisions, statutory requirements, or recurring responsibilities that are not tied to specific contracts. These include ongoing programs, subsidies, grants, and policy-driven expenditures.',
      examples: 'Education scholarship programs, agricultural subsidies, social protection transfers, statutory obligations'
    },
    counterpart: {
      title: 'Counterpart Funding',
      description: 'Government of Uganda\'s financial contribution to donor-funded or co-financed projects as specified in financing agreements. This represents GoU\'s commitment to match or complement external funding sources.',
      examples: 'World Bank project counterpart funding, EU grant matching funds, bilateral cooperation contributions'
    },
    'all-at-once': {
      title: 'Submit All Commitment Types',
      description: 'Fill out and submit all three commitment types (Contractual, Non-Contractual, and Counterpart Funding) in a single workflow. You will be guided through each form sequentially to complete all submissions at once.',
      examples: 'Use this option when you need to submit multiple commitment types for the same project simultaneously'
    }
  };

  const handleCommitmentTypeChange = (value) => {
    updateFormData('commitmentType', value);
  };

  const renderTypeDescription = () => {
    if (!formData.commitmentType) return null;
    
    const desc = typeDescriptions[formData.commitmentType];
    return (
      <div className="info-box" style={{ background: '#f0f8ff', borderLeftColor: '#2196f3' }}>
        <h3 style={{ marginBottom: '10px', color: '#1a1a2e' }}>{desc.title}</h3>
        <p style={{ marginBottom: '10px' }}>
          <strong>Description:</strong> {desc.description}
        </p>
        <p><strong>Examples:</strong> {desc.examples}</p>
      </div>
    );
  };

  return (
    <div className="form-section active">
      <div className="section-header">
        <div className="section-icon">📋</div>
        <div className="section-title">
          <h2>Select Commitment Type</h2>
          <p>Choose the type of multi-year commitment you wish to record</p>
        </div>
      </div>

      <div className="info-box">
        <p>
          <strong>Important:</strong> All multi-year commitments must align with approved MTEF ceilings and strategic development plans. Ensure you have all necessary documentation before proceeding.
        </p>
      </div>

      <div className="form-grid">
        <div className="form-group full-width">
          <label htmlFor="commitmentType">
            Commitment Type <span className="required">*</span>
          </label>
          <select
            id="commitmentType"
            value={formData.commitmentType || ""}
            onChange={(e) => handleCommitmentTypeChange(e.target.value)}
            className={errors.commitmentType ? 'error' : ''}
          >
            <option value="" disabled>-- Select Commitment Type --</option>
            <option value="contractual">Contractual Commitment</option>
            <option value="non-contractual">Non-Contractual Commitment</option>
            <option value="counterpart">Counterpart Funding</option>
            <option value="all-at-once">Submit All Commitment Types</option>
          </select>
          {errors.commitmentType && (
            <div className="validation-message show">{errors.commitmentType}</div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        {renderTypeDescription()}
      </div>

      <div className="button-group" style={{ marginTop: '10px' }}>
        <button className="btn btn-secondary" onClick={resetForm}>
          Reset
        </button>
        <button className="btn btn-primary" onClick={nextStep}>
          Next Step →
        </button>
      </div>
    </div>
  );
};

export default Step1;
