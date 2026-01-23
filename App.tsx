import React, { useState, useMemo, useEffect } from 'react';
import { User, LogEntry, LogType } from './types';
import { DEPARTMENTS as INITIAL_DEPARTMENTS, ECO_POINTS_CONFIG } from './constants';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const departments = INITIAL_DEPARTMENTS;
  const API_URL = 'https://sheetdb.io/api/v1/1kh0wf5fvqs3w';

  // --- 1. ดึงข้อมูลพนักงาน และ ประวัติการบันทึก ทั้งหมดจาก Sheets ---
  const loadData = async () => {
    try {
      // ดึงรายชื่อพนักงาน (Sheet1)
      const userRes = await fetch(`${API_URL}?t=${Date.now()}`);
      const userData = await userRes.json();
      
      // ดึงประวัติการบันทึก (Sheet logs)
      const logRes = await fetch(`${API_URL}?sheet=logs&t=${Date.now()}`);
      const logData = await logRes.json();

      if (Array.isArray(userData)) {
        setUsers(userData.map((u: any) => ({ ...u, points: Number(u.points) || 0 })));
      }
      if (Array.isArray(logData)) {
        // เรียงลำดับเอาอันล่าสุดขึ้นก่อน
        setLogs(logData.map((l: any) => ({
          ...l,
          sheets: Number(l.sheets),
          paperUsed: Number(l.paperUsed),
          ecoPoints: Number(l.ecoPoints)
        })).reverse());
      }
    } catch (e) { console.error("Load Data Error:", e); }
  };

  useEffect(() => { loadData(); }, []);

  const handleLogin = async (userId: string) => {
    await loadData(); // ดึงข้อมูลล่าสุดอีกครั้งก่อนล็อกอิน
    const user = users.find((u) => u.id === userId);
    if (user) setCurrentUser(user);
  };

  // --- 2. ฟังก์ชันบันทึกข้อมูล (ส่งไป 2 ที่: อัปเดตคะแนน + เพิ่มประวัติ) ---
  const addLog = async (type: LogType, sheets: number) => {
    if (!currentUser) return;

    let paperUsed = 0;
    let ecoPoints = 0;
    const config = ECO_POINTS_CONFIG[type];
    
    // คำนวณตามประเภท (Reuse/Digital = 0 แผ่น)
    if (type === 'Double-Sided') {
      paperUsed = Math.ceil(sheets / 2);
    } else if (type === 'Digital' || type === 'Reuse') {
      paperUsed = 0;
    } else {
      paperUsed = sheets;
    }
    ecoPoints = config.pointsPerSheet * (type === 'Digital' || type === 'Reuse' ? sheets : paperUsed);

    const newLogData = {
      id: Date.now().toString(),
      userId: currentUser.id,
      departmentId: currentUser.departmentId,
      type,
      sheets,
      paperUsed,
      ecoPoints,
      timestamp: new Date().toISOString(),
    };

    const updatedPoints = (currentUser.points || 0) + ecoPoints;

    try {
      // บันทึกลง Sheet logs (POST)
      await fetch(`${API_URL}?sheet=logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [newLogData] })
      });

      // อัปเดตแต้มพนักงาน (PATCH)
      await fetch(`${API_URL}/id/${currentUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { points: updatedPoints } })
      });

      // อัปเดตหน้าจอทันที
      setLogs(prev => [newLogData, ...prev]);
      setCurrentUser(prev => prev ? { ...prev, points: updatedPoints } : null);
      setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, points: updatedPoints } : u));

    } catch (e) { alert("บันทึกไม่สำเร็จ กรุณาลองใหม่"); }
  };

  const appData = useMemo(() => ({
    currentUser, logs, users, departments, addLog, handleLogout: () => setCurrentUser(null)
  }), [currentUser, logs, users]);

  if (users.length === 0) return <div className="min-h-screen flex items-center justify-center">กำลังโหลดข้อมูล...</div>;
  if (!currentUser) return <LoginScreen users={users} departments={departments} onLogin={handleLogin} />;
  
  return <Dashboard data={appData} />;
};

export default App;
