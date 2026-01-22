import React, { useMemo } from 'react';
import { AppData, LogEntry } from '../types';
import { Trophy, Award, TrendingUp, TrendingDown, Send, PiggyBank } from 'lucide-react';

interface DepartmentStatsProps {
  data: AppData;
  allLogs: LogEntry[];
  currentLogs: LogEntry[];
  filter: 'week' | 'month' | 'year';
}

const DepartmentStats: React.FC<DepartmentStatsProps> = ({ data, allLogs, currentLogs, filter }) => {
  const { departments, users } = data;

  const leaderboards = useMemo(() => {
    const now = new Date();
    let previousPeriodStart: Date;
    let previousPeriodEnd: Date;

    if (filter === 'week') {
      previousPeriodEnd = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      previousPeriodStart = new Date(previousPeriodEnd.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (filter === 'month') {
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      previousPeriodEnd = new Date(currentYear, currentMonth, 1);
      previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1);
      previousPeriodStart = new Date(previousPeriodEnd.getFullYear(), previousPeriodEnd.getMonth(), 1);
    } else { // year
      const currentYear = now.getFullYear();
      previousPeriodEnd = new Date(currentYear, 0, 1);
      previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1);
      previousPeriodStart = new Date(previousPeriodEnd.getFullYear(), 0, 1);
    }

    const previousLogs = allLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= previousPeriodStart && logDate <= previousPeriodEnd;
    });

    const duplexChampions = departments.map(dept => {
      const deptLogs = currentLogs.filter(log => log.departmentId === dept.id);
      const totalPaper = deptLogs.reduce((sum, log) => sum + log.paperUsed, 0);
      const doubleSidedPaper = deptLogs
        .filter(log => log.type === 'Double-Sided')
        .reduce((sum, log) => sum + log.paperUsed, 0);
      
      const duplexRatio = totalPaper > 0 ? (doubleSidedPaper / totalPaper) * 100 : 0;
      return { id: dept.id, name: dept.name, value: duplexRatio };
    }).sort((a, b) => b.value - a.value);

    const mostImproved = departments.map(dept => {
      const deptCurrentPaper = currentLogs
        .filter(log => log.departmentId === dept.id)
        .reduce((sum, log) => sum + log.paperUsed, 0);
      
      const deptPreviousPaper = previousLogs
        .filter(log => log.departmentId === dept.id)
        .reduce((sum, log) => sum + log.paperUsed, 0);

      let improvement = -Infinity;
      if (deptPreviousPaper > 0) {
        improvement = ((deptPreviousPaper - deptCurrentPaper) / deptPreviousPaper) * 100;
      }
      
      return { id: dept.id, name: dept.name, value: improvement };
    })
    .filter(dept => dept.value !== -Infinity)
    .sort((a, b) => b.value - a.value);

    const paperlessChampions = departments.map(dept => {
        const deptLogs = currentLogs.filter(log => log.departmentId === dept.id);
        const digitalSheets = deptLogs
            .filter(log => log.type === 'Digital')
            .reduce((sum, log) => sum + log.sheets, 0);
        const totalSheets = deptLogs.reduce((sum, log) => sum + log.sheets, 0);
        
        const digitalRatio = totalSheets > 0 ? (digitalSheets / totalSheets) * 100 : 0;
        return { id: dept.id, name: dept.name, value: digitalRatio };
    }).sort((a, b) => b.value - a.value);

    const mostFrugalChampions = departments.map(dept => {
        const deptLogs = currentLogs.filter(log => log.departmentId === dept.id);
        const totalPaper = deptLogs.reduce((sum, log) => sum + log.paperUsed, 0);
        const numUsers = users.filter(u => u.departmentId === dept.id).length;
        const avgPaperPerUser = numUsers > 0 ? totalPaper / numUsers : 0;
        
        return { id: dept.id, name: dept.name, value: avgPaperPerUser };
    }).sort((a, b) => a.value - b.value);

    return { duplexChampions, mostImproved, paperlessChampions, mostFrugalChampions };
  }, [departments, users, allLogs, currentLogs, filter]);

  const championCategories = [
    {
      key: 'duplexChampions',
      title: 'แชมป์พิมพ์สองหน้า',
      icon: <Trophy className="text-yellow-500" />,
      description: 'จัดอันดับตามอัตราส่วนการใช้กระดาษ 2 หน้า',
      data: leaderboards.duplexChampions,
      valueFormatter: (value: number) => `${value.toFixed(0)}%`,
      valueColor: 'text-yellow-600',
    },
    {
      key: 'mostImproved',
      title: 'แชมป์พัฒนาการยอดเยี่ยม',
      icon: <Award className="text-blue-500" />,
      description: `เทียบกับช่วงก่อนหน้า (${filter === 'week' ? 'สัปดาห์' : filter === 'month' ? 'เดือน' : 'ปี'}ที่แล้ว)`,
      data: leaderboards.mostImproved,
      isImprovement: true,
      noDataMessage: 'ไม่มีข้อมูลเปรียบเทียบ',
    },
    {
      key: 'paperlessChampions',
      title: 'แชมป์ไร้กระดาษ',
      icon: <Send className="text-purple-500" />,
      description: "จัดอันดับตามสัดส่วนการเลือก 'ส่งดิจิทัล'",
      data: leaderboards.paperlessChampions,
      valueFormatter: (value: number) => `${value.toFixed(0)}%`,
      valueColor: 'text-purple-600',
    },
    {
      key: 'mostFrugalChampions',
      title: 'แชมป์ประหยัดสุดขั้ว',
      icon: <PiggyBank className="text-pink-500" />,
      description: 'จัดอันดับตามการใช้กระดาษเฉลี่ยต่อคน (น้อย=ดี)',
      data: leaderboards.mostFrugalChampions,
      valueFormatter: (value: number) => `${value.toFixed(1)} แผ่น`,
      valueColor: 'text-pink-600',
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">สถิติฝ่าย (Department Stats)</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {championCategories.map(category => (
          <div key={category.key} className="bg-gray-50/50 p-4 rounded-xl flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              {category.icon}
              <h3 className="text-lg font-bold text-gray-800">{category.title}</h3>
            </div>
            <p className="text-xs text-gray-500 mb-4 flex-grow">{category.description}</p>
            <ul className="space-y-2">
              {category.data.length > 0 ? (
                category.data.slice(0, 5).map((dept, index) => (
                  <LeaderboardItem
                    key={dept.id}
                    rank={index + 1}
                    name={dept.name}
                    value={
                      category.isImprovement
                        ? `${dept.value.toFixed(0)}%`
                        : category.valueFormatter!(dept.value)
                    }
                    isImprovement={category.isImprovement}
                    improvementValue={dept.value}
                    valueColor={category.valueColor}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-400 text-center py-4 h-full flex items-center justify-center">{category.noDataMessage || 'ไม่มีข้อมูล'}</p>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

interface LeaderboardItemProps {
  rank: number;
  name: string;
  value: string;
  isImprovement?: boolean;
  improvementValue?: number;
  valueColor?: string;
}

const LeaderboardItem: React.FC<LeaderboardItemProps> = ({ rank, name, value, isImprovement, improvementValue = 0, valueColor = 'text-blue-600' }) => {
  const renderRank = () => {
    if (rank === 1) return <span className="text-2xl w-7 text-center mr-2">🥇</span>;
    if (rank === 2) return <span className="text-2xl w-7 text-center mr-2">🥈</span>;
    if (rank === 3) return <span className="text-2xl w-7 text-center mr-2">🥉</span>;
    return (
        <span className="w-7 h-7 flex items-center justify-center rounded-full font-bold text-xs mr-2 bg-gray-200 text-gray-700">
          {rank}
        </span>
    );
  };

  const improvementColor = improvementValue > 0 ? 'text-green-600' : 'text-red-500';
  const ImprovementIcon = improvementValue > 0 ? TrendingUp : TrendingDown;
  const finalValueColor = isImprovement ? improvementColor : valueColor;

  return (
    <li className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm">
      <div className="flex items-center min-w-0">
        {renderRank()}
        <p className="font-semibold text-gray-800 truncate text-sm" title={name}>{name}</p>
      </div>
      <div className="flex items-center font-bold text-sm flex-shrink-0 ml-2">
        {isImprovement && <ImprovementIcon size={14} className={`mr-1 ${improvementColor}`} />}
        <span className={finalValueColor}>
            {value}
        </span>
      </div>
    </li>
  );
};

export default DepartmentStats;
