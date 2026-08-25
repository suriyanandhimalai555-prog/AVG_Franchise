import React, { useState } from 'react';
import { Layers, Plus, UserCheck } from 'lucide-react';
import { AddHierarchyUserModal } from '../../components/Admin/AdminModals';

const HierarchyManagement = () => {
  const [modalState, setModalState] = useState({ open: false, role: 'State Head' });

  const staff = [
    { name: 'Suresh Kumar', role: 'Director', territory: 'South India', email: 'suresh@avg.com' },
    { name: 'Anand Verma', role: 'State Head Coordinator', territory: 'Karnataka & Kerala', email: 'anand@avg.com' },
    { name: 'Kiran Rao', role: 'State Head', territory: 'Karnataka', email: 'kiran@avg.com' },
    { name: 'Mahesh B', role: 'State Sales Manager', territory: 'Bangalore Urban', email: 'mahesh@avg.com' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reporting Hierarchy Staff Directory</h1>
          <p className="text-xs text-slate-500">Manage Directors, Coordinators, State Heads, & Sales Managers</p>
        </div>
        <button onClick={() => setModalState({ open: true, role: 'Staff Member' })} className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/20">
          <Plus className="w-4 h-4" /> Provision Hierarchy Staff
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {staff.map((s, idx) => (
          <div key={idx} className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 font-bold text-[10px] rounded-md border border-blue-100 uppercase">{s.role}</span>
              <h3 className="font-bold text-sm text-slate-800 mt-1">{s.name}</h3>
              <p className="text-xs text-slate-500">{s.email} • <span className="font-bold text-slate-700">{s.territory}</span></p>
            </div>
            <button className="px-3 py-1.5 text-xs border rounded-xl hover:bg-slate-50 font-semibold text-slate-600">Edit Scope</button>
          </div>
        ))}
      </div>

      <AddHierarchyUserModal 
        isOpen={modalState.open} 
        onClose={() => setModalState({ ...modalState, open: false })} 
        roleTitle={modalState.role}
        onSave={() => {}}
      />
    </div>
  );
};

export default HierarchyManagement;