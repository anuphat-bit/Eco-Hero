import React, { useState, useMemo } from 'react';
import { AppData, LogEntry } from '../types';
import Header from './Header';
import QuickLogModal from './QuickLogModal';
import MyTree from './MyTree';
import MyStats from './MyStats';
import DepartmentStats from './DepartmentStats';
import League from './League';
import History from './History';
import TipOfTheDay from './TipOfTheDay';
import { Plus, LayoutDashboard, Trophy, List, BarChart3 } from 'lucide-react';

interface DashboardProps {
  data: AppData;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'week' | 'month' | 'year'>('month');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'department' | 'league' | 'history'>('dashboard');

  const { currentUser, logs } = data;

  const filteredLogs = useMemo(() => {
    const now = new Date();
    return logs.filter(log => {
      const logDate = new Date(log.timestamp);
      if (filter === 'week') {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return logDate > oneWeekAgo;
      }
      if (filter === 'month') {
        return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
      }
      if (filter === 'year') {
        return logDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }, [logs, filter]);
  
  const userLogsForDashboard = useMemo(() => filteredLogs.filter(log => log.userId === currentUser?.id), [filteredLogs, currentUser]);
  const allUserLogs = useMemo(() => logs.filter(log => log.userId === currentUser?.id), [logs, currentUser]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <MyTree userLogs={userLogsForDashboard} />
              </div>
              <div className="lg:col-span-2">
                <MyStats data={data} userLogs={userLogsForDashboard} allLogs={filteredLogs} filter={filter} />
              </div>
            </div>
            <div className="mt-6">
              <TipOfTheDay />
            </div>
          </>
        );
      case 'department':
        return <DepartmentStats data={data} allLogs={logs} currentLogs={filteredLogs} filter={filter} />;
      case 'league':
        return <League data={data} filteredLogs={filteredLogs} filter={filter} />;
      case 'history':
        return <History allUserLogs={allUserLogs} />;
      default:
        return null;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'แดชบอร์ดสรุปผล';
      case 'department': return 'สถิติฝ่าย';
      case 'league': return 'ลีกการแข่งขัน';
      case 'history': return 'ประวัติการใช้งาน';
      default: return '';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header currentUser={data.currentUser} onLogout={data.handleLogout} />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center bg-white rounded-lg shadow-sm p-1 max-w-min mb-6">
          <TabButton
            icon={<LayoutDashboard size={18} />}
            label="แดชบอร์ด"
            value="dashboard"
            activeTab={activeTab}
            setTab={setActiveTab}
          />
          <TabButton
            icon={<BarChart3 size={18} />}
            label="สถิติฝ่าย"
            value="department"
            activeTab={activeTab}
            setTab={setActiveTab}
          />
          <TabButton
            icon={<Trophy size={18} />}
            label="ลีกการแข่งขัน"
            value="league"
            activeTab={activeTab}
            setTab={setActiveTab}
          />
          <TabButton
            icon={<List size={18} />}
            label="ประวัติ"
            value="history"
            activeTab={activeTab}
            setTab={setActiveTab}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {getPageTitle()}
          </h1>
          {activeTab !== 'history' && (
            <div className="flex items-center bg-white rounded-lg shadow-sm p-1">
              <FilterButton label="สัปดาห์" value="week" activeFilter={filter} setFilter={setFilter} />
              <FilterButton label="เดือน" value="month" activeFilter={filter} setFilter={setFilter} />
              <FilterButton label="ปี" value="year" activeFilter={filter} setFilter={setFilter} />
            </div>
          )}
        </div>

        {renderContent()}
      </main>

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-green-600 text-white rounded-full p-4 shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-110"
        aria-label="บันทึกการใช้กระดาษ"
      >
        <Plus size={28} />
      </button>

      <QuickLogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLog={data.addLog}
      />
    </div>
  );
};

type TabValue = 'dashboard' | 'department' | 'league' | 'history';

interface TabButtonProps {
    icon: React.ReactNode;
    label: string;
    value: TabValue;
    activeTab: TabValue;
    setTab: (value: TabValue) => void;
}

const TabButton: React.FC<TabButtonProps> = ({ icon, label, value, activeTab, setTab }) => (
    <button
        onClick={() => setTab(value)}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            activeTab === value
                ? 'bg-green-600 text-white shadow'
                : 'text-gray-600 hover:bg-gray-100'
        }`}
    >
      {icon}
      {label}
    </button>
);

interface FilterButtonProps {
    label: string;
    value: 'week' | 'month' | 'year';
    activeFilter: 'week' | 'month' | 'year';
    setFilter: (value: 'week' | 'month' | 'year') => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ label, value, activeFilter, setFilter }) => (
    <button
        onClick={() => setFilter(value)}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            activeFilter === value 
                ? 'bg-green-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
        }`}
    >
        {label}
    </button>
);


export default Dashboard;