/**
 * Server Test Setup File
 * 
 * This file configures the testing environment for server-side tests.
 * It sets up environment variables and configurations that should be
 * active during test execution to ensure tests run in isolation from
 * development and production environments.
 * 
 * Key configurations:
 * - Sets NODE_ENV to 'test' for test-specific behavior
 * - Configures separate test database to avoid corrupting real data
 * - Ensures tests run in a clean, predictable environment
 */

// Set Node.js environment to 'test'
// This tells the application to run in test mode, which may:
// - Disable certain logging
// - Use test-specific configurations
// - Enable additional debugging features
process.env.NODE_ENV = 'test';

// Set MongoDB connection string for testing
// Uses a separate test database (tasktracker_test) to ensure:
// - Test data doesn't interfere with development data
// - Tests can create/modify/delete data safely
// - Each test run starts with a clean slate
process.env.MONGODB_URI = 'mongodb://localhost:27017/tasktracker_test';
