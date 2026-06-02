import React, { useState, useEffect } from 'react';
import ScreenTimeForm from '../components/ScreenTimeForm';
import ChatBubble from '../components/Chatbubble';
import QuickReply from '../components/QuickReply';
import { useChat } from '../context/ChatContext';
import { useSleepData } from '../context/SleepDataContext';

const ACTIVITY_EMOJI = {
  social_media: '📱', streaming: '🎬', gaming: '🎮', work: '💼', other: '📖'
};
const ACTIVITY_LABEL = {
  social_media: 'Media Sosial', streaming: 'Streaming', gaming: 'Gaming', work: 'Kerja/Belajar', other: 'Lainnya'
};

// ── Modal Edit Screen Time ────────────────────────────────────
function EditScreenModal({ record, onSave, onClose }) {
  const [form, setForm] = useState({
    duration: record.duration || '',
    activity: record.activity || 'social_media',
    notes: record.notes || ''
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.duration) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'flex-end', zIndex: 1000
    }}>
      <div style={{
        background: 'var(--bg-card)', borderRadius: '20px 20px 0 0',
        padding: 24, width: '100%'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: '1.1rem' }}>✏️ Edit Screen Time</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--text-secondary)' }}>✕</button>
        </div>
        <div className="input-group">
          <label>Durasi (menit) *</label>
          <input type="number" min="0" max="480" value={form.duration}
            onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
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
          <label>Catatan</label>
          <textarea value={form.notes} rows={2}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={onClose}>Batal</button>
          <button className="btn btn-accent btn-sm" style={{ flex: 2 }} onClick={handleSave} disabled={saving || !form.duration}>
            {saving ? '⏳ Menyimpan...' : '💾 Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ScreenPage() {
  const { messages, isLoading, addUserMessage } = useChat();
  const {
    screenTimeRecords, fetchScreenTimeData,
    addScreenTimeRecord, updateScreenTimeRecord, deleteScreenTimeRecord
  } = useSleepData();
  const [chatInput, setChatInput] = useState('');
  const [editingRecord, setEditingRecord] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => { fetchScreenTimeData(7); }, [fetchScreenTimeData]);

  const handleRecord = (record) => {
    addScreenTimeRecord(record);
    addUserMessage(`Aku barusan mencatat screen time ${record.duration} menit sebelum tidur (${ACTIVITY_LABEL[record.activity] || record.activity}). Ada saran untuk menguranginya?`);
  };

  const handleEditSave = async (formData) => {
    await updateScreenTimeRecord(editingRecord.id, formData);
    setEditingRecord(null);
  };

  const handleDelete = async (id) => {
    await deleteScreenTimeRecord(id);
    setConfirmDeleteId(null);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    addUserMessage(chatInput.trim());
    setChatInput('');
  };

  // Total screen time hari ini
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecords = screenTimeRecords.filter(r => r.date?.startsWith(todayStr));
  const todayTotal = todayRecords.reduce((sum, r) => sum + (r.duration || 0), 0);

  return (
    <div className="page-content">
      <div className="card" style={{ marginBottom: 16, background: 'linear-gradient(135deg, #FFF3E0, #FFECB3)' }}>
        <h2 style={{ fontSize: 18, marginBottom: 4 }}>📱 Manajemen Screen Time</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Cahaya biru dari layar dapat menekan melatonin hingga <strong>50%</strong>. Idealnya, hentikan screen time <strong>30-60 menit</strong> sebelum tidur.
        </p>
        {todayTotal > 0 && (
          <div style={{ marginTop: 10, padding: '8px 12px', background: todayTotal > 60 ? '#FFEBEE' : '#E8F5E9', borderRadius: 10 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              {todayTotal > 60 ? '⚠️' : '✅'} Hari ini: <strong>{todayTotal} menit</strong> screen time
              {todayTotal > 60 ? ' — coba dikurangi ya!' : ' — bagus!'}
            </span>
          </div>
        )}
      </div>

      <ScreenTimeForm onSubmit={handleRecord} />

      {/* Riwayat Screen Time */}
      {screenTimeRecords.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: '1rem', marginBottom: 12 }}>📝 Riwayat Screen Time</h3>
          {screenTimeRecords.slice(0, 10).map((r) => (
            <div key={r.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0',
              borderBottom: '1px solid var(--border)', fontSize: '0.9rem'
            }}>
              <div>
                <span>{ACTIVITY_EMOJI[r.activity] || '📖'} {ACTIVITY_LABEL[r.activity] || r.activity}</span>
                {r.date && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 8 }}>
                    {new Date(r.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 600 }}>{r.duration} mnt</span>
                <button
                  onClick={() => setEditingRecord(r)}
                  style={{ background: '#E8EAF6', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--primary)' }}
                >✏️</button>
                <button
                  onClick={() => setConfirmDeleteId(r.id)}
                  style={{ background: '#FFEBEE', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontSize: '0.75rem', color: '#D32F2F' }}
                >🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chat Section */}
      <div className="card">
        <h3 style={{ fontSize: '1rem', marginBottom: 12 }}>💬 Diskusi Screen Time dengan SobatSense</h3>
        <div style={{ maxHeight: 250, overflowY: 'auto', marginBottom: 8, background: 'var(--bg-main)', borderRadius: 12, padding: 8 }}>
          {messages.slice(-6).map((msg, i) => (
            <ChatBubble key={i} message={msg} isUser={msg.role === 'user'} />
          ))}
          {isLoading && <p style={{ color: 'var(--text-muted)', padding: 12 }}>Mengetik...</p>}
        </div>
        <QuickReply onSelect={(k) => addUserMessage(k === 'screen_time' ? 'Bagaimana cara mengurangi screen time?' : k)} disabled={isLoading} />
        <form onSubmit={handleSend} style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
            placeholder="Tanya tentang screen time..." style={{ flex: 1, padding: '10px 16px', borderRadius: 24, border: '1px solid var(--border)', background: 'var(--bg-input)' }} />
          <button type="submit" className="btn btn-accent btn-sm" disabled={isLoading || !chatInput.trim()} style={{ borderRadius: 24 }}>➤</button>
        </form>
      </div>

      {/* Modal Edit */}
      {editingRecord && (
        <EditScreenModal record={editingRecord} onSave={handleEditSave} onClose={() => setEditingRecord(null)} />
      )}

      {/* Konfirmasi Delete */}
      {confirmDeleteId && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: 24, width: 300 }}>
            <h3 style={{ marginBottom: 8, fontSize: '1rem' }}>🗑️ Hapus Data Screen Time?</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
              Data ini akan dihapus permanen.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => setConfirmDeleteId(null)}>Batal</button>
              <button className="btn btn-sm" style={{ flex: 1, background: '#D32F2F', color: 'white', border: 'none', borderRadius: 8 }}
                onClick={() => handleDelete(confirmDeleteId)}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
