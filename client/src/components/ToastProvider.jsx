/**
 * Toast Notification System
 * 
 * This file provides a complete toast notification system for the app.
 * Toasts are small popup messages that appear temporarily to give user feedback.
 * 
 * Components included:
 * - ToastProvider: Context provider that manages toast state
 * - useToast: Hook for components to show toast messages
 * - ToastContainer: Renders all active toasts
 * - Toast: Individual toast message component
 * 
 * Features:
 * - Different types: success, error, warning, info
 * - Auto-dismiss after configurable duration
 * - Manual close button
 * - Smooth animations
 * - Responsive design
 * - Accessible (ARIA labels)
 */

// Import React hooks and utilities
import React, { createContext, useContext, useState, useCallback } from 'react';

// Create React Context for sharing toast state across components
const ToastContext = createContext();

/**
 * Custom hook to access toast functionality
 * 
 * This hook must be used within a ToastProvider component.
 * It provides functions to show different types of toast messages.
 * 
 * @returns {Object} Toast functions (success, error, warning, info, etc.)
 * @throws {Error} If used outside of ToastProvider
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  // Ensure hook is used within ToastProvider
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

/**
 * ToastProvider Component
 * 
 * This component wraps the app and provides toast notification functionality
 * to all child components through React Context.
 * 
 * @param {Object} props
 * @param {ReactNode} props.children - Child components that can use toasts
 */
export const ToastProvider = ({ children }) => {
  // State to store all active toast messages
  const [toasts, setToasts] = useState([]);

  /**
   * Adds a new toast message to the display
   * 
   * @param {string} message - The text message to display
   * @param {string} type - Toast type: 'success', 'error', 'warning', 'info'
   * @param {number} duration - How long to show toast in milliseconds (0 = no auto-dismiss)
   * @returns {string|number} Unique ID of the created toast
   */
  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    // Create unique ID using timestamp + random number
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };
    
    // Add new toast to the list
    setToasts(prev => [...prev, toast]);

    // Set up auto-dismiss timer if duration is specified
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id; // Return ID in case caller needs to manually remove toast later
  }, []);

  /**
   * Removes a specific toast by its ID
   * 
   * @param {string|number} id - Unique ID of the toast to remove
   */
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  /**
   * Removes all currently displayed toasts
   */
  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods for different toast types
  // These make it easier for components to show specific types of messages
  const success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast]);
  const error = useCallback((message, duration) => addToast(message, 'error', duration), [addToast]);
  const warning = useCallback((message, duration) => addToast(message, 'warning', duration), [addToast]);
  const info = useCallback((message, duration) => addToast(message, 'info', duration), [addToast]);

  // Create the context value object with all toast functions
  const value = {
    toasts,        // Array of current toasts
    addToast,      // Function to add a toast
    removeToast,   // Function to remove a toast
    clearAllToasts,// Function to clear all toasts
    success,       // Convenience function for success toasts
    error,         // Convenience function for error toasts
    warning,       // Convenience function for warning toasts
    info          // Convenience function for info toasts
  };

  return (
    <ToastContext.Provider value={value}>
      {children} {/* Render all child components */}
      <ToastContainer /> {/* Render the toast container */}
    </ToastContext.Provider>
  );
};

/**
 * ToastContainer Component
 * 
 * This component renders all active toasts in a fixed position container.
 * It's automatically included in the ToastProvider and doesn't need to be
 * used directly by other components.
 */
const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-container">
      {/* Render each toast with its own Toast component */}
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
      
      {/* 
        CSS styles for the toast container
        - Fixed position in top-right corner
        - High z-index to appear above other content
        - Responsive design for mobile devices
      */}
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

/**
 * Toast Component
 * 
 * Renders an individual toast message with:
 * - Icon based on toast type (success, error, warning, info)
 * - Message content
 * - Close button
 * - Styled background with colored left border
 * 
 * @param {Object} props
 * @param {Object} props.toast - Toast data (id, message, type, duration)
 * @param {Function} props.onRemove - Function to call when toast should be removed
 */
const Toast = ({ toast, onRemove }) => {
  /**
   * Handles the close button click
   */
  const handleClose = () => {
    onRemove(toast.id);
  };

  /**
   * Returns the appropriate icon SVG based on toast type
   * Each type has its own icon to help users quickly understand the message
   * 
   * @returns {JSX.Element} SVG icon element
   */
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        // Checkmark icon for success messages
        return (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        // Exclamation mark icon for error messages
        return (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        // Triangle with exclamation for warning messages
        return (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      default:
        // Information icon for info messages (default)
        return (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className={`toast toast-${toast.type}`}>
      {/* Icon section - shows different icon based on toast type */}
      <div className="toast-icon">
        {getIcon()}
      </div>
      
      {/* Message section - displays the actual toast message */}
      <div className="toast-message">
        {toast.message}
      </div>
      
      {/* Close button - allows manual dismissal */}
      <button 
        onClick={handleClose}
        className="toast-close"
        aria-label="Close notification" // Accessibility label for screen readers
      >
        {/* X icon for close button */}
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* 
        CSS styles for individual toast messages
        - Different colors for each toast type
        - Smooth slide-in animation
        - Responsive design
        - Hover effects for interactive elements
      */}
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
