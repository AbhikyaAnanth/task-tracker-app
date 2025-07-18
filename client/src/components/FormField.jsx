/**
 * FormField Component
 * 
 * A reusable form field wrapper that provides consistent styling and functionality
 * for all form inputs throughout the application. This component handles:
 * 
 * Features:
 * - Label display with optional required indicator (*)
 * - Error state styling and messaging
 * - Help text for user guidance
 * - Accessibility features (ARIA roles, semantic markup)
 * - Consistent spacing and layout
 * - Input wrapper for custom styling
 * 
 * Props:
 * - label: String - The label text to display above the input
 * - error: String - Error message to display (also triggers error styling)
 * - required: Boolean - Whether to show the required asterisk (*)
 * - children: ReactNode - The actual input/textarea/select element
 * - helpText: String - Optional help text shown below input
 * - className: String - Additional CSS classes to apply
 */

// Import React for creating the component
import React from 'react';

const FormField = ({ 
  label, 
  error, 
  required = false, 
  children, 
  helpText = null,
  className = ''
}) => {
  return (
    // Main container with conditional error styling
    <div className={`form-field ${error ? 'has-error' : ''} ${className}`}>
      {/* Label section - only render if label is provided */}
      {label && (
        <label className="form-label">
          {label}
          {/* Required asterisk - only show if field is required */}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}
      
      {/* Input wrapper - contains the actual form element (children) */}
      <div className="form-input-wrapper">
        {children} {/* This is where the actual input/textarea/select goes */}
      </div>
      
      {/* Help text - only show if provided and no error is present */}
      {helpText && !error && (
        <div className="form-help-text">{helpText}</div>
      )}
      
      {/* Error message - only show if there's an error */}
      {error && (
        <div className="form-error-text" role="alert"> {/* ARIA role for screen readers */}
          {/* Error icon for visual feedback */}
          <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error} {/* Display the error message */}
        </div>
      )}

      {/* 
        CSS Styles for FormField Component
        Using styled-jsx for component-scoped CSS that doesn't affect other components
        
        Styles include:
        - Form field layout and spacing
        - Label styling with required indicators
        - Error state styling for inputs
        - Help text and error message styling
        - Icon styling for error messages
        - Color scheme using CSS custom properties
      */}
      <style jsx>{`
        .form-field {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .required-indicator {
          color: var(--error-color);
          margin-left: 0.25rem;
        }

        .form-input-wrapper {
          position: relative;
        }

        .form-help-text {
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .form-error-text {
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: var(--error-color);
          display: flex;
          align-items: center;
          gap: 0.25rem;
          line-height: 1.4;
        }

        .error-icon {
          width: 1rem;
          height: 1rem;
          flex-shrink: 0;
        }

        .form-field.has-error .form-input-wrapper input,
        .form-field.has-error .form-input-wrapper textarea {
          border-color: var(--error-color);
          box-shadow: 0 0 0 3px rgba(245, 101, 101, 0.1);
        }

        .form-field.has-error .form-label {
          color: var(--error-color);
        }
      `}</style>
    </div>
  );
};

export default FormField;
