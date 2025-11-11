import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ isOpen, onToggle }) {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/patients', label: 'Patients', icon: '👥' },
    { path: '/appointments', label: 'Appointments', icon: '📅' },
    { path: '/medical-records', label: 'Medical Records', icon: '📋' },
    { path: '/billing', label: 'Billing', icon: '💰' },
    { path: '/reporting', label: 'Reporting', icon: '📈' },
  ];

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={location.pathname === item.path ? 'active' : ''}
                >
                  <span className="icon">{item.icon}</span>
                  <span className="label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sidebar-footer">
          <p className="version">v1.0.0</p>
          <p className="compliance">HIPAA Compliant</p>
        </div>
      </aside>
      {isOpen && <div className="sidebar-overlay" onClick={onToggle}></div>}
    </>
  );
}

export default Sidebar;
