/**
 * ESLint Configuration File
 * 
 * This file configures ESLint, a static code analysis tool that identifies and reports
 * on patterns in JavaScript/JSX code to help maintain code quality and consistency.
 * 
 * Key features configured:
 * - Base JavaScript linting rules
 * - React Hooks rules for proper hook usage
 * - React Fast Refresh compatibility
 * - Custom rules for unused variables
 * - Browser environment globals
 * - Modern ES2020+ syntax support
 */

// Import ESLint base JavaScript configuration
import js from '@eslint/js'
// Import global variables definitions for different environments
import globals from 'globals'
// Import React Hooks plugin for enforcing Rules of Hooks
import reactHooks from 'eslint-plugin-react-hooks'
// Import React Fast Refresh plugin for Vite integration
import reactRefresh from 'eslint-plugin-react-refresh'
// Import ESLint configuration utilities
import { defineConfig, globalIgnores } from 'eslint/config'

// Export ESLint configuration as an array of config objects
export default defineConfig([
  // Global ignore patterns - files/directories ESLint should not check
  globalIgnores(['dist']),  // Ignore build output directory
  
  // Main configuration object
  {
    // File patterns this configuration applies to
    files: ['**/*.{js,jsx}'],  // Apply to all JavaScript and JSX files
    
    // Extend existing configurations
    extends: [
      js.configs.recommended,                    // ESLint's recommended JavaScript rules
      reactHooks.configs['recommended-latest'],  // React Hooks best practices and rules
      reactRefresh.configs.vite,                 // React Fast Refresh rules for Vite
    ],
    
    // Language-specific options
    languageOptions: {
      ecmaVersion: 2020,                    // Support ES2020 features
      globals: globals.browser,             // Include browser global variables (window, document, etc.)
      
      // Parser options for JavaScript/JSX
      parserOptions: {
        ecmaVersion: 'latest',              // Use the latest ECMAScript version
        ecmaFeatures: { jsx: true },        // Enable JSX parsing
        sourceType: 'module',               // Use ES modules (import/export)
      },
    },
    
    // Custom rules to override or add to the extended configurations
    rules: {
      // Modified unused variables rule - ignore variables that start with uppercase letters or underscores
      // This is useful for React components and constants that might be used in JSX
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
