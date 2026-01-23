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

  // --- 1. ดึงข้อมูลรายชื่อพนักงานจาก Google Sheets เมื่อเปิดแอป ---
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://sheetdb.io/api/v1/1kh0wf5fvqs3w');
        const data = await response.json();
        
        if (Array.isArray(data)) {
          const formattedData = data.map((user: any) => ({
            ...user,
            points: Number(user.points) || 0,
            pin: String(user.pin) 
          }));
          setUsers(formattedData);
        }
      } catch (error) {
        console.error("ไม่สามารถดึงข้อมูลพนักงานได้:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleLogin = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // --- 2. ฟังก์ชันบันทึกคะแนนและส่งกลับไปที่ Google Sheets ---
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

    // คำนวณคะแนนรวมใหม่
    const updatedPoints = (currentUser.points || 0) + ecoPoints;

    try {
      // ส่งคำสั่ง PATCH ไปที่ SheetDB เพื่ออัปเดตคะแนนตาม ID
      await fetch(`https://sheetdb.io/api/v1/1kh0wf5fvqs3w/id/${currentUser.id}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {
            points: updatedPoints
          }
        })
      });

      // อัปเดตสถานะในหน้าจอแอปทันที
      setLogs((prevLogs) => [...prevLogs, newLogData]);
      
      setUsers(prevUsers => prevUsers.map(u => 
        u.id === currentUser.id ? { ...u, points: updatedPoints } : u
      ));

      setCurrentUser(prev => prev ? { ...prev, points: updatedPoints } : null);

      console.log("บันทึกข้อมูลสำเร็จ!");
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการบันทึก:", error);
      alert("ไม่สามารถบันทึกคะแนนลง Google Sheets ได้");
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

  // แสดงหน้าจอโหลดข้อมูลถ้ายังดึงรายชื่อไม่เสร็จ
  if (users.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-xl font-semibold text-green-700 animate-pulse">
          กำลังโหลดข้อมูลพนักงาน...
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginScreen users={users} departments={departments} onLogin={handleLogin} />;
  }

  return <Dashboard data={appData} />;
};

export default App;
