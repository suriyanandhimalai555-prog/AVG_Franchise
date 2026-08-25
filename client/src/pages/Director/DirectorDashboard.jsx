import React, { useState } from 'react';
import { 
  Building2, IndianRupee, Wallet, AlertCircle, Award, 
  MapPin, ChevronRight, ArrowUpRight, ArrowDownRight, Users, Layers, Filter 
} from 'lucide-react';

const hierarchyData = {
  national: {
    title: "India (National Level)",
    totalFranchises: "1,420",
    activeFranchises: "1,380",
    inactiveFranchises: "40",
    todaySales: "₹48.25 L",
    monthlySales: "₹12.45 Cr",
    yearlySales: "₹148.5 Cr",
    todayCollection: "₹45.10 L",
    monthlyCollection: "₹11.80 Cr",
    outstanding: "₹62.40 L",
    pipeline: "84 Leads",
    newOpenings: "12 Units",
    closedFranchises: "2 Units",
    topState: "Tamil Nadu (₹4.2 Cr)",
    topDistrict: "Chennai (₹1.5 Cr)",
    topManager: "S. Kumar (Zone 1)",
    topFranchise: "AVG Mart - T.Nagar",
    topBusiness: "AVG Mart (42%)",
    breakdown: [
      { id: "TN", name: "Tamil Nadu", type: "State", franchises: "420", sales: "₹4.20 Cr", collection: "₹4.00 Cr", manager: "R. Sundaram" },
      { id: "KA", name: "Karnataka", type: "State", franchises: "380", sales: "₹3.80 Cr", collection: "₹3.60 Cr", manager: "A. Rao" },
      { id: "KL", name: "Kerala", type: "State", franchises: "210", sales: "₹2.10 Cr", collection: "₹2.00 Cr", manager: "M. Menon" },
      { id: "AP", name: "Andhra Pradesh", type: "State", franchises: "230", sales: "₹1.35 Cr", collection: "₹1.20 Cr", manager: "K. Reddy" },
    ]
  },
  "TN": {
    title: "Tamil Nadu State",
    totalFranchises: "420",
    activeFranchises: "410",
    inactiveFranchises: "10",
    todaySales: "₹18.20 L",
    monthlySales: "₹4.20 Cr",
    yearlySales: "₹48.0 Cr",
    todayCollection: "₹17.50 L",
    monthlyCollection: "₹4.00 Cr",
    outstanding: "₹18.50 L",
    pipeline: "28 Leads",
    newOpenings: "4 Units",
    closedFranchises: "1 Unit",
    topState: "Tamil Nadu",
    topDistrict: "Chennai (₹1.5 Cr)",
    topManager: "S. Kumar (Zone 1)",
    topFranchise: "AVG Mart - T.Nagar",
    topBusiness: "AVG Mart",
    breakdown: [
      { id: "CHN", name: "Chennai District", type: "District", franchises: "120", sales: "₹1.50 Cr", collection: "₹1.40 Cr", manager: "S. Kumar" },
      { id: "CBE", name: "Coimbatore District", type: "District", franchises: "95", sales: "₹1.10 Cr", collection: "₹1.00 Cr", manager: "P. Murugan" },
      { id: "MDU", name: "Madurai District", type: "District", franchises: "85", sales: "₹0.80 Cr", collection: "₹0.80 Cr", manager: "K. Selvam" },
    ]
  },
  "CHN": {
    title: "Chennai District",
    totalFranchises: "120",
    activeFranchises: "118",
    inactiveFranchises: "2",
    todaySales: "₹6.50 L",
    monthlySales: "₹1.50 Cr",
    yearlySales: "₹16.2 Cr",
    todayCollection: "₹6.10 L",
    monthlyCollection: "₹1.40 Cr",
    outstanding: "₹5.20 L",
    pipeline: "8 Leads",
    newOpenings: "2 Units",
    closedFranchises: "0 Units",
    topState: "Tamil Nadu",
    topDistrict: "Chennai",
    topManager: "S. Kumar (Zone 1)",
    topFranchise: "AVG Mart - T.Nagar",
    topBusiness: "AVG Mart",
    breakdown: [
      { id: "SM-01", name: "S. Kumar (Sales Manager - Zone 1)", type: "Sales Manager", franchises: "40", sales: "₹52.00 L", collection: "₹50.00 L", manager: "S. Kumar" },
      { id: "SM-02", name: "V. Anand (Sales Manager - Zone 2)", type: "Sales Manager", franchises: "42", sales: "₹51.00 L", collection: "₹48.00 L", manager: "V. Anand" },
    ]
  },
  "SM-01": {
    title: "S. Kumar - Zone 1 Manager",
    totalFranchises: "40",
    activeFranchises: "40",
    inactiveFranchises: "0",
    todaySales: "₹2.20 L",
    monthlySales: "₹52.00 L",
    yearlySales: "₹5.8 Cr",
    todayCollection: "₹2.10 L",
    monthlyCollection: "₹50.00 L",
    outstanding: "₹1.80 L",
    pipeline: "3 Leads",
    newOpenings: "1 Unit",
    closedFranchises: "0 Units",
    topState: "Tamil Nadu",
    topDistrict: "Chennai",
    topManager: "S. Kumar",
    topFranchise: "AVG Mart - T.Nagar",
    topBusiness: "AVG Mart",
    breakdown: [
      { id: "AVG-TN-001", name: "AVG Mart - T.Nagar", type: "Franchise", franchises: "1", sales: "₹4.50 L", collection: "₹4.40 L", manager: "S. Kumar" },
      { id: "AVG-TN-002", name: "AVG Pay - Velachery", type: "Franchise", franchises: "1", sales: "₹3.80 L", collection: "₹3.70 L", manager: "S. Kumar" },
    ]
  }
};

