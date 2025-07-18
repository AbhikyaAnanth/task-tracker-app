// Import Express library to create routes
const express = require('express');
// Create a router to organize task-related routes
const router = express.Router();

// Import all the controller functions that handle the actual business logic
// These are like workers that do the real work for each route
const {
  getTasks,      // Function to get all tasks for a user
  getTaskById,   // Function to get one specific task
  createTask,    // Function to create a new task
  updateTask,    // Function to update an existing task
  deleteTask     // Function to delete a task
} = require('../controllers/taskController');

// ROUTE: GET /tasks - Get all tasks for the logged-in user
// When someone visits /tasks, call the getTasks function
router.get('/', getTasks);

// ROUTE: GET /tasks/debug - Special route for debugging (development only)
// This shows detailed information about the database and tasks
router.get('/debug', async (req, res) => {
  const Task = require('../models/Task');    // Import Task model
  const mongoose = require('mongoose');      // Import mongoose for database info
  
  try {
    // Get all tasks for the current user
    const tasks = await Task.find({ userId: req.userId });
    
    // Create an object with debugging information
    const dbStats = {
      connected: mongoose.connection.readyState === 1,  // Is database connected?
      database: mongoose.connection.name,               // Database name
      collection: 'tasks',                              // Collection name
      userId: req.userId,                               // Current user's ID
      userEmail: req.user?.email,                       // Current user's email
      taskCount: tasks.length,                          // How many tasks user has
      tasks: tasks,                                     // All the user's tasks
      connection: {                                     // Database connection details
        host: mongoose.connection.host,                 // Database server address
        port: mongoose.connection.port,                 // Database port
        name: mongoose.connection.name                  // Database name
      }
    };
    
    res.json(dbStats); // Send all this debug info back
  } catch (err) {
    // If something goes wrong, send error message
    res.status(500).json({ error: err.message });
  }
});

// ROUTE: GET /tasks/:id - Get one specific task by its ID
// Example: GET /tasks/123abc will get the task with ID "123abc"
router.get('/:id', getTaskById);

// ROUTE: POST /tasks - Create a new task
// When someone sends task data to /tasks, call the createTask function
router.post('/', createTask);

// ROUTE: PUT /tasks/:id - Update an existing task
// Example: PUT /tasks/123abc will update the task with ID "123abc"
router.put('/:id', updateTask);

// ROUTE: DELETE /tasks/:id - Delete a task
// Example: DELETE /tasks/123abc will delete the task with ID "123abc"
router.delete('/:id', deleteTask);

// Export this router so server.js can use these routes
module.exports = router;
