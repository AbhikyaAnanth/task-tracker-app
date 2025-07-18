// Import React and the useState hook for managing component state
import React, { useState } from 'react';
// Import the API function to update tasks on the server
import { updateTask } from '../services/api';
// Import validation functions to check if task title and description are valid
import { validateTaskTitle, validateTaskDescription } from '../utils/validation';

/**
 * TaskItem Component
 * 
 * This component displays a single task in the task list. It provides functionality to:
 * - Toggle task completion status (mark as done/undone)
 * - Edit task title and description inline
 * - Delete tasks (requests confirmation via parent component)
 * - Show creation and update timestamps
 * 
 * Props:
 * - task: The task object containing id, title, description, completed status, timestamps
 * - onUpdate: Callback function to refresh the task list after changes
 * - onDeleteRequest: Callback function to handle delete requests (shows confirmation modal)
 */
const TaskItem = ({ task, onUpdate, onDeleteRequest }) => {
  // State to track if the component is currently making API calls (shows loading state)
  const [loading, setLoading] = useState(false);
  
  // State to track if the user is currently editing this task
  const [editing, setEditing] = useState(false);
  
  // State to store the edited title while editing (starts with current task title)
  const [editTitle, setEditTitle] = useState(task.title);
  
  // State to store the edited description while editing (starts with current description or empty string)
  const [editDescription, setEditDescription] = useState(task.description || '');
  
  // State to store any error messages (e.g., validation errors, API errors)
  const [errors, setErrors] = useState({});

  /**
   * Handles toggling the completed status of a task
   * When user clicks the checkbox, this function:
   * 1. Sets loading state to show visual feedback
   * 2. Calls the API to update the task's completed status
   * 3. Refreshes the task list to show updated data
   * 4. Handles any errors that occur during the process
   */
  const handleToggle = async () => {
    setLoading(true); // Show loading state to user
    setErrors({}); // Clear any previous errors
    try {
      // Call API to update task with opposite completed status
      await updateTask(task._id, { completed: !task.completed });
      // Refresh the task list to show the updated task
      onUpdate();
    } catch (err) {
      // If API call fails, show error message to user
      setErrors({ toggle: 'Failed to update task' });
      console.error('Error toggling task:', err);
    } finally {
      // Always turn off loading state, whether success or failure
      setLoading(false);
    }
  };

  /**
   * Handles delete button clicks
   * Instead of deleting immediately, this calls the parent component
   * which will show a confirmation modal before actually deleting
   */
  const handleDeleteClick = () => {
    onDeleteRequest(task);
  };

  /**
   * Handles edit button clicks and saving edited tasks
   * This function has two modes:
   * 1. If not editing: Switch to edit mode (show input fields)
   * 2. If already editing: Validate inputs and save changes to server
   */
  const handleEdit = async () => {
    // If not currently editing, just switch to edit mode
    if (!editing) {
      setEditing(true);
      return;
    }

    // If we're already editing, validate the inputs before saving
    const titleError = validateTaskTitle(editTitle);
    const descriptionError = validateTaskDescription(editDescription);
    
    // If validation fails, show error messages and don't save
    if (titleError || descriptionError) {
      setErrors({
        title: titleError,
        description: descriptionError
      });
      return;
    }

    // Validation passed, so save the changes
    setLoading(true); // Show loading state
    setErrors({}); // Clear any previous errors
    try {
      // Call API to update the task with new title and description
      // trim() removes extra whitespace from beginning and end
      await updateTask(task._id, { 
        title: editTitle.trim(),
        description: editDescription.trim()
      });
      // Exit edit mode since save was successful
      setEditing(false);
      // Refresh the task list to show updated data
      onUpdate();
    } catch (err) {
      // If API call fails, show error message but stay in edit mode
      setErrors({ update: 'Failed to update task' });
      console.error('Error updating task:', err);
    } finally {
      // Always turn off loading state
      setLoading(false);
    }
  };

  /**
   * Handles canceling edit mode
   * Resets all edit fields to their original values and exits edit mode
   */
  const handleCancel = () => {
    setEditing(false); // Exit edit mode
    // Reset edit fields to original task values
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    // Clear any validation errors
    setErrors({});
  };

  /**
   * Formats a date string into a human-readable relative time
   * Examples: "Just now", "2h ago", "12/25/2023"
   * 
   * @param {string} dateString - ISO date string from the database
   * @returns {string} Formatted relative time string
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString); // Convert string to Date object
    const now = new Date(); // Current time
    // Calculate difference in hours
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    // If less than 1 hour ago, show "Just now"
    if (diffInHours < 1) {
      return 'Just now';
    } 
    // If less than 24 hours ago, show hours (e.g., "5h ago")
    else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } 
    // If more than 24 hours ago, show the actual date
    else {
      return date.toLocaleDateString();
    }
  };

  // Render the task item component
  return (
    <div className={`task-item ${task.completed ? 'completed' : ''} ${loading ? 'loading' : ''} fade-in`}>
        <div className="task-content">
          <div className="task-main">
            {/* Custom checkbox for marking task as complete/incomplete */}
            <div className="checkbox-container">
              {/* Hidden native checkbox that handles the actual functionality */}
              <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={handleToggle}
                disabled={loading || editing} // Disable during loading or editing
                className="task-checkbox"
              />
              {/* Custom styled checkbox that users actually see */}
              <div className="checkbox-custom">
                {/* Show checkmark only when task is completed */}
                {task.completed && <span className="checkmark">✓</span>}
              </div>
            </div>
            
            {/* Task title and description area */}
            <div className="task-text-container">
              {editing ? (
                // Edit mode: Show input fields for title and description
                <div className="edit-form">
                  {/* Title input field */}
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="edit-input"
                    maxLength={40} // Limit title length
                    disabled={loading}
                    autoFocus // Automatically focus when entering edit mode
                    placeholder="Task title..."
                    onKeyDown={(e) => {
                      // Save on Enter key
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleEdit();
                      }
                      // Cancel on Escape key
                      if (e.key === 'Escape') handleCancel();
                    }}
                  />
                  {/* Show title validation error if any */}
                  {errors.title && <div className="error-text">{errors.title}</div>}
                  
                  {/* Description textarea */}
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="edit-textarea"
                    maxLength={500} // Limit description length
                    disabled={loading}
                    placeholder="Task description (optional)..."
                    rows="2"
                    onKeyDown={(e) => {
                      // Save on Ctrl+Enter
                      if (e.key === 'Enter' && e.ctrlKey) {
                        e.preventDefault();
                        handleEdit();
                      }
                      // Cancel on Escape
                      if (e.key === 'Escape') handleCancel();
                    }}
                  />
                  {/* Show description validation error if any */}
                  {errors.description && <div className="error-text">{errors.description}</div>}
                  
                  {/* Helper text showing keyboard shortcuts and character counts */}
                  <div className="edit-hints">
                    <span>Press Enter to save, Esc to cancel</span>
                    <span>{editTitle.length}/40 • {editDescription.length}/500</span>
                  </div>
                </div>
              ) : (
                // View mode: Show task title, description, and metadata
                <div className="task-text">
                  {/* Task title */}
                  <span className="task-title">{task.title}</span>
                  {/* Task description (only show if it exists) */}
                  {task.description && (
                    <span className="task-description">{task.description}</span>
                  )}
                  {/* Creation and update timestamps */}
                  <span className="task-meta">
                    Created {formatDate(task.createdAt)}
                    {/* Only show update time if task was actually updated */}
                    {task.updatedAt !== task.createdAt && (
                      <span> • Updated {formatDate(task.updatedAt)}</span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons (Edit/Delete or Save/Cancel) */}
          <div className="task-actions">
            {editing ? (
              // Edit mode buttons
              <>
                <button 
                  onClick={handleEdit} 
                  disabled={loading || !editTitle.trim()} // Disable if loading or title is empty
                  className="btn-sm btn-success"
                  title="Save changes (Enter)"
                >
                  Save
                </button>
                <button 
                  onClick={handleCancel} 
                  disabled={loading}
                  className="btn-sm btn-secondary"
                  title="Cancel editing (Esc)"
                >
                  Cancel
                </button>
              </>
            ) : (
              // View mode buttons
              <>
                <button 
                  onClick={handleEdit} 
                  disabled={loading}
                  className="btn-sm btn-secondary"
                  title="Edit task"
                >
                  Edit
                </button>
                <button 
                  onClick={handleDeleteClick} 
                  disabled={loading}
                  className="btn-sm btn-danger"
                  title="Delete task"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Error message area for toggle/update errors */}
        {(errors.toggle || errors.update) && (
          <div className="error-message">
            {errors.toggle || errors.update}
          </div>
        )}

        {/* 
          Inline CSS styles for the TaskItem component
          Using styled-jsx for component-scoped CSS that doesn't affect other components
          This includes:
          - Layout and spacing for the task container
          - Hover effects and animations
          - Custom checkbox styling
          - Edit mode form styling
          - Responsive design for mobile devices
          - Color scheme using CSS custom properties (variables)
        */}
        <style jsx>{`
          .task-item {
            background: var(--bg-secondary, #f7fafc);
            border: 2px solid var(--border-color, #e2e8f0);
            border-radius: 12px;
            margin-bottom: 0.75rem;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }

          .task-item:hover {
            border-color: var(--primary-color, #1a365d);
            box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
            transform: translateY(-1px);
          }

          .task-item.completed {
            border-color: var(--success-color, #38a169);
            background: linear-gradient(135deg, rgba(72, 187, 120, 0.05), rgba(72, 187, 120, 0.02));
          }

          .task-item.loading {
            opacity: 0.7;
            pointer-events: none;
          }

          .task-content {
            padding: 1.25rem;
          }

          .task-main {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            margin-bottom: 0.5rem;
          }

          .checkbox-container {
            position: relative;
            margin-top: 0.125rem;
          }

          .task-checkbox {
            opacity: 0;
            position: absolute;
            width: 1.25rem;
            height: 1.25rem;
            margin: 0;
            cursor: pointer;
          }

          .checkbox-custom {
            width: 1.25rem;
            height: 1.25rem;
            border: 2px solid var(--primary-color, #1a365d);
            border-radius: 4px;
            background: var(--bg-secondary, #f7fafc);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            cursor: pointer;
            box-shadow: 0 0 0 1px var(--primary-color, #1a365d);
          }

          .task-checkbox:hover + .checkbox-custom {
            border-color: var(--primary-dark, #2d3748);
            box-shadow: 0 0 0 2px var(--primary-color, #1a365d);
          }

          .task-checkbox:focus + .checkbox-custom {
            border-color: var(--primary-color, #1a365d);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
            outline: none;
          }

          .task-checkbox:checked + .checkbox-custom {
            background: var(--success-color, #38a169);
            border-color: var(--success-color, #38a169);
            box-shadow: 0 0 0 1px var(--success-color, #38a169);
          }

          .task-checkbox:checked:hover + .checkbox-custom {
            background: var(--success-dark, #059669);
            border-color: var(--success-dark, #059669);
            box-shadow: 0 0 0 2px var(--success-color, #38a169);
          }

          .checkmark {
            color: white;
            font-size: 0.875rem;
            font-weight: bold;
          }

          .task-text-container {
            flex: 1;
          }

          .task-text {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }

          .task-title {
            font-size: 1rem;
            font-weight: 500;
            color: var(--text-primary, #1a202c);
            line-height: 1.4;
            transition: all 0.2s ease;
          }

          .task-description {
            font-size: 0.875rem;
            color: var(--text-secondary, #2d3748);
            line-height: 1.4;
            margin-top: 0.25rem;
            white-space: pre-wrap;
          }

          .task-item.completed .task-title {
            text-decoration: line-through;
            color: var(--text-muted, #718096);
          }

          .task-item.completed .task-description {
            text-decoration: line-through;
            color: var(--text-muted, #718096);
          }

          .task-meta {
            font-size: 0.75rem;
            color: var(--text-muted, #718096);
            font-weight: 400;
          }

          .edit-input {
            width: 100%;
            padding: 0.5rem 0.75rem;
            border: 2px solid var(--primary-color, #1a365d);
            border-radius: 6px;
            font-size: 1rem;
            background: var(--bg-secondary, #f7fafc);
            color: var(--text-primary, #1a202c);
            margin-bottom: 0.5rem;
          }

          .edit-input:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          }

          .edit-textarea {
            width: 100%;
            padding: 0.5rem 0.75rem;
            border: 2px solid var(--border-color, #e2e8f0);
            border-radius: 6px;
            font-size: 0.875rem;
            background: var(--bg-secondary, #f7fafc);
            color: var(--text-primary, #1a202c);
            resize: vertical;
            min-height: 60px;
            margin-bottom: 0.5rem;
            font-family: inherit;
          }

          .edit-textarea:focus {
            outline: none;
            border-color: var(--primary-color, #1a365d);
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          }

          .edit-form {
            width: 100%;
          }

          .edit-hints {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.75rem;
            color: var(--text-muted, #718096);
            margin-bottom: 0.5rem;
          }

          .error-text {
            color: var(--error-color, #e53e3e);
            font-size: 0.75rem;
            margin-bottom: 0.5rem;
          }

          .task-actions {
            display: flex;
            gap: 0.5rem;
            align-items: center;
            margin-left: auto;
          }

          .error-message {
            padding: 0.75rem 1.25rem 0;
            color: var(--error-color, #e53e3e);
            font-size: 0.875rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 0.25rem;
          }

          @media (max-width: 640px) {
            .task-main {
              flex-wrap: wrap;
            }
            
            .task-actions {
              width: 100%;
              margin-left: 0;
              margin-top: 0.75rem;
              justify-content: flex-end;
            }
          }
        `}</style>
    </div>
  );
};

export default TaskItem;
