import React, { useState } from 'react';
import { 
  MapPin, Search, Filter, TrendingUp, ChevronRight, 
  Building2, IndianRupee, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';

const territoriesData = [
  {
    id: 'TN',
    state: 'Tamil Nadu',
    code: 'TN-ZONE-01',
    stateHead: 'R. Sundaram',
    districts: 38,
    franchises: 420,
    activeFranchises: 410,
    targetRevenue: '₹4.00 Cr',
    actualRevenue: '₹4.20 Cr',
    achievement: 105.0,
    collection: '₹4.00 Cr',
    outstanding: '₹18.50 L',
    topDistrict: 'Chennai',
    topManager: 'S. Kumar',
    districtBreakdown: [
      { name: 'Chennai', franchises: 120, sales: '₹1.50 Cr', collection: '₹1.40 Cr', targetPct: 107.1 },
      { name: 'Coimbatore', franchises: 95, sales: '₹1.10 Cr', collection: '₹1.00 Cr', targetPct: 104.7 },
      { name: 'Madurai', franchises: 85, sales: '₹0.80 Cr', collection: '₹0.80 Cr', targetPct: 100.0 },
      { name: 'Tiruchirappalli', franchises: 65, sales: '₹0.50 Cr', collection: '₹0.48 Cr', targetPct: 96.0 },
      { name: 'Salem', franchises: 55, sales: '₹0.30 Cr', collection: '₹0.32 Cr', targetPct: 106.6 },
    ]
  },
  {
    id: 'KA',
    state: 'Karnataka',
    code: 'KA-ZONE-02',
    stateHead: 'A. Rao',
    districts: 31,
    franchises: 380,
    activeFranchises: 372,
    targetRevenue: '₹3.50 Cr',
    actualRevenue: '₹3.80 Cr',
    achievement: 108.5,
    collection: '₹3.60 Cr',
    outstanding: '₹20.00 L',
    topDistrict: 'Bengaluru Urban',
    topManager: 'N. Hegde',
    districtBreakdown: [
      { name: 'Bengaluru Urban', franchises: 150, sales: '₹1.90 Cr', collection: '₹1.80 Cr', targetPct: 111.7 },
      { name: 'Mysuru', franchises: 80, sales: '₹0.85 Cr', collection: '₹0.80 Cr', targetPct: 106.2 },
      { name: 'Hubballi-Dharwad', franchises: 75, sales: '₹0.60 Cr', collection: '₹0.58 Cr', targetPct: 96.6 },
      { name: 'Mangaluru', franchises: 75, sales: '₹0.45 Cr', collection: '₹0.42 Cr', targetPct: 93.3 },
    ]
  },
  {
    id: 'KL',
    state: 'Kerala',
    code: 'KL-ZONE-03',
    stateHead: 'M. Menon',
    districts: 14,
    franchises: 210,
    activeFranchises: 205,
    targetRevenue: '₹2.00 Cr',
    actualRevenue: '₹2.10 Cr',
    achievement: 105.0,
    collection: '₹2.00 Cr',
    outstanding: '₹10.00 L',
    topDistrict: 'Ernakulam',
    topManager: 'P. Nair',
    districtBreakdown: [
      { name: 'Ernakulam', franchises: 80, sales: '₹0.90 Cr', collection: '₹0.86 Cr', targetPct: 108.0 },
      { name: 'Thiruvananthapuram', franchises: 65, sales: '₹0.65 Cr', collection: '₹0.62 Cr', targetPct: 104.0 },
      { name: 'Kozhikode', franchises: 65, sales: '₹0.55 Cr', collection: '₹0.52 Cr', targetPct: 100.0 },
    ]
  },
  {
    id: 'AP',
    state: 'Andhra Pradesh',
    code: 'AP-ZONE-04',
    stateHead: 'K. Reddy',
    districts: 26,
    franchises: 230,
    activeFranchises: 220,
    targetRevenue: '₹1.60 Cr',
    actualRevenue: '₹1.35 Cr',
    achievement: 84.3,
    collection: '₹1.20 Cr',
    outstanding: '₹15.00 L',
    topDistrict: 'Visakhapatnam',
    topManager: 'V. Naidu',
    districtBreakdown: [
      { name: 'Visakhapatnam', franchises: 90, sales: '₹0.60 Cr', collection: '₹0.55 Cr', targetPct: 91.6 },
      { name: 'Vijayawada', franchises: 80, sales: '₹0.45 Cr', collection: '₹0.40 Cr', targetPct: 88.8 },
      { name: 'Guntur', franchises: 60, sales: '₹0.30 Cr', collection: '₹0.25 Cr', targetPct: 71.4 },
    ]
  },
  {
    id: 'TS',
    state: 'Telangana',
    code: 'TS-ZONE-05',
    stateHead: 'S. Chander',
    districts: 33,
    franchises: 180,
    activeFranchises: 173,
    targetRevenue: '₹1.20 Cr',
    actualRevenue: '₹1.00 Cr',
    achievement: 83.3,
    collection: '₹0.95 Cr',
    outstanding: '₹5.00 L',
    topDistrict: 'Hyderabad',
    topManager: 'G. Krishna',
    districtBreakdown: [
      { name: 'Hyderabad', franchises: 110, sales: '₹0.70 Cr', collection: '₹0.68 Cr', targetPct: 87.5 },
      { name: 'Warangal', franchises: 40, sales: '₹0.18 Cr', collection: '₹0.16 Cr', targetPct: 75.0 },
      { name: 'Nizamabad', franchises: 30, sales: '₹0.12 Cr', collection: '₹0.11 Cr', targetPct: 80.0 },
    ]
  }
];

const DirectorTerritories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTerritory, setSelectedTerritory] = useState(null);

  const filteredTerritories = territoriesData.filter(t => 
    t.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.stateHead.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Territory Performance</h1>
          <p className="text-xs text-slate-500 mt-1">State and zone-level aggregated financial tracking and target analytics</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200/80 px-3 py-1.5 rounded-xl text-xs w-64 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Search territory or state head..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-700 placeholder-slate-400 text-xs w-full"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Top Territory Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active States / Zones" value="5 Zones" sub="142 Total Districts Covered" icon={MapPin} color="blue" />
        <StatCard title="Total Network Revenue" value="₹12.45 Cr" sub="vs ₹12.30 Cr Target" icon={IndianRupee} color="emerald" />
        <StatCard title="Total Active Franchises" value="1,380 Units" sub="40 Inactive Units" icon={Building2} color="indigo" />
        <StatCard title="Avg Target Achievement" value="97.2%" sub="3/5 Zones Achieved Target" icon={TrendingUp} color="amber" />
      </div>

      {/* Territories Master Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">State Performance Summary</h2>
          <span className="text-[11px] text-slate-400 font-medium">{filteredTerritories.length} Territory Zones</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4 font-bold">State / Zone</th>
                <th className="py-3.5 px-4 font-bold">State Head</th>
                <th className="py-3.5 px-4 font-bold">Districts</th>
                <th className="py-3.5 px-4 font-bold">Active Outlets</th>
                <th className="py-3.5 px-4 font-bold">Target</th>
                <th className="py-3.5 px-4 font-bold">Actual Sales</th>
                <th className="py-3.5 px-4 font-bold">Target %</th>
                <th className="py-3.5 px-4 font-bold">Collection</th>
                <th className="py-3.5 px-4 text-right font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTerritories.map((item) => {
                const isTargetAchieved = item.achievement >= 100;
                return (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-[10px] border border-blue-100">
                        {item.id}
                      </div>
                      <div>
                        <div>{item.state}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{item.code}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{item.stateHead}</td>
                    <td className="py-3.5 px-4 text-slate-600">{item.districts} Districts</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{item.activeFranchises} / {item.franchises}</td>
                    <td className="py-3.5 px-4 text-slate-500">{item.targetRevenue}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{item.actualRevenue}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${
                        isTargetAchieved ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60' : 'bg-amber-50 text-amber-600 border border-amber-200/60'
                      }`}>
                        {isTargetAchieved ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {item.achievement}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-emerald-600 font-semibold">{item.collection}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button 
                        onClick={() => setSelectedTerritory(selectedTerritory?.id === item.id ? null : item)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg border border-blue-200/60 transition-colors"
                      >
                        {selectedTerritory?.id === item.id ? 'Hide Districts' : 'View Districts'}
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${selectedTerritory?.id === item.id ? 'rotate-90' : ''}`} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sub-District Drill Breakdown View when a state row is clicked */}
      {selectedTerritory && (
        <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-md border border-slate-800 space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">District Drill-down</span>
              <h3 className="text-lg font-bold text-white mt-0.5">{selectedTerritory.state} District Performance Breakdown</h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">State Manager</span>
              <span className="text-xs font-bold text-slate-200">{selectedTerritory.stateHead}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {selectedTerritory.districtBreakdown.map((dist, idx) => (
              <div key={idx} className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{dist.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${dist.targetPct >= 100 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {dist.targetPct}%
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] border-t border-slate-700/60 pt-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Outlets</span>
                    <span className="font-bold text-slate-200">{dist.franchises}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Sales</span>
                    <span className="font-bold text-emerald-400">{dist.sales}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Collection</span>
                    <span className="font-bold text-blue-400">{dist.collection}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, sub, icon: Icon, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  };

  return (
    <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-xl border ${colors[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-900 tracking-tight">{value}</div>
      <div className="text-[11px] text-slate-400 mt-1 font-medium">{sub}</div>
    </div>
  );
};

export default DirectorTerritories;