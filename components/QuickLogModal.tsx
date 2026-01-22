
import React, { useState, Fragment } from 'react';
import { LogType } from '../types';
import { Printer, Copy, Repeat2, X, Send, Mail, Recycle } from 'lucide-react';
import { ECO_POINTS_CONFIG } from '../constants';
import Confetti from './Confetti';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLog: (type: LogType, sheets: number) => void;
}

const QuickLogModal: React.FC<QuickLogModalProps> = ({ isOpen, onClose, onLog }) => {
  const [logType, setLogType] = useState<LogType>('Single-Sided');
  const [sheets, setSheets] = useState<number>(1);
  const [feedback, setFeedback] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sheets > 0) {
      onLog(logType, sheets);

      const pointsConfig = ECO_POINTS_CONFIG[logType];
      let ecoPoints = 0;
      switch (logType) {
        case 'Single-Sided':
        case 'Copy':
        case 'Envelope':
          ecoPoints = pointsConfig.pointsPerSheet * sheets;
          break;
        case 'Double-Sided':
          const paperUsed = Math.ceil(sheets / 2);
          ecoPoints = pointsConfig.pointsPerSheet * paperUsed;
          break;
        case 'Digital':
        case 'Reuse':
          ecoPoints = pointsConfig.pointsPerSheet * sheets;
          break;
      }
      
      const pointsText = ecoPoints >= 0 ? `คุณได้รับ ${ecoPoints}` : `คุณเสีย ${Math.abs(ecoPoints)}`;
      setFeedback(`บันทึกสำเร็จ! ${pointsText} Eco-Points 🌳`);

      setTimeout(() => {
        onClose();
        setFeedback('');
        setSheets(1);
      }, 2500); // Increased timeout for confetti
    }
  };
  
  const handleClose = () => {
      // Reset state if modal is closed while feedback is showing
      setFeedback('');
      setSheets(1);
      setLogType('Single-Sided');
      onClose();
  }

  if (!isOpen) return null;

  const quickAddValues = [1, 5, 10];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative transform transition-all animate-in fade-in-0 zoom-in-95">
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-20">
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">บันทึกการใช้กระดาษ</h2>

        {feedback ? (
          <div className="text-center p-8 relative h-48 flex items-center justify-center">
            <Confetti />
            <p className="text-lg text-green-600 font-semibold">{feedback}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-lg font-medium text-gray-700 mb-3 block">ประเภท</label>
              <div className="grid grid-cols-3 gap-3">
                <LogTypeButton icon={<Printer size={20}/>} label="พิมพ์ 1 หน้า" type="Single-Sided" activeType={logType} setType={setLogType} />
                <LogTypeButton icon={<Copy size={20}/>} label="ถ่ายเอกสาร" type="Copy" activeType={logType} setType={setLogType} />
                <LogTypeButton icon={<Mail size={20}/>} label="พิมพ์ซองจดหมาย" type="Envelope" activeType={logType} setType={setLogType} />
                <LogTypeButton icon={<Repeat2 size={20}/>} label="พิมพ์ 2 หน้า (หน้า-หลัง)" type="Double-Sided" activeType={logType} setType={setLogType} />
                <LogTypeButton icon={<Recycle size={20}/>} label="พิมพ์กระดาษใช้แล้ว" type="Reuse" activeType={logType} setType={setLogType} />
                <LogTypeButton icon={<Send size={20}/>} label="ส่งดิจิทัล" type="Digital" activeType={logType} setType={setLogType} />
              </div>
            </div>
            
            <div>
              <label htmlFor="sheets-input" className="text-lg font-medium text-gray-700 mb-3 block pt-2">จำนวนหน้า</label>
              <div className="flex items-center gap-3">
                <input
                  id="sheets-input"
                  type="number"
                  min="1"
                  value={sheets}
                  onChange={(e) => setSheets(parseInt(e.target.value, 10) || 1)}
                  className="w-full text-center text-xl p-3 border-2 border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="flex justify-center gap-2 mt-3">
                {quickAddValues.map(val => (
                   <button
                    key={val}
                    type="button"
                    onClick={() => setSheets(s => Math.max(1, s + val))}
                    className="px-4 py-2 bg-green-100 text-green-800 font-semibold rounded-full hover:bg-green-200 transition-colors"
                   >
                    +{val}
                   </button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-md">
                ยืนยันการบันทึก
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

interface LogTypeButtonProps {
    icon: React.ReactNode;
    label: string;
    type: LogType;
    activeType: LogType;
    setType: (type: LogType) => void;
}

const LogTypeButton: React.FC<LogTypeButtonProps> = ({ icon, label, type, activeType, setType }) => {
    const isActive = activeType === type;
    return (
        <button
            type="button"
            onClick={() => setType(type)}
            className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg transition-all duration-200 h-full ${
                isActive ? 'bg-green-100 border-green-500 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-400'
            }`}
        >
            {icon}
            <span className="text-xs sm:text-sm font-semibold mt-2 text-center">{label}</span>
        </button>
    );
}

export default QuickLogModal;
