// DASS-21: 21 items, 3 subscales (Depression, Anxiety, Stress), each 7 items
// Each item scored 0-3, then multiplied by 2 for final score

export const DASS21_ITEMS = [
  { id: 1,  text: 'Saya merasa sulit untuk bersantai', scale: 'stress' },
  { id: 2,  text: 'Saya menyadari mulut saya terasa kering', scale: 'anxiety' },
  { id: 3,  text: 'Saya sepertinya tidak dapat merasakan perasaan positif sama sekali', scale: 'depression' },
  { id: 4,  text: 'Saya mengalami kesulitan bernapas (napas cepat, sesak tanpa aktivitas fisik)', scale: 'anxiety' },
  { id: 5,  text: 'Saya merasa sulit untuk berinisiatif melakukan sesuatu', scale: 'depression' },
  { id: 6,  text: 'Saya cenderung bereaksi berlebihan terhadap situasi', scale: 'stress' },
  { id: 7,  text: 'Saya merasa gemetar (misalnya pada tangan)', scale: 'anxiety' },
  { id: 8,  text: 'Saya merasa banyak menggunakan energi untuk merasa cemas', scale: 'stress' },
  { id: 9,  text: 'Saya khawatir tentang situasi di mana saya panik dan mempermalukan diri sendiri', scale: 'anxiety' },
  { id: 10, text: 'Saya merasa tidak ada hal yang bisa saya harapkan di masa depan', scale: 'depression' },
  { id: 11, text: 'Saya merasa diri saya menjadi gelisah', scale: 'stress' },
  { id: 12, text: 'Saya merasa sulit untuk rileks', scale: 'stress' },
  { id: 13, text: 'Saya merasa sedih dan tertekan', scale: 'depression' },
  { id: 14, text: 'Saya merasa tidak sabar ketika mengalami penundaan (misalnya antrian)', scale: 'stress' },
  { id: 15, text: 'Saya merasa hampir panik', scale: 'anxiety' },
  { id: 16, text: 'Saya merasa tidak antusias terhadap apa pun', scale: 'depression' },
  { id: 17, text: 'Saya merasa tidak berharga sebagai seseorang', scale: 'depression' },
  { id: 18, text: 'Saya merasa saya mudah tersinggung', scale: 'stress' },
  { id: 19, text: 'Saya menyadari detak jantung saya meskipun tanpa aktivitas fisik (misal detak jantung cepat)', scale: 'anxiety' },
  { id: 20, text: 'Saya merasa takut tanpa alasan yang jelas', scale: 'anxiety' },
  { id: 21, text: 'Saya merasa hidup ini tidak berarti', scale: 'depression' }
];

const OPTIONS = [
  { value: 0, label: 'Tidak pernah' },
  { value: 1, label: 'Kadang-kadang' },
  { value: 2, label: 'Sering' },
  { value: 3, label: 'Hampir setiap saat' }
];

export function getDASS21Options() {
  return OPTIONS;
}

export function calculateDASS21(answers) {
  let depression = 0, anxiety = 0, stress = 0;

  DASS21_ITEMS.forEach(item => {
    const score = answers[item.id] || 0;
    if (item.scale === 'depression') depression += score;
    if (item.scale === 'anxiety') anxiety += score;
    if (item.scale === 'stress') stress += score;
  });

  // Multiply by 2 for final score
  depression *= 2;
  anxiety *= 2;
  stress *= 2;

  return {
    depression: { score: depression, ...getDepressionCategory(depression) },
    anxiety: { score: anxiety, ...getAnxietyCategory(anxiety) },
    stress: { score: stress, ...getStressCategory(stress) }
  };
}

function getDepressionCategory(score) {
  if (score <= 9) return { category: 'Normal', color: '#4CAF50', level: 0 };
  if (score <= 13) return { category: 'Ringan', color: '#FFC107', level: 1 };
  if (score <= 20) return { category: 'Sedang', color: '#FF9800', level: 2 };
  if (score <= 27) return { category: 'Berat', color: '#F44336', level: 3 };
  return { category: 'Sangat Berat', color: '#B71C1C', level: 4 };
}

function getAnxietyCategory(score) {
  if (score <= 7) return { category: 'Normal', color: '#4CAF50', level: 0 };
  if (score <= 9) return { category: 'Ringan', color: '#FFC107', level: 1 };
  if (score <= 14) return { category: 'Sedang', color: '#FF9800', level: 2 };
  if (score <= 19) return { category: 'Berat', color: '#F44336', level: 3 };
  return { category: 'Sangat Berat', color: '#B71C1C', level: 4 };
}

function getStressCategory(score) {
  if (score <= 14) return { category: 'Normal', color: '#4CAF50', level: 0 };
  if (score <= 18) return { category: 'Ringan', color: '#FFC107', level: 1 };
  if (score <= 25) return { category: 'Sedang', color: '#FF9800', level: 2 };
  if (score <= 33) return { category: 'Berat', color: '#F44336', level: 3 };
  return { category: 'Sangat Berat', color: '#B71C1C', level: 4 };
}

export function getReferralMessage(results) {
  const needsReferral = Object.values(results).some(r => r.level >= 3);
  if (needsReferral) {
    return 'Hasil skrining menunjukkan tingkat yang perlu perhatian lebih. Ini bukan diagnosis, tapi sebaiknya konsultasikan dengan psikolog atau dokter. Hubungi KESWA di 119 ext 8 atau 021-500-454 jika perlu bantuan segera.';
  }
  return 'Hasil skrining dalam rentang yang wajar. Tetap jaga kesehatan mental ya! Jika ada kekhawatiran, jangan ragu konsultasi dengan profesional.';
}