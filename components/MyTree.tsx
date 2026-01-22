
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Repeat2, Send, TrendingDown, ScrollText, Recycle } from 'lucide-react';
import TreeHistoryModal from './TreeHistoryModal';

interface MyTreeProps {
  userLogs: LogEntry[];
}

// Sub-component for the dynamic SVG tree
interface DynamicTreeProps {
  ecoPoints: number;
}

const DynamicTree: React.FC<DynamicTreeProps> = ({ ecoPoints }) => {
    const getGrowthLevel = (points: number) => {
        if (points > 50) return 4; // Flourishing
        if (points > 10) return 3; // Healthy
        if (points >= 0) return 2; // Growing
        if (points > -50) return 1; // Wilting
        return 0; // Endangered
    };

    const level = getGrowthLevel(ecoPoints);

    const config = useMemo(() => {
        const levels = [
            { sky: '#d1d5db', ground: '#a3a3a3', trunk: '#a16207', foliage: '#ca8a04', foliageOpacity: 0.6, flowers: 0, branches: 1 }, // Endangered
            { sky: '#e0f2fe', ground: '#a3e635', trunk: '#854d0e', foliage: '#eab308', foliageOpacity: 0.8, flowers: 0, branches: 2 }, // Wilting
            { sky: '#bae6fd', ground: '#84cc16', trunk: '#5c3c21', foliage: '#a3e635', foliageOpacity: 1.0, flowers: 0, branches: 3 }, // Growing
            { sky: '#7dd3fc', ground: '#65a30d', trunk: '#5c3c21', foliage: '#4d7c0f', foliageOpacity: 1.0, flowers: 0, branches: 4 }, // Healthy
            { sky: '#38bdf8', ground: '#4d7c0f', trunk: '#5c3c21', foliage: '#225b2d', foliageOpacity: 1.0, flowers: 5, branches: 5 }, // Flourishing
        ];
        return levels[level];
    }, [level]);


    return (
        <svg viewBox="0 0 200 200" className="w-full h-full object-contain" style={{ transition: 'all 0.7s ease-in-out' }}>
            <rect key={`sky-${level}`} x="0" y="0" width="200" height="200" fill={config.sky} className="transition-colors duration-700"/>
            <path d="M0 200 C 50 180, 150 180, 200 200 Z" fill={config.ground} className="transition-colors duration-700" />
            
            <g transform="translate(100, 180) scale(1, -1)">
                {/* Trunk */}
                <path d="M 0 0 V 80" stroke={config.trunk} strokeWidth={8 + level * 1.5} strokeLinecap="round" className="transition-all duration-700" />

                {/* Branches */}
                {level >= 1 && <path d="M 0 20 L -30 40" stroke={config.trunk} strokeWidth={6 + level} strokeLinecap="round" className="transition-all duration-700 animate-in fade-in" />}
                {level >= 2 && <path d="M 0 30 L 35 50" stroke={config.trunk} strokeWidth={6 + level} strokeLinecap="round" className="transition-all duration-700 animate-in fade-in" />}
                {level >= 3 && <path d="M 0 50 L -20 70" stroke={config.trunk} strokeWidth={4 + level} strokeLinecap="round" className="transition-all duration-700 animate-in fade-in" />}
                {level >= 4 && <path d="M 0 60 L 25 85" stroke={config.trunk} strokeWidth={4 + level} strokeLinecap="round" className="transition-all duration-700 animate-in fade-in" />}
            </g>

            <g fill={config.foliage} opacity={config.foliageOpacity} className="transition-all duration-700">
                {level >= 0 && <circle cx="100" cy="80" r={20 + level * 4} className="transition-all duration-700 animate-in zoom-in-50" />}
                {level >= 1 && <circle cx="70" cy="130" r={15 + level * 3} className="transition-all duration-700 animate-in zoom-in-50 delay-100" />}
                {level >= 2 && <circle cx="135" cy="120" r={18 + level * 3} className="transition-all duration-700 animate-in zoom-in-50 delay-200" />}
                {level >= 3 && <circle cx="80" cy="100" r={15 + level * 2} className="transition-all duration-700 animate-in zoom-in-50 delay-300" />}
            </g>

            {config.flowers > 0 && (
                 <g fill="#fda4af" className="animate-in fade-in-0 zoom-in-75 duration-700 delay-500">
                    <circle cx="115" cy="75" r="5" />
                    <circle cx="85" cy="70" r="6" />
                    <circle cx="65" cy="120" r="4" />
                    <circle cx="145" cy="110" r="5" />
                    <circle cx="125"cy="130" r="4" />
                </g>
            )}
        </svg>
    );
};


