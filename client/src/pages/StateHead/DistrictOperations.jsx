import React from 'react';
import { MapPin, Users, Building2 } from 'lucide-react';

const DistrictOperations = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">District Operations</h1>
        <p className="text-xs text-slate-500 mt-1">District-wise franchise density and performance breakdown</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli"].map((dist) => (
          <div key={dist} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-900 text-sm">{dist} District</span>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-bold text-[10px]">Active Zone</span>
            </div>
            <div className="text-xs text-slate-500">Manager: V. Anand</div>
            <div className="text-xs font-bold text-slate-800 pt-2 border-t border-slate-100 flex justify-between">
              <span>85 Franchises</span>
              <span className="text-emerald-600">₹1.2 Cr Collection</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DistrictOperations;