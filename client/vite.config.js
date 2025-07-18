/**
 * Vite Configuration File
 * 
 * This file configures Vite, the build tool and development server for this React application.
 * Vite provides fast development with hot module replacement (HMR) and optimized production builds.
 * 
 * Key features configured:
 * - React plugin for JSX transformation and fast refresh
 * - Vitest configuration for unit testing
 * - Test environment setup for DOM testing
 */

// Import Vite's configuration function
import { defineConfig } from 'vite'
// Import the React plugin for Vite (handles JSX, fast refresh, etc.)
import react from '@vitejs/plugin-react'

// Vite configuration - see https://vite.dev/config/ for all options
export default defineConfig({
  // Plugins extend Vite's functionality
  plugins: [
    react()  // Enable React support with JSX transformation and fast refresh
  ],
  
  // Test configuration for Vitest (Vite's built-in test runner)
  test: {
    globals: true,                        // Enable global test functions (describe, it, expect) without imports
    environment: 'jsdom',                 // Use jsdom to simulate browser environment for DOM testing
    setupFiles: './src/test/setup.js',    // Run setup file before tests (configures testing library)
  },
})
