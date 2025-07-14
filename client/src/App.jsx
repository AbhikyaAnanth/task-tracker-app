import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import ProgressBar from './components/ProgressBar';
import ErrorBoundary from './components/ErrorBoundary';
import ToastProvider from './components/ToastProvider';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import useTasks from './hooks/useTasks';
import { login, register, logout, checkAuth } from './services/api';
import './App.css';
import './professional.css';
import './components/Auth.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  
  const { tasks, loading: tasksLoading, error, addTask, fetchTasks } = useTasks();
  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Check authentication status on app load
  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const response = await checkAuth();
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkUserAuth();
  }, []);

  // Fetch tasks when user is set
  useEffect(() => {
    if (user) {
      console.log('User set, fetching tasks for:', user); // Debug log
      fetchTasks();
    }
  }, [user, fetchTasks]);

  // Debug: Log user state changes
  useEffect(() => {
    console.log('User state changed:', user);
  }, [user]);

  const handleLogin = async (credentials) => {
    setAuthLoading(true);
    try {
      const response = await login(credentials);
      console.log('Login response:', response.data); // Debug log
      setUser(response.data.user);
      setShowRegister(false);
      // fetchTasks will be called automatically by useEffect when user is set
    } catch (error) {
      console.error('Login error:', error); // Debug log
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    setAuthLoading(true);
    try {
      const response = await register(userData);
      console.log('Register response:', response.data); // Debug log
      setUser(response.data.user);
      setShowRegister(false);
      // fetchTasks will be called automatically by useEffect when user is set
    } catch (error) {
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if request fails
      setUser(null);
    }
  };

  // Show loading spinner while checking auth
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

  // Show auth forms if not logged in
  if (!user) {
    return (
      <ErrorBoundary>
        <ToastProvider>
          {showRegister ? (
            <RegisterForm
              onRegister={handleRegister}
              loading={authLoading}
              onToggleForm={() => setShowRegister(false)}
            />
          ) : (
            <LoginForm
              onLogin={handleLogin}
              loading={authLoading}
              onToggleForm={() => setShowRegister(true)}
            />
          )}
        </ToastProvider>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <ToastProvider>
        <div className="app">
          <header className="app-header-auth">
            <div className="header-left">
              <div className="header-text">
                <h1 className="app-title">Task Tracker</h1>
                <p className="app-subtitle">Simple task management</p>
              </div>
            </div>
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
              {/* Statistics Bar */}
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

              {/* Progress Bar */}
              {totalTasks > 0 && (
                <ProgressBar completed={completedTasks} total={totalTasks} />
              )}

              {/* Task Form */}
              <TaskForm addTask={addTask} />
              
              <hr className="section-divider" />
              
              {/* Task List */}
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
