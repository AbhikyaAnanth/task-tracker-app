// Import Task model to work with task data in the database
const Task = require('../models/Task');
// Import mongoose to work with MongoDB IDs and validation
const mongoose = require('mongoose');

// CONTROLLER FUNCTION: Get all tasks for the current user
// This handles GET requests to /tasks
exports.getTasks = async (req, res) => {
  try {
    // Find all tasks that belong to the currently logged-in user
    // sort({ createdAt: -1 }) means show newest tasks first
    const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
    
    // Send the tasks back as JSON
    res.json(tasks);
  } catch (err) {
    // If something goes wrong, log the error and send error message
    console.error('Get tasks error:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// CONTROLLER FUNCTION: Create a new task
// This handles POST requests to /tasks
exports.createTask = async (req, res) => {
  // Get the title and description from the request body
  const { title, description } = req.body;
  
  // VALIDATION: Check if the title is valid
  if (!title || title.trim().length === 0) {
    // If title is missing or empty, send error
    return res.status(400).json({ error: 'Title is required and cannot be empty' });
  }
  
  // Check if title is too long
  if (title.length > 40) {
    return res.status(400).json({ error: 'Title cannot exceed 40 characters' });
  }

  // Check if description is too long (if provided)
  if (description && description.length > 500) {
    return res.status(400).json({ error: 'Description cannot exceed 500 characters' });
  }

  try {
    // Create the task data object
    const taskData = { 
      title: title.trim(),  // Remove extra spaces from title
      description: description ? description.trim() : '', // Remove spaces, or use empty string
      userId: req.userId    // Associate this task with the current user
    };
    
    // Create a new task in the database
    const newTask = new Task(taskData);
    await newTask.save(); // Actually save it to the database
    
    // Send the new task back with status 201 (created)
    res.status(201).json(newTask);
  } catch (err) {
    // If something goes wrong, log error and send error message
    console.error('Create task error:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

// CONTROLLER FUNCTION: Update an existing task
// This handles PUT requests to /tasks/:id
exports.updateTask = async (req, res) => {
  // Get the task ID from the URL (like /tasks/123abc)
  const { id } = req.params;
  // Get the new data from the request body
  const { title, description, completed } = req.body;

  // VALIDATION: Check if the ID is a valid MongoDB ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  // VALIDATION: Check title if it's being updated
  if (title !== undefined) {
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }
    if (title.length > 40) {
      return res.status(400).json({ error: 'Title cannot exceed 40 characters' });
    }
  }

  // VALIDATION: Check description if it's being updated
  if (description !== undefined && description.length > 500) {
    return res.status(400).json({ error: 'Description cannot exceed 500 characters' });
  }

  try {
    // Build an object with only the fields that are being updated
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description ? description.trim() : '';
    if (completed !== undefined) updateData.completed = Boolean(completed);

    // Update the task, but ONLY if it belongs to the current user
    // This prevents users from editing other people's tasks
    const updated = await Task.findOneAndUpdate(
      { _id: id, userId: req.userId }, // Find task with this ID that belongs to current user
      updateData,                     // Apply these updates
      { new: true, runValidators: true } // Return updated task and validate data
    );

    // If no task was found (either doesn't exist or doesn't belong to user)
    if (!updated) {
      return res.status(404).json({ error: 'Task not found or access denied' });
    }

    // Send back the updated task
    res.json(updated);
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

// CONTROLLER FUNCTION: Delete a task
// This handles DELETE requests to /tasks/:id
exports.deleteTask = async (req, res) => {
  // Get the task ID from the URL
  const { id } = req.params;
  
  // VALIDATION: Check if the ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  try {
    // Delete the task, but ONLY if it belongs to the current user
    const deletedTask = await Task.findOneAndDelete({ _id: id, userId: req.userId });
    
    // If no task was found/deleted
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found or access denied' });
    }

    // Send success message with the deleted task data
    res.json({ message: 'Task deleted successfully', deletedTask });
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

// CONTROLLER FUNCTION: Get one specific task by ID
// This handles GET requests to /tasks/:id
exports.getTaskById = async (req, res) => {
  // Get the task ID from the URL
  const { id } = req.params;
  
  // VALIDATION: Check if the ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  try {
    // Find the task, but ONLY if it belongs to the current user
    const task = await Task.findOne({ _id: id, userId: req.userId });
    
    // If no task was found
    if (!task) {
      return res.status(404).json({ error: 'Task not found or access denied' });
    }

    // Send back the task
    res.json(task);
  } catch (err) {
    console.error('Get task by ID error:', err);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};
