import React, { useState, useEffect } from 'react';
import DASS21Form from '../components/DASS21Form';
import { useChat } from '../context/ChatContext';
import ChatBubble from '../components/Chatbubble';
import QuickReply from '../components/QuickReply';
import { useSleepData } from '../context/SleepDataContext';
import api from '../services/api';

// ── Warna badge berdasarkan kategori ─────────────────────────
function categoryColor(cat) {
  if (!cat) return '#9E9E9E';
  const c = cat.toLowerCase();
  if (c === 'normal') return '#4CAF50';
  if (c.includes('ringan')) return '#FF9800';
  if (c.includes('sedang')) return '#F44336';
  if (c.includes('berat') || c.includes('sangat')) return '#9C27B0';
  return '#607D8B';
}

// ── Komponen riwayat DASS-21 ──────────────────────────────────
function Dass21HistoryCard({ item }) {
  const d = new Date(item.date);
  const dateStr = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  return (
    <div style={{
      background: 'var(--bg-main)', borderRadius: 12,
      padding: '12px 14px', marginBottom: 8
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>📋 Skrining DASS-21</span>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{dateStr}</span>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {[
          { label: 'Depresi', val: item.depression },
          { label: 'Kecemasan', val: item.anxiety },
          { label: 'Stres', val: item.stress }
        ].map(({ label, val }) => (
          <div key={label} style={{
            background: categoryColor(val?.category) + '22',
            border: `1px solid ${categoryColor(val?.category)}`,
            borderRadius: 8, padding: '4px 10px', fontSize: '0.78rem'
          }}>
            <span style={{ color: 'var(--text-secondary)' }}>{label}: </span>
            <span style={{ fontWeight: 700, color: categoryColor(val?.category) }}>
              {val?.category || '-'}
            </span>
            {val?.score !== undefined && (
              <span style={{ color: 'var(--text-muted)', marginLeft: 4 }}>({val.score})</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HealthPage() {
  const [showDASS, setShowDASS] = useState(false);
  const [dassResult, setDassResult] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const { messages, isLoading, addUserMessage, setPredictionResult } = useChat();
  const { sleepRecords, dass21History, fetchDass21History, saveDass21 } = useSleepData();
  const [chatInput, setChatInput] = useState('');

  const [showPredictForm, setShowPredictForm] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [predictForm, setPredictForm] = useState({
    gender: 'Male',
    physical_activity_minutes: 30,
    caffeine_intake_cups: 2,
    mental_fatigue_score: 5,
    notifications_received_per_day: 50
  });

  useEffect(() => { fetchDass21History(); }, [fetchDass21History]);

  const handleDASSComplete = async (result) => {
    setDassResult(result);
    // Simpan ke database
    try {
      await saveDass21({
        depression: result.depression,
        anxiety: result.anxiety,
        stress: result.stress,
        totalScore: (result.depression.score || 0) + (result.anxiety.score || 0) + (result.stress.score || 0)
      });
    } catch (e) {
      console.error('Gagal simpan DASS-21:', e);
    }
    const summary = `Hasil DASS-21: Depresi=${result.depression.category}, Kecemasan=${result.anxiety.category}, Stres=${result.stress.category}`;
    addUserMessage(`Aku baru selesai DASS-21. ${summary}. Bisa jelaskan hasilnya?`);
  };

  const handlePredict = async () => {
    setPredicting(true);
    try {
      const latest = sleepRecords[0];
      const payload = {
        age: 25,
        gender: predictForm.gender,
        sleep_duration_hours: latest?.duration || 7,
        sleep_quality_score: latest?.qualityScore || 5,
        daily_screen_time_hours: (latest?.screenTimeBefore || 1) * 2,
        pre_sleep_screen_time_hours: latest?.screenTimeBefore || 1,
        physical_activity_minutes: Number(predictForm.physical_activity_minutes),
        caffeine_intake_cups: Number(predictForm.caffeine_intake_cups),
        mental_fatigue_score: Number(predictForm.mental_fatigue_score),
        notifications_received_per_day: Number(predictForm.notifications_received_per_day)
      };
      const { data } = await api.post('/chat/analyze', payload);
      setPrediction(data);
      if (setPredictionResult) setPredictionResult(data);
      const riskMsg = `Aku baru saja melihat hasil analisis risiko tidurku. Hasilnya: Risiko ${data.prediction?.risk_level || 'Sedang'} (probabilitas ${Math.round((data.prediction?.risk_probability || 0.5) * 100)}%). ${data.advice ? 'Bisa jelaskan lebih lanjut?' : ''}`;
      addUserMessage(riskMsg);
      setShowPredictForm(false);
    } catch (err) {
      console.error('Predict error:', err);
      addUserMessage('Aku ingin tahu risiko kesehatan tidurku. Bisa bantu analisis berdasarkan kebiasaan tidurku?');
    } finally {
      setPredicting(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    addUserMessage(chatInput.trim());
    setChatInput('');
  };

  return (
    <div className="page-content">
      {/* Hipertensi Info */}
      <div className="card" style={{ marginBottom: 16, background: 'linear-gradient(135deg, #FFEBEE, #FFCDD2)', color: '#1a1a1a' }}>
        <h2 style={{ fontSize: 18, marginBottom: 4 }}>❤️ Risiko Hipertensi & Tidur</h2>
        <p style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
          Kurang tidur kronis (<strong>&lt;6 jam</strong>) meningkatkan risiko hipertensi hingga <strong>20%</strong>.
        </p>
        <ul style={{ fontSize: '0.85rem', marginTop: 8, paddingLeft: 20 }}>
          <li>Tidur 7-9 jam setiap malam</li>
          <li>Jadwal tidur konsisten</li>
          <li>Hindari kafein setelah jam 2 siang</li>
          <li>Kurangi screen time sebelum tidur</li>
        </ul>
      </div>

      {/* Prediksi AI */}
      <div className="card" style={{ marginBottom: 16, background: 'linear-gradient(135deg, #E8EAF6, #E3F2FD)', color: '#1a1a1a' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: 8 }}>🤖 Analisis Risiko AI</h3>
        <p style={{ fontSize: '0.85rem', color: '#1a3a5c', marginBottom: 12 }}>
          Model AI kami menganalisis pola tidur & gaya hidup kamu.<br />
          <strong>Akurasi model: 90.9%</strong> · Bukan diagnosis medis.
        </p>
        {prediction ? (
          <div style={{
            background: prediction.prediction?.risk_level === 'Tinggi' ? '#FFEBEE' :
                        prediction.prediction?.risk_level === 'Sedang' ? '#FFF8E1' : '#E8F5E9',
            borderRadius: 12, padding: 16, marginBottom: 12, color: '#1a1a1a'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 32 }}>
                {prediction.prediction?.risk_level === 'Tinggi' ? '🔴' :
                 prediction.prediction?.risk_level === 'Sedang' ? '🟡' : '🟢'}
              </span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Risiko {prediction.prediction?.risk_level}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Probabilitas: {Math.round((prediction.prediction?.risk_probability || 0) * 100)}%
                </div>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', marginBottom: 8 }}>{prediction.prediction?.summary}</p>
            {prediction.advice && (
              <div style={{ fontSize: '0.85rem', background: 'rgba(255,255,255,0.7)', borderRadius: 8, padding: 10, marginTop: 8, color: '#1a1a1a' }}>
                <strong>💡 Saran Gemini AI:</strong>
                <p style={{ marginTop: 4, lineHeight: 1.5 }}>{prediction.advice}</p>
              </div>
            )}
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>⚠️ {prediction.prediction?.disclaimer}</p>
            <button className="btn btn-outline btn-sm" style={{ marginTop: 8 }}
              onClick={() => { setPrediction(null); setShowPredictForm(false); }}>🔄 Analisis Ulang</button>
          </div>
        ) : showPredictForm ? (
          <div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 12 }}>Data tidur otomatis diambil. Lengkapi info berikut:</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <div className="input-group">
                <label style={{ fontSize: '0.8rem' }}>Jenis Kelamin</label>
                <select value={predictForm.gender} onChange={e => setPredictForm(f => ({ ...f, gender: e.target.value }))}
                  style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-input)' }}>
                  <option value="Male">Laki-laki</option>
                  <option value="Female">Perempuan</option>
                </select>
              </div>
              <div className="input-group">
                <label style={{ fontSize: '0.8rem' }}>Aktivitas Fisik (mnt/hari)</label>
                <input type="number" min="0" max="300" value={predictForm.physical_activity_minutes}
                  onChange={e => setPredictForm(f => ({ ...f, physical_activity_minutes: e.target.value }))}
                  style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)' }} />
              </div>
              <div className="input-group">
                <label style={{ fontSize: '0.8rem' }}>Kafein (cangkir/hari)</label>
                <input type="number" min="0" max="10" value={predictForm.caffeine_intake_cups}
                  onChange={e => setPredictForm(f => ({ ...f, caffeine_intake_cups: e.target.value }))}
                  style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)' }} />
              </div>
              <div className="input-group">
                <label style={{ fontSize: '0.8rem' }}>Kelelahan Mental (1-10)</label>
                <input type="number" min="1" max="10" value={predictForm.mental_fatigue_score}
                  onChange={e => setPredictForm(f => ({ ...f, mental_fatigue_score: e.target.value }))}
                  style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)' }} />
              </div>
            </div>
            <div className="input-group" style={{ marginBottom: 12 }}>
              <label style={{ fontSize: '0.8rem' }}>Notifikasi HP per hari</label>
              <input type="number" min="0" max="500" value={predictForm.notifications_received_per_day}
                onChange={e => setPredictForm(f => ({ ...f, notifications_received_per_day: e.target.value }))}
                style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', width: '100%' }} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => setShowPredictForm(false)}>Batal</button>
              <button className="btn btn-primary btn-sm" style={{ flex: 2 }} onClick={handlePredict} disabled={predicting}>
                {predicting ? '🔄 Menganalisis...' : '🤖 Analisis Sekarang'}
              </button>
            </div>
          </div>
        ) : (
          <button className="btn btn-primary btn-block" onClick={() => setShowPredictForm(true)}>
            🔍 Cek Risiko Tidurku
          </button>
        )}
      </div>

      {/* DASS-21 */}
      {!showDASS ? (
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h3 style={{ fontSize: '1rem' }}>📋 Skrining DASS-21</h3>
            {dass21History.length > 0 && (
              <button className="btn btn-sm btn-outline" style={{ fontSize: '0.78rem' }}
                onClick={() => setShowHistory(!showHistory)}>
                {showHistory ? '▲ Sembunyikan' : `📂 Riwayat (${dass21History.length})`}
              </button>
            )}
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
            Alat skrining 21 item untuk mengukur depresi, kecemasan, dan stres.<br />
            <strong>Ini bukan diagnosis medis.</strong>
          </p>

          {/* Riwayat DASS-21 */}
          {showHistory && dass21History.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: 8, color: 'var(--text-secondary)' }}>📜 Riwayat Skrining</h4>
              {dass21History.map((item) => (
                <Dass21HistoryCard key={item.id} item={item} />
              ))}
            </div>
          )}

          <button className="btn btn-accent" onClick={() => setShowDASS(true)}>
            🧠 Mulai Skrining DASS-21
          </button>
        </div>
      ) : (
        <DASS21Form onComplete={handleDASSComplete} />
      )}

      {dassResult && (
        <div className="card" style={{ marginBottom: 16, background: '#FFF3E0', color: '#1a1a1a' }}>
          <h4 style={{ fontSize: '0.9rem', marginBottom: 8 }}>✅ Hasil Skrining Tersimpan</h4>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
            {[
              { label: 'Depresi', val: dassResult.depression },
              { label: 'Kecemasan', val: dassResult.anxiety },
              { label: 'Stres', val: dassResult.stress }
            ].map(({ label, val }) => (
              <div key={label} style={{
                background: categoryColor(val?.category) + '22',
                border: `1px solid ${categoryColor(val?.category)}`,
                borderRadius: 8, padding: '4px 10px', fontSize: '0.8rem'
              }}>
                {label}: <strong style={{ color: categoryColor(val?.category) }}>{val?.category}</strong>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.85rem' }}>
            ⚠️ Jika perlu bantuan: 📞 <strong>KESWA: 119 ext 8</strong> atau <strong>021-500-454</strong>
          </p>
          <button className="btn btn-outline btn-sm" style={{ marginTop: 8 }}
            onClick={() => { setShowDASS(true); setDassResult(null); }}>
            🔄 Skrining Ulang
          </button>
        </div>
      )}

      {/* Chat */}
      <div className="card">
        <h3 style={{ fontSize: '1rem', marginBottom: 12 }}>💬 Tanya SobatSense tentang Kesehatan</h3>
        <div style={{ maxHeight: 250, overflowY: 'auto', marginBottom: 8, background: 'var(--bg-main)', borderRadius: 12, padding: 8 }}>
          {messages.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 16 }}>
              Tanya SobatSense tentang kesehatan tidurmu 👋
            </p>
          )}
          {messages.slice(-6).map((msg, i) => (
            <ChatBubble key={i} message={msg} isUser={msg.role === 'user'} />
          ))}
          {isLoading && <p style={{ color: 'var(--text-muted)', padding: 12 }}>Mengetik...</p>}
        </div>
        <QuickReply onSelect={(k) => addUserMessage(k)} disabled={isLoading} />
        <form onSubmit={handleSend} style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
            placeholder="Tanya seputar kesehatan..."
            style={{ flex: 1, padding: '10px 16px', borderRadius: 24, border: '1px solid var(--border)', background: 'var(--bg-input)' }} />
          <button type="submit" className="btn btn-accent btn-sm" disabled={isLoading || !chatInput.trim()} style={{ borderRadius: 24 }}>➤</button>
        </form>
      </div>
    </div>
  );
}
