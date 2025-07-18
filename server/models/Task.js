// Import mongoose library - helps us work with MongoDB database
const mongoose = require('mongoose');

// SCHEMA: Define what a "Task" looks like in our database
// Think of this like a template for creating todo items
const taskSchema = new mongoose.Schema({
  
  // TITLE FIELD: The main text of the task (like "Buy groceries")
  title: {
    type: String,      // This must be text
    required: true,    // Every task must have a title
    trim: true,        // Remove extra spaces from beginning and end
    maxlength: 40      // Title can't be longer than 40 characters
  },
  
  // DESCRIPTION FIELD: Optional longer text to describe the task
  description: {
    type: String,      // This must be text
    trim: true,        // Remove extra spaces
    maxlength: 500,    // Description can't be longer than 500 characters
    default: ''        // If no description provided, use empty string
  },
  
  // COMPLETED FIELD: Whether the task is done or not
  completed: {
    type: Boolean,     // This must be true or false
    default: false     // New tasks start as not completed
  },
  
  // USER ID FIELD: Which user owns this task
  // This creates a connection between tasks and users
  userId: {
    type: mongoose.Schema.Types.ObjectId,  // This stores a reference to a User
    ref: 'User',       // This refers to the User model
    required: true,    // Every task must belong to a user
    index: true        // Make searching by userId faster
  }
}, { 
  timestamps: true     // Automatically add createdAt and updatedAt fields
});

// Create and export the Task model
// This creates a "Task" collection in MongoDB based on our schema
module.exports = mongoose.model('Task', taskSchema);
