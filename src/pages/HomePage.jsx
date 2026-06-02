import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSleepData } from '../context/SleepDataContext';
import { useChat } from '../context/ChatContext';
import { getGreeting } from '../utils/dateHelper';
import { analyzeSleep } from '../utils/sleepAnalyzer';
import ChatBubble from '../components/ChatBubble';
import QuickReply from '../components/QuickReply';
import ProgressBar from '../components/ProgressBar';
import MoodSelector from '../components/MoodSelector';
import NotificationReminder from '../components/NotificationReminder';
import '../styles/pages.css';
import '../styles/chat.css';
import '../styles/forms.css';

export default function HomePage() {
  const { user } = useAuth();
  const { sleepRecords, targetSleep, fetchSleepData } = useSleepData();
  const { messages, isLoading, addUserMessage } = useChat();
  const [mood, setMood] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [showChat, setShowChat] = useState(false);

  useEffect(() => { fetchSleepData(7); }, [fetchSleepData]);

  const analysis = analyzeSleep(sleepRecords, targetSleep.hours);
  const greeting = getGreeting();

  const handleSend = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    addUserMessage(chatInput.trim());
    setChatInput('');
    setShowChat(true);
  };

  const handleQuickReply = (key) => {
    const replies = {
      sleep_tips: 'Berikan tips tidur yang lebih baik',
      screen_time: 'Bagaimana cara mengurangi screen time?',
      mood_check: 'Aku ingin cerita tentang perasaanku hari ini',
      relaxation: 'Ajari aku teknik relaksasi sebelum tidur'
    };
    addUserMessage(replies[key] || key);
    setShowChat(true);
  };

  return (
    <div className="page-content">
      <div className="card home-greeting-card">
        <div className="home-greeting-content">
          <div>
            <h2 className="home-greeting-title">{greeting}, {user?.nickname || user?.username}!</h2>
            <p className="home-greeting-subtitle">{analysis.insights?.[0] || 'Semoga harimu menyenangkan! 🌟'}</p>
          </div>
          <NotificationReminder />
        </div>
      </div>

      <div className="card home-summary-card">
        <h3 style={{ fontSize: '1rem', marginBottom: 12 }}>📊 Ringkasan Tidur</h3>
        <ProgressBar value={analysis.avgDuration} max={targetSleep.hours} label="Rata-rata Durasi" color="var(--primary)" />
        <ProgressBar value={analysis.consistency} max={100} label="Konsistensi Jadwal" color="var(--accent)" />
        <div className="home-summary-stats">
          <span>🎯 Target: {targetSleep.hours} jam</span>
          <span className={`home-risk-badge risk-${analysis.riskLevel}`}>
            Risiko: {analysis.riskLevel === 'high' ? 'Tinggi' : analysis.riskLevel === 'medium' ? 'Sedang' : 'Rendah'}
          </span>
        </div>
      </div>

      <div className="card home-mood-card">
        <h3 style={{ textAlign: 'center', marginBottom: 12 }}>Bagaimana perasaanmu hari ini?</h3>
        <MoodSelector value={mood} onChange={(m) => {
          setMood(m);
          const moodMessages = { happy: 'Aku merasa senang hari ini!', neutral: 'Perasaanku biasa saja hari ini', sad: 'Aku merasa sedih, butuh teman cerita', stressed: 'Aku lagi stres nih', anxious: 'Aku merasa cemas' };
          if (moodMessages[m]) { addUserMessage(moodMessages[m]); setShowChat(true); }
        }} />
      </div>

      <div className="card home-chat-card">
        <div className="chat-header">
          <span className="chat-header-icon">🤖</span>
          <div className="chat-header-info">
            <h3>SobatSense</h3>
            <p>Teman curhat & panduan tidurmu</p>
          </div>
          <button className="btn btn-sm btn-outline chat-toggle-btn" onClick={() => setShowChat(!showChat)}>
            {showChat ? 'Sembunyikan' : '💬 Chat'}
          </button>
        </div>

        {showChat && (
          <>
            <div className="chat-messages-container">
              {messages.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 20 }}>Hai! Ada yang bisa aku bantu? 👋</p>
              )}
              {messages.map((msg, i) => (
                <ChatBubble key={i} message={msg} isUser={msg.role === 'user'} />
              ))}
              {isLoading && <div className="typing-indicator">SobatSense sedang mengetik...</div>}
            </div>
            <QuickReply onSelect={handleQuickReply} disabled={isLoading} />
            <form className="chat-input-form" onSubmit={handleSend}>
              <input
                className="chat-input"
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Tanyakan sesuatu ke SobatSense..."
              />
              <button className="btn btn-primary btn-sm chat-send-btn" disabled={isLoading || !chatInput.trim()}>➤</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}