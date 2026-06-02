import React from 'react';
import { formatTime } from '../utils/dateHelper';
import '../styles/chat.css';

export default function ChatBubble({ message, isUser }) {
  return (
    <div className={`chat-bubble-wrapper ${isUser ? 'user' : 'assistant'}`}>
      <div className={`chat-bubble ${isUser ? 'user' : 'assistant'}`}>
        {message.content}
      </div>
      <span className="chat-bubble-time">
        {formatTime(message.timestamp)}
      </span>
    </div>
  );
}