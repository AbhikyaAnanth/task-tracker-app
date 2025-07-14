import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast]);
  const error = useCallback((message, duration) => addToast(message, 'error', duration), [addToast]);
  const warning = useCallback((message, duration) => addToast(message, 'warning', duration), [addToast]);
  const info = useCallback((message, duration) => addToast(message, 'info', duration), [addToast]);

  const value = {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
      
      <style jsx>{`
        .toast-container {
          position: fixed;
          top: 1rem;
          right: 1rem;
          z-index: 10000;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-width: 400px;
          width: 100%;
        }

        @media (max-width: 480px) {
          .toast-container {
            top: 0.5rem;
            right: 0.5rem;
            left: 0.5rem;
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
};

const Toast = ({ toast, onRemove }) => {
  const handleClose = () => {
    onRemove(toast.id);
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className={`toast toast-${toast.type}`}>
      <div className="toast-icon">
        {getIcon()}
      </div>
      
      <div className="toast-message">
        {toast.message}
      </div>
      
      <button 
        onClick={handleClose}
        className="toast-close"
        aria-label="Close notification"
      >
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      <style jsx>{`
        .toast {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem;
          background: var(--bg-secondary);
          border-radius: 8px;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-color);
          animation: slideIn 0.3s ease-out;
          position: relative;
          overflow: hidden;
        }

        .toast::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
        }

        .toast-success::before {
          background: var(--success-color);
        }

        .toast-error::before {
          background: var(--error-color);
        }

        .toast-warning::before {
          background: var(--warning-color);
        }

        .toast-info::before {
          background: var(--primary-color);
        }

        .toast-icon {
          width: 1.25rem;
          height: 1.25rem;
          flex-shrink: 0;
          margin-top: 0.125rem;
        }

        .toast-success .toast-icon {
          color: var(--success-color);
        }

        .toast-error .toast-icon {
          color: var(--error-color);
        }

        .toast-warning .toast-icon {
          color: var(--warning-color);
        }

        .toast-info .toast-icon {
          color: var(--primary-color);
        }

        .toast-message {
          flex: 1;
          font-size: 0.875rem;
          line-height: 1.5;
          color: var(--text-primary);
        }

        .toast-close {
          width: 1.25rem;
          height: 1.25rem;
          flex-shrink: 0;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          transition: color 0.2s ease;
          padding: 0;
          margin-top: 0.125rem;
        }

        .toast-close:hover {
          color: var(--text-primary);
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (max-width: 480px) {
          .toast {
            padding: 0.875rem;
          }

          .toast-message {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ToastProvider;
