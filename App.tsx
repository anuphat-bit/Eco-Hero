import React, { useState, useMemo, useEffect } from 'react'; // เพิ่ม useEffect ตรงนี้
import { User, Department, LogEntry, LogType } from './types';
import { DEPARTMENTS as INITIAL_DEPARTMENTS, ECO_POINTS_CONFIG } from './constants';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  // สร้าง State สำหรับเก็บข้อมูลพนักงานที่ดึงมาจาก Google Sheets
  const [users, setUsers] = useState<User[]>([]);
  const departments = INITIAL_DEPARTMENTS;

  // --- จุดสำคัญ: ดึงข้อมูลจาก Google Sheets ---
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // เอา ลิงก์-API-URL- ของคุณมาวางแทนที่ข้างล่างนี้ครับ
        const response = await fetch('https://sheetdb.io/api/v1/h5fvh1h192g0e');
        const data = await response.json();
        
        // แปลงค่า points ให้เป็นตัวเลข (เพราะข้อมูลจาก Sheets มักจะเป็นตัวหนังสือ)
        const formattedData = data.map((user: any) => ({
          ...user,
          points: Number(user.points) || 0
        }));
        
        setUsers(formattedData);
      } catch (error) {
        console.error("ไม่สามารถดึงข้อมูลจาก Google Sheets ได้:", error);
      }
    };

    fetchUsers();
  }, []);
  // ---------------------------------------

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

    setLogs((prevLogs) => [...prevLogs, newLogData]);
    
    // อัปเดตคะแนนใน State ของ users ด้วย เพื่อให้หน้า Dashboard เปลี่ยนทันที
    setUsers(prevUsers => prevUsers.map(u => 
      u.id === currentUser.id ? { ...u, points: u.points + ecoPoints } : u
    ));
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
    return <div className="p-8 text-center">กำลังโหลดข้อมูลพนักงานจาก Google Sheets...</div>;
  }

  if (!currentUser) {
    return <LoginScreen users={users} departments={departments} onLogin={handleLogin} />;
  }

  return <Dashboard data={appData} />;
};

export default App;
