// Validation utilities for form inputs

/**
 * Validates a task title
 * @param {string} title - The task title to validate
 * @returns {string|null} - Error message or null if valid
 */
export const validateTaskTitle = (title) => {
  if (!title || !title.trim()) {
    return 'Task title is required';
  }
  
  if (title.trim().length < 2) {
    return 'Task title must be at least 2 characters long';
  }
  
  if (title.length > 40) {
    return 'Task title cannot exceed 40 characters';
  }
  
  // Check for potentially malicious content
  const dangerousPatterns = [/<script/i, /javascript:/i, /on\w+=/i];
  if (dangerousPatterns.some(pattern => pattern.test(title))) {
    return 'Task title contains invalid characters';
  }
  
  return null;
};

/**
 * Validates a task description
 * @param {string} description - The task description to validate
 * @returns {string|null} - Error message or null if valid
 */
export const validateTaskDescription = (description) => {
  // Description is optional
  if (!description || !description.trim()) {
    return null;
  }
  
  if (description.length > 500) {
    return 'Task description cannot exceed 500 characters';
  }
  
  // Check for potentially malicious content
  const dangerousPatterns = [/<script/i, /javascript:/i, /on\w+=/i];
  if (dangerousPatterns.some(pattern => pattern.test(description))) {
    return 'Task description contains invalid characters';
  }
  
  return null;
};

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {string|null} - Error message or null if valid
 */
export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return 'Email is required';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return null;
};

/**
 * Validates a password
 * @param {string} password - The password to validate
 * @returns {string|null} - Error message or null if valid
 */
export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
  }
  
  return null;
};

/**
 * Validates required field
 * @param {any} value - The value to validate
 * @param {string} fieldName - The name of the field
 * @returns {string|null} - Error message or null if valid
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} is required`;
  }
  
  if (typeof value === 'string' && !value.trim()) {
    return `${fieldName} is required`;
  }
  
  return null;
};

/**
 * Validates string length
 * @param {string} value - The string to validate
 * @param {number} min - Minimum length
 * @param {number} max - Maximum length
 * @param {string} fieldName - The name of the field
 * @returns {string|null} - Error message or null if valid
 */
export const validateLength = (value, min = 0, max = Infinity, fieldName = 'This field') => {
  if (!value) return null; // Let required validation handle empty values
  
  if (value.length < min) {
    return `${fieldName} must be at least ${min} characters long`;
  }
  
  if (value.length > max) {
    return `${fieldName} cannot exceed ${max} characters`;
  }
  
  return null;
};

/**
 * Sanitizes user input by removing potentially dangerous characters
 * @param {string} input - The input to sanitize
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Formats validation errors for display
 * @param {Object} errors - Object containing validation errors
 * @returns {string[]} - Array of error messages
 */
export const formatValidationErrors = (errors) => {
  if (!errors || typeof errors !== 'object') return [];
  
  return Object.values(errors).filter(Boolean);
};

/**
 * Validates multiple fields at once
 * @param {Object} fields - Object with field names as keys and values to validate
 * @param {Object} validators - Object with field names as keys and validator functions as values
 * @returns {Object} - Object with field names as keys and error messages as values
 */
export const validateFields = (fields, validators) => {
  const errors = {};
  
  for (const [fieldName, value] of Object.entries(fields)) {
    const validator = validators[fieldName];
    if (validator && typeof validator === 'function') {
      const error = validator(value);
      if (error) {
        errors[fieldName] = error;
      }
    }
  }
  
  return errors;
};

/**
 * Debounced validation function
 * @param {Function} validator - The validation function
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced validator
 */
export const debounceValidator = (validator, delay = 300) => {
  let timeoutId;
  
  return (...args) => {
    clearTimeout(timeoutId);
    
    return new Promise((resolve) => {
      timeoutId = setTimeout(() => {
        resolve(validator(...args));
      }, delay);
    });
  };
};
