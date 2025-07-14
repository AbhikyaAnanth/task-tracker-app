import { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';

const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all tasks
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getTasks();
      setTasks(data);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new task
  const addTask = async (taskData) => {
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
    const task = tasks.find(t => t._id === id);
    if (task) {
      await modifyTask(id, { completed: !task.completed });
    }
  };

  // Load tasks on hook initialization
  useEffect(() => {
    fetchTasks();
  }, []);

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
