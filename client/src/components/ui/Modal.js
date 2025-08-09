import React from 'react';

const Modal = ({ show, onClose, title, children, size = 'medium' }) => {
  if (!show) return null;
  
  const sizeClass = size === 'small' ? 'modal-sm' : size === 'large' ? 'modal-lg' : '';
  
  return (
    <div className="modal-overlay">
      <div className={`modal ${sizeClass}`}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;