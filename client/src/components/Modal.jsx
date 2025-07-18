// Import React for creating the component
import React from 'react';

/**
 * Modal Component
 * 
 * A reusable modal dialog component for confirmations and alerts.
 * This component displays a modal overlay with a message and action buttons.
 * Commonly used for delete confirmations, but flexible enough for other actions.
 * 
 * Props:
 * - isOpen: Boolean to control modal visibility
 * - onClose: Function called when user cancels or clicks backdrop
 * - onConfirm: Function called when user confirms the action
 * - title: String for the modal header title
 * - message: String for the modal body message
 * - confirmText: String for confirm button text (default: "Delete")
 * - cancelText: String for cancel button text (default: "Cancel")
 * - type: String for styling the confirm button (default: "danger") - affects color
 * - disabled: Boolean to disable the confirm button during loading
 */
const Modal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Delete", 
  cancelText = "Cancel", 
  type = "danger", 
  disabled = false 
}) => {
  // If modal is not open, don't render anything
  if (!isOpen) return null;

  /**
   * Handles clicks on the modal backdrop (dark overlay area)
   * Only closes the modal if the user clicks the backdrop itself,
   * not if they click inside the modal content area
   * 
   * @param {Event} e - The click event
   */
  const handleBackdropClick = (e) => {
    // e.target is what was clicked, e.currentTarget is the backdrop div
    // If they're the same, user clicked the backdrop (not modal content)
    if (e.target === e.currentTarget) {
      onClose(); // Close the modal
    }
  };

  return (
    // Modal backdrop - dark overlay that covers the entire screen
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      {/* Modal content container - the actual dialog box */}
      <div className="modal-container">
        {/* Modal header with title */}
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
        </div>
        
        {/* Modal body with message */}
        <div className="modal-body">
          <p className="modal-message">{message}</p>
        </div>
        
        {/* Modal footer with action buttons */}
        <div className="modal-footer">
          {/* Cancel button - closes modal without action */}
          <button 
            onClick={onClose}
            className="btn-secondary modal-btn"
          >
            {cancelText}
          </button>
          {/* Confirm button - performs the action (e.g., delete) */}
          <button 
            onClick={onConfirm}
            className={`btn-${type} modal-btn`} // Dynamic class based on type prop
            disabled={disabled} // Can be disabled during loading
          >
            {confirmText}
          </button>
        </div>
      </div>

      {/* 
        Inline CSS styles for the Modal component
        Using styled-jsx for component-scoped CSS
        
        Styles include:
        - Full-screen backdrop overlay with blur effect
        - Centered modal container with modern design
        - Smooth animations for modal entry/exit
        - Responsive design for mobile devices
        - Button styling that matches the app theme
      */}
      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(2px);
          animation: fadeIn 0.3s ease-out;
        }

        .modal-container {
          background: var(--bg-secondary);
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          max-width: 400px;
          width: 90%;
          max-height: 90vh;
          overflow: hidden;
          animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 1px solid var(--border-color);
          position: relative;
        }

        .modal-container::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(255, 255, 255, 0.1));
          border-radius: 18px;
          z-index: -1;
          opacity: 0.7;
        }

        .modal-header {
          padding: 1.5rem 1.5rem 0;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 1rem;
        }

        .modal-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .modal-body {
          padding: 0 1.5rem 1rem;
        }

        .modal-message {
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
          font-size: 0.9rem;
        }

        .modal-footer {
          padding: 1rem 1.5rem 1.5rem;
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
        }

        .modal-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          font-size: 0.875rem;
          min-width: 80px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .modal-btn:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 480px) {
          .modal-container {
            margin: 1rem;
            width: calc(100% - 2rem);
          }
          
          .modal-footer {
            flex-direction: column-reverse;
          }
          
          .modal-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Modal;
