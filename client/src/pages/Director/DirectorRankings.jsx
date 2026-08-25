import React, { useState } from 'react';
import { 
  Award, Trophy, Medal, MapPin, Store, Users, 
  Layers, IndianRupee, ArrowUpRight 
} from 'lucide-react';

const stateLeaderboard = [
  { rank: 1, name: 'Tamil Nadu', metric: '₹4.20 Cr Collection', sub: '105% Target Achieved', growth: '+12.4%' },
  { rank: 2, name: 'Karnataka', metric: '₹3.80 Cr Collection', sub: '108% Target Achieved', growth: '+14.1%' },
  { rank: 3, name: 'Kerala', metric: '₹2.10 Cr Collection', sub: '105% Target Achieved', growth: '+8.2%' },
  { rank: 4, name: 'Andhra Pradesh', metric: '₹1.35 Cr Collection', sub: '84% Target Achieved', growth: '-2.1%' },
  { rank: 5, name: 'Telangana', metric: '₹1.00 Cr Collection', sub: '83% Target Achieved', growth: '+4.0%' },
];

const districtLeaderboard = [
  { rank: 1, name: 'Bengaluru Urban (KA)', metric: '₹1.90 Cr Collection', sub: '150 Franchises', manager: 'N. Hegde' },
  { rank: 2, name: 'Chennai (TN)', metric: '₹1.50 Cr Collection', sub: '120 Franchises', manager: 'S. Kumar' },
  { rank: 3, name: 'Coimbatore (TN)', metric: '₹1.10 Cr Collection', sub: '95 Franchises', manager: 'P. Murugan' },
  { rank: 4, name: 'Ernakulam (KL)', metric: '₹0.90 Cr Collection', sub: '80 Franchises', manager: 'P. Nair' },
];

const managerLeaderboard = [
  { rank: 1, name: 'N. Hegde', zone: 'Bengaluru Urban', metric: '₹64.20 L Collection', achievement: '107%' },
  { rank: 2, name: 'S. Kumar', zone: 'Chennai Zone 1', metric: '₹52.00 L Collection', achievement: '104%' },
  { rank: 3, name: 'V. Anand', zone: 'Chennai Zone 2', metric: '₹48.00 L Collection', achievement: '96%' },
  { rank: 4, name: 'P. Murugan', zone: 'Coimbatore', metric: '₹46.50 L Collection', achievement: '103%' },
];

const outletLeaderboard = [
  { rank: 1, name: 'AVG Mart - Koramangala', location: 'Bengaluru', metric: '₹22.00 L Monthly', vertical: 'Retail' },
  { rank: 2, name: 'AVG Express - Indiranagar', location: 'Bengaluru', metric: '₹18.40 L Monthly', vertical: 'Logistics' },
  { rank: 3, name: 'AVG Mart - T.Nagar', location: 'Chennai', metric: '₹14.50 L Monthly', vertical: 'Retail' },
  { rank: 4, name: 'AVG Pay - Velachery', location: 'Chennai', metric: '₹11.20 L Monthly', vertical: 'Fintech' },
];

const businessLeaderboard = [
  { rank: 1, name: 'AVG Mart (Supermarkets)', share: '42% Share', metric: '₹5.22 Cr', growth: '+15%' },
  { rank: 2, name: 'AVG Pay (Kiosks)', share: '28% Share', metric: '₹3.48 Cr', growth: '+18%' },
  { rank: 3, name: 'AVG Express (Logistics)', share: '18% Share', metric: '₹2.24 Cr', growth: '+9%' },
  { rank: 4, name: 'AVG Fresh (Groceries)', share: '12% Share', metric: '₹1.51 Cr', growth: '+6%' },
];

const DirectorRankings = () => {
  const [activeTab, setActiveTab] = useState('States');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Performance Rankings</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time revenue, collection, and operational leaderboards across all tiers</p>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex bg-slate-200/80 p-1 rounded-xl gap-1 text-xs font-semibold text-slate-600 overflow-x-auto">
          {['States', 'Districts', 'Sales Managers', 'Outlets', 'Business Verticals'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                activeTab === tab ? 'bg-white text-slate-900 shadow-sm font-bold' : 'hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Card Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400">
            Top Performers - {activeTab}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PodiumCard rank={2} title={getTopThree(activeTab)[1]?.name} val={getTopThree(activeTab)[1]?.metric} badge="2nd Rank" color="border-slate-400 text-slate-300" />
          <PodiumCard rank={1} title={getTopThree(activeTab)[0]?.name} val={getTopThree(activeTab)[0]?.metric} badge="1st Rank (Leader)" color="border-amber-400 text-amber-400" isGold />
          <PodiumCard rank={3} title={getTopThree(activeTab)[2]?.name} val={getTopThree(activeTab)[2]?.metric} badge="3rd Rank" color="border-amber-700 text-amber-600" />
        </div>
      </div>

      {/* Detailed Leaderboard Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Full Leaderboard Matrix: {activeTab}
          </h3>
          <span className="text-[11px] text-slate-400 font-semibold">Updated Real-Time</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4 font-bold">Rank</th>
                <th className="py-3.5 px-4 font-bold">Entity Name</th>
                <th className="py-3.5 px-4 font-bold">Primary Revenue / Metric</th>
                <th className="py-3.5 px-4 text-right font-bold">Performance Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {getTabList(activeTab).map((item) => (
                <tr key={item.rank} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold">
                    <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs ${
                      item.rank === 1 ? 'bg-amber-100 text-amber-700 font-extrabold' : 
                      item.rank === 2 ? 'bg-slate-200 text-slate-700 font-bold' : 
                      item.rank === 3 ? 'bg-amber-50 text-amber-800 font-bold' : 'text-slate-500'
                    }`}>
                      #{item.rank}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{item.name}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600">{item.metric}</td>
                  <td className="py-3.5 px-4 text-right font-medium text-slate-500">
                    {item.sub || item.achievement || item.vertical || item.share}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const PodiumCard = ({ rank, title, val, badge, color, isGold }) => (
  <div className={`bg-slate-800/90 border-2 ${color} rounded-xl p-4 flex flex-col justify-between ${isGold ? 'scale-105 shadow-lg bg-slate-800' : ''}`}>
    <div className="flex items-center justify-between">
      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-900/80 text-slate-300">
        {badge}
      </span>
      <Medal className={`w-5 h-5 ${isGold ? 'text-amber-400' : 'text-slate-400'}`} />
    </div>
    <div className="mt-3">
      <div className="text-base font-bold text-white truncate">{title || 'N/A'}</div>
      <div className="text-xs font-semibold text-emerald-400 mt-0.5">{val || 'N/A'}</div>
    </div>
  </div>
);

function getTabList(tab) {
  switch (tab) {
    case 'States': return stateLeaderboard;
    case 'Districts': return districtLeaderboard;
    case 'Sales Managers': return managerLeaderboard;
    case 'Outlets': return outletLeaderboard;
    case 'Business Verticals': return businessLeaderboard;
    default: return stateLeaderboard;
  }
}

function getTopThree(tab) {
  return getTabList(tab).slice(0, 3);
}

export default DirectorRankings;