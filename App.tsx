import React, { useState, useMemo, useEffect } from 'react';
import { User, Department, LogEntry, LogType } from './types';
import { DEPARTMENTS as INITIAL_DEPARTMENTS, ECO_POINTS_CONFIG } from './constants';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const departments = INITIAL_DEPARTMENTS;
  const API_URL = 'https://sheetdb.io/api/v1/1kh0wf5fvqs3w';

  // --- 1. ดึงข้อมูลครั้งแรกเมื่อเปิดแอป ---
  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (Array.isArray(data)) {
        const formattedData = data.map((user: any) => ({
          ...user,
          points: Number(user.points) || 0,
          pin: String(user.pin) 
        }));
        setUsers(formattedData);
        return formattedData;
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
    return [];
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- 2. แก้ไขระบบ Login ให้ดึงแต้มล่าสุดก่อนเข้าหน้าจอ (แก้ปัญหา PC/มือถือ ไม่ตรงกัน) ---
  const handleLogin = async (userId: string) => {
    // ดึงข้อมูลล่าสุดจาก Sheets ก่อน เพื่อให้แน่ใจว่าแต้มอัปเดต
    const latestUsers = await fetchUsers();
    const user = latestUsers.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // --- 3. ฟังก์ชันบันทึกคะแนนและส่งกลับไปที่ Google Sheets ---
  const addLog = async (type: LogType, sheets: number) => {
    if (!currentUser) return;

    let paperUsed = 0;
    let ecoPoints = 0;
    const pointsConfig = ECO_POINTS_CONFIG[type];

    switch (type) {
      case 'Single-Sided':
      case 'Copy':
      case 'Envelope':
        paperUsed = sheets;
        ecoPoints = pointsConfig.pointsPerSheet * paperUsed;
        break;
      case 'Double-Sided':
        paperUsed = Math.ceil(sheets / 2);
        ecoPoints = pointsConfig.pointsPerSheet * paperUsed;
        break;
      case 'Digital':
      case 'Reuse':
        paperUsed = 0;
        ecoPoints = pointsConfig.pointsPerSheet * sheets;
        break;
    }

    const newLogData: LogEntry = {
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
      // ส่ง PATCH ไปที่ SheetDB
      await fetch(`${API_URL}/id/${currentUser.id}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: { points: updatedPoints }
        })
      });

      // อัปเดต State ในแอป
      setLogs((prevLogs) => [...prevLogs, newLogData]);
      setUsers(prevUsers => prevUsers.map(u => 
        u.id === currentUser.id ? { ...u, points: updatedPoints } : u
      ));
      setCurrentUser(prev => prev ? { ...prev, points: updatedPoints } : null);

      console.log("บันทึกข้อมูลสำเร็จ!");
    } catch (error) {
      console.error("Save error:", error);
      alert("ไม่สามารถบันทึกคะแนนได้");
    }
  };

  const appData = useMemo(() => ({
    currentUser,
    logs,
    users,
    departments,
    addLog,
    handleLogout
  }), [currentUser, logs, users, departments]);

  if (users.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-xl font-semibold text-green-700">กำลังเชื่อมต่อฐานข้อมูล...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginScreen users={users} departments={departments} onLogin={handleLogin} />;
  }

  return <Dashboard data={appData} />;
};

export default App;
