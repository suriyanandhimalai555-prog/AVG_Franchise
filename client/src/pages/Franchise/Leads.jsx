import React, { useState } from 'react';
import { UserPlus, Repeat, PhoneCall, CheckCircle } from 'lucide-react';

const Leads = () => {
  const [leads] = useState([
    { id: 'LD-501', name: 'Amit Verma', source: 'Walk-in', phone: '+91 99887 76655', stage: 'Interested', date: '2026-03-29' },
    { id: 'LD-502', name: 'Neha Gupta', source: 'Website', phone: '+91 98760 12345', stage: 'Converted', date: '2026-03-28' },
    { id: 'LD-503', name: 'Karan Malhotra', source: 'Referral', phone: '+91 91234 56789', stage: 'Follow-up Required', date: '2026-03-27' },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leads & Conversions</h1>
        <p className="text-xs text-slate-500 mt-1">Track prospective branch clients and acquisition funnel</p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100">
            <tr>
              <th className="py-3.5 px-4 font-bold">Lead ID</th>
              <th className="py-3.5 px-4 font-bold">Lead Name</th>
              <th className="py-3.5 px-4 font-bold">Source</th>
              <th className="py-3.5 px-4 font-bold">Phone</th>
              <th className="py-3.5 px-4 font-bold">Date Added</th>
              <th className="py-3.5 px-4 text-center font-bold">Stage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {leads.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{l.id}</td>
                <td className="py-3.5 px-4 font-bold text-slate-900">{l.name}</td>
                <td className="py-3.5 px-4 text-slate-600">{l.source}</td>
                <td className="py-3.5 px-4 text-slate-500">{l.phone}</td>
                <td className="py-3.5 px-4 text-slate-500">{l.date}</td>
                <td className="py-3.5 px-4 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    l.stage === 'Converted' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-blue-50 text-blue-600 border border-blue-200'
                  }`}>
                    {l.stage}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leads;