
import React from 'react';
import { LogEntry, LogType } from '../types';
import { X, Printer, Repeat2, Copy, Send, ArrowUp, ArrowDown, Mail, Recycle } from 'lucide-react';

interface TreeHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLogs: LogEntry[];
}

const logTypeDetails: Record<LogType, { icon: React.ReactNode, label: string }> = {
    'Single-Sided': { icon: <Printer size={18} />, label: 'พิมพ์ 1 หน้า' },
    'Double-Sided': { icon: <Repeat2 size={18} />, label: 'พิมพ์ 2 หน้า (หน้า-หลัง)' },
    'Copy': { icon: <Copy size={18} />, label: 'ถ่ายเอกสาร' },
    'Digital': { icon: <Send size={18} />, label: 'ส่งดิจิทัล' },
    'Envelope': { icon: <Mail size={18} />, label: 'พิมพ์ซองจดหมาย' },
    'Reuse': { icon: <Recycle size={18} />, label: 'พิมพ์กระดาษใช้แล้ว' },
};

const getTreeStatusLabel = (totalEcoPoints: number): string => {
    if (totalEcoPoints > 50) return 'สุดยอด Eco-Hero!';
    if (totalEcoPoints > 10) return 'ต้นไม้แข็งแรง';
    if (totalEcoPoints >= 0) return 'ต้นไม้เติบโต';
    if (totalEcoPoints > -50) return 'ต้นไม้เริ่มเหี่ยว';
    return 'ต้นไม้อยู่ในอันตราย';
};

const TreeHistoryModal: React.FC<TreeHistoryModalProps> = ({ isOpen, onClose, userLogs }) => {
  const timelineEvents = React.useMemo(() => {
    let runningTotal = 0;
    let prevStatus = getTreeStatusLabel(0);

    const events = userLogs
        .slice()
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .map(log => {
            runningTotal += log.ecoPoints;
            const newStatus = getTreeStatusLabel(runningTotal);
            const statusChanged = newStatus !== prevStatus;
            prevStatus = newStatus;

            return {
                ...log,
                statusChangeMessage: statusChanged ? `ต้นไม้ของคุณตอนนี้ '${newStatus}'` : null,
                runningTotal,
            };
        });

    return events.reverse(); // Show newest first
  }, [userLogs]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg h-[80vh] flex flex-col p-6 relative transform transition-all animate-in fade-in-0 zoom-in-95" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-20">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">ประวัติการเติบโตของต้นไม้</h2>
        
        <div className="flex-grow overflow-y-auto pr-4 -mr-4">
            {timelineEvents.length > 0 ? (
                <div className="relative border-l-2 border-gray-200 ml-4">
                    {timelineEvents.map((event) => {
                        const isPositive = event.ecoPoints >= 0;
                        const iconBgColor = isPositive ? 'bg-green-100' : 'bg-red-100';
                        const iconColor = isPositive ? 'text-green-600' : 'text-red-500';

                        return (
                            <div key={event.id} className="mb-8 ml-8">
                                <span className={`absolute -left-4 flex items-center justify-center w-8 h-8 ${iconBgColor} rounded-full ring-8 ring-white`}>
                                    {isPositive ? <ArrowUp size={16} className={iconColor} /> : <ArrowDown size={16} className={iconColor} />}
                                </span>
                                <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                                    <div className="flex justify-between items-center mb-2">
                                        <time className="text-sm font-normal text-gray-500">{new Date(event.timestamp).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })}</time>
                                        <span className={`font-bold text-lg ${iconColor}`}>
                                            {isPositive ? `+${event.ecoPoints}` : event.ecoPoints}
                                        </span>
                                    </div>
                                    <p className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                        <span className={iconColor}>{logTypeDetails[event.type].icon}</span>
                                        {logTypeDetails[event.type].label}: {event.sheets} หน้า
                                    </p>
                                    {event.statusChangeMessage && (
                                        <p className="mt-2 text-sm text-blue-600 font-medium bg-blue-100 p-2 rounded-md">
                                            {event.statusChangeMessage}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center text-gray-500 pt-16">
                    <p>ยังไม่มีประวัติการบันทึก</p>
                    <p className="text-sm">เริ่มบันทึกการใช้กระดาษเพื่อดูต้นไม้ของคุณเติบโต!</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default TreeHistoryModal;
