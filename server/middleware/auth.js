// Import the function that checks if tokens are valid
const { verifyToken } = require('../utils/jwt');
// Import the User model so we can look up users in the database
const User = require('../models/User');

// FUNCTION: This is like a security guard that checks if someone is allowed in
// It runs before any protected route (like viewing tasks)
const requireAuth = async (req, res, next) => {
  try {
    // STEP 1: Look for the Authorization header in the request
    // This is like looking for someone's ID card
    const authHeader = req.headers.authorization;
    
    // STEP 2: Extract the token from the header
    // The header looks like "Bearer abc123token", we want just the "abc123token" part
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7)  // Remove "Bearer " (first 7 characters) to get just the token
      : null; // If there's no proper header, set token to null

    // STEP 3: Check if we found a token
    if (!token) {
      // If no token found, send error message and stop here
      return res.status(401).json({ message: 'Authentication token required' });
    }

    // STEP 4: Check if the token is valid using our JWT utility
    const decoded = verifyToken(token);
    if (!decoded) {
      // If token is fake or expired, send error and stop
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // STEP 5: Look up the user in the database using the ID from the token
    // The .select('-password') means "get all user info EXCEPT the password"
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      // If user doesn't exist in database, send error
      return res.status(401).json({ message: 'User not found' });
    }

    // STEP 6: If everything is good, attach user info to the request
    // This makes the user info available to the next function
    req.user = user;     // Full user object (name, email, etc.)
    req.userId = user._id; // Just the user ID for convenience
    
    // STEP 7: Call next() to continue to the actual route handler
    next(); // This means "security check passed, continue"
    
  } catch (error) {
    // If anything goes wrong, log the error and send authentication failed message
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

// Export this function so other files can use it
module.exports = { requireAuth };