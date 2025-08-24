import React from 'react';

interface AlertProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  const bgColors = {
    success: 'rgba(25, 135, 84, 0.2)',
    error: 'rgba(220, 53, 69, 0.2)',
    warning: 'rgba(255, 193, 7, 0.2)',
    info: 'rgba(13, 202, 240, 0.2)'
  };

  const textColors = {
    success: '#198754',
    error: '#dc3545',
    warning: '#ffc107',
    info: '#0dcaf0'
  };

  return (
    <div 
      className="glass-card p-3 mb-3 d-flex justify-content-between align-items-center"
      style={{ 
        backgroundColor: bgColors[type],
        borderLeft: `4px solid ${textColors[type]}`,
      }}
    >
      <div className="d-flex align-items-center">
        <i className={`bi bi-${type === 'success' ? 'check-circle' : 
                         type === 'error' ? 'x-circle' :
                         type === 'warning' ? 'exclamation-triangle' : 
                         'info-circle'} me-2`}
           style={{ color: textColors[type] }}></i>
        <span className="text-white">{message}</span>
      </div>
      {onClose && (
        <button 
          className="btn-close btn-close-white"
          onClick={onClose}
          aria-label="Close"
        ></button>
      )}
    </div>
  );
};

export default Alert;
