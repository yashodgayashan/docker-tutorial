import React, { useState } from 'react';
import './Counter.css';

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="counter-container">
      <div className="counter-card">
        <h2>Interactive Counter</h2>
        <div className="counter-display">
          <span className="count-number">{count}</span>
        </div>
        <div className="counter-buttons">
          <button
            className="counter-btn decrement"
            onClick={() => setCount(count - 1)}
          >
            - Decrease
          </button>
          <button
            className="counter-btn reset"
            onClick={() => setCount(0)}
          >
            Reset
          </button>
          <button
            className="counter-btn increment"
            onClick={() => setCount(count + 1)}
          >
            + Increase
          </button>
        </div>
        <p className="counter-info">
          This demonstrates React state management in a Docker container
        </p>
      </div>
    </div>
  );
};

export default Counter;