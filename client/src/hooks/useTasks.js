// Import React hooks for state management and side effects
import { useState, useEffect, useCallback } from 'react';
// Import API functions for task management
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';

/**
 * useTasks Hook
 * 
 * A custom React hook that manages task-related state and operations.
 * This hook provides a clean interface for components to interact with tasks
 * without having to manage API calls and state updates directly.
 * 
 * Features:
 * - Fetches tasks when user is authenticated
 * - Manages loading and error states
 * - Provides functions for CRUD operations (Create, Read, Update, Delete)
 * - Automatically handles optimistic updates for better UX
 * - Clears task data when user logs out
 * 
 * @param {Object|null} user - Current authenticated user object (null if not logged in)
 * @returns {Object} Object containing tasks array, loading state, error state, and action functions
 */
const useTasks = (user) => {
  // State for storing the list of tasks
  const [tasks, setTasks] = useState([]);
  
  // State for tracking loading state (true during API calls)
  const [loading, setLoading] = useState(false);
  
  // State for storing error messages
  const [error, setError] = useState(null);

  /**
   * Effect to clear tasks when user logs out
   * This ensures that tasks from one user don't show up for another user
   */
  useEffect(() => {
    if (!user) {
      setTasks([]); // Clear tasks array
      setError(null); // Clear any error messages
    }
  }, [user]); // Run when user state changes

  /**
   * Fetches all tasks for the current user from the server
   * 
   * This function:
   * 1. Checks if user is authenticated
   * 2. Makes API call to get tasks
   * 3. Updates local state with fetched tasks
   * 4. Handles errors appropriately (including auth errors)
   * 
   * Uses useCallback to prevent unnecessary re-renders when passed to child components
   */
  const fetchTasks = useCallback(async () => {
    // Don't fetch if no user is logged in
    if (!user) {
      setTasks([]);
      return;
    }

    setLoading(true); // Show loading state
    setError(null); // Clear previous errors
    try {
      // Call API to get user's tasks
      const { data } = await getTasks();
      setTasks(data); // Update tasks state with fetched data
    } catch (err) {
      // Handle API errors
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
      
      // If authentication error (401), clear tasks (user might be logged out)
      if (err.response?.status === 401) {
        setTasks([]);
      }
    } finally {
      // Always turn off loading state
      setLoading(false);
    }
  }, [user]); // Recreate function only when user changes

  /**
   * Adds a new task
   * 
   * This function:
   * 1. Calls API to create task on server
   * 2. Optimistically updates local state (adds task immediately)
   * 3. Returns the created task data
   * 
   * @param {Object} taskData - Object containing title and description
   * @returns {Object} The created task object from the server
   */
  const addTask = async (taskData) => {
    // Don't add task if no user is logged in
    if (!user) return;
    
    setError(null); // Clear previous errors
    try {
      // Call API to create task on server
      const { data } = await createTask(taskData);
      // Add new task to beginning of tasks array (most recent first)
      setTasks(prev => [data, ...prev]);
      return data; // Return created task
    } catch (err) {
      setError('Failed to create task');
      console.error('Error creating task:', err);
      throw err;
    }
  };

  // Update an existing task
  const modifyTask = async (id, updates) => {
    if (!user) return;
    
    setError(null);
    try {
      const { data } = await updateTask(id, updates);
      setTasks(prev => prev.map(task => 
        task._id === id ? data : task
      ));
      return data;
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
      throw err;
    }
  };

  // Delete a task
  const removeTask = async (id) => {
    if (!user) return;
    
    setError(null);
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(task => task._id !== id));
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
      throw err;
    }
  };

  // Toggle task completion
  const toggleTask = async (id) => {
    if (!user) return;
    
    const task = tasks.find(t => t._id === id);
    if (task) {
      await modifyTask(id, { completed: !task.completed });
    }
  };

  // Fetch tasks when user changes
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, fetchTasks]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    modifyTask,
    removeTask,
    toggleTask
  };
};

export default useTasks;
