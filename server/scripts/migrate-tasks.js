const mongoose = require('mongoose');
const Task = require('../models/Task');
const User = require('../models/User');

// Migration script to handle existing tasks without userId
async function migrateExistingTasks() {
  try {
    console.log('Starting task migration...');
    
    // Find tasks without userId
    const tasksWithoutUser = await Task.find({ userId: { $exists: false } });
    console.log(`Found ${tasksWithoutUser.length} tasks without userId`);
    
    if (tasksWithoutUser.length === 0) {
      console.log('No tasks to migrate');
      return;
    }
    
    // Get the first user (or create a default user)
    let defaultUser = await User.findOne();
    
    if (!defaultUser) {
      console.log('No users found. Creating a default user...');
      defaultUser = new User({
        name: 'Default User',
        email: 'default@example.com',
        password: 'defaultpass123'
      });
      await defaultUser.save();
      console.log('Default user created');
    }
    
    // Update all tasks without userId to use the default user
    const result = await Task.updateMany(
      { userId: { $exists: false } },
      { $set: { userId: defaultUser._id } }
    );
    
    console.log(`Migration completed: ${result.modifiedCount} tasks updated`);
    
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
}

module.exports = { migrateExistingTasks };
