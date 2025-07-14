const Task = require('../models/Task');
const mongoose = require('mongoose');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error('Get tasks error:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

exports.createTask = async (req, res) => {
  const { title, description } = req.body;
  
  // Validation
  if (!title || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title is required and cannot be empty' });
  }
  
  if (title.length > 40) {
    return res.status(400).json({ error: 'Title cannot exceed 40 characters' });
  }

  if (description && description.length > 500) {
    return res.status(400).json({ error: 'Description cannot exceed 500 characters' });
  }

  try {
    const taskData = { 
      title: title.trim(),
      description: description ? description.trim() : ''
    };
    const newTask = new Task(taskData);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  // Validation for title if provided
  if (title !== undefined) {
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }
    if (title.length > 40) {
      return res.status(400).json({ error: 'Title cannot exceed 40 characters' });
    }
  }

  // Validation for description if provided
  if (description !== undefined && description.length > 500) {
    return res.status(400).json({ error: 'Description cannot exceed 500 characters' });
  }

  try {
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description ? description.trim() : '';
    if (completed !== undefined) updateData.completed = Boolean(completed);

    const updated = await Task.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  
  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  try {
    const deletedTask = await Task.findByIdAndDelete(id);
    
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully', deletedTask });
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

exports.getTaskById = async (req, res) => {
  const { id } = req.params;
  
  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  try {
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (err) {
    console.error('Get task by ID error:', err);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};
