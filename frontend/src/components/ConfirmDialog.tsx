import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content glass-card">
          <div className="modal-header border-0">
            <h5 className="modal-title text-white">{title}</h5>
          </div>
          <div className="modal-body">
            <p className="text-light">{message}</p>
          </div>
          <div className="modal-footer border-0">
            <button 
              className="btn btn-secondary glass-btn" 
              onClick={onCancel}
            >
              Cancel
            </button>
            <button 
              className="btn btn-danger glass-btn" 
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
