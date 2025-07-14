const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Task = require('../models/Task');

dotenv.config();

async function testUserSpecificData() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to database');

    // Find all users
    const users = await User.find();
    console.log(`\nFound ${users.length} users:`);
    
    for (const user of users) {
      console.log(`\n--- User: ${user.name} (${user.email}) ---`);
      
      // Find tasks for this user
      const userTasks = await Task.find({ userId: user._id });
      console.log(`Tasks: ${userTasks.length}`);
      
      userTasks.forEach((task, index) => {
        console.log(`  ${index + 1}. ${task.title} - ${task.completed ? 'Completed' : 'Pending'}`);
      });
      
      if (userTasks.length === 0) {
        console.log('  No tasks found for this user');
      }
    }

    // Check for orphaned tasks (tasks without valid userId)
    const orphanedTasks = await Task.find({ 
      $or: [
        { userId: { $exists: false } },
        { userId: null }
      ]
    });
    
    if (orphanedTasks.length > 0) {
      console.log(`\n⚠️  Found ${orphanedTasks.length} orphaned tasks without valid userId`);
    } else {
      console.log('\n✅ All tasks have valid userId references');
    }

  } catch (error) {
    console.error('Test error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from database');
  }
}

// Run the test
testUserSpecificData();
