/**
 * Main Entry Point for the React Application
 * 
 * This file is the entry point for the entire React application.
 * It sets up the React root and renders the main App component.
 * 
 * Key concepts:
 * - createRoot: Modern React 18 API for rendering applications
 * - StrictMode: Development mode that helps catch bugs and warnings
 * - The app is mounted to the HTML element with id="root" (see index.html)
 */

// Import React's StrictMode for additional development checks
import { StrictMode } from 'react'
// Import the modern React DOM rendering API
import { createRoot } from 'react-dom/client'
// Import global CSS styles
import './index.css'
// Import the main App component
import App from './App.jsx'

// Create a React root and render the application
// This connects our React app to the HTML element with id="root"
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
