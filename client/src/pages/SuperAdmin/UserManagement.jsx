import React from 'react';
import { UserPlus, Search, Filter, MoreVertical, Mail, Phone, Shield, MapPin } from 'lucide-react';

const UserManagement = () => {
  const users = [
    { id: 'USR-8901', name: 'Rajesh Sharma', email: 'rajesh.s@avg.com', phone: '+91 98765 43210', role: 'State Head', state: 'Karnataka', status: 'Active' },
    { id: 'USR-8902', name: 'Priya Nair', email: 'priya.n@avg.com', phone: '+91 98123 45678', role: 'State Sales Manager', state: 'Kerala', status: 'Active' },
    { id: 'USR-8903', name: 'Amit Verma', email: 'amit.v@avg.com', phone: '+91 99887 76655', role: 'Regional Coordinator', state: 'Maharashtra', status: 'Inactive' },
    { id: 'USR-8904', name: 'Sneha Patel', email: 'sneha.p@avg.com', phone: '+91 97654 32109', role: 'Operational Admin', state: 'Gujarat', status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Directory</h1>
          <p className="text-xs text-slate-500 mt-1">Manage system operators, assign territories, and configure privileges</p>
        </div>
        <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all">
          <UserPlus className="w-4 h-4" /> Add New User
        </button>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2 bg-white border border-slate-200/80 px-3 py-1.5 rounded-xl text-xs w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input type="text" placeholder="Search by name, email, or role..." className="bg-transparent border-none outline-none w-full text-slate-700" />
          </div>
          <button className="px-3 py-1.5 bg-white border border-slate-200/80 text-slate-600 text-xs font-medium rounded-xl flex items-center gap-2 self-start sm:self-auto hover:bg-slate-50 transition-colors">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> Filter Users
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/30">
                <th className="py-3.5 px-5">User</th>
                <th className="py-3.5 px-5">Contact</th>
                <th className="py-3.5 px-5">Assigned Role</th>
                <th className="py-3.5 px-5">Territory</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-600">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 font-bold text-slate-700 flex items-center justify-center text-xs border border-slate-200/60">
                        {u.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{u.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-slate-600 text-[11px]"><Mail className="w-3 h-3 text-slate-400" />{u.email}</div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px]"><Phone className="w-3 h-3 text-slate-400" />{u.phone}</div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-md text-[10px] font-bold">
                      <Shield className="w-3 h-3 text-blue-500" /> {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-slate-700">
                    <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {u.state}</div>
                  </td>
                  <td className="py-4 px-5">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      u.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {u.status}
                    </span>
                  </td>
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

export default UserManagement;