import React from 'react';

const ConfirmationDialog = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  title, 
  message, 
  confirmText, 
  cancelText, 
  variant = 'default',
  details
}) => {
  if (!isOpen) return null;

  // Style configurations based on variant
  const getStyles = () => {
    if (variant === 'delete') {
      return {
        headerBg: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
        confirmBtnBg: '#dc3545',
        confirmBtnHover: '#c82333',
        icon: '🗑️'
      };
    } else if (variant === 'warning') {
      return {
        headerBg: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
        confirmBtnBg: '#ff9800',
        confirmBtnHover: '#f57c00',
        icon: '⚠️'
      };
    } else {
      return {
        headerBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        confirmBtnBg: '#28a745',
        confirmBtnHover: '#218838',
        icon: 'ℹ️'
      };
    }
  };

  const styles = getStyles();

  return (
    <div className="modal show">
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <div className="modal-header" style={{ background: styles.headerBg }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>{styles.icon}</span>
            {title}
          </h3>
        </div>
        
        <div className="modal-body" style={{ padding: '30px' }}>
          <div style={{ 
            fontSize: '16px', 
            lineHeight: '1.6', 
            color: '#2c3e50',
            marginBottom: details ? '25px' : '0',
            textAlign: 'center'
          }}>
            {message}
          </div>

          {details && (
            <div style={{ 
              background: '#f8f9fa', 
              border: '1px solid #dee2e6', 
              borderRadius: '8px', 
              padding: '20px',
              marginTop: '20px'
            }}>
              {details}
            </div>
          )}
        </div>
        
        <div className="modal-footer" style={{ 
          padding: '20px 30px', 
          borderTop: '1px solid #e9ecef',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '15px'
        }}>
          <button 
            className="btn btn-secondary" 
            onClick={onCancel}
            style={{
              padding: '12px 25px',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            {cancelText || 'Cancel'}
          </button>
          <button 
            className="btn" 
            onClick={onConfirm}
            style={{
              padding: '12px 25px',
              fontSize: '14px',
              fontWeight: '600',
              background: styles.confirmBtnBg,
              border: 'none',
              color: 'white'
            }}
          >
            {confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
