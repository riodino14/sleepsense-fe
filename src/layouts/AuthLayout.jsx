import React from 'react';
import { Outlet } from 'react-router-dom';
import '../styles/auth.css';

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-brand">
        <div className="auth-logo">
          <span>🌙</span>
        </div>
        <h1 className="auth-title">SleepSense</h1>
        <p className="auth-subtitle">Tidur Lebih Baik, Hidup Lebih Sehat</p>
      </div>
      <div className="auth-card dark-card">
        <Outlet />
      </div>
    </div>
  );
}