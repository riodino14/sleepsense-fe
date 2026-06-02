import React, { useState } from 'react';
import '../styles/forms.css';

export default function SleepForm({ onSubmit, initialData }) {
  const [form, setForm] = useState({
    sleepTime: initialData?.sleepTime || '',
    wakeTime: initialData?.wakeTime || '',
    quality: initialData?.quality || 'good',
    notes: initialData?.notes || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.sleepTime || !form.wakeTime) return;
    const sleepParts = form.sleepTime.split(':').map(Number);
    const wakeParts = form.wakeTime.split(':').map(Number);
    let duration = wakeParts[0] - sleepParts[0] + (wakeParts[1] - sleepParts[1]) / 60;
    if (duration < 0) duration += 24;
    onSubmit({ ...form, duration: Math.round(duration * 10) / 10 });
    setForm({ sleepTime: '', wakeTime: '', quality: 'good', notes: '' });
  };

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <form onSubmit={handleSubmit} className="card form-card">
      <h3>Catat Tidur Malam Ini</h3>
      <div className="form-row">
        <div className="input-group">
          <label>Jam Tidur</label>
          <input type="time" value={form.sleepTime} onChange={e => update('sleepTime', e.target.value)} required />
        </div>
        <div className="input-group">
          <label>Jam Bangun</label>
          <input type="time" value={form.wakeTime} onChange={e => update('wakeTime', e.target.value)} required />
        </div>
      </div>
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
      <button type="submit" className="btn btn-primary btn-block">💾 Simpan</button>
    </form>
  );
}