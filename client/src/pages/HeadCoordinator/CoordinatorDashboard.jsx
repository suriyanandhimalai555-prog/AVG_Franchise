import React, { useState } from 'react';
import { 
  Building2, IndianRupee, Wallet, AlertTriangle, Clock, 
  TrendingUp, Award, MapPin, CheckCircle2, XCircle, 
  ChevronRight, ArrowUpRight, ArrowDownRight, Filter, ShieldAlert 
} from 'lucide-react';

const regionalData = {
  regionName: "South Region",
  assignedStatesCount: 5,
  totalFranchises: 1420,
  activeFranchises: 1380,
  inactiveFranchises: 40,
  totalMonthlySales: "₹12.45 Cr",
  totalMonthlyCollection: "₹11.80 Cr",
  totalOutstanding: "₹62.40 L",
  avgEfficiency: "94.7%",
  pendingApprovalsCount: 14,
  pendingEscalationsCount: 5,
  states: [
    {
      id: "TN",
      name: "Tamil Nadu",
      stateHead: "R. Sundaram",
      sales: "₹4.20 Cr",
      collection: "₹4.00 Cr",
      outstanding: "₹18.50 L",
      efficiency: "95.2%",
      targetAchievement: "105.0%",
      growth: "+12.4%",
      newSignups: 18,
      newOpenings: 4,
      closures: 1,
      status: "High Performing",
      pendingApprovals: 3,
      pendingEscalations: 0,
    },
    {
      id: "KA",
      name: "Karnataka",
      stateHead: "A. Rao",
      sales: "₹3.80 Cr",
      collection: "₹3.60 Cr",
      outstanding: "₹20.00 L",
      efficiency: "94.7%",
      targetAchievement: "108.5%",
      growth: "+14.1%",
      newSignups: 15,
      newOpenings: 5,
      closures: 0,
      status: "High Performing",
      pendingApprovals: 4,
      pendingEscalations: 1,
    },
    {
      id: "KL",
      name: "Kerala",
      stateHead: "M. Menon",
      sales: "₹2.10 Cr",
      collection: "₹2.00 Cr",
      outstanding: "₹10.00 L",
      efficiency: "95.2%",
      targetAchievement: "105.0%",
      growth: "+8.2%",
      newSignups: 8,
      newOpenings: 2,
      closures: 0,
      status: "On Track",
      pendingApprovals: 2,
      pendingEscalations: 0,
    },
    {
      id: "AP",
      name: "Andhra Pradesh",
      stateHead: "K. Reddy",
      sales: "₹1.35 Cr",
      collection: "₹1.20 Cr",
      outstanding: "₹15.00 L",
      efficiency: "88.8%",
      targetAchievement: "84.3%",
      growth: "-2.1%",
      newSignups: 4,
      newOpenings: 1,
      closures: 1,
      status: "Low Performing",
      pendingApprovals: 3,
      pendingEscalations: 2,
    },
    {
      id: "TS",
      name: "Telangana",
      stateHead: "S. Chander",
      sales: "₹1.00 Cr",
      collection: "₹0.95 Cr",
      outstanding: "₹5.00 L",
      efficiency: "95.0%",
      targetAchievement: "83.3%",
      growth: "+4.0%",
      newSignups: 3,
      newOpenings: 0,
      closures: 0,
      status: "Needs Support",
      pendingApprovals: 2,
      pendingEscalations: 2,
    }
  ],
  escalationsList: [
    { id: "ESC-801", state: "Andhra Pradesh", title: "Delayed Royalty Collection (>60 Days)", priority: "High", head: "K. Reddy", age: "3 Days" },
    { id: "ESC-804", state: "Telangana", title: "Franchise Agreement Breach - Banjara Hills", priority: "Critical", head: "S. Chander", age: "1 Day" },
    { id: "ESC-809", state: "Karnataka", title: "Territory Overlap Dispute - Indiranagar Zone", priority: "Medium", head: "A. Rao", age: "4 Days" }
  ]
};

