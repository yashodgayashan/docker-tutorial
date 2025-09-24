import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Counter from './components/Counter';
import TodoList from './components/TodoList';

function App() {
  const [activeTab, setActiveTab] = useState('counter');

  return (
    <div className="App">
      <Header />
      <nav className="nav-tabs">
        <button
          className={activeTab === 'counter' ? 'active' : ''}
          onClick={() => setActiveTab('counter')}
        >
          Counter Demo
        </button>
        <button
          className={activeTab === 'todo' ? 'active' : ''}
          onClick={() => setActiveTab('todo')}
        >
          Todo List
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'counter' && <Counter />}
        {activeTab === 'todo' && <TodoList />}
      </main>

      <footer className="footer">
        <p>🐳 Dockerized React Application - Tutorial Example</p>
        <p>Built with ❤️ for learning Docker</p>
      </footer>
    </div>
  );
}

export default App;