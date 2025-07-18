// Import React library and the useState hook
import React, { useState } from 'react';
// Import TaskItem component to display individual tasks
import TaskItem from './TaskItem';
// Import Modal component for delete confirmations
import Modal from './Modal';
// Import deleteTask function to delete tasks from backend
import { deleteTask } from '../services/api';

// COMPONENT: TaskList - This displays all the user's tasks in a list
// Think of this like a digital todo list that can be filtered and organized
const TaskList = ({ tasks, loading, error, fetchTasks }) => {
  
  // STATE: Keep track of which filter is currently selected
  // Users can view: all tasks, just pending tasks, or just completed tasks
  const [filter, setFilter] = useState('all'); // Start showing all tasks
  
  // STATE: Keep track of which task is being deleted (for confirmation modal)
  const [deleteModalTask, setDeleteModalTask] = useState(null); // null = no modal open
  
  // STATE: Keep track of whether we're currently deleting a task
  const [deleting, setDeleting] = useState(false); // false = not deleting anything
  
  // FUNCTION: Handle when user clicks the delete button on a task
  // This doesn't delete immediately - it opens a confirmation modal first
  const handleDeleteRequest = (task) => {
    setDeleteModalTask(task); // Set the task to be deleted (this opens the modal)
  };
  
  // FUNCTION: Handle when user confirms they want to delete the task
  const handleDeleteConfirm = async () => {
    if (!deleteModalTask) return; // Safety check - make sure there's a task to delete
    
    setDeleting(true); // Show loading state on delete button
    try {
      // Actually delete the task from the backend
      await deleteTask(deleteModalTask._id);
      setDeleteModalTask(null); // Close the modal
      fetchTasks(); // Refresh the task list to remove the deleted task
    } catch (err) {
      console.error('Error deleting task:', err); // Log error for debugging
      // Note: In a real app, you might want to show an error message to the user
    } finally {
      setDeleting(false); // Stop showing loading state
    }
  };
  
  // FUNCTION: Handle when user cancels the delete operation
  const handleDeleteCancel = () => {
    setDeleteModalTask(null); // Close the modal without deleting anything
  };
  
  // COMPUTED VALUE: Filter the tasks based on the current filter
  // This creates a new array with only the tasks that match the filter
  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;   // Show only incomplete tasks
    if (filter === 'completed') return task.completed;  // Show only completed tasks
    return true; // For 'all' filter, show everything
  });
  
  // EARLY RETURN: If tasks are still loading, show loading spinner
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div> {/* Spinning animation */}
        <div className="loading-text">Loading your tasks...</div>
      </div>
    );
  }
  
  // EARLY RETURN: If there was an error loading tasks, show error message
  if (error) {
    return (
      <div className="error-container">
        <div className="error-title">Something went wrong</div>
        <div className="error-message">{error}</div> {/* Show the actual error */}
        <button onClick={fetchTasks} className="btn-primary">
          Try Again {/* Let user retry loading tasks */}
        </button>
      </div>
    );
  }
  
  // EARLY RETURN: If user has no tasks at all, show empty state
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

  // MAIN RENDER: Show the task list with filters and tasks
  return (
    <div className="task-list-container">
      
      {/* HEADER SECTION: Title and filter buttons */}
      <div className="task-list-header">
        <h3 className="task-list-title">
          Your Tasks ({filteredTasks.length}) {/* Show count of filtered tasks */}
        </h3>
        
        {/* FILTER TABS: Buttons to switch between different views */}
        <div className="filter-tabs">
          <button 
            onClick={() => setFilter('all')} // Show all tasks when clicked
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`} // Highlight if active
          >
            All ({tasks.length}) {/* Show total count */}
          </button>
          <button 
            onClick={() => setFilter('pending')} // Show only incomplete tasks
            className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
          >
            Pending ({tasks.filter(t => !t.completed).length}) {/* Count incomplete tasks */}
          </button>
          <button 
            onClick={() => setFilter('completed')} // Show only completed tasks
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
          >
            Done ({tasks.filter(t => t.completed).length}) {/* Count completed tasks */}
          </button>
        </div>
      </div>

      {/* CONDITIONAL RENDER: Show message if no tasks match the filter */}
      {filteredTasks.length === 0 ? (
        <div className="no-results">
          <div className="no-results-text">
            {/* Show different messages based on which filter is active */}
            {filter === 'pending' && 'All tasks completed! Great job!'}
            {filter === 'completed' && 'No completed tasks yet. Keep going!'}
            {filter === 'all' && 'No tasks found.'}
          </div>
        </div>
      ) : (
        /* TASK LIST: Show all the filtered tasks */
        <div className="task-list">
          {filteredTasks.map((task, index) => (
            /* Render each task with animation delay */
            <div 
              key={task._id}  // Unique key for React (uses MongoDB ID)
              className="task-item-wrapper"
              style={{ animationDelay: `${index * 0.1}s` }} // Stagger animations
            >
              <TaskItem 
                task={task}  // Pass the task data to TaskItem component
                onUpdate={fetchTasks}  // Function to refresh tasks after updates
                onDeleteRequest={handleDeleteRequest} // Function to request deletion
              />
            </div>
          ))}
        </div>
      )}

      {/* CSS STYLES: All the styling for this component */}
      {/* styled-jsx allows us to write CSS directly in the component */}
      <style jsx>{`
        /* Main container for the entire task list */
        .task-list-container {
          margin-top: 1rem;
        }

        /* Header area with title and filter buttons */
        .task-list-header {
          display: flex;
          justify-content: space-between; /* Title on left, filters on right */
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap; /* Allow wrapping on small screens */
          gap: 1rem;
        }

        /* "Your Tasks" title styling */
        .task-list-title {
          font-size: 1.25rem;
          font-weight: 700; /* Bold text */
          color: var(--text-primary);
          margin: 0;
        }

        /* Container for the filter buttons */
        .filter-tabs {
          display: flex;
          background: var(--bg-tertiary); /* Light background */
          border-radius: 8px;
          padding: 0.25rem;
          gap: 0.25rem; /* Small space between buttons */
        }

        /* Individual filter button styling */
        .filter-tab {
          padding: 0.5rem 1rem;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer; /* Show hand cursor on hover */
          transition: all 0.2s ease; /* Smooth color changes */
          white-space: nowrap; /* Don't wrap text */
        }

        /* Filter button when you hover over it */
        .filter-tab:hover {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        /* Active (selected) filter button styling */
        .filter-tab.active {
          background: var(--primary-color); /* Blue background */
          color: white;
          box-shadow: var(--shadow-sm); /* Small shadow */
        }

        /* Container for all the task items */
        .task-list {
          display: flex;
          flex-direction: column; /* Stack tasks vertically */
        }

        /* Wrapper around each task item (for animation) */
        .task-item-wrapper {
          animation: slideIn 0.3s ease-out forwards; /* Slide in animation */
          opacity: 0; /* Start invisible */
        }

        /* Message when no tasks match the current filter */
        .no-results {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--text-muted);
        }

        .no-results-text {
          font-size: 1rem;
          font-weight: 500;
        }

        /* Error message container styling */
        .error-container {
          text-align: center;
          padding: 3rem 1rem;
          background: rgba(245, 101, 101, 0.05); /* Very light red background */
          border: 2px solid rgba(245, 101, 101, 0.2); /* Light red border */
          border-radius: 12px;
          margin: 2rem 0;
        }

        /* Error title styling */
        .error-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--error-color); /* Red color */
          margin-bottom: 0.5rem;
        }

        /* Error message text styling */
        .error-message {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        /* ANIMATION: Slide in effect for task items */
        @keyframes slideIn {
          from {
            opacity: 0; /* Start invisible */
            transform: translateY(10px); /* Start slightly below */
          }
          to {
            opacity: 1; /* End visible */
            transform: translateY(0); /* End in normal position */
          }
        }

        /* RESPONSIVE: Adjustments for mobile phones */
        @media (max-width: 640px) {
          .task-list-header {
            flex-direction: column; /* Stack title and filters vertically */
            align-items: stretch;
          }
          
          .filter-tabs {
            justify-content: center; /* Center the filter buttons */
          }
          
          .filter-tab {
            flex: 1; /* Make buttons equal width */
            text-align: center;
          }
        }
      `}</style>
      
      {/* DELETE CONFIRMATION MODAL */}
      {/* This modal appears when user tries to delete a task */}
      <Modal
        isOpen={!!deleteModalTask} // Show modal if there's a task to delete
        onClose={handleDeleteCancel} // Function to close without deleting
        onConfirm={handleDeleteConfirm} // Function to confirm deletion
        title="Delete Task" // Modal title
        message={deleteModalTask ? `Are you sure you want to delete "${deleteModalTask.title}"? This action cannot be undone.` : ''} // Warning message
        confirmText={deleting ? "Deleting..." : "Delete"} // Button text (changes when deleting)
        cancelText="Cancel" // Cancel button text
        type="danger" // Red styling for dangerous action
        disabled={deleting} // Disable buttons while deleting
      />
    </div>
  );
};

// Export this component so other files can import and use it
export default TaskList;
