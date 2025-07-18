// Import React library and the useState hook
// React helps us create interactive user interfaces
// useState helps us store and change data that the user types
import React, { useState } from 'react';

// COMPONENT: RegisterForm - This creates the registration form for new users
// Think of this like a digital application form to join a club
const RegisterForm = ({ onRegister, loading, onToggleForm }) => {
  
  // STATE: Store all the form data (what the user types)
  // This form has more fields than login because we need more info for new users
  const [formData, setFormData] = useState({
    name: '',             // User's full name
    email: '',            // User's email address
    password: '',         // User's chosen password
    confirmPassword: ''   // User must type password again to make sure it's correct
  });
  
  // STATE: Store any error messages to show the user
  const [error, setError] = useState(''); // Start with no error
  
  // FUNCTION: Handle when user types in any form field
  // This runs every time the user types a letter in any input
  const handleChange = (e) => {
    setFormData({
      ...formData, // Keep all the existing data
      [e.target.name]: e.target.value // Update just the field that changed
    });
    // Example: if user types in name field, only name gets updated
  };
  
  // FUNCTION: Handle when user clicks the "Sign Up" button
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop the page from refreshing
    setError(''); // Clear any previous error messages
    
    // VALIDATION: Check if user filled in ALL required fields
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return; // Stop here if any field is missing
    }

    // VALIDATION: Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return; // Stop here if passwords don't match
    }

    // VALIDATION: Check if password is long enough for security
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return; // Stop here if password is too short
    }

    // TRY TO REGISTER: Call the register function passed from parent component
    try {
      await onRegister({
        name: formData.name,
        email: formData.email,
        password: formData.password
        // Note: we don't send confirmPassword - it was just for validation
      });
    } catch (err) {
      // If registration fails, show the error message to the user
      setError(err.response?.data?.message || 'Registration failed');
    }
  };
  
  // RENDER: Create the visual form that users see and interact with
  return (
    <div className="auth-container"> {/* Main container for the whole form */}
      <div className="auth-card"> {/* Card-like box that holds the form */}
        
        {/* LOGO SECTION: Show the app logo and title */}
        <div className="company-logo">
          <img src="/images/file.png" alt="Task Tracker Logo" className="logo-icon" />
          <h1 className="company-name">Task Tracker</h1>
          <p className="company-tagline">Simple task management</p>
        </div>
        
        {/* HEADER SECTION: Title and description for the form */}
        <div className="auth-header">
          <h2>Sign Up</h2>
          <p>Create your account</p>
        </div>
        
        {/* FORM SECTION: The actual form that users fill out */}
        <form onSubmit={handleSubmit} className="auth-form">
          
          {/* ERROR MESSAGE: Only show if there's an error */}
          {error && (
            <div className="error-message">
              {error} {/* Display the error text */}
            </div>
          )}
          
          {/* NAME INPUT FIELD */}
          <div className="form-group">
            <label htmlFor="name">Name <span className="required-field">*</span></label>
            <input
              type="text"         // Regular text input
              id="name"           // Connects this input to the label above
              name="name"         // This is used in handleChange to know which field changed
              value={formData.name}     // Show the current name value from state
              onChange={handleChange}   // Call handleChange when user types
              placeholder="Enter your name"  // Gray text hint for user
              required            // Browser will check if this is filled out
            />
          </div>
          
          {/* EMAIL INPUT FIELD */}
          <div className="form-group">
            <label htmlFor="email">Email <span className="required-field">*</span></label>
            <input
              type="email"        // Makes keyboard show @ symbol on mobile
              id="email"          // Connects this input to the label above
              name="email"        // This is used in handleChange to know which field changed
              value={formData.email}    // Show the current email value from state
              onChange={handleChange}   // Call handleChange when user types
              placeholder="Enter your email"  // Gray text hint for user
              required            // Browser will check if this is filled out
            />
          </div>
          
          {/* PASSWORD INPUT FIELD */}
          <div className="form-group">
            <label htmlFor="password">Password <span className="required-field">*</span></label>
            <input
              type="password"     // Hides the text with dots for security
              id="password"       // Connects this input to the label above
              name="password"     // This is used in handleChange to know which field changed
              value={formData.password}   // Show the current password value from state
              onChange={handleChange}     // Call handleChange when user types
              placeholder="Create a password"  // Gray text hint for user
              required            // Browser will check if this is filled out
            />
          </div>
          
          {/* CONFIRM PASSWORD INPUT FIELD */}
          {/* This is a security feature - user must type password twice to avoid typos */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password <span className="required-field">*</span></label>
            <input
              type="password"     // Hides the text with dots for security
              id="confirmPassword" // Connects this input to the label above
              name="confirmPassword" // This is used in handleChange to know which field changed
              value={formData.confirmPassword} // Show the current confirm password value from state
              onChange={handleChange}          // Call handleChange when user types
              placeholder="Confirm your password" // Gray text hint for user
              required            // Browser will check if this is filled out
            />
          </div>
          
          {/* SUBMIT BUTTON: User clicks this to try to register */}
          <button 
            type="submit"       // This makes the button submit the form
            className="auth-button"
            disabled={loading}  // Disable button if registration is in progress
          >
            {/* Show different text based on whether we're currently registering */}
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        
        {/* FOOTER SECTION: Link to switch to login form */}
        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <button 
              type="button"       // This is just a regular button, not a submit button
              className="link-button"
              onClick={onToggleForm}  // Call function to switch to login form
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Export this component so other files can import and use it
export default RegisterForm;
