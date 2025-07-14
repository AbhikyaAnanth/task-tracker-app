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

// Middleware: CORS
app.use(cors({
  origin: 'http://localhost:5173', // Vite frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Middleware: Body parser
app.use(express.json());

// Optional: Request logger (for debugging)
app.use((req, res, next) => {
  console.log(`🔗 ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/tasks', require('./routes/tasks'));

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
