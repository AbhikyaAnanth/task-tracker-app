/**
 * Test Setup File
 * 
 * This file is automatically run before all tests to configure the testing environment.
 * It sets up global configurations, imports, and utilities that should be available
 * in all test files without needing to import them individually.
 * 
 * Current setup:
 * - Jest DOM matchers for improved DOM testing assertions
 * 
 * This file is referenced in vite.config.js under test.setupFiles
 */

// Import Jest DOM custom matchers
// This adds helpful DOM-specific matchers to Jest's expect function, such as:
// - toBeInTheDocument() - checks if an element is in the DOM
// - toHaveClass() - checks if an element has a specific CSS class
// - toBeVisible() - checks if an element is visible to the user
// - toHaveValue() - checks form input values
// And many more: https://github.com/testing-library/jest-dom#custom-matchers
import '@testing-library/jest-dom'
