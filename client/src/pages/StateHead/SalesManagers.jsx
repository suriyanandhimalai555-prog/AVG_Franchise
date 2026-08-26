import React from 'react';

const SalesManagers = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sales Managers Management</h1>
        <p className="text-xs text-slate-500 mt-1">Manage state sales executives and territory assignments</p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm text-xs text-slate-600">
        12 Active Sales Managers assigned across Tamil Nadu districts.
      </div>
    </div>
  );
};

export default SalesManagers;