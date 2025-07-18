/**
 * LoadingSpinner Component
 * 
 * A flexible loading spinner component that can be used throughout the app
 * to indicate loading states. Features multiple sizes, colors, and display modes.
 * 
 * Features:
 * - Multiple sizes: small, medium, large
 * - Multiple colors: primary, secondary, white
 * - Optional overlay mode for full-screen blocking
 * - Customizable loading message
 * - Smooth bounce animation
 * - Responsive design
 * - Accessibility considerations
 * 
 * Props:
 * - size: String - 'small', 'medium', or 'large' (default: 'medium')
 * - color: String - 'primary', 'secondary', or 'white' (default: 'primary')
 * - overlay: Boolean - Whether to show as full-screen overlay (default: false)
 * - message: String - Custom loading message (default: 'Loading...')
 * - showMessage: Boolean - Whether to show the message (default: true)
 */

// Import React for creating the component
import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary', 
  overlay = false,
  message = 'Loading...',
  showMessage = true 
}) => {
  // Define CSS classes for different sizes
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  // Define CSS classes for different colors
  const colorClasses = {
    primary: 'spinner-primary',
    secondary: 'spinner-secondary',
    white: 'spinner-white'
  };

  // Create the main spinner component
  const Component = (
    <div className={`loading-spinner ${sizeClasses[size]} ${colorClasses[color]}`}>
      {/* Spinner animation container with 4 bouncing circles */}
      <div className="spinner">
        <div className="spinner-circle"></div> {/* Top-left circle */}
        <div className="spinner-circle"></div> {/* Top-right circle */}
        <div className="spinner-circle"></div> {/* Bottom-left circle */}
        <div className="spinner-circle"></div> {/* Bottom-right circle */}
      </div>
      
      {/* Loading message - only show if showMessage is true */}
      {showMessage && (
        <div className="loading-message">{message}</div>
      )}

      {/* 
        CSS Styles for LoadingSpinner Component
        
        Includes:
        - Flexbox layout for centering
        - Bounce animation keyframes
        - Size variants (small, medium, large)
        - Color variants (primary, secondary, white)
        - Responsive adjustments
        - Smooth animations with staggered timing
      */}
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

  // If overlay mode is requested, wrap the spinner in a full-screen overlay
  if (overlay) {
    return (
      <div className="loading-overlay">
        {Component} {/* Insert the spinner component */}
        
        {/* CSS styles for the overlay */}
        <style jsx>{`
          .loading-overlay {
            position: fixed; /* Fixed position to cover entire viewport */
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.9); /* Semi-transparent white background */
            backdrop-filter: blur(2px); /* Blur the content behind the overlay */
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999; /* High z-index to appear above all other content */
          }

          /* Dark mode overlay styling */
          @media (prefers-color-scheme: dark) {
            .loading-overlay {
              background: rgba(0, 0, 0, 0.8); /* Semi-transparent black for dark mode */
            }
          }
        `}</style>
      </div>
    );
  }

  // Return the standard spinner component (not in overlay mode)
  return Component;
};

export default LoadingSpinner;
