import React, { useState, useEffect } from 'react';

const SuccessMessage = ({ resetForm }) => {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [submissionDate, setSubmissionDate] = useState('');

  useEffect(() => {
    // Generate reference number
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const refNumber = `MYC-2025-${random.toString().padStart(5, '0')}`;
    setReferenceNumber(refNumber);
    setSubmissionDate(new Date().toLocaleDateString('en-GB'));
  }, []);

  return (
    <div className="form-section active">
      <div className="success-message">
        <div className="success-icon">✓</div>
        <h2>Submission Successful!</h2>
        <p>Your multi-year commitment has been successfully submitted for review.</p>
        <div className="reference-number">{referenceNumber}</div>
        <p><strong>Submission Date:</strong> {submissionDate}</p>
        <p style={{ marginTop: '20px' }}>
          The MoFPED PAP Department will review your submission and notify you of the approval status.
        </p>
        <div style={{ marginTop: '30px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={resetForm}>
            Submit Another Commitment
          </button>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            Print Confirmation
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;
