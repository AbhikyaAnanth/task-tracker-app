// Import the JWT (JSON Web Token) library - this helps us create and check digital "ID cards"
const jwt = require('jsonwebtoken');

// FUNCTION: Create a digital "ID card" (token) for a user
// Think of this like creating a special badge that proves someone is logged in
const generateToken = (userId) => {
  // jwt.sign() creates the digital ID card
  return jwt.sign(
    { userId }, // This puts the user's ID inside the token (like writing a name on a badge)
    process.env.JWT_SECRET, // This is our secret password for creating tokens (like a special stamp)
    { expiresIn: '7d' } // The token expires in 7 days (like a temporary visitor pass)
  );
};

// FUNCTION: Check if a digital "ID card" (token) is real and valid
// Think of this like a security guard checking if someone's badge is real
const verifyToken = (token) => {
  try {
    // jwt.verify() checks if the token is real and not fake
    return jwt.verify(token, process.env.JWT_SECRET); // Use our secret password to verify
  } catch (error) {
    // If there's any error (token is fake, expired, etc.), return null (meaning "invalid")
    return null;
  }
};

// Export these functions so other files can use them
// It's like sharing these tools with other parts of our app
module.exports = {
  generateToken, // Export the function that creates tokens
  verifyToken    // Export the function that checks tokens
};
