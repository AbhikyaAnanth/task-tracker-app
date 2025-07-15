const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');


router.get('/', getTasks);

router.get('/debug', async (req, res) => {
  const Task = require('../models/Task');
  const mongoose = require('mongoose');
  
  try {
    const tasks = await Task.find({ userId: req.userId });
    const dbStats = {
      connected: mongoose.connection.readyState === 1,
      database: mongoose.connection.name,
      collection: 'tasks',
      userId: req.userId,
      userEmail: req.user?.email,
      taskCount: tasks.length,
      tasks: tasks,
      connection: {
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        name: mongoose.connection.name
      }
    };
    res.json(dbStats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
