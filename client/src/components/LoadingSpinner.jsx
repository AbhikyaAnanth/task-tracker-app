import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary', 
  overlay = false,
  message = 'Loading...',
  showMessage = true 
}) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  const colorClasses = {
    primary: 'spinner-primary',
    secondary: 'spinner-secondary',
    white: 'spinner-white'
  };

  const Component = (
    <div className={`loading-spinner ${sizeClasses[size]} ${colorClasses[color]}`}>
      <div className="spinner">
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
      </div>
      
      {showMessage && (
        <div className="loading-message">{message}</div>
      )}

      <style jsx>{`
        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .spinner {
          position: relative;
          display: inline-block;
        }

        .spinner-circle {
          position: absolute;
          border-radius: 50%;
          animation: spinner-bounce 1.5s ease-in-out infinite;
        }

        .spinner-circle:nth-child(1) {
          top: 0;
          left: 0;
          animation-delay: -0.32s;
        }

        .spinner-circle:nth-child(2) {
          top: 0;
          right: 0;
          animation-delay: -0.16s;
        }

        .spinner-circle:nth-child(3) {
          bottom: 0;
          left: 0;
          animation-delay: -0.08s;
        }

        .spinner-circle:nth-child(4) {
          bottom: 0;
          right: 0;
        }

        /* Size variants */
        .spinner-small .spinner {
          width: 2rem;
          height: 2rem;
        }

        .spinner-small .spinner-circle {
          width: 0.75rem;
          height: 0.75rem;
        }

        .spinner-medium .spinner {
          width: 3rem;
          height: 3rem;
        }

        .spinner-medium .spinner-circle {
          width: 1rem;
          height: 1rem;
        }

        .spinner-large .spinner {
          width: 4rem;
          height: 4rem;
        }

        .spinner-large .spinner-circle {
          width: 1.25rem;
          height: 1.25rem;
        }

        /* Color variants */
        .spinner-primary .spinner-circle {
          background: var(--primary-color);
        }

        .spinner-secondary .spinner-circle {
          background: var(--text-muted);
        }

        .spinner-white .spinner-circle {
          background: white;
        }

        .loading-message {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 500;
          text-align: center;
        }

        .spinner-white + .loading-message {
          color: white;
        }

        @keyframes spinner-bounce {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        /* Responsive adjustments */
        @media (max-width: 480px) {
          .loading-message {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );

  if (overlay) {
    return (
      <div className="loading-overlay">
        {Component}
        
        <style jsx>{`
          .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(2px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
          }

          @media (prefers-color-scheme: dark) {
            .loading-overlay {
              background: rgba(0, 0, 0, 0.8);
            }
          }
        `}</style>
      </div>
    );
  }

  return Component;
};

export default LoadingSpinner;
