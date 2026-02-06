import React from 'react';

const AlertDialog = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  variant = 'info',
  showIcon = true
}) => {
  if (!isOpen) return null;

  // Style configurations based on variant
  const getStyles = () => {
    if (variant === 'error' || variant === 'danger') {
      return {
        headerBg: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
        icon: '❌',
        iconBg: '#dc3545'
      };
    } else if (variant === 'warning') {
      return {
        headerBg: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
        icon: '⚠️',
        iconBg: '#ffc107'
      };
    } else if (variant === 'success') {
      return {
        headerBg: 'linear-gradient(135deg, #28a745 0%, #218838 100%)',
        icon: '✅',
        iconBg: '#28a745'
      };
    } else {
      return {
        headerBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        icon: 'ℹ️',
        iconBg: '#667eea'
      };
    }
  };

  const styles = getStyles();

  return (
    <div className="modal show">
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <div className="modal-header" style={{ background: styles.headerBg }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            {showIcon && <span style={{ fontSize: '24px' }}>{styles.icon}</span>}
            {title}
          </h3>
        </div>
        
        <div className="modal-body" style={{ padding: '30px', fontSize: '16px' }}>
          {typeof message === 'string' ? (
            <div style={{ 
              lineHeight: '1.6', 
              color: '#2c3e50',
              textAlign: 'center'
            }}>
              {message}
            </div>
          ) : (
            message
          )}
        </div>
        
        <div className="modal-footer" style={{ 
          padding: '20px 30px', 
          borderTop: '1px solid #e9ecef',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <button 
            className="btn btn-primary" 
            onClick={onClose}
            style={{
              padding: '12px 40px',
              fontSize: '15px',
              fontWeight: '600',
              background: styles.iconBg,
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
            }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertDialog;

