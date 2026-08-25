import React, { useState } from 'react';
import { Store, Search, Filter, Lock, Eye, Building2 } from 'lucide-react';

const FranchiseList = () => {
  const [selectedFranchise, setSelectedFranchise] = useState(null);

  const franchises = [
    { 
      id: 'AVG-TN-CHN-00125', name: 'AVG Mart Indiranagar', owner: 'Kiran Patel', phone: '+91 9876543210',
      state: 'Karnataka', district: 'Bangalore Urban', taluk: 'Bangalore South', status: 'Active',
      businesses: ['AVG Mart', 'AVG Pay'], sales: '₹14,50,000', collection: '₹14,00,000', outstanding: '₹50,000'
    },
    { 
      id: 'AVG-KL-EKM-00042', name: 'AVG Courier Aluva', owner: 'Ramesh Kumar', phone: '+91 9876543211',
      state: 'Kerala', district: 'Ernakulam', taluk: 'Aluva', status: 'Active',
      businesses: ['AVG Courier'], sales: '₹8,20,000', collection: '₹8,00,000', outstanding: '₹20,000'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Franchise Master Directory</h1>
          <p className="text-xs text-slate-500">View complete franchise history, assigned businesses, and drill down into ledgers</p>
        </div>
      </div>

      {/* Search & Filtering Control Bar */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-2 bg-slate-100 border px-3 py-2 rounded-xl text-xs w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input type="text" placeholder="Search Franchise ID, Name, Owner..." className="bg-transparent border-none outline-none w-full" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select className="px-3 py-2 text-xs border rounded-xl bg-white outline-none">
            <option>All States</option>
            <option>Karnataka</option>
            <option>Kerala</option>
            <option>Tamil Nadu</option>
          </select>
          <select className="px-3 py-2 text-xs border rounded-xl bg-white outline-none">
            <option>All Statuses</option>
            <option>Active</option>
            <option>Temporary Closed</option>
            <option>Locked</option>
          </select>
        </div>
      </div>

      {/* Franchise Data Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b text-[10px] font-bold text-slate-400 uppercase bg-slate-50/50">
              <th className="p-4">Franchise ID & Name</th>
              <th className="p-4">Owner & Contact</th>
              <th className="p-4">Territory (State/Dist/Taluk)</th>
              <th className="p-4">Active Business Verticals</th>
              <th className="p-4">Financial Overview</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {franchises.map((f) => (
              <tr key={f.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-slate-800">{f.name}</div>
                  <div className="font-mono text-[10px] font-bold text-blue-600">{f.id}</div>
                </td>
                <td className="p-4">
                  <div className="font-semibold text-slate-700">{f.owner}</div>
                  <div className="text-[10px] text-slate-400">{f.phone}</div>
                </td>
                <td className="p-4 text-slate-600">
                  {f.state} → {f.district} → {f.taluk}
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {f.businesses.map(b => (
                      <span key={b} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-semibold text-[10px] border border-slate-200">
                        {b}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-slate-800 font-bold">Sales: {f.sales}</div>
                  <div className="text-rose-600 text-[10px] font-semibold">Outst: {f.outstanding}</div>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => setSelectedFranchise(f)} className="px-3 py-1.5 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 flex items-center gap-1 ml-auto">
                    <Eye className="w-3.5 h-3.5" /> Full History
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Franchise Drill-Down Modal */}
      {selectedFranchise && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">{selectedFranchise.name}</h3>
                <p className="font-mono text-xs text-blue-600 font-bold">{selectedFranchise.id}</p>
              </div>
              <button onClick={() => setSelectedFranchise(null)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">✕ Close</button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 text-[10px] font-bold uppercase">Owner Info</span>
                <div className="font-bold text-slate-800">{selectedFranchise.owner}</div>
                <div className="text-slate-500">{selectedFranchise.phone}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 text-[10px] font-bold uppercase">Territory</span>
                <div className="font-bold text-slate-800">{selectedFranchise.state}</div>
                <div className="text-slate-500">{selectedFranchise.district} - {selectedFranchise.taluk}</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase">Complete Operations Log History</h4>
              <div className="p-3 border rounded-xl text-xs space-y-2 bg-slate-50/50">
                <div className="flex justify-between border-b pb-1 text-slate-600">
                  <span>Status Changed to Active</span>
                  <span className="text-slate-400 text-[10px]">10:35 AM • State Head</span>
                </div>
                <div className="flex justify-between border-b pb-1 text-slate-600">
                  <span>KYC Documents Verified</span>
                  <span className="text-slate-400 text-[10px]">Yesterday • Admin</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FranchiseList;