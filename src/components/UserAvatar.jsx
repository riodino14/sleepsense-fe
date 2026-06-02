import React from 'react';
import '../styles/forms.css';

export default function UserAvatar({ name, size = 40, style }) {
  const initials = (name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const colors = ['#4A6FA5', '#6C63FF', '#E91E63', '#FF9800', '#4CAF50', '#00BCD4'];
  const colorIndex = (name || '').length % colors.length;

  return (
    <div
      className="user-avatar"
      style={{
        width: size,
        height: size,
        background: colors[colorIndex],
        fontSize: size * 0.38,
        ...style
      }}
    >
      {initials}
    </div>
  );
}