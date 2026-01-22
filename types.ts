
export type LogType = 'Single-Sided' | 'Double-Sided' | 'Copy' | 'Digital' | 'Envelope' | 'Reuse';

export interface User {
  id: string;
  name: string;
  email: string;
  departmentId: string;
  pin: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface LogEntry {
  id: string;
  userId: string;
  departmentId: string;
  type: LogType;
  sheets: number; // Number of pages printed/copied/digital
  paperUsed: number; // Actual sheets of paper consumed
  ecoPoints: number; // Points awarded or deducted for this log
  timestamp: string;
}

export interface AppData {
  currentUser: User | null;
  logs: LogEntry[];
  users: User[];
  departments: Department[];
  addLog: (type: LogType, sheets: number) => void;
  handleLogout: () => void;
}
