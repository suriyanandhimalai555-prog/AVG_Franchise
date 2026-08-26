import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Plus, 
  Clock, 
  FileCheck 
} from 'lucide-react';

const FranchiseVisits = () => {
  const [visits] = useState([
    {
      id: 'VST-1',
      franchise: 'Central Retail Outlet (FR-102)',
      date: 'Today, 02:00 PM',
      purpose: 'Low Performance & Audit Follow-up',
      status: 'Scheduled',
    },
    {
      id: 'VST-2',
      franchise: 'North Franchise Store A (FR-101)',
      date: 'Yesterday, 11:00 AM',
      purpose: 'Routine Quality Check',
      status: 'Completed',
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Franchise Visit Log</h1>
          <p className="text-xs text-slate-500 mt-1">Schedule and log physical store visits and audit reports</p>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Schedule Visit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visits.map((visit) => (
          <div key={visit.id} className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400">{visit.id}</span>
                <h3 className="font-bold text-slate-900 text-sm">{visit.franchise}</h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                visit.status === 'Completed' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                {visit.status}
              </span>
            </div>

            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{visit.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Purpose: {visit.purpose}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors">
                {visit.status === 'Completed' ? 'View Audit Notes' : 'Submit Visit Report'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FranchiseVisits;