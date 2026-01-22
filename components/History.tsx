
import React, { useState, useMemo } from 'react';
import { LogEntry, LogType } from '../types';
import { Printer, Repeat2, Copy, FileText, Send, Mail, Recycle } from 'lucide-react';

interface HistoryProps {
  allUserLogs: LogEntry[];
}

const logTypeDetails: Record<LogType, { icon: React.ReactNode, label: string }> = {
    'Single-Sided': { icon: <Printer size={18} className="text-gray-500" />, label: 'พิมพ์ 1 หน้า' },
    'Double-Sided': { icon: <Repeat2 size={18} className="text-green-500" />, label: 'พิมพ์ 2 หน้า (หน้า-หลัง)' },
    'Copy': { icon: <Copy size={18} className="text-blue-500" />, label: 'ถ่ายเอกสาร' },
    'Digital': { icon: <Send size={18} className="text-purple-500" />, label: 'ส่งดิจิทัล' },
    'Envelope': { icon: <Mail size={18} className="text-orange-500" />, label: 'พิมพ์ซองจดหมาย' },
    'Reuse': { icon: <Recycle size={18} className="text-teal-500" />, label: 'พิมพ์กระดาษใช้แล้ว' },
};

const History: React.FC<HistoryProps> = ({ allUserLogs }) => {
  const [typeFilter, setTypeFilter] = useState<LogType | 'All'>('All');
  
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const [startDate, setStartDate] = useState<string>(startOfMonth.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(today.toISOString().split('T')[0]);

  const filteredLogs = useMemo(() => {
    return allUserLogs
      .filter(log => {
        if (typeFilter !== 'All' && log.type !== typeFilter) {
          return false;
        }
        const logDate = new Date(log.timestamp);
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        
        if (!startDate || !endDate) return true;

        return logDate >= start && logDate <= end;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [allUserLogs, typeFilter, startDate, endDate]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-800 flex items-center">
        <FileText className="mr-3 text-green-600" />
        ประวัติการบันทึกทั้งหมด
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">วันที่เริ่มต้น</label>
            <input 
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
        </div>
        <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">วันที่สิ้นสุด</label>
            <input 
                type="date"
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
        </div>
        <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">ประเภท</label>
            <select
                id="type-filter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as LogType | 'All')}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            >
                <option value="All">ทั้งหมด</option>
                <option value="Single-Sided">พิมพ์ 1 หน้า</option>
                <option value="Double-Sided">พิมพ์ 2 หน้า (หน้า-หลัง)</option>
                <option value="Copy">ถ่ายเอกสาร</option>
                <option value="Digital">ส่งดิจิทัล</option>
                <option value="Envelope">พิมพ์ซองจดหมาย</option>
                <option value="Reuse">พิมพ์กระดาษใช้แล้ว</option>
            </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full">
            <div className="hidden md:grid grid-cols-5 gap-4 font-semibold text-gray-600 text-sm p-4 border-b-2 border-gray-200">
                <div>วันที่</div>
                <div>ประเภท</div>
                <div className="text-right">จำนวนหน้า</div>
                <div className="text-right">กระดาษที่ใช้</div>
                <div className="text-right">Eco-Points</div>
            </div>
            <ul className="divide-y divide-gray-100">
                {filteredLogs.length > 0 ? (
                    filteredLogs.map(log => (
                        <li key={log.id} className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 items-center">
                            <div className="md:col-span-1 col-span-2">
                                <p className="font-medium text-gray-800">{new Date(log.timestamp).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            <div className="flex items-center gap-2 col-span-2 md:col-span-1">
                                {logTypeDetails[log.type].icon}
                                <span className="text-gray-700">{logTypeDetails[log.type].label}</span>
                            </div>
                            <div className="text-left md:text-right">
                                <span className="md:hidden font-semibold text-gray-500 text-xs">จำนวนหน้า: </span>
                                <span className="font-medium text-gray-800">{log.sheets}</span>
                            </div>
                            <div className="text-left md:text-right">
                                <span className="md:hidden font-semibold text-gray-500 text-xs">กระดาษที่ใช้: </span>
                                <span className="font-medium text-gray-800">{log.paperUsed}</span>
                            </div>
                            <div className="text-left md:text-right">
                                 <span className="md:hidden font-semibold text-gray-500 text-xs">Eco-Points: </span>
                                <span className={`font-bold ${log.ecoPoints >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    {log.ecoPoints >= 0 ? `+${log.ecoPoints}` : log.ecoPoints}
                                </span>
                            </div>
                        </li>
                    ))
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <p>ไม่พบรายการบันทึกในช่วงเวลาและประเภทที่เลือก</p>
                    </div>
                )}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default History;
