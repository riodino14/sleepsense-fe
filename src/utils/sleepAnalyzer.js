export function analyzeSleep(sleepRecords, targetHours = 8) {
  if (!sleepRecords.length) return { avgDuration: 0, consistency: 0, trend: 'no_data', riskLevel: 'low', insights: [] };

  const durations = sleepRecords.map(r => r.duration || 0);
  const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;

  // Consistency: standard deviation, lower = more consistent
  const variance = durations.reduce((sum, d) => sum + Math.pow(d - avgDuration, 2), 0) / durations.length;
  const stdDev = Math.sqrt(variance);
  const consistency = Math.max(0, 100 - (stdDev / 2) * 100);

  // Trend: simple linear regression on last 7 days
  const n = durations.length;
  const indices = durations.map((_, i) => i);
  const xMean = (n - 1) / 2;
  const yMean = avgDuration;
  const slope = indices.reduce((sum, x, i) => sum + (x - xMean) * (durations[i] - yMean), 0) /
                indices.reduce((sum, x) => sum + Math.pow(x - xMean, 2), 0);
  const trend = slope > 0.1 ? 'improving' : slope < -0.1 ? 'declining' : 'stable';

  // Risk assessment
  let riskLevel = 'low';
  const insights = [];
  if (avgDuration < 6) { riskLevel = 'high'; insights.push('Durasi tidur rata-rata kurang dari 6 jam. Ini meningkatkan risiko hipertensi hingga 20%.'); }
  else if (avgDuration < 7) { riskLevel = 'medium'; insights.push('Durasi tidur di bawah rekomendasi 7-9 jam. Coba tambahkan 30 menit tidur.'); }
  else { insights.push('Durasi tidur rata-rata sudah cukup baik! 👍'); }

  if (consistency < 50) { insights.push('Jadwal tidur tidak konsisten. Usahakan tidur dan bangun di jam yang sama setiap hari.'); }
  if (trend === 'declining') { insights.push('Tren durasi tidur menurun. Perhatikan faktor yang mungkin mengganggu tidurmu.'); }

  return { avgDuration: Math.round(avgDuration * 10) / 10, consistency: Math.round(consistency), trend, riskLevel, insights };
}

export function getSleepQualityLabel(duration, quality) {
  if (quality === 'bad' || duration < 5) return { label: 'Kurang', color: '#F44336' };
  if (quality === 'good' && duration >= 7) return { label: 'Baik', color: '#4CAF50' };
  return { label: 'Cukup', color: '#FF9800' };
}