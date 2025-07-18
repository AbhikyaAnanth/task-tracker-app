// Import mongoose library - helps us work with MongoDB database
const mongoose = require('mongoose');
// Import bcrypt library - helps us encrypt passwords for security
const bcrypt = require('bcryptjs');

// SCHEMA: Define what a "User" looks like in our database
// Think of this like a form template that defines what info we store for each user
const userSchema = new mongoose.Schema({
  
  // NAME FIELD: Store the user's name
  name: {
    type: String,      // This must be text (not a number)
    required: true,    // This field is mandatory - can't create user without it
    trim: true,        // Remove extra spaces from beginning and end
    minlength: 2,      // Name must be at least 2 characters long
    maxlength: 50      // Name can't be longer than 50 characters
  },
  
  // EMAIL FIELD: Store the user's email address
  email: {
    type: String,      // This must be text
    required: true,    // This field is mandatory
    unique: true,      // No two users can have the same email
    lowercase: true,   // Convert to lowercase automatically (john@EMAIL.com → john@email.com)
    trim: true         // Remove extra spaces
  },
  
  // PASSWORD FIELD: Store the user's password (will be encrypted)
  password: {
    type: String,      // This must be text
    required: true,    // This field is mandatory
    minlength: 6       // Password must be at least 6 characters long
  }
}, {
  timestamps: true     // Automatically add createdAt and updatedAt fields
});

// MIDDLEWARE: This runs automatically BEFORE saving a user to the database
// Think of this like a security guard that encrypts passwords before storing them
userSchema.pre('save', async function(next) {
  // Only encrypt the password if it's new or being changed
  if (!this.isModified('password')) return next(); // Skip if password wasn't changed
  
  try {
    // STEP 1: Generate a "salt" (random data to make encryption stronger)
    const salt = await bcrypt.genSalt(10); // 10 is the strength level
    
    // STEP 2: Encrypt the password using the salt
    this.password = await bcrypt.hash(this.password, salt);
    
    next(); // Continue with saving the user
  } catch (error) {
    next(error); // If something goes wrong, pass the error along
  }
});

// METHOD: Function to check if a password is correct
// This is attached to every user object, so we can call user.comparePassword()
userSchema.methods.comparePassword = async function(candidatePassword) {
  // Compare the plain text password with the encrypted one in the database
  // bcrypt.compare handles the encryption and comparison
  return bcrypt.compare(candidatePassword, this.password);
};

// METHOD: Function that controls what happens when user object is converted to JSON
// This runs automatically when we send user data in API responses
userSchema.methods.toJSON = function() {
  // Convert the user object to a plain JavaScript object
  const user = this.toObject();
  
  // SECURITY: Remove the password field before sending data
  // We never want to accidentally send passwords to the frontend
  delete user.password;
  
  return user; // Return the user object without the password
};

// Create and export the User model
// This creates a "User" collection in MongoDB based on our schema
module.exports = mongoose.model('User', userSchema);
