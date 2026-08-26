import React from 'react';
import { 
  IndianRupee, 
  Target, 
  TrendingUp, 
  PhoneCall, 
  AlertTriangle, 
  CheckCircle2 
} from 'lucide-react';

const CollectionFollowup = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Collection & Target Tracking</h1>
        <p className="text-xs text-slate-500 mt-1">Monitor recovery ledgers, collection efficiency, and monthly sales targets</p>
      </div>

      {/* Target Progress Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly Territory Target</span>
            <h3 className="text-xl font-bold text-slate-900">₹14,50,000 / ₹18,00,000</h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            82% Completed
          </span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full w-[82%] transition-all duration-500" />
        </div>
      </div>

      {/* Outstanding Recovery Follow-up Ledger */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Pending Outstanding Recovery</h3>
          <span className="text-[11px] font-semibold text-rose-600">Total Due: ₹45,000</span>
        </div>

        <div className="p-4 space-y-3">
          <div className="p-4 border border-slate-200 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="font-bold text-slate-900 text-xs">Central Retail Outlet (FR-102)</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Overdue Days: 12 Days • Contact: Suresh Patel</div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-rose-600">₹28,000</span>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors">
                <PhoneCall className="w-3.5 h-3.5" />
                Call Owner
              </button>
            </div>
          </div>

          <div className="p-4 border border-slate-200 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="font-bold text-slate-900 text-xs">West End Hub (FR-104)</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Overdue Days: 5 Days • Contact: Vikram Verma</div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-amber-600">₹12,000</span>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors">
                <PhoneCall className="w-3.5 h-3.5" />
                Call Owner
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionFollowup;