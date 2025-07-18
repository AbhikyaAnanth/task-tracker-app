// This line imports the Express library - Express helps us create a web server
const express = require('express');

// This imports CORS (Cross-Origin Resource Sharing) - it allows our frontend to talk to our backend
const cors = require('cors');

// This imports dotenv - it helps us read secret information from a .env file
const dotenv = require('dotenv');

// This imports our database connection function from another file
const connectDB = require('./config/db');

// This tells dotenv to read our .env file and load all the secret values (like database passwords)
dotenv.config();

// This actually connects our app to the MongoDB database
connectDB();

// This creates our Express app - think of it as creating a new web server
const app = express();

// MIDDLEWARE SECTION (these are like security guards that check every request)

// CORS Middleware: This allows websites from other domains to use our API
// Think of it like allowing visitors into a building
app.use(cors({
  origin: true, // This means "allow ANY website to use our API"
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // These are the types of requests we allow
  allowedHeaders: ['Content-Type', 'Authorization'], // These are the extra info we allow in requests
}));

// JSON Parser Middleware: This converts incoming data into a format JavaScript can understand
// Like translating a foreign language into English
app.use(express.json());

// Logger Middleware: This prints out every request that comes to our server
// Like a security camera that logs who visits
app.use((req, res, next) => {
  console.log(`🔗 ${req.method} ${req.originalUrl}`); // Print the type of request and what URL was visited
  next(); // This means "continue to the next step"
});

// ROUTES SECTION (these decide what happens when someone visits different URLs)

// Authentication routes: Handle login, register, logout
// When someone goes to /auth/login, /auth/register, etc., use the auth routes file
app.use('/auth', require('./routes/auth'));

// Task routes: Handle creating, reading, updating, deleting tasks
// BUT FIRST check if the user is logged in (requireAuth is like a bouncer)
app.use('/tasks', require('./middleware/auth').requireAuth, require('./routes/tasks'));

// Home route: When someone visits the main page, just say "API is running"
app.get('/', (req, res) => {
  res.send('✅ API is running...'); // Send back this message
});

// SERVER STARTUP SECTION

// Get the port number from environment variables, or use 3001 if not specified
const PORT = process.env.PORT || 3001;

// Only start the server if we're not running tests
if (process.env.NODE_ENV !== 'test') {
  // Start listening for requests on the specified port
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`); // Print success message
  });
}

// Export the app so other files can use it (mainly for testing)
module.exports = app;
