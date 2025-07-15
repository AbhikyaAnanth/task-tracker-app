import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-container">
            <div className="error-boundary-content">
              <div className="error-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              
              <h1 className="error-title">Oops! Something went wrong</h1>
              
              <p className="error-message">
                We're sorry, but something unexpected happened. This error has been logged and we'll look into it.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="error-details">
                  <summary>Error Details (Development Only)</summary>
                  <pre className="error-stack">
                    {this.state.error.toString()}
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
              
              <div className="error-actions">
                <button 
                  onClick={this.handleReset}
                  className="btn-secondary"
                >
                  Try Again
                </button>
                <button 
                  onClick={this.handleReload}
                  className="btn-primary"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>

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

    return this.props.children;
  }
}

export default ErrorBoundary;
