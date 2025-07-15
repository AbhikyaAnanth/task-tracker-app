const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize app
const app = express();

// Middleware: CORS - Allow all origins (JWT provides security)
app.use(cors({
  origin: true, // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware: Body parser
app.use(express.json());

// Optional: Request logger (for debugging)
app.use((req, res, next) => {
  console.log(`🔗 ${req.method} ${req.originalUrl}`);
  next();
});

// Auth routes
app.use('/auth', require('./routes/auth'));

// Protected task routes
app.use('/tasks', require('./middleware/auth').requireAuth, require('./routes/tasks'));

// Health check route
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// Start server
const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;
