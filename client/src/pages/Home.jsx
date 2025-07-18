// Import React library for creating functional components
import React from 'react';
// Import TaskForm component for creating new tasks
import TaskForm from './components/TaskForm';
// Import TaskList component for displaying existing tasks
import TaskList from './components/TaskList';

/**
 * Home Component (App)
 * 
 * This appears to be a legacy or alternative version of the main App component.
 * It provides a simple layout with a title, task creation form, and task list.
 * 
 * Features:
 * - Simple heading for the application
 * - Task creation form with reload callback
 * - Task list display
 * 
 * Note: This component uses window.location.reload() which is not the most
 * React-friendly approach. In a production app, you would typically use
 * state management to update the task list when a new task is created.
 * 
 * @returns {JSX.Element} Home page layout with task management interface
 */
function App() {
  return (
    <div className="App">
      {/* Main application title */}
      <h1>Task Tracker</h1>
      
      {/* 
        Task creation form
        onTaskCreated callback reloads the page to refresh the task list
        This is a simple but not optimal approach - better would be to
        update state and re-render the TaskList component
      */}
      <TaskForm onTaskCreated={() => window.location.reload()} />
      
      {/* Task list component to display all tasks */}
      <TaskList />
    </div>
  );
}

// Export the App component for use in other parts of the application
export default App;
