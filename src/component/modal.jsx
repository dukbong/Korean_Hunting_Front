import React from 'react';
import './css/modal.css';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button onClick={onClose} className="modal-close-button">X</button>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
