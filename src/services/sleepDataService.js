import api from './api';

// ─── SLEEP RECORDS ───────────────────────────────────────────
export async function getSleepData(days = 7) {
  const { data } = await api.get(`/sleep/records?days=${days}`);
  return data;
}

export async function saveSleepData(record) {
  const { data } = await api.post('/sleep/records', record);
  return data;
}

export async function updateSleepData(id, record) {
  const { data } = await api.put(`/sleep/records/${id}`, record);
  return data;
}

export async function deleteSleepData(id) {
  const { data } = await api.delete(`/sleep/records/${id}`);
  return data;
}

export async function getSleepStats() {
  const { data } = await api.get('/sleep/stats');
  return data;
}

// ─── SCREEN TIME ─────────────────────────────────────────────
export async function getScreenTimeData(days = 7) {
  const { data } = await api.get(`/sleep/screen-time?days=${days}`);
  return data;
}

export async function saveScreenTimeData(record) {
  const { data } = await api.post('/sleep/screen-time', record);
  return data;
}

export async function updateScreenTimeData(id, record) {
  const { data } = await api.put(`/sleep/screen-time/${id}`, record);
  return data;
}

export async function deleteScreenTimeData(id) {
  const { data } = await api.delete(`/sleep/screen-time/${id}`);
  return data;
}

// ─── DASS-21 ─────────────────────────────────────────────────
export async function saveDass21Result(result) {
  const { data } = await api.post('/sleep/dass21', result);
  return data;
}

export async function getDass21History() {
  const { data } = await api.get('/sleep/dass21');
  return data;
}
