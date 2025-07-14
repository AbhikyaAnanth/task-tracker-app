import React, { useState } from 'react';
import TaskItem from './TaskItem';
import Modal from './Modal';
import { deleteTask } from '../services/api';

const TaskList = ({ tasks, loading, error, fetchTasks }) => {
  const [filter, setFilter] = useState('all'); // all, pending, completed
  const [deleteModalTask, setDeleteModalTask] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteRequest = (task) => {
    // Close any existing modal and open new one
    setDeleteModalTask(task);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModalTask) return;
    
    setDeleting(true);
    try {
      await deleteTask(deleteModalTask._id);
      setDeleteModalTask(null);
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
      // Keep modal open on error so user can try again
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalTask(null);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading your tasks...</div>
      </div>
    );
  }

  if (error) {
    return (        <div className="error-container">
          <div className="error-title">Something went wrong</div>
          <div className="error-message">{error}</div>
          <button onClick={fetchTasks} className="btn-primary">
            Try Again
          </button>
        </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-title">No tasks yet!</div>
        <div className="empty-state-description">
          Start by adding your first task above.
        </div>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h3 className="task-list-title">
          Your Tasks ({filteredTasks.length})
        </h3>
        
        <div className="filter-tabs">
          <button 
            onClick={() => setFilter('all')}
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          >
            All ({tasks.length})
          </button>
          <button 
            onClick={() => setFilter('pending')}
            className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
          >
            Pending ({tasks.filter(t => !t.completed).length})
          </button>
          <button 
            onClick={() => setFilter('completed')}
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
          >
            Done ({tasks.filter(t => t.completed).length})
          </button>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="no-results">
          <div className="no-results-text">
            {filter === 'pending' && 'All tasks completed! Great job!'}
            {filter === 'completed' && 'No completed tasks yet. Keep going!'}
            {filter === 'all' && 'No tasks found.'}
          </div>
        </div>
      ) : (
        <div className="task-list">
          {filteredTasks.map((task, index) => (
            <div 
              key={task._id} 
              className="task-item-wrapper"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <TaskItem 
                task={task} 
                onUpdate={fetchTasks} 
                onDeleteRequest={handleDeleteRequest}
              />
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .task-list-container {
          margin-top: 1rem;
        }

        .task-list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .task-list-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .filter-tabs {
          display: flex;
          background: var(--bg-tertiary);
          border-radius: 8px;
          padding: 0.25rem;
          gap: 0.25rem;
        }

        .filter-tab {
          padding: 0.5rem 1rem;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .filter-tab:hover {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        .filter-tab.active {
          background: var(--primary-color);
          color: white;
          box-shadow: var(--shadow-sm);
        }

        .task-list {
          display: flex;
          flex-direction: column;
        }

        .task-item-wrapper {
          animation: slideIn 0.3s ease-out forwards;
          opacity: 0;
        }

        .no-results {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--text-muted);
        }

        .no-results-text {
          font-size: 1rem;
          font-weight: 500;
        }

        .error-container {
          text-align: center;
          padding: 3rem 1rem;
          background: rgba(245, 101, 101, 0.05);
          border: 2px solid rgba(245, 101, 101, 0.2);
          border-radius: 12px;
          margin: 2rem 0;
        }

        .error-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--error-color);
          margin-bottom: 0.5rem;
        }

        .error-message {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 640px) {
          .task-list-header {
            flex-direction: column;
            align-items: stretch;
          }
          
          .filter-tabs {
            justify-content: center;
          }
          
          .filter-tab {
            flex: 1;
            text-align: center;
          }
        }
      `}</style>
      
      {/* Centralized Delete Modal */}
      <Modal
        isOpen={!!deleteModalTask}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message={deleteModalTask ? `Are you sure you want to delete "${deleteModalTask.title}"? This action cannot be undone.` : ''}
        confirmText={deleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        type="danger"
        disabled={deleting}
      />
    </div>
  );
};

export default TaskList;