const DirectorDashboard = () => {
  const [breadcrumb, setBreadcrumb] = useState([{ id: 'national', label: 'India' }]);
  const currentLevelId = breadcrumb[breadcrumb.length - 1].id;
  const data = hierarchyData[currentLevelId] || hierarchyData.national;

  const handleDrillDown = (item) => {
    if (hierarchyData[item.id]) {
      setBreadcrumb([...breadcrumb, { id: item.id, label: item.name }]);
    }
  };

  const handleBreadcrumbClick = (index) => {
    setBreadcrumb(breadcrumb.slice(0, index + 1));
  };

  return (
    <div className="space-y-6">
      {/* Title & Navigation Path */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Director Executive Dashboard</h1>
          <nav className="flex items-center gap-2 mt-2 text-xs flex-wrap">
            {breadcrumb.map((crumb, idx) => (
              <React.Fragment key={crumb.id}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                <button
                  onClick={() => handleBreadcrumbClick(idx)}
                  className={`font-semibold transition-colors ${
                    idx === breadcrumb.length - 1 
                      ? 'text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {crumb.label}
                </button>
              </React.Fragment>
            ))}
          </nav>
        </div>

        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors w-fit">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span>Financial Year 2026-27</span>
        </button>
      </div>

      {/* KPI Cards Matching Super Admin Styling */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Franchise Count" 
          value={`${data.totalFranchises} Total`} 
          badge={`${data.activeFranchises} Active`} 
          isPositive={true}
          sub={`${data.inactiveFranchises} currently inactive`} 
          icon={Building2} 
          iconBg="bg-blue-50 text-blue-600 border-blue-100" 
        />
        <MetricCard 
          title="Monthly Sales" 
          value={data.monthlySales} 
          badge="Monthly" 
          isPositive={true}
          sub={`Today: ${data.todaySales} | Year: ${data.yearlySales}`} 
          icon={IndianRupee} 
          iconBg="bg-emerald-50 text-emerald-600 border-emerald-100" 
        />
        <MetricCard 
          title="Monthly Collection" 
          value={data.monthlyCollection} 
          badge={`Today: ${data.todayCollection}`} 
          isPositive={true}
          sub={`Outstanding: ${data.outstanding}`} 
          icon={Wallet} 
          iconBg="bg-indigo-50 text-indigo-600 border-indigo-100" 
        />
        <MetricCard 
          title="Pipeline & Growth" 
          value={data.pipeline} 
          badge={data.newOpenings} 
          isPositive={true}
          sub={`Closed Franchises: ${data.closedFranchises}`} 
          icon={AlertCircle} 
          iconBg="bg-amber-50 text-amber-600 border-amber-100" 
        />
      </div>

      {/* Performers Highlights Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <PerformerTile icon={Award} title="Top State" value={data.topState} />
        <PerformerTile icon={MapPin} title="Top District" value={data.topDistrict} />
        <PerformerTile icon={Users} title="Top Sales Manager" value={data.topManager} />
        <PerformerTile icon={Building2} title="Top Franchise" value={data.topFranchise} />
        <PerformerTile icon={Layers} title="Top Business" value={data.topBusiness} />
      </div>

      {/* Interactive Drill Down Data Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Drill-Down Matrix: {data.title}
          </h2>
          <span className="text-[11px] text-slate-400 font-medium">Click any row to drill down</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4 font-bold">Entity Name</th>
                <th className="py-3 px-4 font-bold">Type</th>
                <th className="py-3 px-4 font-bold">Units</th>
                <th className="py-3 px-4 font-bold">Monthly Sales</th>
                <th className="py-3 px-4 font-bold">Monthly Collection</th>
                <th className="py-3 px-4 font-bold">Manager</th>
                <th className="py-3 px-4 text-right font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {data.breakdown.map((item) => {
                const canDrill = Boolean(hierarchyData[item.id]);
                return (
                  <tr 
                    key={item.id} 
                    onClick={() => canDrill && handleDrillDown(item)}
                    className={`transition-colors ${canDrill ? 'hover:bg-blue-50/40 cursor-pointer' : 'hover:bg-slate-50'}`}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      {item.name}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">{item.franchises}</td>
                    <td className="py-3.5 px-4 text-emerald-600 font-bold">{item.sales}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{item.collection}</td>
                    <td className="py-3.5 px-4 text-slate-500">{item.manager}</td>
                    <td className="py-3.5 px-4 text-right">
                      {canDrill ? (
                        <span className="inline-flex items-center gap-1 text-blue-600 font-bold">
                          Drill Down <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="text-slate-400">Terminal Node</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, badge, isPositive, sub, icon: Icon, iconBg }) => (
  <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2.5 rounded-xl border ${iconBg}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${
        isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
      }`}>
        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {badge}
      </span>
    </div>
    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{title}</div>
    <div className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{value}</div>
    <div className="text-[11px] text-slate-400 mt-2 font-medium">{sub}</div>
  </div>
);

const PerformerTile = ({ icon: Icon, title, value }) => (
  <div className="bg-white border border-slate-200/80 rounded-xl p-3 flex items-center gap-3 shadow-sm">
    <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
      <Icon className="w-4 h-4" />
    </div>
    <div className="overflow-hidden">
      <span className="text-[10px] text-slate-400 uppercase font-bold block">{title}</span>
      <span className="text-xs font-bold text-slate-800 truncate block">{value}</span>
    </div>
  </div>
);

export default DirectorDashboard;