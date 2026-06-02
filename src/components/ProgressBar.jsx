import React from 'react';
// Tidak perlu file CSS karena hanya sedikit style, atau kita buat CSS
import '../styles/components.css'; // jika mau

export default function ProgressBar({ value, max = 100, label, color = 'var(--primary)', height = 10, showPercentage = true }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div style={{ marginBottom: 12 }}>
      {(label || showPercentage) && (
        <div className="progress-bar-header">
          {label && <span>{label}</span>}
          {showPercentage && <span className="progress-bar-pct">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className="progress-bar-track" style={{ height }}>
        <div
          className="progress-bar-fill"
          style={{ width: `${pct}%`, height: '100%', backgroundColor: color, borderRadius: height / 2, transition: 'width 0.5s ease' }}
        />
      </div>
    </div>
  );
}