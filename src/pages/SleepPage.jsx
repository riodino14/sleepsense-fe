import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSleepData } from '../context/SleepDataContext';
import { analyzeSleep } from '../utils/sleepAnalyzer';
import { getWeekDates } from '../utils/dateHelper';
import SleepForm from '../components/SleepForm';
import ProgressBar from '../components/ProgressBar';

// ── Komponen Modal Edit ───────────────────────────────────────
function calcDuration(bedtime, wakeTime) {
  if (!bedtime || !wakeTime) return null;
  const [bh, bm] = bedtime.split(':').map(Number);
  const [wh, wm] = wakeTime.split(':').map(Number);
  let dur = (wh + wm / 60) - (bh + bm / 60);
  if (dur < 0) dur += 24;
  return Math.round(dur * 10) / 10;
}

function EditSleepModal({ record, onSave, onClose }) {
  const [form, setForm] = useState({
    bedtime: record.bedtime || '',
    wakeTime: record.wakeTime || '',
    qualityScore: record.qualityScore || '',
    screenTimeBefore: record.screenTimeBefore || '',
    notes: record.notes || '',
    date: record.date ? record.date.split('T')[0] : new Date().toISOString().split('T')[0]
  });
  const [saving, setSaving] = useState(false);

  // Durasi dihitung otomatis dari bedtime & wakeTime
  const duration = calcDuration(form.bedtime, form.wakeTime);

  const handleSave = async () => {
    if (!form.bedtime || !form.wakeTime) return;
    setSaving(true);
    await onSave({ ...form, duration: duration ?? record.duration ?? 0 });
    setSaving(false);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'flex-end', zIndex: 1000
    }}>
      <div style={{
        background: 'var(--bg-card)', borderRadius: '20px 20px 0 0',
        padding: 24, width: '100%', maxHeight: '85vh', overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: '1.1rem' }}>✏️ Edit Catatan Tidur</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--text-secondary)' }}>✕</button>
        </div>

        <div className="input-group">
          <label>Tanggal</label>
          <input type="date" value={form.date}
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="input-group">
            <label>Jam Tidur</label>
            <input type="time" value={form.bedtime}
              onChange={e => setForm(f => ({ ...f, bedtime: e.target.value }))} />
          </div>
          <div className="input-group">
            <label>Jam Bangun</label>
            <input type="time" value={form.wakeTime}
              onChange={e => setForm(f => ({ ...f, wakeTime: e.target.value }))} />
          </div>
        </div>
        {/* Durasi otomatis — dihitung dari jam tidur & jam bangun */}
        {duration !== null && (
          <div style={{
            background: 'var(--bg-main)', borderRadius: 10,
            padding: '10px 14px', marginBottom: 12,
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: '0.88rem', color: 'var(--text-secondary)'
          }}>
            🕐 Durasi:&nbsp;
            <strong style={{
              color: duration >= 7 ? 'var(--success)' : duration >= 6 ? 'var(--warning)' : '#E53E3E'
            }}>
              {duration} jam
            </strong>
          </div>
        )}
        <div className="input-group">
          <label>Skor Kualitas (1-10)</label>
          <input type="number" min="1" max="10" value={form.qualityScore}
            onChange={e => setForm(f => ({ ...f, qualityScore: e.target.value }))} />
        </div>
        <div className="input-group">
          <label>Screen Time Sebelum Tidur (jam)</label>
          <input type="number" min="0" max="12" step="0.5" value={form.screenTimeBefore}
            onChange={e => setForm(f => ({ ...f, screenTimeBefore: e.target.value }))} />
        </div>
        <div className="input-group">
          <label>Catatan</label>
          <textarea value={form.notes} rows={2}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={onClose}>Batal</button>
          <button className="btn btn-primary btn-sm" style={{ flex: 2 }} onClick={handleSave} disabled={saving || !form.bedtime || !form.wakeTime}>
            {saving ? '⏳ Menyimpan...' : '💾 Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Export CSV Helper ─────────────────────────────────────────
function exportToCSV(records) {
  const header = 'Tanggal,Jam Tidur,Jam Bangun,Durasi (jam),Kualitas (1-10),Screen Time Sebelum (jam),Catatan';
  const rows = records.map(r => [
    r.date ? new Date(r.date).toLocaleDateString('id-ID') : '-',
    r.bedtime || '-',
    r.wakeTime || '-',
    r.duration || '0',
    r.qualityScore || '-',
    r.screenTimeBefore || '-',
    (r.notes || '').replace(/,/g, ';')
  ].join(','));
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sleepsense_riwayat_tidur_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Main Component ────────────────────────────────────────────
export default function SleepPage() {
  const { sleepRecords, targetSleep, fetchSleepData, addSleepRecord, updateSleepRecord, deleteSleepRecord, updateTarget } = useSleepData();
  const [editingTarget, setEditingTarget] = useState(false);
  const [targetForm, setTargetForm] = useState({ hours: targetSleep.hours, bedtime: targetSleep.bedtime, wakeTime: targetSleep.wakeTime });
  const [editingRecord, setEditingRecord] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => { fetchSleepData(7); }, [fetchSleepData]);

  const analysis = analyzeSleep(sleepRecords, targetSleep.hours);
  const weekDates = getWeekDates();

  const chartData = weekDates.map(date => {
    const record = sleepRecords.find(r => r.date?.startsWith(date));
    return { date: date.slice(5), duration: record?.duration || 0, target: targetSleep.hours };
  });

  const handleSleepSubmit = (record) => { addSleepRecord(record); };

  const handleTargetSave = () => {
    updateTarget({ hours: Number(targetForm.hours), bedtime: targetForm.bedtime, wakeTime: targetForm.wakeTime });
    setEditingTarget(false);
  };

  const handleEditSave = async (formData) => {
    await updateSleepRecord(editingRecord.id, formData);
    setEditingRecord(null);
  };

  const handleDelete = async (id) => {
    await deleteSleepRecord(id);
    setConfirmDeleteId(null);
  };

  const displayedRecords = showAll ? sleepRecords : sleepRecords.slice(0, 5);

  return (
    <div className="page-content">
      {/* Target */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1rem' }}>🎯 Target Tidur</h3>
          <button className="btn btn-sm btn-outline" onClick={() => setEditingTarget(!editingTarget)}>
            {editingTarget ? 'Batal' : '✏️ Edit'}
          </button>
        </div>
        {editingTarget ? (
          <div style={{ marginTop: 12 }}>
            <div className="input-group">
              <label>Target Durasi (jam)</label>
              <input type="number" min="5" max="12" step="0.5" value={targetForm.hours}
                onChange={e => setTargetForm(f => ({ ...f, hours: e.target.value }))} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="input-group">
                <label>Jam Tidur</label>
                <input type="time" value={targetForm.bedtime} onChange={e => setTargetForm(f => ({ ...f, bedtime: e.target.value }))} />
              </div>
              <div className="input-group">
                <label>Jam Bangun</label>
                <input type="time" value={targetForm.wakeTime} onChange={e => setTargetForm(f => ({ ...f, wakeTime: e.target.value }))} />
              </div>
            </div>
            <button className="btn btn-primary btn-block btn-sm" onClick={handleTargetSave}>💾 Simpan Target</button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
            <div><span style={{ color: 'var(--text-muted)' }}>Durasi:</span> <strong>{targetSleep.hours} jam</strong></div>
            <div><span style={{ color: 'var(--text-muted)' }}>Tidur:</span> <strong>{targetSleep.bedtime}</strong></div>
            <div><span style={{ color: 'var(--text-muted)' }}>Bangun:</span> <strong>{targetSleep.wakeTime}</strong></div>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: '1rem', marginBottom: 12 }}>📈 Grafik Tidur 7 Hari</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" fontSize={11} tick={{ fill: 'var(--text-secondary)' }} />
            <YAxis domain={[0, 12]} fontSize={11} tick={{ fill: 'var(--text-secondary)' }} />
            <Tooltip />
            <Bar dataKey="duration" fill="var(--primary)" radius={[6, 6, 0, 0]} name="Durasi (jam)" />
            <Bar dataKey="target" fill="var(--accent-light)" radius={[6, 6, 0, 0]} name="Target" opacity={0.4} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: '1rem', marginBottom: 12 }}>📊 Statistik</h3>
        <ProgressBar value={analysis.avgDuration} max={targetSleep.hours} label="Rata-rata Durasi" color="var(--primary)" />
        <ProgressBar value={analysis.consistency} max={100} label="Konsistensi" color="var(--accent)" />
        {analysis.insights?.map((insight, i) => (
          <p key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 8 }}>💡 {insight}</p>
        ))}
      </div>

      {/* Form */}
      <SleepForm onSubmit={handleSleepSubmit} />

      {/* Riwayat Tidur */}
      {sleepRecords.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: '1rem' }}>📋 Riwayat Tidur</h3>
            <button
              className="btn btn-sm btn-outline"
              onClick={() => exportToCSV(sleepRecords)}
              style={{ fontSize: '0.78rem' }}
            >
              ⬇️ Export CSV
            </button>
          </div>

          {displayedRecords.map((r) => (
            <div key={r.id} style={{
              background: 'var(--bg-main)', borderRadius: 12,
              padding: '12px 14px', marginBottom: 8
            }}>
              {/* Baris atas: info tidur */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                    🕐 {r.bedtime || '?'} → {r.wakeTime || '?'}
                  </span>
                  <span style={{ marginLeft: 8, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {r.date ? new Date(r.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : ''}
                  </span>
                </div>
                <span style={{ fontWeight: 700, color: r.duration >= 7 ? 'var(--success)' : 'var(--warning)' }}>
                  {r.duration} jam
                </span>
              </div>

              {/* Baris bawah: detail + aksi */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: 12 }}>
                  {r.qualityScore && <span>⭐ {r.qualityScore}/10</span>}
                  {r.screenTimeBefore && <span>📱 {r.screenTimeBefore}j</span>}
                </div>
                {/* Tombol Edit & Delete */}
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => setEditingRecord(r)}
                    style={{
                      background: 'var(--primary-light, #E8EAF6)', border: 'none',
                      borderRadius: 8, padding: '4px 10px', cursor: 'pointer',
                      fontSize: '0.78rem', color: 'var(--primary)'
                    }}
                  >✏️ Edit</button>
                  <button
                    onClick={() => setConfirmDeleteId(r.id)}
                    style={{
                      background: '#FFEBEE', border: 'none',
                      borderRadius: 8, padding: '4px 10px', cursor: 'pointer',
                      fontSize: '0.78rem', color: '#D32F2F'
                    }}
                  >🗑️ Hapus</button>
                </div>
              </div>

              {r.notes && (
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4, fontStyle: 'italic' }}>
                  "{r.notes}"
                </p>
              )}
            </div>
          ))}

          {sleepRecords.length > 5 && (
            <button className="btn btn-outline btn-block btn-sm" onClick={() => setShowAll(!showAll)}>
              {showAll ? '▲ Tampilkan lebih sedikit' : `▼ Lihat semua (${sleepRecords.length} data)`}
            </button>
          )}
        </div>
      )}

      {/* Modal Edit */}
      {editingRecord && (
        <EditSleepModal
          record={editingRecord}
          onSave={handleEditSave}
          onClose={() => setEditingRecord(null)}
        />
      )}

      {/* Konfirmasi Delete */}
      {confirmDeleteId && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: 24, width: 300 }}>
            <h3 style={{ marginBottom: 8, fontSize: '1rem' }}>🗑️ Hapus Data Tidur?</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
              Data ini akan dihapus permanen dan tidak dapat dikembalikan.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => setConfirmDeleteId(null)}>
                Batal
              </button>
              <button
                className="btn btn-sm" style={{ flex: 1, background: '#D32F2F', color: 'white', border: 'none', borderRadius: 8 }}
                onClick={() => handleDelete(confirmDeleteId)}
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
