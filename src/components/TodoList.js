import React, { useState } from 'react';
import './TodoList.css';

const TodoList = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn Docker basics', completed: true },
    { id: 2, text: 'Create React application', completed: true },
    { id: 3, text: 'Write Dockerfile', completed: false },
    { id: 4, text: 'Build Docker image', completed: false },
    { id: 5, text: 'Run container', completed: false }
  ]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: newTodo,
        completed: false
      }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="todo-container">
      <div className="todo-card">
        <h2>Docker Learning Checklist</h2>

        <div className="todo-input">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new learning goal..."
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          />
          <button onClick={addTodo} className="add-btn">Add</button>
        </div>

        <div className="todo-list">
          {todos.map(todo => (
            <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <div className="todo-content">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span className="todo-text">{todo.text}</span>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="delete-btn"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="todo-stats">
          <p>{todos.filter(t => !t.completed).length} remaining tasks</p>
        </div>
      </div>
    </div>
  );
};

export default TodoList;