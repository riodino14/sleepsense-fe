import React, { useState } from 'react';
import '../styles/forms.css';

export default function ScreenTimeForm({ onSubmit }) {
  const [form, setForm] = useState({ duration: '', activity: 'social_media', notes: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.duration || form.duration <= 0) return;
    onSubmit({ ...form, duration: Number(form.duration), date: new Date().toISOString() });
    setForm({ duration: '', activity: 'social_media', notes: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="card form-card">
      <h3>Catat Screen Time Sebelum Tidur</h3>
      <div className="input-group">
        <label>Durasi (menit)</label>
        <input type="number" min="0" max="480" value={form.duration}
          onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="Misal: 45" required />
      </div>
      <div className="input-group">
        <label>Aktivitas</label>
        <select value={form.activity} onChange={e => setForm(f => ({ ...f, activity: e.target.value }))}>
          <option value="social_media">📱 Media Sosial</option>
          <option value="streaming">🎬 Streaming</option>
          <option value="gaming">🎮 Gaming</option>
          <option value="work">💼 Kerja/Belajar</option>
          <option value="other">📖 Lainnya</option>
        </select>
      </div>
      <div className="input-group">
        <label>Catatan (opsional)</label>
        <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} />
      </div>
      <button type="submit" className="btn btn-accent btn-block">📝 Catat</button>
    </form>
  );
}