import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/layouts.css';

const NAV_ITEMS = [
  { to: '/', icon: '🏠', label: 'Home' },
  { to: '/screen', icon: '📱', label: 'Screen' },
  { to: '/sleep', icon: '🌙', label: 'Sleep' },
  { to: '/health', icon: '❤️', label: 'Health' },
  { to: '/settings', icon: '⚙️', label: 'Settings' }
];

export default function MainLayout() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="main-layout">
      <header className="main-header">
        <div className="header-brand">
          <span className="header-logo">😴</span>
          <span className="header-name">SleepSense</span>
        </div>
        <div className="header-avatar">
          {user?.nickname?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || '?'}
        </div>
      </header>

      <main className="page">
        <Outlet />
      </main>

      <nav className="bottom-nav">
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}