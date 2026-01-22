
import React from 'react';
import { User } from '../types';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🌳</span>
            <span className="text-xl font-bold text-green-700">Eco-Hero</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 hidden sm:block">
              สวัสดี, <span className="font-medium">{currentUser?.name}</span>
            </span>
            <button
              onClick={onLogout}
              className="flex items-center text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-100 transition-colors"
              title="ออกจากระบบ"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
