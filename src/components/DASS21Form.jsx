import React, { useState } from 'react';
import { DASS21_ITEMS, getDASS21Options, calculateDASS21, getReferralMessage } from '../utils/dass21Scoring';
import '../styles/forms.css';

const OPTIONS = getDASS21Options();
const ITEMS_PER_STEP = 7;
const TOTAL_STEPS = Math.ceil(DASS21_ITEMS.length / ITEMS_PER_STEP);

export default function DASS21Form({ onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  const currentItems = DASS21_ITEMS.slice(step * ITEMS_PER_STEP, (step + 1) * ITEMS_PER_STEP);
  const canNext = currentItems.every(item => answers[item.id] !== undefined);

  const handleAnswer = (itemId, value) => {
    setAnswers(prev => ({ ...prev, [itemId]: value }));
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
    else {
      const result = calculateDASS21(answers);
      setResults(result);
      if (onComplete) onComplete(result);
    }
  };

  if (results) {
    const { depression, anxiety, stress } = results;
    return (
      <div className="card dass-result-card">
        <h3 style={{ textAlign: 'center' }}>📋 Hasil Skrining DASS-21</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 16, textAlign: 'center' }}>
          Ini hanya alat skrining, bukan diagnosis medis.
        </p>
        {[
          { label: 'Depresi', data: depression },
          { label: 'Kecemasan', data: anxiety },
          { label: 'Stres', data: stress }
        ].map(({ label, data }) => (
          <div key={label} className="dass-result-item" style={{ background: data.color + '18', borderColor: data.color }}>
            <div>
              <strong>{label}</strong>
              <span className="dass-result-label">Skor: {data.score}</span>
            </div>
            <span className="dass-result-badge" style={{ background: data.color }}>{data.category}</span>
          </div>
        ))}
        <div className={`dass-warning ${Object.values(results).some(r => r.level >= 3) ? 'high-risk' : 'low-risk'}`}>
          {getReferralMessage(results)}
        </div>
        <button className="btn btn-outline btn-block" style={{ marginTop: 12 }}
          onClick={() => { setResults(null); setAnswers({}); setStep(0); }}>
          🔄 Ulangi Skrining
        </button>
      </div>
    );
  }

  return (
    <div className="card form-card">
      <div className="dass-step-header">
        <h3>📋 DASS-21</h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{step + 1} / {TOTAL_STEPS}</span>
      </div>
      <div className="dass-progress-bar">
        <div className="dass-progress-fill" style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }} />
      </div>
      <p className="dass-instruction">
        Seberapa sering kamu mengalami hal berikut dalam <strong>1 minggu terakhir</strong>?
      </p>
      {currentItems.map(item => (
        <div key={item.id} className="dass-item">
          <p className="dass-item-question">{item.id}. {item.text}</p>
          <div className="dass-options">
            {OPTIONS.map(opt => (
              <button
                key={opt.value}
                className={`dass-option-btn ${answers[item.id] === opt.value ? 'selected' : ''}`}
                onClick={() => handleAnswer(item.id, opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button className="btn btn-primary btn-block" disabled={!canNext} onClick={handleNext}
        style={{ opacity: canNext ? 1 : 0.5 }}>
        {step < TOTAL_STEPS - 1 ? 'Selanjutnya →' : '🔍 Lihat Hasil'}
      </button>
    </div>
  );
}