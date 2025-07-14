import React from 'react';

const ProgressBar = ({ completed, total }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  const getProgressColor = () => {
    if (percentage >= 80) return 'var(--success-color, #38a169)';
    if (percentage >= 50) return 'var(--primary-color, #1a365d)';
    if (percentage >= 25) return 'var(--warning-color, #ed8936)';
    return 'var(--error-color, #e53e3e)';
  };

  const getMotivationalMessage = () => {
    if (percentage === 100) return 'All done! Amazing work!';
    if (percentage >= 75) return 'Almost there! Keep it up!';
    if (percentage >= 50) return 'Great progress! You\'re doing awesome!';
    if (percentage >= 25) return 'Getting started! You\'ve got this!';
    return 'Ready to tackle your tasks?';
  };

  return (
    <div className="progress-container">
      <div className="progress-header">
        <span className="progress-label">Progress</span>
        <span className="progress-percentage">{percentage}%</span>
      </div>
      
      <div className="progress-bar-bg">
        <div 
          className="progress-bar-fill"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: getProgressColor()
          }}
        >
          <div className="progress-shine"></div>
        </div>
      </div>
      
      <div className="progress-message">
        {getMotivationalMessage()}
      </div>

      <style jsx>{`
        .progress-container {
          margin: 1rem 0;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .progress-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary, #2d3748);
        }

        .progress-percentage {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--primary-color, #1a365d);
        }

        .progress-bar-bg {
          height: 8px;
          background: var(--bg-tertiary, #edf2f7);
          border-radius: 4px;
          overflow: hidden;
          position: relative;
        }

        .progress-bar-fill {
          height: 100%;
          border-radius: 4px;
          position: relative;
          transition: width 0.6s ease, background-color 0.3s ease;
          overflow: hidden;
        }

        .progress-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shine 2s ease-in-out infinite;
        }

        .progress-message {
          text-align: center;
          margin-top: 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary, #2d3748);
          font-style: italic;
        }

        @keyframes shine {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ProgressBar;
