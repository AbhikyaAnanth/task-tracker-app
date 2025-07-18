// Import React and useState hook for managing form state
import React, { useState } from 'react';
// Import validation functions for task inputs
import { validateTaskTitle, validateTaskDescription } from '../utils/validation';
// Import toast hook for showing success/error messages
import { useToast } from './ToastProvider';

/**
 * TaskForm Component
 * 
 * A form component for creating new tasks. Features include:
 * - Input fields for task title and description
 * - Input validation with error messages
 * - Loading state during task creation
 * - Success/error toast notifications
 * - Character count displays
 * - Keyboard shortcuts (Enter to submit, Ctrl+Enter in textarea)
 * 
 * Props:
 * - addTask: Function to call when creating a new task
 */
const TaskForm = ({ addTask }) => {
  // Form input states
  const [title, setTitle] = useState(''); // Task title input
  const [description, setDescription] = useState(''); // Task description input
  
  // UI states
  const [loading, setLoading] = useState(false); // Loading state during submission
  const [errors, setErrors] = useState({}); // Validation error messages
  
  // Toast notifications for user feedback
  const { success, error: showError } = useToast();

  /**
   * Handles form submission for creating a new task
   * 
   * Process:
   * 1. Prevent default form submission
   * 2. Validate title and description inputs
   * 3. Show validation errors if any
   * 4. Call addTask API if validation passes
   * 5. Reset form and show success message
   * 6. Handle any API errors
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setErrors({}); // Clear any previous errors
    
    // Validate both inputs
    const titleError = validateTaskTitle(title);
    const descriptionError = validateTaskDescription(description);
    
    // If validation fails, show errors and stop submission
    if (titleError || descriptionError) {
      setErrors({
        title: titleError,
        description: descriptionError
      });
      return;
    }

    // Validation passed, submit the new task
    setLoading(true); // Show loading state
    try {
      // Call the addTask function passed from parent component
      await addTask({ 
        title: title.trim(), // Remove extra whitespace
        description: description.trim()
      });
      setTitle('');
      setDescription('');
      setErrors({});
      success('Task created successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to create task';
      setErrors({ submit: errorMessage });
      showError(errorMessage);
      console.error('Error creating task:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form-container">
      <div className="task-form-header">
        <h2>Add New Task</h2>
        <p>What would you like to accomplish today?</p>
      </div>
      
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <div className="input-container">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your task title..."
              disabled={loading}
              maxLength={40}
              className="task-input"
            />
            <button 
              type="submit" 
              disabled={loading || !title.trim()}
              className={`submit-btn ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Adding...
                </>
              ) : (
                'Add Task'
              )}
            </button>
          </div>
          
          <div className="form-footer">
            <div className={`char-count ${title.length > 35 ? 'warning' : ''}`}>
              {title.length}/40 characters
            </div>
            {errors.title && <div className="error-message">{errors.title}</div>}
          </div>
        </div>

        <div className="form-group description-group">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description (optional)..."
            disabled={loading}
            maxLength={500}
            className="task-description"
            rows="3"
          />
          
          <div className="form-footer">
            <div className={`char-count ${description.length > 450 ? 'warning' : ''}`}>
              {description.length}/500 characters
            </div>
            {errors.description && <div className="error-message">{errors.description}</div>}
          </div>
        </div>

        {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}
      </form>

      <style jsx>{`
        .task-form-container {
          margin-bottom: 2rem;
        }

        .task-form-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .task-form-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .task-form-header p {
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        .task-form {
          max-width: 600px;
          margin: 0 auto;
        }

        .form-group {
          position: relative;
        }

        .input-container {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .task-input {
          flex: 1;
          padding: 1rem 1.25rem;
          border: 2px solid var(--border-color, #e2e8f0);
          border-radius: 12px;
          font-size: 1rem;
          background: var(--bg-secondary, #f7fafc);
          color: var(--text-primary, #1a202c);
          transition: all 0.2s ease;
          box-shadow: var(--shadow-sm, 0 1px 3px 0 rgba(26, 54, 93, 0.1), 0 1px 2px 0 rgba(26, 54, 93, 0.06));
        }

        .task-input:focus {
          border-color: var(--primary-color, #1a365d);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          transform: translateY(-1px);
        }

        .task-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .task-description {
          width: 100%;
          padding: 1rem 1.25rem;
          border: 2px solid var(--border-color, #e2e8f0);
          border-radius: 12px;
          font-size: 1rem;
          background: var(--bg-secondary, #f7fafc);
          color: var(--text-primary, #1a202c);
          transition: all 0.2s ease;
          box-shadow: var(--shadow-sm, 0 1px 3px 0 rgba(26, 54, 93, 0.1), 0 1px 2px 0 rgba(26, 54, 93, 0.06));
          resize: vertical;
          min-height: 80px;
          font-family: inherit;
        }

        .task-description:focus {
          border-color: var(--primary-color, #1a365d);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          transform: translateY(-1px);
        }

        .task-description:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .description-group {
          margin-top: 1rem;
        }

        .submit-btn {
          background: var(--gradient-primary);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 1rem 1.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          white-space: nowrap;
          box-shadow: var(--shadow-sm);
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .submit-btn.loading {
          background: var(--text-muted);
        }

        .form-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
          min-height: 1.25rem;
        }

        .char-count {
          color: var(--text-muted);
          transition: color 0.2s ease;
        }

        .char-count.warning {
          color: var(--warning-color);
          font-weight: 600;
        }

        .error-message {
          color: var(--error-color);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .submit-error {
          text-align: center;
          margin-top: 1rem;
          padding: 0.75rem;
          background: rgba(239, 68, 68, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        @media (max-width: 640px) {
          .input-container {
            flex-direction: column;
          }
          
          .submit-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default TaskForm;
