// Import Express library to create routes
const express = require('express');
// Import User model to work with user data in the database
const User = require('../models/User');
// Import function to create JWT tokens
const { generateToken } = require('../utils/jwt');
// Import middleware to check if user is logged in
const { requireAuth } = require('../middleware/auth');
// Create a router - this organizes related routes together
const router = express.Router();

// ROUTE: User Registration (Sign Up)
// This handles POST requests to /auth/register
router.post('/register', async (req, res) => {
  try {
    // STEP 1: Get the data sent from the frontend (name, email, password)
    const { name, email, password } = req.body;

    // STEP 2: Validate the input - make sure all required fields are provided
    if (!name || !email || !password) {
      // If any field is missing, send error message and stop
      return res.status(400).json({ message: 'All fields are required' });
    }

    // STEP 3: Check if password is long enough (security requirement)
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // STEP 4: Check if someone already registered with this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If email is already taken, send error
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // STEP 5: Create a new user in the database
    const user = new User({ name, email, password }); // Create user object
    await user.save(); // Actually save it to the database

    // STEP 6: Create a JWT token for the new user (log them in automatically)
    const token = generateToken(user._id);

    // STEP 7: Send success response with token and user info
    res.status(201).json({
      message: 'User registered successfully',
      token, // Send the JWT token
      user: {
        _id: user._id,    // User's unique ID
        name: user.name,  // User's name
        email: user.email // User's email (but NOT password for security)
      }
    });
  } catch (error) {
    // If anything goes wrong, log the error and send error message
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// ROUTE: User Login (Sign In)
// This handles POST requests to /auth/login
router.post('/login', async (req, res) => {
  try {
    // STEP 1: Get email and password from the request
    const { email, password } = req.body;

    // STEP 2: Validate that both email and password were provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // STEP 3: Look up the user in the database by email
    const user = await User.findOne({ email });
    if (!user) {
      // If no user found with this email, send generic error (don't reveal if email exists)
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // STEP 4: Check if the password is correct
    // comparePassword is a special function in our User model that safely checks passwords
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      // If password is wrong, send same generic error message
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // STEP 5: If email and password are correct, create a JWT token
    const token = generateToken(user._id);

    // STEP 6: Send success response with token and user info
    res.json({
      message: 'Login successful',
      token, // JWT token for future requests
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    // If anything goes wrong, log error and send error message
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// ROUTE: User Logout
// With JWT tokens, logout is mainly handled on the frontend (by deleting the token)
// This route exists mainly for consistency and potential future features
router.post('/logout', (req, res) => {
  // Just send a success message
  res.json({ message: 'Logout successful' });
});

// ROUTE: Get Current User Info
// This handles GET requests to /auth/me
// The requireAuth middleware runs first to check if user is logged in
router.get('/me', requireAuth, (req, res) => {
  // If we get here, the user is authenticated (middleware passed)
  // The middleware already put user info in req.user
  res.json({ 
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email
    }
  });
});

// Export the router so server.js can use these routes
module.exports = router;
