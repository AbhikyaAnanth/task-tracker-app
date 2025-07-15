const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

// Middleware: CORS - Allow all origins (JWT provides security)
app.use(cors({
  origin: true, // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(express.json());


app.use((req, res, next) => {
  console.log(`🔗 ${req.method} ${req.originalUrl}`);
  next();
});


app.use('/auth', require('./routes/auth'));


app.use('/tasks', require('./middleware/auth').requireAuth, require('./routes/tasks'));


app.get('/', (req, res) => {
  res.send('✅ API is running...');
});


const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;
