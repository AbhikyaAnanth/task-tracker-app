import React, { useState } from 'react';
import { updateTask } from '../services/api';
import { validateTaskTitle, validateTaskDescription } from '../utils/validation';

const TaskItem = ({ task, onUpdate, onDeleteRequest }) => {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [errors, setErrors] = useState({});

  const handleToggle = async () => {
    setLoading(true);
    setErrors({});
    try {
      await updateTask(task._id, { completed: !task.completed });
      onUpdate();
    } catch (err) {
      setErrors({ toggle: 'Failed to update task' });
      console.error('Error toggling task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    onDeleteRequest(task);
  };

  const handleEdit = async () => {
    if (!editing) {
      setEditing(true);
      return;
    }

    // Validate inputs
    const titleError = validateTaskTitle(editTitle);
    const descriptionError = validateTaskDescription(editDescription);
    
    if (titleError || descriptionError) {
      setErrors({
        title: titleError,
        description: descriptionError
      });
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      await updateTask(task._id, { 
        title: editTitle.trim(),
        description: editDescription.trim()
      });
      setEditing(false);
      onUpdate();
    } catch (err) {
      setErrors({ update: 'Failed to update task' });
      console.error('Error updating task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setErrors({});
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''} ${loading ? 'loading' : ''} fade-in`}>
        <div className="task-content">
          <div className="task-main">
            <div className="checkbox-container">
              <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={handleToggle}
                disabled={loading || editing}
                className="task-checkbox"
              />
              <div className="checkbox-custom">
                {task.completed && <span className="checkmark">✓</span>}
              </div>
            </div>
            
            <div className="task-text-container">
              {editing ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="edit-input"
                    maxLength={40}
                    disabled={loading}
                    autoFocus
                    placeholder="Task title..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleEdit();
                      }
                      if (e.key === 'Escape') handleCancel();
                    }}
                  />
                  {errors.title && <div className="error-text">{errors.title}</div>}
                  
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="edit-textarea"
                    maxLength={500}
                    disabled={loading}
                    placeholder="Task description (optional)..."
                    rows="2"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        e.preventDefault();
                        handleEdit();
                      }
                      if (e.key === 'Escape') handleCancel();
                    }}
                  />
                  {errors.description && <div className="error-text">{errors.description}</div>}
                  
                  <div className="edit-hints">
                    <span>Press Enter to save, Esc to cancel</span>
                    <span>{editTitle.length}/40 • {editDescription.length}/500</span>
                  </div>
                </div>
              ) : (
                <div className="task-text">
                  <span className="task-title">{task.title}</span>
                  {task.description && (
                    <span className="task-description">{task.description}</span>
                  )}
                  <span className="task-meta">
                    Created {formatDate(task.createdAt)}
                    {task.updatedAt !== task.createdAt && (
                      <span> • Updated {formatDate(task.updatedAt)}</span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="task-actions">
            {editing ? (
              <>
                <button 
                  onClick={handleEdit} 
                  disabled={loading || !editTitle.trim()}
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
        
        {(errors.toggle || errors.update) && (
          <div className="error-message">
            {errors.toggle || errors.update}
          </div>
        )}

        <style jsx>{`
          .task-item {
            background: var(--bg-secondary);
            border: 2px solid var(--border-color);
            border-radius: 12px;
            margin-bottom: 0.75rem;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }

          .task-item:hover {
            border-color: var(--primary-color);
            box-shadow: var(--shadow-md);
            transform: translateY(-1px);
          }

          .task-item.completed {
            border-color: var(--success-color);
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
            border: 2px solid var(--border-color);
            border-radius: 4px;
            background: var(--bg-secondary);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            cursor: pointer;
          }

          .task-checkbox:checked + .checkbox-custom {
            background: var(--success-color);
            border-color: var(--success-color);
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
            color: var(--text-primary);
            line-height: 1.4;
            transition: all 0.2s ease;
          }

          .task-description {
            font-size: 0.875rem;
            color: var(--text-secondary);
            line-height: 1.4;
            margin-top: 0.25rem;
            white-space: pre-wrap;
          }

          .task-item.completed .task-title {
            text-decoration: line-through;
            color: var(--text-muted);
          }

          .task-item.completed .task-description {
            text-decoration: line-through;
            color: var(--text-muted);
          }

          .task-meta {
            font-size: 0.75rem;
            color: var(--text-muted);
            font-weight: 400;
          }

          .edit-input {
            width: 100%;
            padding: 0.5rem 0.75rem;
            border: 2px solid var(--primary-color);
            border-radius: 6px;
            font-size: 1rem;
            background: var(--bg-secondary);
            color: var(--text-primary);
            margin-bottom: 0.5rem;
          }

          .edit-input:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          }

          .edit-textarea {
            width: 100%;
            padding: 0.5rem 0.75rem;
            border: 2px solid var(--border-color);
            border-radius: 6px;
            font-size: 0.875rem;
            background: var(--bg-secondary);
            color: var(--text-primary);
            resize: vertical;
            min-height: 60px;
            margin-bottom: 0.5rem;
            font-family: inherit;
          }

          .edit-textarea:focus {
            outline: none;
            border-color: var(--primary-color);
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
            color: var(--text-muted);
            margin-bottom: 0.5rem;
          }

          .error-text {
            color: var(--error-color);
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
            color: var(--error-color);
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
