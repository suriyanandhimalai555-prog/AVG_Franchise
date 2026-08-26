import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, Search, Bell } from 'lucide-react';
import SalesManagerSidebar from '../pages/SalesManager/SalesManagerSidebar';

const SalesManagerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-full bg-slate-50 flex overflow-hidden text-slate-800 antialiased">
      {/* Sidebar Navigation */}
      <SalesManagerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl lg:hidden transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Global Search Bar */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 border border-slate-200/80 px-3.5 py-2 rounded-xl text-xs w-72 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:bg-white focus-within:border-blue-400 transition-all">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Search franchises, entries, audits..." 
                className="bg-transparent border-none outline-none text-slate-700 placeholder-slate-400 text-xs w-full"
              />
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Telemetry
            </span>

            <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl relative transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
            </button>

            <div className="h-5 w-px bg-slate-200 mx-1" />

            <div className="flex items-center gap-3 pl-1 cursor-pointer">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-500/20">
                SM
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight">Sales Manager</div>
                <div className="text-[10px] text-slate-400 font-medium">Assigned Territory</div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SalesManagerLayout;