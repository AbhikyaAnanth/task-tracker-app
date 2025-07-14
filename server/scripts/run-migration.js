#!/usr/bin/env node

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { migrateExistingTasks } = require('./migrate-tasks');

// Load environment variables
dotenv.config();

async function runMigration() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to database');

    console.log('Starting migration...');
    await migrateExistingTasks();
    console.log('Migration completed successfully');

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
    process.exit(0);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration };
