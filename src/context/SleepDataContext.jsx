import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  getSleepData, saveSleepData, updateSleepData, deleteSleepData,
  getScreenTimeData, saveScreenTimeData, updateScreenTimeData, deleteScreenTimeData,
  saveDass21Result, getDass21History
} from '../services/sleepDataService';

const SleepDataContext = createContext(null);

export function SleepDataProvider({ children }) {
  const [sleepRecords, setSleepRecords] = useState([]);
  const [screenTimeRecords, setScreenTimeRecords] = useState([]);
  const [dass21History, setDass21History] = useState([]);
  const [targetSleep, setTargetSleep] = useState({ hours: 8, bedtime: '22:00', wakeTime: '06:00' });
  const [loading, setLoading] = useState(false);

  // ─── SLEEP RECORDS ─────────────────────────────────────────
  const fetchSleepData = useCallback(async (days = 7) => {
    setLoading(true);
    try {
      const data = await getSleepData(days);
      setSleepRecords(data);
    } catch { /* gunakan data lokal */ }
    setLoading(false);
  }, []);

  const addSleepRecord = useCallback(async (record) => {
    const tempId = `temp_${Date.now()}`;
    const newRecord = { ...record, id: tempId, date: new Date().toISOString() };
    setSleepRecords(prev => [newRecord, ...prev].slice(0, 30));
    try {
      const saved = await saveSleepData(record);
      // Ganti tempId dengan id dari server
      setSleepRecords(prev => prev.map(r => r.id === tempId ? saved : r));
      return saved;
    } catch {
      return newRecord;
    }
  }, []);

  const updateSleepRecord = useCallback(async (id, record) => {
    try {
      const updated = await updateSleepData(id, record);
      setSleepRecords(prev => prev.map(r => r.id === id ? updated : r));
      return updated;
    } catch (err) {
      throw err;
    }
  }, []);

  const deleteSleepRecord = useCallback(async (id) => {
    // Optimistic update
    setSleepRecords(prev => prev.filter(r => r.id !== id));
    try {
      await deleteSleepData(id);
    } catch {
      // rollback: re-fetch jika gagal
      fetchSleepData(7);
    }
  }, [fetchSleepData]);

  // ─── SCREEN TIME ───────────────────────────────────────────
  const fetchScreenTimeData = useCallback(async (days = 7) => {
    try {
      const data = await getScreenTimeData(days);
      setScreenTimeRecords(data);
    } catch {}
  }, []);

  const addScreenTimeRecord = useCallback(async (record) => {
    const tempId = `temp_${Date.now()}`;
    const newRecord = { ...record, id: tempId, date: new Date().toISOString() };
    setScreenTimeRecords(prev => [newRecord, ...prev].slice(0, 30));
    try {
      const saved = await saveScreenTimeData(record);
      setScreenTimeRecords(prev => prev.map(r => r.id === tempId ? saved : r));
      return saved;
    } catch {
      return newRecord;
    }
  }, []);

  const updateScreenTimeRecord = useCallback(async (id, record) => {
    try {
      const updated = await updateScreenTimeData(id, record);
      setScreenTimeRecords(prev => prev.map(r => r.id === id ? updated : r));
      return updated;
    } catch (err) {
      throw err;
    }
  }, []);

  const deleteScreenTimeRecord = useCallback(async (id) => {
    setScreenTimeRecords(prev => prev.filter(r => r.id !== id));
    try {
      await deleteScreenTimeData(id);
    } catch {
      fetchScreenTimeData(7);
    }
  }, [fetchScreenTimeData]);

  // ─── DASS-21 ───────────────────────────────────────────────
  const fetchDass21History = useCallback(async () => {
    try {
      const data = await getDass21History();
      setDass21History(data);
    } catch {}
  }, []);

  const saveDass21 = useCallback(async (result) => {
    try {
      const saved = await saveDass21Result(result);
      setDass21History(prev => [saved, ...prev].slice(0, 10));
      return saved;
    } catch (err) {
      throw err;
    }
  }, []);

  // ─── TARGET ────────────────────────────────────────────────
  const updateTarget = useCallback((target) => {
    setTargetSleep(prev => {
      const next = { ...prev, ...target };
      localStorage.setItem('sleepsense_target', JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <SleepDataContext.Provider value={{
      sleepRecords, screenTimeRecords, dass21History, targetSleep, loading,
      fetchSleepData, addSleepRecord, updateSleepRecord, deleteSleepRecord,
      fetchScreenTimeData, addScreenTimeRecord, updateScreenTimeRecord, deleteScreenTimeRecord,
      fetchDass21History, saveDass21,
      updateTarget
    }}>
      {children}
    </SleepDataContext.Provider>
  );
}

export const useSleepData = () => {
  const ctx = useContext(SleepDataContext);
  if (!ctx) throw new Error('useSleepData must be inside SleepDataProvider');
  return ctx;
};
