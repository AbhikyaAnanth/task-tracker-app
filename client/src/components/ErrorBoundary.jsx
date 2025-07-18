// Import React library for creating class components
import React from 'react';

/**
 * ErrorBoundary Component
 * 
 * This is a React Error Boundary component that catches JavaScript errors anywhere 
 * in the child component tree, logs those errors, and displays a fallback UI 
 * instead of the component tree that crashed.
 * 
 * Error boundaries are React components that catch JavaScript errors anywhere in 
 * their child component tree, log those errors, and display a fallback UI.
 * 
 * Key features:
 * - Catches errors during rendering, in lifecycle methods, and in constructors
 * - Logs error details for debugging (in development mode)
 * - Provides user-friendly error message with recovery options
 * - Shows technical error details in development mode
 * - Offers "Try Again" and "Reload Page" buttons for recovery
 * 
 * Note: Error boundaries do NOT catch errors for:
 * - Event handlers
 * - Asynchronous code (e.g., setTimeout or requestAnimationFrame callbacks)
 * - Errors thrown in the error boundary itself
 */
class ErrorBoundary extends React.Component {
  /**
   * Constructor - Initialize component state
   * @param {Object} props - Component props passed from parent
   */
  constructor(props) {
    super(props);
    // Initialize state with default values
    // hasError: tracks whether an error has occurred
    // error: stores the actual error object
    // errorInfo: stores additional error information (like component stack)
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  /**
   * Static method called when an error is thrown in a child component
   * This method is called during the "render" phase, so side-effects are not permitted
   * @param {Error} error - The error that was thrown
   * @returns {Object} - New state object to update component state
   */
  static getDerivedStateFromError(error) {
    // Update state to indicate an error has occurred
    // This will trigger the error UI to be rendered
    return { hasError: true };
  }

  /**
   * Lifecycle method called when an error is caught
   * This method is called during the "commit" phase, so side-effects are permitted
   * @param {Error} error - The error that was thrown
   * @param {Object} errorInfo - Object with componentStack key containing information about which component threw the error
   */
  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging purposes
    // In a production app, you would typically send this to an error reporting service
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // Update state with detailed error information
    // This allows us to display error details in development mode
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  /**
   * Handler for the "Reload Page" button
   * Resets the error state and reloads the entire page
   * This is useful when the error might be resolved by a fresh page load
   */
  handleReload = () => {
    // Reset error state first
    this.setState({ hasError: false, error: null, errorInfo: null });
    // Force a complete page reload
    window.location.reload();
  };

  /**
   * Handler for the "Try Again" button
   * Resets the error state without reloading the page
   * This allows the component tree to re-render and potentially recover
   */
  handleReset = () => {
    // Reset all error-related state
    // This will cause the component to re-render the normal UI
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  /**
   * Render method - displays either the error UI or the normal child components
   * @returns {JSX.Element} - Either error UI or children components
   */
  render() {
    // Check if an error has occurred
    if (this.state.hasError) {
      // Return the error UI when an error is detected
      return (
        <div className="error-boundary">
          <div className="error-boundary-container">
            <div className="error-boundary-content">
              {/* Error icon - visual indicator that something went wrong */}
              <div className="error-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              
              {/* Main error title */}
              <h1 className="error-title">Oops! Something went wrong</h1>
              
              {/* User-friendly error message */}
              <p className="error-message">
                We're sorry, but something unexpected happened. This error has been logged and we'll look into it.
              </p>
              
              {/* 
                Technical error details - only shown in development mode
                This helps developers debug issues but is hidden from end users
              */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="error-details">
                  <summary>Error Details (Development Only)</summary>
                  <pre className="error-stack">
                    {/* Display the error message and component stack trace */}
                    {this.state.error.toString()}
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
              
              {/* Action buttons for error recovery */}
              <div className="error-actions">
                {/* Try Again button - attempts to recover without page reload */}
                <button 
                  onClick={this.handleReset}
                  className="btn-secondary"
                >
                  Try Again
                </button>
                {/* Reload Page button - force complete page refresh */}
                <button 
                  onClick={this.handleReload}
                  className="btn-primary"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>

          {/* Styled JSX for component styling - embedded CSS */}
          <style jsx>{`
            .error-boundary {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: var(--bg-primary);
              padding: 2rem;
            }

            .error-boundary-container {
              max-width: 500px;
              width: 100%;
              text-align: center;
            }

            .error-boundary-content {
              background: var(--bg-secondary);
              border-radius: 16px;
              padding: 3rem 2rem;
              box-shadow: var(--shadow-lg);
              border: 1px solid var(--border-color);
            }

            .error-icon {
              width: 4rem;
              height: 4rem;
              margin: 0 auto 1.5rem;
              color: var(--error-color);
              opacity: 0.8;
            }

            .error-icon svg {
              width: 100%;
              height: 100%;
            }

            .error-title {
              font-size: 1.5rem;
              font-weight: 700;
              color: var(--text-primary);
              margin-bottom: 1rem;
            }

            .error-message {
              color: var(--text-secondary);
              line-height: 1.6;
              margin-bottom: 2rem;
            }

            .error-details {
              text-align: left;
              margin: 1.5rem 0;
              padding: 1rem;
              background: var(--bg-tertiary);
              border-radius: 8px;
              border: 1px solid var(--border-color);
            }

            .error-details summary {
              cursor: pointer;
              font-weight: 600;
              color: var(--text-primary);
              margin-bottom: 0.5rem;
            }

            .error-stack {
              font-family: 'Courier New', monospace;
              font-size: 0.75rem;
              color: var(--text-secondary);
              white-space: pre-wrap;
              overflow-x: auto;
              margin: 0.5rem 0 0 0;
              padding: 0.5rem;
              background: var(--bg-primary);
              border-radius: 4px;
            }

            .error-actions {
              display: flex;
              gap: 1rem;
              justify-content: center;
              flex-wrap: wrap;
            }

            .btn-primary,
            .btn-secondary {
              padding: 0.75rem 1.5rem;
              border-radius: 8px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s ease;
              border: none;
              min-width: 120px;
            }

            .btn-primary {
              background: var(--gradient-primary);
              color: white;
            }

            .btn-primary:hover {
              transform: translateY(-1px);
              box-shadow: var(--shadow-md);
            }

            .btn-secondary {
              background: var(--bg-tertiary);
              color: var(--text-primary);
              border: 1px solid var(--border-color);
            }

            .btn-secondary:hover {
              background: var(--bg-primary);
            }

            @media (max-width: 480px) {
              .error-boundary {
                padding: 1rem;
              }

              .error-boundary-content {
                padding: 2rem 1.5rem;
              }

              .error-actions {
                flex-direction: column;
              }

              .btn-primary,
              .btn-secondary {
                width: 100%;
              }
            }
          `}</style>
        </div>
      );
    }

    // If no error occurred, render the child components normally
    // This allows the ErrorBoundary to act as a transparent wrapper
    return this.props.children;
  }
}

// Export the ErrorBoundary component for use in other parts of the application
export default ErrorBoundary;
