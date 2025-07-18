// Import React library and the useState hook
// React helps us create interactive user interfaces
// useState helps us store and change data that the user types
import React, { useState } from 'react';

// COMPONENT: LoginForm - This creates the login form that users see
// Think of this like a digital form you fill out to get into a building
// The stuff in parentheses are "props" - data passed from the parent component
const LoginForm = ({ onLogin, loading, onToggleForm }) => {
  
  // STATE: Store the form data (what the user types)
  // useState is like having a memory box that remembers what the user typed
  const [formData, setFormData] = useState({
    email: '',    // Start with empty email
    password: ''  // Start with empty password
  });
  
  // STATE: Store any error messages to show the user
  const [error, setError] = useState(''); // Start with no error
  
  // FUNCTION: Handle when user types in the form fields
  // This runs every time the user types a letter
  const handleChange = (e) => {
    // Get info about which field was changed and what was typed
    setFormData({
      ...formData, // Keep all the existing data
      [e.target.name]: e.target.value // Update just the field that changed
    });
    // Example: if user types in email field, only email gets updated
  };
  
  // FUNCTION: Handle when user clicks the "Sign In" button
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop the page from refreshing (normal form behavior)
    setError(''); // Clear any previous error messages
    
    // VALIDATION: Check if user filled in both fields
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields'); // Show error message
      return; // Stop here, don't try to login
    }
    
    // TRY TO LOGIN: Call the login function passed from parent component
    try {
      await onLogin(formData); // Send email and password to parent
    } catch (err) {
      // If login fails, show the error message to the user
      setError(err.response?.data?.message || 'Login failed');
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
          <h2>Login</h2>
          <p>Sign in to your account</p>
        </div>
        
        {/* FORM SECTION: The actual form that users fill out */}
        <form onSubmit={handleSubmit} className="auth-form">
          
          {/* ERROR MESSAGE: Only show if there's an error */}
          {error && (
            <div className="error-message">
              {error} {/* Display the error text */}
            </div>
          )}
          
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
              placeholder="Enter your password"  // Gray text hint for user
              required            // Browser will check if this is filled out
            />
          </div>
          
          {/* SUBMIT BUTTON: User clicks this to try to login */}
          <button 
            type="submit"       // This makes the button submit the form
            className="auth-button"
            disabled={loading}  // Disable button if login is in progress
          >
            {/* Show different text based on whether we're currently logging in */}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        {/* FOOTER SECTION: Link to switch to registration form */}
        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <button 
              type="button"       // This is just a regular button, not a submit button
              className="link-button"
              onClick={onToggleForm}  // Call function to switch to register form
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Export this component so other files can import and use it
export default LoginForm;
