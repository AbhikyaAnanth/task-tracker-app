/**
 * Database Configuration
 * 
 * This file handles the connection to MongoDB database using Mongoose.
 * Mongoose is an Object Document Mapper (ODM) that provides a straightforward,
 * schema-based solution to model application data with MongoDB.
 * 
 * Key features:
 * - Establishes connection to MongoDB using connection string
 * - Handles connection errors gracefully
 * - Exits process if database connection fails (prevents app from running without DB)
 * - Uses environment variables for database URL (security best practice)
 */

// Import Mongoose library for MongoDB connection and operations
const mongoose = require('mongoose');

/**
 * Connects to MongoDB database
 * 
 * This async function establishes a connection to MongoDB using the connection
 * string stored in the MONGO_URI environment variable. The connection string
 * typically includes the database URL, authentication credentials, and database name.
 * 
 * Process:
 * 1. Attempts to connect to MongoDB using mongoose.connect()
 * 2. Logs success message if connection is established
 * 3. Catches any connection errors and logs them
 * 4. Exits the Node.js process if connection fails (prevents running without database)
 * 
 * Environment Variables Required:
 * - MONGO_URI: MongoDB connection string (e.g., mongodb://localhost:27017/tasktracker)
 *   For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/database
 */
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the connection string from environment variables
    // process.env.MONGO_URI should contain the full MongoDB connection string
    await mongoose.connect(process.env.MONGO_URI);
    
    // Log success message when connection is established
    console.log('MongoDB connected');
  } catch (err) {
    // If connection fails, log the error message
    console.error('MongoDB connection error:', err.message);
    
    // Exit the Node.js process with error code 1
    // This prevents the application from running without a database connection
    // In production, you might want to implement retry logic instead
    process.exit(1);
  }
};

// Export the connectDB function so it can be imported and used in other files
// This function will be called in server.js to establish the database connection
module.exports = connectDB;
