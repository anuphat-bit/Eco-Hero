
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
