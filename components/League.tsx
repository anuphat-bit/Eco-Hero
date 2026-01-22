import React, { useMemo } from 'react';
import { AppData, LogEntry } from '../types';
import { Crown, Award, Medal, Shield, Leaf } from 'lucide-react';
import Tooltip from './Tooltip';

interface LeagueProps {
  data: AppData;
  filteredLogs: LogEntry[];
  filter: 'week' | 'month' | 'year';
}

interface DepartmentScore {
  id: string;
  name: string;
  totalEcoPoints: number;
  totalPaperUsed: number;
}

interface IndividualScore {
  id: string;
  name: string;
  departmentName: string;
  totalEcoPoints: number;
}


const League: React.FC<LeagueProps> = ({ data, filteredLogs, filter }) => {
  const { departments, users } = data;

  const departmentLeaderboard = useMemo<DepartmentScore[]>(() => {
    return departments.map(dept => {
      const deptLogs = filteredLogs.filter(log => log.departmentId === dept.id);
      const totalEcoPoints = deptLogs.reduce((acc, log) => acc + log.ecoPoints, 0);
      const totalPaperUsed = deptLogs.reduce((acc, log) => acc + log.paperUsed, 0);
      return {
        id: dept.id,
        name: dept.name,
        totalEcoPoints,
        totalPaperUsed,
      };
    }).sort((a, b) => b.totalEcoPoints - a.totalEcoPoints);
  }, [departments, filteredLogs]);

  const topIndividuals = useMemo<IndividualScore[]>(() => {
    const userScores: { [userId: string]: number } = {};
    filteredLogs.forEach(log => {
      if (!userScores[log.userId]) {
        userScores[log.userId] = 0;
      }
      userScores[log.userId] += log.ecoPoints;
    });

    return Object.entries(userScores)
      .map(([userId, totalEcoPoints]) => {
        const user = users.find(u => u.id === userId);
        const department = departments.find(d => d.id === user?.departmentId);
        return {
          id: userId,
          name: user?.name || 'Unknown User',
          departmentName: department?.name || 'Unknown Dept',
          totalEcoPoints,
        };
      })
      .sort((a, b) => b.totalEcoPoints - a.totalEcoPoints)
      .slice(0, 3);
  }, [users, departments, filteredLogs]);

  const getRankIcon = (rank: number) => {
    if (rank === 0) return <Crown className="text-yellow-500 w-8 h-8" />;
    if (rank === 1) return <Award className="text-gray-400 w-8 h-8" />;
    if (rank === 2) return <Medal className="text-yellow-700 w-8 h-8" />;
    return <Shield className="text-gray-400 w-8 h-8" />;
  }

  const renderDepartmentRank = (rankIndex: number) => {
    const medals = ['🥇', '🥈', '🥉'];
    if (rankIndex < 3) {
      return <span className="text-4xl w-10 text-center mr-4">{medals[rankIndex]}</span>;
    }
    return (
      <span className="w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg mr-4 bg-gray-200 text-gray-700">
        {rankIndex + 1}
      </span>
    );
  };
  
  const getFilterText = () => {
      switch(filter) {
          case 'week': return 'สัปดาห์';
          case 'month': return 'เดือน';
          case 'year': return 'ปี';
      }
  }

  const ecoPointsExplanation = (
    <div>
        <h4 className="font-bold mb-1">Eco-Points คืออะไร?</h4>
        <ul className="list-disc list-inside space-y-1">
            <li><span className="text-green-400 font-semibold">พิมพ์ 2 หน้า:</span> ได้ +1 แต้ม/แผ่น</li>
            <li><span className="text-red-400 font-semibold">พิมพ์ 1 หน้า/ถ่ายเอกสาร:</span> เสีย -2 แต้ม/แผ่น</li>
        </ul>
        <p className="mt-2">ยิ่งคะแนนเยอะ ต้นไม้ของคุณยิ่งโต และอันดับฝ่ายก็สูงขึ้น!</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Column 1: Top Individuals */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">🏆 สุดยอด Eco-Heroes</h3>
        <p className="text-gray-500 mb-4 flex items-center gap-2">
          ผู้ทำคะแนน Eco-Points สูงสุด 3 อันดับแรกในช่วง{getFilterText()}นี้
          <Tooltip content={ecoPointsExplanation} />
        </p>
        <div className="space-y-4">
          {topIndividuals.length > 0 ? topIndividuals.map((individual, index) => (
            <div key={individual.id} className="bg-white rounded-2xl shadow-lg p-4 flex items-center space-x-4 border-t-4 border-green-500 transition-shadow hover:shadow-xl">
              <div className="flex-shrink-0">{getRankIcon(index)}</div>
              <div className="flex-grow min-w-0">
                <h3 className="font-bold text-lg text-gray-800 truncate">{individual.name}</h3>
                <p className="text-sm text-gray-500">{individual.departmentName}</p>
              </div>
              <p className="text-xl font-bold text-green-600 flex-shrink-0 text-right">
                {individual.totalEcoPoints.toLocaleString()}
                <span className="text-sm font-normal ml-1">แต้ม</span>
              </p>
            </div>
          )) : (
            <div className="text-center text-gray-500 py-8 bg-white rounded-2xl shadow-lg">
              <p>ยังไม่มีข้อมูลผู้ใช้งานสำหรับจัดอันดับ</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Column 2: Department Rankings */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">🏢 อันดับแผนก</h3>
         <p className="text-gray-500 mb-4 flex items-center gap-2">
            จัดอันดับตามคะแนน Eco-Points สะสม
            <Tooltip content={ecoPointsExplanation} />
         </p>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {departmentLeaderboard.map((dept, index) => (
              <li key={dept.id} className={`p-4 flex items-center justify-between transition-colors ${index < 3 ? 'bg-green-50/50 hover:bg-green-100' : 'hover:bg-gray-50'}`}>
                 <div className="flex items-center min-w-0">
                    {renderDepartmentRank(index)}
                    <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate" title={dept.name}>{dept.name}</p>
                        <p className="text-sm text-gray-500 flex items-center"><Leaf size={14} className="mr-1" />{dept.totalPaperUsed.toLocaleString()} แผ่น</p>
                    </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-lg font-bold text-green-600">{dept.totalEcoPoints.toLocaleString()} แต้ม</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default League;