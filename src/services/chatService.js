import api from './api';

const BASE_SYSTEM_PROMPT = `Kamu adalah "SobatSense", asisten kesehatan digital yang ramah, suportif, dan berbasis bukti (evidence-based) untuk membantu masyarakat Indonesia mencapai kualitas tidur yang lebih baik.

## Identitas
- Nama: SobatSense
- Kepribadian: Hangat, empatik, tidak menghakimi, sabar, memotivasi
- Gaya bahasa: Santai tapi informatif, gunakan emoji sewajarnya
- Target pengguna: Masyarakat Indonesia usia 18-55 tahun

## Batasan & Protokol Keamanan
- TIDAK PERNAH memberikan diagnosis medis
- Untuk indikasi self-harm atau krisis: KESWA 119 ext 8 atau 021-500-454
- Selalu ingatkan kamu adalah AI, bukan dokter

## Basis Pengetahuan
- Durasi tidur ideal: 7-9 jam/malam (NSF)
- Cahaya biru layar menekan melatonin hingga 50%
- Kurang tidur (<6 jam) meningkatkan risiko hipertensi 20%
- DASS-21: skrining, bukan diagnosis`;

function buildSystemPrompt(user, sleepStats, predictionResult) {
  let prompt = BASE_SYSTEM_PROMPT;

  if (user) {
    prompt += `\n\n## Data Pengguna`;
    if (user.nickname || user.username) prompt += `\n- Nama panggilan: ${user.nickname || user.username}`;
    if (user.ageRange) prompt += `\n- Kelompok usia: ${user.ageRange}`;
    if (user.focus) {
      const focusMap = {
        sleep_quality: 'Meningkatkan kualitas tidur',
        screen_time: 'Mengurangi screen time',
        stress: 'Mengelola stres',
        health: 'Kesehatan umum',
        habit: 'Membangun kebiasaan tidur'
      };
      prompt += `\n- Fokus: ${focusMap[user.focus] || user.focus}`;
    }
    prompt += `\n\nSapa pengguna dengan nama panggilannya. Sesuaikan saran dengan fokus dan usianya.`;
  }

  if (sleepStats && sleepStats.totalRecords > 0) {
    prompt += `\n\n## Statistik Tidur 7 Hari Terakhir`;
    prompt += `\n- Rata-rata durasi: ${sleepStats.avgDuration} jam/malam`;
    prompt += `\n- Rata-rata kualitas: ${sleepStats.avgQuality}/10`;
    prompt += `\n- Hari tidur cukup (≥7 jam): ${sleepStats.goodSleepDays} dari ${sleepStats.totalRecords} hari`;
    if (sleepStats.avgScreenTime > 0) prompt += `\n- Rata-rata screen time sebelum tidur: ${sleepStats.avgScreenTime} jam`;
  }

  if (predictionResult && predictionResult.prediction) {
    const p = predictionResult.prediction;
    prompt += `\n\n## Hasil Analisis Risiko AI (sudah dijalankan)`;
    prompt += `\n- Tingkat risiko: ${p.risk_level} (probabilitas: ${Math.round(p.risk_probability * 100)}%)`;
    prompt += `\n- Label: ${p.risk_label}`;
    prompt += `\n- Ringkasan: ${p.summary}`;
    if (predictionResult.advice) {
      prompt += `\n- Saran awal dari AI: ${predictionResult.advice}`;
    }
    prompt += `\n\nPengguna sudah melihat hasil analisis risiko ini. Kamu bisa merujuk dan mendiskusikannya saat relevan.`;
  }

  return prompt;
}

export async function sendMessage(userMessage, conversationHistory = [], user = null, sleepStats = null, predictionResult = null) {
  const systemPrompt = buildSystemPrompt(user, sleepStats, predictionResult);
  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.slice(-10).map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage }
  ];
  const { data } = await api.post('/chat/send', { messages });
  return data.reply || 'Maaf, aku belum bisa merespons itu. Coba tanyakan yang lain ya 🙏';
}

export async function sendQuickReply(optionKey, user = null, sleepStats = null, predictionResult = null) {
  const quickReplies = {
    sleep_tips: 'Berikan tips tidur yang lebih baik',
    screen_time: 'Bagaimana cara mengurangi screen time?',
    mood_check: 'Aku ingin cerita tentang perasaanku hari ini',
    dass_info: 'Apa itu DASS-21?',
    relaxation: 'Ajari aku teknik relaksasi sebelum tidur'
  };
  return sendMessage(quickReplies[optionKey] || optionKey, [], user, sleepStats, predictionResult);
}