// Base64 encoded WAV file for the wilting sound effect
const wiltSoundBase64 = 'data:audio/wav;base64,UklGRlIAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQgAADA/v8A/f/5//8B//n/+f/8//8A/v/8//4A/v/9//7//f/9//3/+f/6//r/+P/5//f/+f/5//r/+P/3//b/9//3//j/+v/7//r/9v/z//H/8//z//P/8//0//L/8P/w//H/8v/w//H/8f/x//D/8P/v/+7/7//v/+7/7v/u/+3/7f/t/+z/7P/s/+v/6v/q/+n/6P/o/+j/5//l/+b/5P/j/+T/4//h/+D/4P/f/9//3f/c/9v/2v/Z/9f/1v/V/9T/0//S/9H/z//O/83/y//K/8r/yf/H/8f/xv/F/8T/wv/B/8H/v/+9/7z/uv+5/7f/tP+z/7H/q/+o/6f/nv+a/5f/kv+R/4//jP+L/4j/hP+B/3//fP97/3j/cv9x/3D/bf9r/2f/Yv9h/2D/Xv9c/1r/Vv9U/1L/Tf9M/0r/SP9G/0T/Q/9B/z//O/81/zP/Lf8q/yj/Jv8j/yH/H/8d/xz/Gf8V/xT/Ev8R/xD/Dv8L/wn/CP8F/wP/Af/+/93/2P/R/83/xv/C/73/tv+t/6X/mP+P/4X/e/9w/2f/VP9M/0P/Nv8p/x//E/8G/9L/wf+q/4b/U/8t/wX/ov9z/0D/Df+m/2D/Ff+W/0L/uv80/5H/Gv9+/xj/Xv8Q/6z/GP81/w7/cf8C/zH/7f9V/+v/Af+G/+X/Tv/k/wD/Vf/W/zL/4v9c/+X/Tv/j/2L/8f8y//L/cv/5/1L//P8A';


