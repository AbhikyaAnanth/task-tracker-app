import React from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import ProgressBar from './components/ProgressBar';
import ErrorBoundary from './components/ErrorBoundary';
import ToastProvider from './components/ToastProvider';
import useTasks from './hooks/useTasks';
import './App.css';
import './professional.css';

function App() {
  const { tasks, loading, error, addTask, fetchTasks } = useTasks();
  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <ErrorBoundary>
      <ToastProvider>
        <div className="app">
          <header className="app-header">
            <h1 className="app-title">Task Tracker</h1>
            <p className="app-subtitle">Stay organized and boost your productivity</p>
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
