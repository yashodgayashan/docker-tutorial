import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          🐳 Docker
        </div>
        <h1>React Application Tutorial</h1>
        <p>Learn Docker with Single-Stage vs Multi-Stage Builds</p>
      </div>
      <div className="docker-info">
        <span className="badge">Containerized</span>
        <span className="badge">Production Ready</span>
      </div>
    </header>
  );
};

export default Header;