const MyTree: React.FC<MyTreeProps> = ({ userLogs }) => {
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const totalEcoPoints = useMemo(() => userLogs.reduce((acc, log) => acc + log.ecoPoints, 0), [userLogs]);
  const [isWilting, setIsWilting] = useState(false);
  const prevEcoPointsRef = useRef(totalEcoPoints);
  const wiltSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!wiltSoundRef.current) {
        wiltSoundRef.current = new Audio(wiltSoundBase64);
        wiltSoundRef.current.volume = 0.4;
    }

    const prevPoints = prevEcoPointsRef.current;
    if (totalEcoPoints < prevPoints && totalEcoPoints < 0) {
        setIsWilting(true);
        wiltSoundRef.current?.play().catch(error => console.error("Audio playback failed:", error));

        const timer = setTimeout(() => setIsWilting(false), 800); // Animation duration
        return () => clearTimeout(timer);
    }

    prevEcoPointsRef.current = totalEcoPoints;
  }, [totalEcoPoints]);


  const treeStatus = useMemo(() => {
    if (totalEcoPoints > 50) {
      return { label: 'สุดยอด Eco-Hero!', description: 'ต้นไม้ของคุณสมบูรณ์แข็งแรงมาก!', color: 'text-green-600' };
    }
    if (totalEcoPoints > 10) {
      return { label: 'ต้นไม้แข็งแรง', description: 'ทำคะแนนได้ดีมาก!', color: 'text-green-500' };
    }
    if (totalEcoPoints >= 0) {
      return { label: 'ต้นไม้เติบโต', description: 'รักษาคะแนนบวกไว้ได้เยี่ยม', color: 'text-yellow-600' };
    }
    if (totalEcoPoints > -50) {
      return { label: 'ต้นไม้เริ่มเหี่ยว', description: 'คะแนนติดลบเล็กน้อย พยายามอีกนิดนะ', color: 'text-orange-500' };
    }
    return { label: 'ต้นไม้อยู่ในอันตราย', description: 'คะแนนของคุณติดลบเยอะมาก!', color: 'text-red-600' };
  }, [totalEcoPoints]);

  const pointsBreakdown = useMemo(() => {
    const fromDoubleSided = userLogs
        .filter(log => log.type === 'Double-Sided')
        .reduce((acc, log) => acc + log.ecoPoints, 0);

    const fromDigital = userLogs
        .filter(log => log.type === 'Digital')
        .reduce((acc, log) => acc + log.ecoPoints, 0);
    
    const fromReuse = userLogs
        .filter(log => log.type === 'Reuse')
        .reduce((acc, log) => acc + log.ecoPoints, 0);

    const fromPenalties = userLogs
        .filter(log => log.type === 'Single-Sided' || log.type === 'Copy' || log.type === 'Envelope')
        .reduce((acc, log) => acc + log.ecoPoints, 0);

    return { fromDoubleSided, fromDigital, fromReuse, fromPenalties };
  }, [userLogs]);

  const { fromDoubleSided, fromDigital, fromReuse, fromPenalties } = pointsBreakdown;
  const totalPositive = fromDoubleSided + fromDigital + fromReuse;
  const maxPoints = Math.max(totalPositive, Math.abs(fromPenalties));


  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center h-full flex flex-col justify-center items-center">
        <div className="w-full flex justify-center items-center mb-4 relative">
          <h2 className="text-xl font-bold text-gray-800">ต้นไม้ของฉัน</h2>
          <button
              onClick={() => setIsHistoryModalOpen(true)}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors p-1 rounded-full hover:bg-green-50"
              title="ดูประวัติการเติบโต"
              aria-label="ดูประวัติการเติบโต"
          >
              <ScrollText size={20} />
          </button>
        </div>
        <div className="my-4 h-48 w-48 flex items-center justify-center">
          <div 
            className={`w-full h-full ${isWilting ? 'animate-wilt' : ''}`}
          >
            <DynamicTree ecoPoints={totalEcoPoints} />
          </div>
        </div>
        <p key={treeStatus.label} className={`text-lg font-semibold ${treeStatus.color} animate-in fade-in-0 duration-700 delay-100`}>{treeStatus.label}</p>
        <p key={treeStatus.description} className="text-gray-500 mt-1 animate-in fade-in-0 duration-700 delay-200">{treeStatus.description}</p>
        
        {userLogs.length > 0 && (
          <div className="w-full max-w-xs mt-6 pt-4 border-t border-gray-100 animate-in fade-in-0 duration-700 delay-300">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">ที่มาของคะแนน</h3>
              <div className="space-y-1 text-xs text-left">
                  {fromDoubleSided > 0 && (
                      <BreakdownItem icon={<Repeat2 size={14} />} label="จากพิมพ์ 2 หน้า" points={fromDoubleSided} isPositive maxPoints={maxPoints}/>
                  )}
                  {fromDigital > 0 && (
                      <BreakdownItem icon={<Send size={14} />} label="จากการส่งดิจิทัล" points={fromDigital} isPositive maxPoints={maxPoints} />
                  )}
                  {fromReuse > 0 && (
                      <BreakdownItem icon={<Recycle size={14} />} label="จากการใช้กระดาษ Reuse" points={fromReuse} isPositive maxPoints={maxPoints} />
                  )}
                  {fromPenalties < 0 && (
                      <BreakdownItem icon={<TrendingDown size={14} />} label="จากการใช้กระดาษสิ้นเปลือง" points={fromPenalties} isPositive={false} maxPoints={maxPoints} />
                  )}
              </div>
          </div>
        )}
      </div>
      <TreeHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        userLogs={userLogs}
      />
    </>
  );
};

interface BreakdownItemProps {
    icon: React.ReactNode;
    label: string;
    points: number;
    isPositive: boolean;
    maxPoints: number;
}

const BreakdownItem: React.FC<BreakdownItemProps> = ({ icon, label, points, isPositive, maxPoints }) => {
    const widthPercent = maxPoints > 0 ? (Math.abs(points) / maxPoints) * 100 : 0;
    
    return (
        <div className="relative overflow-hidden rounded p-1.5">
            <div
                className={`absolute top-0 left-0 h-full rounded ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}
                style={{ width: `${widthPercent}%`, transition: 'width 0.5s ease-in-out' }}
            ></div>
            <div className="relative z-10 flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-500">
                    {icon}
                    <span>{label}</span>
                </div>
                <span className={`font-bold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                    {isPositive ? `+${points}` : points}
                </span>
            </div>
        </div>
    );
};


export default MyTree;