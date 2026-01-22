
import React, { useState, useMemo } from 'react';
import { User, Department } from '../types';
import { Lock, AlertCircle } from 'lucide-react';

interface LoginScreenProps {
  users: User[];
  departments: Department[];
  onLogin: (userId: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ users, departments, onLogin }) => {
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartmentId(e.target.value);
    setSelectedUserId(''); // Reset user when department changes
    setPin('');
    setError('');
  };
  
  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUserId(e.target.value);
    setPin('');
    setError('');
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4); // Only numbers, max 4 chars
    setPin(value);
    setError('');
  };

  const usersInSelectedDepartment = useMemo(() => {
    if (!selectedDepartmentId) return [];
    return users.filter((user) => user.departmentId === selectedDepartmentId);
  }, [selectedDepartmentId, users]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.id === selectedUserId);
    
    if (user) {
      if (user.pin === pin) {
        onLogin(selectedUserId);
      } else {
        setError('รหัส PIN ไม่ถูกต้อง');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-teal-200 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <span className="text-6xl">🌳</span>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">Eco-Hero</h1>
          <p className="text-gray-500">ปฏิบัติการพิทักษ์กระดาษ</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Department Selector */}
          <div>
            <label htmlFor="department-select" className="block text-sm font-medium text-gray-700 mb-2">
              1. เลือกฝ่ายงาน
            </label>
            <select
              id="department-select"
              value={selectedDepartmentId}
              onChange={handleDepartmentChange}
              className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md shadow-sm"
            >
              <option value="" disabled>-- กรุณาเลือกฝ่าย --</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* User Selector */}
          {selectedDepartmentId && (
            <div className="animate-in fade-in-0 duration-500">
              <label htmlFor="user-select" className="block text-sm font-medium text-gray-700 mb-2">
                2. เลือกชื่อของคุณ
              </label>
              <select
                id="user-select"
                value={selectedUserId}
                onChange={handleUserChange}
                disabled={!selectedDepartmentId}
                className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md shadow-sm disabled:bg-gray-100"
              >
                <option value="" disabled>-- กรุณาเลือกชื่อ --</option>
                {usersInSelectedDepartment.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          )}

           {/* PIN Input */}
           {selectedUserId && (
            <div className="animate-in fade-in-0 duration-500">
              <label htmlFor="pin-input" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Lock size={16} className="text-gray-400" />
                3. กรอกรหัส PIN (4 หลัก)
              </label>
              <input
                type="password"
                id="pin-input"
                value={pin}
                onChange={handlePinChange}
                maxLength={4}
                placeholder="1234"
                className={`mt-1 block w-full px-3 py-3 text-center tracking-[0.5em] text-xl font-bold border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent ${error ? 'border-red-300 focus:ring-red-500 text-red-900 placeholder-red-300' : 'border-gray-300 focus:ring-green-500 text-gray-900'}`}
              />
              {error && (
                <div className="mt-2 flex items-center text-sm text-red-600 animate-in slide-in-from-top-1">
                  <AlertCircle size={16} className="mr-1" />
                  {error}
                </div>
              )}
              <p className="mt-2 text-xs text-gray-400 text-center">
                *รหัสเริ่มต้นคือ 1234
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={!selectedUserId || pin.length !== 4}
            className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
          >
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
