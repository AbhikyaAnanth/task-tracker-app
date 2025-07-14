import { useState, useEffect, useCallback } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';

const useTasks = (user) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Clear tasks when user changes
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setError(null);
    }
  }, [user]);

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data } = await getTasks();
      setTasks(data);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
      // Clear tasks on auth error (user might be logged out)
      if (err.response?.status === 401) {
        setTasks([]);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Add a new task
  const addTask = async (taskData) => {
    if (!user) return;
    
    setError(null);
    try {
      const { data } = await createTask(taskData);
      setTasks(prev => [data, ...prev]); // Add to beginning of array
      return data;
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
