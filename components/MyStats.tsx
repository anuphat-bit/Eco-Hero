
import React, { useMemo } from 'react';
import { AppData, LogEntry } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { Users, Target, Leaf, Star, Lock } from 'lucide-react';
import { PAPER_TO_TREE_RATIO } from '../constants';
import Tooltip from './Tooltip';


interface MyStatsProps {
  data: AppData;
  userLogs: LogEntry[];
  allLogs: LogEntry[];
  filter: 'week' | 'month' | 'year';
}

const MyStats: React.FC<MyStatsProps> = ({ data, userLogs, allLogs, filter }) => {
  const { currentUser, users, departments } = data;
  const currentDepartment = departments.find(d => d.id === currentUser?.departmentId);
  const usersInDepartment = users.filter(u => u.departmentId === currentDepartment?.id);
  
  const stats = useMemo(() => {
    const totalUserPaper = userLogs.reduce((acc, log) => acc + log.paperUsed, 0);
    const totalEcoPoints = userLogs.reduce((acc, log) => acc + log.ecoPoints, 0);

    const departmentLogs = allLogs.filter(log => log.departmentId === currentDepartment?.id);
    const totalDeptPaper = departmentLogs.reduce((acc, log) => acc + log.paperUsed, 0);
    const deptAverage = usersInDepartment.length > 0 ? totalDeptPaper / usersInDepartment.length : 0;

    const comparison = deptAverage > 0 ? ((deptAverage - totalUserPaper) / deptAverage) * 100 : 0;
    
    const singleSided = userLogs.filter(l => l.type !== 'Double-Sided').reduce((sum, l) => sum + l.paperUsed, 0);
    const doubleSided = userLogs.filter(l => l.type === 'Double-Sided').reduce((sum, l) => sum + l.paperUsed, 0);

    // Counts for specific badges
    const doubleSidedCount = userLogs.filter(l => l.type === 'Double-Sided').length;
    const digitalCount = userLogs.filter(l => l.type === 'Digital').length;
    const reuseCount = userLogs.filter(l => l.type === 'Reuse').length;

    return { 
        totalUserPaper, 
        deptAverage, 
        comparison, 
        singleSided, 
        doubleSided, 
        totalEcoPoints,
        doubleSidedCount,
        digitalCount,
        reuseCount
    };
  }, [userLogs, allLogs, currentDepartment, usersInDepartment]);

  const pieData = [
    { name: '1 หน้า/ถ่ายเอกสาร', value: stats.singleSided },
    { name: '2 หน้า', value: stats.doubleSided },
  ];
  const COLORS = ['#FFBB28', '#00C49F'];

  const paperSaved = Math.round(stats.totalUserPaper);
  const treesSaved = (paperSaved / PAPER_TO_TREE_RATIO).toFixed(4); // More precision for small amounts

  // --- BADGE LOGIC ---
  const badgeData = useMemo(() => [
    // 1. Starter Badges
    { name: 'จุดเริ่มต้นรักษ์โลก', description: 'บันทึกข้อมูลครั้งแรก', earned: userLogs.length > 0, icon: '🌱', category: 'Starter' },
    { name: 'ปีไร้กระดาษ', description: 'ไม่ใช้กระดาษเลยตลอดทั้งปี (เมื่อมีบันทึก)', earned: stats.totalUserPaper === 0 && userLogs.length > 5 && filter === 'year', icon: '🗓️', category: 'Starter' },

    // 2. Eco-Point Tiers (Long term)
    { name: 'Eco-Hero ทองแดง', description: 'สะสมครบ 100 แต้ม', earned: stats.totalEcoPoints >= 100, icon: '🥉', category: 'Points' },
    { name: 'Eco-Hero เงิน', description: 'สะสมครบ 500 แต้ม', earned: stats.totalEcoPoints >= 500, icon: '🥈', category: 'Points' },
    { name: 'Eco-Hero ทอง', description: 'สะสมครบ 1,000 แต้ม', earned: stats.totalEcoPoints >= 1000, icon: '🥇', category: 'Points' },
    { name: 'Eco-Hero เพชร', description: 'สะสมครบ 5,000 แต้ม', earned: stats.totalEcoPoints >= 5000, icon: '💎', category: 'Points' },
    { name: 'ตำนานพิทักษ์โลก', description: 'สะสมครบ 10,000 แต้ม', earned: stats.totalEcoPoints >= 10000, icon: '👑', category: 'Points' },

    // 3. Digital Champion Tiers
    { name: 'ผู้ส่งสารดิจิทัล', description: 'ส่งดิจิทัลครบ 10 ครั้ง', earned: stats.digitalCount >= 10, icon: '📧', category: 'Digital' },
    { name: 'ผู้เชี่ยวชาญดิจิทัล', description: 'ส่งดิจิทัลครบ 50 ครั้ง', earned: stats.digitalCount >= 50, icon: '💻', category: 'Digital' },
    { name: 'เทพเจ้าไร้กระดาษ', description: 'ส่งดิจิทัลครบ 100 ครั้ง', earned: stats.digitalCount >= 100, icon: '☁️', category: 'Digital' },

    // 4. Double-Sided Tiers
    { name: 'นักพลิกกระดาษ', description: 'พิมพ์ 2 หน้าครบ 20 ครั้ง', earned: stats.doubleSidedCount >= 20, icon: '📄', category: 'Double' },
    { name: 'ผู้คุ้มครองสองหน้า', description: 'พิมพ์ 2 หน้าครบ 100 ครั้ง', earned: stats.doubleSidedCount >= 100, icon: '🔄', category: 'Double' },

    // 5. Reuse Tiers
    { name: 'นักหมุนเวียน', description: 'ใช้กระดาษ Reuse ครบ 20 ครั้ง', earned: stats.reuseCount >= 20, icon: '♻️', category: 'Reuse' },
    { name: 'ผู้คืนชีพกระดาษ', description: 'ใช้กระดาษ Reuse ครบ 100 ครั้ง', earned: stats.reuseCount >= 100, icon: '🧟', category: 'Reuse' },

    // 6. Saving Milestones (Trees)
    { name: 'ผู้ปลูกต้นกล้า', description: 'ประหยัดกระดาษเทียบเท่า 0.01 ต้นไม้ (100 แผ่น)', earned: paperSaved >= 100, icon: '🌲', category: 'Savings' },
    { name: 'ผู้สร้างป่า', description: 'ประหยัดกระดาษเทียบเท่า 0.1 ต้นไม้ (1,000 แผ่น)', earned: paperSaved >= 1000, icon: '🏞️', category: 'Savings' },

    // 7. Comparative
    { name: 'ผู้นำเทรนด์', description: 'ค่าเฉลี่ยต่ำกว่าเพื่อนร่วมฝ่าย 50%', earned: stats.comparison > 50 && stats.deptAverage > 0, icon: '🚀', category: 'Social' },
  ], [userLogs.length, stats, paperSaved, filter]);

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

  const earnedBadgesCount = badgeData.filter(b => b.earned).length;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-800">สถิติส่วนตัว (My Stats)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<Star className="text-yellow-500"/>} 
          title={
            <div className="flex items-center gap-1.5">
              <span>Eco-Points</span>
              <Tooltip content={ecoPointsExplanation} />
            </div>
          } 
          value={`${stats.totalEcoPoints} แต้ม`} 
          subtitle="คะแนนสะสม" 
        />
        <StatCard icon={<Leaf className="text-green-500"/>} title="ใช้กระดาษไป" value={`${paperSaved} แผ่น`} subtitle={`= ${treesSaved} ต้น`} />
        <StatCard icon={<Users className="text-blue-500"/>} title="ค่าเฉลี่ยฝ่าย" value={`${stats.deptAverage.toFixed(1)} แผ่น/คน`} subtitle={currentDepartment?.name || ''} />
        <StatCard icon={<Target className="text-orange-500"/>} title="เทียบกับค่าเฉลี่ย" value={`${Math.abs(stats.comparison).toFixed(0)}%`} subtitle={stats.comparison >= 0 ? 'น้อยกว่า' : 'มากกว่า'} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">เทรนด์การใช้งาน</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{ name: 'การใช้งาน', 'คุณ': stats.totalUserPaper, 'เฉลี่ยฝ่าย': stats.deptAverage }]}>
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="คุณ" fill="#8884d8" />
                <Bar dataKey="เฉลี่ยฝ่าย" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">สัดส่วนการใช้งาน</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label={(entry) => `${entry.name} ${(entry.percent * 100).toFixed(0)}%`}>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
          </div>
        </div>
      </div>
       
      <div>
        <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-700">
                คลังเหรียญตรา 
                <span className="ml-2 text-sm font-normal text-gray-500">
                    (ปลดล็อคแล้ว {earnedBadgesCount}/{badgeData.length})
                </span>
            </h3>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {badgeData.map((badge, index) => (
            <div 
                key={index} 
                className={`group relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 border
                ${badge.earned 
                    ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-sm hover:shadow-md transform hover:-translate-y-1' 
                    : 'bg-gray-50 border-gray-100 opacity-60 hover:opacity-100 grayscale'}`}
            >
              <div className="text-3xl mb-2 filter drop-shadow-sm">{badge.earned ? badge.icon : <Lock size={24} className="text-gray-300 mx-auto"/>}</div>
              <p className={`text-[10px] sm:text-xs font-bold text-center leading-tight ${badge.earned ? 'text-gray-800' : 'text-gray-400'}`}>{badge.name}</p>
              
              {/* Tooltip on Hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 p-2 bg-gray-800 text-white text-[10px] rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 text-center">
                  {badge.description}
                  {!badge.earned && <div className="mt-1 text-gray-300">(ยังไม่ปลดล็อค)</div>}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


interface StatCardProps {
    icon: React.ReactNode;
    title: React.ReactNode;
    value: string;
    subtitle: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, subtitle }) => (
    <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-4">
        <div className="bg-white p-3 rounded-full shadow-sm">{icon}</div>
        <div>
            <div className="text-sm text-gray-500">{title}</div>
            <p className="text-lg font-bold text-gray-800">{value}</p>
            <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
    </div>
)


export default MyStats;
