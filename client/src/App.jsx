// Import React and hooks for managing component state and side effects
import React, { useState, useEffect } from 'react';
// Import custom components for the task management interface
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import ProgressBar from './components/ProgressBar';
import ErrorBoundary from './components/ErrorBoundary';
import ToastProvider from './components/ToastProvider';
// Import authentication components
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
// Import custom hook for managing tasks data
import useTasks from './hooks/useTasks';
// Import API functions for authentication
import { login, register, logout, checkAuth } from './services/api';
// Import CSS files for styling
import './App.css';
import './professional.css';
import './components/Auth.css';

/**
 * App Component - Main Application Component
 * 
 * This is the root component that handles:
 * 1. User authentication state (login/logout/register)
 * 2. Routing between auth forms and main app
 * 3. Task management for authenticated users
 * 4. Overall app layout and navigation
 * 
 * The app has two main states:
 * - Unauthenticated: Shows login/register forms
 * - Authenticated: Shows the task management interface
 */
function App() {
  // User authentication state - stores current logged-in user info or null
  const [user, setUser] = useState(null);
  
  // Loading state for initial app startup (checking if user is already logged in)
  const [loading, setLoading] = useState(true);
  
  // Loading state for authentication operations (login/register)
  const [authLoading, setAuthLoading] = useState(false);
  
  // UI state to toggle between login and register forms
  const [showRegister, setShowRegister] = useState(false);
  
  // Use custom hook to manage tasks data (only works when user is authenticated)
  const { tasks, loading: tasksLoading, error, addTask, fetchTasks } = useTasks(user);
  
  // Calculate task statistics for the dashboard
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  /**
   * Effect to check if user is already authenticated when app loads
   * This runs once when the component mounts to:
   * 1. Check if there's a valid JWT token in localStorage
   * 2. Verify the token with the server
   * 3. Set user state if token is valid
   * 4. Handle the loading state during this process
   */
  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        // Try to get current user info using stored token
        const response = await checkAuth();
        setUser(response.data.user); // User is authenticated
      } catch (error) {
        // Token is invalid or expired, user needs to log in
        setUser(null);
      } finally {
        // Always turn off loading whether successful or not
        setLoading(false);
      }
    };
    
    checkUserAuth();
  }, []); // Empty dependency array means this runs once on mount

  /**
   * Handles user login
   * Called when user submits the login form with email/password
   * 
   * @param {Object} credentials - Object containing email and password
   */
  const handleLogin = async (credentials) => {
    setAuthLoading(true); // Show loading state during login
    try {
      // Call API to authenticate user and get JWT token
      const response = await login(credentials);
      // Set user state with the returned user data
      setUser(response.data.user);
      // Switch away from register form if it was showing
      setShowRegister(false);
    } catch (error) {
      console.error('Login error:', error);
      // Re-throw error so LoginForm component can show error message
      throw error;
    } finally {
      // Always turn off loading state
      setAuthLoading(false);
    }
  };

  /**
   * Handles user registration
   * Called when user submits the register form with name/email/password
   * 
   * @param {Object} userData - Object containing name, email, and password
   */
  const handleRegister = async (userData) => {
    setAuthLoading(true); // Show loading state during registration
    try {
      // Call API to create new user account and get JWT token
      const response = await register(userData);
      // Set user state with the returned user data (automatically logs in)
      setUser(response.data.user);
      // Switch away from register form to main app
      setShowRegister(false);
    } catch (error) {
      // Re-throw error so RegisterForm component can show error message
      throw error;
    } finally {
      // Always turn off loading state
      setAuthLoading(false);
    }
  };

  /**
   * Handles user logout
   * Called when user clicks the logout button
   * Clears JWT token and returns to login screen
   */
  const handleLogout = async () => {
    try {
      // Call API to logout (clears token on server side if needed)
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout API fails, we still want to clear local state
    } finally {
      // Clear user state to return to login screen
      setUser(null);
    }
  };

  // Show loading spinner while checking if user is already authenticated
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: 'var(--text-secondary)'
      }}>
        Loading...
      </div>
    );
  }

  // If no user is logged in, show authentication forms
  if (!user) {
    return (
      <ErrorBoundary>
        <ToastProvider>
          {/* Toggle between register and login forms based on showRegister state */}
          {showRegister ? (
            <RegisterForm
              onRegister={handleRegister}
              loading={authLoading} // Show loading state in register form
              onToggleForm={() => setShowRegister(false)} // Switch to login form
            />
          ) : (
            <LoginForm
              onLogin={handleLogin}
              loading={authLoading} // Show loading state in login form
              onToggleForm={() => setShowRegister(true)} // Switch to register form
            />
          )}
        </ToastProvider>
      </ErrorBoundary>
    );
  }

  // User is authenticated - show main task management interface
  return (
    <ErrorBoundary>
      <ToastProvider>
        <div className="app">
          {/* App header with title and user info */}
          <header className="app-header-auth">
            <div className="header-left">
              <div className="header-text">
                <h1 className="app-title">Task Tracker</h1>
                <p className="app-subtitle">Simple task management</p>
              </div>
            </div>
            {/* User info and logout button */}
            <div className="user-info">
              <span className="user-name">Welcome, {user.name}</span>
              <button 
                className="logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </header>
          
          <div className="app-container">
            <main className="main-content fade-in">
              {/* Task Statistics Dashboard */}
              <div className="stats-bar">
                <div className="stat-item">
                  <div className="stat-number">{totalTasks}</div>
                  <div className="stat-label">Total Tasks</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{pendingTasks}</div>
                  <div className="stat-label">Pending</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{completedTasks}</div>
                  <div className="stat-label">Completed</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{completionRate}%</div>
                  <div className="stat-label">Progress</div>
                </div>
              </div>

              {/* Visual Progress Bar (only show if there are tasks) */}
              {totalTasks > 0 && (
                <ProgressBar completed={completedTasks} total={totalTasks} />
              )}

              {/* Form to add new tasks */}
              <TaskForm addTask={addTask} />
              
              <hr className="section-divider" />
              
              {/* List of all tasks with filtering and management options */}
              <TaskList 
                tasks={tasks} 
                loading={loading} 
                error={error} 
                fetchTasks={fetchTasks} 
              />
            </main>
          </div>
        </div>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
