import React, { useState, useEffect } from 'react';
import '../styles/forms.css';

function calcDuration(bedtime, wakeTime) {
  if (!bedtime || !wakeTime) return null;
  const [bh, bm] = bedtime.split(':').map(Number);
  const [wh, wm] = wakeTime.split(':').map(Number);
  let dur = (wh + wm / 60) - (bh + bm / 60);
  if (dur < 0) dur += 24;
  return Math.round(dur * 10) / 10;
}

export default function SleepForm({ onSubmit, initialData }) {
  const [form, setForm] = useState({
    bedtime: initialData?.bedtime || '',      // FIX: sleepTime → bedtime
    wakeTime: initialData?.wakeTime || '',
    quality: initialData?.quality || 'good',
    notes: initialData?.notes || ''
  });
  const [duration, setDuration] = useState(null);

  // Auto-hitung durasi setiap kali bedtime/wakeTime berubah
  useEffect(() => {
    setDuration(calcDuration(form.bedtime, form.wakeTime));
  }, [form.bedtime, form.wakeTime]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.bedtime || !form.wakeTime) return;
    onSubmit({
      bedtime: form.bedtime,
      wakeTime: form.wakeTime,
      quality: form.quality,
      notes: form.notes,
      duration: duration ?? 0,
    });
    setForm({ bedtime: '', wakeTime: '', quality: 'good', notes: '' });
    setDuration(null);
  };

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <form onSubmit={handleSubmit} className="card form-card">
      <h3>Catat Tidur Malam Ini</h3>
      <div className="form-row">
        <div className="input-group">
          <label>Jam Tidur</label>
          <input
            type="time"
            value={form.bedtime}
            onChange={e => update('bedtime', e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Jam Bangun</label>
          <input
            type="time"
            value={form.wakeTime}
            onChange={e => update('wakeTime', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Durasi otomatis — read only, muncul setelah kedua jam diisi */}
      {duration !== null && (
        <div style={{
          background: 'var(--bg-main)', borderRadius: 10,
          padding: '10px 14px', marginBottom: 12,
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: '0.88rem', color: 'var(--text-secondary)'
        }}>
          🕐 Durasi tidur:&nbsp;
          <strong style={{
            color: duration >= 7 ? 'var(--success)' : duration >= 6 ? 'var(--warning)' : '#E53E3E'
          }}>
            {duration} jam
          </strong>
          {duration >= 7 && <span>👍</span>}
          {duration > 0 && duration < 6 && <span style={{ fontSize: '0.8rem' }}>⚠️ kurang dari rekomendasi</span>}
        </div>
      )}

      <div className="input-group">
        <label>Kualitas Tidur</label>
        <select value={form.quality} onChange={e => update('quality', e.target.value)}>
          <option value="good">😊 Nyenyak</option>
          <option value="okay">😐 Cukup</option>
          <option value="bad">😟 Kurang</option>
        </select>
      </div>
      <div className="input-group">
        <label>Catatan (opsional)</label>
        <textarea
          value={form.notes}
          onChange={e => update('notes', e.target.value)}
          placeholder="Misal: susah tidur karena kepikiran kerjaan..."
          rows={2}
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary btn-block"
        disabled={!form.bedtime || !form.wakeTime}
      >
        💾 Simpan
      </button>
    </form>
  );
}
