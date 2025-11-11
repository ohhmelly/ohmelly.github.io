import React from 'react';
import './Header.css';

function Header({ user, onLogout }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo">
            <h1>🏥 Colorado EHR</h1>
            <span className="subtitle">Electronic Health Records System</span>
          </div>
        </div>
        <div className="header-right">
          <div className="user-info">
            <div className="user-details">
              <span className="user-name">{user.firstName} {user.lastName}</span>
              <span className="user-role">{user.role}</span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