const CoordinatorDashboard = () => {
  const [selectedRegion, setSelectedRegion] = useState("South Region");

  const lowPerformingStates = regionalData.states.filter(s => s.status === "Low Performing" || s.status === "Needs Support");

  return (
    <div className="space-y-6">
      {/* Title & Region Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">State Head Coordinator Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">Multi-state supervision, state head performance, and operational escalation management</p>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-white border border-slate-200/80 text-xs font-bold text-slate-800 px-3 py-2 rounded-xl shadow-sm outline-none cursor-pointer"
          >
            <option value="South Region">South Region (5 States)</option>
            <option value="West Region">West Region (3 States)</option>
            <option value="North Region">North Region (4 States)</option>
          </select>

          <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Monthly Cycle</span>
          </button>
        </div>
      </div>

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CoordMetricCard 
          title="Regional Sales" 
          value={regionalData.totalMonthlySales} 
          sub={`Collection: ${regionalData.totalMonthlyCollection}`}
          badge="102% Target" 
          isPositive={true} 
          icon={IndianRupee} 
          color="blue" 
        />
        <CoordMetricCard 
          title="Total Outstanding" 
          value={regionalData.totalOutstanding} 
          sub={`Avg Efficiency: ${regionalData.avgEfficiency}`}
          badge="Action Needed" 
          isPositive={false} 
          icon={Wallet} 
          color="amber" 
        />
        <CoordMetricCard 
          title="Network Expansion" 
          value={`${regionalData.totalFranchises} Outlets`} 
          sub={`Signups: +48 | Openings: +12 | Closures: -2`}
          badge="+3.4% Growth" 
          isPositive={true} 
          icon={Building2} 
          color="emerald" 
        />
        <CoordMetricCard 
          title="Pending Action Queue" 
          value={`${regionalData.pendingApprovalsCount} Approvals`} 
          sub={`${regionalData.pendingEscalationsCount} Critical Escalations`}
          badge="Requires Review" 
          isPositive={false} 
          icon={Clock} 
          color="rose" 
        />
      </div>

      {/* Low Performing States Alert Section */}
      {lowPerformingStates.length > 0 && (
        <div className="bg-rose-50/80 border border-rose-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-100 text-rose-600 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-rose-900 uppercase tracking-wider">Attention: Low Performing States Identified</div>
              <div className="text-xs text-rose-700 mt-0.5">
                {lowPerformingStates.map(s => `${s.name} (Head: ${s.stateHead} - Target: ${s.targetAchievement})`).join(' | ')}
              </div>
            </div>
          </div>
          <button className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors shrink-0">
            Review State Action Plans
          </button>
        </div>
      )}

      {/* Master State-Wise Overview Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            State-Wise Financial & Growth Breakdown ({regionalData.regionName})
          </h2>
          <span className="text-[11px] text-slate-400 font-medium">5 Active State Operations</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4 font-bold">State Name</th>
                <th className="py-3.5 px-4 font-bold">State Head</th>
                <th className="py-3.5 px-4 font-bold">Sales</th>
                <th className="py-3.5 px-4 font-bold">Collection</th>
                <th className="py-3.5 px-4 font-bold">Outstanding</th>
                <th className="py-3.5 px-4 font-bold">Efficiency</th>
                <th className="py-3.5 px-4 font-bold">Target %</th>
                <th className="py-3.5 px-4 font-bold">Growth (Signups / Open / Close)</th>
                <th className="py-3.5 px-4 text-right font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {regionalData.states.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    {st.name}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{st.stateHead}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{st.sales}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600">{st.collection}</td>
                  <td className="py-3.5 px-4 font-semibold text-rose-600">{st.outstanding}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{st.efficiency}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-0.5 font-bold ${
                      parseFloat(st.targetAchievement) >= 100 ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {st.targetAchievement}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="font-semibold text-slate-900">+{st.newSignups}</span> signups | <span className="text-emerald-600 font-semibold">+{st.newOpenings}</span> open | <span className="text-rose-600 font-semibold">-{st.closures}</span> closed
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <StateStatusBadge status={st.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two-Column Grid: State Head Ranking & Escalations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* State Head Performance Standings */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">State Head Performance Standings</h3>
            </div>
            <span className="text-[11px] font-semibold text-blue-600 cursor-pointer hover:underline">View All</span>
          </div>

          <div className="space-y-3">
            {regionalData.states.map((st, idx) => (
              <div key={st.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{st.stateHead}</div>
                    <div className="text-[10px] text-slate-400">{st.name} State Manager</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-600">{st.collection} Collection</div>
                  <div className="text-[10px] font-semibold text-slate-500">{st.targetAchievement} Target Met</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Escalations Panel */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Pending State Escalations</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-bold">
              {regionalData.escalationsList.length} Active Issues
            </span>
          </div>

          <div className="space-y-3">
            {regionalData.escalationsList.map((esc) => (
              <div key={esc.id} className="p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-colors space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-400">{esc.id} • {esc.state}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    esc.priority === 'Critical' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {esc.priority} Priority
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-800">{esc.title}</div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                  <span>Assigned State Head: <strong className="text-slate-700">{esc.head}</strong></span>
                  <span>Age: {esc.age}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

const CoordMetricCard = ({ title, value, sub, badge, isPositive, icon: Icon, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
  };

  return (
    <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-xl border ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${
          isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
        }`}>
          {badge}
        </span>
      </div>
      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{title}</div>
      <div className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{value}</div>
      <div className="text-[11px] text-slate-400 mt-2 font-medium">{sub}</div>
    </div>
  );
};

const StateStatusBadge = ({ status }) => {
  const styles = {
    'High Performing': 'bg-emerald-50 text-emerald-600 border-emerald-200',
    'On Track': 'bg-blue-50 text-blue-600 border-blue-200',
    'Low Performing': 'bg-rose-50 text-rose-600 border-rose-200',
    'Needs Support': 'bg-amber-50 text-amber-600 border-amber-200',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${styles[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
};

export default CoordinatorDashboard;