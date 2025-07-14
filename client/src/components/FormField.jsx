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
    <div className={`form-field ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}
      
      <div className="form-input-wrapper">
        {children}
      </div>
      
      {helpText && !error && (
        <div className="form-help-text">{helpText}</div>
      )}
      
      {error && (
        <div className="form-error-text" role="alert">
          <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

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
