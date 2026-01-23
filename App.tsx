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

  // --- 1. ฟังก์ชันดึงข้อมูลทั้งหมด (ดึงทั้งรายชื่อพนักงาน และ ประวัติการบันทึก) ---
  const loadAllData = async () => {
    try {
      // ดึงรายชื่อพนักงานจากหน้าหลัก
      const userRes = await fetch(`${API_URL}?t=${Date.now()}`);
      const userData = await userRes.json();
      
      // ดึงประวัติจากแผ่นงาน 'logs' ที่คุณเพิ่งสร้าง
      const logRes = await fetch(`${API_URL}?sheet=logs&t=${Date.now()}`);
      const logData = await logRes.json();

      if (Array.isArray(userData)) {
        setUsers(userData.map((u: any) => ({ 
          ...u, 
          points: Number(u.points) || 0,
          pin: String(u.pin)
        })));
      }

      if (Array.isArray(logData)) {
        // นำประวัติมาแปลงค่าเป็นตัวเลข และเรียงเอาอันล่าสุดขึ้นก่อน
        const formattedLogs = logData.map((l: any) => ({
          ...l,
          sheets: Number(l.sheets),
          paperUsed: Number(l.paperUsed),
          ecoPoints: Number(l.ecoPoints)
        })).reverse();
        setLogs(formattedLogs);
      }
    } catch (e) {
      console.error("ไม่สามารถโหลดข้อมูลได้:", e);
    }
  };

  // โหลดข้อมูลทันทีที่เปิดแอป
  useEffect(() => {
    loadAllData();
  }, []);

  const handleLogin = async (userId: string) => {
    await loadAllData(); // รีเฟรชข้อมูลล่าสุดก่อนเข้าหน้า Dashboard
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  // --- 2. ฟังก์ชันบันทึกคะแนน (ส่งไปทั้ง 2 แผ่นงานเพื่อให้ข้อมูลลิงก์กัน) ---
  const addLog = async (type: LogType, sheets: number) => {
    if (!currentUser) return;

    let paperUsed = 0;
    let ecoPoints = 0;
    const config = ECO_POINTS_CONFIG[type];

    // คำนวณตาม Logic ของแอป
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
      // บันทึกที่ 1: เพิ่มประวัติลงในแผ่นงาน 'logs' (เพื่อให้เครื่องอื่นเห็นประวัติ)
      await fetch(`${API_URL}?sheet=logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [newLogData] })
      });

      // บันทึกที่ 2: อัปเดตคะแนนรวมของพนักงานคนนั้น
      await fetch(`${API_URL}/id/${currentUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { points: updatedPoints } })
      });

      // อัปเดตข้อมูลในหน้าจอทันทีโดยไม่ต้องรอโหลดใหม่
      setLogs(prev => [newLogData, ...prev]);
      setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, points: updatedPoints } : u));
      setCurrentUser(prev => prev ? { ...prev, points: updatedPoints } : null);

    } catch (e) {
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const appData = useMemo(() => ({
    currentUser,
    logs,
    users,
    departments,
    addLog,
    handleLogout: () => setCurrentUser(null)
  }), [currentUser, logs, users]);

  if (users.length === 0) return <div className="min-h-screen flex items-center justify-center">กำลังเชื่อมต่อฐานข้อมูล...</div>;

  if (!currentUser) {
    return <LoginScreen users={users} departments={departments} onLogin={handleLogin} />;
  }

  return <Dashboard data={appData} />;
};

export default App;
