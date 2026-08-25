import React from 'react';
import { History, Shield, Lock, Terminal, Search } from 'lucide-react';

const AuditLogs = () => {
  const logs = [
    { id: 'LOG-9921', user: 'Admin Console', action: 'Modified Role Privileges', target: 'Role ID: R-05 (State Head)', ip: '192.168.1.45', time: '10:42 AM' },
    { id: 'LOG-9922', user: 'Rajesh Sharma', action: 'Approved Franchise Registration', target: 'Unit: AVG-KA-88', ip: '106.51.32.12', time: '09:15 AM' },
    { id: 'LOG-9923', user: 'System Guard', action: 'Failed Authentication Attempt', target: 'User: temp_admin', ip: '49.207.140.8', time: '08:02 AM' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Audit Trail</h1>
          <p className="text-xs text-slate-500 mt-1">Immutable security tracking, permission modifications, and session activity</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2 bg-white border border-slate-200/80 px-3 py-1.5 rounded-xl text-xs w-80">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input type="text" placeholder="Search audit logs..." className="bg-transparent border-none outline-none w-full text-slate-700" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/30">
                <th className="py-3.5 px-5">Trace ID</th>
                <th className="py-3.5 px-5">User</th>
                <th className="py-3.5 px-5">Action Performed</th>
                <th className="py-3.5 px-5">Target Resource</th>
                <th className="py-3.5 px-5">Origin IP</th>
                <th className="py-3.5 px-5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-600">
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-5 font-mono text-[11px] font-bold text-slate-400">{l.id}</td>
                  <td className="py-4 px-5 font-bold text-slate-800">{l.user}</td>
                  <td className="py-4 px-5 text-slate-700">{l.action}</td>
                  <td className="py-4 px-5 text-slate-500 font-mono text-[11px]">{l.target}</td>
                  <td className="py-4 px-5 font-mono text-[11px] text-slate-400">{l.ip}</td>
                  <td className="py-4 px-5 text-right font-semibold text-slate-500">{l.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;