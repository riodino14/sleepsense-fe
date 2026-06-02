import React from 'react';
import '../styles/forms.css';

const MOODS = [
  { value: 'happy', emoji: '😊', label: 'Senang' },
  { value: 'neutral', emoji: '😐', label: 'Biasa' },
  { value: 'sad', emoji: '😢', label: 'Sedih' },
  { value: 'stressed', emoji: '😰', label: 'Stres' },
  { value: 'anxious', emoji: '😟', label: 'Cemas' }
];

export default function MoodSelector({ value, onChange }) {
  return (
    <div className="mood-selector">
      {MOODS.map(mood => (
        <button
          key={mood.value}
          className={`mood-btn ${value === mood.value ? 'selected' : ''}`}
          onClick={() => onChange(mood.value)}
        >
          <span className="mood-emoji">{mood.emoji}</span>
          <span className="mood-label">{mood.label}</span>
        </button>
      ))}
    </div>
  );
}