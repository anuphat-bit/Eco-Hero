
import React, { useState, useMemo } from 'react';
import { User, Department, LogEntry, LogType } from './types';
import { DEPARTMENTS as INITIAL_DEPARTMENTS, USERS as INITIAL_USERS, ECO_POINTS_CONFIG } from './constants';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // In-memory data
  const users = INITIAL_USERS;
  const departments = INITIAL_DEPARTMENTS;

  const handleLogin = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const addLog = (type: LogType, sheets: number) => {
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
        ecoPoints = pointsConfig.pointsPerSheet * sheets; // Points per sheet *saved*
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

    setLogs((prevLogs) => [...prevLogs, newLogData]);
  };

  const appData = useMemo(() => ({
    currentUser,
    logs,
    users,
    departments,
    addLog,
    handleLogout
  }), [currentUser, logs, users, departments]);

  if (!currentUser) {
    return <LoginScreen users={users} departments={departments} onLogin={handleLogin} />;
  }

  return <Dashboard data={appData} />;
};

export default App;
import { db } from './firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { USERS } from './constants'; // ดึงข้อมูลพนักงานจากไฟล์เดิมของคุณ

// ... ข้างใน Function Component ...
useEffect(() => {
  const migrateData = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    
    // ตรวจสอบก่อนว่าใน Firebase มีข้อมูลหรือยัง เพื่อป้องกันการเพิ่มซ้ำ
    if (querySnapshot.empty) {
      console.log("กำลังย้ายข้อมูลพนักงานไปที่ Firebase...");
      
      for (const user of USERS) {
        await addDoc(collection(db, "users"), {
          name: user.name,
          department: user.department,
          points: user.points,
          trees: user.trees,
          email: user.email // ใส่ฟิลด์ตามที่คุณมีใน constants.ts
        });
      }
      console.log("ย้ายข้อมูลสำเร็จ!");
    }
  };

  migrateData();
}, []);
