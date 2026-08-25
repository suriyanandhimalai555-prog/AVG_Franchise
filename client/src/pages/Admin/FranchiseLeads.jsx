import React, { useState } from 'react';
import { UserPlus, ChevronRight, PhoneCall, MessageSquare } from 'lucide-react';

const FranchiseLeads = () => {
  const [pipeline, setPipeline] = useState([
    { id: 'L-101', name: 'Rohan Mehta', location: 'Bangalore Urban', business: 'AVG Mart', status: 'New Lead' },
    { id: 'L-102', name: 'Priya Sharma', location: 'Mysore', business: 'AVG Courier', status: 'KYC Verified' },
    { id: 'L-103', name: 'Vikram Reddy', location: 'Ernakulam', business: 'AVG Pay', status: 'Agreement Signed' },
  ]);

  const stages = ['New Lead', 'Contacted', 'Meeting Completed', 'KYC Verified', 'Agreement Signed'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Franchise Acquisition CRM Leads</h1>
          <p className="text-xs text-slate-500">Track interested applicants through the onboarding pipeline</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/20">
          <UserPlus className="w-4 h-4" /> Add Lead
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pipeline.map((lead) => (
          <div key={lead.id} className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-sm text-slate-800">{lead.name}</h3>
                <span className="text-[10px] text-slate-400 font-mono">{lead.id} • {lead.location}</span>
              </div>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-md text-[10px] font-bold">
                {lead.status}
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl text-xs font-medium text-slate-600">
              Vertical Interest: <span className="font-bold text-slate-800">{lead.business}</span>
            </div>

            <div className="flex gap-2 pt-1">
              <button className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-xl flex items-center justify-center gap-1">
                <PhoneCall className="w-3 h-3" /> Call
              </button>
              <button className="flex-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] rounded-xl flex items-center justify-center gap-1">
                Advance Stage
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FranchiseLeads;