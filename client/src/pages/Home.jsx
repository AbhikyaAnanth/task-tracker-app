import React from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

function App() {
  return (
    <div className="App">
      <h1>Task Tracker</h1>
      <TaskForm onTaskCreated={() => window.location.reload()} />
      <TaskList />
    </div>
  );
}

export default App;
