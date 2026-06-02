import React from 'react';
import '../styles/chat.css';

const QUICK_REPLIES = [
  { key: 'sleep_tips', label: '💡 Tips tidur' },
  { key: 'screen_time', label: '📱 Kurangi screen time' },
  { key: 'mood_check', label: '😊 Cerita perasaan' },
  { key: 'relaxation', label: '🧘 Teknik relaksasi' },
  { key: 'dass_info', label: '📋 Info DASS-21' }
];

export default function QuickReply({ onSelect, disabled }) {
  return (
    <div className="quick-reply-container">
      {QUICK_REPLIES.map(({ key, label }) => (
        <button
          key={key}
          className="quick-reply-btn"
          onClick={() => onSelect(key)}
          disabled={disabled}
        >
          {label}
        </button>
      ))}
    </div>
  );
}