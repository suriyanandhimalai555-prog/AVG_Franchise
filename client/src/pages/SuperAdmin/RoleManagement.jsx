import React from 'react';
import { Plus, Shield, MoreVertical, Layers, Search, Filter } from 'lucide-react';

const RoleManagement = () => {
  const roles = [
    { id: 'R-01', title: 'Super Admin', level: 'Level 0', users: 2, desc: 'Full System Control & Audit Tracing' },
    { id: 'R-02', title: 'Operational Admin', level: 'Level 1', users: 5, desc: 'Vertical & Account Management' },
    { id: 'R-03', title: 'Director Analytics', level: 'Level 2', users: 8, desc: 'Read-only access to BI & Metrics' },
    { id: 'R-04', title: 'Regional Coordinator', level: 'Level 3', users: 12, desc: 'Multi-State Operational Oversight' },
    { id: 'R-05', title: 'State Head', level: 'Level 4', users: 28, desc: 'State Franchise Signups & Commissions' },
    { id: 'R-06', title: 'State Sales Manager', level: 'Level 5', users: 140, desc: 'Field Audits & Store Verifications' },
    { id: 'R-07', title: 'Franchise Partner', level: 'Level 6', users: 4782, desc: 'Store Terminal Entry & Sales' },
  ];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Role Hierarchy & Access Rules</h1>
          <p className="text-xs text-slate-500 mt-1">Configure user roles, permissions, and reporting trees</p>
        </div>
        <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all">
          <Plus className="w-4 h-4" /> Create Custom Role
        </button>
      </div>

      {/* Card Table Wrapper */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2 bg-white border border-slate-200/80 px-3 py-1.5 rounded-xl text-xs w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input type="text" placeholder="Filter roles..." className="bg-transparent border-none outline-none w-full text-slate-700" />
          </div>
          <button className="px-3 py-1.5 bg-white border border-slate-200/80 text-slate-600 text-xs font-medium rounded-xl flex items-center gap-2 self-start sm:self-auto hover:bg-slate-50 transition-colors">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> Filter Rules
          </button>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/30">
                <th className="py-3.5 px-5">Role ID</th>
                <th className="py-3.5 px-5">Role Designation</th>
                <th className="py-3.5 px-5">Hierarchy Level</th>
                <th className="py-3.5 px-5">Active Users</th>
                <th className="py-3.5 px-5">Operational Scope</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-600">
              {roles.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-5 font-mono font-bold text-blue-600">{r.id}</td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500">
                        <Shield className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-slate-800">{r.title}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 rounded-md text-[10px] font-bold text-slate-600">
                      <Layers className="w-3 h-3 text-slate-400" /> {r.level}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-bold text-slate-700">{r.users.toLocaleString()} Users</td>
                  <td className="py-4 px-5 text-slate-500 max-w-xs truncate">{r.desc}</td>
                  <td className="py-4 px-5 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;